"""
Master Valley - DeepL 역번역 검증 스크립트
실행: python3 verify_translations.py
필요: pip install deepl
"""

import deepl
import json

API_KEY = "81a8d44f-2824-48c5-89f0-b19b4c9dfd64:fx"
translator = deepl.Translator(API_KEY)

# 영어 원문
originals = {
    'tagline':          'Your beauty, captured in masterworks',
    'sub':              'Masters across centuries. One photo.',
    'logIn':            'Log In',
    'signUp':           'Sign Up',
    'pleaseWait':       'Please wait...',
    'loginCancelled':   'Login cancelled',
    'networkError':     'Network error. Please try again.',
    'googleFailed':     'Google login failed',
    'appleFailed':      'Apple login failed',
    'emailInUse':       'Email already in use',
    'invalidEmail':     'Invalid email format',
    'weakPassword':     'Password must be at least 6 characters',
    'wrongCredentials': 'Invalid email or password',
    'loginFailed':      'Login failed. Please try again.',
}

# 각 언어 번역본
translations = {
    'ko': ['당신의 아름다움을 명화로 남기세요','세기의 거장이 당신을 담습니다','로그인','회원가입','잠시만요...','로그인 취소됨','네트워크 오류. 다시 시도해주세요.','Google 로그인 실패','Apple 로그인 실패','이미 사용 중인 이메일','올바르지 않은 이메일 형식','비밀번호는 6자 이상이어야 합니다','이메일 또는 비밀번호가 올바르지 않습니다','로그인 실패. 다시 시도해주세요.'],
    'ja': ['あなたの美しさを、名画に','巨匠たちが、あなたを描く','ログイン','新規登録','お待ちください...','ログインがキャンセルされました','ネットワークエラー。再試行してください。','Googleログインに失敗しました','Appleログインに失敗しました','すでに使用中のメールアドレスです','メールアドレスの形式が正しくありません','パスワードは6文字以上にしてください','メールアドレスまたはパスワードが正しくありません','ログインに失敗しました。再試行してください。'],
    'id': ['Kecantikanmu, dalam sebuah mahakarya','Para maestro lintas abad. Satu foto.','Masuk','Daftar','Harap tunggu...','Login dibatalkan','Kesalahan jaringan. Coba lagi.','Login Google gagal','Login Apple gagal','Email sudah digunakan','Format email tidak valid','Kata sandi minimal 6 karakter','Email atau kata sandi salah','Login gagal. Coba lagi.'],
    'th': ['ความงามของคุณ ในผลงานชิ้นเอก','ปรมาจารย์ข้ามยุคสมัย ภาพเดียว','เข้าสู่ระบบ','สมัครสมาชิก','กรุณารอสักครู่...','ยกเลิกการเข้าสู่ระบบ','เกิดข้อผิดพลาดเครือข่าย กรุณาลองใหม่','เข้าสู่ระบบด้วย Google ล้มเหลว','เข้าสู่ระบบด้วย Apple ล้มเหลว','อีเมลนี้ถูกใช้งานแล้ว','รูปแบบอีเมลไม่ถูกต้อง','รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร','อีเมลหรือรหัสผ่านไม่ถูกต้อง','เข้าสู่ระบบล้มเหลว กรุณาลองใหม่'],
    'tr': ['Güzelliğin, bir başyapıtta','Yüzyılların ustaları. Tek bir fotoğraf.','Giriş Yap','Kayıt Ol','Lütfen bekleyin...','Giriş iptal edildi','Ağ hatası. Lütfen tekrar deneyin.','Google girişi başarısız','Apple girişi başarısız','Bu e-posta zaten kullanımda','Geçersiz e-posta formatı','Şifre en az 6 karakter olmalıdır','E-posta veya şifre hatalı','Giriş başarısız. Lütfen tekrar deneyin.'],
    'ar': ['جمالك، في لوحة فنية خالدة','عباقرة عبر القرون. صورة واحدة.','تسجيل الدخول','إنشاء حساب','يرجى الانتظار...','تم إلغاء تسجيل الدخول','خطأ في الشبكة. يرجى المحاولة مجددًا.','فشل تسجيل الدخول بـ Google','فشل تسجيل الدخول بـ Apple','البريد الإلكتروني مستخدم بالفعل','صيغة البريد الإلكتروني غير صحيحة','يجب أن تكون كلمة المرور 6 أحرف على الأقل','البريد الإلكتروني أو كلمة المرور غير صحيحة','فشل تسجيل الدخول. يرجى المحاولة مجددًا.'],
    'es': ['Tu belleza, en una obra maestra','Maestros a través de los siglos. Una foto.','Iniciar sesión','Registrarse','Por favor espera...','Inicio de sesión cancelado','Error de red. Inténtalo de nuevo.','Error al iniciar con Google','Error al iniciar con Apple','El correo ya está en uso','Formato de correo no válido','La contraseña debe tener al menos 6 caracteres','Correo o contraseña incorrectos','Inicio de sesión fallido. Inténtalo de nuevo.'],
    'fr': ["Ta beauté, dans un chef-d'œuvre",'Les maîtres à travers les siècles. Une photo.','Se connecter',"S'inscrire",'Veuillez patienter...','Connexion annulée','Erreur réseau. Veuillez réessayer.','Connexion Google échouée','Connexion Apple échouée','E-mail déjà utilisé',"Format d'e-mail invalide",'Le mot de passe doit contenir au moins 6 caractères','E-mail ou mot de passe incorrect','Connexion échouée. Veuillez réessayer.'],
    'pt': ['Sua beleza, em uma obra-prima','Mestres através dos séculos. Uma foto.','Entrar','Cadastrar','Aguarde...','Login cancelado','Erro de rede. Tente novamente.','Falha no login com Google','Falha no login com Apple','E-mail já está em uso','Formato de e-mail inválido','A senha deve ter pelo menos 6 caracteres','E-mail ou senha incorretos','Falha no login. Tente novamente.'],
    'zh-TW': ['您的美麗，在傑作中永恆','跨越世紀的大師。一張照片。','登入','註冊','請稍候...','登入已取消','網路錯誤，請再試一次。','Google 登入失敗','Apple 登入失敗','此電子郵件已被使用','電子郵件格式無效','密碼至少需要 6 個字元','電子郵件或密碼錯誤','登入失敗，請再試一次。'],
}

deepl_lang_map = {
    'ko': 'KO', 'ja': 'JA', 'id': 'ID', 'th': 'TH',
    'tr': 'TR', 'ar': 'AR', 'es': 'ES', 'fr': 'FR',
    'pt': 'PT', 'zh-TW': 'ZH',
}

keys = list(originals.keys())
all_results = {}
issues_total = 0

print("\n🔍 DeepL 역번역 검증 시작...\n")

for lang, texts in translations.items():
    print(f"▶ {lang} 검증 중...")
    lang_results = []
    for i, text in enumerate(texts):
        key = keys[i]
        original = originals[key]
        try:
            back = translator.translate_text(
                text,
                source_lang=deepl_lang_map[lang],
                target_lang='EN-US'
            ).text
            orig_words = set(original.lower().replace('.','').replace(',','').replace('...','').split())
            back_words = set(back.lower().replace('.','').replace(',','').replace('...','').split())
            score = len(orig_words & back_words) / max(len(orig_words), 1)
            status = '✅' if score >= 0.4 else '⚠️'
            lang_results.append({
                'key': key, 'original': original,
                'translated': text, 'back': back,
                'score': round(score, 2), 'status': status
            })
        except Exception as e:
            lang_results.append({
                'key': key, 'original': original,
                'translated': text, 'back': f'ERROR: {e}',
                'score': 0, 'status': '❌'
            })
    all_results[lang] = lang_results

# 결과 저장
with open('deepl_results.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, ensure_ascii=False, indent=2)

# 요약 출력
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
