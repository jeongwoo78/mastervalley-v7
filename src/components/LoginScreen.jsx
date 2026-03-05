// LoginScreen.jsx - Master Valley v75
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

const LoginScreen = ({ onLoginSuccess, lang = 'en' }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isNative, setIsNative] = useState(false);

  const t = getUi(lang).login;

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

  return (
    <div style={s.screen}>
      <div style={s.container}>

        {/* Eyebrow */}
        <p style={s.eyebrow}>Master Valley</p>

        {/* Title */}
        <h1 style={s.title}>
          Your beauty,<br />
          captured in<br />
          <em style={s.em}>masterworks</em>
        </h1>

        {/* Sub */}
        <p style={s.sub}>{t.tagline}</p>

        {/* Google */}
        <button style={{ ...s.socialBtn, opacity: loading ? 0.6 : 1 }} onClick={handleGoogleLogin} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.continueWithGoogle}
        </button>

        {/* Apple */}
        <button style={{ ...s.socialBtn, marginBottom: 32, opacity: loading ? 0.6 : 1 }} onClick={handleAppleLogin} disabled={loading}>
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
            style={s.input}
            onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.09)'}
          />
          <input
            type="password" placeholder={t.password} value={password} required minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e)  => e.target.style.borderBottomColor = 'rgba(255,255,255,0.09)'}
          />

          {error && <p style={s.error}>{error}</p>}

          <div style={s.row}>
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
    marginBottom: '40px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '42px',
    fontWeight: 300,
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: '12px',
    fontStyle: 'normal',
  },
  em: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.38)',
  },
  sub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
    marginBottom: '48px',
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
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
    marginBottom: '28px',
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
    fontSize: '13px',
    color: '#fff',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    marginBottom: '20px',
    outline: 'none',
    transition: 'border-color 0.2s',
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
    fontSize: '15px',
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    padding: 0,
  },
  signupLink: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

export default LoginScreen;
