// ========================================
// Master Valley Cloud Functions (gen2)
// 서버 구동 변환 아키텍처
// ========================================
// startTransform: 클라이언트 요청 → Firestore에 저장 → transformId 반환
// processTransform: Firestore 생성 트리거 → 변환 처리 → 결과 저장 + FCM 푸시
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
// 클라이언트가 호출 → Firestore에 변환 작업 등록 → transformId 즉시 반환
// 실제 변환은 processTransform에서 비동기 처리
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
    const { image, selectedStyle, correctionPrompt, userId, fcmToken } = req.body;
    
    // 입력 검증
    if (!image || !selectedStyle) {
      return res.status(400).json({ error: 'Missing image or style' });
    }
    
    if (!selectedStyle.name || !selectedStyle.category) {
      return res.status(400).json({ error: 'Invalid style structure' });
    }
    
    // transformId 생성
    const transformId = crypto.randomUUID();
    
    // Firestore에 변환 작업 등록
    await db.collection('transforms').doc(transformId).set({
      status: 'pending',
      image,                                    // base64
      selectedStyle,
      correctionPrompt: correctionPrompt || null,
      userId: userId || null,
      fcmToken: fcmToken || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    console.log(`📋 변환 작업 등록: ${transformId} (${selectedStyle.category}/${selectedStyle.name})`);
    
    // transformId 즉시 반환 (변환은 백그라운드에서 진행)
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
// Vision 분석 → 프롬프트 생성 → Replicate FLUX 호출 → 폴링 → 결과 저장 + FCM
// ========================================
export const processTransform = onDocumentCreated({
  document: 'transforms/{transformId}',
  timeoutSeconds: 540,    // 9분 (충분한 여유)
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
  
  console.log(`🚀 변환 처리 시작: ${transformId}`);
  
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
    
    // 결과 저장 + 이미지 데이터 삭제 (저장공간 절약)
    await docRef.update({
      status: 'completed',
      resultUrl: result.resultUrl,
      selectedArtist: result.selectedArtist || null,
      selectedWork: result.selectedWork || null,
      selectionMethod: result.selectionMethod || null,
      subjectType: result.subjectType || null,
      isRetransform: result.isRetransform || false,
      image: FieldValue.delete(),              // base64 삭제 (저장공간 절약)
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // FCM 푸시 알림 전송
    if (data.fcmToken) {
      try {
        await getMessaging().send({
          token: data.fcmToken,
          notification: {
            title: 'Master Valley',
            body: result.selectedArtist 
              ? `${result.selectedArtist} 스타일 변환이 완료되었습니다!`
              : '변환이 완료되었습니다!'
          },
          data: {
            transformId,
            type: 'transform_complete'
          }
        });
        console.log(`📱 FCM 전송 완료: ${transformId}`);
      } catch (fcmError) {
        // FCM 실패해도 변환 결과는 이미 저장됨
        console.warn(`⚠️ FCM 전송 실패: ${fcmError.message}`);
      }
    }
    
  } catch (error) {
    console.error(`❌ 변환 실패: ${transformId}`, error);
    
    // 에러 상태 저장
    await docRef.update({
      status: 'failed',
      error: error.message,
      image: FieldValue.delete(),              // 실패해도 이미지 삭제
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // 실패 시에도 FCM으로 알림
    if (data.fcmToken) {
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
  }
});
