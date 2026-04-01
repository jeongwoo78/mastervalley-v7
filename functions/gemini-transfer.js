// ========================================
// Master Valley - Gemini Transfer v2.0
// 2콜 분리: 텍스트 분석 (화가 선택) + 이미지 생성 (변환)
// 1콜 통합 대비 화풍 적용 강도 대폭 향상
// ========================================
// 모델: gemini-3.1-flash-image-preview (Nano Banana 2)
// 해상도: 1K (~1024px)
// ========================================

import {
  getPrompt,
  getMasterworkGuideForAI,
  getArtistMasterworkList,
  getMovementMasterworkGuide,
  getArtistMasterworkGuide,
  masterworkNameMapping,
  ARTIST_STYLES,
  getArtistStyle,
  getArtistStyleByName
} from './data/art-api-prompts.js';


// ========================================
// 🛡️ NSFW 방어 + 매력 조항
// ========================================
const SAFETY_AND_STYLE_RULES = `RULES:
- Unless the art style specifically requires costume transformation, preserve the original clothing exactly.
- No additional skin exposure beyond the original photo.
- Preserve the subject's identity, gender, and ethnicity exactly.
- Preserve subject count exactly (1 person → 1 person in result).

ATTRACTIVE ENHANCEMENT (apply based on subject's apparent age):
- Baby: cherubic, angelic, rosy glowing cheeks
- Child: bright-eyed, carefree, radiant innocent smile
- Teen/Young adult: fresh youthful energy, flattering portrait true to age
- Adult (30-40s): mature confident charisma, flattering portrait true to age
- Middle-aged (50-60s): graceful seasoned dignity, true to age
- Elderly (70+): wise timeless dignity, true to age
- Animal: beautiful, majestic, or endearing
- Landscape/Object: clean polished composition
EXCEPTION: If art style requires distortion (Munch's Scream, Picasso's Cubism), prioritize art style over attractiveness.`;


// ========================================
// 💬 리히텐슈타인 말풍선 텍스트
// ========================================
const LICHTENSTEIN_SPEECH_BUBBLES = {
  excited: ["WOW!", "AMAZING!", "INCREDIBLE!", "PERFECT!", "YES!", "BEST DAY EVER!", "I CAN'T BELIEVE IT!", "WE DID IT!", "SO EXCITING!", "NOTHING STOPS US!"],
  romantic: ["I LOVE YOU!", "KISS ME!", "MY DARLING!", "YOU'RE THE ONE!", "THIS MOMENT!", "ONLY FOR YOU!", "NEVER LET GO!", "YOU'RE EVERYTHING!", "STAY FOREVER!", "LIKE A DREAM!"],
  dramatic: ["I CAN'T BELIEVE IT!", "HOW COULD YOU?!", "IT'S OVER!", "I DON'T CARE!", "WHY ME?!", "I SHOULD'VE KNOWN!", "EVERYTHING CHANGED!", "NOT LIKE THIS!", "WATCH ME!"],
  dialogue: ["MAYBE TOMORROW...", "WHAT HAPPENS NEXT?", "THEY SAID NO!", "WAIT HERE!", "DO SOMETHING!", "JUST WHAT I NEEDED!", "THIS CHANGES EVERYTHING!"],
  surprised: ["WHAT?!", "OH MY!", "REALLY?!", "WAIT... WHAT?!", "NO WAY!", "COULD IT BE?!", "WHAT HAPPENED?!"]
};

function selectSpeechBubbleText() {
  const categories = Object.keys(LICHTENSTEIN_SPEECH_BUBBLES);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const texts = LICHTENSTEIN_SPEECH_BUBBLES[category];
  return texts[Math.floor(Math.random() * texts.length)];
}


// ========================================
// 🎯 가중치 테이블
// ========================================
const ARTIST_WEIGHTS = {
  modernism: {
    portrait: [{ name: 'LICHTENSTEIN', weight: 33 }, { name: 'CHAGALL', weight: 33 }, { name: 'PICASSO', weight: 34 }],
    couple: [{ name: 'CHAGALL', weight: 35 }, { name: 'LICHTENSTEIN', weight: 35 }, { name: 'PICASSO', weight: 30 }],
    group: [{ name: 'CHAGALL', weight: 35 }, { name: 'LICHTENSTEIN', weight: 35 }, { name: 'PICASSO', weight: 30 }],
    landscape: [{ name: 'CHAGALL', weight: 40 }, { name: 'PICASSO', weight: 20 }, { name: 'MIRÓ', weight: 40 }],
    stillLife: [{ name: 'PICASSO', weight: 20 }, { name: 'LICHTENSTEIN', weight: 40 }, { name: 'MIRÓ', weight: 40 }],
    default: [{ name: 'CHAGALL', weight: 35 }, { name: 'LICHTENSTEIN', weight: 35 }, { name: 'PICASSO', weight: 30 }]
  },
  renaissance: {
    portrait: [{ name: 'BOTTICELLI', weight: 30 }, { name: 'LEONARDO DA VINCI', weight: 25 }, { name: 'TITIAN', weight: 25 }, { name: 'RAPHAEL', weight: 20 }],
    femaleFace: [{ name: 'BOTTICELLI', weight: 50 }, { name: 'LEONARDO DA VINCI', weight: 30 }, { name: 'RAPHAEL', weight: 20 }],
    maleFace: [{ name: 'BOTTICELLI', weight: 23 }, { name: 'TITIAN', weight: 23 }, { name: 'RAPHAEL', weight: 22 }, { name: 'LEONARDO DA VINCI', weight: 22 }, { name: 'MICHELANGELO', weight: 10 }],
    landscape: [{ name: 'TITIAN', weight: 30 }, { name: 'LEONARDO DA VINCI', weight: 20 }, { name: 'BOTTICELLI', weight: 20 }, { name: 'RAPHAEL', weight: 15 }, { name: 'MICHELANGELO', weight: 15 }],
    default: [{ name: 'BOTTICELLI', weight: 20 }, { name: 'LEONARDO DA VINCI', weight: 20 }, { name: 'TITIAN', weight: 20 }, { name: 'RAPHAEL', weight: 20 }, { name: 'MICHELANGELO', weight: 20 }]
  },
  baroque: {
    portrait: [{ name: 'CARAVAGGIO', weight: 45 }, { name: 'REMBRANDT', weight: 35 }, { name: 'VELÁZQUEZ', weight: 12 }, { name: 'RUBENS', weight: 8 }],
    elderly: [{ name: 'REMBRANDT', weight: 70 }, { name: 'CARAVAGGIO', weight: 20 }, { name: 'VELÁZQUEZ', weight: 10 }],
    couple: [{ name: 'RUBENS', weight: 60 }, { name: 'REMBRANDT', weight: 25 }, { name: 'CARAVAGGIO', weight: 15 }],
    group: [{ name: 'RUBENS', weight: 50 }, { name: 'REMBRANDT', weight: 30 }, { name: 'CARAVAGGIO', weight: 20 }],
    default: [{ name: 'CARAVAGGIO', weight: 35 }, { name: 'REMBRANDT', weight: 30 }, { name: 'VELÁZQUEZ', weight: 20 }, { name: 'RUBENS', weight: 15 }]
  },
  rococo: {
    outdoor: [{ name: 'WATTEAU', weight: 70 }, { name: 'BOUCHER', weight: 30 }],
    default: [{ name: 'BOUCHER', weight: 70 }, { name: 'WATTEAU', weight: 30 }]
  },
  medieval: {
    default: [{ name: 'BYZANTINE', weight: 50 }, { name: 'GOTHIC', weight: 20 }, { name: 'ISLAMIC MINIATURE', weight: 30 }]
  },
  neoclassicism_vs_romanticism_vs_realism: {
    portrait: [{ name: 'INGRES', weight: 35 }, { name: 'MANET', weight: 35 }, { name: 'JACQUES-LOUIS DAVID', weight: 30 }],
    movement: [{ name: 'DELACROIX', weight: 60 }, { name: 'JACQUES-LOUIS DAVID', weight: 25 }, { name: 'TURNER', weight: 15 }],
    landscape: [{ name: 'TURNER', weight: 50 }, { name: 'DELACROIX', weight: 20 }, { name: 'COURBET', weight: 20 }, { name: 'MANET', weight: 10 }],
    default: [{ name: 'JACQUES-LOUIS DAVID', weight: 20 }, { name: 'DELACROIX', weight: 20 }, { name: 'TURNER', weight: 20 }, { name: 'MANET', weight: 15 }, { name: 'COURBET', weight: 15 }, { name: 'INGRES', weight: 10 }]
  },
  ancient: {
    indoor: [{ name: 'CLASSICAL SCULPTURE', weight: 80 }, { name: 'ROMAN MOSAIC', weight: 20 }],
    outdoor: [{ name: 'ROMAN MOSAIC', weight: 80 }, { name: 'CLASSICAL SCULPTURE', weight: 20 }],
    sports: [{ name: 'CLASSICAL SCULPTURE', weight: 90 }, { name: 'ROMAN MOSAIC', weight: 10 }],
    animal: [{ name: 'ROMAN MOSAIC', weight: 100 }],
    default: [{ name: 'CLASSICAL SCULPTURE', weight: 50 }, { name: 'ROMAN MOSAIC', weight: 50 }]
  },
  impressionism: {
    portrait: [{ name: 'RENOIR', weight: 35 }, { name: 'MONET', weight: 30 }, { name: 'CAILLEBOTTE', weight: 35 }],
    movement: [{ name: 'DEGAS', weight: 50 }, { name: 'RENOIR', weight: 30 }, { name: 'MONET', weight: 15 }, { name: 'CAILLEBOTTE', weight: 5 }],
    landscape_nature: [{ name: 'MONET', weight: 85 }, { name: 'RENOIR', weight: 15 }],
    landscape_urban: [{ name: 'CAILLEBOTTE', weight: 70 }, { name: 'MONET', weight: 30 }],
    default: [{ name: 'RENOIR', weight: 35 }, { name: 'MONET', weight: 35 }, { name: 'CAILLEBOTTE', weight: 20 }, { name: 'DEGAS', weight: 10 }]
  },
  postImpressionism: {
    portrait: [{ name: 'VAN GOGH', weight: 50 }, { name: 'GAUGUIN', weight: 50 }],
    landscape: [{ name: 'VAN GOGH', weight: 35 }, { name: 'GAUGUIN', weight: 35 }, { name: 'CÉZANNE', weight: 30 }],
    stillLife: [{ name: 'CÉZANNE', weight: 60 }, { name: 'VAN GOGH', weight: 20 }, { name: 'GAUGUIN', weight: 20 }],
    default: [{ name: 'VAN GOGH', weight: 35 }, { name: 'GAUGUIN', weight: 35 }, { name: 'CÉZANNE', weight: 30 }]
  },
  fauvism: {
    portrait: [{ name: 'MATISSE', weight: 45 }, { name: 'DERAIN', weight: 30 }, { name: 'VLAMINCK', weight: 25 }],
    landscape: [{ name: 'DERAIN', weight: 45 }, { name: 'VLAMINCK', weight: 35 }, { name: 'MATISSE', weight: 20 }],
    default: [{ name: 'MATISSE', weight: 35 }, { name: 'DERAIN', weight: 35 }, { name: 'VLAMINCK', weight: 30 }]
  },
  expressionism: {
    portrait: [{ name: 'MUNCH', weight: 40 }, { name: 'KOKOSCHKA', weight: 35 }, { name: 'KIRCHNER', weight: 25 }],
    landscape: [{ name: 'MUNCH', weight: 45 }, { name: 'KIRCHNER', weight: 35 }, { name: 'KOKOSCHKA', weight: 20 }],
    urban: [{ name: 'KIRCHNER', weight: 50 }, { name: 'KOKOSCHKA', weight: 30 }, { name: 'MUNCH', weight: 20 }],
    default: [{ name: 'MUNCH', weight: 40 }, { name: 'KOKOSCHKA', weight: 35 }, { name: 'KIRCHNER', weight: 25 }]
  }
};

function weightsToPromptText(categoryKey) {
  const weights = ARTIST_WEIGHTS[categoryKey];
  if (!weights) return '';
  let text = '\nARTIST SELECTION WEIGHTS:\n';
  for (const [photoType, artists] of Object.entries(weights)) {
    const label = photoType.replace('femaleFace', 'Female portrait').replace('maleFace', 'Male portrait').replace('portrait', 'Single portrait').replace('couple', 'Couple').replace('group', 'Group 3+').replace('landscape_nature', 'Natural landscape').replace('landscape_urban', 'Urban landscape').replace('landscape', 'Landscape').replace('stillLife', 'Still life').replace('movement', 'Action/sports').replace('elderly', 'Elderly').replace('outdoor', 'Outdoor').replace('indoor', 'Indoor').replace('sports', 'Sports').replace('animal', 'Animals').replace('urban', 'Urban').replace('default', 'Default');
    const artistStr = artists.map(a => `${a.name} ${a.weight}%`).join(', ');
    text += `- ${label}: ${artistStr}\n`;
  }
  return text;
}


// ========================================
// 사조별 가이드라인 (화가 선택용)
// ========================================
function getMovementGuidelines(categoryType) {
  const guidelines = {
    'ancient': `STYLES: CLASSICAL SCULPTURE or ROMAN MOSAIC
- SPORTS/ACTION → SCULPTURE (white marble)
- INDOOR PORTRAITS → SCULPTURE
- OUTDOOR/LANDSCAPE/ANIMALS → ROMAN MOSAIC (large tesserae, dark grout)`,
    'medieval': `STYLES: BYZANTINE, GOTHIC, ISLAMIC MINIATURE
- ANIMALS → ISLAMIC MINIATURE
- PEOPLE → ISLAMIC MINIATURE 50% or BYZANTINE 50%
- LANDSCAPE/BUILDING → GOTHIC STAINED GLASS`,
    'renaissance': `ARTISTS: BOTTICELLI, LEONARDO DA VINCI, TITIAN, MICHELANGELO, RAPHAEL
- Female → BOTTICELLI primary, Mysterious → LEONARDO, Male → TITIAN, Athletic male → MICHELANGELO, Groups → RAPHAEL`,
    'baroque': `ARTISTS: CARAVAGGIO, RUBENS, REMBRANDT, VELÁZQUEZ
- Single portrait → CARAVAGGIO, Elderly → REMBRANDT, Couples/groups → RUBENS, Formal → VELÁZQUEZ`,
    'rococo': `ARTISTS: WATTEAU, BOUCHER
- Outdoor → WATTEAU, Indoor → BOUCHER`,
    'neoclassicism_vs_romanticism_vs_realism': `ARTISTS: DAVID, INGRES, TURNER, DELACROIX, COURBET, MANET
- Formal → DAVID, Elegant female → INGRES, Landscape → TURNER, Action → DELACROIX, Rural → COURBET, Urban → MANET`,
    'impressionism': `ARTISTS: RENOIR, MONET, DEGAS, CAILLEBOTTE
- Female/child → RENOIR, Male → CAILLEBOTTE, Nature landscape → MONET, Urban → CAILLEBOTTE, Dance/movement → DEGAS`,
    'postImpressionism': `ARTISTS: VAN GOGH, GAUGUIN, CÉZANNE
- Portraits → VAN GOGH or GAUGUIN (NEVER Cézanne!), Still life → CÉZANNE`,
    'fauvism': `ARTISTS: MATISSE, DERAIN, VLAMINCK
- Portraits → MATISSE, Landscapes → DERAIN, Dramatic → VLAMINCK`,
    'expressionism': `ARTISTS: MUNCH, KOKOSCHKA, KIRCHNER
- Emotional → MUNCH, Psychological → KOKOSCHKA, Urban → KIRCHNER`,
    'modernism': `ARTISTS: PICASSO, MIRÓ, CHAGALL, LICHTENSTEIN
- Portraits → PICASSO/CHAGALL/LICHTENSTEIN, MIRÓ for LANDSCAPE/STILL LIFE ONLY, Couples → CHAGALL`
  };
  return guidelines[categoryType] || '';
}


// ========================================
// 대표작 키 변환
// ========================================
function convertToWorkKey(artistName, workTitle) {
  if (!artistName || !workTitle) return null;
  return masterworkNameMapping[workTitle.toLowerCase().trim()] || null;
}


// ========================================
// 🚀 Gemini API 호출 (공통)
// ========================================
const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_RETRIES = 3;

// 1콜: 텍스트 분석 (화가/대표작 선택)
async function callGeminiTextAnalysis(base64Image, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                { text: prompt }
              ]
            }],
            generationConfig: {
              responseModalities: ['TEXT']
            }
          })
        }
      );
      
      if (!response.ok) {
        const errText = await response.text();
        if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, 2000 * attempt)); continue; }
        throw new Error(`Gemini text API error: ${response.status} - ${errText}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text;
      
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// 2콜: 이미지 생성 (변환)
async function callGeminiImageGeneration(base64Image, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🎨 Gemini 이미지 생성 (시도 ${attempt}/${MAX_RETRIES})...`);
      
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                { text: prompt }
              ]
            }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT'],
              imageSize: '1K'
            }
          })
        }
      );
      
      if (!response.ok) {
        const errText = await response.text();
        if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, 3000 * attempt)); continue; }
        throw new Error(`Gemini image API error: ${response.status} - ${errText}`);
      }
      
      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
      
      if (!imagePart) throw new Error('No image in Gemini response');
      
      console.log(`✅ Gemini 이미지 생성 완료`);
      return {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        text: parts.find(p => p.text)?.text || null
      };
      
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
      console.log(`⚠️ 재시도 ${attempt}: ${err.message}`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}


// ========================================
// 📋 1콜: 화가/스타일 선택 프롬프트 조립
// ========================================
function buildSelectionPrompt(selectedStyle) {
  const categoryType = (selectedStyle.category === 'movements') ? selectedStyle.id : selectedStyle.category;
  const categoryName = selectedStyle.name;
  
  // === 거장 모드 ===
  if (categoryType === 'masters') {
    const masterId = selectedStyle.id.replace('-master', '');
    const masterWorks = getArtistMasterworkGuide(masterId);
    
    if (masterWorks) {
      return `Analyze this photo and select the BEST masterwork from ${categoryName}'s collection.

AVAILABLE MASTERWORKS:
${masterWorks}

RULES:
- Single person → NEVER select "The Kiss" (requires couple)
- Parent with child → NEVER select "The Kiss"
- Analyze: subject type, gender, age, mood, composition

Return ONLY valid JSON:
{"selected_artist": "${categoryName}", "selected_work": "exact title", "reason": "why"}`;
    }
    return null; // 대표작 가이드 없음 → 바로 화풍 적용
  }
  
  // === 동양화 모드 ===
  if (categoryType === 'oriental') {
    const styleId = selectedStyle.id;
    if (styleId === 'korean') {
      return `Analyze this photo and select the best Korean traditional painting style.
Options: MINHWA (animals/flowers/folk), PUNGSOKDO (people/portraits/daily life), JINGYEONG (mountains/landscapes)
Return ONLY valid JSON:
{"selected_style": "minhwa" or "pungsokdo" or "jingyeong", "calligraphy_text": "1-4 Korean/Chinese characters", "reason": "why"}`;
    }
    if (styleId === 'chinese') {
      return `Analyze this photo and select the best Chinese traditional painting style.
Options: SHUIMOHUA (ink wash, landscapes), GONGBI (meticulous court painting, people/animals)
Return ONLY valid JSON:
{"selected_style": "shuimohua" or "gongbi", "calligraphy_text": "1-4 Chinese characters", "reason": "why"}`;
    }
    if (styleId === 'japanese') {
      return `Analyze this photo and select the best Japanese traditional art style.
Options: UKIYOE (woodblock print, people/landscapes), RINPA (decorative, flowers/birds)
For UKIYOE sub-styles: bijin-ga (women), yakusha-e (men), meisho-e (landscapes)
Return ONLY valid JSON:
{"selected_style": "ukiyoe" or "rinpa", "calligraphy_text": "1-4 Japanese characters", "reason": "why"}`;
    }
  }
  
  // === 미술사조 모드 ===
  const guidelines = getMovementGuidelines(categoryType);
  const weights = weightsToPromptText(categoryType);
  const masterworkGuide = getMovementMasterworkGuide(categoryType) || '';
  
  return `Analyze this photo and select the BEST ${categoryName} artist and masterwork.

${guidelines}

${weights}

${masterworkGuide}

Analyze: subject type, gender, age, background, mood.
Follow the weight ratios above.

Return ONLY valid JSON:
{"selected_artist": "Artist Name", "selected_work": "masterwork title or null", "reason": "why"}`;
}


// ========================================
// 🎨 2콜: 변환 프롬프트 조립
// ========================================
function buildTransformPrompt(selectedStyle, selectionResult) {
  const categoryType = (selectedStyle.category === 'movements') ? selectedStyle.id : selectedStyle.category;
  
  let stylePrompt = '';
  let masterworkPrompt = '';
  let selectedArtist = '';
  let selectedWork = '';
  let extraInstructions = '';
  
  // === 거장 모드 ===
  if (categoryType === 'masters') {
    const masterId = selectedStyle.id.replace('-master', '');
    selectedArtist = selectedStyle.name;
    
    stylePrompt = getArtistStyle(masterId) || '';
    
    if (selectionResult?.selected_work) {
      selectedWork = selectionResult.selected_work;
      const workKey = convertToWorkKey(selectedArtist, selectedWork);
      if (workKey) {
        const work = getPrompt(workKey);
        if (work) masterworkPrompt = work.prompt;
      }
    }
  }
  // === 동양화 모드 ===
  else if (categoryType === 'oriental') {
    const subStyle = selectionResult?.selected_style;
    if (subStyle && ARTIST_STYLES[subStyle]) {
      stylePrompt = ARTIST_STYLES[subStyle];
      selectedArtist = subStyle;
    } else {
      stylePrompt = ARTIST_STYLES[selectedStyle.id] || '';
      selectedArtist = selectedStyle.id;
    }
    
    if (selectionResult?.calligraphy_text) {
      extraInstructions = ` Include calligraphy text '${selectionResult.calligraphy_text}' in the painting.`;
    }
  }
  // === 미술사조 모드 ===
  else {
    const artistName = selectionResult?.selected_artist;
    selectedArtist = artistName || '';
    selectedWork = selectionResult?.selected_work || '';
    
    if (artistName) {
      stylePrompt = getArtistStyleByName(artistName) || '';
    }
    
    if (selectedWork && artistName) {
      const workKey = convertToWorkKey(artistName, selectedWork);
      if (workKey) {
        const work = getPrompt(workKey);
        if (work) masterworkPrompt = work.prompt;
      }
    }
    
    if (artistName && artistName.toUpperCase().includes('LICHTENSTEIN')) {
      const speechText = selectSpeechBubbleText();
      extraInstructions = ` The subject is saying "${speechText}" in a white comic speech bubble.`;
    }
  }
  
  const combinedPrompt = [stylePrompt, masterworkPrompt].filter(Boolean).join('. ');
  
  if (!combinedPrompt) {
    return {
      prompt: `Transform this photo into a ${selectedStyle.name} painting. ${SAFETY_AND_STYLE_RULES}`,
      selectedArtist: selectedStyle.name,
      selectedWork: null
    };
  }
  
  return {
    prompt: `Transform this photo into: ${combinedPrompt}${extraInstructions}

${SAFETY_AND_STYLE_RULES}`,
    selectedArtist,
    selectedWork
  };
}


// ========================================
// Fallback 프롬프트
// ========================================
const FALLBACK_PROMPTS = {
  ancient: 'Transform this photo into Ancient Greek-Roman art. Classical marble sculpture or Roman mosaic with large tesserae tiles.',
  medieval: 'Transform this photo into Medieval art. Byzantine golden mosaic, Gothic stained glass, or Persian miniature.',
  renaissance: 'Transform this photo into a Renaissance painting by Leonardo da Vinci with sfumato technique.',
  baroque: 'Transform this photo into a Baroque painting by Caravaggio with dramatic chiaroscuro.',
  rococo: 'Transform this photo into a Rococo painting by Watteau with delicate pastel brushwork.',
  neoclassicism_vs_romanticism_vs_realism: 'Transform this photo into a 19th century painting.',
  impressionism: 'Transform this photo into an Impressionist painting by Monet with broken color brushstrokes.',
  postImpressionism: 'Transform this photo into a Post-Impressionist painting by Van Gogh with swirling impasto.',
  fauvism: 'Transform this photo into a Fauvist painting by Matisse with bold flat pure colors.',
  expressionism: 'Transform this photo into an Expressionist painting by Munch with wavy distorted lines.',
  modernism: 'Transform this photo into a Cubist painting by Picasso with geometric fragmentation.',
  vangogh: 'Transform this photo into: ' + (ARTIST_STYLES['vangogh'] || 'a Van Gogh painting'),
  klimt: 'Transform this photo into: ' + (ARTIST_STYLES['klimt'] || 'a Klimt painting'),
  munch: 'Transform this photo into: ' + (ARTIST_STYLES['munch'] || 'a Munch painting'),
  matisse: 'Transform this photo into: ' + (ARTIST_STYLES['matisse'] || 'a Matisse painting'),
  chagall: 'Transform this photo into: ' + (ARTIST_STYLES['chagall'] || 'a Chagall painting'),
  frida: 'Transform this photo into: ' + (ARTIST_STYLES['frida'] || 'a Frida Kahlo painting'),
  lichtenstein: 'Transform this photo into: ' + (ARTIST_STYLES['lichtenstein'] || 'a Lichtenstein pop art'),
  korean: 'Transform this photo into Korean traditional painting on hanji paper.',
  chinese: 'Transform this photo into Chinese traditional painting on rice paper.',
  japanese: 'Transform this photo into Japanese Ukiyo-e woodblock print.'
};


// ========================================
// 🔄 재변환 모드
// ========================================
async function handleRetransform(image, correctionPrompt, selectedStyle, startTime) {
  const masterId = selectedStyle.id?.replace('-master', '') || '';
  const DISPLAY_NAMES = {
    'vangogh': 'Van Gogh', 'klimt': 'Klimt', 'munch': 'Munch',
    'picasso': 'Picasso', 'matisse': 'Matisse', 'frida': 'Frida Kahlo',
    'lichtenstein': 'Lichtenstein', 'chagall': 'Chagall'
  };
  const artistName = DISPLAY_NAMES[masterId] || 'the original';
  
  const editPrompt = `${correctionPrompt}. Maintain all other aspects including the ${artistName} painting style, brushwork, color palette, composition, and facial features.`;
  
  console.log(`🔄 재변환: ${editPrompt}`);
  const result = await callGeminiImageGeneration(image, editPrompt);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  return {
    status: 'completed',
    resultBase64: result.imageBase64,
    resultMimeType: result.mimeType,
    selected_artist: artistName,
    selection_method: 'retransform',
    _debug: { elapsed, mode: 'retransform' }
  };
}


// ========================================
// 📦 메인 핸들러
// ========================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const startTime = Date.now();
    const { image, selectedStyle, correctionPrompt, isOneClick } = req.body;

    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini API key not configured' });
    if (!image || !selectedStyle) return res.status(400).json({ error: 'Missing image or style' });
    if (!selectedStyle.name || !selectedStyle.category) return res.status(400).json({ error: 'Invalid style structure' });

    // 재변환
    if (correctionPrompt) {
      const retransformResult = await handleRetransform(image, correctionPrompt, selectedStyle, startTime);
      return res.status(200).json(retransformResult);
    }

    const categoryType = (selectedStyle.category === 'movements') ? selectedStyle.id : selectedStyle.category;

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Gemini Transfer v2.0 (2콜 분리)');
    console.log(`   카테고리: ${selectedStyle.category} / ${categoryType}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ========================================
    // STEP 1: 텍스트 분석 (화가/대표작 선택)
    // ========================================
    let selectionResult = null;
    const selectionPrompt = buildSelectionPrompt(selectedStyle);
    
    if (selectionPrompt) {
      console.log('🔍 Step 1: 텍스트 분석 시작...');
      try {
        const rawText = await callGeminiTextAnalysis(image, selectionPrompt);
        const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        selectionResult = JSON.parse(cleaned);
        console.log(`🔍 Step 1 완료: ${JSON.stringify(selectionResult)}`);
      } catch (err) {
        console.log(`⚠️ Step 1 실패 (fallback): ${err.message}`);
        selectionResult = null;
      }
    }

    // ========================================
    // STEP 2: 프롬프트 조립 + 이미지 생성
    // ========================================
    const { prompt: transformPrompt, selectedArtist, selectedWork } = buildTransformPrompt(selectedStyle, selectionResult);
    
    console.log(`🎨 Step 2: 이미지 생성`);
    console.log(`   화가: ${selectedArtist}`);
    console.log(`   대표작: ${selectedWork || 'N/A'}`);
    console.log(`   프롬프트 (200자): ${transformPrompt.substring(0, 200)}...`);

    let result;
    try {
      result = await callGeminiImageGeneration(image, transformPrompt);
    } catch (geminiError) {
      console.log(`⚠️ 이미지 생성 실패, fallback: ${geminiError.message}`);
      const fbKey = categoryType === 'masters' ? selectedStyle.id.replace('-master', '') : categoryType;
      const fbPrompt = FALLBACK_PROMPTS[fbKey] || FALLBACK_PROMPTS['renaissance'];
      result = await callGeminiImageGeneration(image, fbPrompt + '\n' + SAFETY_AND_STYLE_RULES);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ 완료 (${elapsed}초) — ${selectedArtist} / ${selectedWork || 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    res.status(200).json({
      status: 'completed',
      resultBase64: result.imageBase64,
      resultMimeType: result.mimeType,
      selected_artist: selectedArtist,
      selected_work: selectedWork || null,
      selection_method: selectionResult ? 'gemini_2call' : 'direct',
      _debug: {
        version: 'gemini-v2.0',
        elapsed,
        model: GEMINI_MODEL,
        step1: selectionResult,
        promptLength: transformPrompt.length
      }
    });

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
