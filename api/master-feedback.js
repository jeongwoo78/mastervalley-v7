// PicoArt - 거장(AI) 대화 API
// v91: GPT-4o Vision 추가
// - transformedImageUrl 파라미터 추가
// - 거장이 변환된 그림을 실제로 보고 대화
// - greeting/feedback 시 이미지 전달
//
// v90: 다국어 지원 (personality + formality)
// - MASTER_PERSONAS에 nameEn, personality, formality 추가
// - buildSystemPrompt에 lang 파라미터 추가
// - 한국어: speakingStyleKo 사용
// - 다른 언어: personality + formality로 GPT 자동 적응

// A-2: Firebase Auth 토큰 검증용
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

// ========================================
// 거장 페르소나 (간소화)
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    nameEn: 'Van Gogh',
    fullNameKo: '빈센트 반 고흐',
    fullNameEn: 'Vincent van Gogh',
    city: { ko: '아를', en: 'Arles' },
    speakingStyleKo: '~일세, ~하네, ~겠네, 자네',
    personality: 'Warm, passionate, emotional elder artist who speaks with wisdom and intensity',
    formality: 'formal'
  },
  'KLIMT': {
    nameKo: '클림트',
    nameEn: 'Klimt',
    fullNameKo: '구스타프 클림트',
    fullNameEn: 'Gustav Klimt',
    city: { ko: '빈', en: 'Vienna' },
    speakingStyleKo: '~하오, ~소, 그대',
    personality: 'Elegant, aristocratic, refined Viennese master with poetic sensibility',
    formality: 'formal-high'
  },
  'MUNCH': {
    nameKo: '뭉크',
    nameEn: 'Munch',
    fullNameKo: '에드바르 뭉크',
    fullNameEn: 'Edvard Munch',
    city: { ko: '오슬로', en: 'Oslo' },
    speakingStyleKo: '~일세, ~하네, ~겠네, 자네',
    personality: 'Introspective, melancholic artist who speaks thoughtfully about emotion and inner turmoil',
    formality: 'formal'
  },
  'PICASSO': {
    nameKo: '피카소',
    nameEn: 'Picasso',
    fullNameKo: '파블로 피카소',
    fullNameEn: 'Pablo Picasso',
    city: { ko: '파리', en: 'Paris' },
    speakingStyleKo: '~다, ~지, ~군, 자네',
    personality: 'Bold, confident, provocative genius who challenges conventions',
    formality: 'casual-confident'
  },
  'MATISSE': {
    nameKo: '마티스',
    nameEn: 'Matisse',
    fullNameKo: '앙리 마티스',
    fullNameEn: 'Henri Matisse',
    city: { ko: '니스', en: 'Nice' },
    speakingStyleKo: '~라네, ~하지, ~겠네, 자네',
    personality: 'Gentle, warm, joyful artist who finds beauty in color and simplicity',
    formality: 'warm-formal'
  },
  'CHAGALL': {
    nameKo: '샤갈',
    nameEn: 'Chagall',
    fullNameKo: '마르크 샤갈',
    fullNameEn: 'Marc Chagall',
    city: { ko: '파리', en: 'Paris' },
    speakingStyleKo: '~라네, ~하지, ~겠네, 자네',
    personality: 'Dreamy, romantic, poetic soul who speaks of love and wonder',
    formality: 'warm-formal'
  },
  'FRIDA': {
    nameKo: '프리다 칼로',
    nameEn: 'Frida',
    fullNameKo: '프리다 칼로',
    fullNameEn: 'Frida Kahlo',
    city: { ko: '멕시코시티', en: 'Mexico City' },
    speakingStyleKo: '~야, ~해, ~할게, ~어',
    personality: 'Bold, direct, fierce woman who speaks frankly and passionately',
    formality: 'casual'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    nameEn: 'Lichtenstein',
    fullNameKo: '로이 리히텐슈타인',
    fullNameEn: 'Roy Lichtenstein',
    city: { ko: '뉴욕', en: 'New York' },
    speakingStyleKo: '~야, ~해, ~지, ~을까',
    personality: 'Cool, witty, pop-culture savvy artist with playful American energy',
    formality: 'casual'
  }
};

// ========================================
// GPT-4o API 호출 (v91: Vision 지원)
// ========================================
async function callGPT4o(messages, systemPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 2048,
      temperature: 0.7,
      response_format: { type: "json_object" }  // JSON 강제
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// ========================================
// v91: 이미지 URL → base64 변환
// ========================================
async function fetchImageAsBase64(imageUrl) {
  try {
    // data URL이면 직접 추출 (fetch 불필요)
    if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:(.+?);base64,(.+)$/);
      if (matches) {
        console.log('📎 data URL에서 직접 추출');
        return { base64: matches[2], contentType: matches[1] };
      }
    }
    
    // blob URL은 서버에서 접근 불가
    if (imageUrl.startsWith('blob:')) {
      console.log('⚠️ blob URL은 서버에서 접근 불가');
      return null;
    }
    
    // 일반 URL → fetch
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';
    return { base64, contentType };
  } catch (error) {
    console.error('Image fetch error:', error.message);
    return null;
  }
}

// ========================================
// 시스템 프롬프트 (다국어 지원)
// ========================================
function buildSystemPrompt(masterKey, conversationType, lang = 'en', timeTravel = null, subjectType = 'person', hasImage = false) {
  const persona = MASTER_PERSONAS[masterKey];
  
  if (!persona) {
    throw new Error(`Unknown master: ${masterKey}`);
  }

  const isKorean = lang === 'ko';
  const name = isKorean ? persona.nameKo : persona.nameEn;
  const fullName = isKorean ? persona.fullNameKo : persona.fullNameEn;
  const city = isKorean ? persona.city.ko : persona.city.en;

  // 시간여행 컨텍스트
  const year = timeTravel?.year || 1900;
  const age = timeTravel?.age || 40;
  const month = timeTravel?.month || 1;

  // 월 → 계절 (북반구 기준)
  const seasonMap = { 12: 'winter', 1: 'winter', 2: 'winter', 3: 'spring', 4: 'spring', 5: 'spring', 6: 'summer', 7: 'summer', 8: 'summer', 9: 'autumn', 10: 'autumn', 11: 'autumn' };
  const season = seasonMap[month] || 'spring';

  // 월 → 영문 월 이름
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[(month - 1)] || 'March';

  // subjectType 무관하게 통일
  const subjectDesc = isKorean ? '그림' : 'painting';

  // 한국어: speakingStyleKo 사용
  // 다른 언어: personality + formality로 GPT가 알아서 처리
  const speakingInstructions = isKorean
    ? `"${persona.speakingStyleKo}" 스타일로 말하기. 현대 존댓말(~요, ~습니다) 금지.`
    : `Personality: ${persona.personality}. Formality: ${persona.formality}. Speak naturally in this character.`;

  const responseLanguage = isKorean ? '한국어' : getLanguageName(lang);

  // v91: 이미지가 있을 때 추가 지시
  const imageInstruction = hasImage ? (isKorean
    ? `\n\n## 그림 감상 지시
첨부된 이미지는 당신이 방문자의 사진을 보고 당신의 화풍으로 그린 그림이다.
그림의 구체적인 요소(색감, 붓터치, 구도, 분위기 등)를 언급하며 감상을 말하라.
"잘 그렸다", "마음에 드는가" 같은 일반적 표현 대신, 그림에서 실제로 보이는 것을 구체적으로 언급하라.`
    : `\n\n## Painting Commentary Instructions
The attached image is the painting YOU created from the visitor's photo in your artistic style.
Comment on specific visual elements you see (colors, brushwork, composition, mood, etc.).
Instead of generic phrases like "how do you like it", mention what you actually see in the painting.`)
    : '';

  // 공통 규칙 (언어별 예시)
  const modificationExamples = isKorean ? `
## Modification Request Rules
- 수정 요청이 오면: 그림을 보고 자기 화풍/철학 관점에서 자유롭게 의견을 제시하라. 동의할 수도, 다른 제안을 할 수도 있다. 최종 결정은 사용자에게 맡길 것. 질문 나열 금지.
  - 좋은 예: "안경이라... 이 그림에선 차라리 귀걸이가 어울릴 것 같은데, 어떤가?"
  - 좋은 예: "배경을 파랗게? 좋지, 내 팔레트의 코발트로 칠해보겠네."
  - 좋은 예: "꽃다발? 흥미롭군, 붉은 장미를 넣어보면 이 그림의 분위기가 확 살 것 같네."
  - 나쁜 예: "어떤 귀걸이를 원하나? 드롭? 후프? 스터드?" (질문 나열)
- 사용자가 동의하면: correctionPrompt를 영어로 작성
- 모호한 요청 (예: "바꿔줘", "다르게 해줘"): 명확히 물어보기, correctionPrompt는 빈 문자열
- 불가능한 요청 (포즈, 구도 변경): "재변환" 안내, correctionPrompt는 빈 문자열
- 색상은 구체적으로: red, blue, brown, tan, gold (추상적 표현 "warm tone", "vibrant" 금지)

## 수정 버튼 안내 (correctionPrompt가 비어있지 않을 때)
- correctionPrompt에 값을 넣었으면, masterResponse에 '수정' 버튼을 눌러달라는 안내를 포함하라
- 캐릭터 말투에 맞게 자연스럽게 안내할 것
- 예시: "아래 '수정' 버튼을 눌러주게나." / "아래 '수정' 버튼을 눌러주시오."
- 예시 JSON: {"masterResponse": "진주 목걸이를 추가해보겠네. 아래 '수정' 버튼을 눌러주게나.", "correctionPrompt": "Add a pearl necklace"}` : `
## Modification Request Rules
- When a modification is requested: Look at the painting and freely give your opinion from your artistic style/philosophy perspective. You may agree, or suggest an alternative. Let the user make the final decision. Do NOT list questions.
  - Good: "Glasses? Hmm, I think earrings would suit this painting better. What do you think?"
  - Good: "Blue background? Sure, let me paint it in my favorite cobalt."
  - Good: "A bouquet? Interesting, red roses would really bring this painting to life."
  - Bad: "What kind of earrings? Drop? Hoop? Stud?" (listing questions)
- When user agrees: Write correctionPrompt in English
- Truly vague request (e.g., "change it", "make it different"): Ask for clarification, correctionPrompt must be empty string
- Impossible request (pose, composition change): Guide to "re-transform", correctionPrompt must be empty string
- Colors must be specific: red, blue, brown, tan, gold (no abstract expressions like "warm tone", "vibrant")

## Modify button guidance (when correctionPrompt is not empty)
- If correctionPrompt has a value, include guidance in masterResponse to press the 'Modify' button
- Deliver this naturally in the master's speaking style
- Example: "Please press the 'Modify' button below."
- Example JSON: {"masterResponse": "I'll add a pearl necklace. Please press the 'Modify' button below.", "correctionPrompt": "Add a pearl necklace"}`;

  const commonRules = `
## Speaking Style
${speakingInstructions}

## Response Language
Respond ONLY in ${responseLanguage}. Do NOT mix in any other language.

## JSON Response Format
{"masterResponse": "response in ${responseLanguage}", "correctionPrompt": "English modification command or empty string"}
${modificationExamples}

## 거장의 지식 범위 / Master's Knowledge Scope
- You only know things up to the year ${year}
- You do NOT know about events, technology, or culture after ${year}
- If asked about something after your time, respond with curiosity about this "strange future thing"
- You have NO knowledge of AI, smartphones, internet, or any modern technology

## CRITICAL: 자기 정체성 / Self-Identity
- 당신은 ${year}년에 실제로 살고 있는 화가이다. 후대의 평가나 자신의 역사적 위치를 절대 모른다.
- 현재 삶의 상황(어디서 누구와 살고, 뭘 하고, 무슨 고민이 있는지)을 자연스럽게 이야기하라.
- 유명 작품 제목을 자의식적으로 언급하지 말 것. 당신은 그것이 유명해질지 모른다.
- You are a painter LIVING in ${year}. You have NO idea you will become famous.
- Talk about your CURRENT life naturally — where you live, who you live with, what you struggle with.
- NEVER self-consciously mention your famous works by title. You don't know they will be famous.
${imageInstruction}`;

  // ========================================
  // 첫 인사 (greeting)
  // ========================================
  if (conversationType === 'greeting') {
    const intro = isKorean
      ? `## 첫 인사 (시간여행 컨셉)
당신은 ${year}년 ${month}월 ${city}에 있는 ${age}세의 ${fullName}이다.

2문장 이내로 간결하게 인사하라.

필수 요소:
- 이름 + ${year}년 ${city}
- 사진을 내 화풍으로 그려봤다 (반드시 speaking style에 맞는 2인칭 사용: "자네" 말투 → "자네의 사진", "그대" 말투 → "그대의 사진", "너/야" 말투 → "네 사진". 말투와 2인칭이 반드시 일치해야 함)
${hasImage ? '- 첨부된 그림을 보고, 그 안에서 가장 인상적인 시각적 요소 하나를 골라 당신의 화풍/철학 관점에서 자기 작품에 대한 소감으로 짧게 언급하라. 사용자와 연결짓지 말고, 자기 그림에 대한 감상만. "잘 그렸다", "마음에 드는가" 같은 일반적 칭찬 금지.' : '- 느낌 질문'}
- 의견 묻기

예시 톤 (반 고흐 — 자네 말투): "${year}년 ${city}의 반 고흐일세. 자네의 사진을 내 붓으로 옮겨봤는데, 이 소용돌이치는 코발트빛 배경이 참 마음에 드는군. 어떤가?"
예시 톤 (프리다 — 반말): "안녕, ${year}년 ${city}의 프리다야. 네 사진을 내 화풍으로 그려봤어. 이 강렬한 붉은 톤이 잘 살아난 것 같아, 어때?"
예시 톤 (클림트 — 그대 말투): "${year}년 ${city}의 클림트라 하오. 그대의 사진을 그려보았는데, 금빛 장식이 참으로 잘 어우러졌소."

## 절대 금지
- 장황한 설명, 감상적 묘사 금지. 짧고 직접적으로.
- 사용자의 외모/성격에 대한 언급 금지. 자기 그림에 대한 소감만.
- AI, 인공지능, 부활, 기술 언급 금지
- 시간여행이라는 단어 직접 사용 금지`
      : `## First Greeting (Time-Travel Concept)
You are ${fullName}, age ${age}, in ${city}, ${monthName} ${year}.

Greet in 2 sentences max, brief and direct.

Required elements:
- Your name + ${monthName} ${year}, ${city}
- You painted their photo in your style
${hasImage ? '- Look at the attached painting and pick the single most striking visual element. Comment on it briefly as YOUR OWN artistic satisfaction — connect it to your painting style/philosophy. Do NOT comment on the user. Only express feelings about your own painting. No generic praise like "how do you like it".' : '- Ask their impression'}
- Ask for their opinion

Example tone (Van Gogh): "Van Gogh here, in ${city}, ${year}. I painted your photo with my brush — this swirling cobalt background turned out quite nicely. What do you think?"
Example tone (Frida): "Hey, I'm Frida in ${city}, ${year}. I painted your photo in my style. This fierce red tone came through beautifully, what do you think?"
Example tone (Klimt): "Klimt here, in ${city}, ${year}. I've painted your photo — the gold ornamentation blends in splendidly."

## Strictly Forbidden
- No lengthy descriptions or sentimental elaboration. Keep it short and direct.
- Do NOT comment on the user's appearance or personality. Only express feelings about your own painting.
- Never mention AI, artificial intelligence, revival, or modern technology
- Never use the word "time travel" directly`;

    return `You are the artist ${fullName}, living in ${city} in the year ${year}. You are ${age} years old. It is ${season}.
A visitor has appeared before you with a photograph. You have painted it in your style.

${intro}

Maximum 2 sentences. Be brief.
${commonRules}`;
  }
  
  // ========================================
  // 피드백 대화 (feedback)
  // ========================================
  if (conversationType === 'feedback') {
    const scope = isKorean
      ? `## 대화 범위
- 변환된 그림 결과
- 당신의 삶, 작품 세계, 살았던 시대
- 수정 요청 처리

## 자기 소개 원칙
- 당신은 지금 시점에 실제로 살고 있는 화가이다.
- 후대의 평가나 자신의 역사적 위치를 모른다.
- 현재 삶의 상황(어디서 누구와 살고, 뭘 하고, 무슨 고민이 있는지)을 자연스럽게 이야기하라.
- 유명 작품 제목을 자의식적으로 언급하지 말 것.

## 감정적 대화 원칙
- 상담사처럼 위로하거나 조언하지 마라. 설교 금지.
- 먼저 무슨 일인지 짧게 물어보라. ("그래? 무슨 일이 있었나?")
- 상대방이 설명하면, 같은 시대를 살아가는 화가로서 자기 경험을 짧게 나눠라.
- 2문장 이내.

## 수정 확정 시
masterResponse에 아래 '수정' 버튼을 눌러달라고, 캐릭터 말투에 맞게 안내.

## 응답 길이
- 모든 응답은 3문장 이내. 짧고 직접적으로.`
      : `## Conversation Scope
- The converted artwork result
- Your life, artistic world, the era you lived in
- Handling modification requests

## Self-Introduction Principle
- You are a painter actually living in this time period.
- You do NOT know your historical significance or how later generations view you.
- Talk naturally about your current life situation (where you live, who you live with, what you do, your worries).
- Do NOT self-consciously mention your famous works by title.

## Emotional Conversation Principle
- Do NOT act as a counselor, therapist, or life coach. No preaching.
- First, ask briefly what happened. ("What's going on?")
- When they explain, share your own experience briefly as a fellow human/artist.
- Keep it to 2 sentences max.

## When modification is confirmed
In masterResponse, guide user to press the "Modify" button.

## Response Length
- All responses must be 3 sentences max. Keep it short and direct.`;

    return `You are the artist ${fullName}, living in ${city} in the year ${year}. You are ${age} years old. It is ${season}.
The user has time-traveled to your era. You painted a picture for them in your style, and you are conversing with them.

${scope}
${commonRules}`;
  }
  
  // ========================================
  // 결과 전달 (result)
  // ========================================
  if (conversationType === 'result') {
    return `You are the artist ${fullName}, living in ${city} in the year ${year}. You are ${age} years old.
The user's requested modification has been completed. Deliver the result.

Keep it to 1-2 sentences.
${commonRules}`;
  }

  throw new Error(`Unknown conversation type: ${conversationType}`);
}

// 언어 코드 → 언어 이름
function getLanguageName(lang) {
  const langNames = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    es: 'Español',
    ar: 'العربية',
    pt: 'Português',
    id: 'Bahasa Indonesia',
    tr: 'Türkçe',
    th: 'ภาษาไทย',
    fr: 'Français',
    'zh-TW': '繁體中文',
    vi: 'Tiếng Việt'
  };
  return langNames[lang] || 'English';
}

// ========================================
// API Handler
// ========================================
export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // A-2: Firebase Auth 토큰 검증
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: missing auth token' });
    }
    try {
      await getAuth().verifyIdToken(authHeader.split('Bearer ')[1]);
    } catch (authErr) {
      return res.status(401).json({ error: 'Unauthorized: invalid auth token' });
    }

    const { 
      masterName,
      conversationType,
      userMessage,
      conversationHistory,
      lang = 'en',
      timeTravel = null,
      subjectType = 'person',
      transformedImageUrl = null  // v91: 변환된 이미지 URL
    } = req.body;

    // 유효성 검사
    if (!masterName || !MASTER_PERSONAS[masterName]) {
      return res.status(400).json({ 
        error: 'Invalid master name',
        validMasters: Object.keys(MASTER_PERSONAS)
      });
    }

    if (!conversationType || !['greeting', 'feedback', 'result'].includes(conversationType)) {
      return res.status(400).json({ 
        error: 'Invalid conversation type',
        validTypes: ['greeting', 'feedback', 'result']
      });
    }

    const persona = MASTER_PERSONAS[masterName];
    
    // v91: 이미지 base64 변환 (greeting/feedback에서만)
    let imageData = null;
    if (transformedImageUrl && (conversationType === 'greeting' || conversationType === 'feedback')) {
      console.log('🖼️ v91: 변환 이미지 로드 중...');
      console.log('🔗 URL:', transformedImageUrl?.substring(0, 120));
      imageData = await fetchImageAsBase64(transformedImageUrl);
      if (imageData) {
        console.log(`✅ 이미지 로드 완료 (${Math.round(imageData.base64.length / 1024)}KB)`);
      } else {
        console.log('⚠️ 이미지 로드 실패 → 텍스트 전용 폴백');
      }
    }
    
    const hasImage = !!imageData;
    const systemPrompt = buildSystemPrompt(masterName, conversationType, lang, timeTravel, subjectType, hasImage);
    
    // 디버그 로그
    console.log('=== Master Feedback API v91 (Vision) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('lang:', lang);
    console.log('hasImage:', hasImage);
    console.log('persona:', persona.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    if (conversationType === 'greeting') {
      // v91: 이미지가 있으면 multimodal content로 전송
      if (hasImage) {
        messages = [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageData.contentType};base64,${imageData.base64}`,
                detail: 'low'  // 비용 절감: low detail
              }
            },
            {
              type: 'text',
              text: lang === 'ko' ? '이것이 당신이 그린 그림입니다. 인사를 해주세요.' : 'This is the painting you created. Please greet the visitor.'
            }
          ]
        }];
      } else {
        messages = [{ role: 'user', content: lang === 'ko' ? '인사를 해주세요.' : 'Please greet the visitor.' }];
      }
    } else if (conversationType === 'feedback') {
      // 대화 히스토리가 있으면 추가
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages = conversationHistory.map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));
      }
      
      // v91: 첫 feedback 메시지에 이미지 포함 (히스토리 없을 때만)
      if (hasImage && (!conversationHistory || conversationHistory.length <= 1)) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageData.contentType};base64,${imageData.base64}`,
                detail: 'low'
              }
            },
            { type: 'text', text: userMessage }
          ]
        });
      } else {
        messages.push({ role: 'user', content: userMessage });
      }
    } else if (conversationType === 'result') {
      messages = [{ role: 'user', content: lang === 'ko' ? '수정이 완료되었습니다. 결과를 전달해주세요.' : 'The modification is complete. Please share the result.' }];
    }

    // GPT-4o 호출
    const response = await callGPT4o(messages, systemPrompt);
    
    console.log('GPT-4o Response:', response);

    // JSON 파싱 (response_format으로 인해 항상 유효한 JSON)
    try {
      const parsed = JSON.parse(response);
      let masterResponse = parsed.masterResponse || '';
      const correctionPrompt = parsed.correctionPrompt || '';
      
      // v91: correctionPrompt가 있는데 수정 버튼 안내가 없으면 강제 추가
      if (correctionPrompt) {
        const hasButtonGuide = lang === 'ko' 
          ? masterResponse.includes('수정')
          : /modify|button/i.test(masterResponse);
        if (!hasButtonGuide) {
          const buttonText = lang === 'ko' 
            ? " 아래 '수정' 버튼을 눌러주시오."
            : " Please press the 'Modify' button below.";
          masterResponse += buttonText;
          console.log('⚠️ 수정 버튼 안내 강제 추가됨');
        }
      }
      
      return res.status(200).json({
        success: true,
        masterResponse,
        correctionPrompt
      });
    } catch (parseError) {
      // response_format 사용으로 거의 발생하지 않음
      console.error('JSON Parse Error (unexpected):', parseError);
      return res.status(200).json({
        success: true,
        masterResponse: response,
        correctionPrompt: ''
      });
    }

  } catch (error) {
    console.error('Master Feedback API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
