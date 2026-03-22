// ========================================
// Master Valley - Transform Logic Wrapper
// flux-transfer.js handler를 Cloud Functions에서 호출하기 위한 래퍼
// - mock req/res로 기존 handler 호출
// - predictionId 추출 후 서버에서 직접 폴링
// - 완료된 결과 URL 반환
// ========================================

import handler from './flux-transfer.js';

const POLL_INTERVAL = 2000;   // 2초
const MAX_POLL_TIME = 300000; // 5분 (Cloud Functions gen2 타임아웃 내)

/**
 * Replicate prediction 폴링 (서버 사이드)
 */
async function pollReplicate(predictionId) {
  const startTime = Date.now();
  
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
        console.log(`⚠️ 폴링 상태 확인 실패: ${response.status}`);
        await new Promise(r => setTimeout(r, POLL_INTERVAL));
        continue;
      }
      
      const prediction = await response.json();
      
      if (prediction.status === 'succeeded') {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`✅ 서버 폴링 완료 (${elapsed}초)`);
        return prediction;
      }
      
      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        throw new Error(`Replicate 변환 실패: ${prediction.error || prediction.status}`);
      }
      
      // 진행 중 — 계속 폴링
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
      
    } catch (err) {
      if (err.message?.includes('변환 실패')) throw err;
      console.log(`⚠️ 폴링 에러: ${err.message}`);
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
    }
  }
  
  throw new Error('서버 폴링 타임아웃 (5분)');
}

/**
 * 변환 실행 (Vision → 프롬프트 → Replicate → 폴링 → 결과)
 * 
 * @param {string} image - base64 이미지
 * @param {object} selectedStyle - { name, category, id, ... }
 * @param {string|null} correctionPrompt - 재변환 시 수정 프롬프트
 * @returns {object} { resultUrl, selectedArtist, selectedWork, debug, ... }
 */
export async function runTransform(image, selectedStyle, correctionPrompt = null) {
  // Mock req/res로 기존 handler 호출
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
  
  // 기존 handler 실행 (Vision 분석 + 프롬프트 생성 + Replicate prediction 생성)
  await handler(mockReq, mockRes);
  
  // 에러 체크
  if (responseStatus !== 200 || !responseData) {
    throw new Error(responseData?.error || `변환 시작 실패 (status: ${responseStatus})`);
  }
  
  // predictionId 추출
  const predictionId = responseData.predictionId;
  if (!predictionId) {
    throw new Error('서버에서 prediction ID를 받지 못했습니다');
  }
  
  console.log(`🔄 서버 폴링 시작: ${predictionId}`);
  
  // 서버에서 직접 Replicate 폴링 (클라이언트 대신)
  const result = await pollReplicate(predictionId);
  
  // 결과 URL 추출
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
