// ========================================
// Master Valley Cloud Functions (gen2)
// v83: 트리거 제거 → 인라인 처리 (속도 복원)
// ========================================
// startTransform 하나가 모든 것을 처리:
//   단일: HTTP 함수 내에서 직접 변환 → 결과 즉시 반환 (8~14초)
//   원클릭: 병렬 Promise.all → Firestore에 개별 결과 기록 → FCM
// processTransform (Firestore 트리거) 완전 제거 — 트리거 지연+콜드스타트 제거
// ========================================

import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

import { runTransform } from './transform-logic.js';

initializeApp();
const db = getFirestore();

// ========================================
// startTransform — 단일 + 원클릭 통합
// ========================================
export const startTransform = onRequest({
  cors: true,
  timeoutSeconds: 540,   // 9분 (변환 시간 충분)
  memory: '1GiB',
  region: 'us-central1',
  secrets: ['REPLICATE_API_KEY', 'ANTHROPIC_API_KEY']
}, async (req, res) => {
  
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
      fcmMessage,
      // 클라이언트가 미리 생성한 ID (복원 및 Firestore 리스닝용)
      transformId: clientTransformId,
      sessionId: clientSessionId,
      transformIds: clientTransformIds
    } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image' });
    }
    
    // ========================================
    // 원클릭: 병렬 처리
    // ========================================
    if (isFullTransform && styles && styles.length > 0) {
      return await handleOneClick(req, res, {
        image, styles, selectedStyle,
        userId, fcmToken, fcmMessage,
        sessionId: clientSessionId,
        transformIds: clientTransformIds
      });
    }
    
    // ========================================
    // 단일 변환: 인라인 처리 → HTTP 응답으로 결과 반환
    // ========================================
    return await handleSingle(req, res, {
      image, selectedStyle, correctionPrompt,
      userId, fcmToken, fcmMessage,
      transformId: clientTransformId
    });
    
  } catch (error) {
    console.error('startTransform 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// 단일 변환 처리
// ========================================
async function handleSingle(req, res, params) {
  const {
    image, selectedStyle, correctionPrompt,
    userId, fcmToken, fcmMessage, transformId
  } = params;
  
  if (!selectedStyle || !selectedStyle.name || !selectedStyle.category) {
    return res.status(400).json({ error: 'Invalid style' });
  }
  
  const docRef = db.collection('transforms').doc(transformId);
  
  // 1. Firestore에 pending 기록 (복원용, 이미지 저장 안 함)
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
    // 2. 직접 변환 실행 (트리거 대기 0초, 콜드스타트 0초)
    const result = await runTransform(image, selectedStyle, correctionPrompt);
    
    console.log(`✅ 단일 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);
    
    // 3. Firestore에 결과 저장 (복원용)
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
    
    // 4. FCM (선택적)
    if (fcmToken) {
      sendFCM(fcmToken, {
        title: 'Master Valley',
        body: fcmMessage || (result.selectedArtist 
          ? `${result.selectedArtist} 스타일 변환이 완료되었습니다!`
          : '변환이 완료되었습니다!'),
        data: { transformId, type: 'transform_complete' }
      });
    }
    
    // 5. HTTP 응답으로 결과 즉시 반환 (클라이언트 Firestore 리스닝 불필요)
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
      sendFCM(fcmToken, {
        title: 'Master Valley',
        body: '변환 중 오류가 발생했습니다. 다시 시도해 주세요.',
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
    userId, fcmToken, fcmMessage,
    sessionId, transformIds
  } = params;
  
  const totalCount = styles.length;
  
  // 1. 세션 + 개별 변환 문서 batch 생성
  const batch = db.batch();
  
  const sessionRef = db.collection('oneclick_sessions').doc(sessionId);
  batch.set(sessionRef, {
    userId: userId || null,
    totalCount,
    completedCount: 0,
    successCount: 0,
    transformIds,
    fcmToken: fcmToken || null,
    fcmMessage: fcmMessage || null,
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
  
  // 2. 모든 변환 병렬 실행
  let completedCount = 0;
  let successCount = 0;
  
  const results = await Promise.all(
    styles.map(async (style, i) => {
      const tid = transformIds[i];
      const docRef = db.collection('transforms').doc(tid);
      
      try {
        const result = await runTransform(image, style, null);
        
        console.log(`✅ 원클릭 [${i + 1}/${totalCount}] 완료: ${tid} | ${result.selectedArtist || style.name}`);
        
        // 개별 결과 Firestore 기록 (클라이언트 리스닝용)
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
        
        // 세션 카운트 업데이트
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
  
  // 3. 세션 완료
  console.log(`🏁 원클릭 세션 완료: ${sessionId} (${successCount}/${totalCount} 성공)`);
  
  await sessionRef.update({
    status: 'completed',
    completedAt: FieldValue.serverTimestamp()
  });
  
  // 4. FCM 1회
  if (fcmToken) {
    sendFCM(fcmToken, {
      title: 'Master Valley',
      body: fcmMessage || `${successCount}/${totalCount}건 변환이 완료되었습니다!`,
      data: { sessionId, type: 'oneclick_complete' }
    });
  }
  
  // 5. HTTP 응답
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
