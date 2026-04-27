"""
Master Valley v24 — ui.js + masterChat.js DeepL 역번역 검증

사용법:
    pip install deepl
    python verify_ui_chat.py YOUR_DEEPL_API_KEY

파일 위치 (기준):
    src/i18n/{ko,ja,es,fr,id,ar,tr,pt,th,zh-TW}/ui.js
    src/i18n/{ko,ja,es,fr,id,ar,tr,pt,th,zh-TW}/masterChat.js

결과:
    deepl_ui_results.json
    deepl_chat_results.json
"""

import sys
import json
import re
import os
import time

try:
    import deepl
except ImportError:
    print("❌ deepl 모듈 필요. 설치: pip install deepl")
    sys.exit(1)

# ========================================
# 설정
# ========================================

if len(sys.argv) < 2:
    print("Usage: python verify_ui_chat.py YOUR_DEEPL_API_KEY")
    print("       또는 환경변수 DEEPL_API_KEY 설정")
    api_key = os.environ.get('DEEPL_API_KEY', '')
    if not api_key:
        sys.exit(1)
else:
    api_key = sys.argv[1]

translator = deepl.Translator(api_key)

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "i18n")
if not os.path.isdir(BASE):
    BASE = "i18n"  # 폴더 이름 다를 수도

LANGS = ['ko', 'ja', 'es', 'fr', 'id', 'ar', 'tr', 'pt', 'th', 'zh-TW']

DEEPL_LANG_MAP = {
    'ko': 'KO', 'ja': 'JA', 'id': 'ID', 'th': 'TH',
    'tr': 'TR', 'ar': 'AR', 'es': 'ES', 'fr': 'FR',
    'pt': 'PT', 'zh-TW': 'ZH',
}

SIMILARITY_THRESHOLD = 0.45  # 45% 이상 = 통과

# ========================================
# 유틸: JS 파일에서 키-값 추출
# ========================================

def extract_strings(filepath):
    """JS 파일에서 모든 'key: \"value\"' 추출 (단일/이중 인용부호, 백틱 모두)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 주석 제거 (간단히)
    content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

    results = {}

    # 일반 키:값
    for m in re.finditer(r"['\"]?(\w[\w\d_-]*)['\"]?\s*:\s*'([^']*)'", content):
        k, v = m.group(1), m.group(2)
        if v.strip() and len(v) > 1:  # 빈 문자열, 너무 짧은 거 (1글자) 제외
            results[k] = v.strip()

    for m in re.finditer(r'["\']?(\w[\w\d_-]*)["\']?\s*:\s*"([^"]*)"', content):
        k, v = m.group(1), m.group(2)
        if v.strip() and len(v) > 1:
            if k not in results:
                results[k] = v.strip()

    for m in re.finditer(r"['\"]?(\w[\w\d_-]*)['\"]?\s*:\s*`([^`]*)`", content):
        k, v = m.group(1), m.group(2)
        if v.strip() and len(v) > 1:
            if k not in results:
                results[k] = v.strip()

    return results


def word_similarity(a, b):
    """단어 단위 유사도 (0~1)"""
    if not a or not b:
        return 0
    a_words = set(re.findall(r'\w+', a.lower()))
    b_words = set(re.findall(r'\w+', b.lower()))
    if not a_words or not b_words:
        return 0
    common = a_words & b_words
    return len(common) / max(len(a_words), len(b_words))


# ========================================
# 검증 로직
# ========================================

def verify_file(filename, label):
    """{filename}.js 검증"""
    print(f"\n{'='*60}")
    print(f"검증 시작: {filename}")
    print('='*60)

    # 1. 영어 원문 추출
    en_path = os.path.join(BASE, 'en', filename)
    if not os.path.isfile(en_path):
        print(f"❌ 영어 파일 없음: {en_path}")
        return None
    en_strings = extract_strings(en_path)
    print(f"📋 영어 키: {len(en_strings)}개")

    all_results = {}
    chars_used = 0
    issues_total = 0

    for lang in LANGS:
        lang_path = os.path.join(BASE, lang, filename)
        if not os.path.isfile(lang_path):
            print(f"⚠️ [{lang}] 파일 없음")
            continue

        lang_strings = extract_strings(lang_path)
        print(f"\n[{lang}] {len(lang_strings)}개 키 검증 중...")

        lang_results = []
        for key, original in en_strings.items():
            if key not in lang_strings:
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': '(MISSING)',
                    'back': '', 'score': 0, 'status': '🚨 MISSING'
                })
                continue

            translated = lang_strings[key]
            chars_used += len(translated)

            # 너무 짧은 문구는 역번역해도 의미 없으니 스킵
            if len(translated) < 3:
                continue

            try:
                back = translator.translate_text(
                    translated,
                    source_lang=DEEPL_LANG_MAP[lang],
                    target_lang='EN-US'
                ).text
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
                # API 부담 줄이기
                time.sleep(0.05)
            except Exception as e:
                lang_results.append({
                    'key': key, 'original': original,
                    'translated': translated, 'back': f'ERROR: {str(e)[:100]}',
                    'score': 0, 'status': '❌'
                })

        all_results[lang] = lang_results
        passed = len([r for r in lang_results if r['status'] == '✅'])
        warnings = len([r for r in lang_results if r['status'] == '⚠️'])
        missing = len([r for r in lang_results if r['status'] == '🚨 MISSING'])
        errors = len([r for r in lang_results if r['status'] == '❌'])
        print(f"  ✅ {passed}  ⚠️ {warnings}  🚨 {missing} (누락)  ❌ {errors}")

    # 결과 저장
    output_file = f"deepl_{label}_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"📊 {filename} 검증 완료")
    print(f"   글자수 사용: 약 {chars_used:,}자")
    print(f"   총 이슈: {issues_total}개")
    print(f"   결과 파일: {output_file}")
    print('='*60)

    return chars_used


# ========================================
# 메인
# ========================================

def main():
    print("\n" + "="*60)
    print("Master Valley v24 — i18n DeepL 검증")
    print("="*60)

    # 사용량 사전 확인
    try:
        usage = translator.get_usage()
        print(f"\n📊 DeepL API 사용량: {usage.character.count:,} / {usage.character.limit:,}")
        print(f"   남은 글자수: {usage.character.limit - usage.character.count:,}")
    except Exception as e:
        print(f"⚠️ 사용량 확인 실패: {e}")

    total_chars = 0

    # 1. ui.js 검증
    used = verify_file('ui.js', 'ui')
    if used:
        total_chars += used

    # 2. masterChat.js 검증
    used = verify_file('masterChat.js', 'chat')
    if used:
        total_chars += used

    # 사용량 사후 확인
    try:
        usage = translator.get_usage()
        print(f"\n\n📊 최종 사용량: {usage.character.count:,} / {usage.character.limit:,}")
    except Exception:
        pass

    print(f"\n✅ 전체 검증 완료. 약 {total_chars:,}자 사용")
    print("결과 파일: deepl_ui_results.json, deepl_chat_results.json")


if __name__ == '__main__':
    main()
