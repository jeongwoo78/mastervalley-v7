// ========================================
// Master Valley - 의상 보강 필터 v3
// Gemini 의상 보강 (무조건 1콜)
// 대상: 11개 고위험 화가/스타일 + female only
// Falconsai/Google Vision 완전 제거
// ========================================

import { getStorage } from 'firebase-admin/storage';

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const CLOTHING_TIMEOUT = 30000; // 30초

// 의상 보강 대상 (11개)
const CLOTHING_TARGETS = [
  // 르네상스
  'botticelli',
  // 바로크
  'caravaggio', 'rembrandt', 'rubens',
  // 낭만주의/사실주의
  'delacroix', 'manet',
  // 후기인상주의
  'gauguin',
  // 표현주의
  'munch',
  // 거장
  'klimt',
  // 고대
  'marble',
  // 동양화
  'gongbi'
];


// ========================================
// 의상 보강 대상 여부 판단
// ========================================
export function isClothingTarget(style, gender) {
  if (gender !== 'female' && gender !== 'both') return false;
  
  const styleId = (style?.id || style?.name || '').toLowerCase();
  
  return CLOTHING_TARGETS.some(t => styleId.includes(t));
}


// ========================================
// 이미지 URL → Buffer (10초 타임아웃)
// ========================================
async function imageUrlToBuffer(imageUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(imageUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`이미지 다운로드 실패: ${response.status}`);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } finally {
    clearTimeout(timeout);
  }
}


// ========================================
// Gemini 의상 보강 (무조건 실행)
// 가슴+골반에 옷 입히기 → 이미 있으면 거의 원본 유지
// ========================================
async function enforceClothing(imageBuffer, transformId) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
  const base64Data = imageBuffer.toString('base64');
  
  console.log(`👗 의상 보강 시작: ${transformId}`);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CLOTHING_TIMEOUT);
  
  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: 'image/png', data: base64Data } },
              { text: 'Make sure the chest and hip areas of every person in this artwork are covered with clothing or fabric that naturally matches the artwork\'s historical style and color palette. If already clothed, keep the image as-is with minimal changes. Preserve everything else — composition, colors, brushwork, facial features, pose, background — completely identical.' }
            ]
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT']
          }
        }),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }
    
    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
    
    if (!imagePart) throw new Error('Gemini 의상 보강 이미지 없음');
    
    // Firebase Storage 업로드
    const bucket = getStorage().bucket();
    const filePath = `clothing-fixed/${transformId}.png`;
    const file = bucket.file(filePath);
    
    const fixedBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    await file.save(fixedBuffer, {
      metadata: { contentType: 'image/png' }
    });
    
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ 의상 보강 완료: ${transformId} (${elapsed}초)`);
    
    return publicUrl;
    
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}


// ========================================
// 메인: 조건 체크 + 의상 보강 (동기)
// ========================================
export async function checkAndFixClothing(resultUrl, transformId, style = null, gender = null) {
  try {
    // 대상 여부 체크
    if (style && gender) {
      if (!isClothingTarget(style, gender)) {
        console.log(`👗 스킵 (비대상): ${style?.name || 'unknown'} / ${gender}`);
        return { resultUrl, wasFixed: false };
      }
    }
    
    console.log(`👗 의상 보강 대상: ${style?.name || 'unknown'} / ${gender}`);
    
    // 이미지 다운로드 → Gemini 의상 보강
    const imageBuffer = await imageUrlToBuffer(resultUrl);
    const fixedUrl = await enforceClothing(imageBuffer, transformId);
    
    return { resultUrl: fixedUrl, wasFixed: true };
    
  } catch (err) {
    console.error(`❌ 의상 보강 실패: ${transformId} - ${err.message}`);
    // 실패 시 변환 실패 처리 (원본 전달 안 함)
    throw err;
  }
}
