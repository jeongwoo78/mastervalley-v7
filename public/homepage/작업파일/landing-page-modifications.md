# 랜딩페이지 수정사항 (ko 기준 확정 · 검증 완료)

> 기준 파일: ko.html (2026-04-13 확정)  
> 총 30건 (1번 취소 포함) · 전건 ko.html 대비 검증 완료 ✅

---

## A. 삭제 (5건)

| # | 상태 | 대상 | 내용 |
|---|------|------|------|
| ~~1~~ | ❌취소 | hero-tag | 복원됨 — 아이콘 밑 위치 유지 |
| 2 | ✅ | eyebrow | `사진 한 장 · 시간과 공간을 넘어` 삭제 |
| 3 | ✅ | meet-desc | `시간여행 중, 역사상 가장 위대한 예술가들을 마주합니다.` 삭제 |
| 4 | ✅ | meet-desc 보라색 | 삭제 → `meet-feat`(금색 이탤릭)로 교체 |
| 5 | ✅ | eyebrow | `믿을 수 없는 만남` 삭제 |
| 6 | ✅ | eyebrow | `유리 너머의 걸작, 이제 당신의 것` 삭제 |

### 4번 보충
```html
<p class="meet-feat">당신이 주문하고. 거장이 그립니다.</p>
```
```css
.meet-feat{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--gold);margin-top:20px}
```

---

## B. 스타일 변경 (10건)

| # | 상태 | 대상 | Before → After |
|---|------|------|---------------|
| 7 | ✅ | "단순한 필터가 아닙니다" | 인라인 `color:#9b8ec4;font-weight:500` |
| 8 | ✅ | `.hero-sub` | color → `#9b8ec4` |
| 9 | ✅ | `.slide-hint` | font-size `15px` → `16px` |
| 18 | ✅ | `.phone-mock` border | `2px solid #3B8A7A` → `2px solid rgba(59,138,122,0.3)` |
| 19 | ✅ | 모니터 목업 (인라인) | 타이틀바 `#2a2a2a`→`#263f48` · 보더 추가 `rgba(59,138,122,0.35)` · 스탠드 `#444`→`#3a5a5a` |
| 22 | ✅ | `.bottom-sub` | 인라인 `color:#9b8ec4` 추가 |
| 24 | ✅ | `.bottom-h2` | margin-bottom `12px` → `24px` |
| 24 | ✅ | `.bottom-sub` | font-size `16px` → `18px` |
| 25 | ✅ | `.hero-tag` | margin-bottom `28px` → `50px` |
| 30 | ✅ | `.bottom-cta` | padding `80px 5% 100px` → `40px 5% 100px` |
| 30 | ✅ | `.bottom-card` | padding `80px 40px` → `40px 40px` (모바일 `30px 16px`) |

---

## C. 텍스트/구조 변경 (7건)

| # | 상태 | 대상 | 변경 내용 |
|---|------|------|----------|
| 10 | ✅ | 갤러리 제목 | `새로운 걸작,<br><em>당신의 공간에 걸다.</em>` |
| 11 | ✅ | 슬라이드 제목 | `당신은 지금.<br><em>다른 시간, 다른 장소에.</em>` |
| 12 | ✅ | 거장 소개 | 반 고흐/클림트/프리다 각 문장 `<br>` 분리 |
| 13 | ✅ | `.phone-mock` | border 추가 (→18번에서 은은하게 변경) |
| 20 | ✅ | 하단 CTA 제목 | 각 언어별 번역 텍스트 |
| 23 | ✅ | 하단 CTA 줄바꿈 | `지금,<br>당신의 사진을<br>작품으로<br>만들어보세요.` |
| 27 | ✅ | 보라색 문구 줄나누기 | `단순한 필터가 아닙니다.<br>— 거장의 시선으로 다시 그려집니다.` |

---

## D. 모바일 레이아웃 (8건)

| # | 상태 | 대상 | 변경 내용 |
|---|------|------|----------|
| 14 | ✅ | meet 텍스트 | `text-align:left` |
| 15 | ✅ | web-cta 순서 | `.web-text{order:1}` `.web-mockup{order:2}` |
| 16 | ✅ | 회전/갤러리 3칸 | `repeat(2,1fr)` 제거, gap만 축소 |
| 17 | ✅ | 8액자 여백 | `.frame{padding:6px}` `.frame-inner{padding:4px;gap:2px}` |
| 21 | ✅ | 스토어 버튼 + 하단카드 | `.store-btn{padding:14px 16px;gap:8px}` `.bottom-card{padding:30px 16px}` |
| 26 | ✅ | meet 제목 가운데 | `.meet-h2{text-align:center}` |
| 28 | ✅ | meet 좌우 전폭 | `.meet-left{width:100%}` `.meet-right{width:100%}` |
| 29 | ✅ | btn-p 범위 한정 | `.hero-btns .btn-p,.hero-btns .btn-o` 으로 한정 |

---

## 미디어쿼리 통합 (복사용)

### @media(max-width:900px)
```css
@media(max-width:900px){
  .gallery-wall{gap:8px}
  .rotate-row{gap:10px}
  .frame{padding:6px}
  .frame-inner{padding:4px;gap:2px}
}
```

### @media(max-width:768px) — meet
```css
@media(max-width:768px){
  .meet-split{flex-direction:column;text-align:left}
  .meet-left{width:100%}
  .meet-right{flex:none;width:100%}
  .meet-h2{text-align:center}
}
```

### @media(max-width:768px) — web-cta
```css
@media(max-width:768px){
  .web-inner{flex-direction:column;text-align:center}
  .web-text{order:1}
  .web-mockup{order:2}
}
```

### @media(max-width:600px)
```css
@media(max-width:600px){
  nav{padding:14px 16px}
  .hero{padding:110px 16px 50px}
  .grid-s{padding:40px 16px 80px}
  .museum-s{padding:60px 16px}
  .hero-btns{flex-direction:column;width:100%}
  .hero-btns .btn-p,.hero-btns .btn-o{width:100%;text-align:center}
  .store-btn{padding:14px 16px;gap:8px}
  .bottom-card{padding:30px 16px}
}
```

---

## 적용 순서

1. **삭제 (2~6)** — 5건
2. **스타일 (7~9, 18~19, 22, 24~25, 30)** — 10건
3. **텍스트/구조 (10~13, 20, 23, 27)** — 7건
4. **모바일 (14~17, 21, 26, 28~29)** — 8건

---

## 언어별 분류

### 🔧 언어 무관 — 18건
`7, 8, 9, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 25, 26, 28, 29, 30`

### 🌐 언어별 조정 — 12건
| # | 내용 |
|---|------|
| ~~1~~ | 취소 — hero-tag 복원 (영문 공통 텍스트) |
| 2 | 각 언어 eyebrow 삭제 |
| 3 | 각 언어 meet-desc 삭제 |
| 4 | 보라색 meet-desc → meet-feat 교체 (각 언어 텍스트) |
| 5 | 각 언어 eyebrow 삭제 |
| 6 | 각 언어 eyebrow 삭제 |
| 10 | 각 언어 갤러리 제목 `<br>` + `<em>` |
| 11 | 각 언어 슬라이드 제목 `<br>` |
| 12 | 거장 3인 소개 `<br>` (구조 동일) |
| 20 | 하단 CTA 제목 (각 언어 텍스트) |
| 23 | 하단 CTA 줄바꿈 (언어별 위치 판단) |
| 27 | 보라색 문구 줄바꿈 (언어별 위치 판단) |
