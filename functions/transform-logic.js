// ========================================
// Master Valley - Transform Logic Wrapper (Gemini)
// v1.0: FLUX 3-API 체인 → Gemini 1-API
// Replicate 폴링 제거, Firebase Storage 업로드 추가
// ========================================

import handler from './gemini-transfer.js';
import { getStorage } from 'firebase-admin/storage';

/**
 * Gemini base64 결과 → Firebase Storage 업로드 → 공개 URL 반환
 */
async function uploadToStorage(base64Data, mimeType = 'image/png') {
  try {
    const bucket = getStorage().bucket();
    
    // 파일명: transforms/YYYYMMDD/timestamp_random.png
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8);
    const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
    const filePath = `transforms/${dateStr}/${Date.now()}_${random}.${ext}`;
    
    const file = bucket.file(filePath);
    const buffer = Buffer.from(base64Data, 'base64');
    
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000' // 1년 캐시
      }
    });
    
    // 공개 URL 생성
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    console.log(`📦 Storage 업로드 완료: ${filePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return publicUrl;
    
  } catch (err) {
    console.error('📦 Storage 업로드 실패:', err.message);
    
    // 업로드 실패 시 data URI fallback (FCM 이미지 미리보기는 안 되지만 앱 내 표시는 가능)
    return `data:${mimeType};base64,${base64Data}`;
  }
}

/**
 * 변환 실행 (Gemini 1콜 → Storage 업로드 → URL 반환)
 */
export async function runTransform(image, selectedStyle, correctionPrompt = null, isOneClick = false) {
  let responseData = null;
  let responseStatus = 200;
  
  const mockReq = {
    method: 'POST',
    body: { image, selectedStyle, correctionPrompt, isOneClick }
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
  
  // Gemini handler 실행 (분석 + 선택 + 생성 동시)
  await handler(mockReq, mockRes);
  
  if (responseStatus !== 200 || !responseData) {
    throw new Error(responseData?.error || `변환 실패 (status: ${responseStatus})`);
  }
  
  // base64 → Firebase Storage 업로드 → URL
  const resultBase64 = responseData.resultBase64;
  if (!resultBase64) {
    throw new Error('Gemini 결과에 이미지가 없습니다');
  }
  
  const resultUrl = await uploadToStorage(
    resultBase64, 
    responseData.resultMimeType || 'image/png'
  );
  
  return {
    resultUrl,
    selectedArtist: responseData.selected_artist || null,
    selectedWork: responseData.selected_work || null,
    selectionMethod: responseData.selection_method || null,
    selectionDetails: responseData.selection_details || null,
    isRetransform: !!correctionPrompt,
    subjectType: responseData._debug?.subjectType || null,
    debug: responseData._debug || null
  };
}
