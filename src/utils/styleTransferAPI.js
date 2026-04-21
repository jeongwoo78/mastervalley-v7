// Master Valley v83 - Server-Driven Transform (속도 복원)
//
// v83: 트리거 제거 → 인라인 처리
//   단일: HTTP 응답으로 결과 직접 수신 (8~14초)
//   원클릭: ID 선생성 → Firestore 리스닝 → HTTP fire-and-forget (병렬, ~10~18초)

import { MODEL_CONFIG } from './modelConfig';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { App as CapApp } from '@capacitor/app';
import { getFCMToken } from './fcm';

const CLOUD_FUNCTIONS_URL = 'https://us-central1-master-valley.cloudfunctions.net/startTransform';
// Asia 리전 비활성화 — Replicate/Anthropic API가 US에 있어 us-central1이 더 빠름
// const CLOUD_FUNCTIONS_URL_ASIA = 'https://asia-northeast1-master-valley.cloudfunctions.net/startTransformAsia';

const getCloudFunctionUrl = () => CLOUD_FUNCTIONS_URL;

// A-2: Firebase Auth ID 토큰 가져오기 (서버 인증용)
const getAuthToken = async () => {
  try {
    return await auth.currentUser?.getIdToken();
  } catch (e) {
    console.warn('⚠️ Auth 토큰 획득 실패:', e.message);
    return null;
  }
};

const chargedTransformIds = new Set(); // 레거시 — 향후 제거 예정

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const resizeImage = async (file, maxWidth = 1024) => {
  return new Promise((resolve, reject) => {
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
        resolve(new File([blob], file.name || 'photo.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = () => reject(new Error('Image load failed'));
    
    const reader = new FileReader();
    reader.onloadend = () => { img.src = reader.result; };
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
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
// 단일 변환 — Firestore onSnapshot으로 결과 수신
// (HTTP fire-and-forget + Firestore 리스닝, 백그라운드 복귀에도 안전)
// ========================================

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null, fcmOptions = {}, lang = 'en', retryOptions = {}) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) onProgress({ status: 'analyzing' });
    
    if (correctionPrompt) {
      console.log('🔄 [재변환 요청]');
    }
    
    const transformId = generateId();
    const authToken = await getAuthToken();
    
    // Firestore 리스닝으로 결과 수신 (원클릭과 동일 패턴)
    return new Promise((resolve, reject) => {
      let resolved = false;  // 중복 resolve 방지
      let stateListener = null;  // Capacitor appStateChange 리스너
      let pollId = null;  // v94: fallback polling
      
      const cleanup = () => {
        resolved = true;
        unsub();
        clearTimeout(timeoutId);
        if (pollId) clearInterval(pollId);
        if (stateListener) { stateListener.remove(); stateListener = null; }
      };
      
      const handleResult = async (data) => {
        if (resolved) return;
        
        if (data.status === 'completed' && data.resultUrl) {
          cleanup();
          try {
            const imageResponse = await fetch(data.resultUrl);
            const blob = await imageResponse.blob();
            const localUrl = URL.createObjectURL(blob);
            
            console.log(`✅ 변환 완료: ${transformId} | ${data.selectedArtist || '재변환'}`);
            
            resolve({
              success: true,
              transformId,
              resultUrl: localUrl,
              blob,
              remoteUrl: data.resultUrl,
              model: modelConfig.model,
              cost: modelConfig.cost,
              time: modelConfig.time,
              aiSelectedArtist: data.selectedArtist || null,
              selected_work: data.selectedWork || null,
              selectionMethod: data.selectionMethod || null,
              subjectType: data.subjectType || null,
              selectionDetails: null
            });
          } catch (dlErr) {
            resolve({ success: false, transformId, error: 'Image download failed: ' + dlErr.message });
          }
        }
        
        if (data.status === 'failed') {
          cleanup();
          resolve({ success: false, transformId, error: data.error || 'Transform failed' });
        }
      };
      
      const timeoutId = setTimeout(() => {
        cleanup();
        resolve({ success: false, transformId, error: 'Transform timeout (180s)' });
      }, 180000);
      
      // 1) Firestore onSnapshot (실시간 감시)
      const docRef = doc(db, 'transforms', transformId);
      const unsub = onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) return;
        handleResult(snapshot.data());
      }, (error) => {
        cleanup();
        resolve({ success: false, transformId, error: 'Firestore listener error: ' + error.message });
      });
      
      // 2) Fallback polling: 3초마다 Firestore 직접 확인 (onSnapshot 유실 방어)
      pollId = setInterval(async () => {
        if (resolved) { clearInterval(pollId); return; }
        try {
          const snap = await getDocFromServer(docRef);
          if (snap.exists()) handleResult(snap.data());
        } catch (e) {
          console.warn('🔄 단독 polling 에러:', e.message);
        }
      }, 3000);
      
      // 3) 포그라운드 복귀 시 수동 확인 (onSnapshot이 못 받았을 때 fallback)
      CapApp.addListener('appStateChange', async ({ isActive }) => {
        if (isActive && !resolved) {
          try {
            const snap = await getDocFromServer(docRef);
            if (snap.exists()) handleResult(snap.data());
          } catch (e) {
            console.warn('⚠️ 포그라운드 복귀 확인 실패:', e.message);
          }
        }
      }).then(listener => {
        if (resolved) { listener.remove(); } // 이미 끝났으면 바로 제거
        else { stateListener = listener; }   // 아직 진행 중이면 저장
      });
      
      // 3) HTTP fire-and-forget (서버에 요청만 보내고 응답은 기다리지 않음)
      fetch(getCloudFunctionUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({
          image: photoBase64,
          selectedStyle,
          correctionPrompt: correctionPrompt || null,
          transformId,
          lang,
          fcmToken: fcmOptions.skipFcm ? null : (getFCMToken() || null),
          // v94: 재시도 플래그 (서버가 크레딧 차감 스킵)
          isRetry: !!retryOptions.isRetry,
          originalTransformId: retryOptions.originalTransformId || null
        })
      }).catch(err => {
        console.error('HTTP 전송 에러:', err);
        setTimeout(() => {
          if (!resolved) {
            cleanup();
            resolve({ success: false, transformId, error: 'Server connection failed: ' + err.message });
          }
        }, 15000);
      });
    });
    
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
    const authToken = await getAuthToken();
    
    return new Promise((resolve, reject) => {
      const results = new Array(transformIds.length).fill(null);
      let completedCount = 0;
      const unsubscribes = [];
      let pollIntervalId = null;
      
      const timeoutId = setTimeout(() => {
        cleanup();
        console.warn(`⏰ 원클릭 타임아웃: ${completedCount}/${transformIds.length}`);
        resolve({ results, transformIds });
      }, 600000);
      
      const cleanup = () => {
        unsubscribes.forEach(u => u());
        clearTimeout(timeoutId);
        if (pollIntervalId) clearInterval(pollIntervalId);
      };
      
      const checkAllDone = () => {
        if (completedCount >= transformIds.length) {
          cleanup();
          resolve({ results, transformIds });
        }
      };
      
      // 결과 처리 헬퍼 (onSnapshot + fallback polling 공용)
      const processing = new Set(); // 레이스 컨디션 방어: 이미지 다운로드 중 이중 진입 방지
      const processResult = async (idx, tid, data) => {
        if (results[idx] !== null) return; // 이미 처리됨
        if (processing.has(idx)) return;   // 다른 경로에서 처리 중
        processing.add(idx);               // 진입 잠금
        
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
            console.error(`❌ Image download failed: ${tid}`, dlErr);
            results[idx] = {
              style: styles[idx],
              transformId: tid,
              error: 'Image download failed',
              success: false
            };
          }
        } else if (data.status === 'failed') {
          results[idx] = {
            style: styles[idx],
            transformId: tid,
            error: data.error || 'Transform failed',
            success: false
          };
        } else {
          processing.delete(idx); // 아직 진행 중이면 잠금 해제
          return;
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
      };
      
      // Firestore 리스너 설정
      transformIds.forEach((tid, idx) => {
        const docRef = doc(db, 'transforms', tid);
        
        const unsub = onSnapshot(docRef, async (snapshot) => {
          if (!snapshot.exists()) return;
          await processResult(idx, tid, snapshot.data());
        }, (error) => {
          console.error(`❌ Firestore listener error: ${tid}`, error);
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
      
      // Fallback polling: 3초마다 미완료 슬롯 수동 확인
      pollIntervalId = setInterval(async () => {
        const pending = transformIds
          .map((tid, idx) => ({ tid, idx }))
          .filter(({ idx }) => results[idx] === null);
        
        if (pending.length === 0) return;
        
        console.log(`🔄 Fallback polling: ${pending.length} pending`);
        
        for (const { tid, idx } of pending) {
          try {
            const docRef = doc(db, 'transforms', tid);
            const snapshot = await getDocFromServer(docRef);
            if (snapshot.exists()) {
              await processResult(idx, tid, snapshot.data());
            }
          } catch (e) {
            console.warn(`⚠️ Fallback poll error: ${tid}`, e.message);
          }
        }
      }, 3000);
      
      // HTTP 호출 (fire-and-forget)
      
      fetch(getCloudFunctionUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({
          image: photoBase64,
          isFullTransform: true,
          styles,
          selectedStyle,
          sessionId,
          transformIds,
          lang,
          fcmToken: getFCMToken() || null
        })
      }).catch(err => {
        console.error('원클릭 HTTP 에러:', err);
        setTimeout(() => {
          if (completedCount === 0) {
            cleanup();
            reject(new Error('Server connection failed: ' + err.message));
          }
        }, 15000);
      });
    });
    
  } catch (error) {
    console.error('Full transform error:', error);
    throw error;
  }
};

// submitTransform 제거 — v1은 단일+원클릭만 (멀티 동시변환은 v2)
// 크레딧 차감: 서버(index.js)에서 처리 — 클라이언트 차감 제거됨 (A-1)

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
