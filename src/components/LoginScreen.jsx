// LoginScreen.jsx - Master Valley v79 — 26장 종형 가속 캐러셀
// 숫자 기반 파일명, 언어별 라벨, 5사이클 프리빌드, onLoad 기반 시작
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import { Capacitor } from '@capacitor/core';
import { getUi } from '../i18n';

// ─── 캐러셀 설정 ─────────────────────────────────────────
const SUPPORTED_LANGS = ['ko','en','ja','es','fr','ar','th','zh','pt','id','tr'];

const SLIDE_KEYS = [
  'original',
  's01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11',
  'm01','m02','m03','m04','m05','m06','m07',
  'e01','e02','e03','e04',
  'o01','o02','o03',
];

const KEY_INDEX = {};
SLIDE_KEYS.forEach((k, i) => { KEY_INDEX[k] = i; });

// 언어별 라벨 테이블
const SLIDE_LABELS = {
  ko: {
    s01:'Classical Sculpture', s02:'Islamic Miniature', s03:'Renaissance',
    s04:'Baroque', s05:'Rococo', s06:'Neoclassicism', s07:'Impressionism',
    s08:'Post-Impressionism', s09:'Fauvism', s10:'Expressionism', s11:'Modernism',
    m01:'Van Gogh', m02:'Klimt', m03:'Munch', m04:'Matisse',
    m05:'Chagall', m06:'Frida', m07:'Lichtenstein',
    e01:'Klimt', e02:'Munch', e03:'Matisse', e04:'Chagall',
    o01:'Korean · 韓', o02:'Chinese · 中', o03:'Japanese · 日',
  },
  ar: {
    s01:'Classical Sculpture', s02:'Islamic Miniature', s03:'Renaissance',
    s04:'Baroque', s05:'Rococo', s06:'Neoclassicism', s07:'Impressionism',
    s08:'Post-Impressionism', s09:'Fauvism', s10:'Expressionism', s11:'Modernism',
    m01:'Van Gogh', m02:'Klimt', m03:'Munch', m04:'Matisse',
    m05:'Chagall', m06:'Frida', m07:'Lichtenstein',
    e01:'Klimt', e02:'Munch', e03:'Matisse', e04:'Picasso',
    o01:'Chinese · 中', o02:'Japanese · 日', o03:'Korean · 韓',
  },
  ja: {
    s01:'Classical Sculpture', s02:'Islamic Miniature', s03:'Renaissance',
    s04:'Baroque', s05:'Rococo', s06:'Neoclassicism', s07:'Impressionism',
    s08:'Post-Impressionism', s09:'Fauvism', s10:'Expressionism', s11:'Modernism',
    m01:'Van Gogh', m02:'Klimt', m03:'Munch', m04:'Matisse',
    m05:'Chagall', m06:'Frida', m07:'Lichtenstein',
    e01:'Klimt', e02:'Munch', e03:'Matisse', e04:'Chagall',
    o01:'Japanese · 日', o02:'Chinese · 中', o03:'Korean · 韓',
  },
  zh: {
    s01:'Classical Sculpture', s02:'Islamic Miniature', s03:'Renaissance',
    s04:'Baroque', s05:'Rococo', s06:'Neoclassicism', s07:'Impressionism',
    s08:'Post-Impressionism', s09:'Fauvism', s10:'Expressionism', s11:'Modernism',
    m01:'Van Gogh', m02:'Klimt', m03:'Munch', m04:'Matisse',
    m05:'Chagall', m06:'Frida', m07:'Lichtenstein',
    e01:'Klimt', e02:'Munch', e03:'Matisse', e04:'Chagall',
    o01:'Chinese · 中', o02:'Japanese · 日', o03:'Korean · 韓',
  },
};
SLIDE_LABELS.fr = {
  ...SLIDE_LABELS.zh,
  e01:'Van Gogh', e02:'Matisse', e03:'Chagall', e04:'Van Gogh',
};
['en','es','th','pt','id','tr'].forEach(l => { SLIDE_LABELS[l] = SLIDE_LABELS.zh; });

// 일방향 가속 타이밍 — 끝으로 갈수록 빨라짐 → 원본 1500ms "탁" 리셋
// 사이클 경계 극명: 최고속 250ms → 원본 1500ms (6배 점프)
const TIMINGS = [
  0,           // [0]  원본 — onLoad+1000(1회차) / 1500(2회차~)
  1000,        // [1]  느린 시작
  800,         // [2]
  650,         // [3]  가속
  550,         // [4]
  450,         // [5]
  400,         // [6]  고속
  400,         // [7]
  400,         // [8]
  400,         // [9]
  380,         // [10]
  360,         // [11]
  340,         // [12]
  330,         // [13] 빨라진다
  320,         // [14]
  310,         // [15]
  300,         // [16] 피크
  300,         // [17]
  300,         // [18]
  280,         // [19] 더 빠름
  280,         // [20]
  270,         // [21]
  270,         // [22]
  260,         // [23]
  260,         // [24]
  250,         // [25] 최고속 → 끝 → 원본 "탁"
];

// ─── 5사이클 프리빌드 순서 ────────────────────────────────
const CYCLE_ORDERS = [
  // 사이클 1: 사조→거장→엑스트라→동양화 (정석)
  ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11',
   'm01','m02','m03','m04','m05','m06','m07',
   'e01','e02','e03','e04',
   'o01','o02','o03'],

  // 사이클 2
  ['s10','m02','s04','s09','s02','m01','s05',
   'e02','m06','s11','s01','m05','s03','e01',
   'o03','m04','o01','s08','s06','e04',
   's07','e03','m07','m03','o02'],

  // 사이클 3
  ['s04','o02','m03','s06','e04','s07','e01',
   's08','s01','m04','s05','s10','m07',
   's02','m01','m06','m02','s09','e02','o01',
   's11','m05','s03','e03','o03'],

  // 사이클 4
  ['s06','m06','m07','e02','s03','m05','s01',
   's09','m02','o02','m01','m03','s05','e03',
   's10','e01','s08','o03','e04','s04',
   's11','m04','s02','s07','o01'],

  // 사이클 5
  ['s07','e04','s02','m02','s09','o01','m03',
   's10','s04','m07','s03','m01','m05',
   's06','e01','m04','e02','s05','o03','s01',
   's08','e03','m06','s11','o02'],
];

const CYCLES = CYCLE_ORDERS.map(keys => [0, ...keys.map(k => KEY_INDEX[k])]);

function buildSlides(lang) {
  const l = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  const labels = SLIDE_LABELS[l] || SLIDE_LABELS.en;
  return SLIDE_KEYS.map(k => ({
    key: k,
    src: `/login/${l}/${k}.jpg`,
    label: labels[k] || null,
  }));
}

// ─── 컴포넌트 ─────────────────────────────────────────────
const LoginScreen = ({ onLoginSuccess, lang = 'en' }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [displaySlide, setDisplaySlide] = useState(0);

  const posRef      = useRef(0);
  const cycleRef    = useRef(0);
  const isFirstRef  = useRef(true);
  const timerRef    = useRef(null);

  const allSlides = useMemo(() => buildSlides(lang), [lang]);
  const t = getUi(lang).login;

  function getDelay(position) {
    if (position === 0) return 1500; // 2회차~: 사이클 경계 명확
    return TIMINGS[position];
  }

  // 캐러셀 자동 재생 — 원본 이미지 로드 후 시작
  useEffect(() => {
    const total = SLIDE_KEYS.length;
    posRef.current = 0;
    cycleRef.current = 0;
    isFirstRef.current = true;
    setDisplaySlide(0);

    function advance() {
      let nextPos = posRef.current + 1;
      if (nextPos >= total) {
        cycleRef.current = (cycleRef.current + 1) % CYCLES.length;
        nextPos = 0;
      }
      posRef.current = nextPos;
      const slideIdx = CYCLES[cycleRef.current][nextPos];
      setDisplaySlide(slideIdx);
      timerRef.current = setTimeout(advance, getDelay(nextPos));
    }

    // 원본 이미지 프리로드 → onLoad + 1000ms 후 시작 (1회차)
    const img = new Image();
    img.src = allSlides[0].src;
    img.onload = () => {
      if (!isFirstRef.current) return; // 이미 시작됨 (StrictMode 대응)
      isFirstRef.current = false;
      timerRef.current = setTimeout(advance, 1000);
    };
    // 로드 실패 대비 — 3초 후 강제 시작
    const fallback = setTimeout(() => {
      if (isFirstRef.current) {
        isFirstRef.current = false;
        timerRef.current = setTimeout(advance, 0);
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fallback);
    };
  }, []);

  // Google Auth 초기화
  useEffect(() => {
    const initGoogleAuth = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);
      if (native) {
        try {
          const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
          await GoogleAuth.initialize({
            clientId: '539777702177-kk0l660744km8e2lc4l171i8ida8a8af.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
        } catch (err) {
          console.log('GoogleAuth init error:', err);
        }
      }
    };
    initGoogleAuth();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (isNative) {
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        onLoginSuccess(result.user);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        onLoginSuccess(result.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
      if (err.message?.includes('popup_closed'))  setError(t.loginCancelled);
      else if (err.message?.includes('network'))  setError(t.networkError);
      else                                         setError(t.googleFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, appleProvider);
      onLoginSuccess(result.user);
    } catch (err) {
      console.error('Apple login error:', err);
      setError(t.appleFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(result.user);
    } catch (err) {
      console.error('Email auth error:', err);
      if      (err.code === 'auth/email-already-in-use')  setError(t.emailInUse);
      else if (err.code === 'auth/invalid-email')          setError(t.invalidEmail);
      else if (err.code === 'auth/weak-password')          setError(t.weakPassword);
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password')
                                                           setError(t.wrongCredentials);
      else                                                 setError(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <div style={s.screen}>
      <div style={{ ...s.container, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>

        <p style={s.eyebrow}>Master Valley</p>

        <h1 style={s.title}>
          One photo.<br />
          2800 years.<br />
          <em style={s.em}>One click.</em>
        </h1>

        {/* Carousel */}
        <div style={s.carouselWrap}>
          {allSlides.map((slide, i) => (
            <img
              key={slide.key}
              src={slide.src}
              alt={slide.label || 'Your Photo'}
              style={{
                ...s.carouselImg,
                opacity: i === displaySlide ? 1 : 0,
              }}
            />
          ))}
          <span style={s.carouselLabel}>
            {allSlides[displaySlide]?.label || t.yourPhoto || 'Your Photo'}
          </span>
        </div>

        {/* Developer message */}
        <p style={{ ...s.devMsg, textAlign: isRTL ? 'right' : 'left' }}>
          {t.devMsg1}<br />
          {t.devMsg2}<br />
          {t.devMsg3}<br />
          {t.devMsg4}<br />
          {t.devMsg5}<br />
          <span style={s.devMsgHi}>{t.devMsgHi1}<br />
          {t.devMsgHi2}</span><br />
          {t.devMsg6}<br />
          {t.devMsg7}
          <span style={s.devMsgSign}>{t.devMsgSign}</span>
        </p>

        {/* Google */}
        <button style={{ ...s.socialBtn, flexDirection: isRTL ? 'row-reverse' : 'row', opacity: loading ? 0.6 : 1 }} onClick={handleGoogleLogin} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.continueWithGoogle}
        </button>

        {/* Apple */}
        <button style={{ ...s.socialBtn, flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 8, opacity: loading ? 0.6 : 1 }} onClick={handleAppleLogin} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          {t.continueWithApple}
        </button>

        <div style={s.divider} />

        {/* Form */}
        <form onSubmit={handleEmailSubmit} style={s.form}>
          <input
            type="email" placeholder={t.email} value={email} required
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...s.input, textAlign: isRTL ? 'right' : 'left' }}
            onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
            onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.08)'}
          />
          <div style={s.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'} placeholder={t.password} value={password} required minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...s.input, textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }}
              onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
              onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.08)'}
            />
            <span
              style={{ ...s.eyeIcon, [isRTL ? 'left' : 'right']: '4px' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </span>
          </div>

          {error && <p style={{ ...s.error, textAlign: isRTL ? 'right' : 'left' }}>{error}</p>}

          <div style={{ ...s.row, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }}>
              {loading ? t.pleaseWait : (isSignUp ? t.signUp : t.logIn)}
            </button>
            <span style={s.signupLink} onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
              {isSignUp ? t.logIn : t.signUp}
            </span>
          </div>
        </form>

      </div>
    </div>
  );
};

// ─── 스타일 ───────────────────────────────────────────────
const s = {
  screen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a1a1f',
    padding: '20px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '340px',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontSize: '10px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.2)',
    marginBottom: '28px',
    direction: 'ltr',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '42px',
    fontWeight: 300,
    lineHeight: 1.1,
    marginBottom: '16px',
    fontStyle: 'normal',
    background: 'linear-gradient(135deg, #6a9a9a 0%, #6a9a9a 25%, #ccaa62 42%, #ccaa62 55%, #c87098 65%, #c87098 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    direction: 'ltr',
  },
  em: { fontStyle: 'italic' },

  carouselWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '3/4',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  carouselImg: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    transition: 'opacity 0.2s ease',
  },
  carouselLabel: {
    position: 'absolute',
    bottom: '10px', right: '10px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    background: 'rgba(0,0,0,0.45)',
    padding: '3px 10px',
    borderRadius: '4px',
    backdropFilter: 'blur(4px)',
    zIndex: 2,
    direction: 'ltr',
  },

  devMsg: {
    fontSize: '14px', lineHeight: 1.7,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '16px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontWeight: 500,
  },
  devMsgHi: { color: 'rgba(150,100,200,0.75)', fontWeight: 600 },
  devMsgSign: {
    color: 'rgba(255,255,255,0.2)', fontWeight: 500, fontStyle: 'italic',
    display: 'block', textAlign: 'right', marginTop: '8px',
  },

  socialBtn: {
    width: '100%', height: '50px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '0 16px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '14px', color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', marginBottom: '8px',
  },
  divider: {
    width: '100%', height: '1px',
    background: 'rgba(255,255,255,0.08)',
    marginBottom: '10px',
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column' },
  input: {
    width: '100%', height: '44px',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 4px', fontSize: '14px', color: '#fff',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    marginBottom: '12px', outline: 'none',
    transition: 'border-color 0.2s',
  },
  passwordWrap: { position: 'relative', width: '100%', marginBottom: '12px' },
  eyeIcon: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    cursor: 'pointer', padding: '4px',
    display: 'flex', alignItems: 'center',
  },
  error: { fontSize: '12px', color: 'rgba(239,68,68,0.9)', marginBottom: '12px' },
  row: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginTop: '6px',
  },
  submitBtn: {
    background: 'transparent', border: 'none',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '14px', fontWeight: 400, color: '#fff',
    cursor: 'pointer', padding: 0,
  },
  signupLink: {
    fontSize: '13px', color: 'rgba(255,255,255,0.2)',
    cursor: 'pointer', textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

export default LoginScreen;
