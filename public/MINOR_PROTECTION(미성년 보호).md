# Master Valley — Minor Protection Logic
# 마스터 밸리 — 미성년자 보호 로직

## Overview (개요)

The system is designed with a strict "minor-safe by default" principle.
본 시스템은 엄격한 "미성년자 기본 안전(minor-safe by default)" 원칙으로 설계되었습니다.

When the Vision API detects a minor (baby/child/teen) in a photo, five layers of safety measures are automatically applied.
Vision API가 사진에서 미성년자(baby/child/teen)를 감지하면, 5중 안전 조치가 자동 적용됩니다.

Teen (estimated 13–19) is treated with the same strict safety policy as child. Zero tolerance for suggestive or revealing content.
청소년(추정 13~19세)은 아동과 동일한 엄격한 안전 정책이 적용됩니다. 선정적이거나 노출이 있는 콘텐츠에 대해 무관용 원칙을 적용합니다.


## 5-Layer Defense Structure (5중 방어 구조)

### Layer 1. Detection (감지)
- Detect baby/child/teen via Vision `age_range` value
- Vision `age_range` 값으로 baby/child/teen 감지
- Terms §5: "When our AI system detects that a photo contains a minor, additional safety measures are automatically applied, designed to minimize the risk of sexually suggestive, nude, or age-inappropriate content being generated."
- 약관 §5: "AI 시스템이 사진에 미성년자가 포함된 것을 감지하면, 추가 안전 조치가 자동으로 적용되어 성적으로 선정적이거나, 나체이거나, 연령에 부적절한 콘텐츠가 생성될 위험을 최소화합니다."

### Layer 2. Artist Restriction (화가 제한)
- Exclude artists whose original works contain nudity; match only to safe artists
- 원작에 누드가 있는 화가를 제외하고, 안전 화가로만 매칭
- Terms §7: "For photos containing minors, enhanced content protection is automatically applied. The App's AI system applies strict safeguards designed to prevent the generation of sexual, nude, or otherwise inappropriate content involving minors."
- 약관 §7: "미성년자가 포함된 사진에 대해 강화된 콘텐츠 보호가 자동으로 적용됩니다. 앱의 AI 시스템은 미성년자와 관련된 성적, 나체 또는 부적절한 콘텐츠 생성을 방지하기 위해 엄격한 안전장치를 적용합니다."

### Layer 3. Masterwork Restriction (대표작 제한)
- Within safe artists, exclude masterworks with nudity; match only to safe masterworks
- 안전 화가 내에서도 위험 대표작을 제외하고, 안전 대표작으로만 매칭
- Terms §7: "We employ multiple safeguards to minimize unintended content—including detection, content restriction, prompt-level safeguards, and content moderation."
- 약관 §7: "감지, 콘텐츠 제한, 프롬프트 수준의 안전장치, 콘텐츠 모더레이션 등 다층 안전장치를 적용하고 있습니다."

### Layer 4. Clothing Prompt Enhancement (의상 프롬프트 강화)
- General (all photos): `Clothing covers chest, waist and hip areas.`
- Minor detected: `Full modest age-appropriate clothing covering entire body.`
- 일반 (모든 사진): `Clothing covers chest, waist and hip areas.`
- 미성년자 감지: `Full modest age-appropriate clothing covering entire body.`
- Terms §3: "The App automatically applies enhanced safety measures to photos detected as containing minors, designed to promote age-appropriate processing."
- 약관 §3: "앱은 미성년자가 포함된 사진에 대해 자동으로 강화된 안전 조치를 적용하며, 연령에 적합한 처리를 촉진하도록 설계되었습니다."
- Terms §5: "These protections operate at the prompt level and are applied regardless of the selected art style."
- 약관 §5: "이러한 보호는 프롬프트 수준에서 작동하며, 선택된 미술 스타일과 관계없이 적용됩니다."

### Layer 5. Attractiveness Expression Moderation (매력 표현 순화)
- Replace adult attractiveness expressions with age-appropriate expressions
- 성인 매력 표현(captivating, luminous beauty 등) 대신 순수한 표현 적용
- baby: "cherubic angelic beauty, sparkling innocent eyes"
- child: "radiant endearing charm, carefree innocent smile"
- teen: "fresh youthful energy, bright clear eyes full of curiosity"
- Terms §3: "designed to promote age-appropriate processing."
- 약관 §3: "연령에 적합한 처리를 촉진하도록 설계되었습니다."
- Terms §8: "you acknowledge that enhanced safety processing will be automatically applied to such photos."
- 약관 §8: "미성년자가 포함된 사진을 업로드할 경우, 강화된 안전 처리가 자동으로 적용됨을 인정합니다."


## Disclaimer (면책)
- Terms §5: "However, no AI system can guarantee absolute prevention in all cases."
- 약관 §5: "다만, 어떤 AI 시스템도 모든 경우에 완벽한 방지를 보장할 수는 없습니다."
- Terms §7: "no system can guarantee absolute prevention in all cases."
- 약관 §7: "어떤 시스템도 모든 경우에 완벽한 방지를 보장할 수 없습니다."
- Even if minor detection fails, baseline clothing prompts apply to ALL photos, and Replicate's built-in NSFW filter provides additional output-level protection.
- Vision이 미성년자를 감지하지 못하더라도, baseline 의상 프롬프트는 모든 사진에 공통 적용되며, Replicate의 내장 NSFW 필터가 추가적인 출력 수준 보호를 제공합니다.
- If the system determines that safe output cannot be reasonably guaranteed, it may decline to generate the transformation.
- 시스템이 안전한 출력을 합리적으로 보장할 수 없다고 판단하면, 변환 생성을 거부할 수 있습니다.


## Minor-Safe Matching Table (미성년자 안전 매칭 테이블)

### Movements (사조)

| Style (스타일) | Safe Artist (매칭화가) | Safe Masterwork (매칭 대표작) | Notes (비고) |
|----------------|------------------------|-------------------------------|--------------|
| Ancient (고대) | Marble (대리석) | Marble Sculpture (대리석 조각) | Clothing prompt: toga (의상 프롬프트: 토가) |
|  | Roman Mosaic (로마 모자이크) | Roman Mosaic (로마 모자이크) |  |
| Medieval (중세) | Byzantine (비잔틴) | Justinian (유스티니아누스), Deesis (데이시스) | Clothing prompt: medieval robes (의상 프롬프트: 중세 로브) |
|  | Islamic Miniature (이슬람 세밀화) | Youth Holding a Flower (꽃을 든 귀족), Simurgh (시무르그) |  |
| Renaissance (르네상스) | Leonardo (레오나르도) | The Last Supper (최후의 만찬), Virgin of the Rocks (암굴의 성모) | Excluded (제외): Botticelli, Michelangelo, Titian / raphael-galatea |
|  | Raphael (라파엘로) | School of Athens (아테네 학당), Sistine Madonna (시스티나 마돈나) |  |
| Baroque (바로크) | Rembrandt (렘브란트) | The Night Watch (야경), Self-Portrait (자화상) | Excluded (제외): Caravaggio, Rubens |
|  | Velázquez (벨라스케스) | Las Meninas (시녀들), Surrender of Breda (브레다의 항복) |  |
| Rococo (로코코) | Watteau (와토) | Pierrot (피에로), Pilgrimage to Cythera (키테라 순례) | Excluded (제외): Boucher |
| Neo/Roman/Real (신고전/낭만/사실) | David (다비드) | Coronation of Napoleon (나폴레옹 대관식), Oath of the Horatii (호라티우스) | Excluded (제외): Ingres, Delacroix, Courbet, Manet, Turner / david-marat |
| Impressionism (인상주의) | Monet (모네) | Water Lilies (수련), Woman with a Parasol (양산 든 여인) | Excluded (제외): Renoir, Degas |
|  | Caillebotte (카유보트) | Paris Street (파리 거리), Man at the Window (창가의 남자) |  |
| Post-Impressionism (후기인상) | Van Gogh (반 고흐) | The Starry Night (별이 빛나는 밤), Sunflowers (해바라기), Wheat Field (밀밭) | Excluded (제외): Gauguin, Cézanne |
| Fauvism (야수파) | Derain (드랭) | Portrait of Matisse (마티스의 초상) | Excluded (제외): Matisse, Vlaminck |
| Expressionism (표현주의) | Kokoschka (코코슈카) | Self-Portrait of a Degenerate Artist (퇴폐 미술가), Double Portrait (2인 초상) | Excluded (제외): Munch, Kirchner / kokoschka-bride |
| Modernism (모더니즘) | Chagall (샤갈) | Lovers with Flowers (꽃과 연인들), I and the Village (나와 마을) | Excluded (제외): Picasso, Magritte, Miró |
|  | Lichtenstein (리히텐슈타인) | M-Maybe (아마도), Ohhh...Alright... (오 알았어) |  |

### Masters (거장)

| Master (거장) | Safe Masterwork (매칭 대표작) | Notes (비고) |
|---------------|-------------------------------|--------------|
| Van Gogh (반 고흐) | The Starry Night (별이 빛나는 밤), Sunflowers (해바라기), Wheat Field (밀밭) | Excluded (제외작): vangogh-cafe, vangogh-selfportrait |
| Klimt (클림트) | The Tree of Life (생명의 나무) | Excluded (제외작): klimt-judith, klimt-kiss |
| Munch (뭉크) | The Scream (절규) | Excluded (제외작): munch-madonna |
| Matisse (마티스) | The Red Room (붉은 방), Portrait of André Derain (드랭의 초상) | Excluded (제외작): matisse-greenstripe, matisse-purplecoat |
| Chagall (샤갈) | Lovers with Flowers (꽃과 연인들), I and the Village (나와 마을) | Excluded (제외작): chagall-lamariee |
| Frida (프리다) | Me and My Parrots (나와 앵무새들), Self-Portrait with Monkeys (원숭이 자화상) | No exclusion, all safe (제외작 없음, 전부 안전) |
| Lichtenstein (리히텐슈타인) | M-Maybe (아마도), Ohhh...Alright... (오 알았어) | Excluded (제외작): lichtenstein-inthecar, lichtenstein-forgetit, lichtenstein-stilllife |

### Oriental (동양화)

| Style (스타일) | Safe Style (매칭 스타일) | Notes (비고) |
|----------------|--------------------------|--------------|
| Korean (한국화) | Pungsokdo (풍속도) | Clothing prompt: hanbok (의상 프롬프트: 한복) |
| Chinese (중국화) | Gongbi (공필화) | Clothing prompt: hanfu (의상 프롬프트: 한푸) |
| Japanese (일본화) | Ukiyo-e (우키요에) | Clothing prompt: kimono (의상 프롬프트: 기모노) |

Safe artist and masterwork lists are reviewed when new styles or artworks are added to the app.
안전 화가 및 대표작 목록은 새로운 스타일이나 작품이 앱에 추가될 때 검토됩니다.


## Implementation Location (구현 위치)
- flux-transfer.js: All 5 Layers (전체 5 Layer)
- art-api-prompts.js: Layer 4 — clothing prompts (의상 프롬프트)
- This document: /docs/MINOR_PROTECTION.md (본 문서)


## Last Updated (최종 수정일)
2026-04-15
