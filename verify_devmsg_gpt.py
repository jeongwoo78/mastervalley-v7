#!/usr/bin/env python3
"""
verify_devmsg_gpt.py — GPT-4o로 devMsg 번역 검증
사용법: python verify_devmsg_gpt.py YOUR_OPENAI_API_KEY
"""

import sys, json, urllib.request, re, os

API_KEY = sys.argv[1] if len(sys.argv) > 1 else ''
if not API_KEY:
    print("Usage: python verify_devmsg_gpt.py YOUR_OPENAI_API_KEY")
    sys.exit(1)

I18N_DIR = 'src/i18n'
if not os.path.isdir(I18N_DIR):
    I18N_DIR = 'i18n'

KEYS = ['devMsg1','devMsg2','devMsg3','devMsg4','devMsg5','devMsgHi1','devMsgHi2','devMsg6','devMsg7']
LANGS = ['en','ja','es','fr','id','ar','tr','pt','th','zh-TW']

LANG_NAMES = {
    'en': 'English', 'ja': 'Japanese', 'es': 'Spanish', 'fr': 'French',
    'id': 'Indonesian', 'ar': 'Arabic', 'tr': 'Turkish', 'pt': 'Portuguese (BR)',
    'th': 'Thai', 'zh-TW': 'Traditional Chinese'
}

def extract(filepath):
    result = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for key in KEYS:
        pattern = rf"{key}:\s*['\"](.+?)['\"],"
        m = re.search(pattern, content)
        if m:
            result[key] = m.group(1).replace("\\'", "'").replace('\\"', '"')
    return result

def call_gpt(prompt):
    url = 'https://api.openai.com/v1/chat/completions'
    body = json.dumps({
        'model': 'gpt-4o',
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.2,
    }).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}',
    })
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        return data['choices'][0]['message']['content']
    except Exception as e:
        return f'[ERROR: {e}]'

ko = extract(f'{I18N_DIR}/ko/ui.js')

ko_block = '\n'.join([f"  {k}: {ko[k]}" for k in KEYS])

print("=" * 60)
print("  GPT-4o 번역 검증 시작")
print("=" * 60)

for lang in LANGS:
    vals = extract(f'{I18N_DIR}/{lang}/ui.js')
    lang_name = LANG_NAMES[lang]
    
    pairs = '\n'.join([f"  {k}:\n    KO: {ko.get(k,'')}\n    {lang.upper()}: {vals.get(k,'MISSING')}" for k in KEYS])
    
    prompt = f"""You are a professional translator reviewing {lang_name} translations.
Below is a Korean original and its {lang_name} translation for an art history app login screen.

Review each line for:
1. Accuracy (meaning matches Korean)
2. Naturalness (sounds native, not machine-translated)
3. Grammar errors

For each line, respond with:
- ✅ if correct
- ⚠️ [issue] + suggested fix if there's a problem

Be concise. Only flag real issues.

{pairs}"""

    print(f"\n{'='*60}")
    print(f"  {lang.upper()} ({lang_name})")
    print(f"{'='*60}")
    
    result = call_gpt(prompt)
    print(result)

print(f"\n{'='*60}")
print("  검증 완료")
print(f"{'='*60}")
