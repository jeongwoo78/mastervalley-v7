// ========================================
// Master Valley - NSFW Output Filter
// Claude Vision 판정 + Gemini 수정
// SAFE건: 판정만 ($0.005)
// UNSAFE건: 판정 + Gemini 수정 ($0.01)
// ========================================

import Anthropic from '@anthropic-ai/sdk';
import { getStorage } from 'firebase-admin/storage';

const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';


// ========================================
// 이미지 URL → base64 변환
// ========================================
async function imageUrlToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`이미지 다운로드 실패: ${response.status}`);
  const buffer = await response.arrayBuffer();
  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  return { base64: Buffer.from(buffer).toString('base64'), mimeType };
}


// ========================================
// Claude Vision NSFW 판정
// ========================================
async function checkNSFW(imageUrl) {
  const startTime = Date.now();
  
  const { base64: base64Data, mimeType } = await imageUrlToBase64(imageUrl);
  
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mimeType, data: base64Data }
        },
        {
          type: 'text',
          text: 'Does this image contain clearly visible female nipples or genitals? Answer with exactly one word: SAFE or UNSAFE. Artistic draping, shoulder exposure, leg exposure, suggestive poses, thin fabric are all SAFE. Only explicit nipple or genital exposure is UNSAFE.'
        }
      ]
    }]
  });
  
  const result = response.content[0]?.text?.trim().toUpperCase() || 'SAFE';
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`🛡️ NSFW 판정: ${result} (${elapsed}초)`);
  
  return { 
    verdict: result.includes('UNSAFE') ? 'UNSAFE' : 'SAFE',
    base64Data
  };
}


// ========================================
// Gemini로 노출 부위 옷 입히기
// ========================================
async function fixNSFW(base64Data, transformId) {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
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
  
  const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  await file.save(imageBuffer, {
    metadata: { contentType: 'image/png' }
  });
  
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ NSFW 수정 완료 (${elapsed}초)`);
  
  return publicUrl;
}


// ========================================
// 메인: 판정 + 수정 통합
// ========================================
export async function checkAndFixNSFW(resultUrl, transformId) {
  try {
    const { verdict, base64Data } = await checkNSFW(resultUrl);
    
    if (verdict === 'SAFE') {
      return { resultUrl, wasFixed: false };
    }
    
    // UNSAFE → Gemini로 옷 입히기
    console.log(`⚠️ UNSAFE 감지: ${transformId} — Gemini 수정 진행`);
    const fixedUrl = await fixNSFW(base64Data, transformId);
    
    return { resultUrl: fixedUrl, wasFixed: true };
    
  } catch (err) {
    // 판정/수정 실패 시 원본 그대로 전달 (서비스 중단 방지)
    console.warn(`⚠️ NSFW 체크 실패 (원본 전달): ${err.message}`);
    return { resultUrl, wasFixed: false };
  }
}
