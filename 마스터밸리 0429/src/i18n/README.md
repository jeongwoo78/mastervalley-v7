# Master Valley v6 — i18n 구조 도입

## v5 → v6 변경사항

### ✨ 새로 추가: `src/i18n/`
```
src/i18n/
├── index.js              언어 선택 로직
├── ko/                   한국어 (8개 언어 중 1순위 아님, 하지만 원본)
│   ├── masters.js        ✅ 완료 (거장 7명 활성 + 피카소 예비)
│   ├── movements.js      ⬜ TODO
│   ├── oriental.js       ⬜ TODO
│   ├── oneclick.js       ⬜ TODO
│   ├── masterChat.js     ⬜ TODO
│   ├── ui.js             ⬜ TODO
│   └── aliases.js        ⬜ TODO
├── en/                   영어 (1순위 출시)
│   ├── masters.js        ✅ 완료
│   └── (나머지 TODO)
├── ar/                   아랍어 (placeholder)
├── tr/                   터키어 (placeholder)
├── id/                   인도네시아어 (placeholder)
├── ja/                   일본어 (placeholder)
├── th/                   태국어 (placeholder)
└── vi/                   베트남어 (placeholder)
```

### 📂 data/ 파일 상태

| 파일 | v5 | v6 | 최종 (연동 후) |
|------|:--:|:--:|:---------:|
| masterData.js | ✅ | ✅ 유지 | ✅ 유지 (UI텍스트만 분리) |
| educationContent.js | ✅ | ✅ 유지 | ✅ 유지 (import 경로 변경) |
| fix-prompts.js | ✅ | ✅ 유지 | ✅ 유지 |
| mastersEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/masters.js |
| movementsEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/movements.js |
| orientalEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/oriental.js |
| oneclickMastersEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/oneclick.js |
| oneclickMovementsEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/oneclick.js |
| oneclickOrientalEducation.js | ✅ | ⚠️ deprecated | ❌ 삭제 → i18n/{lang}/oneclick.js |

**⚠️ deprecated = 아직 컴포넌트가 참조 중이라 삭제 불가. i18n 연동 코드 완료 후 삭제.**

### 작업 순서

```
Phase 1 (지금) ── 콘텐츠 작성
  i18n/{lang}/masters.js      ✅ 완료
  i18n/{lang}/movements.js    ⬜ 다음
  i18n/{lang}/oriental.js     ⬜
  i18n/{lang}/oneclick.js     ⬜

Phase 2 ── UI 문자열 추출
  i18n/{lang}/ui.js           컴포넌트 한국어 → 키값 추출
  i18n/{lang}/aliases.js      displayConfig 한국어 → 분리
  i18n/{lang}/masterChat.js   거장 대화 텍스트

Phase 3 ── 코드 연동
  컴포넌트: 하드코딩 → t('key') 참조
  educationContent.js → i18n import
  data/ deprecated 파일 6개 삭제

Phase 4 ── 추가 언어 번역
  en/ → ar/, tr/, id/ 번역
  언어 감지/전환 로직 구현
```
