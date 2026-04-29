// ========================================
// Master Valley Cloud Functions (gen2)
// v83: 트리거 제거 → 인라인 처리 (속도 복원)
// ========================================

import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { createHash } from 'crypto';

import { runTransform, runVisionAnalysis } from './transform-logic.js';

initializeApp();
const db = getFirestore();

// ========================================
// 이메일 해시 헬퍼 (어뷰징 방지: 삭제 후 재가입 시 무료 크레딧 차단)
// ========================================
const HASH_SALT = 'mv_2026_xK9pQ3vL8nR5';
function hashEmail(email) {
  if (!email) return null;
  return createHash('sha256').update(email.toLowerCase().trim() + HASH_SALT).digest('hex');
}

const INITIAL_FREE_CREDITS = 0.30;

// ========================================
// A-2: Firebase Auth 토큰 검증
// ========================================
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (err) {
    console.warn('⚠️ 토큰 검증 실패:', err.message);
    return null;
  }
}

// ========================================
// 크레딧 비용 산정 + 서버 차감
// ========================================
function getTransformCost(style, isRetransform) {
  if (isRetransform) return 0.10;
  return style.category === 'masters' ? 0.25 : 0.20;
}

function getOneClickCost(category) {
  if (category === 'movements') return 1.99;
  if (category === 'masters') return 1.50;
  if (category === 'oriental') return 0.50;
  return 1.99;
}

async function deductCredit(userId, deductionKey, cost) {
  if (!userId) return;
  const userRef = db.collection('users').doc(userId);
  const txRef = db.collection('transactions').doc(deductionKey);
  
  await db.runTransaction(async (transaction) => {
    const txDoc = await transaction.get(txRef);
    if (txDoc.exists) {
      console.log(`💰 이미 차감됨 (멱등성): ${deductionKey}`);
      return;
    }
    const userDoc = await transaction.get(userRef);
    const currentBalance = userDoc.data()?.credits || 0;
    const newBalance = Math.round((currentBalance - cost) * 100) / 100;
    
    transaction.update(userRef, {
      credits: newBalance,
      lastTransaction: FieldValue.serverTimestamp()
    });
    transaction.set(txRef, {
      userId, cost,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      timestamp: FieldValue.serverTimestamp()
    });
  });
  console.log(`💰 서버 크레딧 차감: ${userId} | $${cost} | ${deductionKey}`);
}

// ========================================
// v97: 안전 차감 래퍼 (Firestore 장애 등으로 차감 실패 시 장부 기록)
// - 차감 성공: 정상 진행
// - 차감 실패: failed_deductions 컬렉션에 기록 → 유저에게는 결과 제공
//   → 나중에 수동 or 배치로 복구
// - Replicate 비용 이미 발생했으므로 유저에게 결과 제공이 비즈니스상 최선
// ========================================
async function safeDeductCredit(userId, deductionKey, cost, context = {}) {
  if (!userId) return { success: true, skipped: true };
  
  try {
    await deductCredit(userId, deductionKey, cost);
    return { success: true };
  } catch (err) {
    console.error(`🚨 CRITICAL: 크레딧 차감 실패 - 장부 기록`, {
      userId,
      deductionKey,
      cost,
      error: err.message,
      context
    });
    
    // failed_deductions 장부에 기록 (복구용)
    try {
      await db.collection('failed_deductions').doc(deductionKey).set({
        userId,
        deductionKey,
        cost,
        errorMessage: err.message,
        context,              // { type: 'single' | 'oneclick', category, ... }
        status: 'pending',    // 'pending' | 'recovered' | 'waived'
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      console.log(`📒 장부 기록 완료: ${deductionKey} | $${cost}`);
    } catch (ledgerErr) {
      // 장부 기록도 실패 — Firestore 전체 장애 가능성. 로그만 남김.
      console.error(`🚨 장부 기록도 실패 (Firestore 전체 장애 의심): ${ledgerErr.message}`);
    }
    
    // 비즈니스 결정: 차감 실패해도 유저에게 결과는 제공
    return { success: false, failed: true };
  }
}

// ========================================
// FCM 메시지 i18n (11개 언어)
// ========================================
const FCM_MESSAGES = {
  ko: {
    singleMovement: (name) => `${name} 거장의 작업이 완료되었습니다`,
    singleMaster: (name) => `${name}의 작업이 완료되었습니다`,
    singleOriental: (name) => `${name} 거장의 작업이 완료되었습니다`,
    oneclickMovements: '11개 미술사조 거장의 작업이 완료되었습니다',
    oneclickMasters: '7인 거장의 작업이 완료되었습니다',
    oneclickOriental: '동양화 거장의 작업이 완료되었습니다',
    failed: '변환 중 오류가 발생했습니다. 다시 시도해 주세요.'
  },
  en: {
    singleMovement: (name) => `A ${name} master's work is complete`,
    singleMaster: (name) => `${name}'s work is complete`,
    singleOriental: (name) => `A ${name} master's work is complete`,
    oneclickMovements: '11 art movement masters\' work is complete',
    oneclickMasters: '7 masters\' work is complete',
    oneclickOriental: 'East Asian masters\' work is complete',
    failed: 'An error occurred. Please try again.'
  },
  ja: {
    singleMovement: (name) => `${name}の巨匠の作品が完成しました`,
    singleMaster: (name) => `${name}の作品が完成しました`,
    singleOriental: (name) => `${name}の巨匠の作品が完成しました`,
    oneclickMovements: '11の美術様式の巨匠の作品が完成しました',
    oneclickMasters: '7人の巨匠の作品が完成しました',
    oneclickOriental: '東洋画の巨匠の作品が完成しました',
    failed: '変換中にエラーが発生しました。もう一度お試しください。'
  },
  es: {
    singleMovement: (name) => `La obra del maestro de ${name} está lista`,
    singleMaster: (name) => `La obra de ${name} está lista`,
    singleOriental: (name) => `La obra del maestro de ${name} está lista`,
    oneclickMovements: 'La obra de los maestros de 11 movimientos está lista',
    oneclickMasters: 'La obra de los 7 maestros está lista',
    oneclickOriental: 'La obra de los maestros orientales está lista',
    failed: 'Ocurrió un error. Inténtalo de nuevo.'
  },
  fr: {
    singleMovement: (name) => `L'œuvre du maître ${name} est terminée`,
    singleMaster: (name) => `L'œuvre de ${name} est terminée`,
    singleOriental: (name) => `L'œuvre du maître ${name} est terminée`,
    oneclickMovements: 'L\'œuvre des maîtres de 11 mouvements est terminée',
    oneclickMasters: 'L\'œuvre des 7 maîtres est terminée',
    oneclickOriental: 'L\'œuvre des maîtres d\'Asie est terminée',
    failed: 'Une erreur est survenue. Veuillez réessayer.'
  },
  id: {
    singleMovement: (name) => `Karya maestro ${name} telah selesai`,
    singleMaster: (name) => `Karya ${name} telah selesai`,
    singleOriental: (name) => `Karya maestro ${name} telah selesai`,
    oneclickMovements: 'Karya maestro 11 aliran seni telah selesai',
    oneclickMasters: 'Karya 7 maestro telah selesai',
    oneclickOriental: 'Karya maestro Asia Timur telah selesai',
    failed: 'Terjadi kesalahan. Silakan coba lagi.'
  },
  pt: {
    singleMovement: (name) => `A obra do mestre de ${name} está pronta`,
    singleMaster: (name) => `A obra de ${name} está pronta`,
    singleOriental: (name) => `A obra do mestre de ${name} está pronta`,
    oneclickMovements: 'A obra dos mestres de 11 movimentos está pronta',
    oneclickMasters: 'A obra dos 7 mestres está pronta',
    oneclickOriental: 'A obra dos mestres orientais está pronta',
    failed: 'Ocorreu um erro. Tente novamente.'
  },
  ar: {
    singleMovement: (name) => `اكتمل عمل أستاذ ${name}`,
    singleMaster: (name) => `اكتمل عمل ${name}`,
    singleOriental: (name) => `اكتمل عمل أستاذ ${name}`,
    oneclickMovements: 'اكتمل عمل أساتذة 11 حركة فنية',
    oneclickMasters: 'اكتمل عمل 7 أساتذة',
    oneclickOriental: 'اكتمل عمل أساتذة الفن الشرقي',
    failed: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
  },
  tr: {
    singleMovement: (name) => `${name} ustasının çalışması tamamlandı`,
    singleMaster: (name) => `${name} çalışması tamamlandı`,
    singleOriental: (name) => `${name} ustasının çalışması tamamlandı`,
    oneclickMovements: '11 sanat akımı ustasının çalışması tamamlandı',
    oneclickMasters: '7 ustanın çalışması tamamlandı',
    oneclickOriental: 'Doğu Asya ustalarının çalışması tamamlandı',
    failed: 'Bir hata oluştu. Lütfen tekrar deneyin.'
  },
  th: {
    singleMovement: (name) => `ผลงานของปรมาจารย์ ${name} เสร็จสมบูรณ์แล้ว`,
    singleMaster: (name) => `ผลงานของ ${name} เสร็จสมบูรณ์แล้ว`,
    singleOriental: (name) => `ผลงานของปรมาจารย์ ${name} เสร็จสมบูรณ์แล้ว`,
    oneclickMovements: 'ผลงานของปรมาจารย์ 11 สไตล์ เสร็จสมบูรณ์แล้ว',
    oneclickMasters: 'ผลงานของปรมาจารย์ 7 ท่าน เสร็จสมบูรณ์แล้ว',
    oneclickOriental: 'ผลงานของปรมาจารย์เอเชียตะวันออก เสร็จสมบูรณ์แล้ว',
    failed: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง'
  },
  'zh-TW': {
    singleMovement: (name) => `${name}大師的作品已完成`,
    singleMaster: (name) => `${name}的作品已完成`,
    singleOriental: (name) => `${name}大師的作品已完成`,
    oneclickMovements: '11個藝術流派大師的作品已完成',
    oneclickMasters: '7位大師的作品已完成',
    oneclickOriental: '東方繪畫大師的作品已完成',
    failed: '轉換過程中發生錯誤，請重試。'
  }
};

function getMessages(lang) {
  return FCM_MESSAGES[lang] || FCM_MESSAGES['en'];
}

// 단일 변환 FCM 메시지 생성
function buildSingleFCMBody(lang, category, artistName, styleName) {
  const m = getMessages(lang);
  
  if (category === 'movements') return m.singleMovement(styleName || artistName || '');
  if (category === 'masters') return m.singleMaster(artistName || styleName || '');
  if (category === 'oriental') return m.singleOriental(styleName || artistName || '');
  return m.singleMaster(artistName || styleName || ''); // fallback
}

// 원클릭 FCM 메시지 생성
function buildOneclickFCMBody(lang, category) {
  const m = getMessages(lang);
  
  if (category === 'movements') return m.oneclickMovements;
  if (category === 'masters') return m.oneclickMasters;
  if (category === 'oriental') return m.oneclickOriental;
  return m.oneclickMovements; // fallback
}

// ========================================
// startTransform — 단일 + 원클릭 통합
// ========================================
// ========================================
// 공통 함수 설정
// ========================================
const FUNCTION_CONFIG = {
  cors: true,
  timeoutSeconds: 540,
  memory: '1GiB',
  secrets: ['REPLICATE_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY']
};

// 공통 핸들러
async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // A-2: Firebase Auth 토큰 검증 → userId를 토큰에서 추출
    const userId = await verifyAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: invalid or missing auth token' });
    }
    
    const {
      image,
      selectedStyle,
      styles,
      isFullTransform,
      correctionPrompt,
      fcmToken,
      lang,
      transformId: clientTransformId,
      sessionId: clientSessionId,
      transformIds: clientTransformIds,
      isRetry,                    // v94: 실패 재시도 플래그 (크레딧 차감 스킵)
      originalTransformId         // v94: 재시도 대상 원본 transformId (검증용)
    } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image' });
    }
    
    if (isFullTransform && styles && styles.length > 0) {
      return await handleOneClick(req, res, {
        image, styles, selectedStyle,
        userId, fcmToken, lang: lang || 'en',
        sessionId: clientSessionId,
        transformIds: clientTransformIds
      });
    }
    
    return await handleSingle(req, res, {
      image, selectedStyle, correctionPrompt,
      userId, fcmToken, lang: lang || 'en',
      transformId: clientTransformId,
      isRetry: !!isRetry,
      originalTransformId: originalTransformId || null
    });
    
  } catch (error) {
    console.error('startTransform 에러:', error);
    res.status(500).json({ error: error.message });
  }
}

// ========================================
// Cloud Functions 배포 (us-central1 통합)
// Replicate/Anthropic API가 US에 있어 us-central1이 최적
// ========================================
export const startTransform = onRequest({
  ...FUNCTION_CONFIG,
  region: 'us-central1'
}, handleRequest);

// startTransformAsia 제거됨 — asia-northeast1 경유 시 오히려 느림 (A-7)
// 배포 후 firebase functions:delete startTransformAsia --region asia-northeast1 실행 필요

// ========================================
// 단일 변환 처리
// ========================================
async function handleSingle(req, res, params) {
  const {
    image, selectedStyle, correctionPrompt,
    userId, fcmToken, lang, transformId,
    isRetry = false,
    originalTransformId = null
  } = params;
  
  if (!selectedStyle || !selectedStyle.name || !selectedStyle.category) {
    return res.status(400).json({ error: 'Invalid style' });
  }
  
  // v94: 재시도 요청 검증 (어뷰징 방어)
  // v99 (#3): originalTransformId가 null이어도 최근 completed 자동 검색 (state 손실 복구)
  let retryValidated = false;
  let retryNeedsCharge = false;  // v98: 원본이 failed면 재시도 성공 시에도 차감 필요
  let resolvedOriginalTid = originalTransformId;  // v99: 자동 검색 결과 저장
  
  if (isRetry) {
    // v99: originalTransformId 없으면 → 최근 10분 같은 사용자/스타일의 completed 자동 검색
    if (!resolvedOriginalTid) {
      try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentSnap = await db.collection('transforms')
          .where('userId', '==', userId)
          .where('styleId', '==', selectedStyle.id || '')
          .where('status', '==', 'completed')
          .where('createdAt', '>=', tenMinutesAgo)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
        
        if (!recentSnap.empty) {
          resolvedOriginalTid = recentSnap.docs[0].id;
          console.log(`🔍 v99 retry 자동 검색 성공: ${userId} | style=${selectedStyle.id} | 발견 tid=${resolvedOriginalTid}`);
        } else {
          // 검색 결과 없음 → 정상 새 변환 흐름으로 fallback (isRetry 무효화)
          console.log(`🔍 v99 retry 자동 검색 실패 (최근 completed 없음): ${userId} | style=${selectedStyle.id} → 정상 결제 흐름으로 fallback`);
          // isRetry를 false로 만들어 정상 흐름 진입
          // 변수명은 이미 const라 새 변수에 결과 저장만 함
        }
      } catch (e) {
        console.error('v99 retry 자동 검색 실패:', e);
        // 검색 실패해도 정상 새 변환으로 fallback (사용자 차단 X)
      }
    }
    
    // resolvedOriginalTid가 있을 때만 retry 검증 진행
    if (resolvedOriginalTid) {
      try {
        const origRef = db.collection('transforms').doc(resolvedOriginalTid);
        const origSnap = await origRef.get();
        if (!origSnap.exists) {
          return res.status(400).json({ error: 'Original transform not found' });
        }
        const origData = origSnap.data();
        if (origData.userId !== userId) {
          console.warn(`⚠️ Retry 어뷰징 시도: ${userId}가 ${origData.userId}의 transformId 접근`);
          return res.status(403).json({ error: 'Unauthorized retry' });
        }
        // 재시도 카운터 (서버측 이중 방어)
        const retryCount = origData.retryCount || 0;
        if (retryCount >= 3) {
          return res.status(429).json({ error: 'Retry limit exceeded (max 3)' });
        }
        // v98: 원본이 failed면 한 번도 차감 안 된 상태 → 재시도 성공 시 차감 필요
        //      원본이 completed면 이미 차감됨 → 재시도는 무료
        retryNeedsCharge = (origData.status === 'failed');
        
        await origRef.update({
          retryCount: retryCount + 1,
          lastRetryAt: FieldValue.serverTimestamp()
        });
        retryValidated = true;
        console.log(`🔁 재시도 승인: ${userId} | 원본 ${resolvedOriginalTid} (${retryCount + 1}/3) | 차감필요: ${retryNeedsCharge}`);
      } catch (e) {
        console.error('Retry 검증 실패:', e);
        return res.status(500).json({ error: 'Retry validation failed' });
      }
    }
    // resolvedOriginalTid가 null이면 → 정상 새 변환 흐름으로 진행 (retryValidated=false 유지)
  }
  
  const docRef = db.collection('transforms').doc(transformId);
  
  // 멱등성 체크: 이미 완료된 변환이면 중복 처리 건너뜀
  const existing = await docRef.get();
  if (existing.exists && existing.data().status === 'completed') {
    // v98: 소유권 검증 - 타 유저의 transformId로 결과 접근 차단
    const existingUserId = existing.data().userId;
    if (existingUserId && existingUserId !== userId) {
      console.warn(`🚨 소유권 위반 시도: ${userId}가 ${existingUserId}의 transformId(${transformId}) 접근`);
      return res.status(403).json({ error: 'Forbidden: transformId belongs to another user' });
    }
    
    console.log(`⏭️ 이미 완료된 변환, 건너뜀: ${transformId}`);
    return res.status(200).json({
      transformId,
      status: 'completed',
      resultUrl: existing.data().resultUrl,
      selectedArtist: existing.data().selectedArtist || null,
      selectedWork: existing.data().selectedWork || null,
      duplicate: true,
      wasRetry: retryValidated  // v94 safety
    });
  }
  
  await docRef.set({
    status: 'processing',
    selectedStyle,
    correctionPrompt: correctionPrompt || null,
    userId: userId || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    expireAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))  // F-3: 30일 후 TTL 삭제
  });
  
  console.log(`🚀 단일 변환 시작: ${transformId} (${selectedStyle.category}/${selectedStyle.name})`);
  
  try {
    const result = await runTransform(image, selectedStyle, correctionPrompt);
    
    console.log(`✅ 단일 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);
    
    // 💰 서버 크레딧 차감
    // v98: 재시도여도 원본이 failed(=한 번도 차감 안 됨)면 차감
    //       "결과물 받으면 차감" 원칙
    if (!retryValidated || retryNeedsCharge) {
      const cost = getTransformCost(selectedStyle, result.isRetransform);
      await safeDeductCredit(userId, transformId, cost, {
        type: 'single',
        category: selectedStyle.category,
        styleName: selectedStyle.name,
        isRetransform: !!result.isRetransform,
        isRetryCharge: retryNeedsCharge  // 로그용: 재시도 차감 여부 기록
      });
      if (retryNeedsCharge) {
        console.log(`💰 재시도지만 원본 failed → 차감 실행: ${transformId}`);
      }
    } else {
      console.log(`💰 재시도 + 원본 이미 차감됨 → 스킵: ${transformId}`);
    }
    
    await docRef.update({
      status: 'completed',
      resultUrl: result.resultUrl,
      selectedArtist: result.selectedArtist || null,
      selectedWork: result.selectedWork || null,
      selectionMethod: result.selectionMethod || null,
      subjectType: result.subjectType || null,
      isRetransform: result.isRetransform || false,
      wasRetry: retryValidated,  // v98: 클라이언트 안전장치 #2가 읽어서 구버전 서버 감지
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    if (fcmToken) {
      const body = buildSingleFCMBody(lang, selectedStyle.category, result.selectedArtist, selectedStyle.name);
      sendFCM(fcmToken, {
        title: 'Master Valley',
        body,
        data: { transformId, type: 'transform_complete' },
        imageUrl: result.resultUrl  // 알림에 결과 이미지 미리보기
      });
    }
    
    return res.status(200).json({
      transformId,
      status: 'completed',
      resultUrl: result.resultUrl,
      selectedArtist: result.selectedArtist || null,
      selectedWork: result.selectedWork || null,
      selectionMethod: result.selectionMethod || null,
      subjectType: result.subjectType || null,
      isRetransform: result.isRetransform || false,
      wasRetry: retryValidated  // v94 safety: 클라이언트가 서버 버전 확인 가능
    });
    
  } catch (error) {
    console.error(`❌ 단일 변환 실패: ${transformId}`, error);
    
    await docRef.update({
      status: 'failed',
      error: error.message,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    if (fcmToken) {
      const m = getMessages(lang);
      sendFCM(fcmToken, {
        title: 'Master Valley',
        body: m.failed,
        data: { transformId, type: 'transform_failed' }
      });
    }
    
    return res.status(500).json({
      transformId,
      status: 'failed',
      error: error.message
    });
  }
}

// ========================================
// 원클릭 병렬 처리
// ========================================
async function handleOneClick(req, res, params) {
  const {
    image, styles, selectedStyle,
    userId, fcmToken, lang,
    sessionId, transformIds
  } = params;
  
  const totalCount = styles.length;
  const category = selectedStyle?.category || styles[0]?.category;
  
  const batch = db.batch();
  
  const sessionRef = db.collection('oneclick_sessions').doc(sessionId);

  // v24: 멱등성 체크 - 이미 완료된 세션이면 중복 처리 건너뜀 (Cloud Run 자동 retry 대응)
  //   단독 변환과 동일한 패턴 (L394~414)
  //   FCM 알림 중복 방지 (정우 부모님 폰 8:07/8:09 케이스 해결)
  const existingSession = await sessionRef.get();
  if (existingSession.exists && existingSession.data().status === 'completed') {
    // 소유권 검증
    const existingUserId = existingSession.data().userId;
    if (existingUserId && existingUserId !== userId) {
      console.warn(`🚨 소유권 위반 시도: ${userId}가 ${existingUserId}의 sessionId(${sessionId}) 접근`);
      return res.status(403).json({ error: 'Forbidden: sessionId belongs to another user' });
    }

    console.log(`⏭️ 이미 완료된 원클릭 세션, 건너뜀: ${sessionId}`);
    return res.status(200).json({
      sessionId,
      status: 'completed',
      duplicate: true
    });
  }

  const expireAt = Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));  // F-3: 30일 후 TTL 삭제
  batch.set(sessionRef, {
    userId: userId || null,
    totalCount,
    completedCount: 0,
    successCount: 0,
    transformIds,
    fcmToken: fcmToken || null,
    selectedStyle: selectedStyle || null,
    status: 'processing',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    expireAt
  });
  
  for (let i = 0; i < totalCount; i++) {
    const docRef = db.collection('transforms').doc(transformIds[i]);
    batch.set(docRef, {
      status: 'processing',
      selectedStyle: styles[i],
      userId: userId || null,
      sessionId,
      styleIndex: i,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      expireAt
    });
  }
  
  await batch.commit();
  console.log(`📋 원클릭 세션 생성: ${sessionId} (${totalCount}건)`);
  
  // v84: Vision 분석 1회 (Sonnet) → 전체 스타일에 재사용
  let visionData = null;
  try {
    visionData = await runVisionAnalysis(image);
    if (visionData) {
      console.log(`🔍 원클릭 Vision 1회 완료: ${visionData.subject_type}, ${visionData.gender || 'N/A'}, ${visionData.person_count || 0}명`);
    }
  } catch (err) {
    console.warn(`⚠️ Vision 사전분석 실패 (각 변환에서 개별 분석): ${err.message}`);
  }
  
  let completedCount = 0;
  let successCount = 0;
  
  const BATCH_SIZE = 5;
  const sessionStart = Date.now();
  const results = new Array(totalCount).fill(null);
  
  // ========== FLUX 변환 (배치 순서대로) ==========
  for (let batchStart = 0; batchStart < totalCount; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, totalCount);
    const batchIndices = [];
    for (let i = batchStart; i < batchEnd; i++) batchIndices.push(i);
    
    const batchResults = await Promise.all(
      batchIndices.map(async (i) => {
        const style = styles[i];
        const tid = transformIds[i];
        const docRef = db.collection('transforms').doc(tid);
        
        try {
          const result = await runTransform(image, style, null, true, visionData);
          
          await docRef.update({
            status: 'completed',
            resultUrl: result.resultUrl,
            selectedArtist: result.selectedArtist || null,
            selectedWork: result.selectedWork || null,
            selectionMethod: result.selectionMethod || null,
            subjectType: result.subjectType || null,
            isRetransform: false,
            completedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });
          
          completedCount++;
          successCount++;
          
          await sessionRef.update({
            completedCount: FieldValue.increment(1),
            successCount: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
          });
          
          console.log(`✅ 원클릭 [${i + 1}/${totalCount}] 완료: ${tid} | ${result.selectedArtist || style.name}`);
          
          return {
            transformId: tid,
            styleIndex: i,
            status: 'completed',
            resultUrl: result.resultUrl,
            selectedArtist: result.selectedArtist || null,
            selectedWork: result.selectedWork || null,
            selectionMethod: result.selectionMethod || null,
            subjectType: result.subjectType || null
          };
          
        } catch (error) {
          console.error(`❌ 원클릭 [${i + 1}/${totalCount}] 실패: ${tid}`, error);
          
          await docRef.update({
            status: 'failed',
            error: error.message,
            updatedAt: FieldValue.serverTimestamp()
          });
          
          completedCount++;
          
          await sessionRef.update({
            completedCount: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
          });
          
          return {
            transformId: tid,
            styleIndex: i,
            status: 'failed',
            error: error.message
          };
        }
      })
    );
    
    batchResults.forEach(r => { results[r.styleIndex] = r; });
    console.log(`📦 배치 ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(totalCount / BATCH_SIZE)} 완료 (${completedCount}/${totalCount})`);
  }
  
  const sessionElapsed = ((Date.now() - sessionStart) / 1000).toFixed(1);
  console.log(`🏁 원클릭 세션 완료: ${sessionId} (${successCount}/${totalCount} 성공, ${sessionElapsed}초)`);
  
  // 💰 원클릭 세트 크레딧 차감 (1건 이상 성공 시 / v97: 안전 래퍼 적용)
  if (successCount >= 1) {
    const oneClickCost = getOneClickCost(category);
    await safeDeductCredit(userId, sessionId, oneClickCost, {
      type: 'oneclick',
      category,
      totalCount,
      successCount
    });
  }
  
  await sessionRef.update({
    status: 'completed',
    completedAt: FieldValue.serverTimestamp()
  });
  
  if (fcmToken) {
    const body = buildOneclickFCMBody(lang, category);
    const successResults = results.filter(r => r.status === 'completed' && r.resultUrl);
    const randomSuccess = successResults.length > 0 
      ? successResults[Math.floor(Math.random() * successResults.length)] 
      : null;
    sendFCM(fcmToken, {
      title: 'Master Valley',
      body,
      data: { sessionId, type: 'oneclick_complete' },
      imageUrl: randomSuccess?.resultUrl || null  // 랜덤 성공 결과 미리보기
    });
  }
  
  return res.status(200).json({
    sessionId,
    status: 'completed',
    totalCount,
    successCount,
    results
  });
}

// ========================================
// FCM 유틸 (fire-and-forget)
// ========================================
function sendFCM(token, { title, body, data, imageUrl }) {
  const notification = { title, body };
  if (imageUrl) {
    notification.image = imageUrl;
    console.log(`🖼️ FCM 이미지 URL: ${imageUrl.substring(0, 80)}...`);
  }
  
  const androidConfig = { priority: 'high' };
  if (imageUrl) {
    androidConfig.notification = { image: imageUrl };  // 안드로이드 전용 이미지 설정
  }
  
  getMessaging().send({
    token,
    notification,
    android: androidConfig,
    data: data || {}
  }).then(() => {
    console.log(`📱 FCM 전송 완료`);
  }).catch((err) => {
    console.warn(`⚠️ FCM 전송 실패: ${err.message}`);
  });
}

// ========================================
// A-6: 좀비 세션 정리 (매일 새벽 실행)
// processing 상태로 1시간 이상 방치된 세션/변환을 timeout으로 변경
// ========================================
export const dailyCleanup = onSchedule({
  schedule: 'every day 19:00',  // UTC 19:00 = KST 04:00
  timeZone: 'UTC',
  region: 'us-central1',
  memory: '256MiB',
  timeoutSeconds: 120
}, async (event) => {
  const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
  let cleanedSessions = 0;
  let cleanedTransforms = 0;
  
  try {
    // 1) 좀비 oneclick_sessions 정리
    const zombieSessions = await db.collection('oneclick_sessions')
      .where('status', '==', 'processing')
      .where('createdAt', '<=', oneHourAgo)
      .get();
    
    for (const doc of zombieSessions.docs) {
      await doc.ref.update({
        status: 'timeout',
        updatedAt: FieldValue.serverTimestamp()
      });
      cleanedSessions++;
    }
    
    // 2) 좀비 transforms 정리
    const zombieTransforms = await db.collection('transforms')
      .where('status', '==', 'processing')
      .where('createdAt', '<=', oneHourAgo)
      .get();
    
    for (const doc of zombieTransforms.docs) {
      await doc.ref.update({
        status: 'timeout',
        updatedAt: FieldValue.serverTimestamp()
      });
      cleanedTransforms++;
    }
    
    // 3) 익명화된 결제 기록 5년 경과 시 삭제 (한국 전자상거래법 5년 보관 의무 만료)
    let cleanedAnonymizedPurchases = 0;
    const fiveYearsAgo = Timestamp.fromDate(
      new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000)
    );
    const expiredAnonymized = await db.collection('purchases')
      .where('originalUserId_redacted', '==', true)
      .where('anonymizedAt', '<=', fiveYearsAgo)
      .get();
    
    // Batch 삭제 (500개 단위)
    const expiredDocs = expiredAnonymized.docs;
    for (let i = 0; i < expiredDocs.length; i += 500) {
      const batch = db.batch();
      const chunk = expiredDocs.slice(i, i + 500);
      chunk.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      cleanedAnonymizedPurchases += chunk.length;
    }
    
    console.log(`🧹 dailyCleanup 완료: 세션 ${cleanedSessions}건, 변환 ${cleanedTransforms}건 timeout 처리, 만료 익명결제 ${cleanedAnonymizedPurchases}건 삭제`);
  } catch (error) {
    console.error('❌ dailyCleanup 에러:', error);
  }
});

// ========================================
// BLOCKER #48: 계정 삭제 (deleteAccount)
// ========================================
// - 1단계 경고 + 2단계 재인증은 클라이언트에서 처리
// - 클라이언트는 재인증 직후 ID 토큰을 새로 발급받아 호출 (5분 룰)
// - 서버는 verifyAuth로 토큰 검증 후 단계별 삭제 처리
// - 결제 기록(purchases)은 익명화 (한국 전자상거래법 5년 보관)
// - 진행 중 변환 있으면 거부 (사용자에게 변환 완료 후 재시도 안내)
// ========================================
export const deleteAccount = onRequest({
  cors: true,
  timeoutSeconds: 120,
  memory: '512MiB',
  region: 'us-central1'
}, async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 인증 검증 (5분 이내 재인증 토큰 필수)
    const userId = await verifyAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: invalid or missing auth token' });
    }
    
    console.log(`[deleteAccount] 시작: ${userId}`);
    
    // 1) 진행 중 변환 검증 (옵션 3-A: 거부)
    const processingTransforms = await db.collection('transforms')
      .where('userId', '==', userId)
      .where('status', '==', 'processing')
      .limit(1)
      .get();
    
    const processingSessions = await db.collection('oneclick_sessions')
      .where('userId', '==', userId)
      .where('status', '==', 'processing')
      .limit(1)
      .get();
    
    if (!processingTransforms.empty || !processingSessions.empty) {
      console.log(`[deleteAccount] 거부 (진행 중 변환): ${userId}`);
      return res.status(409).json({ 
        error: 'transform_in_progress',
        message: 'A transformation is in progress. Please try again after it completes.'
      });
    }
    
    // 2) 사용자 변환 기록 삭제 (transforms)
    const transformsSnapshot = await db.collection('transforms')
      .where('userId', '==', userId)
      .get();
    
    let deletedTransforms = 0;
    // Firestore batch 한계: 500개. 분할 처리.
    const transformDocs = transformsSnapshot.docs;
    for (let i = 0; i < transformDocs.length; i += 500) {
      const batch = db.batch();
      const chunk = transformDocs.slice(i, i + 500);
      chunk.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      deletedTransforms += chunk.length;
    }
    
    // 3) 원클릭 세션 삭제 (oneclick_sessions)
    const sessionsSnapshot = await db.collection('oneclick_sessions')
      .where('userId', '==', userId)
      .get();
    
    let deletedSessions = 0;
    const sessionDocs = sessionsSnapshot.docs;
    for (let i = 0; i < sessionDocs.length; i += 500) {
      const batch = db.batch();
      const chunk = sessionDocs.slice(i, i + 500);
      chunk.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      deletedSessions += chunk.length;
    }
    
    // 4) 결제 기록 익명화 (옵션 1-A: 법령 보관 의무)
    // userId를 'deleted_${timestamp}_${shortHash}' 로 변경
    // 실제 결제 데이터(금액, 날짜, txId)는 유지 → 회계/세무/분쟁 대응 가능
    const purchasesSnapshot = await db.collection('purchases')
      .where('userId', '==', userId)
      .get();
    
    let anonymizedPurchases = 0;
    if (!purchasesSnapshot.empty) {
      const anonId = `deleted_${Date.now()}_${userId.substring(0, 6)}`;
      const purchaseDocs = purchasesSnapshot.docs;
      for (let i = 0; i < purchaseDocs.length; i += 500) {
        const batch = db.batch();
        const chunk = purchaseDocs.slice(i, i + 500);
        chunk.forEach(doc => {
          batch.update(doc.ref, {
            userId: anonId,
            anonymizedAt: FieldValue.serverTimestamp(),
            originalUserId_redacted: true  // 원본 userId는 명시적으로 제거됨을 표시
          });
        });
        await batch.commit();
        anonymizedPurchases += chunk.length;
      }
    }
    
    // 5) 사용자 문서 삭제 직전 — 이메일 해시 보관 (재가입 어뷰징 방지)
    const userDocSnapshot = await db.collection('users').doc(userId).get();
    const userEmail = userDocSnapshot.exists ? userDocSnapshot.data()?.email : null;
    
    if (userEmail) {
      const emailHash = hashEmail(userEmail);
      if (emailHash) {
        await db.collection('deleted_users').doc(emailHash).set({
          deletedAt: FieldValue.serverTimestamp()
        });
        console.log(`[deleteAccount] 이메일 해시 저장: ${userId}`);
      }
    }
    
    // 5) 사용자 문서 삭제 (users/{uid})
    await db.collection('users').doc(userId).delete();
    
    // 6) Firebase Auth 계정 삭제
    await getAuth().deleteUser(userId);
    
    // 7) 삭제 이력 기록 (감사 추적용 — 분쟁/문의 대응)
    await db.collection('account_deletions').add({
      userId: userId,
      deletedAt: FieldValue.serverTimestamp(),
      stats: {
        transforms: deletedTransforms,
        sessions: deletedSessions,
        purchasesAnonymized: anonymizedPurchases
      }
    });
    
    // Storage results/, retransforms/는 7일 Lifecycle에 맡김 (옵션 2-A)
    // IndexedDB 갤러리는 클라이언트가 삭제 (서버 접근 불가)
    
    console.log(`[deleteAccount] 완료: ${userId} | transforms: ${deletedTransforms}, sessions: ${deletedSessions}, purchases: ${anonymizedPurchases}`);
    
    return res.status(200).json({
      success: true,
      stats: {
        transforms: deletedTransforms,
        sessions: deletedSessions,
        purchasesAnonymized: anonymizedPurchases
      }
    });
    
  } catch (error) {
    console.error('[deleteAccount] 에러:', error);
    return res.status(500).json({ error: 'Internal error during account deletion' });
  }
});

// ========================================
// 신규 가입자 문서 생성 (provisionUser)
// ========================================
// - 기존: 클라이언트(firebase.js ensureUserDoc)가 직접 setDoc
// - 변경: 서버가 처리 (deleted_users 해시 체크 후 무료 크레딧 결정)
// - 어뷰징 방지: 삭제된 계정으로 재가입 시 INITIAL_FREE_CREDITS 미지급
// ========================================
export const provisionUser = onRequest({
  cors: true,
  timeoutSeconds: 30,
  memory: '256MiB',
  region: 'us-central1'
}, async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const email = req.body?.email || '';
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    // 이미 문서 있으면 그대로 반환 (멱등성)
    if (userDoc.exists) {
      return res.status(200).json({ 
        success: true, 
        existing: true,
        credits: userDoc.data()?.credits ?? 0
      });
    }
    
    // 신규 — deleted_users 해시 체크
    let initialCredits = INITIAL_FREE_CREDITS;
    let wasDeleted = false;
    
    if (email) {
      const emailHash = hashEmail(email);
      if (emailHash) {
        const deletedDoc = await db.collection('deleted_users').doc(emailHash).get();
        if (deletedDoc.exists) {
          initialCredits = 0;
          wasDeleted = true;
          console.log(`[provisionUser] 삭제 이력 발견: ${userId} → 0크레딧 지급`);
        }
      }
    }
    
    await userRef.set({
      email: email,
      credits: initialCredits,
      createdAt: new Date().toISOString()
    });
    
    console.log(`[provisionUser] 신규 생성: ${userId} | credits: ${initialCredits} | wasDeleted: ${wasDeleted}`);
    
    return res.status(200).json({
      success: true,
      existing: false,
      credits: initialCredits
    });
    
  } catch (error) {
    console.error('[provisionUser] 에러:', error);
    return res.status(500).json({ error: 'Internal error during user provisioning' });
  }
});
