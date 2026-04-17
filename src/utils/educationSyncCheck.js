// ========================================
// educationSyncCheck.js - v1 (2026-04-18)
// ========================================
// 
// 목적:
//   ARTIST_CONFIG(서버, art-api-prompts.js)와
//   i18n Secondary(클라, oneclick*.js)의 키 동기화 검증
// 
// 배경:
//   2026-04-18 Kokoschka 매칭 실패 사건 — 배포 빌드가 구버전이었던 경우.
//   향후 신규 아티스트 추가 시 한쪽만 업데이트되면 화면이 날아감.
//   개발 모드에서 자동으로 누락을 탐지해 콘솔에 경고.
// 
// 사용:
//   App.jsx의 최상위 useEffect에서 runEducationSyncCheck() 호출
//   개발 모드(npm run dev)에서만 실행. 프로덕션에는 영향 없음.
// 
// 유지보수:
//   서버 art-api-prompts.js의 ARTIST_CONFIG에 아티스트 추가 시
//   이 파일의 EXPECTED_KEYS도 함께 업데이트 필요.
// ========================================

import {
  getOneclickMovementsSecondary,
  getOneclickMastersSecondary,
  getOneclickOrientalSecondary
} from '../i18n';

// ========================================
// 서버 ARTIST_CONFIG와 동기화된 기대 키 목록
// (art-api-prompts.js 변경 시 여기도 업데이트)
// ========================================
const EXPECTED_KEYS = {
  movements: [
    // 고대 / 중세
    'classical-sculpture', 'roman-mosaic', 'byzantine', 'gothic', 'islamic-miniature',
    // 르네상스
    'leonardo', 'michelangelo', 'raphael', 'botticelli', 'titian',
    // 바로크
    'caravaggio', 'rembrandt', 'velazquez', 'rubens',
    // 로코코
    'watteau', 'boucher',
    // 신고전 / 낭만 / 사실
    'david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet',
    // 인상주의
    'monet', 'renoir', 'degas', 'caillebotte',
    // 후기인상주의
    'vangogh', 'gauguin', 'cezanne',
    // 야수파
    'matisse', 'derain', 'vlaminck',
    // 표현주의
    'munch', 'kirchner', 'kokoschka',
    // 모더니즘 / 팝
    'picasso', 'magritte', 'miro', 'chagall', 'lichtenstein'
  ],
  masters: [
    'vangogh', 'klimt', 'munch', 'matisse',
    'chagall', 'picasso', 'frida', 'lichtenstein'
  ],
  oriental: [
    'korean-minhwa', 'korean-pungsokdo', 'korean-jingyeong',
    'chinese-gongbi', 'chinese-ink',
    'japanese-ukiyoe', 'japanese-rinpa'
  ]
};

const SUPPORTED_LANGS = ['en', 'ko', 'ja', 'ar', 'es', 'fr', 'id', 'pt', 'th', 'tr', 'zh-TW'];

// ========================================
// 메인 검증 함수
// ========================================

/**
 * 교육 데이터 동기화 검증
 * @returns {{ok: boolean, issues: Array}}
 */
export function verifyEducationSync() {
  const issues = [];

  const getters = {
    movements: getOneclickMovementsSecondary,
    masters: getOneclickMastersSecondary,
    oriental: getOneclickOrientalSecondary
  };

  for (const lang of SUPPORTED_LANGS) {
    for (const [category, expectedKeys] of Object.entries(EXPECTED_KEYS)) {
      const data = getters[category](lang) || {};
      const actualKeys = Object.keys(data);

      const missing = expectedKeys.filter(k => !actualKeys.includes(k));
      const extra = actualKeys.filter(k => !expectedKeys.includes(k));

      if (missing.length > 0) {
        issues.push({
          severity: 'error',
          lang,
          category,
          type: 'missing',
          keys: missing
        });
      }
      if (extra.length > 0) {
        issues.push({
          severity: 'warning',
          lang,
          category,
          type: 'extra',
          keys: extra
        });
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * 개발 모드에서 자동 실행 + 콘솔 출력
 * 프로덕션 빌드에서는 no-op (import.meta.env.MODE 체크)
 */
export function runEducationSyncCheck() {
  // Vite 기준 — 개발 모드에서만 실행
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'development') {
    return;
  }

  const { ok, issues } = verifyEducationSync();

  if (ok) {
    console.log(
      '%c✅ 교육 데이터 동기화 정상',
      'color: #4ade80; font-weight: bold;',
      `(11개 언어 × 3 카테고리 = ${11 * 3}개 매트릭스 전부 통과)`
    );
    return;
  }

  console.group('%c⚠️ 교육 데이터 동기화 문제 발견', 'color: #fb923c; font-weight: bold;');
  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '❌' : '⚠️';
    const action = issue.type === 'missing' ? '누락' : '잉여';
    const color = issue.severity === 'error' ? 'color: #f87171;' : 'color: #fbbf24;';
    console.warn(
      `%c${icon} [${issue.lang}/${issue.category}] ${action}:`,
      color,
      issue.keys
    );
  }
  console.info(
    '%c💡 해결:',
    'color: #60a5fa;',
    '서버 art-api-prompts.js의 ARTIST_CONFIG와 클라이언트 i18n/*/oneclick*.js Secondary 객체를 맞추거나, ' +
    'educationSyncCheck.js의 EXPECTED_KEYS를 업데이트하세요.'
  );
  console.groupEnd();
}

export default {
  verifyEducationSync,
  runEducationSyncCheck
};
