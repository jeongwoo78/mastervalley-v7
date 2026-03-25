// ========================================
// Master Valley - Transform Logic Wrapper
// v83: 폴링 제거 → Prefer: wait로 직접 대기 (6초 단축)
// ========================================

import handler from './flux-transfer.js';

/**
 * Replicate 결과 대기 (Prefer: wait — 폴링 없이 즉시 반환)
 * 최대 60초 대기 → 실패 시 폴링 fallback
 */
async function waitForResult(predictionId) {
  try {
    // Prefer: wait — Replicate가 완료될 때까지 HTTP 연결 유지 후 결과 반환
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
          'Prefer': 'wait=60'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Replicate wait 실패: ${response.status}`);
    }
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      console.log(`✅ Prefer:wait 완료`);
      return prediction;
    }
    
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Replicate 변환 실패: ${prediction.error || prediction.status}`);
    }
    
    // 아직 완료 안 됨 (60초 초과 — 극히 드묾) → 폴링 fallback
    console.log(`⚠️ wait 타임아웃, 폴링 전환: ${prediction.status}`);
    return await pollFallback(predictionId);
    
  } catch (err) {
    // 네트워크 에러 등 → 폴링 fallback
    console.log(`⚠️ wait 에러: ${err.message}, 폴링 전환`);
    return await pollFallback(predictionId);
  }
}

/**
 * 폴링 fallback (Prefer: wait 실패 시에만 사용)
 */
async function pollFallback(predictionId) {
  const startTime = Date.now();
  const MAX_POLL_TIME = 300000; // 5분
  const POLL_INTERVAL = 1000;   // 1초
  
  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        await new Promise(r => setTimeout(r, POLL_INTERVAL));
        continue;
      }
      
      const prediction = await response.json();
      
      if (prediction.status === 'succeeded') {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`✅ 폴링 fallback 완료 (${elapsed}초)`);
        return prediction;
      }
      
      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        throw new Error(`Replicate 변환 실패: ${prediction.error || prediction.status}`);
      }
      
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
      
    } catch (err) {
      if (err.message?.includes('변환 실패')) throw err;
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
    }
  }
  
  throw new Error('폴링 타임아웃 (5분)');
}

/**
 * 변환 실행 (Vision → 프롬프트 → Replicate → Prefer:wait → 결과)
 */
export async function runTransform(image, selectedStyle, correctionPrompt = null) {
  let responseData = null;
  let responseStatus = 200;
  
  const mockReq = {
    method: 'POST',
    body: { image, selectedStyle, correctionPrompt }
  };
  
  const mockRes = {
    setHeader: () => mockRes,
    status: (code) => {
      responseStatus = code;
      return mockRes;
    },
    json: (data) => {
      responseData = data;
      return mockRes;
    },
    end: () => mockRes
  };
  
  // handler 실행 (Vision 분석 + 프롬프트 생성 + Replicate prediction 생성)
  await handler(mockReq, mockRes);
  
  if (responseStatus !== 200 || !responseData) {
    throw new Error(responseData?.error || `변환 시작 실패 (status: ${responseStatus})`);
  }
  
  const predictionId = responseData.predictionId;
  if (!predictionId) {
    throw new Error('서버에서 prediction ID를 받지 못했습니다');
  }
  
  console.log(`⏳ Prefer:wait 대기: ${predictionId}`);
  
  // Prefer: wait로 직접 대기 (폴링 없이 ~5.5초에 결과 반환)
  const result = await waitForResult(predictionId);
  
  const resultUrl = Array.isArray(result.output) ? result.output[0] : result.output;
  
  if (!resultUrl) {
    throw new Error('변환 결과 이미지 URL이 없습니다');
  }
  
  return {
    resultUrl,
    selectedArtist: responseData.selected_artist || null,
    selectedWork: responseData.selected_work || null,
    selectionMethod: responseData.selection_method || null,
    selectionDetails: responseData.selection_details || null,
    isRetransform: responseData.isRetransform || false,
    subjectType: responseData._debug?.vision?.subjectType || null,
    debug: responseData._debug || null
  };
}
