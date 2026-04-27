"""
Master Valley v24 — 4월 검증 v2 (거장 + 동양화)

변경점 (v1 대비):
  1. JS 모듈을 Node.js로 실제 import해서 중첩 구조 정확히 추출
     (v1 정규식은 같은 키 이름 충돌로 약 97% 누락됨)
  2. 동일 텍스트 캐싱으로 DeepL 글자 수 약 50% 절감
  3. MISSING 키 감지 정확

검증 대상 (옵션 E - 4월):
  masters.js, oriental.js, oneclickMasters.js, oneclickOriental.js

예상 사용량: 약 26만 3천 자 (캐싱 적용)

사전 요구사항:
  pip install deepl
  Node.js 18+ (모듈 import 지원)
  같은 폴더에 extract_strings.mjs 파일

사용법:
  python verify_april_education_v2.py YOUR_DEEPL_API_KEY

결과:
  deepl_april_masters_v2.json
  deepl_april_oriental_v2.json
  deepl_april_oneclickMasters_v2.json
  deepl_april_oneclickOriental_v2.json
"""

import sys
import json
import os
import time
import subprocess

try:
    import deepl
except ImportError:
    print("❌ deepl 모듈 필요. 설치: pip install deepl")
    sys.exit(1)

if len(sys.argv) < 2:
    api_key = os.environ.get('DEEPL_API_KEY', '')
    if not api_key:
        print("Usage: python verify_april_education_v2.py YOUR_DEEPL_API_KEY")
        sys.exit(1)
else:
    api_key = sys.argv[1]

translator = deepl.Translator(api_key)

# i18n 폴더 위치 (스크립트 기준)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
I18N_BASE = os.path.join(SCRIPT_DIR, "src", "i18n")
if not os.path.isdir(I18N_BASE):
    I18N_BASE = os.path.join(SCRIPT_DIR, "i18n")
if not os.path.isdir(I18N_BASE):
    print(f"❌ i18n 폴더를 찾을 수 없음: {I18N_BASE}")
    sys.exit(1)

EXTRACTOR = os.path.join(SCRIPT_DIR, "extract_strings.mjs")
if not os.path.isfile(EXTRACTOR):
    print(f"❌ extract_strings.mjs 파일이 필요: {EXTRACTOR}")
    sys.exit(1)

LANGS = ['ko', 'ja', 'es', 'fr', 'id', 'ar', 'tr', 'pt', 'th', 'zh-TW']

DEEPL_LANG_MAP = {
    'ko': 'KO', 'ja': 'JA', 'id': 'ID', 'th': 'TH',
    'tr': 'TR', 'ar': 'AR', 'es': 'ES', 'fr': 'FR',
    'pt': 'PT', 'zh-TW': 'ZH',
}

SIMILARITY_THRESHOLD = 0.45

# 4월 검증 대상 (옵션 E)
APRIL_FILES = [
    ('masters.js', 'masters'),
    ('oriental.js', 'oriental'),
    ('oneclickMasters.js', 'oneclickMasters'),
    ('oneclickOriental.js', 'oneclickOriental'),
]


def extract_strings(lang, filename):
    """Node.js로 JS 모듈을 import해서 평탄화된 키-값 dict 반환"""
    out = subprocess.run(
        ['node', EXTRACTOR, lang, filename],
        capture_output=True, text=True, timeout=30,
        cwd=I18N_BASE,
        encoding='utf-8',  # 윈도우 cp949 회피
        errors='replace'
    )
    if out.returncode != 0:
        print(f"\n  [debug] node exit code: {out.returncode}")
        if out.stderr:
            print(f"  [debug] stderr: {out.stderr[:300]}")
        return None
    if not out.stdout:
        return None
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError as e:
        print(f"\n  [debug] JSON parse error for {lang}/{filename}: {e}")
        return None


def word_similarity(a, b):
    import re
    if not a or not b:
        return 0
    a_words = set(re.findall(r'\w+', a.lower()))
    b_words = set(re.findall(r'\w+', b.lower()))
    if not a_words or not b_words:
        return 0
    common = a_words & b_words
    return len(common) / max(len(a_words), len(b_words))


def verify_file(filename, label):
    print(f"\n{'='*60}")
    print(f"검증 시작: {filename}")
    print('='*60)

    en_strings = extract_strings('en', filename)
    if en_strings is None:
        print(f"❌ 영어 파일 추출 실패: en/{filename}")
        return 0
    print(f"📋 영어 키: {len(en_strings)}개")

    all_results = {}
    chars_used = 0
    issues_total = 0

    for lang in LANGS:
        lang_strings = extract_strings(lang, filename)
        if lang_strings is None:
            print(f"⚠️ [{lang}] 파일 추출 실패 또는 파일 없음")
            continue

        print(f"\n[{lang}] 검증 중...", end='', flush=True)

        # 캐시: 같은 언어 내 동일 텍스트는 1번만 DeepL 호출
        cache = {}
        lang_results = []
        cache_hits = 0

        for key, original in en_strings.items():
            if key not in lang_strings:
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': '(MISSING)',
                    'back': '', 'score': 0, 'status': '🚨 MISSING'
                })
                continue

            translated = lang_strings[key]

            if len(translated) < 3:
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': translated,
                    'back': '(skipped: too short)',
                    'score': 1.0, 'status': '✅'
                })
                continue

            # 캐시 확인
            if translated in cache:
                back = cache[translated]
                cache_hits += 1
            else:
                try:
                    back = translator.translate_text(
                        translated,
                        source_lang=DEEPL_LANG_MAP[lang],
                        target_lang='EN-US'
                    ).text
                    cache[translated] = back
                    chars_used += len(translated)
                    time.sleep(0.05)
                except Exception as e:
                    lang_results.append({
                        'key': key, 'original': original,
                        'translated': translated,
                        'back': f'ERROR: {str(e)[:100]}',
                        'score': 0, 'status': '❌'
                    })
                    continue

            score = word_similarity(original, back)
            if score >= SIMILARITY_THRESHOLD:
                status = '✅'
            else:
                status = '⚠️'
                issues_total += 1

            lang_results.append({
                'key': key, 'original': original,
                'translated': translated, 'back': back,
                'score': round(score, 2), 'status': status
            })

        all_results[lang] = lang_results
        passed = len([r for r in lang_results if r['status'] == '✅'])
        warnings = len([r for r in lang_results if r['status'] == '⚠️'])
        missing = len([r for r in lang_results if r['status'] == '🚨 MISSING'])
        errors = len([r for r in lang_results if r['status'] == '❌'])
        print(f" ✅ {passed}  ⚠️ {warnings}  🚨 {missing}  ❌ {errors}  (캐시 적중 {cache_hits}회)")

    output_file = f"deepl_april_{label}_v2.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n📊 {filename} 완료 — DeepL 사용 {chars_used:,}자, 이슈 {issues_total}개")
    print(f"   결과: {output_file}")

    return chars_used


def main():
    print("\n" + "="*60)
    print("Master Valley v24 — 4월 검증 v2 (옵션 E)")
    print("거장 + 동양화 (단독 + 원클릭)")
    print("="*60)

    try:
        usage = translator.get_usage()
        print(f"\n📊 시작 전 사용량: {usage.character.count:,} / {usage.character.limit:,}")
        print(f"   남은 글자수: {usage.character.limit - usage.character.count:,}")
    except Exception as e:
        print(f"⚠️ 사용량 확인 실패: {e}")

    total_chars = 0
    for filename, label in APRIL_FILES:
        used = verify_file(filename, label)
        total_chars += used

    try:
        usage = translator.get_usage()
        print(f"\n\n📊 최종 사용량: {usage.character.count:,} / {usage.character.limit:,}")
    except Exception:
        pass

    print(f"\n✅ 4월 검증 완료. 약 {total_chars:,}자 사용")
    print("\n결과 파일:")
    for _, label in APRIL_FILES:
        print(f"  deepl_april_{label}_v2.json")
    print("\n→ 5월 1일 이후 verify_may_education_v2.py 실행 (사조)")


if __name__ == '__main__':
    main()
