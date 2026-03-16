// ========================================
// displayConfig.js - 매칭 시스템 컨트롤 타워
// v75 - 2026-02-18
// ========================================
// 
// 모든 키 정규화, 별칭 매핑, 표시 정보를 한 곳에서 관리
// API 응답 → 정규화 → 교육자료/UI 표시
//
// v72: 화가 풀네임 별칭 추가 (Sandro Botticelli → botticelli 등)
// v73: 통합 스타일 표시 함수 추가
// v75: Phase 3 — getMovementDisplayInfo 영어/styleId 키 추가 (갤러리 i18n 호환)
//
// ========================================

// v73: masterData에서 스타일 정보 import
import { MOVEMENTS, ORIENTAL, MASTERS, getStyleSubtitles as getStyleSubtitlesFromMaster } from '../data/masterData';
import { getMovementsBasicInfo, getOrientalBasicInfo, getMastersBasicInfo } from '../i18n';

// ========================================
// 1. 표준 키 목록
// ========================================
export const STANDARD_KEYS = {
  // 사조 (11개)
  movements: [
    'greco-roman',
    'medieval-art', 
    'renaissance',
    'baroque',
    'rococo',
    'neoclassicism-romanticism-realism',
    'impressionism',
    'post-impressionism',
    'fauvism',
    'expressionism',
    'modernism'
  ],
  
  // 거장 (7명)
  masters: [
    'vangogh',
    'klimt', 
    'munch',
    'matisse',
    'chagall',
    'frida',
    'lichtenstein'
  ],
  
  // 동양화 (7개) - 기본 순서: 중일한
  oriental: [
    'chinese-ink',
    'chinese-gongbi',
    'japanese-ukiyoe',
    'japanese-rinpa',
    'korean-minhwa',
    'korean-pungsokdo',
    'korean-jingyeong'
  ],
  
  // 사조별 화가 (37명)
  artists: [
    // 그리스·로마
    'classical-sculpture', 'roman-mosaic',
    // 중세
    'byzantine', 'gothic', 'islamic-miniature',
    // 르네상스
    'leonardo', 'michelangelo', 'raphael', 'botticelli', 'titian',
    // 바로크
    'caravaggio', 'rembrandt', 'velazquez', 'rubens',
    // 로코코
    'watteau', 'boucher',
    // 신고전·낭만·사실
    'david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet',
    // 인상주의
    'monet', 'renoir', 'degas', 'caillebotte',
    // 후기인상주의
    'vangogh', 'gauguin', 'cezanne',
    // 야수파
    'matisse', 'derain', 'vlaminck',
    // 표현주의
    'munch', 'kirchner', 'kokoschka',
    // 모더니즘
    'picasso', 'magritte', 'miro', 'chagall', 'lichtenstein'
  ]
};

// ========================================
// 2. 별칭 테이블 (ALIASES)
// ========================================
// 어떤 입력이든 → 표준 키로 변환
export const ALIASES = {
  // ===== 사조 별칭 =====
  // 그리스·로마
  'ancient': 'greco-roman',
  'ancient-art': 'greco-roman',
  'greek-roman': 'greco-roman',
  'greco-roman': 'greco-roman',
  '그리스·로마': 'greco-roman',
  '그리스 로마': 'greco-roman',
  '고대 그리스·로마': 'greco-roman',
  
  // 중세
  'medieval': 'medieval-art',
  'medieval-art': 'medieval-art',
  '중세 미술': 'medieval-art',
  '중세': 'medieval-art',
  
  // 르네상스
  'renaissance': 'renaissance',
  '르네상스': 'renaissance',
  
  // 바로크
  'baroque': 'baroque',
  '바로크': 'baroque',
  
  // 로코코
  'rococo': 'rococo',
  '로코코': 'rococo',
  
  // 신고전·낭만·사실
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism-romanticism-realism',
  'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
  'neoclassicism': 'neoclassicism-romanticism-realism',
  '신고전·낭만·사실주의': 'neoclassicism-romanticism-realism',
  '신고전주의': 'neoclassicism-romanticism-realism',
  
  // 인상주의
  'impressionism': 'impressionism',
  '인상주의': 'impressionism',
  
  // 후기인상주의
  'postImpressionism': 'post-impressionism',
  'post-impressionism': 'post-impressionism',
  'postimpressionism': 'post-impressionism',
  '후기인상주의': 'post-impressionism',
  
  // 야수파
  'fauvism': 'fauvism',
  '야수파': 'fauvism',
  
  // 표현주의
  'expressionism': 'expressionism',
  '표현주의': 'expressionism',
  
  // 모더니즘
  'modernism': 'modernism',
  '모더니즘': 'modernism',
  
  // ===== 거장 별칭 =====
  // 반 고흐
  'vangogh': 'vangogh',
  'van gogh': 'vangogh',
  'vincent van gogh': 'vangogh',
  'vincentvangogh': 'vangogh',
  '반 고흐': 'vangogh',
  '반고흐': 'vangogh',
  '빈센트 반 고흐': 'vangogh',
  '빈센트반고흐': 'vangogh',
  'gogh': 'vangogh',
  '고흐': 'vangogh',
  'vincent': 'vangogh',
  '빈센트': 'vangogh',
  
  // 클림트
  'klimt': 'klimt',
  'gustav klimt': 'klimt',
  'gustavklimt': 'klimt',
  '클림트': 'klimt',
  '구스타프 클림트': 'klimt',
  '구스타프클림트': 'klimt',
  
  // 뭉크
  'munch': 'munch',
  'edvard munch': 'munch',
  'edvardmunch': 'munch',
  '뭉크': 'munch',
  '에드바르 뭉크': 'munch',
  '에드바르뭉크': 'munch',
  
  // 마티스
  'matisse': 'matisse',
  'henri matisse': 'matisse',
  'henrimatisse': 'matisse',
  '마티스': 'matisse',
  '앙리 마티스': 'matisse',
  '앙리마티스': 'matisse',
  
  // 샤갈
  'chagall': 'chagall',
  'marc chagall': 'chagall',
  'marcchagall': 'chagall',
  '샤갈': 'chagall',
  '마르크 샤갈': 'chagall',
  '마르크샤갈': 'chagall',
  
  // 프리다
  'frida': 'frida',
  'frida kahlo': 'frida',
  'fridakahlo': 'frida',
  '프리다': 'frida',
  '프리다 칼로': 'frida',
  '프리다칼로': 'frida',
  
  // 리히텐슈타인
  'lichtenstein': 'lichtenstein',
  'roy lichtenstein': 'lichtenstein',
  'roylichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이 리히텐슈타인': 'lichtenstein',
  '로이리히텐슈타인': 'lichtenstein',

  // ===== 일본어 거장 별칭 =====
  'ファン・ゴッホ': 'vangogh',
  'ゴッホ': 'vangogh',
  'フィンセント・ファン・ゴッホ': 'vangogh',
  'クリムト': 'klimt',
  'グスタフ・クリムト': 'klimt',
  'ムンク': 'munch',
  'エドヴァルド・ムンク': 'munch',
  'マティス': 'matisse',
  'アンリ・マティス': 'matisse',
  'シャガール': 'chagall',
  'マルク・シャガール': 'chagall',
  'ピカソ': 'picasso',
  'パブロ・ピカソ': 'picasso',
  'フリーダ・カーロ': 'frida',
  'リキテンスタイン': 'lichtenstein',
  'ロイ・リキテンスタイン': 'lichtenstein',

  // ===== 아랍어 거장 별칭 =====
  'فان غوخ': 'vangogh',
  'فينسنت فان غوخ': 'vangogh',
  'كليمت': 'klimt',
  'غوستاف كليمت': 'klimt',
  'مونك': 'munch',
  'إدفارد مونك': 'munch',
  'ماتيس': 'matisse',
  'هنري ماتيس': 'matisse',
  'شاغال': 'chagall',
  'مارك شاغال': 'chagall',
  'بيكاسو': 'picasso',
  'بابلو بيكاسو': 'picasso',
  'فريدا كاهلو': 'frida',
  'ليختنشتاين': 'lichtenstein',
  'روي ليختنشتاين': 'lichtenstein',

  // ===== 태국어 거장 별칭 =====
  'ฟาน โกะห์': 'vangogh',
  'วินเซนต์ ฟาน โกะห์': 'vangogh',
  'คลิมท์': 'klimt',
  'กุสตาฟ คลิมท์': 'klimt',
  'มุงก์': 'munch',
  'เอดวาร์ด มุงก์': 'munch',
  'มาติส': 'matisse',
  'อองรี มาติส': 'matisse',
  'ชาร์กาล': 'chagall',
  'มาร์ก ชาร์กาล': 'chagall',
  'ปิกัสโซ': 'picasso',
  'ฟรีดา คาห์โล': 'frida',
  'ลิคเทนสไตน์': 'lichtenstein',

  // ===== 중국어(번체) 거장 별칭 =====
  '梵谷': 'vangogh',
  '文森·梵谷': 'vangogh',
  '克林姆': 'klimt',
  '古斯塔夫·克林姆': 'klimt',
  '孟克': 'munch',
  '愛德華·孟克': 'munch',
  '馬蒂斯': 'matisse',
  '亨利·馬蒂斯': 'matisse',
  '夏卡爾': 'chagall',
  '馬克·夏卡爾': 'chagall',
  '畢卡索': 'picasso',
  '巴勃羅·畢卡索': 'picasso',
  '芙烈達·卡蘿': 'frida',
  '李奇登斯坦': 'lichtenstein',
  '羅伊·李奇登斯坦': 'lichtenstein',
  
  // ===== 동양화 별칭 =====
  // 한국 - 민화
  'korean-minhwa': 'korean-minhwa',
  'korean_minhwa': 'korean-minhwa',
  'korean minhwa': 'korean-minhwa',
  'korean minhwa folk painting': 'korean-minhwa',
  'koreanminhwa': 'korean-minhwa',
  'minhwa': 'korean-minhwa',
  'minhwa folk painting': 'korean-minhwa',
  '민화': 'korean-minhwa',
  '한국 민화': 'korean-minhwa',
  '한국민화': 'korean-minhwa',
  
  // 한국 - 풍속도
  'korean-pungsokdo': 'korean-pungsokdo',
  'korean_pungsokdo': 'korean-pungsokdo',
  'korean pungsokdo': 'korean-pungsokdo',
  'korean pungsokdo genre painting': 'korean-pungsokdo',
  'koreanpungsokdo': 'korean-pungsokdo',
  'korean-genre': 'korean-pungsokdo',
  'korean_genre': 'korean-pungsokdo',
  'korean genre painting': 'korean-pungsokdo',
  'korean genre painting (pungsokdo)': 'korean-pungsokdo',
  'pungsokdo': 'korean-pungsokdo',
  'pungsokdo genre painting': 'korean-pungsokdo',
  '풍속도': 'korean-pungsokdo',
  '한국 풍속도': 'korean-pungsokdo',
  '한국풍속도': 'korean-pungsokdo',
  
  // 한국 - 진경산수
  'korean-jingyeong': 'korean-jingyeong',
  'korean_jingyeong': 'korean-jingyeong',
  'korean jingyeong': 'korean-jingyeong',
  'korean jingyeong landscape': 'korean-jingyeong',
  'koreanjingyeonglandscape': 'korean-jingyeong',
  'jingyeong': 'korean-jingyeong',
  'jingyeong landscape': 'korean-jingyeong',
  '진경산수': 'korean-jingyeong',
  '진경산수화': 'korean-jingyeong',
  '한국 진경산수': 'korean-jingyeong',
  '한국진경산수': 'korean-jingyeong',
  
  // 중국 - 수묵화
  'chinese-ink': 'chinese-ink',
  'chinese_ink': 'chinese-ink',
  'chinese ink': 'chinese-ink',
  'chinese ink wash': 'chinese-ink',
  'chineseinkwash': 'chinese-ink',
  'ink wash': 'chinese-ink',
  'shuimohua': 'chinese-ink',
  '수묵화': 'chinese-ink',
  '중국 수묵화': 'chinese-ink',
  '중국수묵화': 'chinese-ink',
  
  // 중국 - 공필화
  'chinese-gongbi': 'chinese-gongbi',
  'chinese_gongbi': 'chinese-gongbi',
  'chinese gongbi': 'chinese-gongbi',
  'chinese meticulous court painting (gongbi)': 'chinese-gongbi',
  'chinese meticulous court painting': 'chinese-gongbi',
  'chinese gongbi meticulous painting': 'chinese-gongbi',
  'chinesegongbi': 'chinese-gongbi',
  'gongbi': 'chinese-gongbi',
  'gongbi meticulous painting': 'chinese-gongbi',
  '공필화': 'chinese-gongbi',
  '중국 공필화': 'chinese-gongbi',
  '중국공필화': 'chinese-gongbi',
  
  // 일본 - 우키요에
  'japanese-ukiyoe': 'japanese-ukiyoe',
  'japanese_ukiyoe': 'japanese-ukiyoe',
  'japanese ukiyoe': 'japanese-ukiyoe',
  'japanese ukiyo-e': 'japanese-ukiyoe',
  'japaneseukiyoe': 'japanese-ukiyoe',
  'ukiyoe': 'japanese-ukiyoe',
  'ukiyo-e': 'japanese-ukiyoe',
  'japanese ukiyo-e woodblock': 'japanese-ukiyoe',
  'japanese ukiyo-e woodblock print': 'japanese-ukiyoe',
  'japanese ukiyo-e woodblock prints': 'japanese-ukiyoe',
  // v79: 우키요에 5분기 별칭
  'japanese ukiyo-e bijin-ga': 'japanese-ukiyoe',
  'japanese ukiyo-e yakusha-e': 'japanese-ukiyoe',
  'japanese ukiyo-e meisho-e landscape': 'japanese-ukiyoe',
  'japanese ukiyo-e animal print': 'japanese-ukiyoe',
  '우키요에 미인화': 'japanese-ukiyoe',
  '우키요에 역자회': 'japanese-ukiyoe',
  '우키요에 명소회': 'japanese-ukiyoe',
  '우키요에 동물화': 'japanese-ukiyoe',
  '우키요에': 'japanese-ukiyoe',
  '일본 우키요에': 'japanese-ukiyoe',
  '일본우키요에': 'japanese-ukiyoe',
  
  // 일본 - 린파
  'japanese-rinpa': 'japanese-rinpa',
  'japanese_rinpa': 'japanese-rinpa',
  'japanese rinpa': 'japanese-rinpa',
  'japaneserinpa': 'japanese-rinpa',
  'rinpa': 'japanese-rinpa',
  'rinpa school': 'japanese-rinpa',
  'japanese rinpa school': 'japanese-rinpa',
  'japanese rinpa school decorative painting': 'japanese-rinpa',
  '린파': 'japanese-rinpa',
  '일본 린파': 'japanese-rinpa',
  '일본린파': 'japanese-rinpa',
  
  // ===== 화가 별칭 (37명) =====
  // 그리스·로마
  'classical sculpture': 'classical-sculpture',
  'greek sculpture': 'classical-sculpture',
  'classical-sculpture': 'classical-sculpture',
  'ancient-greek-sculpture': 'classical-sculpture',
  '고대 그리스 조각': 'classical-sculpture',
  
  'roman mosaic': 'roman-mosaic',
  'roman-mosaic': 'roman-mosaic',
  '로마 모자이크': 'roman-mosaic',
  
  // 중세
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  '비잔틴 미술': 'byzantine',
  
  'gothic': 'gothic',
  '고딕': 'gothic',
  '고딕 미술': 'gothic',
  
  'islamic miniature': 'islamic-miniature',
  'islamic-miniature': 'islamic-miniature',
  '이슬람 세밀화': 'islamic-miniature',
  
  // 르네상스
  'leonardo': 'leonardo',
  'leonardo da vinci': 'leonardo',
  'leonardodavinci': 'leonardo',
  'davinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  '레오나르도다빈치': 'leonardo',
  
  'michelangelo': 'michelangelo',
  'michelangelo buonarroti': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  
  'raphael': 'raphael',
  'raphael sanzio': 'raphael',
  'raffaello sanzio': 'raphael',
  '라파엘로': 'raphael',
  '라파엘': 'raphael',
  
  'botticelli': 'botticelli',
  'sandro botticelli': 'botticelli',
  'sandrobotticelli': 'botticelli',
  '보티첼리': 'botticelli',
  
  'titian': 'titian',
  'tiziano': 'titian',
  'tiziano vecellio': 'titian',
  '티치아노': 'titian',
  
  // 바로크
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  
  'rembrandt': 'rembrandt',
  'rembrandt van rijn': 'rembrandt',
  '렘브란트': 'rembrandt',
  
  'velazquez': 'velazquez',
  'velázquez': 'velazquez',
  'diego velazquez': 'velazquez',
  'diego velázquez': 'velazquez',
  'diegovelazquez': 'velazquez',
  '벨라스케스': 'velazquez',
  
  'rubens': 'rubens',
  'peter paul rubens': 'rubens',
  'peterpaulrubens': 'rubens',
  '루벤스': 'rubens',
  
  // 로코코
  'watteau': 'watteau',
  'jean-antoine watteau': 'watteau',
  'jeanantoinewatteau': 'watteau',
  'antoinewatteau': 'watteau',
  '와토': 'watteau',
  
  'boucher': 'boucher',
  'françois boucher': 'boucher',
  'francois boucher': 'boucher',
  'francoisboucher': 'boucher',
  '부셰': 'boucher',
  
  // 신고전·낭만·사실
  'david': 'david',
  'jacques-louis david': 'david',
  'jacqueslouisdavid': 'david',
  '다비드': 'david',
  
  'ingres': 'ingres',
  'jean-auguste-dominique ingres': 'ingres',
  'jeanaugustdominiqueingres': 'ingres',
  'jeanaugustedominiqueingres': 'ingres',
  '앵그르': 'ingres',
  
  'turner': 'turner',
  'j.m.w. turner': 'turner',
  'jmw turner': 'turner',
  'jmwturner': 'turner',
  'william turner': 'turner',
  '터너': 'turner',
  
  'delacroix': 'delacroix',
  'eugene delacroix': 'delacroix',
  'eugène delacroix': 'delacroix',
  'eugenedelacroix': 'delacroix',
  '들라크루아': 'delacroix',
  
  'courbet': 'courbet',
  'gustave courbet': 'courbet',
  'gustavecourbet': 'courbet',
  '쿠르베': 'courbet',
  
  'manet': 'manet',
  'edouard manet': 'manet',
  'édouard manet': 'manet',
  'edouardmanet': 'manet',
  '마네': 'manet',
  
  // 인상주의
  'monet': 'monet',
  'claude monet': 'monet',
  'claudemonet': 'monet',
  '모네': 'monet',
  '클로드모네': 'monet',
  
  'renoir': 'renoir',
  'pierre-auguste renoir': 'renoir',
  'pierreaugusterenoir': 'renoir',
  '르누아르': 'renoir',
  '피에르오귀스트르누아르': 'renoir',
  
  'degas': 'degas',
  'edgar degas': 'degas',
  'edgardegas': 'degas',
  '드가': 'degas',
  '에드가드가': 'degas',
  
  'caillebotte': 'caillebotte',
  'gustave caillebotte': 'caillebotte',
  'gustavecaillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  '귀스타브카유보트': 'caillebotte',
  
  // 후기인상주의
  'gauguin': 'gauguin',
  'paul gauguin': 'gauguin',
  'paulgauguin': 'gauguin',
  '고갱': 'gauguin',
  '폴고갱': 'gauguin',
  
  'cezanne': 'cezanne',
  'cézanne': 'cezanne',
  'paul cezanne': 'cezanne',
  'paul cézanne': 'cezanne',
  'paulcezanne': 'cezanne',
  '세잔': 'cezanne',
  '폴세잔': 'cezanne',
  
  // 야수파
  'derain': 'derain',
  'andre derain': 'derain',
  'andré derain': 'derain',
  'andrederain': 'derain',
  '드랭': 'derain',
  
  'vlaminck': 'vlaminck',
  'maurice de vlaminck': 'vlaminck',
  'mauricedevlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  
  // 표현주의
  'kirchner': 'kirchner',
  'ernst ludwig kirchner': 'kirchner',
  'ernstludwigkirchner': 'kirchner',
  '키르히너': 'kirchner',
  
  'kokoschka': 'kokoschka',
  'oskar kokoschka': 'kokoschka',
  'oskarkokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  
  // 모더니즘
  'picasso': 'picasso',
  'pablo picasso': 'picasso',
  'pablopicasso': 'picasso',
  '피카소': 'picasso',
  '파블로피카소': 'picasso',
  
  'magritte': 'magritte',
  'rene magritte': 'magritte',
  'rené magritte': 'magritte',
  'renemagritte': 'magritte',
  '마그리트': 'magritte',
  '르네마그리트': 'magritte',
  
  'miro': 'miro',
  'miró': 'miro',
  'joan miro': 'miro',
  'joan miró': 'miro',
  'joanmiro': 'miro',
  '미로': 'miro',
  '호안미로': 'miro',

  // v81: 누락 비라틴 alias 추가 (th/ar/ja/zh-TW)
  'غوخ': 'vangogh',
  'โก๊ะ': 'vangogh',
  'แวน โก๊ะ': 'vangogh',
  'คลิมต์': 'klimt',
  'มุงค์': 'munch',
  'ชากาล': 'chagall',
  'フリーダ': 'frida',
  'فريدا': 'frida',
  'ฟรีดา': 'frida',
  '芙烈達': 'frida',
  'ลิกเตนสไตน์': 'lichtenstein'
};

// ========================================
// 3. 정규화 함수
// ========================================
export function normalizeKey(input) {
  if (!input) return null;
  
  // 소문자 변환 + 앞뒤 공백 제거
  const lower = input.toLowerCase().trim();
  
  // 1차: 별칭 테이블에서 직접 찾기
  if (ALIASES[lower]) {
    return ALIASES[lower];
  }
  
  // 2차: 언더스코어 → 하이픈 변환 후 찾기
  const hyphenated = lower.replace(/_/g, '-');
  if (ALIASES[hyphenated]) {
    return ALIASES[hyphenated];
  }
  
  // 3차: 공백/하이픈 모두 제거 후 찾기 (v65 호환)
  // "Sandro Botticelli" → "sandrobotticelli" → "botticelli"
  const collapsed = lower.replace(/[\s-]/g, '');
  if (ALIASES[collapsed]) {
    return ALIASES[collapsed];
  }
  
  // 4차: 괄호 내용 제거 후 재시도 (v79: API 풀네임 대응)
  // "Korean Genre Painting (Pungsokdo)" → "korean genre painting"
  const withoutParens = lower.replace(/\s*\([^)]*\)\s*/g, '').trim();
  if (withoutParens !== lower && ALIASES[withoutParens]) {
    return ALIASES[withoutParens];
  }
  
  // 그대로 반환 (표준 키일 수 있음)
  return lower;
}

// ========================================
// 4. 표시 정보 (DISPLAY_INFO)
// ========================================
// 로딩 화면, 결과 화면에서 사용할 제목/부제목
export const DISPLAY_INFO = {
  // ===== 사조 =====
  movements: {
    'greco-roman': {
      loading: { title: '고대 그리스·로마', subtitle: '고대 그리스 조각 · 로마 모자이크' },
      result: { title: '고대 그리스·로마' }
    },
    'medieval-art': {
      loading: { title: '중세 미술', subtitle: '비잔틴 · 고딕 · 이슬람 세밀화' },
      result: { title: '중세 미술' }
    },
    'renaissance': {
      loading: { title: '르네상스', subtitle: '다빈치 · 미켈란젤로 · 보티첼리' },
      result: { title: '르네상스' }
    },
    'baroque': {
      loading: { title: '바로크', subtitle: '카라바조 · 렘브란트 · 벨라스케스' },
      result: { title: '바로크' }
    },
    'rococo': {
      loading: { title: '로코코', subtitle: '와토 · 부셰' },
      result: { title: '로코코' }
    },
    'neoclassicism-romanticism-realism': {
      loading: { title: '신고전·낭만·사실주의', subtitle: '다비드 · 들라크루아 · 쿠르베' },
      result: { title: '신고전·낭만·사실주의' }
    },
    'impressionism': {
      loading: { title: '인상주의', subtitle: '모네 · 르누아르 · 드가' },
      result: { title: '인상주의' }
    },
    'post-impressionism': {
      loading: { title: '후기인상주의', subtitle: '반 고흐 · 고갱 · 세잔' },
      result: { title: '후기인상주의' }
    },
    'fauvism': {
      loading: { title: '야수파', subtitle: '마티스 · 드랭 · 블라맹크' },
      result: { title: '야수파' }
    },
    'expressionism': {
      loading: { title: '표현주의', subtitle: '뭉크 · 키르히너 · 코코슈카' },
      result: { title: '표현주의' }
    },
    'modernism': {
      loading: { title: '모더니즘', subtitle: '피카소 · 마그리트 · 샤갈' },
      result: { title: '모더니즘' }
    }
  },
  
  // ===== 거장 =====
  masters: {
    'vangogh': {
      loading: { title: '빈센트 반 고흐', subtitle: 'Vincent van Gogh' },
      result: { title: '반 고흐' }
    },
    'klimt': {
      loading: { title: '구스타프 클림트', subtitle: 'Gustav Klimt' },
      result: { title: '클림트' }
    },
    'munch': {
      loading: { title: '에드바르 뭉크', subtitle: 'Edvard Munch' },
      result: { title: '뭉크' }
    },
    'matisse': {
      loading: { title: '앙리 마티스', subtitle: 'Henri Matisse' },
      result: { title: '마티스' }
    },
    'chagall': {
      loading: { title: '마르크 샤갈', subtitle: 'Marc Chagall' },
      result: { title: '샤갈' }
    },
    'frida': {
      loading: { title: '프리다 칼로', subtitle: 'Frida Kahlo' },
      result: { title: '프리다' }
    },
    'lichtenstein': {
      loading: { title: '로이 리히텐슈타인', subtitle: 'Roy Lichtenstein' },
      result: { title: '리히텐슈타인' }
    }
  },
  
  // ===== 동양화 =====
  oriental: {
    'korean-minhwa': {
      loading: { title: '한국 민화', subtitle: 'Korean Folk Painting' },
      result: { title: '민화' }
    },
    'korean-pungsokdo': {
      loading: { title: '한국 풍속도', subtitle: 'Korean Genre Painting' },
      result: { title: '풍속도' }
    },
    'korean-jingyeong': {
      loading: { title: '한국 진경산수', subtitle: 'Korean True-View Landscape' },
      result: { title: '진경산수' }
    },
    'chinese-ink': {
      loading: { title: '중국 수묵화', subtitle: 'Chinese Ink Painting' },
      result: { title: '수묵화' }
    },
    'chinese-gongbi': {
      loading: { title: '중국 공필화', subtitle: 'Chinese Gongbi' },
      result: { title: '공필화' }
    },
    'japanese-ukiyoe': {
      loading: { title: '일본 우키요에', subtitle: 'Japanese Ukiyo-e' },
      result: { title: '우키요에' }
    },
    'japanese-rinpa': {
      loading: { title: '일본 린파', subtitle: 'Japanese Rinpa' },
      result: { title: '린파' }
    }
  },
  
  // ===== 화가 (37명) =====
  artists: {
    // 그리스·로마
    'classical-sculpture': { name: '고대 그리스 조각', fullName: 'Ancient Greek Sculpture' },
    'roman-mosaic': { name: '로마 모자이크', fullName: 'Roman Mosaic' },
    
    // 중세
    'byzantine': { name: '비잔틴 미술', fullName: 'Byzantine Art' },
    'gothic': { name: '고딕 미술', fullName: 'Gothic Art' },
    'islamic-miniature': { name: '이슬람 세밀화', fullName: 'Islamic Miniature' },
    
    // 르네상스
    'leonardo': { name: '레오나르도 다 빈치', fullName: 'Leonardo da Vinci' },
    'michelangelo': { name: '미켈란젤로', fullName: 'Michelangelo Buonarroti' },
    'raphael': { name: '라파엘로', fullName: 'Raphael Sanzio' },
    'botticelli': { name: '보티첼리', fullName: 'Sandro Botticelli' },
    'titian': { name: '티치아노', fullName: 'Titian' },
    
    // 바로크
    'caravaggio': { name: '카라바조', fullName: 'Caravaggio' },
    'rembrandt': { name: '렘브란트', fullName: 'Rembrandt van Rijn' },
    'velazquez': { name: '벨라스케스', fullName: 'Diego Velázquez' },
    'rubens': { name: '루벤스', fullName: 'Peter Paul Rubens' },
    
    // 로코코
    'watteau': { name: '와토', fullName: 'Jean-Antoine Watteau' },
    'boucher': { name: '부셰', fullName: 'François Boucher' },
    
    // 신고전·낭만·사실
    'david': { name: '다비드', fullName: 'Jacques-Louis David' },
    'ingres': { name: '앵그르', fullName: 'Jean-Auguste-Dominique Ingres' },
    'turner': { name: '터너', fullName: 'J.M.W. Turner' },
    'delacroix': { name: '들라크루아', fullName: 'Eugène Delacroix' },
    'courbet': { name: '쿠르베', fullName: 'Gustave Courbet' },
    'manet': { name: '마네', fullName: 'Édouard Manet' },
    
    // 인상주의
    'monet': { name: '모네', fullName: 'Claude Monet' },
    'renoir': { name: '르누아르', fullName: 'Pierre-Auguste Renoir' },
    'degas': { name: '드가', fullName: 'Edgar Degas' },
    'caillebotte': { name: '카유보트', fullName: 'Gustave Caillebotte' },
    
    // 후기인상주의
    'vangogh': { name: '반 고흐', fullName: 'Vincent van Gogh' },
    'gauguin': { name: '고갱', fullName: 'Paul Gauguin' },
    'cezanne': { name: '세잔', fullName: 'Paul Cézanne' },
    
    // 야수파
    'matisse': { name: '마티스', fullName: 'Henri Matisse' },
    'derain': { name: '드랭', fullName: 'André Derain' },
    'vlaminck': { name: '블라맹크', fullName: 'Maurice de Vlaminck' },
    
    // 표현주의
    'munch': { name: '뭉크', fullName: 'Edvard Munch' },
    'kirchner': { name: '키르히너', fullName: 'Ernst Ludwig Kirchner' },
    'kokoschka': { name: '코코슈카', fullName: 'Oskar Kokoschka' },
    
    // 모더니즘
    'picasso': { name: '피카소', fullName: 'Pablo Picasso' },
    'magritte': { name: '마그리트', fullName: 'René Magritte' },
    'miro': { name: '미로', fullName: 'Joan Miró' },
    'chagall': { name: '샤갈', fullName: 'Marc Chagall' },
    'lichtenstein': { name: '리히텐슈타인', fullName: 'Roy Lichtenstein' }
  }
};

// ========================================
// 5. 교육자료 키 매핑
// ========================================
// 어떤 교육자료 파일의 어떤 키를 사용할지
export const EDUCATION_KEY_MAP = {
  // 사조 → movementsEducation.js 키
  movements: {
    'greco-roman': 'greco-roman',
    'medieval-art': 'medieval-art',
    'renaissance': 'renaissance',
    'baroque': 'baroque',
    'rococo': 'rococo',
    'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
    'impressionism': 'impressionism',
    'post-impressionism': 'post-impressionism',
    'fauvism': 'fauvism',
    'expressionism': 'expressionism',
    'modernism': 'modernism'
  },
  
  // 거장 → mastersEducation.js 키
  masters: {
    'vangogh': 'vangogh',
    'klimt': 'klimt',
    'munch': 'munch',
    'matisse': 'matisse',
    'chagall': 'chagall',
    'frida': 'frida',
    'lichtenstein': 'lichtenstein'
  },
  
  // 동양화 → orientalEducation.js 키
  oriental: {
    'korean-minhwa': 'korean-minhwa',
    'korean-pungsokdo': 'korean-pungsokdo',
    'korean-jingyeong': 'korean-jingyeong',
    'chinese-ink': 'chinese-ink',
    'chinese-gongbi': 'chinese-gongbi',
    'japanese-ukiyoe': 'japanese-ukiyoe',
    'japanese-rinpa': 'japanese-rinpa'
  }
};

// ========================================
// 6. 유틸리티 함수
// ========================================

/**
 * 표시 정보 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화된 키
 * @param {string} screen - 'loading' | 'result'
 */
export function getDisplayInfo(category, key, screen = 'loading') {
  const normalizedKey = normalizeKey(key);
  const categoryInfo = DISPLAY_INFO[category];
  
  if (!categoryInfo || !categoryInfo[normalizedKey]) {
    return { title: key, subtitle: '' };
  }
  
  return categoryInfo[normalizedKey][screen] || { title: key, subtitle: '' };
}

/**
 * 화가 이름 가져오기
 * @param {string} artistKey - 화가 키 (정규화 전/후 모두 가능)
 */
export function getArtistName(artistKey) {
  const normalizedKey = normalizeKey(artistKey);
  const artistInfo = DISPLAY_INFO.artists[normalizedKey];
  
  if (!artistInfo) {
    return { name: artistKey, fullName: artistKey };
  }
  
  return artistInfo;
}

/**
 * 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화 전 키
 */
export function getEducationKey(category, key) {
  const normalizedKey = normalizeKey(key);
  const categoryMap = EDUCATION_KEY_MAP[category];
  
  if (!categoryMap) return normalizedKey;
  
  return categoryMap[normalizedKey] || normalizedKey;
}

/**
 * 카테고리 판별
 * @param {string} key - 아무 키
 * @returns {string|null} - 'movements' | 'masters' | 'oriental' | 'artists' | null
 */
export function detectCategory(key) {
  const normalizedKey = normalizeKey(key);
  
  if (STANDARD_KEYS.movements.includes(normalizedKey)) return 'movements';
  if (STANDARD_KEYS.masters.includes(normalizedKey)) return 'masters';
  if (STANDARD_KEYS.oriental.includes(normalizedKey)) return 'oriental';
  if (STANDARD_KEYS.artists.includes(normalizedKey)) return 'artists';
  
  return null;
}

/**
 * 사조 결과화면 표시 정보 (제목 + 부제)
 * @param {string} styleName - 사조명 (예: '인상주의')
 * @param {string} artistName - 화가명 (API 응답)
 * @param {string} lang - 언어 ('ko' | 'en')
 * @returns {{ title: string, subtitle: string }}
 */
export function getMovementDisplayInfo(styleName, artistName, lang = 'en') {
  // ===== 사조 정보 (공유 참조로 중복 제거) =====
  const _grecoRoman    = { ko: '그리스·로마', en: 'Greco-Roman', period: 'BC~AD 4세기', periodEn: 'BC–AD 4th Century' };
  const _medieval      = { ko: '중세 미술', en: 'Medieval', period: '5~15세기', periodEn: '5th–15th Century' };
  const _renaissance   = { ko: '르네상스', en: 'Renaissance', period: '14~16세기', periodEn: '14th–16th Century' };
  const _baroque       = { ko: '바로크', en: 'Baroque', period: '17~18세기', periodEn: '17th–18th Century' };
  const _rococo        = { ko: '로코코', en: 'Rococo', period: '18세기', periodEn: '18th Century' };
  const _neoRomReal    = { ko: '신고전·낭만·사실주의', en: 'Neoclassicism·Romanticism·Realism', period: '18~19세기', periodEn: '18th–19th Century' };
  const _neoclassicism = { ko: '신고전주의', en: 'Neoclassicism', period: '18~19세기', periodEn: '18th–19th Century' };
  const _romanticism   = { ko: '낭만주의', en: 'Romanticism', period: '19세기', periodEn: '19th Century' };
  const _realism       = { ko: '사실주의', en: 'Realism', period: '19세기', periodEn: '19th Century' };
  const _impressionism = { ko: '인상주의', en: 'Impressionism', period: '19세기 말', periodEn: 'Late 19th Century' };
  const _postImpress   = { ko: '후기인상주의', en: 'Post-Impressionism', period: '19세기 말', periodEn: 'Late 19th Century' };
  const _fauvism       = { ko: '야수파', en: 'Fauvism', period: '20세기 초', periodEn: 'Early 20th Century' };
  const _expressionism = { ko: '표현주의', en: 'Expressionism', period: '20세기 초', periodEn: 'Early 20th Century' };
  const _modernism     = { ko: '모더니즘', en: 'Modernism', period: '20세기', periodEn: '20th Century' };
  const _cubism        = { ko: '입체주의', en: 'Cubism', period: '20세기 초', periodEn: 'Early 20th Century' };
  const _surrealism    = { ko: '초현실주의', en: 'Surrealism', period: '20세기 초중반', periodEn: 'Early–Mid 20th Century' };
  const _popArt        = { ko: '팝아트', en: 'Pop Art', period: '20세기 중반', periodEn: 'Mid 20th Century' };

  const movementData = {
    // ===== 한국어 키 (기존 — 하위 호환) =====
    '고대': _grecoRoman,
    '고대 그리스-로마': _grecoRoman,
    '그리스·로마': _grecoRoman,
    '중세': _medieval,
    '중세 미술': _medieval,
    '르네상스': _renaissance,
    '바로크': _baroque,
    '로코코': _rococo,
    '신고전 vs 낭만 vs 사실주의': _neoRomReal,
    '신고전주의': _neoclassicism,
    '낭만주의': _romanticism,
    '사실주의': _realism,
    '인상주의': _impressionism,
    '후기인상주의': _postImpress,
    '야수파': _fauvism,
    '표현주의': _expressionism,
    '모더니즘': _modernism,
    '입체주의': _cubism,
    '초현실주의': _surrealism,
    '팝아트': _popArt,

    // ===== styleId 키 (masterData id — 갤러리 i18n용) =====
    'ancient': _grecoRoman,
    'greco-roman': _grecoRoman,
    'medieval': _medieval,
    'medieval-art': _medieval,
    'renaissance': _renaissance,
    'baroque': _baroque,
    'rococo': _rococo,
    'neoclassicism_vs_romanticism_vs_realism': _neoRomReal,
    'neoclassicism-romanticism-realism': _neoRomReal,
    'impressionism': _impressionism,
    'postimpressionism': _postImpress,
    'post-impressionism': _postImpress,
    'fauvism': _fauvism,
    'expressionism': _expressionism,
    'modernism': _modernism,
    // 세분화 styleId
    'cubism': _cubism,
    'surrealism': _surrealism,
    'popart': _popArt,
    'neoclassicism': _neoclassicism,
    'romanticism': _romanticism,
    'realism': _realism,

    // ===== 영어 키 (en 이름 소문자 — 다국어 환경 대응) =====
    'greco-roman art': _grecoRoman,
    'greek & roman': _grecoRoman,
    'medieval art': _medieval,
    'baroque art': _baroque,
    'rococo art': _rococo,
    'neoclassicism·romanticism·realism': _neoRomReal,
    'post-impressionism art': _postImpress,
    'fauvism art': _fauvism,
    'expressionism art': _expressionism,
    'modernism art': _modernism,
    'cubism art': _cubism,
    'surrealism art': _surrealism,
    'pop art': _popArt
  };

  // ===== 사조명 정규화: 입력이 어떤 형태든 movementData에서 찾기 =====
  const resolveMovement = (name) => {
    if (!name) return null;
    // 1차: 원본 그대로
    if (movementData[name]) return name;
    // 2차: 소문자
    const lower = name.toLowerCase().trim();
    if (movementData[lower]) return lower;
    // 3차: normalizeKey 경유 (ALIASES → 표준 키)
    const normalized = normalizeKey(name);
    if (movementData[normalized]) return normalized;
    return null;
  };
  
  // 사조 결정 (신고전/낭만/사실, 모더니즘 세분화)
  let actualMovement = styleName;
  const resolvedStyle = resolveMovement(styleName);

  // v78: 복합 사조 세분화 제거 → 갤러리에서 통일된 사조명 표시
  // 모더니즘 → 모더니즘 (입체주의/초현실주의/팝아트로 나누지 않음)
  // 신고전·낭만·사실 → 신고전·낭만·사실주의 (개별 분리하지 않음)
  // 부제(화가명)에서 세부 정보 확인 가능
  
  // movementData 조회 (정규화 적용)
  const resolvedActual = resolveMovement(actualMovement);
  const mvInfo = (resolvedActual ? movementData[resolvedActual] : null) || { ko: styleName, en: styleName, period: '' };

  // title: ko/en 하드코딩, 나머지는 i18n movements.js 우선
  let title;
  if (lang === 'ko') {
    const period = mvInfo.period;
    title = period ? `${mvInfo.ko}(${mvInfo.en}, ${period})` : `${mvInfo.ko}(${mvInfo.en})`;
  } else if (lang === 'en') {
    const period = mvInfo.periodEn || mvInfo.period;
    title = period ? `${mvInfo.en} (${period})` : mvInfo.en;
  } else {
    // i18n movements.js의 loading.name 사용 (전각/반각 괄호 제거)
    const i18nMovements = getMovementsBasicInfo ? getMovementsBasicInfo(lang) : null;
    const resolvedKey = resolvedActual || normalizeKey(styleName);
    // movements.js 키 매핑 (displayConfig ↔ i18n 키 불일치 보정)
    const i18nKeyMap = {
      'post-impressionism': 'postImpressionism',
      'postimpressionism': 'postImpressionism',
      'neoclassicism-romanticism-realism': 'neoclassicism_vs_romanticism_vs_realism',
      'medieval-art': 'medieval',
      'greco-roman': 'ancient'
    };
    const i18nKey = i18nKeyMap[resolvedKey] || resolvedKey;
    const i18nMov = i18nMovements?.[i18nKey];
    const rawName = i18nMov?.loading?.name || i18nMov?.result?.name || '';
    const i18nTitle = rawName.replace(/\s*[(\（].*?[)\）]/g, '').trim();
    title = i18nTitle || mvInfo.en;
  }
  
  // 부제: 화가명
  let subtitle = '';
  if (artistName) {
    const artistKey = normalizeKey(artistName);
    const artistInfo = DISPLAY_INFO.artists[artistKey];
    if (lang === 'ko') {
      subtitle = artistInfo ? `${artistInfo.name}(${artistInfo.fullName})` : artistName;
    } else if (lang === 'en') {
      subtitle = artistInfo ? artistInfo.fullName : artistName;
    } else {
      // i18n: movements.js에서 화가명 조회 (result.subtitle1 → 괄호 제거)
      const i18nMovements = getMovementsBasicInfo ? getMovementsBasicInfo(lang) : null;
      const i18nArtist = i18nMovements?.[artistKey];
      const rawArtist = i18nArtist?.result?.subtitle1 || '';
      const i18nName = rawArtist.replace(/\s*[(\（].*?[)\）]/g, '').trim();
      subtitle = i18nName || (artistInfo ? artistInfo.fullName : artistName);
    }
  }
  
  return { title, subtitle };
}

/**
 * 동양화 결과화면 표시 정보 (제목 + 부제)
 * @param {string} artistName - 스타일명 (API 응답)
 * @param {string} lang - 언어 ('ko' | 'en')
 * @returns {{ title: string, subtitle: string }}
 */
export function getOrientalDisplayInfo(artistName, lang = 'en') {
  const orientalDataKo = {
    'korean-minhwa': { title: '한국 전통회화', subtitle: '민화' },
    'korean-pungsokdo': { title: '한국 전통회화', subtitle: '풍속도' },
    'korean-jingyeong': { title: '한국 전통회화', subtitle: '진경산수화' },
    'chinese-ink': { title: '중국 전통회화', subtitle: '수묵화' },
    'chinese-gongbi': { title: '중국 전통회화', subtitle: '공필화' },
    'japanese-ukiyoe': { title: '일본 전통회화', subtitle: '우키요에' },
    'japanese-rinpa': { title: '일본 전통회화', subtitle: '린파' }
  };
  const orientalDataEn = {
    'korean-minhwa': { title: 'Korean Traditional Art', subtitle: 'Minhwa' },
    'korean-pungsokdo': { title: 'Korean Traditional Art', subtitle: 'Pungsokdo' },
    'korean-jingyeong': { title: 'Korean Traditional Art', subtitle: 'Jingyeong' },
    'chinese-ink': { title: 'Chinese Traditional Art', subtitle: 'Ink Wash' },
    'chinese-gongbi': { title: 'Chinese Traditional Art', subtitle: 'Gongbi' },
    'japanese-ukiyoe': { title: 'Japanese Traditional Art', subtitle: 'Ukiyo-e' },
    'japanese-rinpa': { title: 'Japanese Traditional Art', subtitle: 'Rinpa' }
  };

  const key = normalizeKey(artistName);

  // ko/en: 하드코딩 사용
  if (lang === 'ko') return orientalDataKo[key] || { title: '동양화', subtitle: artistName || '' };
  if (lang === 'en') return orientalDataEn[key] || { title: 'East Asian Art', subtitle: artistName || '' };

  // 기타 언어: i18n oriental.js 우선
  const i18nOriental = getOrientalBasicInfo ? getOrientalBasicInfo(lang) : null;
  if (i18nOriental) {
    const entry = i18nOriental[key];
    if (entry) {
      // title: loading.name 또는 result.name (전각/반각 괄호 제거)
      const rawName = entry.loading?.name || entry.result?.name || '';
      const title = rawName.replace(/\s*[(\（].*?[)\）]/g, '').trim();
      // subtitle: result.subtitle1 (기법명, 괄호 제거)
      const rawSub = entry.result?.subtitle1 || entry.loading?.subtitle1 || '';
      const subtitle = rawSub.replace(/\s*[(\（].*?[)\）]/g, '').trim();
      if (title) return { title, subtitle };
    }
  }

  // fallback: en
  return orientalDataEn[key] || { title: 'East Asian Art', subtitle: artistName || '' };
}

/**
 * 거장 표시 정보 (제목 + 부제)
 * @param {string} artistName - 거장명
 * @param {string} lang - 언어 ('ko' | 'en')
 * @returns {{ fullName: string, movement: string, tagline: string }}
 */
export function getMasterInfo(artistName, lang = 'en') {
  const masterDataKo = {
    'vangogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의', tagline: '별과 소용돌이의 열정' },
    'klimt': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보', tagline: '황금빛 사랑과 죽음' },
    'munch': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의', tagline: '내면의 고독과 불안' },
    'matisse': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파', tagline: '색채의 기쁨과 해방' },
    'chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의', tagline: '사랑과 꿈의 비행' },
    'frida': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의', tagline: '고통 속 강인한 자아' },
    'picasso': { fullName: '파블로 피카소(Pablo Picasso, 1881~1973)', movement: '입체주의', tagline: '형태를 해체한 혁명가' },
    'lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트', tagline: '만화로 묻는 예술' }
  };

  const masterDataEn = {
    'vangogh': { fullName: 'Vincent van Gogh (1853-1890)', movement: 'Post-Impressionism', tagline: 'Swirling passion of the brush' },
    'klimt': { fullName: 'Gustav Klimt (1862-1918)', movement: 'Art Nouveau', tagline: 'A world of golden sensuality' },
    'munch': { fullName: 'Edvard Munch (1863-1944)', movement: 'Expressionism', tagline: 'Painting the inner scream' },
    'matisse': { fullName: 'Henri Matisse (1869-1954)', movement: 'Fauvism', tagline: 'Master of color' },
    'chagall': { fullName: 'Marc Chagall (1887-1985)', movement: 'Surrealism', tagline: 'Poet of love and dreams' },
    'frida': { fullName: 'Frida Kahlo (1907-1954)', movement: 'Surrealism', tagline: 'Self-portrait gazing at pain' },
    'picasso': { fullName: 'Pablo Picasso (1881-1973)', movement: 'Cubism', tagline: 'Revolutionary who deconstructed vision' },
    'lichtenstein': { fullName: 'Roy Lichtenstein (1923-1997)', movement: 'Pop Art', tagline: 'Dots that changed art' }
  };

  if (!artistName) return lang === 'ko' ? { fullName: '거장', movement: '', tagline: '' } : { fullName: 'Master', movement: '', tagline: '' };
  const key = normalizeKey(artistName);

  // i18n 언어별 name 우선 사용
  if (lang !== 'ko' && lang !== 'en') {
    const i18nBasic = getMastersBasicInfo(lang) || {};
    const i18nMaster = key ? i18nBasic[key] : null;
    if (i18nMaster?.loading?.name) {
      return {
        fullName: i18nMaster.loading.name,
        movement: i18nMaster.loading.subtitle1 || '',
        tagline: i18nMaster.loading.subtitle2 || ''
      };
    }
  }

  const masterData = lang === 'ko' ? masterDataKo : masterDataEn;
  return masterData[key] || { fullName: artistName, movement: '', tagline: '' };
}

// ========== v73: 통합 스타일 표시 함수 ==========
// MOVEMENTS, ORIENTAL, MASTERS는 파일 상단에서 import됨

/**
 * 카테고리 아이콘 가져오기 (원클릭용 - 메인화면과 동일)
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @returns {string} 카테고리 대표 이모지
 */
export function getCategoryIcon(category) {
  if (category === 'masters') return '⭐';
  if (category === 'movements') return '🎨';
  if (category === 'oriental') return '🎎';
  return '🎨';
}

/**
 * 스타일 아이콘 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} styleId - 스타일 ID
 * @param {string} artistName - 거장 이름 (masters일 때)
 * @returns {string} 이모지
 */
export function getStyleIcon(category, styleId, artistName) {
  if (category === 'masters') {
    // artistName 먼저 시도, 실패하면 styleId로 fallback
    const key = normalizeKey(artistName) || normalizeKey(styleId);
    if (key) {
      for (const [id, value] of Object.entries(MASTERS)) {
        if (value.key === key || id === `${key}-master`) {
          return value.icon;
        }
      }
    }
    // styleId가 직접 key인 경우 (vangogh, klimt 등)
    const directMatch = MASTERS[`${styleId}-master`] || MASTERS[styleId];
    if (directMatch) return directMatch.icon;
    return '🎨';
  } else if (category === 'movements') {
    return MOVEMENTS[styleId]?.icon || '🎨';
  } else if (category === 'oriental') {
    return ORIENTAL[styleId]?.icon || '🎎';
  }
  return '🎨';
}

/**
 * 스타일 제목 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} styleId - 스타일 ID
 * @param {string} artistName - 거장 이름 (masters일 때)
 * @returns {string} 제목
 */
export function getStyleTitle(category, styleId, artistName, lang = 'en') {
  if (category === 'masters') {
    const masterInfo = getMasterInfo(artistName || styleId, lang);
    return masterInfo.fullName;
  } else if (category === 'movements') {
    // i18n 언어별 name 우선
    const i18nMovements = getMovementsBasicInfo ? getMovementsBasicInfo(lang) : null;
    const i18nKeyMap = {
      'post-impressionism': 'postImpressionism',
      'postimpressionism': 'postImpressionism',
      'neoclassicism-romanticism-realism': 'neoclassicism_vs_romanticism_vs_realism',
      'medieval-art': 'medieval',
      'greco-roman': 'ancient'
    };
    const i18nMov = i18nMovements?.[i18nKeyMap[styleId] || styleId];
    if (i18nMov?.loading?.name) return i18nMov.loading.name;
    // fallback
    const m = MOVEMENTS[styleId];
    if (!m) return lang === 'ko' ? '미술사조' : 'Art Movement';
    const period = lang === 'ko' ? m.period : (m.periodEn || m.period);
    return lang === 'ko'
      ? `${m.ko}(${m.en}, ${period})`
      : `${m.en} (${period})`;
  } else if (category === 'oriental') {
    const i18nOriental = getOrientalBasicInfo ? getOrientalBasicInfo(lang) : null;
    const i18nOri = i18nOriental?.[styleId];
    if (i18nOri?.loading?.name) return i18nOri.loading.name;
    // fallback
    const o = ORIENTAL[styleId];
    if (!o) return lang === 'ko' ? '동양화' : 'East Asian Art';
    return lang === 'ko' ? `${o.ko}(${o.en})` : o.en;
  }
  return lang === 'ko' ? '스타일' : 'Style';
}

/**
 * 스타일 부제 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} styleId - 스타일 ID
 * @param {string} mode - 'loading' | 'result-oneclick' | 'result-single'
 * @param {string} displayArtist - AI가 선택한 화가/스타일
 * @param {string} artistName - 거장 이름 (masters일 때)
 * @param {string} lang - 언어 ('ko' | 'en')
 * @returns {string} 부제
 */
export function getStyleSubtitle(category, styleId, mode, displayArtist, artistName, lang = 'en') {
  if (category === 'masters') {
    if (mode === 'loading') {
      const masterInfo = getMasterInfo(artistName || styleId, lang);
      return masterInfo.movement;
    } else {
      const masterInfo = getMasterInfo(artistName || styleId, lang);
      return masterInfo.tagline || (lang === 'ko' ? '거장' : 'Master');
    }
  } else if (category === 'movements') {
    if (mode === 'loading' || mode === 'result-oneclick') {
      const m = MOVEMENTS[styleId];
      if (!m) return lang === 'ko' ? '서양미술' : 'Western Art';
      return lang === 'ko' ? m.description : (m.descriptionEn || m.description);
    } else {
      const movementInfo = getMovementDisplayInfo(styleId, displayArtist, lang);
      return movementInfo.subtitle;
    }
  } else if (category === 'oriental') {
    if (mode === 'loading' || mode === 'result-oneclick') {
      const o = ORIENTAL[styleId];
      if (!o) return lang === 'ko' ? '동양화' : 'East Asian Art';
      return lang === 'ko' ? o.description : (o.descriptionEn || o.description);
    } else {
      const orientalInfo = getOrientalDisplayInfo(displayArtist, lang);
      return orientalInfo.subtitle;
    }
  }
  return '';
}

// v74: 3줄 표기용 부제 함수 re-export
export const getStyleSubtitles = getStyleSubtitlesFromMaster;

export default {
  STANDARD_KEYS,
  ALIASES,
  DISPLAY_INFO,
  EDUCATION_KEY_MAP,
  normalizeKey,
  getDisplayInfo,
  getArtistName,
  getEducationKey,
  detectCategory,
  getMovementDisplayInfo,
  getOrientalDisplayInfo,
  getMasterInfo,
  getCategoryIcon,
  getStyleIcon,
  getStyleTitle,
  getStyleSubtitle,
  getStyleSubtitles
};
