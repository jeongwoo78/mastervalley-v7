"""
Master Valley - 수정분 타겟 재검증
대상: id/es/fr/zh-TW masters.js 17개 키 + th oneclickMovements __primary__
실행: python verify_recheck.py
필요: pip install deepl
"""

import deepl
import json
import re
import os

API_KEY = "81a8d44f-2824-48c5-89f0-b19b4c9dfd64:fx"
translator = deepl.Translator(API_KEY)

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "i18n")

DEEPL_LANG_MAP = {
    'id': 'ID', 'es': 'ES', 'fr': 'FR', 'zh-TW': 'ZH', 'th': 'TH'
}

MASTERS_KEYS = [
    'vangogh', 'klimt', 'munch', 'matisse', 'chagall', 'picasso', 'frida', 'lichtenstein',
    'vangogh-selfportrait', 'klimt-kiss', 'klimt-treeoflife', 'klimt-judith',
    'munch-scream', 'munch-madonna', 'matisse-redroom', 'picasso-doramaar', 'lichtenstein-inthecar'
]

SIMILARITY_THRESHOLD = 0.35


def word_similarity(text1, text2):
    def clean(t):
        return set(re.sub(r'[^\w\s]', '', t.lower()).split())
    w1, w2 = clean(text1), clean(text2)
    if not w1:
        return 0.0
    return len(w1 & w2) / max(len(w1), len(w2))


def extract_desc(content, key, section_name):
    start = content.find(f'export const {section_name}')
    end = content.find('\nexport const', start + 1)
    if end == -1:
        end = content.find('\nexport default')
    section = content[start:end]
    m = re.search(rf"'{re.escape(key)}':\s*\{{[^`]*?description:\s*`([^`]+)`", section, re.DOTALL)
    return m.group(1).strip() if m else None


def check_usage():
    usage = translator.get_usage()
    used = usage.character.count
    limit = usage.character.limit
    print(f"📊 DeepL 사용량: {used:,} / {limit:,} 자 ({used/limit*100:.1f}%)\n")


def main():
    print("🔍 수정분 타겟 재검증\n")
    check_usage()

    # 영어 원문
    with open(os.path.join(BASE, 'en', 'masters.js'), encoding='utf-8') as f:
        en_content = f.read()

    all_results = {}
    total_issues = 0
    total_checked = 0

    # ── 1. id/es/fr/zh-TW masters.js ──
    print("=== masters.js (id/es/fr/zh-TW) ===")
    for lang in ['id', 'es', 'fr', 'zh-TW']:
        with open(os.path.join(BASE, lang, 'masters.js'), encoding='utf-8') as f:
            lang_content = f.read()

        lang_issues = []
        print(f"\n▶ [{lang}]")
        for key in MASTERS_KEYS:
            # 영어 원문: Loading 또는 Result 섹션
            section = 'mastersLoadingEducation' if key in ['vangogh','klimt','munch','matisse','chagall','picasso','frida','lichtenstein'] else 'mastersResultEducation'
            en_desc = extract_desc(en_content, key, section)
            lang_desc = extract_desc(lang_content, key, section)

            if not en_desc or not lang_desc:
                print(f"  ❌ {key}: 추출 실패")
                continue

            translated_to_en = translator.translate_text(
                lang_desc, source_lang=DEEPL_LANG_MAP[lang], target_lang='EN-US'
            ).text
            score = word_similarity(en_desc, translated_to_en)
            total_checked += 1

            if score < SIMILARITY_THRESHOLD:
                total_issues += 1
                lang_issues.append({'key': key, 'score': round(score, 2), 'translated_to_en': translated_to_en[:100]})
                print(f"  ⚠️  {key} (score:{score:.2f}): {translated_to_en[:80]}...")
            else:
                print(f"  ✅ {key} (score:{score:.2f})")

        all_results[lang] = lang_issues

    # ── 2. th oneclickMovements __primary__ ──
    print("\n=== th oneclickMovements __primary__ ===")
    with open(os.path.join(BASE, 'en', 'oneclickMovements.js'), encoding='utf-8') as f:
        en_oc = f.read()
    with open(os.path.join(BASE, 'th', 'oneclickMovements.js'), encoding='utf-8') as f:
        th_oc = f.read()

    en_primary = re.search(r'export const oneclickMovementsPrimary = \{\s*content:\s*`([^`]+)`', en_oc, re.DOTALL)
    th_primary = re.search(r'export const oneclickMovementsPrimary = \{\s*content:\s*`([^`]+)`', th_oc, re.DOTALL)

    if en_primary and th_primary:
        translated_to_en = translator.translate_text(
            th_primary.group(1).strip(), source_lang='TH', target_lang='EN-US'
        ).text
        score = word_similarity(en_primary.group(1).strip(), translated_to_en)
        total_checked += 1
        if score < SIMILARITY_THRESHOLD:
            total_issues += 1
            print(f"  ⚠️  __primary__ (score:{score:.2f}): {translated_to_en[:100]}...")
            all_results['th'] = [{'key': '__primary__', 'score': round(score, 2)}]
        else:
            print(f"  ✅ __primary__ (score:{score:.2f})")
            all_results['th'] = []

    # 결과 저장
    with open('recheck_results.json', 'w', encoding='utf-8') as f:
        json.dump({'summary': {'total_checked': total_checked, 'total_issues': total_issues}, 'results': all_results}, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"총 검사: {total_checked}개 | 이슈: {total_issues}개")
    print(f"상세 결과: recheck_results.json")
    check_usage()


if __name__ == '__main__':
    main()
