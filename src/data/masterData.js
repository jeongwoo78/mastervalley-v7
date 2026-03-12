// =====================================================
// masterData.js - 마스터 데이터 (Single Source of Truth)
// =====================================================
// 모든 사조, 거장, 동양화 정보를 한 곳에서 관리
// StyleSelection, ProcessingScreen, ResultScreen 등에서 import해서 사용
// =====================================================

import { getMastersBasicInfo, getMovementsBasicInfo, getMovementsResultEducation, getOrientalBasicInfo } from '../i18n';
// ========== 카테고리 아이콘 (원클릭용) ==========
export const CATEGORY_ICONS = {
  movements: '🎨',
  masters: '⭐',
  oriental: '🎎'
};

// ========== 사조 데이터 ==========
export const MOVEMENTS = {
  ancient: {
    id: 'ancient',
    ko: '그리스·로마',
    en: 'Greek & Roman',
    period: 'BC 800~AD 500',
    periodEn: 'BC 800–AD 500',
    icon: '🏛️',
    description: '완벽한 비례와 균형미',
    descriptionEn: 'Ideal beauty of gods and heroes',
    subtitle: '고대 그리스 조각 · 로마 모자이크',
    subtitleEn: 'Greek Sculpture · Roman Mosaic'
  },
  medieval: {
    id: 'medieval',
    ko: '중세 미술',
    en: 'Medieval Art',
    period: '5~15세기',
    periodEn: '5th–15th Century',
    icon: '⛪',
    description: '신을 향한 경건한 표현',
    descriptionEn: 'Golden art for the divine',
    subtitle: '비잔틴 · 고딕 · 이슬람 세밀화',
    subtitleEn: 'Byzantine · Gothic · Islamic Miniature'
  },
  renaissance: {
    id: 'renaissance',
    ko: '르네상스',
    en: 'Renaissance',
    period: '14~16세기',
    periodEn: '14th–16th Century',
    icon: '🖼️',
    description: '인간 중심의 이상적 아름다움',
    descriptionEn: 'Seeing anew through human eyes',
    subtitle: '다빈치 · 미켈란젤로 · 보티첼리',
    subtitleEn: 'Da Vinci · Michelangelo · Botticelli'
  },
  baroque: {
    id: 'baroque',
    ko: '바로크',
    en: 'Baroque',
    period: '17~18세기',
    periodEn: '17th–18th Century',
    icon: '👑',
    description: '빛과 어둠의 드라마',
    descriptionEn: 'Drama of light and shadow',
    subtitle: '카라바조 · 렘브란트 · 벨라스케스',
    subtitleEn: 'Caravaggio · Rembrandt · Velázquez'
  },
  rococo: {
    id: 'rococo',
    ko: '로코코',
    en: 'Rococo',
    period: '18세기',
    periodEn: '18th Century',
    icon: '🌸',
    description: '우아하고 장식적인 취향',
    descriptionEn: 'Elegant play of aristocracy',
    subtitle: '와토 · 부셰',
    subtitleEn: 'Watteau · Boucher'
  },
  neoclassicism_vs_romanticism_vs_realism: {
    id: 'neoclassicism_vs_romanticism_vs_realism',
    ko: '신고전 vs 낭만 vs 사실주의',
    en: 'Neoclassicism·Romanticism·Realism',
    period: '19세기',
    periodEn: '19th Century',
    icon: '🗽',
    description: '이성 vs 감성 vs 현실',
    descriptionEn: 'Reason, emotion, reality diverge',
    subtitle: '다비드 · 들라크루아 · 쿠르베',
    subtitleEn: 'David · Delacroix · Courbet'
  },
  impressionism: {
    id: 'impressionism',
    ko: '인상주의',
    en: 'Impressionism',
    period: '19세기 후반',
    periodEn: 'Late 19th Century',
    icon: '🌅',
    description: '빛의 순간을 포착',
    descriptionEn: 'The moment light becomes color',
    subtitle: '모네 · 르누아르 · 드가',
    subtitleEn: 'Monet · Renoir · Degas'
  },
  postImpressionism: {
    id: 'postImpressionism',
    ko: '후기인상주의',
    en: 'Post-Impressionism',
    period: '19세기 말',
    periodEn: 'Late 19th Century',
    icon: '🌻',
    description: '감정과 구조의 탐구',
    descriptionEn: 'Beyond light, into the soul',
    subtitle: '반 고흐 · 고갱 · 세잔',
    subtitleEn: 'Van Gogh · Cézanne · Gauguin'
  },
  fauvism: {
    id: 'fauvism',
    ko: '야수파',
    en: 'Fauvism',
    period: '20세기 초',
    periodEn: 'Early 20th Century',
    icon: '🦁',
    description: '순수 색채의 해방',
    descriptionEn: 'Beasts who liberated color',
    subtitle: '마티스 · 드랭 · 블라맹크',
    subtitleEn: 'Matisse · Derain · Vlaminck'
  },
  expressionism: {
    id: 'expressionism',
    ko: '표현주의',
    en: 'Expressionism',
    period: '20세기 초',
    periodEn: 'Early 20th Century',
    icon: '😱',
    description: '내면의 불안과 고독',
    descriptionEn: 'Painting what is felt',
    subtitle: '뭉크 · 키르히너 · 코코슈카',
    subtitleEn: 'Munch · Kirchner · Kokoschka'
  },
  modernism: {
    id: 'modernism',
    ko: '모더니즘',
    en: 'Modernism',
    period: '20세기',
    periodEn: '20th Century',
    icon: '🔮',
    description: '전통을 부수는 실험',
    descriptionEn: 'Breaking all the rules',
    subtitle: '피카소 · 마그리트 · 샤갈',
    subtitleEn: 'Picasso · Magritte · Chagall'
  }
};

// 모더니즘 세부 사조 (화가별 분류용)
export const MODERNISM_SUB = {
  cubism: { ko: '입체주의', en: 'Cubism', period: '20세기 초', periodEn: 'Early 20th Century', description: '형태를 해체하고 재조립', descriptionEn: 'Deconstructing and reassembling form' },
  surrealism: { ko: '초현실주의', en: 'Surrealism', period: '20세기 초중반', periodEn: 'Early–Mid 20th Century', description: '무의식과 꿈의 세계', descriptionEn: 'The world of dreams and the unconscious' },
  popArt: { ko: '팝아트', en: 'Pop Art', period: '20세기 중반', periodEn: 'Mid 20th Century', description: '대중문화를 예술로', descriptionEn: 'Turning popular culture into art' }
};

// 19세기 세부 사조 (화가별 분류용)
export const NINETEENTH_CENTURY_SUB = {
  neoclassicism: { ko: '신고전주의', en: 'Neoclassicism', period: '18~19세기', periodEn: '18th–19th Century', description: '고대 그리스·로마의 이성과 균형', descriptionEn: 'Reason and balance of ancient Greece and Rome' },
  romanticism: { ko: '낭만주의', en: 'Romanticism', period: '19세기', periodEn: '19th Century', description: '감정과 상상력의 해방', descriptionEn: 'Liberation of emotion and imagination' },
  realism: { ko: '사실주의', en: 'Realism', period: '19세기', periodEn: '19th Century', description: '있는 그대로의 현실을 직시', descriptionEn: 'Confronting reality as it is' }
};

// 아르누보 (클림트용)
export const ART_NOUVEAU = {
  ko: '아르누보',
  en: 'Art Nouveau',
  period: '19세기 말~20세기 초'
};

// ========== 거장 데이터 (7명 활성) ==========
// ※ 피카소는 RESERVE_MASTERS에 예비 보관 중
export const MASTERS = {
  'vangogh-master': {
    id: 'vangogh-master',
    key: 'vangogh',
    ko: '빈센트 반 고흐',
    en: 'Vincent van Gogh',
    years: '1853~1890',
    movement: '후기인상주의',
    movementEn: 'Post-Impressionism',
    tagline: '별과 소용돌이의 열정',
    taglineEn: 'Swirling passion of the brush',
    icon: '🌻',
    description: '1853-1890 | 후기인상주의',
    featuredWorks: '별이 빛나는 밤 · 해바라기 · 자화상',
    featuredWorksEn: 'The Starry Night · Sunflowers · Self-Portrait',
    aliases: ['van gogh', 'gogh', 'vincent', '고흐', '반 고흐', 'ゴッホ', 'ファン・ゴッホ', 'غوخ', 'فان غوخ', 'โก๊ะ', 'แวน โก๊ะ', 'فينسنت', '梵谷', '文森·梵谷', '梵高'],
    works: {
      'starrynight': ['The Starry Night, 1889', '별이 빛나는 밤, 1889', 'Starry Night'],
      'cafe': ['Café Terrace at Night, 1888', '밤의 카페 테라스, 1888', 'Cafe Terrace', 'Café Terrace at Night', 'Cafe Terrace at Night'],
      'sunflowers': ['Sunflowers, 1888', '해바라기, 1888', 'Sunflowers'],
      'selfportrait': ['Self-Portrait, 1889', '자화상, 1889', 'Self-Portrait'],
      'wheatfield': ['Wheat Field with Cypresses, 1889', '사이프러스 밀밭, 1889', 'Cypresses']
    }
  },
  'klimt-master': {
    id: 'klimt-master',
    key: 'klimt',
    ko: '구스타프 클림트',
    en: 'Gustav Klimt',
    years: '1862~1918',
    movement: '아르누보',
    movementEn: 'Art Nouveau',
    tagline: '황금빛 사랑과 죽음',
    taglineEn: 'A world of golden sensuality',
    icon: '✨',
    description: '1862-1918 | 아르누보',
    featuredWorks: '키스 · 유디트 · 생명의 나무',
    featuredWorksEn: 'The Kiss · Judith · The Tree of Life',
    aliases: ['gustav', 'gustav klimt', '클림트', 'クリムト', 'グスタフ・クリムト', 'كليمت', 'غوستاف كليمت', 'คลิมต์', '克林姆', '古斯塔夫·克林姆'],
    works: {
      'kiss': ['The Kiss, 1907', '키스, 1907', 'Kiss'],
      'treeoflife': ['The Tree of Life, 1909', '생명의 나무, 1909', 'Tree of Life'],
      'judith': ['Judith I, 1901', '유디트, 1901', 'Judith']
    }
  },
  'munch-master': {
    id: 'munch-master',
    key: 'munch',
    ko: '에드바르 뭉크',
    en: 'Edvard Munch',
    years: '1863~1944',
    movement: '표현주의',
    movementEn: 'Expressionism',
    tagline: '내면의 고독과 불안',
    taglineEn: 'Painting the inner scream',
    icon: '😱',
    description: '1863-1944 | 표현주의',
    featuredWorks: '절규 · 마돈나 · 생의 춤',
    featuredWorksEn: 'The Scream · Madonna · The Dance of Life',
    aliases: ['edvard', 'edvard munch', '뭉크', 'ムンク', 'エドヴァルド・ムンク', 'مونك', 'إدفارد مونك', 'มุงค์', '孟克', '愛德華·孟克'],
    works: {
      'scream': ['The Scream, 1893', '절규, 1893', 'Scream'],
      'madonna': ['Madonna, 1894', '마돈나, 1894', 'Munch Madonna', 'Madonna'],
      'danceoflife': ['The Dance of Life, 1899', '생의 춤, 1899', 'Dance of Life']
    }
  },
  'matisse-master': {
    id: 'matisse-master',
    key: 'matisse',
    ko: '앙리 마티스',
    en: 'Henri Matisse',
    years: '1869~1954',
    movement: '야수파',
    movementEn: 'Fauvism',
    tagline: '색채의 기쁨과 해방',
    taglineEn: 'Master of color',
    icon: '💃',
    description: '1869-1954 | 야수파',
    featuredWorks: '춤 · 붉은 방 · 초록 줄무늬',
    featuredWorksEn: 'The Dance · The Red Room · The Green Stripe',
    aliases: ['henri', 'henri matisse', '마티스', 'マティス', 'アンリ・マティス', 'ماتيس', 'هنري ماتيس', 'มาติส', '馬蒂斯', '亨利·馬蒂斯'],
    works: {
      'greenstripe': ['The Green Stripe, 1905', '초록 줄무늬, 1905', 'Green Stripe', 'Portrait of Madame Matisse'],
      'purplecoat': ['Woman in a Purple Coat, 1937', '보라색 코트, 1937', 'Purple Coat'],
      'redroom': ['The Red Room, 1908', '붉은 방, 1908', 'Red Room', 'Harmony in Red'],
      'derain': ['Portrait of André Derain, 1905', '드랭의 초상, 1905', 'Portrait of Derain', 'Portrait of André Derain', 'Portrait of Andre Derain'],
    }
  },
  'chagall-master': {
    id: 'chagall-master',
    key: 'chagall',
    ko: '마르크 샤갈',
    en: 'Marc Chagall',
    years: '1887~1985',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    tagline: '사랑과 꿈의 비행',
    taglineEn: 'Poet of love and dreams',
    icon: '🎻',
    description: '1887-1985 | 초현실주의',
    featuredWorks: '생일 · 나와 마을 · 신부',
    featuredWorksEn: 'The Birthday · I and the Village · La Mariée',
    aliases: ['marc', 'marc chagall', '샤갈', '마르크 샤갈', 'シャガール', 'マルク・シャガール', 'شاغال', 'مارك شاغال', 'ชากาล', '夏卡爾', '馬克·夏卡爾'],
    works: {
      'lovers': ['The Birthday, 1915', '생일, 1915', 'Lovers with Flowers', '꽃다발과 연인들', 'The Birthday'],
      'lamariee': ['La Mariée, 1950', 'La Mariee', '신부, 1950', 'The Bride', 'La Mariée'],
      'village': ['I and the Village, 1911', '나와 마을, 1911', 'Village']
    }
  },
  'frida-master': {
    id: 'frida-master',
    key: 'frida',
    ko: '프리다 칼로',
    en: 'Frida Kahlo',
    years: '1907~1954',
    movement: '초현실주의',
    movementEn: 'Surrealism',
    tagline: '고통 속 강인한 자아',
    taglineEn: 'Self-portrait gazing at pain',
    icon: '🦜',
    description: '1907-1954 | 초현실주의',
    featuredWorks: '나와 앵무새들 · 부러진 기둥 · 원숭이와 자화상',
    featuredWorksEn: 'Me and My Parrots · The Broken Column · Self-Portrait with Monkeys',
    aliases: ['kahlo', 'frida kahlo', '프리다', '프리다 칼로', 'フリーダ', 'フリーダ・カーロ', 'فريدا', 'فريدا كاهلو', 'ฟรีดา', '芙烈達', '芙烈達·卡蘿'],
    works: {
      'parrots': ['Me and My Parrots, 1941', '나와 앵무새들, 1941', 'Self-Portrait with Parrots', 'Me and My Parrots'],
      'monkeys': ['Self-Portrait with Monkeys, 1943', '원숭이와 자화상, 1943', 'Monkeys']
    }
  },
  'lichtenstein-master': {
    id: 'lichtenstein-master',
    key: 'lichtenstein',
    ko: '로이 리히텐슈타인',
    en: 'Roy Lichtenstein',
    years: '1923~1997',
    movement: '팝아트',
    movementEn: 'Pop Art',
    tagline: '만화로 묻는 예술',
    taglineEn: 'Dots that changed art',
    icon: '💥',
    description: '1923-1997 | 팝아트',
    featuredWorks: '차 안에서 · 아마도 · 날 잊어',
    featuredWorksEn: 'In the Car · M-Maybe · Forget It!',
    aliases: ['roy', 'roy lichtenstein', '리히텐슈타인', '로이 리히텐슈타인', 'リキテンスタイン', 'ロイ・リキテンスタイン', 'ليختنشتاين', 'ลิกเตนสไตน์', '李奇登斯坦', '羅伊·李奇登斯坦'],
    works: {
      'inthecar': ['In the Car, 1963', '차 안에서, 1963', 'In Car', 'In the Car'],
      'mmaybe': ['M-Maybe, 1965', '아마도, 1965', 'Maybe'],
      'forgetit': ['Forget It!, 1962', 'Forget It', '날 잊어, 1962'],
      'ohhhalright': ['Ohhh...Alright..., 1964', 'Ohhh Alright', '오 알았어, 1964', 'Ohhh...Alright...'],
      'stilllife': ['Still Life with Crystal Bowl, 1973', 'Still Life', '정물화, 1973']
    }
  }
};

// ========== 예비 거장 (RESERVE) ==========
// 활성화하려면 → MASTERS 객체로 이동하면 됨 (스위치)
// ※ 교육자료(i18n/*/masters.js, oneclickMasters.js)는 이미 준비되어 있음
// ※ MOVEMENT_ARTISTS.modernism.picasso (사조 모드)에는 영향 없음
export const RESERVE_MASTERS = {
  'picasso-master': {
    id: 'picasso-master',
    key: 'picasso',
    ko: '파블로 피카소',
    en: 'Pablo Picasso',
    years: '1881~1973',
    movement: '입체주의',
    movementEn: 'Cubism',
    tagline: '형태를 해체한 혁명가',
    taglineEn: 'Revolutionary who deconstructed vision',
    icon: '💎',
    description: '1881-1973 | 입체주의',
    featuredWorks: '아비뇽의 처녀들 · 게르니카 · 도라 마르의 초상',
    featuredWorksEn: "Les Demoiselles d'Avignon · Guernica · Portrait of Dora Maar",
    aliases: ['pablo', 'pablo picasso', '피카소', 'ピカソ', 'パブロ・ピカソ', 'بيكاسو', 'بابلو بيكاسو', 'ปิกาสโซ', '畢卡索', '巴勃羅·畢卡索'],
    works: {
      'doramaar': ['Portrait of Dora Maar, 1937', '도라 마르의 초상, 1937', 'Dora Maar']
    }
  }
};

// ========== 동양화 데이터 ==========
export const ORIENTAL = {
  korean: {
    id: 'korean',
    ko: '한국 전통회화',
    en: 'Korean Traditional Art',
    icon: '🎎',
    description: '여백과 절제의 미',
    descriptionEn: 'Spirit captured in empty space',
    styles: {
      'minhwa': { 
        ko: '민화', 
        en: 'Minhwa',
        description: '민중의 소망을 담은 화려한 색채와 해학',
        descriptionEn: 'Folk dreams on canvas',
        aliases: ['korean minhwa', 'korean-minhwa', '한국 민화', '민화', 'korean folk painting (minhwa)', 'korean folk painting']
      },
      'pungsokdo': { 
        ko: '풍속도', 
        en: 'Pungsokdo',
        description: '조선 서민의 일상을 생동감 있게 포착',
        descriptionEn: 'Daily life of the people',
        aliases: ['korean pungsokdo', 'korean-pungsokdo', 'korean-genre', '풍속화', '한국 풍속도', 'korean genre painting (pungsokdo)', 'korean genre painting']
      },
      'jingyeong': { 
        ko: '진경산수화', 
        en: 'Jingyeong Sansuhwa',
        description: '실제 산수를 사실적으로 담아낸 조선의 풍경화',
        descriptionEn: 'Korean landscapes through Joseon eyes',
        aliases: ['korean jingyeong', 'korean-jingyeong', 'korean jingyeong landscape', '진경산수', '한국 진경산수화', 'korean true-view landscape (jingyeong)', 'korean true-view landscape']
      }
    }
  },
  chinese: {
    id: 'chinese',
    ko: '중국 전통회화',
    en: 'Chinese Traditional Art',
    icon: '🐉',
    description: '붓과 먹의 철학',
    descriptionEn: 'Universe in shades of ink',
    styles: {
      'gongbi': { 
        ko: '공필화', 
        en: 'Gongbi',
        description: '세밀한 필치와 화려한 채색의 궁정 회화',
        descriptionEn: 'Precision crafted by brush',
        aliases: ['chinese gongbi', 'chinese-gongbi', '중국 공필화', '공필화', 'chinese meticulous court painting (gongbi)', 'chinese meticulous court painting']
      },
      'ink-wash': { 
        ko: '수묵화', 
        en: 'Ink Wash Painting',
        description: '먹의 농담으로 표현하는 동양 정신의 정수',
        descriptionEn: 'Spirit painted in ink',
        aliases: ['chinese ink wash', 'chinese-ink', 'chinese-ink-wash', '중국 수묵화', '수묵화']
      }
    }
  },
  japanese: {
    id: 'japanese',
    ko: '일본 전통회화',
    en: 'Japanese Traditional Art',
    icon: '🌊',
    description: '섬세한 관찰과 대담함',
    descriptionEn: 'Beauty of the floating world',
    styles: {
      'ukiyoe': { 
        ko: '우키요에', 
        en: 'Ukiyo-e',
        description: '대담한 윤곽선과 평면적 색채의 목판화',
        descriptionEn: 'Floating world pressed in woodblock',
        aliases: ['japanese ukiyo-e', 'japanese-ukiyoe', 'ukiyo-e', '일본 우키요에', '우키요에', 'japanese ukiyo-e woodblock print', 'japanese ukiyo-e woodblock prints']
      },
      'rinpa': { 
        ko: '린파', 
        en: 'Rinpa',
        description: '금박과 화려한 장식의 일본 전통 장식화',
        descriptionEn: 'Decorative splendor with gold leaf and bold design',
        aliases: ['japanese rinpa', 'japanese-rinpa', 'rinpa school', '일본 린파', '린파']
      }
    }
  }
};

// ========== 사조별 화가 데이터 (AI 선택용) ==========
export const MOVEMENT_ARTISTS = {
  ancient: {
    'classical-sculpture': { 
      ko: '고대 그리스 조각', 
      en: 'Greek Sculpture',
      description: '이상적 인체 비례와 균형잡힌 조형미',
      aliases: ['classical sculpture', 'polykleitos', 'phidias', 'myron', 'praxiteles', '그리스 조각']
    },
    'roman-mosaic': { 
      ko: '로마 모자이크', 
      en: 'Roman Mosaic',
      description: '화려한 색채 조각으로 빚은 장식 예술',
      aliases: ['mosaic', '모자이크']
    }
  },
  medieval: {
    'byzantine': { 
      ko: '비잔틴', 
      en: 'Byzantine',
      description: '금빛 배경과 신성한 도상의 종교 미술',
      aliases: ['byzantine art', '비잔틴 미술']
    },
    'gothic': { 
      ko: '고딕', 
      en: 'Gothic',
      description: '섬세한 선과 수직적 상승의 경건함',
      aliases: ['gothic art', 'limbourg brothers', '고딕 미술', '랭부르 형제']
    },
    'islamic-miniature': { 
      ko: '이슬람 세밀화', 
      en: 'Islamic Miniature',
      description: '정교한 문양과 화려한 색채의 세밀화',
      aliases: ['islamic', 'persian miniature', '페르시아 세밀화']
    }
  },
  renaissance: {
    'leonardo': { 
      ko: '레오나르도 다 빈치', 
      en: 'Leonardo da Vinci', 
      years: '1452~1519',
      description: '스푸마토 기법과 과학적 관찰의 완벽한 조화',
      aliases: ['da vinci', '다빈치', '레오나르도']
    },
    'michelangelo': { 
      ko: '미켈란젤로 부오나로티', 
      en: 'Michelangelo', 
      years: '1475~1564',
      description: '역동적 인체 표현과 웅장한 스케일',
      aliases: ['michelangelo buonarroti', '미켈란젤로']
    },
    'raphael': { 
      ko: '라파엘로 산치오', 
      en: 'Raphael', 
      years: '1483~1520',
      description: '조화로운 구도와 우아한 이상미',
      aliases: ['raphael sanzio', 'raffaello', '라파엘로']
    },
    'botticelli': { 
      ko: '산드로 보티첼리', 
      en: 'Botticelli', 
      years: '1445~1510',
      description: '우아한 곡선과 신화적 아름다움',
      aliases: ['sandro botticelli', '보티첼리']
    },
    'titian': { 
      ko: '티치아노 베첼리오', 
      en: 'Titian', 
      years: '1488~1576',
      description: '풍부한 색채와 관능적 질감 표현',
      aliases: ['tiziano', '티치아노']
    }
  },
  baroque: {
    'caravaggio': { 
      ko: '미켈란젤로 메리시 다 카라바조', 
      en: 'Caravaggio', 
      years: '1571~1610',
      description: '극적인 명암 대비와 사실적 긴장감',
      aliases: ['카라바조']
    },
    'rembrandt': { 
      ko: '렘브란트 판 레인', 
      en: 'Rembrandt', 
      years: '1606~1669',
      description: '빛으로 드러나는 인간 내면의 깊이',
      aliases: ['rembrandt van rijn', '렘브란트']
    },
    'velazquez': { 
      ko: '디에고 벨라스케스', 
      en: 'Velázquez', 
      years: '1599~1660',
      description: '붓터치로 포착한 공기와 현실',
      aliases: ['velázquez', 'diego velázquez', '벨라스케스']
    },
    'rubens': { 
      ko: '피터 파울 루벤스', 
      en: 'Rubens', 
      years: '1577~1640',
      description: '역동적 구도와 풍요로운 육체미',
      aliases: ['peter paul rubens', '루벤스']
    }
  },
  rococo: {
    'watteau': { 
      ko: '장 앙투안 와토', 
      en: 'Watteau', 
      years: '1684~1721',
      description: '우아한 연인들과 꿈결 같은 분위기',
      aliases: ['antoine watteau', 'jean-antoine watteau', '와토']
    },
    'boucher': { 
      ko: '프랑수아 부셰', 
      en: 'Boucher', 
      years: '1703~1770',
      description: '감각적 색채와 화려한 장식미',
      aliases: ['françois boucher', 'francois boucher', '부셰']
    }
  },
  neoclassicism: {
    'david': { 
      ko: '자크 루이 다비드', 
      en: 'Jacques-Louis David', 
      years: '1748~1825',
      description: '엄격한 구도와 고전적 영웅 서사',
      aliases: ['jacques-louis david', '다비드']
    },
    'ingres': { 
      ko: '장 오귀스트 도미니크 앵그르', 
      en: 'Ingres', 
      years: '1780~1867',
      description: '매끄러운 선과 이상화된 인체 표현',
      aliases: ['jean-auguste-dominique ingres', '앵그르']
    }
  },
  romanticism: {
    'delacroix': { 
      ko: '외젠 들라크루아', 
      en: 'Delacroix', 
      years: '1798~1863',
      description: '격정적 색채와 드라마틱한 역동성',
      aliases: ['eugène delacroix', 'eugene delacroix', '들라크루아']
    },
    'turner': { 
      ko: '조지프 말러드 윌리엄 터너', 
      en: 'Turner', 
      years: '1775~1851',
      description: '빛과 대기를 용해시킨 숭고한 자연',
      aliases: ['j.m.w. turner', 'joseph mallord william turner', 'william turner', '터너']
    }
  },
  realism: {
    'courbet': { 
      ko: '귀스타브 쿠르베', 
      en: 'Courbet', 
      years: '1819~1877',
      description: '있는 그대로의 현실을 담담하게 직시',
      aliases: ['gustave courbet', '쿠르베']
    }
  },
  impressionism: {
    'monet': { 
      ko: '클로드 모네', 
      en: 'Claude Monet', 
      years: '1840~1926',
      description: '빛과 색의 순간적 인상을 포착',
      aliases: ['모네']
    },
    'renoir': { 
      ko: '피에르 오귀스트 르누아르', 
      en: 'Renoir', 
      years: '1841~1919',
      description: '따스한 색감과 행복한 삶의 순간',
      aliases: ['pierre-auguste renoir', 'auguste renoir', '르누아르']
    },
    'degas': { 
      ko: '에드가 드가', 
      en: 'Degas', 
      years: '1834~1917',
      description: '움직임의 순간과 파격적 구도',
      aliases: ['edgar degas', '드가']
    },
    'manet': { 
      ko: '에두아르 마네', 
      en: 'Manet', 
      years: '1832~1883',
      description: '현대적 시선으로 포착한 도시 일상',
      aliases: ['édouard manet', 'edouard manet', '마네']
    },
    'caillebotte': { 
      ko: '귀스타브 카유보트', 
      en: 'Caillebotte', 
      years: '1848~1894',
      description: '대담한 원근법과 도시 풍경의 서정',
      aliases: ['gustave caillebotte', '카유보트']
    }
  },
  postImpressionism: {
    'vangogh': { 
      ko: '빈센트 반 고흐', 
      en: 'Vincent van Gogh', 
      years: '1853~1890',
      description: '소용돌이치는 붓터치와 강렬한 감정 표현',
      aliases: ['van gogh', 'gogh', '고흐', '반 고흐']
    },
    'gauguin': { 
      ko: '폴 고갱', 
      en: 'Paul Gauguin', 
      years: '1848~1903',
      description: '원시적 색채와 이국적 상징의 세계',
      aliases: ['고갱']
    },
    'cezanne': { 
      ko: '폴 세잔', 
      en: 'Paul Cézanne', 
      years: '1839~1906',
      description: '자연을 기하학적 형태로 재구성',
      aliases: ['cézanne', 'paul cézanne', '세잔']
    }
  },
  fauvism: {
    'matisse': { 
      ko: '앙리 마티스', 
      en: 'Henri Matisse', 
      years: '1869~1954',
      description: '순수한 색채와 단순화된 형태의 기쁨',
      aliases: ['henri matisse', '마티스']
    },
    'derain': { 
      ko: '앙드레 드랭', 
      en: 'André Derain', 
      years: '1880~1954',
      description: '대담한 원색과 자유로운 붓놀림',
      aliases: ['andré derain', 'andre derain', '드랭']
    },
    'vlaminck': { 
      ko: '모리스 드 블라맹크', 
      en: 'Maurice de Vlaminck', 
      years: '1876~1958',
      description: '격렬한 색채와 거친 표현의 본능',
      aliases: ['maurice de vlaminck', '블라맹크']
    }
  },
  expressionism: {
    'munch': { 
      ko: '에드바르 뭉크', 
      en: 'Edvard Munch', 
      years: '1863~1944',
      description: '불안과 고독을 왜곡된 형상으로 표출',
      aliases: ['edvard munch', '뭉크']
    },
    'kirchner': { 
      ko: '에른스트 루트비히 키르히너', 
      en: 'Ernst Ludwig Kirchner', 
      years: '1880~1938',
      description: '날카로운 선과 강렬한 색의 도시 풍경',
      aliases: ['ernst ludwig kirchner', '키르히너']
    },
    'kokoschka': { 
      ko: '오스카 코코슈카', 
      en: 'Oskar Kokoschka', 
      years: '1886~1980',
      description: '격정적 붓터치로 드러낸 심리의 폭풍',
      aliases: ['oskar kokoschka', '코코슈카']
    }
  },
  modernism: {
    'picasso': { 
      ko: '파블로 피카소', 
      en: 'Pablo Picasso', 
      years: '1881~1973', 
      sub: 'cubism',
      description: '다시점으로 해체하고 재구성한 형태',
      aliases: ['pablo picasso', '피카소']
    },
    'lichtenstein': { 
      ko: '로이 리히텐슈타인', 
      en: 'Roy Lichtenstein', 
      years: '1923~1997', 
      sub: 'popArt',
      description: '만화적 점묘와 대중문화의 아이러니',
      aliases: ['roy lichtenstein', '리히텐슈타인']
    },
    'miro': { 
      ko: '호안 미로', 
      en: 'Joan Miró', 
      years: '1893~1983', 
      sub: 'surrealism',
      description: '자유로운 기호와 유희적 색채의 우주',
      aliases: ['joan miró', 'joan miro', 'miró', '미로']
    },
    'magritte': { 
      ko: '르네 마그리트', 
      en: 'René Magritte', 
      years: '1898~1967', 
      sub: 'surrealism',
      description: '일상 속 낯선 조합으로 현실을 질문',
      aliases: ['rené magritte', 'rene magritte', '마그리트']
    },
    'chagall': { 
      ko: '마르크 샤갈', 
      en: 'Marc Chagall', 
      years: '1887~1985', 
      sub: 'surrealism',
      description: '꿈과 사랑이 떠다니는 환상의 세계',
      aliases: ['marc chagall', '샤갈']
    }
  }
};

// ========== 유틸리티 함수 ==========

/**
 * 사조 전체 이름 생성: 한글명(영문명, 시기)
 */
export const getMovementFullName = (movementId) => {
  const m = MOVEMENTS[movementId];
  if (!m) return movementId;
  return `${m.ko}(${m.en}, ${m.period})`;
};

/**
 * 거장 전체 이름 생성: 한글명(영문명, 생몰연도)
 */
export const getMasterFullName = (masterId) => {
  const m = MASTERS[masterId];
  if (!m) return masterId;
  return `${m.ko}(${m.en}, ${m.years})`;
};

/**
 * 동양화 전체 이름 생성: 한글명(영문명)
 */
export const getOrientalFullName = (orientalId) => {
  const o = ORIENTAL[orientalId];
  if (!o) return orientalId;
  return `${o.ko}(${o.en})`;
};

/**
 * ID로 사조 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMovement = (nameOrId) => {
  // ID로 직접 찾기
  if (MOVEMENTS[nameOrId]) return MOVEMENTS[nameOrId];
  
  // 한글명으로 찾기
  const normalized = nameOrId?.toLowerCase().trim();
  for (const key in MOVEMENTS) {
    const m = MOVEMENTS[key];
    if (m.ko === nameOrId || m.ko.toLowerCase() === normalized) {
      return m;
    }
  }
  return null;
};

/**
 * ID로 거장 정보 찾기 (한글명으로도 검색 가능)
 */
export const findMaster = (nameOrId) => {
  // ID로 직접 찾기
  if (MASTERS[nameOrId]) return MASTERS[nameOrId];
  
  // 한글명으로 찾기
  for (const key in MASTERS) {
    const m = MASTERS[key];
    if (m.ko === nameOrId || m.en.toLowerCase() === nameOrId?.toLowerCase()) {
      return m;
    }
  }
  return null;
};

/**
 * StyleSelection용 배열 생성
 */
export const getStyleSelectionArray = () => {
  const styles = [];
  
  // 사조
  Object.values(MOVEMENTS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      category: 'movements',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 거장
  Object.values(MASTERS).forEach(m => {
    styles.push({
      id: m.id,
      name: m.ko,
      nameEn: m.en,
      category: 'masters',
      icon: m.icon,
      description: m.description
    });
  });
  
  // 동양화
  Object.values(ORIENTAL).forEach(o => {
    styles.push({
      id: o.id,
      name: o.ko,
      nameEn: o.en,
      category: 'oriental',
      icon: o.icon,
      description: o.description
    });
  });
  
  return styles;
};

/**
 * 화가명(영문 다양한 형태)으로 정보 찾기
 * aliases 배열 활용한 검색
 */
export const findArtistByName = (artistName) => {
  if (!artistName) return null;
  const normalized = artistName.toLowerCase().trim();
  
  // MOVEMENT_ARTISTS에서 검색
  for (const [movementId, artists] of Object.entries(MOVEMENT_ARTISTS)) {
    for (const [artistId, info] of Object.entries(artists)) {
      // ID 매칭
      if (artistId === normalized) {
        return { ...info, movementId, artistId };
      }
      // 영문명 매칭
      if (info.en?.toLowerCase() === normalized) {
        return { ...info, movementId, artistId };
      }
      // 한글명 매칭
      if (info.ko === artistName) {
        return { ...info, movementId, artistId };
      }
      // aliases 매칭
      if (info.aliases) {
        for (const alias of info.aliases) {
          if (alias.toLowerCase() === normalized) {
            return { ...info, movementId, artistId };
          }
        }
      }
      // 부분 매칭 (leonardo da vinci → leonardo)
      if (normalized.includes(artistId) || artistId.includes(normalized)) {
        return { ...info, movementId, artistId };
      }
    }
  }
  return null;
};

/**
 * 거장(MASTERS)에서 화가명/작품명으로 검색
 * @returns { master, workKey } 또는 null
 */
export const findMasterByNameOrWork = (artistName, workName) => {
  if (!artistName && !workName) return null;
  const normalizedArtist = artistName?.toLowerCase().trim();
  const normalizedWork = workName?.toLowerCase().trim();
  
  // 1차: 화가명 매칭 우선 (전체 순회)
  for (const [masterId, master] of Object.entries(MASTERS)) {
    const artistMatch = 
      masterId === normalizedArtist ||
      masterId.replace('-master', '') === normalizedArtist ||
      master.key === normalizedArtist ||
      master.en?.toLowerCase() === normalizedArtist ||
      master.ko === artistName ||
      master.aliases?.some(a => a.toLowerCase() === normalizedArtist);
    
    if (artistMatch) {
      if (workName && master.works) {
        for (const [workKey, workNames] of Object.entries(master.works)) {
          if (workNames.some(w => w.toLowerCase() === normalizedWork || normalizedWork?.includes(w.toLowerCase()))) {
            return { master, workKey, masterId };
          }
        }
      }
      return { master, workKey: null, masterId };
    }
  }
  
  // 2차: 화가명 매칭 실패 시에만 작품명으로 검색
  if (workName) {
    for (const [masterId, master] of Object.entries(MASTERS)) {
      if (master.works) {
        for (const [workKey, workNames] of Object.entries(master.works)) {
          if (workNames.some(w => w.toLowerCase() === normalizedWork || normalizedWork?.includes(w.toLowerCase()))) {
            return { master, workKey, masterId };
          }
        }
      }
    }
  }
  
  return null;
};

/**
 * 동양화 스타일 검색 (aliases 활용)
 * @returns { country, style, styleId } 또는 null
 */
export const findOrientalStyle = (styleName) => {
  if (!styleName) return null;
  const normalized = styleName.toLowerCase().trim();
  
  // 1단계: 스타일 매칭 먼저 (aliases 포함) - 사조/거장과 동일한 방식
  for (const [countryId, country] of Object.entries(ORIENTAL)) {
    if (country.styles) {
      for (const [styleId, style] of Object.entries(country.styles)) {
        if (styleId === normalized ||
            style.ko === styleName ||
            style.en?.toLowerCase() === normalized ||
            style.aliases?.some(a => a.toLowerCase() === normalized)) {
          return { 
            country, 
            style, 
            styleId,
            key: `${countryId}-${styleId}`
          };
        }
      }
    }
  }
  
  // 1.5단계: 괄호 내용 추출 후 재시도 (API가 "Korean Genre Painting (Pungsokdo)" 같은 형식 반환 시)
  const parenMatch = normalized.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const insideParen = parenMatch[1].toLowerCase().trim();
    for (const [countryId, country] of Object.entries(ORIENTAL)) {
      if (country.styles) {
        for (const [styleId, style] of Object.entries(country.styles)) {
          if (styleId === insideParen ||
              style.en?.toLowerCase() === insideParen ||
              style.aliases?.some(a => a.toLowerCase() === insideParen)) {
            return { 
              country, 
              style, 
              styleId,
              key: `${countryId}-${styleId}`
            };
          }
        }
      }
    }
  }
  
  // 1.6단계: 괄호 제거 후 재시도
  const withoutParens = normalized.replace(/\s*\([^)]*\)\s*/g, '').trim();
  if (withoutParens !== normalized) {
    for (const [countryId, country] of Object.entries(ORIENTAL)) {
      if (country.styles) {
        for (const [styleId, style] of Object.entries(country.styles)) {
          if (styleId === withoutParens ||
              style.en?.toLowerCase() === withoutParens ||
              style.aliases?.some(a => a.toLowerCase() === withoutParens)) {
            return { 
              country, 
              style, 
              styleId,
              key: `${countryId}-${styleId}`
            };
          }
        }
      }
    }
  }
  
  // 2단계: 스타일 매칭 실패 시 국가 매칭 (fallback)
  for (const [countryId, country] of Object.entries(ORIENTAL)) {
    if (country.ko === styleName || 
        country.ko.includes(styleName) ||
        styleName.includes(country.ko) ||
        country.en?.toLowerCase() === normalized ||
        countryId === normalized ||
        normalized.includes(countryId) ||
        styleName.includes('한국') && countryId === 'korean' ||
        styleName.includes('중국') && countryId === 'chinese' ||
        styleName.includes('일본') && countryId === 'japanese') {
      // 국가 매칭 시 첫 번째 스타일 반환
      const firstStyleId = Object.keys(country.styles)[0];
      const firstStyle = country.styles[firstStyleId];
      return {
        country,
        style: firstStyle,
        styleId: firstStyleId,
        key: `${countryId}-${firstStyleId}`
      };
    }
  }
  
  return null;
};

/**
 * 교육자료 키 생성 (educationMatcher 대체)
 * @param {string} category - 'masters' | 'movements' | 'oriental'
 * @param {string} artist - 화가/스타일명
 * @param {string} work - 작품명 (거장만)
 * @returns {string|null} 교육자료 키
 */
export const getEducationKey = (category, artist, work) => {
  if (!category) return null;
  
  // 거장
  if (category === 'masters') {
    const result = findMasterByNameOrWork(artist, work);
    if (result) {
      // 작품별 키: vangogh-starrynight
      if (result.workKey) {
        return `${result.master.key}-${result.workKey}`;
      }
      // 화가 키만: vangogh
      return result.master.key;
    }
    return null;
  }
  
  // 미술사조
  if (category === 'movements') {
    const result = findArtistByName(artist);
    if (result) {
      return result.artistId;  // monet, vangogh 등
    }
    return null;
  }
  
  // 동양화
  if (category === 'oriental') {
    const result = findOrientalStyle(artist);
    if (result) {
      return result.key;  // korean-minhwa 등
    }
    return null;
  }
  
  return null;
};

/**
 * 사조 표시 정보 생성 (ResultScreen용)
 * @returns { title: '르네상스(Renaissance, 14~16세기)', subtitle: '레오나르도 다 빈치' }
 */
export const getMovementDisplayInfo = (styleName, artistName) => {
  // 1. 사조 정보 찾기
  let movement = findMovement(styleName);
  let actualMovementName = styleName;
  
  // "신고전 vs 낭만 vs 사실주의" 특수 처리
  if (styleName === '신고전 vs 낭만 vs 사실주의' && artistName) {
    const artist = findArtistByName(artistName);
    if (artist) {
      if (artist.movementId === 'neoclassicism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '신고전주의';
        const neo = NINETEENTH_CENTURY_SUB?.neoclassicism;
        if (neo) movement = { ...movement, en: neo.en, period: neo.period };
      } else if (artist.movementId === 'romanticism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '낭만주의';
        const rom = NINETEENTH_CENTURY_SUB?.romanticism;
        if (rom) movement = { ...movement, en: rom.en, period: rom.period };
      } else if (artist.movementId === 'realism') {
        movement = MOVEMENTS.neoclassicism_vs_romanticism_vs_realism;
        actualMovementName = '사실주의';
        const real = NINETEENTH_CENTURY_SUB?.realism;
        if (real) movement = { ...movement, en: real.en, period: real.period };
      }
    }
  }
  
  // "모더니즘" 특수 처리
  if (styleName === '모더니즘' && artistName) {
    const artist = findArtistByName(artistName);
    if (artist?.sub) {
      const subInfo = MODERNISM_SUB?.[artist.sub];
      if (subInfo) {
        actualMovementName = subInfo.ko;
        movement = { ...movement, en: subInfo.en, period: subInfo.period };
      }
    }
  }
  
  // 2. 화가 정보 찾기
  const artist = findArtistByName(artistName);
  
  // 3. 결과 생성
  const mvEn = movement?.en || styleName;
  const mvPeriod = movement?.period || '';
  const title = mvPeriod ? `${actualMovementName}(${mvEn}, ${mvPeriod})` : `${actualMovementName}(${mvEn})`;
  const subtitle = artist?.ko || artistName || '';
  
  return { title, subtitle };
};

/**
 * 동양화 표시 정보 생성 (ResultScreen용)
 * @returns { title: '한국 전통회화(Korean Traditional Painting)', subtitle: '민화' }
 */
export const getOrientalDisplayInfo = (artistName) => {
  if (!artistName) return { title: '동양화', subtitle: '' };
  const normalized = artistName.toLowerCase().trim();
  
  // ORIENTAL에서 검색
  for (const [countryId, country] of Object.entries(ORIENTAL)) {
    // 1. 국가 매칭 (예: "한국 전통화", "Korean", "중국 전통회화")
    if (country.ko === artistName || 
        country.en?.toLowerCase() === normalized ||
        artistName.includes(country.ko?.replace(' 전통회화', '')) ||
        artistName.includes('한국') && countryId === 'korean' ||
        artistName.includes('중국') && countryId === 'chinese' ||
        artistName.includes('일본') && countryId === 'japanese') {
      // 국가 매칭 시: 국가명(영문) + 스타일 목록
      const styleList = country.styles 
        ? Object.values(country.styles).map(s => s.ko).join(' · ')
        : '';
      return {
        title: `${country.ko}(${country.en})`,
        subtitle: styleList
      };
    }
    
    // 2. 스타일 매칭 (예: "민화", "Minhwa")
    if (country.styles) {
      for (const [styleId, style] of Object.entries(country.styles)) {
        if (styleId === normalized || 
            style.ko === artistName || 
            style.en?.toLowerCase() === normalized ||
            normalized.includes(styleId) ||
            normalized.includes(style.ko)) {
          return {
            title: `${country.ko}(${country.en})`,
            subtitle: style.ko
          };
        }
      }
    }
  }
  
  return { title: '동양화', subtitle: artistName };
};

/**
 * 스타일 부제 배열 가져오기 (3줄 표기용)
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} styleId - 스타일 ID
 * @param {string} mode - 모드:
 *   - 'loading-single' : 단독 변환중
 *   - 'loading-oneclick' : 원클릭 변환중-원본 (현행유지)
 *   - 'loading-oneclick-preview' : 원클릭 변환중-완료 미리보기
 *   - 'result-original' : 결과-원본 (변환중과 동일)
 *   - 'result-transformed' : 결과-결과 (매칭 정보)
 * @param {string} displayArtist - AI가 선택한 화가/스타일
 * @param {string} displayWork - AI가 선택한 대표작 (거장용)
 * @param {string} artistName - 거장 이름 (masters일 때)
 * @returns {[string, string]} [부제1, 부제2]
 */
export const getStyleSubtitles = (category, styleId, mode, displayArtist, displayWork, artistName, lang = 'ko') => {
  const isKo = lang === 'ko';
  
  // 원클릭 변환중-원본 → 현행유지 (1줄만)
  if (mode === 'loading-oneclick') {
    return [null, null]; // 기존 방식 사용 signal
  }
  
  // ===== 사조 =====
  if (category === 'movements') {
    const movement = findMovement(styleId);
    
    // 복합사조 세부 description 해결 헬퍼
    const getSubDescription = (artist) => {
      if (!artist) return null;
      if (styleId === 'neoclassicism_vs_romanticism_vs_realism' && artist.movementId) {
        const sub = NINETEENTH_CENTURY_SUB[artist.movementId];
        if (sub) return !isKo ? (sub.descriptionEn || sub.description) : sub.description;
      }
      if (styleId === 'modernism' && artist.sub) {
        const sub = MODERNISM_SUB[artist.sub];
        if (sub) return !isKo ? (sub.descriptionEn || sub.description) : sub.description;
      }
      return null;
    };
    
    // 변환중 또는 결과-원본: 대표화가 + 사조 화풍
    if (mode === 'loading-single' || mode === 'result-original') {
      // i18n 언어별 movements 데이터 우선 사용
      const i18nMovements = getMovementsBasicInfo(lang) || {};
      const i18nMov = i18nMovements[styleId];
      if (i18nMov?.loading) {
        return [
          i18nMov.loading.subtitle1 || '',
          i18nMov.loading.subtitle2 || ''
        ];
      }
      // fallback: ko/en
      return [
        isKo ? (movement?.subtitle || '') : (movement?.subtitleEn || movement?.subtitle || ''),
        isKo ? (movement?.description || '') : (movement?.descriptionEn || movement?.description || '')
      ];
    } 
    // 결과-결과 또는 완료 미리보기: 매칭화가 + 세부사조명 · 화풍
    else {
      const artist = findArtistByName(displayArtist);

      // ★ i18n 통합: 11개 언어 동일 경로 — movementsBasicInfo[artistId].result
      if (artist?.artistId) {
        const i18nBasic = getMovementsBasicInfo(lang) || {};
        const i18nArtistResult = i18nBasic[artist.artistId]?.result;
        if (i18nArtistResult?.subtitle2) {
          // 복합사조: 부제1에 세부사조명 접두어 추가
          let sub1 = i18nArtistResult.subtitle1 || artist.en || displayArtist || '';
          if (styleId === 'modernism' && artist?.sub) {
            const sub = MODERNISM_SUB[artist.sub];
            if (sub) sub1 = `[${!isKo ? sub.en : sub.ko}] ${sub1}`;
          }
          if (styleId === 'neoclassicism_vs_romanticism_vs_realism' && artist?.movementId) {
            const sub = NINETEENTH_CENTURY_SUB[artist.movementId];
            if (sub) sub1 = `[${!isKo ? sub.en : sub.ko}] ${sub1}`;
          }
          return [
            sub1,
            i18nArtistResult.subtitle2
          ];
        }
      }

      const artistDisplay = artist 
        ? (!isKo ? (artist.en || artist.ko) : `${artist.ko}(${artist.en})`)
        : displayArtist || '';

      // fallback: i18n 데이터 없을 때 하드코딩
      const i18nMovements = getMovementsResultEducation(lang) || {};
      const i18nMov = i18nMovements[styleId];
      if (i18nMov?.result?.subtitle2) {
        // 복합사조: 부제1에 세부사조명 접두어 추가
        let sub1fb = i18nMov.result.subtitle1 || artistDisplay;
        if (styleId === 'modernism' && artist?.sub) {
          const sub = MODERNISM_SUB[artist.sub];
          if (sub) sub1fb = `[${!isKo ? sub.en : sub.ko}] ${sub1fb}`;
        }
        if (styleId === 'neoclassicism_vs_romanticism_vs_realism' && artist?.movementId) {
          const sub = NINETEENTH_CENTURY_SUB[artist.movementId];
          if (sub) sub1fb = `[${!isKo ? sub.en : sub.ko}] ${sub1fb}`;
        }
        return [
          sub1fb,
          i18nMov.result.subtitle2
        ];
      }

      // 복합사조: 세부 SUB description 우선 → 화가 description → 부모 사조 description
      const subDesc = getSubDescription(artist);
      const artistStyle = subDesc 
        || (!isKo 
          ? (artist?.descriptionEn || movement?.descriptionEn || artist?.description || movement?.description || '')
          : (artist?.description || movement?.description || ''));
      
      // 복합사조: 부제1에 세부사조명 접두 (예: "[Cubism] Picasso")
      let sub1final = artistDisplay;
      if (styleId === 'modernism' && artist?.sub) {
        const sub = MODERNISM_SUB[artist.sub];
        if (sub) {
          const subName = !isKo ? sub.en : sub.ko;
          sub1final = `[${subName}] ${artistDisplay}`;
        }
      }
      if (styleId === 'neoclassicism_vs_romanticism_vs_realism' && artist?.movementId) {
        const sub = NINETEENTH_CENTURY_SUB[artist.movementId];
        if (sub) {
          const subName = !isKo ? sub.en : sub.ko;
          sub1final = `[${subName}] ${artistDisplay}`;
        }
      }
      
      return [
        sub1final,      // 부제1: [세부사조명] 매칭화가
        artistStyle     // 부제2: 화풍 설명
      ];
    }
  }
  
  // ===== 거장 =====
  if (category === 'masters') {
    const result = findMasterByNameOrWork(artistName || styleId, displayWork);
    const master = result?.master;

    if (!master) return ['', ''];

    // i18n 언어별 거장 데이터
    const i18nBasic = getMastersBasicInfo(lang) || {};
    const masterKey = master.key || master.id?.replace('-master', '');
    const i18nMaster = i18nBasic[masterKey];

    // 변환중 또는 결과-원본: 사조 + 태그라인
    if (mode === 'loading-single' || mode === 'result-original') {
      if (i18nMaster?.loading) {
        return [
          i18nMaster.loading.subtitle1 || '',
          i18nMaster.loading.subtitle2 || ''
        ];
      }
      // fallback: ko/en
      return [
        isKo ? (master.movement || '') : (master.movementEn || master.movement || ''),
        isKo ? (master.tagline || '') : (master.taglineEn || master.tagline || '')
      ];
    }

    // 결과: i18n result 데이터 사용
    const i18nResult = i18nMaster?.result;

    // 원클릭 결과: 전체 대표작
    if (mode === 'result-oneclick') {
      return [
        i18nResult?.subtitle1 || (isKo ? master.featuredWorks : master.featuredWorksEn) || '',
        i18nResult?.subtitle2 || (isKo ? master.tagline : master.taglineEn) || ''
      ];
    }

    // 단독 결과: 작품 매칭 → i18n works 사용
    if (result?.workKey && i18nResult?.works?.[result.workKey]) {
      const w = i18nResult.works[result.workKey];
      return [w.subtitle1 || '', w.subtitle2 || ''];
    }

    // fallback: 전체 대표작
    return [
      i18nResult?.subtitle1 || (isKo ? master.featuredWorks : master.featuredWorksEn) || '',
      i18nResult?.subtitle2 || (isKo ? master.tagline : master.taglineEn) || ''
    ];
  }
  
  // ===== 동양화 =====
  if (category === 'oriental') {
    // i18n 언어별 데이터 우선 조회
    const i18nOriental = getOrientalBasicInfo(lang) || {};

    // displayArtist에서 국가/스타일 정보 추출
    const result = findOrientalStyle(displayArtist || styleId);

    // key에서 국가키 추출 (예: "chinese-gongbi" → "chinese")
    const countryKey = result?.key ? result.key.split('-')[0] : styleId;
    // 장르 풀 키 (예: "chinese-gongbi")
    const genreKey = result?.key || styleId;

    // 변환중 또는 결과-원본: 국가 레벨 loading 데이터
    if (mode === 'loading-single' || mode === 'result-original') {
      const i18nCountry = i18nOriental[countryKey];
      if (i18nCountry?.loading?.subtitle1) {
        return [
          i18nCountry.loading.subtitle1,
          i18nCountry.loading.subtitle2 || ''
        ];
      }
      // fallback: ko/en
      if (result?.country) {
        const styleList = result.country.styles
          ? Object.values(result.country.styles).map(s => !isKo ? (s.en || s.ko) : s.ko).join(' · ')
          : '';
        return [
          styleList,
          !isKo ? (result.country.descriptionEn || result.country.description || '') : (result.country.description || '')
        ];
      }
    }
    // 결과-결과 또는 완료 미리보기: 장르 레벨 result 데이터
    else {
      const i18nGenre = i18nOriental[genreKey];
      if (i18nGenre?.result?.subtitle1) {
        return [
          i18nGenre.result.subtitle1,
          i18nGenre.result.subtitle2 || ''
        ];
      }
      // fallback: ko/en
      if (result?.style) {
        return [
          !isKo ? (result.style.en || result.style.ko || '') : (result.style.ko || ''),
          !isKo ? (result.style.descriptionEn || result.style.description || result.country?.descriptionEn || result.country?.description || '')
               : (result.style.description || result.country?.description || '')
        ];
      }
    }

    return ['', ''];
  }
  
  return ['', ''];
};

// ========== 기본 export ==========
export default {
  CATEGORY_ICONS,
  MOVEMENTS,
  MODERNISM_SUB,
  NINETEENTH_CENTURY_SUB,
  ART_NOUVEAU,
  MASTERS,
  RESERVE_MASTERS,
  ORIENTAL,
  MOVEMENT_ARTISTS,
  getMovementFullName,
  getMasterFullName,
  getOrientalFullName,
  findMovement,
  findMaster,
  findArtistByName,
  findMasterByNameOrWork,
  findOrientalStyle,
  getEducationKey,
  getMovementDisplayInfo,
  getOrientalDisplayInfo,
  getStyleSubtitles,
  getStyleSelectionArray
};
