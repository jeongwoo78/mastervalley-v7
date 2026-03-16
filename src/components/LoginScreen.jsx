// LoginScreen.jsx - Master Valley v76
import React, { useState, useEffect } from 'react';
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

// Carousel images — public/login/ 폴더에 배치
const CAROUSEL_SLIDES = [
  { src: '/login/original.jpg', label: 'Your Photo' },
  { src: '/login/chagall.jpg', label: 'Chagall · Modernism' },
  { src: '/login/islamic.jpg', label: 'Islamic Miniature · Medieval' },
  { src: '/login/vangogh.jpg', label: 'Van Gogh · Post-Impressionism' },
  { src: '/login/watteau.jpg', label: 'Watteau · Rococo' },
  { src: '/login/matisse.jpg', label: 'Matisse · Fauvism' },
];

const LoginScreen = ({ onLoginSuccess, lang = 'en' }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const t = getUi(lang).login;

  // Carousel auto-play — 원본 2초, 스타일 2.5초
  useEffect(() => {
    const delay = currentSlide === 0 ? 2000 : 2500;
    const timer = setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentSlide]);

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
          {CAROUSEL_SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.label}
              style={{
                ...s.carouselImg,
                opacity: i === currentSlide ? 1 : 0,
              }}
            />
          ))}
          <span style={s.carouselLabel}>
            {CAROUSEL_SLIDES[currentSlide].label}
          </span>
          <div style={s.carouselDots}>
            {CAROUSEL_SLIDES.map((_, i) => (
              <span
                key={i}
                style={{
                  ...s.dot,
                  background: i === currentSlide
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
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
            onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.09)'}
          />
          <div style={s.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'} placeholder={t.password} value={password} required minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...s.input, textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }}
              onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.3)'}
              onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.09)'}
            />
            <span
              style={{ ...s.eyeIcon, [isRTL ? 'left' : 'right']: '4px' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const s = {
  screen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0d0d',
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
    background: 'linear-gradient(135deg, #a855f7 0%, #b77df7 36%, #daa520 50%, #e88aaf 64%, #f472b6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    direction: 'ltr',
  },
  em: {
    fontStyle: 'italic',
  },

  // Carousel
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
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    transition: 'opacity 1s ease',
  },
  carouselLabel: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    background: 'rgba(0,0,0,0.45)',
    padding: '3px 10px',
    borderRadius: '4px',
    backdropFilter: 'blur(4px)',
    zIndex: 2,
    direction: 'ltr',
  },
  carouselDots: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    gap: '4px',
    zIndex: 2,
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    transition: 'background 0.3s',
  },

  // Developer message
  devMsg: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '16px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontWeight: 500,
  },
  devMsgHi: {
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 600,
  },

  socialBtn: {
    width: '100%',
    height: '50px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
    marginBottom: '10px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    height: '44px',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.09)',
    padding: '0 4px',
    fontSize: '14px',
    color: '#fff',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    marginBottom: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  passwordWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: '12px',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    fontSize: '12px',
    color: 'rgba(239,68,68,0.9)',
    marginBottom: '12px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px',
  },
  submitBtn: {
    background: 'transparent',
    border: 'none',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '14px',
    fontWeight: 400,
    color: '#fff',
    cursor: 'pointer',
    padding: 0,
  },
  signupLink: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

export default LoginScreen;
