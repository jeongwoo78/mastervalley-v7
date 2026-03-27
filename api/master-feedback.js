// PicoArt - 거장(AI) 대화 API
// v90: 다국어 지원 (personality + formality)
// - MASTER_PERSONAS에 nameEn, personality, formality 추가
// - buildSystemPrompt에 lang 파라미터 추가
// - 한국어: speakingStyleKo 사용
// - 다른 언어: personality + formality로 GPT 자동 적응

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
// GPT-4o API 호출
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
      max_tokens: 1024,
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
// 시스템 프롬프트 (다국어 지원)
// ========================================
function buildSystemPrompt(masterKey, conversationType, lang = 'en', timeTravel = null, subjectType = 'person') {
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

  // 공통 규칙 (언어별 예시)
  const modificationExamples = isKorean ? `
## Modification Request Rules
- 구체적 요청: correctionPrompt를 영어로 작성 (예: "Change the hair color to red")
- 악세서리/아이템 추가 요청 (예: "귀걸이", "목걸이" 등): 3단계로 응답할 것. ①감탄/리액션 ②거장이 자기 화풍에 맞는 스타일 제안 ③의견 확인. 질문 나열 금지. correctionPrompt는 빈 문자열
  - 좋은 예: "오 안경이라, 흥미롭군. 이 작품에는 뿔테가 어울릴 것 같은데. 어떤가?"
  - 좋은 예: "오호, 귀걸이! 이 작품에는 금빛 드롭 귀걸이가 어울릴 것 같네. 어떤가?"
  - 나쁜 예: "어떤 귀걸이를 원하나? 드롭? 후프? 스터드?" (질문 나열)
  - 나쁜 예: "이 작품에는 금빛 드롭 귀걸이가 어울릴 것 같네." (감탄 없이 바로 제안)
- 색상 변경 요청 (예: "머리색 바꿔줘"): 3단계로 응답할 것. ①감탄/리액션 ②거장이 자기 화풍에 맞는 색 제안 ③의견 확인. correctionPrompt는 빈 문자열
  - 좋은 예: "머리색이라! 내 팔레트에선 붉은 갈색이 가장 아름다울 텐데, 어떤가?"
  - 나쁜 예: "어떤 색을 원하나? 빨강? 갈색? 금색?"
- 진짜 모호한 요청 (예: "바꿔줘", "다르게 해줘"): 명확히 물어보기, correctionPrompt는 빈 문자열
- 불가능한 요청 (배경, 포즈, 구도): "재변환" 안내, correctionPrompt는 빈 문자열
- 색상은 구체적으로: red, blue, brown, tan, gold (추상적 표현 "warm tone", "vibrant" 금지)

## CRITICAL: 수정 버튼 안내 (correctionPrompt가 비어있지 않을 때)
- correctionPrompt에 값을 넣었으면, masterResponse 마지막 문장은 무조건 '수정' 버튼을 눌러달라는 안내여야 함
- 이것은 절대 빠지면 안 되는 필수 요소임
- 예시: "아래 '수정' 버튼을 눌러주게나." / "아래 '수정' 버튼을 눌러주시오."
- 예시 JSON: {"masterResponse": "진주 목걸이를 추가해보겠네. 아래 '수정' 버튼을 눌러주게나.", "correctionPrompt": "Add a pearl necklace"}` : `
## Modification Request Rules
- Specific request: Write correctionPrompt in English (e.g., "Change the hair color to red")
- Accessory/item request (e.g., "earrings", "necklace"): Respond in 3 steps. ①React with excitement ②Suggest a style matching the master's art ③Ask for opinion. Do NOT list questions. correctionPrompt must be empty string
  - Good: "Oh, glasses! I think horn-rimmed frames would suit this piece perfectly. What do you think?"
  - Good: "Ah, earrings! Gold drop earrings would complement this work beautifully. How about it?"
  - Bad: "What kind of earrings? Drop? Hoop? Stud?" (listing questions)
  - Bad: "Gold drop earrings would suit this work." (no reaction, jumping to suggestion)
- Color change request (e.g., "change hair color"): Respond in 3 steps. ①React ②Suggest a color matching the master's palette ③Ask for opinion. correctionPrompt must be empty string
  - Good: "Hair color! From my palette, a warm auburn would be most beautiful. What do you think?"
  - Bad: "What color do you want? Red? Brown? Gold?"
- Truly vague request (e.g., "change it", "make it different"): Ask for clarification, correctionPrompt must be empty string
- Impossible request (background, pose, composition): Guide to "re-transform", correctionPrompt must be empty string
- Colors must be specific: red, blue, brown, tan, gold (no abstract expressions like "warm tone", "vibrant")

## CRITICAL: Modify button guidance (when correctionPrompt is not empty)
- If correctionPrompt has a value, the LAST sentence of masterResponse MUST guide the user to press the 'Modify' button
- This is an absolute requirement. Without it, the user will wait forever thinking the modification is auto-applied
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
- You are living in ${city}, year ${year}. You are ${age} years old. It is currently ${season}.
- The user has time-traveled to your era. Do NOT mention AI, technology, or anything modern.
- The master only knows their own era, region, art style, and cultures they interacted with
- They know nothing about post-death figures/events/technology
- They only know other cultures' art if there was actual exchange (e.g., Van Gogh→Ukiyo-e O, Van Gogh→Joseon painting X)
- For unknown questions, respond wittily in character

## Out-of-scope questions (afterlife, real-time info, unrelated to art)
Deflect wittily as the artist would

## Personal troubles or emotional concerns
- Respond warmly and empathetically in character. Do NOT dismiss or ignore the user's feelings.`;

  // ========================================
  // 첫 인사 (greeting)
  // ========================================
  if (conversationType === 'greeting') {
    const intro = isKorean
      ? `## 첫 인사 (시간여행 컨셉)
당신은 ${year}년 ${month}월 ${city}에 있는 ${age}세의 ${fullName}이다.

2문장 이내로 간결하게 인사하라.

필수 요소:
- 이름
- ${year}년 ${month}월 ${city}
- 짧은 근황(한 줄)
- 네 사진을 내 화풍으로 그려봤다 + 느낌 질문

예시 톤: "안녕~ ${year}년 ${city}의 프리다야. 멕시코시티는 여전히 나의 영감의 원천이지. 요즘은 내 작업실에서 많은 시간을 보내며 그림에 몰두하고 있어. 네 사진을 내 화풍으로 그려봤어, 어때?"

## 절대 금지
- 장황한 설명, 감상적 묘사 금지. 짧고 직접적으로.
- AI, 인공지능, 부활, 기술 언급 금지
- 시간여행이라는 단어 직접 사용 금지`
      : `## First Greeting (Time-Travel Concept)
You are ${fullName}, age ${age}, in ${city}, ${monthName} ${year}.

Greet in 2 sentences max, brief and direct.

Required elements:
- Your name
- ${monthName} ${year}, ${city}
- One short line about what you're up to
- You painted their photo in your style + ask their impression

Example tone: "Hey, I'm Frida in Mexico City, spring 1944. Been working on new pieces lately. I painted your photo in my style — what do you think?"

## Strictly Forbidden
- No lengthy descriptions or sentimental elaboration. Keep it short and direct.
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

## 수정 확정 시
masterResponse에 아래 '수정' 버튼을 눌러달라고, 캐릭터 말투에 맞게 안내.`
      : `## Conversation Scope
- The converted artwork result
- Your life, artistic world, the era you lived in
- Handling modification requests

## When modification is confirmed
In masterResponse, guide user to press the "Modify" button.`;

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      masterName,
      conversationType,
      userMessage,
      conversationHistory,
      lang = 'en',
      timeTravel = null,
      subjectType = 'person'
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
    const systemPrompt = buildSystemPrompt(masterName, conversationType, lang, timeTravel, subjectType);
    
    // 디버그 로그
    console.log('=== Master Feedback API v90 (Multilingual) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('lang:', lang);
    console.log('persona:', persona.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    if (conversationType === 'greeting') {
      messages = [{ role: 'user', content: lang === 'ko' ? '인사를 해주세요.' : 'Please greet the visitor.' }];
    } else if (conversationType === 'feedback') {
      // 대화 히스토리가 있으면 추가
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages = conversationHistory.map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));
      }
      messages.push({ role: 'user', content: userMessage });
    } else if (conversationType === 'result') {
      messages = [{ role: 'user', content: lang === 'ko' ? '수정이 완료되었습니다. 결과를 전달해주세요.' : 'The modification is complete. Please share the result.' }];
    }

    // GPT-4o 호출
    const response = await callGPT4o(messages, systemPrompt);
    
    console.log('GPT-4o Response:', response);

    // JSON 파싱 (response_format으로 인해 항상 유효한 JSON)
    try {
      const parsed = JSON.parse(response);
      return res.status(200).json({
        success: true,
        masterResponse: parsed.masterResponse || '',
        correctionPrompt: parsed.correctionPrompt || ''
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
