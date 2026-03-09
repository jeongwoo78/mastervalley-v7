"""
Master Valley — Thai i18n DeepL 역번역 검증 스크립트 v2
실행: python verify_th_deepl_v2.py --api-key YOUR_DEEPL_API_KEY
"""

import requests
import json
import re
import sys
import os
import time
import argparse

DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

def deepl_translate(text, source_lang, target_lang, api_key):
    resp = requests.post(DEEPL_API_URL,
        headers={
            "Authorization": f"DeepL-Auth-Key {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "text": [text],
            "source_lang": source_lang,
            "target_lang": target_lang,
        }
    )
    if resp.status_code == 200:
        return resp.json()["translations"][0]["text"]
    elif resp.status_code == 456:
        print(f"  DeepL 무료 한도 초과!")
        sys.exit(1)
    else:
        print(f"  DeepL 오류: {resp.status_code} {resp.text[:200]}")
        return None

def extract_js_strings(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    results = {}
    for m in re.finditer(r"(\w+)\s*:\s*'([^']*)'", content):
        key, val = m.group(1), m.group(2)
        if val.strip():
            results[key] = val
    for m in re.finditer(r"(\w+)\s*:\s*`([^`]*)`", content):
        key, val = m.group(1), m.group(2)
        if val.strip():
            results[key] = val
    for m in re.finditer(r"'([\w-]+)'\s*:\s*\{([^}]+)\}", content):
        style_key = m.group(1)
        inner = m.group(2)
        for m2 in re.finditer(r"(\w+)\s*:\s*'([^']*)'", inner):
            k, v = m2.group(1), m2.group(2)
            if v.strip():
                results[f"{style_key}.{k}"] = v
        for m2 in re.finditer(r"(\w+)\s*:\s*`([^`]*)`", inner):
            k, v = m2.group(1), m2.group(2)
            if v.strip():
                results[f"{style_key}.{k}"] = v
    return results

def word_overlap_score(text1, text2):
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0
    intersection = words1 & words2
    return len(intersection) / max(len(words1), len(words2))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--api-key', required=True)
    parser.add_argument('--src', default='src/i18n')
    args = parser.parse_args()
    
    api_key = args.api_key
    base = args.src
    
    files_to_check = [
        {'name': 'ui.js', 'th': os.path.join(base,'th','ui.js'), 'en': os.path.join(base,'en','ui.js')},
        {'name': 'oneclickMovements.js', 'th': os.path.join(base,'th','oneclickMovements.js'), 'en': os.path.join(base,'en','oneclickMovements.js')},
    ]
    
    all_results = []
    total_chars = 0
    
    for finfo in files_to_check:
        print(f"\n{'='*70}")
        print(f"  {finfo['name']}")
        print(f"{'='*70}")
        if not os.path.exists(finfo['th']):
            print(f"  파일 없음: {finfo['th']}"); continue
        if not os.path.exists(finfo['en']):
            print(f"  파일 없음: {finfo['en']}"); continue
        
        th_strings = extract_js_strings(finfo['th'])
        en_strings = extract_js_strings(finfo['en'])
        print(f"  Thai: {len(th_strings)}, English: {len(en_strings)}")
        common_keys = set(th_strings.keys()) & set(en_strings.keys())
        print(f"  공통: {len(common_keys)}개\n")
        
        issues = []
        good = warn = fail = 0
        
        for key in sorted(common_keys):
            th_text = th_strings[key]
            en_text = en_strings[key]
            if th_text == en_text:
                good += 1; continue
            if re.match(r'^[\d\s\.\$\+%\-_/\\]*$', th_text):
                good += 1; continue
            
            total_chars += len(th_text)
            back = deepl_translate(th_text, "TH", "EN-US", api_key)
            if back is None:
                fail += 1
                issues.append({'key':key,'status':'API_ERROR','th':th_text[:60],'en_original':en_text[:60],'back':'N/A','score':0})
                continue
            
            score = word_overlap_score(en_text, back)
            if score >= 0.5:
                good += 1; sym = '✅'
            elif score >= 0.25:
                warn += 1; sym = '⚠️'
                issues.append({'key':key,'status':'WARN','th':th_text[:60],'en_original':en_text[:60],'back':back[:60],'score':round(score,2)})
            else:
                fail += 1; sym = '🔴'
                issues.append({'key':key,'status':'FAIL','th':th_text[:60],'en_original':en_text[:60],'back':back[:60],'score':round(score,2)})
            
            print(f"  {sym} {key} ({score:.2f})")
            time.sleep(0.1)
        
        print(f"\n  --- {finfo['name']}: ✅{good} ⚠️{warn} 🔴{fail} ---")
        all_results.append({'file':finfo['name'],'good':good,'warn':warn,'fail':fail,'issues':issues})
    
    print(f"\n{'='*70}")
    print(f"  총 글자수: ~{total_chars:,} / 500,000")
    for r in all_results:
        print(f"  {r['file']}: OK={r['good']} WARN={r['warn']} FAIL={r['fail']}")
        for i in r['issues']:
            print(f"    [{i['status']}] {i['key']} score={i['score']}")
            print(f"      EN: {i['en_original']}")
            print(f"      Back: {i['back']}\n")
    
    with open('th_deepl_verify_result.json','w',encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"  저장: th_deepl_verify_result.json")

if __name__ == '__main__':
    main()
