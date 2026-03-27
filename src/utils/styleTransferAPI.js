// Master Valley v83 - Server-Driven Transform (속도 복원)
//
// v83: 트리거 제거 → 인라인 처리
//   단일: HTTP 응답으로 결과 직접 수신 (8~14초)
//   원클릭: ID 선생성 → Firestore 리스닝 → HTTP fire-and-forget (병렬, ~10~18초)

import { MODEL_CONFIG } from './modelConfig';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFCMToken } from './fcm';

const CLOUD_FUNCTIONS_URL_US = 'https://us-central1-master-valley.cloudfunctions.net/startTransform';
const CLOUD_FUNCTIONS_URL_ASIA = 'https://asia-northeast1-master-valley.cloudfunctions.net/startTransformAsia';
const ASIA_LANGS = ['ko', 'ja', 'zh-TW', 'id', 'th'];

const getCloudFunctionUrl = (lang) => {
  return ASIA_LANGS.includes(lang) ? CLOUD_FUNCTIONS_URL_ASIA : CLOUD_FUNCTIONS_URL_US;
};

const VERCEL_API_URL = 'https://mastervalley-v7.vercel.app';

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

const generateId = () => {
  return crypto.randomUUID ? crypto.randomUUID() 
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
};

// ========================================
// 단일 변환 (차단형) — HTTP 응답으로 결과 직접 수신
// ========================================

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null, fcmOptions = {}, lang = 'en') => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) onProgress({ status: 'analyzing' });
    
    if (correctionPrompt) {
      console.log('🔄 [재변환 요청]');
    }
    
    const transformId = generateId();
    const userId = auth.currentUser?.uid || null;
    
    if (onProgress) onProgress({ status: 'processing', progress: 5 });
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);
    
    const response = await fetch(getCloudFunctionUrl(lang), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: photoBase64,
        selectedStyle,
        correctionPrompt: correctionPrompt || null,
        transformId,
        userId,
        lang,
        fcmToken: fcmOptions.skipFcm ? null : (getFCMToken() || null)
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `서버 에러: ${response.status}`);
    }
    
    const result = await response.json();
    
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

// ========================================
// 원클릭 서버 병렬 처리
// ========================================

export const processFullTransform = async (photoFile, styles, selectedStyle, onProgress = null, fcmOptions = {}, lang = 'en') => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    const sessionId = generateId();
    const transformIds = styles.map(() => generateId());
    
    console.log(`📋 원클릭 준비: ${sessionId} (${transformIds.length}건)`);
    
    return new Promise((resolve, reject) => {
      const results = new Array(transformIds.length).fill(null);
      let completedCount = 0;
      const unsubscribes = [];
      
      const timeoutId = setTimeout(() => {
        cleanup();
        console.warn(`⏰ 원클릭 타임아웃: ${completedCount}/${transformIds.length}`);
        resolve(results);
      }, 600000);
      
      const cleanup = () => {
        unsubscribes.forEach(u => u());
        clearTimeout(timeoutId);
      };
      
      const checkAllDone = () => {
        if (completedCount >= transformIds.length) {
          cleanup();
          resolve(results);
        }
      };
      
      // Firestore 리스너 설정
      transformIds.forEach((tid, idx) => {
        const docRef = doc(db, 'transforms', tid);
        
        const unsub = onSnapshot(docRef, async (snapshot) => {
          if (!snapshot.exists()) return;
          const data = snapshot.data();
          if (results[idx] !== null) return;
          
          if (data.status === 'completed' && data.resultUrl) {
            try {
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
                error: '이미지 다운로드 실패',
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
      
      // HTTP 호출 (fire-and-forget)
      const userId = auth.currentUser?.uid || null;
      
      fetch(getCloudFunctionUrl(lang), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photoBase64,
          isFullTransform: true,
          styles,
          selectedStyle,
          sessionId,
          transformIds,
          userId,
          lang,
          fcmToken: getFCMToken() || null
        })
      }).catch(err => {
        console.error('원클릭 HTTP 에러:', err);
        setTimeout(() => {
          if (completedCount === 0) {
            cleanup();
            reject(new Error('서버 연결 실패: ' + err.message));
          }
        }, 15000);
      });
    });
    
  } catch (error) {
    console.error('Full transform error:', error);
    throw error;
  }
};

// ========================================
// 크레딧 차감 (Vercel 유지)
// ========================================

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

// submitTransform 제거 — v1은 단일+원클릭만 (멀티 동시변환은 v2)

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
