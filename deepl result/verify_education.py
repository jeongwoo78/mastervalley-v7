"""
Master Valley - Education 파일 번역 검증 스크립트
대상: masters.js / movements.js / oriental.js (10개 언어)
방식: 번역본 → 영어 순번역 후 원문과 유사도 비교 (역번역 없음)
실행: python3 verify_education.py
필요: pip install deepl
"""

import deepl
import json
import re
import os

API_KEY = "81a8d44f-2824-48c5-89f0-b19b4c9dfd64:fx"
translator = deepl.Translator(API_KEY)

BASE = os.path.join(os.path.dirname(__file__), "src", "i18n")

LANGS = ['ko', 'ja', 'id', 'th', 'tr', 'ar', 'es', 'fr', 'pt', 'zh-TW']
FILES = ['masters', 'movements', 'oriental']

DEEPL_LANG_MAP = {
    'ko': 'KO', 'ja': 'JA', 'id': 'ID', 'th': 'TH',
    'tr': 'TR', 'ar': 'AR', 'es': 'ES', 'fr': 'FR',
    'pt': 'PT', 'zh-TW': 'ZH',
}

SIMILARITY_THRESHOLD = 0.35


def extract_descriptions(filepath):
    """파일에서 key: description 딕셔너리 추출"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    result = {}
    # 'key': { description: `...` } 패턴
    pattern = r"'([^']+)':\s*\{[^}]*?description:\s*`([^`]+)`"
    matches = re.findall(pattern, content, re.DOTALL)
    for key, desc in matches:
        result[key] = desc.strip()
    # key: { description: `...` } 패턴 (따옴표 없는 키)
    pattern2 = r"^\s{2}([a-zA-Z_][a-zA-Z0-9_-]*):\s*\{[^}]*?description:\s*`([^`]+)`"
    matches2 = re.findall(pattern2, content, re.DOTALL | re.MULTILINE)
    for key, desc in matches2:
        if key not in result:
            result[key] = desc.strip()
    return result


def word_similarity(text1, text2):
    """단어 집합 유사도"""
    def clean(t):
        return set(re.sub(r'[^\w\s]', '', t.lower()).split())
    w1, w2 = clean(text1), clean(text2)
    if not w1:
        return 0.0
    return len(w1 & w2) / max(len(w1), len(w2))


def check_usage():
    """DeepL API 사용량 확인"""
    usage = translator.get_usage()
    used = usage.character.count
    limit = usage.character.limit
    print(f"\n📊 DeepL 사용량: {used:,} / {limit:,} 자 ({used/limit*100:.1f}%)")
    return limit - used


def main():
    print("🔍 Education 파일 번역 검증 시작...")
    print("방식: 번역본 → 영어 변환 후 원문과 유사도 비교\n")

    remaining = check_usage()
    print(f"남은 한도: {remaining:,}자\n")

    # 영어 원문 로드
    en_data = {}
    for fname in FILES:
        en_data[fname] = extract_descriptions(os.path.join(BASE, 'en', f'{fname}.js'))
        print(f"[en/{fname}.js] {len(en_data[fname])}개 키 로드")

    all_results = {}
    total_issues = 0
    total_checked = 0

    for lang in LANGS:
        deepl_lang = DEEPL_LANG_MAP[lang]
        lang_results = []
        print(f"\n{'='*50}")
        print(f"▶ [{lang}] 검증 중...")

        for fname in FILES:
            filepath = os.path.join(BASE, lang, f'{fname}.js')
            if not os.path.exists(filepath):
                print(f"  ⚠️  {fname}.js 파일 없음")
                continue

            lang_descs = extract_descriptions(filepath)
            en_descs = en_data[fname]

            file_issues = 0
            for key, en_text in en_descs.items():
                if key not in lang_descs:
                    continue  # 키 누락은 별도 처리

                translated = lang_descs[key]

                # 영어로 번역
                try:
                    translated_to_en = translator.translate_text(
                        translated,
                        source_lang=deepl_lang,
                        target_lang='EN-US'
                    ).text
                except Exception as e:
                    print(f"  ❌ {key} 번역 오류: {e}")
                    continue

                score = word_similarity(en_text, translated_to_en)
                total_checked += 1

                if score < SIMILARITY_THRESHOLD:
                    file_issues += 1
                    total_issues += 1
                    result = {
                        'file': fname,
                        'key': key,
                        'original': en_text[:120],
                        'translated': translated[:120],
                        'translated_to_en': translated_to_en[:120],
                        'score': round(score, 2),
                        'status': '⚠️'
                    }
                    lang_results.append(result)
                    print(f"  ⚠️  [{fname}] {key} (score:{score:.2f})")
                    print(f"       원문: {en_text[:80]}...")
                    print(f"       번역→영어: {translated_to_en[:80]}...")

            if file_issues == 0:
                print(f"  ✅ {fname}.js 전체 통과")

        if not lang_results:
            print(f"  ✅ 전체 통과")

        all_results[lang] = lang_results

    # 결과 저장
    output = {
        'summary': {
            'total_checked': total_checked,
            'total_issues': total_issues,
        },
        'results': all_results
    }
    with open('education_results.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"✅ 검증 완료")
    print(f"총 검사: {total_checked}개 | 이슈: {total_issues}개")
    print(f"상세 결과: education_results.json")

    check_usage()


if __name__ == '__main__':
    main()
