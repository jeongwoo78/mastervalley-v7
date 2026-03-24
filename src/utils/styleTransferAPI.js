// Master Valley v83 - Server-Driven Transform
//
// v83: 원클릭도 서버 일괄 처리 (processFullTransform)
//      앱 나가도 서버가 N건 병렬 처리 → FCM → 재진입 복원
// v82: submitTransform 추가 (비동기 제출, 즉시 반환)
// v81: Cloud Functions + Firestore 리스닝 + FCM
//
// processFullTransform: 원클릭 서버 제출 → Firestore 리스닝 → 결과 수집 (차단형)
// processStyleTransfer: 단일 변환 (차단형, 결과까지 대기)

import { MODEL_CONFIG } from './modelConfig';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFCMToken } from './fcm';
import transformManager from './transformManager';

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
// Cloud Functions 호출 — 단일 변환
// ========================================

const callStartTransform = async (photoBase64, selectedStyle, correctionPrompt = null, fcmOptions = {}) => {
  const userId = auth.currentUser?.uid || null;
  
  const requestBody = {
    image: photoBase64,
    selectedStyle,
    correctionPrompt: correctionPrompt || null,
    userId,
    fcmToken: fcmOptions.skipFcm ? null : (getFCMToken() || null),
    fcmMessage: fcmOptions.customMessage || null
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

  return response.json();
};

// ========================================
// Cloud Functions 호출 — 원클릭 (서버 일괄)
// ========================================

const callStartOneClick = async (photoBase64, styles, selectedStyle, fcmOptions = {}) => {
  const userId = auth.currentUser?.uid || null;
  
  const requestBody = {
    image: photoBase64,
    isFullTransform: true,
    styles,
    selectedStyle,
    userId,
    fcmToken: fcmOptions.skipFcm ? null : (getFCMToken() || null),
    fcmMessage: fcmOptions.customMessage || null
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

  return response.json();
};

// ========================================
// Firestore 실시간 리스닝 (차단형, processStyleTransfer용)
// ========================================

const waitForTransformResult = (transformId, onProgress) => {
  return new Promise((resolve, reject) => {
    const docRef = doc(db, 'transforms', transformId);
    let progressPercent = 10;
    
    const progressInterval = setInterval(() => {
      progressPercent = Math.min(90, progressPercent + 1);
      if (onProgress) {
        onProgress({ status: 'processing', progress: progressPercent });
      }
    }, 2000);
    
    const timeoutId = setTimeout(() => {
      unsubscribe();
      clearInterval(progressInterval);
      reject(new Error('변환 시간 초과 (5분)'));
    }, 300000);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      
      if (data.status === 'completed') {
        unsubscribe();
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        if (onProgress) onProgress({ status: 'processing', progress: 100 });
        resolve({
          resultUrl: data.resultUrl,
          selectedArtist: data.selectedArtist || null,
          selectedWork: data.selectedWork || null,
          selectionMethod: data.selectionMethod || null,
          subjectType: data.subjectType || null,
          isRetransform: data.isRetransform || false
        });
      }
      
      if (data.status === 'failed') {
        unsubscribe();
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        reject(new Error(data.error || '변환 실패'));
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
// v83: 원클릭 서버 일괄 처리 (차단형)
// ========================================
// 1회 호출 → 서버가 N건 병렬 변환 → Firestore 리스닝으로 개별 결과 수신
// 앱 나가도 서버가 계속 처리. 재진입 시 복원 로직(App.jsx)이 처리.
//
// onProgress({ completedCount, totalCount, results, latestIndex })
//   results: style 순서대로 배열 (null = 아직 미완료)
//   latestIndex: 방금 완료된 스타일의 인덱스
// ========================================

export const processFullTransform = async (photoFile, styles, selectedStyle, onProgress = null, fcmOptions = {}) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    // 서버에 원클릭 일괄 제출 (1회 호출)
    const { sessionId, transformIds } = await callStartOneClick(
      photoBase64, styles, selectedStyle, fcmOptions
    );
    
    console.log(`📋 원클릭 제출 완료: ${sessionId} (${transformIds.length}건)`);
    
    // N개 transforms에 각각 onSnapshot → 개별 결과 수집
    return new Promise((resolve, reject) => {
      const results = new Array(transformIds.length).fill(null);
      let completedCount = 0;
      const unsubscribes = [];
      
      // 전체 타임아웃 (10분)
      const timeoutId = setTimeout(() => {
        unsubscribes.forEach(u => u());
        // 타임아웃이어도 지금까지 수집된 결과 반환
        console.warn(`⏰ 원클릭 타임아웃: ${completedCount}/${transformIds.length} 완료`);
        resolve(results);
      }, 600000);
      
      const checkAllDone = () => {
        if (completedCount >= transformIds.length) {
          clearTimeout(timeoutId);
          unsubscribes.forEach(u => u());
          resolve(results);
        }
      };
      
      transformIds.forEach((tid, idx) => {
        const docRef = doc(db, 'transforms', tid);
        
        const unsub = onSnapshot(docRef, async (snapshot) => {
          if (!snapshot.exists()) return;
          const data = snapshot.data();
          
          // 이미 처리된 인덱스 skip
          if (results[idx] !== null) return;
          
          if (data.status === 'completed') {
            try {
              // 결과 이미지 다운로드
              const imageResponse = await fetch(data.resultUrl);
              const blob = await imageResponse.blob();
              const localUrl = URL.createObjectURL(blob);
              
              results[idx] = {
                style: styles[idx],
                resultUrl: localUrl,
                blob,
                remoteUrl: data.resultUrl,
                transformId: tid,
                aiSelectedArtist: data.selectedArtist || null,
                selected_work: data.selectedWork || null,
                selectionMethod: data.selectionMethod || null,
                subjectType: data.subjectType || null,
                success: true
              };
            } catch (dlErr) {
              console.error(`❌ 이미지 다운로드 실패: ${tid}`, dlErr);
              results[idx] = {
                style: styles[idx],
                transformId: tid,
                error: 'Image download failed',
                success: false
              };
            }
            
            completedCount++;
            if (onProgress) {
              onProgress({
                completedCount,
                totalCount: transformIds.length,
                results: [...results],
                latestIndex: idx
              });
            }
            checkAllDone();
          }
          
          if (data.status === 'failed') {
            results[idx] = {
              style: styles[idx],
              transformId: tid,
              error: data.error || '변환 실패',
              success: false
            };
            
            completedCount++;
            if (onProgress) {
              onProgress({
                completedCount,
                totalCount: transformIds.length,
                results: [...results],
                latestIndex: idx
              });
            }
            checkAllDone();
          }
        }, (error) => {
          console.error(`❌ Firestore 리스닝 에러: ${tid}`, error);
          if (results[idx] === null) {
            results[idx] = {
              style: styles[idx],
              transformId: tid,
              error: error.message,
              success: false
            };
            completedCount++;
            checkAllDone();
          }
        });
        
        unsubscribes.push(unsub);
      });
    });
    
  } catch (error) {
    console.error('Full transform error:', error);
    throw error;
  }
};

// ========================================
// v82: 비차단형 변환 제출 (동시다중 변환용)
// ========================================

export const submitTransform = async (photoFile, selectedStyle, correctionPrompt = null) => {
  // 동시 변환 제한 체크
  if (!transformManager.canStartNew()) {
    return {
      success: false,
      error: `동시 변환은 최대 ${transformManager.MAX_CONCURRENT}건까지 가능합니다. 완료 후 다시 시도해 주세요.`
    };
  }

  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (correctionPrompt) {
      console.log('🔄 [재변환 요청]');
    }
    
    const { transformId } = await callStartTransform(photoBase64, selectedStyle, correctionPrompt);
    console.log(`📋 변환 제출: ${transformId} (${transformManager.getActiveCount() + 1}/${transformManager.MAX_CONCURRENT})`);
    
    transformManager.start(transformId, {
      selectedStyle,
      correctionPrompt,
      cost: modelConfig.cost,
      model: modelConfig.model
    });
    
    return {
      success: true,
      transformId
    };

  } catch (error) {
    console.error('Transform submit error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ========================================
// 차단형 단일 변환 (기존 호환)
// ========================================

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null, fcmOptions = {}) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) onProgress({ status: 'analyzing' });

    if (correctionPrompt) {
      console.log('🔄 [재변환 요청]');
    }
    
    const { transformId } = await callStartTransform(photoBase64, selectedStyle, correctionPrompt, fcmOptions);
    console.log(`📋 변환 시작: ${transformId}`);
    
    if (onProgress) onProgress({ status: 'processing', progress: 5 });

    const result = await waitForTransformResult(transformId, onProgress);
    console.log(`✅ 변환 완료: ${transformId} | ${result.selectedArtist || '재변환'}`);

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
      subjectType: result.subjectType,
      selectionDetails: null
    };

  } catch (error) {
    console.error('Style transfer error:', error);
    return { success: false, error: error.message };
  }
};

// 크레딧 차감 (Vercel 유지)
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
    if (data.success) chargedTransformIds.add(transformId);
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
      if (onProgress) onProgress({ status: 'processing', progress });
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ success: true, resultUrl: URL.createObjectURL(photoFile), blob: photoFile, model: modelConfig.model, isMock: true });
      }
    }, 200);
  });
};

export const applyStyleTransfer = processStyleTransfer;
