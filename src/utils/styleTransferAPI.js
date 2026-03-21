// Master Valley v81 - Server-Driven Transform (Cloud Functions + Firestore + FCM)
//
// 변경사항 (v80 → v81):
// - Vercel /api/flux-transfer → Cloud Functions startTransform
// - 클라이언트 폴링 (check-prediction) → Firestore onSnapshot 실시간 리스닝
// - 앱 꺼져도 서버에서 변환 계속 진행 + FCM 푸시 알림
//
// 유지:
// - 이미지 리사이즈, base64 변환
// - deduct-credit은 Vercel 유지 (추후 이전)
// - 멱등성 키 (transformId)

import { MODEL_CONFIG } from './modelConfig';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFCMToken } from './fcm';

// Cloud Functions URL
const CLOUD_FUNCTIONS_URL = 'https://us-central1-master-valley.cloudfunctions.net';

// Vercel URL (deduct-credit 등 아직 Vercel에 남아있는 API용)
const VERCEL_API_URL = 'https://mastervalley-v7.vercel.app';

// v80: 이중 차감 방지 - 이미 차감된 transformId 추적
const chargedTransformIds = new Set();

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const resizeImage = async (file, maxWidth = 1024) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const getModelForStyle = (style) => {
  const model = style.model || 'SDXL';
  return MODEL_CONFIG[model];
};

// ========================================
// Cloud Functions 호출 → Firestore 리스닝
// ========================================

/**
 * startTransform Cloud Function 호출
 * → transformId 즉시 반환 (변환은 서버 백그라운드에서 진행)
 */
const callStartTransform = async (photoBase64, selectedStyle, correctionPrompt = null) => {
  const userId = auth.currentUser?.uid || null;
  
  const requestBody = {
    image: photoBase64,
    selectedStyle,
    correctionPrompt: correctionPrompt || null,
    userId,
    fcmToken: getFCMToken() || null
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch(`${CLOUD_FUNCTIONS_URL}/startTransform`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Cloud Function error: ${response.status}`);
  }

  return response.json(); // { transformId, status: 'pending' }
};

/**
 * Firestore 실시간 리스닝으로 변환 결과 대기
 * transforms/{transformId} 문서 상태 변화 감지
 */
const waitForTransformResult = (transformId, onProgress) => {
  return new Promise((resolve, reject) => {
    const docRef = doc(db, 'transforms', transformId);
    let progressPercent = 10;
    
    // 진행률 시뮬레이션 (실제 서버 진행률은 모르지만 UX용)
    const progressInterval = setInterval(() => {
      progressPercent = Math.min(90, progressPercent + 1);
      if (onProgress) {
        onProgress({ status: 'processing', progress: progressPercent });
      }
    }, 2000);
    
    // 5분 타임아웃
    const timeoutId = setTimeout(() => {
      unsubscribe();
      clearInterval(progressInterval);
      reject(new Error('변환 시간 초과 (5분)'));
    }, 300000);
    
    // Firestore 실시간 리스닝
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;
      
      const data = snapshot.data();
      
      if (data.status === 'completed') {
        unsubscribe();
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        
        if (onProgress) {
          onProgress({ status: 'processing', progress: 100 });
        }
        
        resolve({
          resultUrl: data.resultUrl,
          selectedArtist: data.selectedArtist || null,
          selectedWork: data.selectedWork || null,
          selectionMethod: data.selectionMethod || null,
          isRetransform: data.isRetransform || false
        });
      }
      
      if (data.status === 'failed') {
        unsubscribe();
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        reject(new Error(data.error || '변환 실패'));
      }
      
      if (data.status === 'processing' && onProgress) {
        onProgress({ status: 'processing', progress: progressPercent });
      }
    }, (error) => {
      unsubscribe();
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      reject(new Error(`Firestore 리스닝 에러: ${error.message}`));
    });
  });
};

// ========================================
// 메인 변환 함수
// ========================================

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) {
      onProgress({ status: 'analyzing' });
    }

    // 1. Cloud Function 호출 → transformId 즉시 반환
    if (correctionPrompt) {
      console.log('🔄 [재변환 요청]');
      console.log('   - correctionPrompt:', correctionPrompt);
      console.log('   - selectedStyle.id:', selectedStyle?.id);
    }
    
    const { transformId } = await callStartTransform(photoBase64, selectedStyle, correctionPrompt);
    console.log(`📋 변환 시작: ${transformId}`);
    
    if (onProgress) {
      onProgress({ status: 'processing', progress: 5 });
    }

    // 2. Firestore 실시간 리스닝으로 결과 대기
    const result = await waitForTransformResult(transformId, onProgress);
    
    console.log(`✅ 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);

    // 3. 결과 이미지 다운로드
    if (onProgress) onProgress({ status: 'downloading' });
    
    const imageResponse = await fetch(result.resultUrl);
    const blob = await imageResponse.blob();
    const localUrl = URL.createObjectURL(blob);

    return {
      success: true,
      transformId,
      resultUrl: localUrl,
      blob,
      remoteUrl: result.resultUrl,
      model: modelConfig.model,
      cost: modelConfig.cost,
      time: modelConfig.time,
      aiSelectedArtist: result.selectedArtist,
      selected_work: result.selectedWork,
      selectionMethod: result.selectionMethod,
      selectionDetails: null
    };

  } catch (error) {
    console.error('Style transfer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// v80: 안전한 크레딧 차감 (이중 차감 방지) - Vercel 유지
export const deductCredit = async (transformId, cost, userId) => {
  if (chargedTransformIds.has(transformId)) {
    console.warn(`⚠️ 이미 차감된 transformId: ${transformId}`);
    return { success: true, alreadyCharged: true };
  }
  
  try {
    const response = await fetch(`${VERCEL_API_URL}/api/deduct-credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transformId, cost, userId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      chargedTransformIds.add(transformId);
    }
    
    return data;
  } catch (error) {
    console.error('Credit deduction error:', error);
    return { success: false, error: error.message };
  }
};

export const mockStyleTransfer = async (photoFile, selectedStyle, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const modelConfig = getModelForStyle(selectedStyle);
    
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress({ status: 'processing', progress });
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        const url = URL.createObjectURL(photoFile);
        resolve({
          success: true,
          resultUrl: url,
          blob: photoFile,
          model: modelConfig.model,
          isMock: true
        });
      }
    }, 200);
  });
};

export const applyStyleTransfer = processStyleTransfer;
