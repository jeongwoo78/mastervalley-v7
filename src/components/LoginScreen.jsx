// LoginScreen.jsx - Master Valley v80 — 22장 종형 가속 캐러셀
// 숫자 기반 파일명, 언어별 라벨, 5사이클 프리빌드
// 1회차 첫 4장(원본+s01~s03) 병렬 프리로드로 검은 화면 방지
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

// 22장 슬라이드 키 (원본1 + 사조11 + 거장7 + 동양화3)
const SLIDE_KEYS = [
  'original',
  's01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11',
  'm01','m02','m03','m04','m05','m06','m07',
  'o01','o02','o03',
];

const KEY_INDEX = {};
SLIDE_KEYS.forEach((k, i) => { KEY_INDEX[k] = i; });

// 언어별 라벨 — 사조·거장은 공통, 동양화만 언어별
const LABELS_COMMON = {
  s01:'Classical Sculpture', s02:'Islamic Miniature', s03:'Renaissance',
  s04:'Baroque', s05:'Rococo', s06:'Neoclassicism', s07:'Impressionism',
  s08:'Post-Impressionism', s09:'Fauvism', s10:'Expressionism', s11:'Modernism',
  m01:'Van Gogh', m02:'Klimt', m03:'Munch', m04:'Matisse',
  m05:'Chagall', m06:'Frida', m07:'Lichtenstein',
};

// s01 자산이 로마 모자이크인 언어 (ja/es/fr/id)
const MOSAIC_S01 = { s01:'Roman Mosaic' };
// s06 자산이 사실주의(마네)인 언어 (pt)
const REALISM_S06 = { s06:'Realism' };

const SLIDE_LABELS = {
  ko: { ...LABELS_COMMON, o01:'Korean', o02:'Chinese', o03:'Japanese' },
  ja: { ...LABELS_COMMON, ...MOSAIC_S01, o01:'Japanese', o02:'Chinese', o03:'Korean' },
  zh: { ...LABELS_COMMON, o01:'Chinese', o02:'Japanese', o03:'Korean' },
  ar: { ...LABELS_COMMON, o01:'Chinese', o02:'Japanese', o03:'Korean' },
};
// 나머지 언어 = 중일한 베이스
['en','es','fr','th','pt','id','tr'].forEach(l => { SLIDE_LABELS[l] = SLIDE_LABELS.zh; });
// es/fr/id는 s01이 모자이크 자산이므로 라벨 덮어쓰기
['es','fr','id'].forEach(l => { SLIDE_LABELS[l] = { ...SLIDE_LABELS[l], ...MOSAIC_S01 }; });
// pt는 s06이 사실주의(마네) 자산이므로 라벨 덮어쓰기
SLIDE_LABELS.pt = { ...SLIDE_LABELS.pt, ...REALISM_S06 };

// 종형 타이밍 (위치 0~21)
// 가속 3장 → 고속 점진하강 → 피크 250ms×3 → 복귀 → 감속 → 여운 1000
const TIMINGS = [
  0,           // [0]  원본 — onLoad+700(1회차) / 1200(2회차~)
  700,         // [1]  가속
  600,         // [2]  가속
  450,         // [3]  가속 끝
  400,         // [4]  고속
  400,         // [5]  고속
  380,         // [6]  고속
  380,         // [7]  고속
  360,         // [8]  ↘
  340,         // [9]  ↘
  300,         // [10] ↘
  280,         // [11] 피크 진입
  250,         // [12] 피크
  250,         // [13] 피크
  250,         // [14] 피크
  280,         // [15] ↗
  340,         // [16] ↗
  400,         // [17] 고속
  500,         // [18] 감속
  650,         // [19] 감속
  850,         // [20] 감속
  1000,        // [21] 여운
];

// ─── 5사이클 프리빌드 순서 (각 21장) ─────────────────────
// 위치 0은 항상 original (코드에서 자동 삽입)
// 같은 아티스트(s08↔m01, s09↔m04, s11↔m07) 최소 5장 간격
// 사이클 경계 중복 없음 (5→1 루프백 포함)

const CYCLE_ORDERS = [
  // 사이클 1: 사조→거장→동양화 (정석) → 마지막 동양화
  ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11',
   'm01','m02','m03','m04','m05','m06','m07',
   'o01','o02','o03'],

  // 사이클 2 → 마지막 Klimt(m02)
  ['s10','o02','s04','s09','s02','m01','s05','m06','s11','s01','m05',
   's03','o03','m04','o01','s08','s06','m07','s07','m03','m02'],

  // 사이클 3 → 마지막 Islamic(s02)
  ['s04','m03','o02','s06','s01','s07','m05','s08','m02','s10','s05',
   'm07','o03','m01','s09','m06','o01','s03','s11','m04','s02'],

  // 사이클 4 → 마지막 Matisse(m04)
  ['s06','m06','s03','s01','m05','s09','m02','o02','m01','s05','m03',
   's10','m07','s04','s08','o03','o01','s02','s07','s11','m04'],

  // 사이클 5 → 마지막 Munch(m03)
  ['s07','s02','m05','m02','o01','o02','s10','s04','m01','s06','s03',
   'm07','s09','s08','m06','o03','s01','s05','m04','s11','m03'],
];

// 사이클 순서: 순서대로×2 → (ABCD+순서대로) 무한반복
// 0,1 → 정석 / 2=A, 3=B, 4=C, 5=D, 6=정석, 7=A, 8=B ...
function getCycleOrder(n) {
  if (n < 2) return 0;
  const PATTERN = [1, 2, 3, 4, 0]; // A,B,C,D,순서대로
  return PATTERN[(n - 2) % 5];
}

const CYCLES = CYCLE_ORDERS.map(keys => [0, ...keys.map(k => KEY_INDEX[k])]);

function normalizeLang(lang) {
  if (!lang) return 'en';
  const base = lang.split('-')[0].toLowerCase();
  return SUPPORTED_LANGS.includes(base) ? base : 'en';
}

function buildSlides(lang) {
  const l = normalizeLang(lang);
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
  const [loadedSlides, setLoadedSlides] = useState(new Set([0])); // 원본만 초기 로드

  const posRef      = useRef(0);
  const cycleRef    = useRef(0);
  const isFirstRef  = useRef(true);
  const timerRef    = useRef(null);

  const allSlides = useMemo(() => buildSlides(lang), [lang]);
  const t = getUi(lang).login;

  function getDelay(position) {
    if (position === 0) return 1200; // 2회차~: 사이클 경계
    return TIMINGS[position];
  }

  // 캐러셀 자동 재생
  useEffect(() => {
    const total = SLIDE_KEYS.length;
    posRef.current = 0;
    cycleRef.current = 0;
    isFirstRef.current = true;
    setDisplaySlide(0);

    function advance() {
      let nextPos = posRef.current + 1;
      if (nextPos >= total) {
        cycleRef.current = cycleRef.current + 1;
        nextPos = 0;
      }
      posRef.current = nextPos;
      const cycleIdx = getCycleOrder(cycleRef.current);
      const slideIdx = CYCLES[cycleIdx][nextPos];
      // 다음 슬라이드도 미리 로드 등록
      const peekPos = nextPos + 1 < total ? nextPos + 1 : 0;
      const peekIdx = CYCLES[cycleIdx][Math.min(peekPos, total - 1)];
      setLoadedSlides(prev => {
        const next = new Set(prev);
        next.add(slideIdx);
        next.add(peekIdx);
        return next;
      });
      setDisplaySlide(slideIdx);
      timerRef.current = setTimeout(advance, getDelay(nextPos));
    }

    // 1회차 첫 4장(원본 + s01~s03) 병렬 프리로드 → 완료 후 700ms 뒤 시작
    // 나머지 18장은 DOM에 src 등록해서 백그라운드 로드
    setLoadedSlides(new Set(Array.from({ length: total }, (_, i) => i)));

    const preloadIndices = CYCLES[0].slice(0, 4); // [0, 1, 2, 3] = original, s01, s02, s03
    const preloadPromises = preloadIndices.map(idx => new Promise((resolve) => {
      const img = new Image();
      img.src = allSlides[idx].src;
      img.onload = resolve;
      img.onerror = resolve; // 에러여도 진행은 계속
    }));

    Promise.all(preloadPromises).then(() => {
      if (!isFirstRef.current) return;
      isFirstRef.current = false;
      timerRef.current = setTimeout(advance, 700);
    });
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
      else                                                 setError(`${t.loginFailed} (${err.code})`);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <div style={s.screen}>
      <div style={{ ...s.container, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>

        <p style={s.eyebrow}>
          <span style={s.eyebrowMain}>Master Valley</span>
          <span style={s.eyebrowSub}>AI Time Travel Studio</span>
        </p>

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
              src={loadedSlides.has(i) ? slide.src : undefined}
              alt={slide.label || 'Your Photo'}
              style={{
                ...s.carouselImg,
                opacity: i === displaySlide ? 1 : 0,
                objectPosition: normalizeLang(lang) === 'th' ? '70% center' : 'center',
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
    padding: '3px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  eyebrow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textTransform: 'uppercase',
    marginBottom: '28px',
    direction: 'ltr',
  },
  eyebrowMain: {
    fontSize: '13px',
    letterSpacing: '2.5px',
    color: 'rgba(138,154,184,0.55)',
  },
  eyebrowDot: {
    color: 'rgba(184,154,90,0.6)',
    margin: '0 2px',
    letterSpacing: '0',
  },
  eyebrowSub: {
    fontSize: '11px',
    color: 'rgba(184,154,90,0.55)',
    letterSpacing: '2.5px',
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
    background: '#0a1a1f',
  },
  carouselImg: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    transition: 'opacity 0.2s ease',
    color: 'transparent',
  },
  carouselLabel: {
    position: 'absolute',
    bottom: '10px', right: '10px',
    fontSize: '13px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 400,
    fontStyle: 'italic',
    letterSpacing: '0.5px',
    color: 'rgba(255,255,255,0.75)',
    background: 'rgba(0,0,0,0.4)',
    padding: '4px 12px',
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
