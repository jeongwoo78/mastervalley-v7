"""
Master Valley - ui.js 로그인 섹션 DeepL 역번역 검증
방식: ui.js 파일에서 직접 읽어서 검증 (하드코딩 없음)
실행: python verify_translations.py
필요: pip install deepl
"""

import deepl
import json
import re
import os

API_KEY = "81a8d44f-2824-48c5-89f0-b19b4c9dfd64:fx"
translator = deepl.Translator(API_KEY)

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "i18n")

LANGS = ['ko', 'ja', 'id', 'th', 'tr', 'ar', 'es', 'fr', 'pt', 'zh-TW']

DEEPL_LANG_MAP = {
    'ko': 'KO', 'ja': 'JA', 'id': 'ID', 'th': 'TH',
    'tr': 'TR', 'ar': 'AR', 'es': 'ES', 'fr': 'FR',
    'pt': 'PT', 'zh-TW': 'ZH',
}

TARGET_KEYS = [
    'tagline', 'sub', 'logIn', 'signUp', 'pleaseWait',
    'loginCancelled', 'networkError', 'googleFailed', 'appleFailed',
    'emailInUse', 'invalidEmail', 'weakPassword', 'wrongCredentials', 'loginFailed',
]

SIMILARITY_THRESHOLD = 0.4


def extract_ui_keys(filepath, keys):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    result = {}
    for key in keys:
        m = re.search(rf"['\"]?{re.escape(key)}['\"]?\s*:\s*'([^']*)'", content)
        if not m:
            m = re.search(rf'["\']?{re.escape(key)}["\']?\s*:\s*"([^"]*)"', content)
        if m:
            result[key] = m.group(1)
    return result


def word_similarity(text1, text2):
    def clean(t):
        return set(re.sub(r'[^\w\s]', '', t.lower()).split())
    w1, w2 = clean(text1), clean(text2)
    if not w1:
        return 0.0
    return len(w1 & w2) / max(len(w1), len(w2))


def main():
    print("\n🔍 DeepL 역번역 검증 시작 (파일 직접 읽기)\n")

    en_path = os.path.join(BASE, 'en', 'ui.js')
    en_data = extract_ui_keys(en_path, TARGET_KEYS)
    print(f"[en/ui.js] {len(en_data)}개 키 로드\n")

    all_results = {}
    issues_total = 0

    for lang in LANGS:
        filepath = os.path.join(BASE, lang, 'ui.js')
        if not os.path.exists(filepath):
            print(f"[{lang}] 파일 없음")
            continue

        lang_data = extract_ui_keys(filepath, TARGET_KEYS)
        print(f"▶ [{lang}] 검증 중...")

        lang_results = []
        for key in TARGET_KEYS:
            if key not in en_data or key not in lang_data:
                continue
            original = en_data[key]
            translated = lang_data[key]
            try:
                back = translator.translate_text(
                    translated,
                    source_lang=DEEPL_LANG_MAP[lang],
                    target_lang='EN-US'
                ).text
                score = word_similarity(original, back)
                status = '✅' if score >= SIMILARITY_THRESHOLD else '⚠️'
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': translated, 'back': back,
                    'score': round(score, 2), 'status': status
                })
            except Exception as e:
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': translated, 'back': f'ERROR: {e}',
                    'score': 0, 'status': '❌'
                })

        all_results[lang] = lang_results

    with open('deepl_results.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print("\n" + "="*50)
    print("검증 결과 요약")
    print("="*50)
    for lang, results in all_results.items():
        issues = [r for r in results if r['status'] != '✅']
        issues_total += len(issues)
        if not issues:
            print(f"\n[{lang}] ✅ 전체 통과")
        else:
            print(f"\n[{lang}] ⚠️  {len(issues)}개 주의")
            for r in issues:
                print(f"  키: {r['key']}")
                print(f"  원문: {r['original']}")
                print(f"  번역: {r['translated']}")
                print(f"  역번역: {r['back']}")
                print(f"  유사도: {r['score']}")

    print(f"\n총 이슈: {issues_total}개")
    print("상세 결과는 deepl_results.json 참조")


if __name__ == '__main__':
    main()
