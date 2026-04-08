// ========================================
// Master Valley - NSFW Output Filter v2
// Falconsai/nsfw_image_detection (HuggingFace) + Gemini 수정
// 고위험 스타일 + 여성만 체크
// Threshold: 0.85+ UNSAFE / 0.70~0.85 모니터링 / 0.70 미만 SAFE
// ========================================

import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const HF_MODEL = 'Falconsai/nsfw_image_detection';
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

const NSFW_THRESHOLD = 0.85;
const MONITOR_THRESHOLD = 0.70;

// 관리자 알림 설정
const ADMIN_USER_ID = '4DHAs1E0lUZxHConl1l6S2OZp6k2';
let lastAdminAlert = 0; // 스팸 방지 (1시간 간격)

// 고위험 스타일 목록
const HIGH_RISK_STYLES = [
  // 사조 (영문)
  'ancient', 'renaissance', 'baroque', 'rococo', 'impressionism',
  'expressionism', 'fauvism', 'post-impressionism',
  // 사조 (한국어 — 원클릭 사조에서 styleId가 한국어로 올 수 있음)
  '고대', '르네상스', '바로크', '로코코', '인상주의',
  '표현주의', '야수파', '후기인상주의',
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
// 관리자 FCM 알림 (1시간 간격 제한)
// ========================================
async function sendAdminAlert(message) {
  const now = Date.now();
  if (now - lastAdminAlert < 3600000) return; // 1시간 스팸 방지
  lastAdminAlert = now;
  
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(ADMIN_USER_ID).get();
    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;
    
    await getMessaging().send({
      token: fcmToken,
      notification: { title: '⚠️ NSFW API 장애', body: message },
      data: { type: 'admin_alert' }
    });
    console.log(`📱 관리자 알림 전송: ${message}`);
  } catch (e) {
    console.warn(`관리자 알림 실패: ${e.message}`);
  }
}


// ========================================
// Google Vision SafeSearch fallback
// adult: VERY_UNLIKELY(1) ~ VERY_LIKELY(5)
// LIKELY(4) 이상 → UNSAFE
// ========================================
async function checkNSFWGoogleVision(imageUrl) {
  const startTime = Date.now();
  
  const { ImageAnnotatorClient } = await import('@google-cloud/vision');
  const client = new ImageAnnotatorClient();
  
  const [result] = await client.safeSearchDetection(imageUrl);
  const safe = result.safeSearchAnnotation;
  
  // UNKNOWN=0, VERY_UNLIKELY=1, UNLIKELY=2, POSSIBLE=3, LIKELY=4, VERY_LIKELY=5
  const adultLevel = safe.adult;  // enum string: 'VERY_UNLIKELY', 'LIKELY', etc.
  const racyLevel = safe.racy;
  
  const levelMap = { 'UNKNOWN': 0, 'VERY_UNLIKELY': 1, 'UNLIKELY': 2, 'POSSIBLE': 3, 'LIKELY': 4, 'VERY_LIKELY': 5 };
  const adultScore = levelMap[adultLevel] || 0;
  const racyScore = levelMap[racyLevel] || 0;
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  let verdict;
  if (adultScore >= 4) {
    verdict = 'UNSAFE';
    console.log(`🛡️ Google Vision 판정: UNSAFE (adult: ${adultLevel}, racy: ${racyLevel}) (${elapsed}초)`);
  } else {
    verdict = 'SAFE';
    console.log(`🛡️ Google Vision 판정: SAFE (adult: ${adultLevel}, racy: ${racyLevel}) (${elapsed}초)`);
  }
  
  // imageBuffer는 Google Vision에서 불필요하지만 fixNSFW 호환용
  const imageBuffer = await imageUrlToBuffer(imageUrl);
  
  return { verdict, nsfwScore: adultScore / 5, imageBuffer };
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
            { text: 'This AI-generated artwork contains nudity that must be covered. Add a FULL period-appropriate dress or robe covering the ENTIRE body from shoulders to ankles — chest, torso, hips, and legs must all be fully covered with fabric. The clothing must match this artwork\'s historical style and color palette. Keep everything else — composition, colors, brushwork, facial features, pose, background — completely identical. The clothing should look like it was always part of the original artwork.' }
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
export async function checkAndFixNSFW(resultUrl, transformId, style = null, gender = null, skipFix = false) {
  try {
    // 고위험 조건 체크
    if (style && gender) {
      if (!isHighRisk(style, gender)) {
        console.log(`🛡️ NSFW 스킵 (저위험): ${style?.name || 'unknown'} / ${gender}`);
        return { resultUrl, wasFixed: false, nsfwResult: null };
      }
    }
    
    // 1차: Falconsai (HuggingFace)
    let nsfwResult;
    try {
      nsfwResult = await checkNSFW(resultUrl);
    } catch (hfErr) {
      // Falconsai 실패 → Google Vision fallback
      console.warn(`🚨 Falconsai 실패 → Google Vision fallback: ${hfErr.message}`);
      try {
        nsfwResult = await checkNSFWGoogleVision(resultUrl);
        sendAdminAlert(`Falconsai 장애 → Google Vision fallback 전환됨. 원인: ${hfErr.message}`);
      } catch (gvErr) {
        // Google Vision도 실패 → 원본 전달
        console.warn(`🚨 Google Vision도 실패 (원본 전달): ${gvErr.message}`);
        sendAdminAlert(`NSFW 필터 완전 장애! Falconsai: ${hfErr.message} / Google Vision: ${gvErr.message}`);
        return { resultUrl, wasFixed: false, nsfwResult: null };
      }
    }
    
    const { verdict, nsfwScore, imageBuffer } = nsfwResult;
    
    if (verdict === 'SAFE') {
      return { resultUrl, wasFixed: false, nsfwResult: null };
    }
    
    // UNSAFE 감지
    console.log(`⚠️ UNSAFE 감지: ${transformId} (score: ${nsfwScore.toFixed(3)})`);
    
    // skipFix 모드 (원클릭): Gemini 수정 안 하고 nsfwResult 반환 → 호출자가 비동기 처리
    if (skipFix) {
      return { resultUrl, wasFixed: false, nsfwResult: { verdict, nsfwScore, imageBuffer } };
    }
    
    // 동기 모드 (단일 변환): 바로 Gemini 수정
    console.log(`🔧 Gemini 수정 진행: ${transformId}`);
    const fixedUrl = await fixNSFW(imageBuffer, transformId);
    
    return { resultUrl: fixedUrl, wasFixed: true, nsfwResult: null };
    
  } catch (err) {
    console.warn(`⚠️ NSFW 체크 실패 (원본 전달): ${err.message}`);
    return { resultUrl, wasFixed: false, nsfwResult: null };
  }
}

// 비동기 Gemini 수정 (원클릭용 export)
export { fixNSFW as fixNSFWAsync };
