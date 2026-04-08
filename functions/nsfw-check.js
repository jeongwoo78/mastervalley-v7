// ========================================
// Master Valley - NSFW Output Filter v2
// Falconsai/nsfw_image_detection (HuggingFace) + Gemini 수정
// 고위험 스타일 + 여성만 체크
// Threshold: 0.85+ UNSAFE / 0.70~0.85 모니터링 / 0.70 미만 SAFE
// ========================================

import { getStorage } from 'firebase-admin/storage';

const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const HF_MODEL = 'Falconsai/nsfw_image_detection';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

const NSFW_THRESHOLD = 0.85;
const MONITOR_THRESHOLD = 0.70;

// 고위험 스타일 목록
const HIGH_RISK_STYLES = [
  // 사조
  'ancient', 'renaissance', 'baroque', 'rococo', 'impressionism',
  // 거장
  'klimt', 'klimt-master', 'munch', 'munch-master', 'matisse', 'matisse-master',
  // 동양화 전체
  'korean', 'chinese', 'japanese', 'indian', 'oriental',
  'minhwa', 'pungsokdo', 'sansuhwa', 'gongbi', 'shuimohua', 'shanshui',
  'ukiyoe', 'rinpa', 'meisho-e', 'bijin-ga', 'yakusha-e',
  'mughal', 'rajput', 'pahari'
];


// ========================================
// 고위험 여부 판단
// ========================================
function isHighRisk(style, gender) {
  if (gender !== 'female') return false;
  
  const styleId = (style?.id || style?.name || '').toLowerCase();
  const category = (style?.category || '').toLowerCase();
  
  // 동양화 카테고리 전체
  if (category === 'oriental') return true;
  
  return HIGH_RISK_STYLES.some(risk => styleId.includes(risk));
}


// ========================================
// 이미지 URL → Buffer 변환 (10초 타임아웃)
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
// Falconsai NSFW 판정 (HuggingFace Inference API)
// 최대 2회 시도 (503 콜드스타트 대응)
// ========================================
async function checkNSFW(imageUrl) {
  const startTime = Date.now();
  
  const imageBuffer = await imageUrlToBuffer(imageUrl);
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        body: imageBuffer,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (response.status === 503 && attempt < 2) {
        console.log(`🛡️ HuggingFace 모델 로딩 중... 10초 후 재시도`);
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HuggingFace API error: ${response.status} - ${errText}`);
      }
      
      const results = await response.json();
      // results: [{"label": "nsfw", "score": 0.95}, {"label": "normal", "score": 0.05}]
      
      const nsfwScore = results.find(r => r.label === 'nsfw')?.score || 0;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      
      let verdict;
      if (nsfwScore >= NSFW_THRESHOLD) {
        verdict = 'UNSAFE';
        console.log(`🛡️ NSFW 판정: UNSAFE (score: ${nsfwScore.toFixed(3)}) (${elapsed}초)`);
      } else if (nsfwScore >= MONITOR_THRESHOLD) {
        verdict = 'SAFE';
        console.log(`🛡️ NSFW 판정: SAFE (모니터링 구간, score: ${nsfwScore.toFixed(3)}) (${elapsed}초)`);
      } else {
        verdict = 'SAFE';
        console.log(`🛡️ NSFW 판정: SAFE (score: ${nsfwScore.toFixed(3)}) (${elapsed}초)`);
      }
      
      return { 
        verdict,
        nsfwScore,
        imageBuffer
      };
      
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (attempt < 2) {
        console.log(`🛡️ NSFW fetch 실패 (시도 ${attempt}): ${fetchErr.message}, 재시도...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      throw fetchErr;
    }
  }
}


// ========================================
// Gemini로 노출 부위 옷 입히기
// ========================================
async function fixNSFW(imageBuffer, transformId) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
  const base64Data = imageBuffer.toString('base64');
  
  console.log(`🔧 NSFW 수정 시작: ${transformId}`);
  
  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: 'image/png', data: base64Data } },
            { text: 'Cover any exposed nipples or genitals with clothing or fabric that naturally matches this artwork\'s style and period. Keep everything else — composition, colors, brushwork, facial features, pose — completely identical. The clothing addition should look like it was always part of the original artwork.' }
          ]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      })
    }
  );
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini fix API error: ${response.status} - ${errText}`);
  }
  
  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  
  if (!imagePart) throw new Error('Gemini 수정 이미지 없음');
  
  // Firebase Storage에 업로드
  const bucket = getStorage().bucket();
  const filePath = `nsfw-fixed/${transformId}.png`;
  const file = bucket.file(filePath);
  
  const fixedBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  await file.save(fixedBuffer, {
    metadata: { contentType: 'image/png' }
  });
  
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ NSFW 수정 완료 (${elapsed}초)`);
  
  return publicUrl;
}


// ========================================
// 메인: 조건 체크 + 판정 + 수정 통합
// ========================================
export async function checkAndFixNSFW(resultUrl, transformId, style = null, gender = null) {
  try {
    // 고위험 조건 체크
    if (style && gender) {
      if (!isHighRisk(style, gender)) {
        console.log(`🛡️ NSFW 스킵 (저위험): ${style?.name || 'unknown'} / ${gender}`);
        return { resultUrl, wasFixed: false };
      }
    }
    
    const { verdict, nsfwScore, imageBuffer } = await checkNSFW(resultUrl);
    
    if (verdict === 'SAFE') {
      return { resultUrl, wasFixed: false };
    }
    
    // UNSAFE → Gemini로 옷 입히기
    console.log(`⚠️ UNSAFE 감지: ${transformId} (score: ${nsfwScore.toFixed(3)}) — Gemini 수정 진행`);
    const fixedUrl = await fixNSFW(imageBuffer, transformId);
    
    return { resultUrl: fixedUrl, wasFixed: true };
    
  } catch (err) {
    // 판정/수정 실패 시 원본 그대로 전달 (서비스 중단 방지)
    console.warn(`⚠️ NSFW 체크 실패 (원본 전달): ${err.message}`);
    return { resultUrl, wasFixed: false };
  }
}
