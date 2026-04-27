# 5월 사조 검증 — 최종 보고서

**검증 일자**: 2026-04-27
**검증 범위**: 11개 언어 × 2개 i18n 파일 (movements.js, oneclickMovements.js)
**최종 산출물**: `movements_v24_fix.zip` (5개 파일)

---

## 적용된 수정 45건 요약

### A. HIGH 우선순위 (17건)

**[1] modernism.loading.subtitle1** — ar/tr/pt 화가 표기 정정 (3건)
- 한국어 원본: `피카소 · 마그리트 · 샤갈`
- ar/tr/pt가 `Chagall`을 `Miró`로 잘못 표기 → 한국어 일관성으로 정정

**[2] zh-TW 화가 음역 한자 오류** (14건)
- magritte: `乃內·馬格利特` → `雷內·馬格利特` (음역 정정)
- miro: `乔安·乃洛` → `喬安·米羅` (간체 `乔` 제거 + 음역 정정)
- turner: `J.M.W. 乇納` → `J.M.W. 透納` (음역 정정)
- movements.js / oneclickMovements.js의 basicInfo subtitle1 (6건)
- education name + description 안 한자 오염 (8건)

### B. MEDIUM 우선순위 (24건)

**[3] 5개 사조 loading.subtitle2** — ar/tr/pt 의미 정상화 (15건)
- expressionism: "내면의 비명이 캔버스로" → "느끼는 것을 그리다"
- fauvism: "순수한 색의 혁명" → "색채를 해방시킨 야수들"
- impressionism: "빛과 색의 혁명" → "빛이 색이 되는 순간"
- modernism: "전통 깨고 예술 재발명" → "모든 규칙의 해체"
- postImpressionism: "빛의 순간 너머" → "빛을 넘어 내면으로"

**[4] 3개 사조 loading.name 시기 정밀화** — ar/tr/pt (9건)
- expressionism: "20세기 초" → "1905-1930"
- impressionism: "19세기" → "1860-1890"
- postImpressionism: "19세기 말" → "1880-1910"

### C. LOW 우선순위 (4건)

**[5] basicInfo vs education name 표기 통일**
- pt byzantine: `Bizantino` → `Bizântino`
- ar caillebotte: `كايبوت` → `كاييبوت`
- pt raphael: `Raphael` → `Rafael`
- ar rubens: `روبنز` → `روبنس`

---

## 검증 결과 (8단계 모두 통과)

| # | 검증 항목 | 결과 |
|---|-----------|------|
| 1 | 5개 수정 파일 import 가능 | ✅ |
| 2 | 의도된 변경 45건 일치, 의도하지 않은 변경 0건 | ✅ |
| 3 | 11개 언어 × 2개 파일 키 셋 완전 일치 (255 + 161 키) | ✅ |
| 4 | 핵심 수정 정확성 (modernism + zh-TW 음역 + 시기 + subtitle2 + LOW) | ✅ |
| 5 | zh-TW 의심 한자(乃內·乃洛·乔安·乇納·乔) 잔존 0건 | ✅ |
| 6 | 인코딩 (UTF-8, BOM 없음) + 줄 수 변동 0 | ✅ |
| 7 | 객체 구조 11개 언어 완전 동일 (strings/objects/depth) | ✅ |
| 8 | 11개 언어 × 2개 파일 = 22건 import + 객체 접근 모두 정상 | ✅ |

---

## 영향받은 파일 5개 (zip 내부)

```
i18n/
├── ar/movements.js
├── tr/movements.js
├── pt/movements.js
├── zh-TW/movements.js
└── zh-TW/oneclickMovements.js
```

## 적용 방법

zip을 프로젝트의 `src/` 폴더에서 압축 해제:
```bash
cd /path/to/master-valley/src
unzip /path/to/movements_v24_fix.zip
```

---

## 4월 검증과의 비교

| 항목 | 4월 (masters/oriental) | 5월 (movements) |
|---|---|---|
| 발견 이슈 | 73건 | 45건 |
| 영향 파일 | 14개 | 5개 |
| 영향 언어 | 9개 (ko 외 모두) | 4개 (ar/tr/pt/zh-TW) |
| 주요 패턴 | 복붙 버그 22건 (구조 차이) | 의미 일반화 24건 |
| 결정적 발견 | EN 카피 부재 24건 | zh-TW 한자 오염 14건 |

**5월의 특이점**:
- ar/tr/pt 3개 언어가 모든 의미/시기 이슈에 등장 — 같은 번역가/경로로 작업된 듯
- zh-TW 한자 오염은 이번 검증의 중요한 발견 (간체 `乔` 포함)
- description/content 본문 안 한자까지 정밀 검사 필요했음 (6건 추가 발견)

---

## 최종 결론

**v24 배포 가능.** 45건 모두 정확히 적용됐고, 의도하지 않은 변경 0건, 모든 무결성 검증 통과.

이번 수정으로 정상화된 부분:
- ar/tr/pt 3개 언어의 사조 카피가 한국어 원본 의미와 일치
- ar/tr/pt 사조 시기가 정확한 연도(1860-1890 등)로 표기
- zh-TW 화가 음역(magritte, miro, turner)이 표준 번체 한자로 정정
- 사용자에게 표시되는 사조/거장 정보가 11개 언어에서 의미 일관성 확보
