# 랜딩페이지 수정사항 (ko 기준 확정)

> 다른 언어 버전에 동일하게 적용할 수정 리스트  
> 기준 파일: ko.html (2026-04-12 확정)

---

## A. 삭제 (5건)

| # | 대상 | 선택자/내용 |
|---|------|------------|
| 1 | hero-tag | `<div class="hero-tag">AI Time Travel Studio</div>` 삭제 (CSS `.hero-tag` 정의는 잔류 OK) |
| 2 | eyebrow | `<div class="eyebrow">사진 한 장 · 시간과 공간을 넘어</div>` 삭제 (각 언어별 해당 문구) |
| 3 | meet-desc | `<p class="meet-desc">시간여행 중, 역사상 가장 위대한 예술가들을 마주합니다.</p>` 삭제 |
| 4 | meet-desc 보라색 | `<p class="meet-desc" style="...color:#9b8ec4...">당신이 주문하고. 거장이 그립니다.</p>` 삭제 → **동일 텍스트를 `meet-feat` 클래스(금색 이탤릭)로 유지** |
| 5 | eyebrow | `<div class="eyebrow">믿을 수 없는 만남</div>` 삭제 |
| 6 | eyebrow | `<div class="eyebrow">유리 너머의 걸작, 이제 당신의 것</div>` 삭제 |

### 4번 보충 설명
- 기존: `<p class="meet-desc" style="margin-top:8px;color:#9b8ec4;font-weight:500">당신이 주문하고. 거장이 그립니다.</p>`
- 변경 후: `<p class="meet-feat">당신이 주문하고. 거장이 그립니다.</p>` (보라색 인라인 스타일 제거, meet-feat 클래스 사용)
- meet-feat CSS: `.meet-feat{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--gold);margin-top:20px}`

---

## B. 스타일 변경 (3건)

| # | 대상 | 변경 내용 |
|---|------|----------|
| 7 | "단순한 필터가 아닙니다" 문구 | `<p class="meet-desc" style="margin-top:8px;color:#9b8ec4;font-weight:500">` 보라색 스타일 적용 |
| 8 | `.hero-sub` | `color:#9b8ec4` (보라색으로 변경) |
| 9 | `.slide-hint` | `font-size:15px` → `font-size:16px` |

---

## C. 텍스트/구조 변경 (4건)

| # | 대상 | Before → After |
|---|------|---------------|
| 10 | 갤러리 섹션 제목 | `걸작을 당신의 공간에 걸다.` → `새로운 걸작,<br><em>당신의 공간에 걸다.</em>` |
| 11 | 슬라이드 섹션 제목 | `당신은 지금. <em>다른 시간, 다른 장소에.</em>` → `당신은 지금.<br><em>다른 시간, 다른 장소에.</em>` (마침표 뒤 `<br>` 줄바꿈) |
| 12 | 거장 소개 문장 | 반 고흐/클림트/프리다 각 문장 사이에 `<br>` 추가하여 한 줄씩 분리 |
| 13 | `.phone-mock` | `border:2px solid #3B8A7A` (반 고흐 비취색 테두리) 추가 |

### 12번 적용 예시 (ko)
```html
<p class="meet-desc">반 고흐에게 소용돌이치는 별을 그려달라 하세요.<br>클림트에게 황금빛으로 감싸달라 하세요.<br>프리다에게 더욱더 대담하게 표현해달라 하세요.</p>
```

---

## D. 모바일 레이아웃 (3건)

| # | 대상 | 변경 내용 |
|---|------|----------|
| 14 | meet 섹션 모바일 | `@media(max-width:768px)` 에서 `text-align:center` → `text-align:left` |
| 15 | web-cta 섹션 모바일 | 텍스트를 mockup 위로 이동: `.web-text{order:1}` `.web-mockup{order:2}` |
| 16 | 회전/갤러리 모바일 3칸 유지 | `@media(max-width:900px)` 에서 `repeat(2,1fr)` 제거 → 3칸 유지, gap만 축소 |

### 15번 적용 코드
```css
@media(max-width:768px){
  .web-inner{flex-direction:column;text-align:center}
  .web-text{order:1}
  .web-mockup{order:2}
}
```

### 16번 적용 코드
Before:
```css
@media(max-width:900px){
  .gallery-wall{grid-template-columns:repeat(2,1fr);gap:16px}
  .rotate-row{grid-template-columns:repeat(2,1fr);gap:12px}
}
```
After:
```css
@media(max-width:900px){
  .gallery-wall{gap:12px}
  .rotate-row{gap:10px}
}
```

---

## 적용 순서 권장

1. **삭제 (1~6)** — 먼저 불필요 요소 제거
2. **스타일 변경 (7~9)** — CSS 값 수정
3. **텍스트/구조 (10~13)** — HTML 구조 변경
4. **모바일 레이아웃 (14~16)** — 반응형 수정

## 언어별 주의사항

- 2, 3, 4, 5, 6번: 각 언어별 번역 문구가 다르므로 **해당 언어의 텍스트** 기준으로 삭제
- 10, 11번: 각 언어 번역된 제목에 동일한 `<br>` + `<em>` 구조 적용
- 12번: 거장 3인 소개 문장 — 언어별 번역 다르지만 `<br>` 구분은 동일
- 7, 8, 9, 13, 14, 15, 16번: CSS/구조 변경이므로 **언어 무관 동일 적용**
