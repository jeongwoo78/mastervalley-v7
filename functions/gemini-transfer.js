// ========================================
// Master Valley - Gemini Transfer v1.0
// flux-transfer.js 4,400줄 → ~1,200줄 간소화
// 3-API 체인 (Claude Vision + Claude Haiku + FLUX Depth)
// → 1-API (Gemini: 분석 + 선택 + 생성 동시)
// ========================================
// 모델: gemini-3.1-flash-image-preview (Nano Banana 2)
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
// 🛡️ NSFW 방어 (Gemini용 간소화)
// ========================================
const NSFW_RULES = `Unless the art style specifically requires costume transformation, preserve the original clothing exactly. No additional skin exposure beyond the original photo. Preserve the subject's identity, gender, and ethnicity exactly.`;


// ========================================
// 💫 매력 조항 (7단계 나이대별 분기)
// Gemini가 사진 분석 후 자체 적용하도록 텍스트로 전달
// ========================================
const ATTRACTIVE_RULES = `
ATTRACTIVE ENHANCEMENT (apply based on subject's apparent age):
- Baby: Render adorably beautiful - cherubic, angelic, rosy glowing cheeks, sparkling innocent eyes
- Child: Render adorably cute - bright-eyed, carefree, radiant innocent smile, warm healthy glow
- Teen: Render with fresh youthful energy. Flattering portrait true to age
- Young adult (20s): Render with vibrant youthful beauty. Flattering portrait true to age
- Adult (30-40s): Render with mature confident charisma. Flattering portrait true to age
- Middle-aged (50-60s): Render with graceful seasoned dignity. Flattering portrait true to age
- Elderly (70+): Render with wise timeless dignity. Portrait true to age
- Animal: Render the animal as beautiful, majestic, or endearing as appropriate
- Landscape/Object: Clean polished composition, every element beautiful and harmonious

EXCEPTION: If the art style requires distortion (e.g., Munch's Scream, Picasso's Cubism), prioritize the art style over attractiveness.`;


// ========================================
// 💬 리히텐슈타인 말풍선 텍스트 (50개)
// ========================================
const LICHTENSTEIN_SPEECH_BUBBLES = {
  excited: [
    "WOW!", "AMAZING!", "INCREDIBLE!", "PERFECT!", "YES!",
    "BEST DAY EVER!", "I CAN'T BELIEVE IT!",
    "IT'LL BE ALRIGHT!", "WE DID IT!", "SO EXCITING!",
    "WE DID IT!", "NOTHING STOPS US!"
  ],
  romantic: [
    "I LOVE YOU!", "KISS ME!", "MY DARLING!", "YOU'RE THE ONE!",
    "THIS MOMENT!", "ONLY FOR YOU!",
    "NEVER LET GO!", "YOU'RE EVERYTHING!",
    "STAY FOREVER!", "LIKE A DREAM!"
  ],
  dramatic: [
    "I CAN'T BELIEVE IT!", "HOW COULD YOU?!", "IT'S OVER!",
    "I DON'T CARE!", "WHY ME?!",
    "I SHOULD'VE KNOWN!", "EVERYTHING CHANGED!",
    "NOT LIKE THIS!", "CAN'T BE REAL!",
    "WATCH ME!"
  ],
  dialogue: [
    "MAYBE TOMORROW...", "WHAT HAPPENS NEXT?",
    "THEY SAID NO!", "WAIT HERE!",
    "HE'LL COME BACK!", "I SAW SOMETHING!",
    "DO SOMETHING!", "JUST WHAT I NEEDED!",
    "SOMETHING'S DIFFERENT!", "THIS CHANGES EVERYTHING!"
  ],
  surprised: [
    "WHAT?!", "OH MY!", "REALLY?!", "WAIT... WHAT?!",
    "NO WAY!", "COULD IT BE?!",
    "NOT RIGHT...", "WHAT HAPPENED?!"
  ]
};

function selectSpeechBubbleText() {
  // Gemini에서는 Vision 없이 랜덤 선택 (Gemini가 사진 보고 적절히 배치)
  const categories = Object.keys(LICHTENSTEIN_SPEECH_BUBBLES);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const texts = LICHTENSTEIN_SPEECH_BUBBLES[category];
  return texts[Math.floor(Math.random() * texts.length)];
}


// ========================================
// 🎯 사조별 가중치 테이블
// Gemini 프롬프트에 텍스트로 주입
// ========================================
const ARTIST_WEIGHTS = {
  modernism: {
    portrait: [
      { name: 'LICHTENSTEIN', weight: 33 },
      { name: 'CHAGALL', weight: 33 },
      { name: 'PICASSO', weight: 34 }
    ],
    couple: [
      { name: 'CHAGALL', weight: 35 },
      { name: 'LICHTENSTEIN', weight: 35 },
      { name: 'PICASSO', weight: 30 }
    ],
    group: [
      { name: 'CHAGALL', weight: 35 },
      { name: 'LICHTENSTEIN', weight: 35 },
      { name: 'PICASSO', weight: 30 }
    ],
    landscape: [
      { name: 'CHAGALL', weight: 40 },
      { name: 'PICASSO', weight: 20 },
      { name: 'MIRÓ', weight: 40 }
    ],
    stillLife: [
      { name: 'PICASSO', weight: 20 },
      { name: 'LICHTENSTEIN', weight: 40 },
      { name: 'MIRÓ', weight: 40 }
    ],
    default: [
      { name: 'CHAGALL', weight: 35 },
      { name: 'LICHTENSTEIN', weight: 35 },
      { name: 'PICASSO', weight: 30 }
    ]
  },
  renaissance: {
    portrait: [
      { name: 'BOTTICELLI', weight: 30 },
      { name: 'LEONARDO DA VINCI', weight: 25 },
      { name: 'TITIAN', weight: 25 },
      { name: 'RAPHAEL', weight: 20 }
    ],
    femaleFace: [
      { name: 'BOTTICELLI', weight: 50 },
      { name: 'LEONARDO DA VINCI', weight: 30 },
      { name: 'RAPHAEL', weight: 20 }
    ],
    maleFace: [
      { name: 'BOTTICELLI', weight: 23 },
      { name: 'TITIAN', weight: 23 },
      { name: 'RAPHAEL', weight: 22 },
      { name: 'LEONARDO DA VINCI', weight: 22 },
      { name: 'MICHELANGELO', weight: 10 }
    ],
    landscape: [
      { name: 'TITIAN', weight: 30 },
      { name: 'LEONARDO DA VINCI', weight: 20 },
      { name: 'BOTTICELLI', weight: 20 },
      { name: 'RAPHAEL', weight: 15 },
      { name: 'MICHELANGELO', weight: 15 }
    ],
    default: [
      { name: 'BOTTICELLI', weight: 20 },
      { name: 'LEONARDO DA VINCI', weight: 20 },
      { name: 'TITIAN', weight: 20 },
      { name: 'RAPHAEL', weight: 20 },
      { name: 'MICHELANGELO', weight: 20 }
    ]
  },
  baroque: {
    portrait: [
      { name: 'CARAVAGGIO', weight: 45 },
      { name: 'REMBRANDT', weight: 35 },
      { name: 'VELÁZQUEZ', weight: 12 },
      { name: 'RUBENS', weight: 8 }
    ],
    elderly: [
      { name: 'REMBRANDT', weight: 70 },
      { name: 'CARAVAGGIO', weight: 20 },
      { name: 'VELÁZQUEZ', weight: 10 }
    ],
    couple: [
      { name: 'RUBENS', weight: 60 },
      { name: 'REMBRANDT', weight: 25 },
      { name: 'CARAVAGGIO', weight: 15 }
    ],
    group: [
      { name: 'RUBENS', weight: 50 },
      { name: 'REMBRANDT', weight: 30 },
      { name: 'CARAVAGGIO', weight: 20 }
    ],
    default: [
      { name: 'CARAVAGGIO', weight: 35 },
      { name: 'REMBRANDT', weight: 30 },
      { name: 'VELÁZQUEZ', weight: 20 },
      { name: 'RUBENS', weight: 15 }
    ]
  },
  rococo: {
    outdoor: [
      { name: 'WATTEAU', weight: 70 },
      { name: 'BOUCHER', weight: 30 }
    ],
    default: [
      { name: 'BOUCHER', weight: 70 },
      { name: 'WATTEAU', weight: 30 }
    ]
  },
  medieval: {
    default: [
      { name: 'BYZANTINE', weight: 50 },
      { name: 'GOTHIC', weight: 20 },
      { name: 'ISLAMIC MINIATURE', weight: 30 }
    ]
  },
  neoclassicism_vs_romanticism_vs_realism: {
    portrait: [
      { name: 'INGRES', weight: 35 },
      { name: 'MANET', weight: 35 },
      { name: 'JACQUES-LOUIS DAVID', weight: 30 }
    ],
    movement: [
      { name: 'DELACROIX', weight: 60 },
      { name: 'JACQUES-LOUIS DAVID', weight: 25 },
      { name: 'TURNER', weight: 15 }
    ],
    landscape: [
      { name: 'TURNER', weight: 50 },
      { name: 'DELACROIX', weight: 20 },
      { name: 'COURBET', weight: 20 },
      { name: 'MANET', weight: 10 }
    ],
    default: [
      { name: 'JACQUES-LOUIS DAVID', weight: 20 },
      { name: 'DELACROIX', weight: 20 },
      { name: 'TURNER', weight: 20 },
      { name: 'MANET', weight: 15 },
      { name: 'COURBET', weight: 15 },
      { name: 'INGRES', weight: 10 }
    ]
  },
  ancient: {
    indoor: [
      { name: 'CLASSICAL SCULPTURE', weight: 80 },
      { name: 'ROMAN MOSAIC', weight: 20 }
    ],
    outdoor: [
      { name: 'ROMAN MOSAIC', weight: 80 },
      { name: 'CLASSICAL SCULPTURE', weight: 20 }
    ],
    sports: [
      { name: 'CLASSICAL SCULPTURE', weight: 90 },
      { name: 'ROMAN MOSAIC', weight: 10 }
    ],
    animal: [
      { name: 'ROMAN MOSAIC', weight: 100 }
    ],
    default: [
      { name: 'CLASSICAL SCULPTURE', weight: 50 },
      { name: 'ROMAN MOSAIC', weight: 50 }
    ]
  },
  impressionism: {
    portrait: [
      { name: 'RENOIR', weight: 35 },
      { name: 'MONET', weight: 30 },
      { name: 'CAILLEBOTTE', weight: 35 }
    ],
    movement: [
      { name: 'DEGAS', weight: 50 },
      { name: 'RENOIR', weight: 30 },
      { name: 'MONET', weight: 15 },
      { name: 'CAILLEBOTTE', weight: 5 }
    ],
    landscape_nature: [
      { name: 'MONET', weight: 85 },
      { name: 'RENOIR', weight: 15 }
    ],
    landscape_urban: [
      { name: 'CAILLEBOTTE', weight: 70 },
      { name: 'MONET', weight: 30 }
    ],
    default: [
      { name: 'RENOIR', weight: 35 },
      { name: 'MONET', weight: 35 },
      { name: 'CAILLEBOTTE', weight: 20 },
      { name: 'DEGAS', weight: 10 }
    ]
  },
  postImpressionism: {
    portrait: [
      { name: 'VAN GOGH', weight: 50 },
      { name: 'GAUGUIN', weight: 50 }
    ],
    landscape: [
      { name: 'VAN GOGH', weight: 35 },
      { name: 'GAUGUIN', weight: 35 },
      { name: 'CÉZANNE', weight: 30 }
    ],
    stillLife: [
      { name: 'CÉZANNE', weight: 60 },
      { name: 'VAN GOGH', weight: 20 },
      { name: 'GAUGUIN', weight: 20 }
    ],
    default: [
      { name: 'VAN GOGH', weight: 35 },
      { name: 'GAUGUIN', weight: 35 },
      { name: 'CÉZANNE', weight: 30 }
    ]
  },
  fauvism: {
    portrait: [
      { name: 'MATISSE', weight: 45 },
      { name: 'DERAIN', weight: 30 },
      { name: 'VLAMINCK', weight: 25 }
    ],
    landscape: [
      { name: 'DERAIN', weight: 45 },
      { name: 'VLAMINCK', weight: 35 },
      { name: 'MATISSE', weight: 20 }
    ],
    default: [
      { name: 'MATISSE', weight: 35 },
      { name: 'DERAIN', weight: 35 },
      { name: 'VLAMINCK', weight: 30 }
    ]
  },
  expressionism: {
    portrait: [
      { name: 'MUNCH', weight: 40 },
      { name: 'KOKOSCHKA', weight: 35 },
      { name: 'KIRCHNER', weight: 25 }
    ],
    landscape: [
      { name: 'MUNCH', weight: 45 },
      { name: 'KIRCHNER', weight: 35 },
      { name: 'KOKOSCHKA', weight: 20 }
    ],
    urban: [
      { name: 'KIRCHNER', weight: 50 },
      { name: 'KOKOSCHKA', weight: 30 },
      { name: 'MUNCH', weight: 20 }
    ],
    default: [
      { name: 'MUNCH', weight: 40 },
      { name: 'KOKOSCHKA', weight: 35 },
      { name: 'KIRCHNER', weight: 25 }
    ]
  }
};


// ========================================
// 가중치 테이블 → 프롬프트 텍스트 변환
// ========================================
function weightsToPromptText(categoryKey) {
  const weights = ARTIST_WEIGHTS[categoryKey];
  if (!weights) return '';
  
  let text = '\nARTIST SELECTION WEIGHTS (follow these probability ratios):\n';
  
  for (const [photoType, artists] of Object.entries(weights)) {
    const label = photoType
      .replace('femaleFace', 'Female portrait')
      .replace('maleFace', 'Male portrait')
      .replace('portrait', 'Single portrait')
      .replace('couple', 'Couple (2 people)')
      .replace('group', 'Group (3+ people)')
      .replace('landscape_nature', 'Natural landscape')
      .replace('landscape_urban', 'Urban/city landscape')
      .replace('landscape', 'Landscape')
      .replace('stillLife', 'Still life/objects')
      .replace('movement', 'Action/movement/sports')
      .replace('elderly', 'Elderly subject')
      .replace('outdoor', 'Outdoor scene')
      .replace('indoor', 'Indoor scene')
      .replace('sports', 'Sports/athletic')
      .replace('animal', 'Animals')
      .replace('urban', 'Urban/city')
      .replace('default', 'Default/other');
    
    const artistStr = artists
      .map(a => `${a.name} ${a.weight}%`)
      .join(', ');
    
    text += `- ${label}: ${artistStr}\n`;
  }
  
  text += '\nAnalyze the photo, determine its type, then select an artist following these weights.\n';
  return text;
}


// ========================================
// 🔑 대표작 키 변환
// ========================================
function convertToWorkKey(artistName, workTitle) {
  if (!artistName || !workTitle) return null;
  const normalized = workTitle.toLowerCase().trim();
  return masterworkNameMapping[normalized] || null;
}


// ========================================
// 📋 Fallback 프롬프트 (Gemini 실패 시)
// ========================================
const fallbackPrompts = {
  ancient: {
    name: '그리스·로마',
    prompt: 'Transform this photo into Ancient Greek-Roman art. Classical marble sculpture with white Carrara marble for indoor/sports photos, or Roman mosaic with large tesserae tiles and dark grout lines for outdoor photos.'
  },
  medieval: {
    name: '중세 미술',
    prompt: 'Transform this photo into Medieval art. Byzantine golden mosaic for people, Gothic stained glass for landscapes, Persian miniature for animals.'
  },
  renaissance: {
    name: 'Leonardo da Vinci',
    prompt: 'Transform this photo into a Renaissance painting by Leonardo da Vinci with sfumato technique, soft hazy edges, mysterious atmospheric depth.'
  },
  baroque: {
    name: 'Caravaggio',
    prompt: 'Transform this photo into a Baroque painting by Caravaggio with dramatic chiaroscuro, extreme light-dark contrast, theatrical spotlight.'
  },
  rococo: {
    name: 'Antoine Watteau',
    prompt: 'Transform this photo into a Rococo painting by Watteau with delicate brushwork, soft pastel colors, romantic elegant atmosphere.'
  },
  neoclassicism_vs_romanticism_vs_realism: {
    name: '신고전 vs 낭만 vs 사실',
    prompt: 'Transform this photo into a 19th century painting. Neoclassical for formal, Romantic for dramatic, Realist for everyday.'
  },
  impressionism: {
    name: 'Claude Monet',
    prompt: 'Transform this photo into an Impressionist painting by Monet with broken color brushstrokes, soft hazy atmospheric light, colors blending.'
  },
  postImpressionism: {
    name: 'Vincent van Gogh',
    prompt: 'Transform this photo into a Post-Impressionist painting by Van Gogh with swirling impasto brushstrokes, vibrant intense colors.'
  },
  fauvism: {
    name: 'Henri Matisse',
    prompt: 'Transform this photo into a Fauvist painting by Matisse with bold flat pure colors, simplified forms, vibrant emotional intensity.'
  },
  expressionism: {
    name: 'Edvard Munch',
    prompt: 'Transform this photo into an Expressionist painting by Munch with psychological depth, wavy distorted lines, haunting symbolic colors.'
  },
  modernism: {
    name: 'Pablo Picasso',
    prompt: 'Transform this photo into a Cubist painting by Picasso with geometric fragmentation, face broken into angular planes, multiple viewpoints.'
  },
  vangogh: {
    name: '반 고흐',
    prompt: 'Transform this photo into a painting by Van Gogh with thick swirling impasto brushstrokes, cobalt blue and chrome yellow, Starry Night style.'
  },
  klimt: {
    name: '클림트',
    prompt: 'Transform this photo into a painting by Klimt with gold leaf patterns, Byzantine mosaic ornaments, jewel-like decorative details.'
  },
  munch: {
    name: '뭉크',
    prompt: 'Transform this photo into a painting by Munch with intense psychological depth, wavy distorted lines, existential anxiety atmosphere.'
  },
  matisse: {
    name: '마티스',
    prompt: 'Transform this photo into a painting by Matisse with pure bold unmixed Fauvist colors, simplified joyful forms, flat decorative areas.'
  },
  chagall: {
    name: '샤갈',
    prompt: 'Transform this photo into a painting by Chagall with dreamy floating figures, nostalgic romantic atmosphere, poetic lyrical quality.'
  },
  frida: {
    name: '프리다 칼로',
    prompt: 'Transform this photo into a painting by Frida Kahlo with intense direct gaze, vibrant Mexican folk colors, symbolic personal elements.'
  },
  lichtenstein: {
    name: '리히텐슈타인',
    prompt: 'Transform this photo into Pop Art by Lichtenstein with large Ben-Day dots, bold black outlines, flat primary colors, comic book style.'
  },
  korean: {
    name: '한국 전통화',
    prompt: 'Transform this photo into Korean traditional painting on hanji paper with ink wash brushwork, soft watercolor washes, traditional Korean aesthetic.'
  },
  chinese: {
    name: '중국 전통화',
    prompt: 'Transform this photo into Chinese traditional painting on rice paper with ink wash, monochrome gradations, empty negative space.'
  },
  japanese: {
    name: '일본 전통화',
    prompt: 'Transform this photo into Japanese Ukiyo-e woodblock print with flat color areas, bold black outlines, woodgrain texture.'
  }
};


// ========================================
// 🎨 프롬프트 조립 (카테고리별)
// ========================================
function buildGeminiPrompt(selectedStyle, isOneClick = false) {
  const categoryType = (selectedStyle.category === 'movements') 
    ? selectedStyle.id 
    : selectedStyle.category;
  const categoryName = selectedStyle.name;
  
  // ========================================
  // 1. 거장 모드
  // ========================================
  if (categoryType === 'masters') {
    const masterId = selectedStyle.id.replace('-master', '');
    const masterWorks = getArtistMasterworkGuide(masterId);
    const artistStyle = getArtistStyle(masterId);
    
    if (masterWorks) {
      // 대표작 가이드가 있는 거장 → Gemini가 대표작 선택 + 생성
      const allMasterworkPrompts = buildMasterworkPrompts(masterId);
      
      return `Transform this photo into a painting by ${categoryName}.

AVAILABLE MASTERWORKS (select the best one for this photo):
${masterWorks}

ARTIST STYLE:
${artistStyle || ''}

MASTERWORK STYLE DETAILS:
${allMasterworkPrompts}

${NSFW_RULES}
${ATTRACTIVE_RULES}

INSTRUCTIONS:
1. Analyze the photo (subject type, gender, age, composition)
2. Select the best masterwork from the list above
3. Apply that masterwork's distinctive style, colors, and technique
4. Preserve the subject's identity exactly

CRITICAL RULES:
- Single person → NEVER select "The Kiss" (requires couple)
- Parent with child → NEVER select "The Kiss" (romantic couple only)
- Preserve subject count exactly (1 person → 1 person in result)

Generate the transformed image.`;
    } else {
      // 대표작 가이드 없는 거장 → 화풍 프롬프트만
      return `Transform this photo into: ${artistStyle || categoryName + ' art style'}

${NSFW_RULES}
${ATTRACTIVE_RULES}

Preserve the subject's identity, gender, age, and ethnicity exactly.
Generate the transformed image.`;
    }
  }
  
  // ========================================
  // 2. 동양화 모드
  // ========================================
  if (categoryType === 'oriental') {
    const styleId = selectedStyle.id;
    
    if (styleId === 'korean') {
      return buildKoreanPrompt();
    } else if (styleId === 'chinese') {
      return buildChinesePrompt();
    } else if (styleId === 'japanese') {
      return buildJapanesePrompt();
    }
  }
  
  // ========================================
  // 3. 미술사조 모드 (movements)
  // ========================================
  const guidelines = getMovementGuidelines(categoryType);
  const weights = weightsToPromptText(categoryType);
  const masterworkGuide = getMovementMasterworkGuide(categoryType) || '';
  const allPrompts = buildMovementArtistPrompts(categoryType);
  
  // 리히텐슈타인 말풍선 (해당 사조에서만)
  let lichtensteinhint = '';
  if (['modernism'].includes(categoryType)) {
    const speechText = selectSpeechBubbleText();
    lichtensteinhint = `\nIF LICHTENSTEIN IS SELECTED: Add speech bubble with text "${speechText}" coming from the subject's mouth.\n`;
  }
  
  return `Transform this photo into a ${categoryName} painting.

${guidelines}

${weights}

${masterworkGuide}

AVAILABLE ARTIST STYLES:
${allPrompts}

${lichtensteinhint}

${NSFW_RULES}
${ATTRACTIVE_RULES}

INSTRUCTIONS:
1. Analyze the photo thoroughly (subject type, gender, age, background, mood)
2. Select the best artist following the weight ratios above
3. Apply the selected artist's style prompt from the list above
4. Preserve the subject's identity exactly
5. Keep subject count exact (1 person → 1 person in result)

Generate the transformed image in the selected artist's style.`;
}


// ========================================
// 사조별 화가 프롬프트 모음 (Gemini에 전달)
// ========================================
function buildMovementArtistPrompts(categoryType) {
  const categoryArtists = {
    'ancient': ['classical-sculpture', 'roman-mosaic'],
    'medieval': ['byzantine', 'gothic', 'islamic-miniature'],
    'renaissance': ['botticelli', 'leonardo', 'titian', 'michelangelo', 'raphael'],
    'baroque': ['caravaggio', 'rubens', 'rembrandt', 'velazquez'],
    'rococo': ['watteau', 'boucher'],
    'neoclassicism_vs_romanticism_vs_realism': ['david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet'],
    'impressionism': ['renoir', 'monet', 'degas', 'caillebotte'],
    'postImpressionism': ['vangogh', 'gauguin', 'cezanne'],
    'fauvism': ['matisse', 'derain', 'vlaminck'],
    'expressionism': ['munch', 'kirchner', 'kokoschka'],
    'modernism': ['picasso', 'miro', 'chagall', 'lichtenstein']
  };
  
  const artists = categoryArtists[categoryType] || [];
  let prompts = '';
  
  for (const artistKey of artists) {
    const style = ARTIST_STYLES[artistKey];
    if (style) {
      prompts += `\n[${artistKey.toUpperCase()}]: ${style}\n`;
    }
  }
  
  return prompts;
}


// ========================================
// 거장별 대표작 프롬프트 모음
// ========================================
function buildMasterworkPrompts(masterId) {
  const masterworkList = getArtistMasterworkList(masterId);
  if (!masterworkList || masterworkList.length === 0) return '';
  
  let prompts = '';
  for (const workKey of masterworkList) {
    const work = getPrompt(workKey);
    if (work) {
      prompts += `\n[${work.nameEn || workKey}]: ${work.prompt}\n`;
    }
  }
  return prompts;
}


// ========================================
// 사조별 가이드라인 (기존 flux-transfer.js에서 이식)
// ========================================
function getMovementGuidelines(categoryType) {
  const guidelines = {
    'ancient': `STYLE SELECTION:
- SPORTS/ATHLETIC ACTION → CLASSICAL SCULPTURE (white marble)
- INDOOR PORTRAITS → CLASSICAL SCULPTURE
- OUTDOOR/LANDSCAPE/ANIMALS → ROMAN MOSAIC (large tesserae tiles, dark grout)
- Animal photos → ALWAYS ROMAN MOSAIC`,

    'medieval': `STYLE SELECTION:
- ANIMALS → ISLAMIC MINIATURE (Persian court painting, jewel colors)
- PEOPLE → ISLAMIC MINIATURE 50% or BYZANTINE 50% (golden mosaic, halo)
- STILL LIFE/OBJECTS → ISLAMIC MINIATURE
- LANDSCAPE/BUILDING only → GOTHIC STAINED GLASS (thick black lead lines, jewel tones)`,

    'renaissance': `ARTISTS: BOTTICELLI, LEONARDO DA VINCI, TITIAN, MICHELANGELO, RAPHAEL
- Female portraits → BOTTICELLI primary (ethereal beauty, flowing lines)
- Mysterious/contemplative → LEONARDO (sfumato, soft haze)
- Male portraits → TITIAN (Venetian golden color, aristocratic)
- Athletic adult male → MICHELANGELO (sculptural anatomy, heroic) — NEVER for children
- Peaceful groups → RAPHAEL (harmonious balance, serene)`,

    'baroque': `ARTISTS: CARAVAGGIO, RUBENS, REMBRANDT, VELÁZQUEZ
- Single portraits → CARAVAGGIO primary (dramatic chiaroscuro, spotlight)
- Elderly subjects → REMBRANDT (warm golden light, psychological depth)
- Couples/groups → RUBENS (warm flesh, dynamic movement)
- Formal/court → VELÁZQUEZ (refined elegance, silver-grey palette)`,

    'rococo': `ARTISTS: WATTEAU, BOUCHER
- Outdoor/garden scenes → WATTEAU (dreamy pastoral, melancholic)
- Indoor/intimate → BOUCHER (rosy flesh, pastel palette, playful)`,

    'neoclassicism_vs_romanticism_vs_realism': `ARTISTS: DAVID, INGRES, TURNER, DELACROIX, COURBET, MANET
- Formal/heroic → DAVID (crisp outlines, moral intensity)
- Elegant female → INGRES (smooth contours, porcelain skin)
- Landscapes/atmosphere → TURNER (sublime light, swirling mist)
- Action/dramatic → DELACROIX (passionate energy, vivid colors)
- Rural/realistic → COURBET (raw unidealized truth)
- Urban/modern → MANET (bold flat composition, confident brushwork)`,

    'impressionism': `ARTISTS: RENOIR, MONET, DEGAS, CAILLEBOTTE
- Female/child portraits → RENOIR (warm glow, rosy flesh)
- Male portraits → CAILLEBOTTE (modern urban men, muted grey-blue)
- Natural landscapes → MONET (broken colors, atmospheric haze)
- Urban/city → CAILLEBOTTE (converging perspective, wet reflections)
- Dance/movement → DEGAS (unusual angles, asymmetric crop)`,

    'postImpressionism': `ARTISTS: VAN GOGH, GAUGUIN, CÉZANNE
- Portraits → VAN GOGH or GAUGUIN (NEVER Cézanne for portraits!)
- Male portrait → VAN GOGH Self-Portrait style
- Female portrait → VAN GOGH Starry Night style or GAUGUIN Tahitian
- Still life → CÉZANNE (geometric forms, structured patches)
- Landscape → All three viable`,

    'fauvism': `ARTISTS: MATISSE, DERAIN, VLAMINCK
- Most portraits → MATISSE (bold flat colors, harmonious joy)
- Landscapes → DERAIN (vivid natural colors, strong contrast)
- Dramatic/intense → VLAMINCK (violent colors, turbulent brushwork)`,

    'expressionism': `ARTISTS: MUNCH, KOKOSCHKA, KIRCHNER
- Emotional portraits → MUNCH (existential anxiety, wavy lines)
- Psychological depth → KOKOSCHKA (violent brushwork, inner turmoil)
- Urban/angular → KIRCHNER (jagged forms, clashing colors)`,

    'modernism': `ARTISTS: PICASSO, MIRÓ, CHAGALL, LICHTENSTEIN
- Portraits → PICASSO (cubist fragmentation), CHAGALL (dreamy floating), or LICHTENSTEIN (pop art dots)
- MIRÓ is for LANDSCAPE/STILL LIFE ONLY (playful biomorphic shapes)
- Couples → CHAGALL primary (romantic floating figures)
- Landscape → CHAGALL or MIRÓ`
  };
  
  return guidelines[categoryType] || '';
}


// ========================================
// 동양화 프롬프트 (한국/중국/일본)
// ========================================
function buildKoreanPrompt() {
  return `Transform this photo into Korean traditional painting.

Select ONE of these three styles:

Style 1: MINHWA (민화) - Folk Painting
- For: animals, flowers, birds, simple subjects
- Style: ${ARTIST_STYLES['minhwa']}

Style 2: PUNGSOKDO (풍속도) - Genre Painting
- For: people, portraits, daily life
- Style: ${ARTIST_STYLES['pungsokdo']}
- CLOTHING: Transform to traditional Joseon hanbok

Style 3: JINGYEONG (진경산수) - True-View Landscape
- For: mountains, nature, landscapes
- Style: ${ARTIST_STYLES['jingyeong']}

Include calligraphy text (1-4 Korean/Chinese characters, positive meaning).
Examples: "福" (blessing), "壽" (longevity), "喜" (joy), "美" (beauty), "和" (harmony)

${NSFW_RULES}
${ATTRACTIVE_RULES}

Generate the transformed image.`;
}

function buildChinesePrompt() {
  return `Transform this photo into Chinese traditional painting.

Select ONE of these two styles:

Style 1: SHUIMOHUA (水墨画) - Ink Wash Painting
- For: landscapes, contemplative subjects
- Style: ${ARTIST_STYLES['shuimohua']}

Style 2: GONGBI (工筆) - Meticulous Court Painting
- For: people, animals, detailed subjects
- Style: ${ARTIST_STYLES['gongbi']}
- CLOTHING: Transform to traditional Chinese hanfu

Include calligraphy text (1-4 Chinese characters, positive meaning).
Examples: "福" (blessing), "壽" (longevity), "喜" (joy), "雅" (elegance), "和" (harmony)

${NSFW_RULES}
${ATTRACTIVE_RULES}

Generate the transformed image.`;
}

function buildJapanesePrompt() {
  return `Transform this photo into Japanese traditional art.

Select ONE of these two styles:

Style 1: UKIYO-E (浮世絵) - Woodblock Print
- For: people, landscapes, animals, daily life
- Style: ${ARTIST_STYLES['ukiyoe']}
- Sub-styles: Bijin-ga for women, Yakusha-e for men, Meisho-e for landscapes
- CLOTHING: Transform to traditional kimono (women) or hakama+haori (men)

Style 2: RINPA (琳派) - Decorative Painting
- For: flowers, birds, botanical subjects
- Style: ${ARTIST_STYLES['rinpa'] || 'Rinpa school decorative painting with gold leaf background, tarashikomi ink pooling, stylized natural motifs'}

Include calligraphy text (1-4 Japanese/Chinese characters, positive meaning).
Examples: "粋" (stylish), "雅" (elegant), "桜" (sakura), "波" (wave), "富士" (Fuji)

${NSFW_RULES}
${ATTRACTIVE_RULES}

Generate the transformed image.`;
}


// ========================================
// 🚀 Gemini API 호출
// ========================================
const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_RETRIES = 3;

async function callGeminiImageGeneration(base64Image, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  
  // base64 데이터 정리
  const base64Data = base64Image.includes(',') 
    ? base64Image.split(',')[1] 
    : base64Image;
  
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🚀 Gemini 요청 시작 (시도 ${attempt}/${MAX_RETRIES})...`);
      
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                  }
                },
                { text: prompt }
              ]
            }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT']
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`⚠️ Gemini API 에러 (${response.status}): ${errorText}`);
        
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 3000 * attempt));
          continue;
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // 이미지 파트 추출
      const candidate = data.candidates?.[0];
      if (!candidate) throw new Error('No candidates in Gemini response');
      
      const parts = candidate.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
      const textPart = parts.find(p => p.text);
      
      if (!imagePart) {
        console.log('⚠️ Gemini 응답에 이미지 없음, 텍스트:', textPart?.text);
        throw new Error('No image in Gemini response');
      }
      
      console.log(`✅ Gemini 이미지 생성 완료 (시도 ${attempt})`);
      
      return {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        text: textPart?.text || null
      };
      
    } catch (err) {
      lastError = err;
      console.log(`⚠️ Gemini 에러 (시도 ${attempt}/${MAX_RETRIES}): ${err.message}`);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 3000 * attempt));
        continue;
      }
    }
  }
  
  throw lastError || new Error('Gemini image generation failed');
}


// ========================================
// 🔄 재변환 모드 (Gemini 대화형 편집)
// ========================================
async function handleRetransform(image, correctionPrompt, selectedStyle, startTime) {
  const masterId = selectedStyle.id?.replace('-master', '') || '';
  
  const ARTIST_DISPLAY_NAMES = {
    'vangogh': 'Van Gogh', 'klimt': 'Klimt', 'munch': 'Munch',
    'picasso': 'Picasso', 'matisse': 'Matisse', 'frida': 'Frida Kahlo',
    'lichtenstein': 'Lichtenstein', 'chagall': 'Chagall'
  };
  
  const artistDisplayName = ARTIST_DISPLAY_NAMES[masterId] || 'the original';
  
  const editPrompt = `${correctionPrompt}. Maintain all other aspects of the original image including the ${artistDisplayName} painting style, brushwork, color palette, composition, background, pose, and facial features.`;
  
  console.log(`🔄 재변환: ${editPrompt}`);
  
  const result = await callGeminiImageGeneration(image, editPrompt);
  
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ 재변환 완료 (${elapsedTime}초)`);
  
  return {
    status: 'completed',
    resultBase64: result.imageBase64,
    resultMimeType: result.mimeType,
    selected_artist: artistDisplayName,
    selection_method: 'retransform',
    _debug: { elapsed: elapsedTime, mode: 'retransform' }
  };
}


// ========================================
// 📦 메인 핸들러
// ========================================
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const startTime = Date.now();
    const { image, selectedStyle, correctionPrompt, isOneClick } = req.body;

    // 유효성 검증
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    if (!image || !selectedStyle) {
      return res.status(400).json({ error: 'Missing image or style' });
    }
    if (!selectedStyle.name || !selectedStyle.category) {
      return res.status(400).json({ error: 'Invalid style structure' });
    }

    // ========================================
    // 재변환 모드
    // ========================================
    if (correctionPrompt) {
      const retransformResult = await handleRetransform(
        image, correctionPrompt, selectedStyle, startTime
      );
      return res.status(200).json(retransformResult);
    }

    // ========================================
    // 신규 변환
    // ========================================
    const categoryType = (selectedStyle.category === 'movements') 
      ? selectedStyle.id 
      : selectedStyle.category;

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Gemini Transfer v1.0');
    console.log(`   카테고리: ${selectedStyle.category}`);
    console.log(`   스타일: ${selectedStyle.name} (${categoryType})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 프롬프트 조립
    const prompt = buildGeminiPrompt(selectedStyle, isOneClick);
    
    console.log(`📜 프롬프트 길이: ${prompt.split(/\s+/).length} 단어`);
    console.log(`📜 프롬프트 (처음 500자): ${prompt.substring(0, 500)}...`);

    // Gemini API 호출
    let result;
    try {
      result = await callGeminiImageGeneration(image, prompt);
    } catch (geminiError) {
      // Gemini 실패 → Fallback
      console.log(`⚠️ Gemini 실패, fallback 시도: ${geminiError.message}`);
      
      const fallbackKey = categoryType === 'masters' 
        ? selectedStyle.id.replace('-master', '')
        : categoryType;
      const fallback = fallbackPrompts[fallbackKey] || fallbackPrompts['renaissance'];
      
      try {
        result = await callGeminiImageGeneration(image, fallback.prompt);
        console.log('✅ Fallback 성공');
      } catch (fallbackError) {
        return res.status(500).json({
          error: 'Image generation failed',
          details: fallbackError.message
        });
      }
    }

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ 완료 (${elapsedTime}초)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 결과 반환
    // TODO: Firebase Storage 업로드 후 URL 반환으로 전환
    res.status(200).json({
      status: 'completed',
      resultBase64: result.imageBase64,
      resultMimeType: result.mimeType,
      selected_artist: selectedStyle.name,
      selection_method: 'gemini_unified',
      _debug: {
        version: 'gemini-v1.0',
        elapsed: elapsedTime,
        model: GEMINI_MODEL,
        promptWords: prompt.split(/\s+/).length,
        geminiText: result.text
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
