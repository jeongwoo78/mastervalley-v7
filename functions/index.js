// ========================================
// Master Valley Cloud Functions (gen2)
// 서버 구동 변환 아키텍처
// ========================================
// startTransform: 단일 or 원클릭 요청 → Firestore 저장 → 즉시 반환
// processTransform: Firestore 생성 트리거 → 변환 처리 → 결과 저장
// 원클릭: N개 개별 transforms + 1개 oneclick_sessions로 추적
// ========================================

import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import crypto from 'crypto';

import { runTransform } from './transform-logic.js';

// Firebase Admin 초기화
initializeApp();
const db = getFirestore();

// ========================================
// 1. startTransform — 변환 요청 접수
// ========================================
// 단일: transforms/{id} 1건 생성
// 원클릭: oneclick_sessions/{sessionId} + transforms/{id} N건 batch 생성
//         → 각 문서마다 processTransform 병렬 트리거
// ========================================
export const startTransform = onRequest({
  cors: true,
  timeoutSeconds: 30,
  memory: '256MiB',
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
    const { image, selectedStyle, styles, isFullTransform, correctionPrompt, userId, fcmToken, fcmMessage } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image' });
    }
    
    // ========================================
    // 원클릭: N건 병렬 변환
    // ========================================
    if (isFullTransform && styles && styles.length > 0) {
      const sessionId = crypto.randomUUID();
      const transformIds = [];
      
      // 세션 문서 생성 (전체 추적용)
      await db.collection('oneclick_sessions').doc(sessionId).set({
        userId: userId || null,
        totalCount: styles.length,
        completedCount: 0,
        successCount: 0,
        transformIds: [],
        fcmToken: fcmToken || null,
        fcmMessage: fcmMessage || null,
        selectedStyle: selectedStyle || null,
        status: 'processing',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      
      // N개 개별 변환 문서 batch 생성 → 각각 processTransform 병렬 트리거
      const batch = db.batch();
      for (let i = 0; i < styles.length; i++) {
        const transformId = crypto.randomUUID();
        transformIds.push(transformId);
        
        const docRef = db.collection('transforms').doc(transformId);
        batch.set(docRef, {
          status: 'pending',
          image,
          selectedStyle: styles[i],
          correctionPrompt: null,
          userId: userId || null,
          sessionId,
          styleIndex: i,
          // 개별 FCM 없음 — 세션 완료 시 1회만
          fcmToken: null,
          fcmMessage: null,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      
      // 세션에 transformIds 저장
      batch.update(db.collection('oneclick_sessions').doc(sessionId), {
        transformIds
      });
      
      await batch.commit();
      
      console.log(`📋 원클릭 세션 등록: ${sessionId} (${styles.length}건)`);
      
      return res.status(200).json({
        sessionId,
        transformIds,
        isFullTransform: true,
        status: 'processing'
      });
    }
    
    // ========================================
    // 단일 변환 (기존)
    // ========================================
    if (!selectedStyle) {
      return res.status(400).json({ error: 'Missing style' });
    }
    
    if (!selectedStyle.name || !selectedStyle.category) {
      return res.status(400).json({ error: 'Invalid style structure' });
    }
    
    const transformId = crypto.randomUUID();
    
    await db.collection('transforms').doc(transformId).set({
      status: 'pending',
      image,
      selectedStyle,
      correctionPrompt: correctionPrompt || null,
      userId: userId || null,
      fcmToken: fcmToken || null,
      fcmMessage: fcmMessage || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    console.log(`📋 변환 작업 등록: ${transformId} (${selectedStyle.category}/${selectedStyle.name})`);
    
    res.status(200).json({
      transformId,
      status: 'pending'
    });
    
  } catch (error) {
    console.error('startTransform 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// 2. processTransform — 변환 실행 (Firestore 트리거)
// ========================================
// transforms/{transformId} 문서 생성 시 자동 실행
// 단일/원클릭 개별 건 동일하게 처리 (1건 = 1 Cloud Function)
// 원클릭은 완료 시 세션 카운트 업데이트 → 전부 끝나면 FCM
// ========================================
export const processTransform = onDocumentCreated({
  document: 'transforms/{transformId}',
  timeoutSeconds: 540,
  memory: '1GiB',
  region: 'us-central1',
  secrets: ['REPLICATE_API_KEY', 'ANTHROPIC_API_KEY']
}, async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log('문서 데이터 없음');
    return;
  }
  
  const data = snap.data();
  const transformId = event.params.transformId;
  const docRef = db.collection('transforms').doc(transformId);
  const isOneClick = !!data.sessionId;
  
  console.log(`🚀 변환 처리 시작: ${transformId}${isOneClick ? ` (세션: ${data.sessionId}, #${data.styleIndex})` : ''}`);
  
  try {
    // 상태 업데이트: processing
    await docRef.update({
      status: 'processing',
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // 변환 실행 (Vision → 프롬프트 → Replicate → 폴링)
    const result = await runTransform(
      data.image,
      data.selectedStyle,
      data.correctionPrompt
    );
    
    console.log(`✅ 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);
    
    // 결과 저장 + base64 삭제
    await docRef.update({
      status: 'completed',
      resultUrl: result.resultUrl,
      selectedArtist: result.selectedArtist || null,
      selectedWork: result.selectedWork || null,
      selectionMethod: result.selectionMethod || null,
      subjectType: result.subjectType || null,
      isRetransform: result.isRetransform || false,
      image: FieldValue.delete(),
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // FCM / 세션 업데이트
    if (isOneClick) {
      await handleOneClickCompletion(data.sessionId, true);
    } else {
      await sendSingleFCM(data, transformId, result);
    }
    
  } catch (error) {
    console.error(`❌ 변환 실패: ${transformId}`, error);
    
    await docRef.update({
      status: 'failed',
      error: error.message,
      image: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    if (isOneClick) {
      await handleOneClickCompletion(data.sessionId, false);
    } else {
      await sendSingleFailFCM(data, transformId);
    }
  }
});

// ========================================
// 원클릭 세션 완료 처리
// completedCount 원자적 증가 → 전체 완료 시 FCM 1회
// ========================================
async function handleOneClickCompletion(sessionId, isSuccess) {
  const sessionRef = db.collection('oneclick_sessions').doc(sessionId);
  
  const updateData = {
    completedCount: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp()
  };
  if (isSuccess) {
    updateData.successCount = FieldValue.increment(1);
  }
  
  await sessionRef.update(updateData);
  
  // 전체 완료 확인
  const sessionSnap = await sessionRef.get();
  const session = sessionSnap.data();
  
  if (session.completedCount >= session.totalCount) {
    console.log(`🏁 원클릭 세션 완료: ${sessionId} (${session.successCount}/${session.totalCount} 성공)`);
    
    await sessionRef.update({
      status: 'completed',
      completedAt: FieldValue.serverTimestamp()
    });
    
    // FCM 1회 전송
    if (session.fcmToken) {
      try {
        const body = session.fcmMessage
          || `${session.successCount}/${session.totalCount}건 변환이 완료되었습니다!`;
        
        await getMessaging().send({
          token: session.fcmToken,
          notification: {
            title: 'Master Valley',
            body
          },
          data: {
            sessionId,
            type: 'oneclick_complete'
          }
        });
        console.log(`📱 원클릭 FCM 전송: ${sessionId}`);
      } catch (fcmError) {
        console.warn(`⚠️ FCM 전송 실패: ${fcmError.message}`);
      }
    }
  }
}

// ========================================
// 단일 변환 FCM (기존)
// ========================================
async function sendSingleFCM(data, transformId, result) {
  if (!data.fcmToken) return;
  
  try {
    const notificationBody = data.fcmMessage
      ? data.fcmMessage
      : result.selectedArtist 
        ? `${result.selectedArtist} 스타일 변환이 완료되었습니다!`
        : '변환이 완료되었습니다!';
    
    await getMessaging().send({
      token: data.fcmToken,
      notification: {
        title: 'Master Valley',
        body: notificationBody
      },
      data: {
        transformId,
        type: 'transform_complete'
      }
    });
    console.log(`📱 FCM 전송 완료: ${transformId}`);
  } catch (fcmError) {
    console.warn(`⚠️ FCM 전송 실패: ${fcmError.message}`);
  }
}

async function sendSingleFailFCM(data, transformId) {
  if (!data.fcmToken) return;
  
  try {
    await getMessaging().send({
      token: data.fcmToken,
      notification: {
        title: 'Master Valley',
        body: '변환 중 오류가 발생했습니다. 다시 시도해 주세요.'
      },
      data: {
        transformId,
        type: 'transform_failed'
      }
    });
  } catch (fcmError) {
    console.warn(`⚠️ FCM 전송 실패: ${fcmError.message}`);
  }
}
