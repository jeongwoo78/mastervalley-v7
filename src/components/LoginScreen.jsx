// LoginScreen.jsx - Master Valley v79 — 26장 종형 가속 캐러셀
// 5사이클 프리빌드 순서, useRef 타이머 체인, dots 제거
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

// 26장 슬라이드 키
const SLIDE_KEYS = [
  'original',
  // 사조 11 (시간순)
  'ancient', 'medieval', 'renaissance', 'baroque', 'rococo',
  'neoclassicism', 'impressionism', 'postimpressionism', 'fauvism',
  'expressionism', 'modernism',
  // 거장 7 (출생순)
  'vangogh', 'klimt', 'munch', 'matisse', 'chagall', 'frida', 'lichtenstein',
  // 중복 아티스트 (다른 변환 결과)
  'klimt2', 'munch2', 'matisse2', 'chagall2',
  // 동양화 (ko=한중일, ja=일중한, zh/나머지=중일한)
  'oriental1', 'oriental2', 'oriental3',
];

// 키 → 인덱스 매핑 (사이클 빌드용)
const KEY_INDEX = {};
SLIDE_KEYS.forEach((k, i) => { KEY_INDEX[k] = i; });

const LABELS = {
  original: null,
  ancient: 'Ancient Greece · Rome', medieval: 'Islamic Miniature',
  renaissance: 'Renaissance', baroque: 'Baroque', rococo: 'Rococo',
  neoclassicism: 'Neoclassicism', impressionism: 'Impressionism',
  postimpressionism: 'Post-Impressionism', fauvism: 'Fauvism',
  expressionism: 'Expressionism', modernism: 'Modernism',
  vangogh: 'Van Gogh', klimt: 'Klimt', munch: 'Munch',
  matisse: 'Matisse', chagall: 'Chagall', frida: 'Frida',
  lichtenstein: 'Lichtenstein',
  klimt2: 'Klimt', munch2: 'Munch', matisse2: 'Matisse', chagall2: 'Chagall',
  oriental1: 'Korea', oriental2: 'China', oriental3: 'Japan',
};

// 종형 타이밍 커브 (위치 0~25)
// 가속 6 → 최고속 15 → 감속 4
// 위치 0(원본)은 getDelay()에서 별도 처리
const TIMINGS = [
  0,           // [0]  원본 — 최초 1500 / 이후 1000
  1100,        // [1]  가속 시작
  800,         // [2]
  550,         // [3]
  400,         // [4]
  320,         // [5]
  280,         // [6]  가속 끝
  250, 250, 250, 250, 250,  // [7-11]   최고속
  250, 250, 250, 250, 250,  // [12-16]
  250, 250, 250, 250, 250,  // [17-21]
  300,         // [22] 감속 시작
  450,         // [23]
  700,         // [24]
  1000,        // [25] 여운
];

// ─── 5사이클 프리빌드 순서 ────────────────────────────────
// 설계 원칙:
//   - 위치 0은 항상 original (코드에서 자동 삽입)
//   - 같은 아티스트 최소 5장 이상 간격
//   - 감속 여운(22~25) 매 사이클 다른 분위기
//   - 사이클 경계 중복 없음 (N의 마지막 ≠ N+1의 첫 번째)
//   - 5→1 루프백도 안전

const CYCLE_ORDERS = [
  // 사이클 1: 사조(시간순) → 거장(출생순) → 중복 → 동양화(한중일) — 첫인상 내러티브
  ['ancient','medieval','renaissance','baroque','rococo','neoclassicism','impressionism',
   'postimpressionism','fauvism','expressionism','modernism',
   'vangogh','klimt','munch','matisse','chagall','frida','lichtenstein',
   'klimt2','munch2','matisse2','chagall2',
   'oriental1','oriental2','oriental3'],

  // 사이클 2: 동양화 분산(4,10,16) / 감속=클림트②·리히텐★·반고흐★·프리다★
  ['expressionism','modernism','baroque','oriental2','postimpressionism','klimt','rococo',
   'munch2','matisse','oriental3','ancient','chagall','renaissance','fauvism',
   'neoclassicism','oriental1','impressionism','chagall2','medieval','munch',
   'matisse2','klimt2','lichtenstein','vangogh','frida'],

  // 사이클 3: 동양화 분산(2,12,17) / 감속=표현주의·후기인상·샤갈★·리히텐★
  ['baroque','oriental2','munch','neoclassicism','chagall2','impressionism','klimt2',
   'fauvism','ancient','modernism','rococo','oriental1','klimt','renaissance',
   'matisse2','medieval','oriental3','vangogh','frida','munch2',
   'matisse','expressionism','postimpressionism','chagall','lichtenstein'],

  // 사이클 4: 동양화 분산(2,11,18) / 감속=클림트★·후기인상·프리다★·모더니즘
  ['neoclassicism','oriental2','lichtenstein','munch2','renaissance','chagall','ancient',
   'fauvism','klimt2','munch','oriental3','vangogh','rococo','impressionism',
   'chagall2','matisse2','baroque','oriental1','expressionism','medieval',
   'matisse','klimt','postimpressionism','frida','modernism'],

  // 사이클 5: 동양화 분산(4,8,20) / 감속=반고흐★·야수파·클림트②·표현주의
  ['impressionism','chagall2','medieval','oriental1','matisse','munch2','rococo',
   'oriental3','baroque','lichtenstein','renaissance','matisse2','chagall',
   'neoclassicism','klimt','munch','postimpressionism','ancient','modernism',
   'oriental2','frida','vangogh','fauvism','klimt2','expressionism'],
];

// 키 배열 → 인덱스 배열 변환 (original=0 선두 삽입)
const CYCLES = CYCLE_ORDERS.map(keys => [0, ...keys.map(k => KEY_INDEX[k])]);

function buildSlides(lang) {
  const l = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  return SLIDE_KEYS.map(k => ({
    key: k,
    src: `/login/${l}/${k}.jpg`,
    label: LABELS[k],
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

  // 캐러셀 — 렌더 트리거용 state는 이것 하나만
  const [displaySlide, setDisplaySlide] = useState(0);

  // 타이머 체인 전부 ref로 관리
  const posRef      = useRef(0);      // 현재 위치 (0~25)
  const cycleRef    = useRef(0);      // 현재 사이클 (0~4)
  const isFirstRef  = useRef(true);   // 최초 1회 원본 1500ms용
  const timerRef    = useRef(null);

  const allSlides = useMemo(() => buildSlides(lang), [lang]);
  const t = getUi(lang).login;

  // 위치 기반 딜레이
  function getDelay(position) {
    if (position === 0) {
      if (isFirstRef.current) { isFirstRef.current = false; return 1500; }
      return 1000;
    }
    return TIMINGS[position];
  }

  // 캐러셀 자동 재생 — 자기 완결 타이머 체인
  useEffect(() => {
    const total = SLIDE_KEYS.length; // 26

    // StrictMode 대응: 초기화
    posRef.current = 0;
    cycleRef.current = 0;
    isFirstRef.current = true;
    setDisplaySlide(0);

    function advance() {
      let nextPos = posRef.current + 1;

      if (nextPos >= total) {
        // 사이클 완료 → 다음 사이클
        cycleRef.current = (cycleRef.current + 1) % CYCLES.length;
        nextPos = 0;
      }

      posRef.current = nextPos;
      const slideIdx = CYCLES[cycleRef.current][nextPos];
      setDisplaySlide(slideIdx);
      timerRef.current = setTimeout(advance, getDelay(nextPos));
    }

    // 첫 슬라이드(원본) 표시 후 딜레이 → 시작
    timerRef.current = setTimeout(advance, getDelay(0));

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []); // 빈 deps — 타이머 체인이 자체 관리

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

        {/* Eyebrow */}
        <p style={s.eyebrow}>Master Valley</p>

        {/* Title */}
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

        {/* Divider */}
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
    transition: 'opacity 0.25s ease',
  },
  carouselLabel: {
    position: 'absolute',
    bottom: '10px', left: '10px',
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
