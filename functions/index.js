// ========================================
// Master Valley Cloud Functions (gen2)
// v83: 트리거 제거 → 인라인 처리 (속도 복원)
// ========================================

import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

import { runTransform, runVisionAnalysis } from './transform-logic.js';

initializeApp();
const db = getFirestore();

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
  secrets: ['REPLICATE_API_KEY', 'ANTHROPIC_API_KEY']
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
    const {
      image,
      selectedStyle,
      styles,
      isFullTransform,
      correctionPrompt,
      userId,
      fcmToken,
      lang,
      transformId: clientTransformId,
      sessionId: clientSessionId,
      transformIds: clientTransformIds
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
      transformId: clientTransformId
    });
    
  } catch (error) {
    console.error('startTransform 에러:', error);
    res.status(500).json({ error: error.message });
  }
}

// ========================================
// 리전별 배포 (동일 핸들러, 다른 리전)
// ========================================
// 미국/유럽/남미 (en, es, pt, fr, ar, tr)
export const startTransform = onRequest({
  ...FUNCTION_CONFIG,
  region: 'us-central1'
}, handleRequest);

// 아시아 (ko, ja, zh-TW, id, th)
export const startTransformAsia = onRequest({
  ...FUNCTION_CONFIG,
  region: 'asia-northeast1'
}, handleRequest);

// ========================================
// 단일 변환 처리
// ========================================
async function handleSingle(req, res, params) {
  const {
    image, selectedStyle, correctionPrompt,
    userId, fcmToken, lang, transformId
  } = params;
  
  if (!selectedStyle || !selectedStyle.name || !selectedStyle.category) {
    return res.status(400).json({ error: 'Invalid style' });
  }
  
  const docRef = db.collection('transforms').doc(transformId);
  
  await docRef.set({
    status: 'processing',
    selectedStyle,
    correctionPrompt: correctionPrompt || null,
    userId: userId || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  
  console.log(`🚀 단일 변환 시작: ${transformId} (${selectedStyle.category}/${selectedStyle.name})`);
  
  try {
    const result = await runTransform(image, selectedStyle, correctionPrompt);
    
    console.log(`✅ 단일 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);
    
    await docRef.update({
      status: 'completed',
      resultUrl: result.resultUrl,
      selectedArtist: result.selectedArtist || null,
      selectedWork: result.selectedWork || null,
      selectionMethod: result.selectionMethod || null,
      subjectType: result.subjectType || null,
      isRetransform: result.isRetransform || false,
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    if (fcmToken) {
      const body = buildSingleFCMBody(lang, selectedStyle.category, result.selectedArtist, selectedStyle.name);
      sendFCM(fcmToken, {
        title: 'Master Valley',
        body,
        data: { transformId, type: 'transform_complete' }
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
      isRetransform: result.isRetransform || false
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
    updatedAt: FieldValue.serverTimestamp()
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
      updatedAt: FieldValue.serverTimestamp()
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
  
  const results = await Promise.all(
    styles.map(async (style, i) => {
      const tid = transformIds[i];
      const docRef = db.collection('transforms').doc(tid);
      
      try {
        const result = await runTransform(image, style, null, true, visionData);
        
        console.log(`✅ 원클릭 [${i + 1}/${totalCount}] 완료: ${tid} | ${result.selectedArtist || style.name}`);
        
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
  
  console.log(`🏁 원클릭 세션 완료: ${sessionId} (${successCount}/${totalCount} 성공)`);
  
  await sessionRef.update({
    status: 'completed',
    completedAt: FieldValue.serverTimestamp()
  });
  
  if (fcmToken) {
    const body = buildOneclickFCMBody(lang, category);
    sendFCM(fcmToken, {
      title: 'Master Valley',
      body,
      data: { sessionId, type: 'oneclick_complete' }
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
function sendFCM(token, { title, body, data }) {
  getMessaging().send({
    token,
    notification: { title, body },
    data: data || {}
  }).then(() => {
    console.log(`📱 FCM 전송 완료`);
  }).catch((err) => {
    console.warn(`⚠️ FCM 전송 실패: ${err.message}`);
  });
}
