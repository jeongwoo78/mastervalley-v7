// DeleteAccountModal.jsx - 계정 삭제 모달 (BLOCKER #48)
// 1단계 경고 → 2단계 재인증 → Cloud Function 호출 → 완료
// 디자인: D3 톤 (인라인, 화면 아래 2/3, sage 액센트)

import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  OAuthProvider,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import { getUi } from '../i18n';

// 갤러리 IndexedDB 통째 삭제 (GalleryScreen의 DB_NAME과 동일)
const GALLERY_DB_NAME = 'PicoArtGallery';
const deleteGalleryDB = () => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(GALLERY_DB_NAME);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
};

const DeleteAccountModal = ({ user, lang = 'en', onCancel, onComplete }) => {
  const t = getUi(lang).deleteAccount;
  const tCommon = getUi(lang).common;
  const isRTL = lang === 'ar';

  const [step, setStep] = useState('warning');  // 'warning' | 'reauth' | 'deleting'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 가입 방식 자동 감지
  const providerId = user?.providerData?.[0]?.providerId || 'password';
  const isGoogle = providerId === 'google.com';
  const isApple = providerId === 'apple.com';
  const isEmail = providerId === 'password';

  // 1단계 — "계속" 누르면 2단계로
  const handleContinue = () => {
    setError('');
    setStep('reauth');
  };

  // 2단계 — 재인증 후 Cloud Function 호출
  const handleReauthAndDelete = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. 재인증
      if (isGoogle) {
        await reauthenticateWithPopup(user, googleProvider);
      } else if (isApple) {
        await reauthenticateWithPopup(user, appleProvider);
      } else if (isEmail) {
        if (!password) {
          setError(t.reauthError);
          setLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // 2. 새 ID 토큰 발급 (재인증 직후 갱신)
      const idToken = await user.getIdToken(true);

      // 3. Cloud Function 호출
      setStep('deleting');
      const region = 'us-central1';
      const projectId = 'master-valley';
      const url = `https://${region}-${projectId}.cloudfunctions.net/deleteAccount`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        // 진행 중 변환 차단 (3-A: 거부)
        if (response.status === 409 && errBody.error === 'transform_in_progress') {
          setError(t.inProgressBlock);
          setStep('warning');
          setLoading(false);
          return;
        }
        throw new Error(errBody.error || 'Server error');
      }

      // 4. 클라이언트 정리
      // 4-1. IndexedDB 갤러리 삭제 (DB 통째)
      try {
        await deleteGalleryDB();
      } catch (galleryErr) {
        console.warn('Gallery DB delete error (non-fatal):', galleryErr);
      }

      // 4-2. localStorage 정리
      try {
        localStorage.removeItem('mastervalley-lang');
        localStorage.removeItem('mv_deleted_transformIds');
      } catch (lsErr) {
        console.warn('localStorage clear error (non-fatal):', lsErr);
      }

      // 4-3. 로그아웃 (Auth 계정은 서버에서 이미 삭제됨)
      try {
        await signOut(auth);
      } catch (signOutErr) {
        console.warn('SignOut error (non-fatal):', signOutErr);
      }

      // 5. 완료 콜백 → App.jsx에서 화면 정리
      onComplete();

    } catch (err) {
      console.error('[DeleteAccount] error:', err);
      // 재인증 실패는 따로 메시지
      const code = err.code || '';
      if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('user-mismatch')) {
        setError(t.reauthError);
      } else if (code.includes('cancelled-popup') || code.includes('popup-closed')) {
        // 사용자가 OAuth 팝업 닫음 — 조용히 무시
        setError('');
      } else {
        setError(t.deleteError);
      }
      // 에러 발생 시 reauth 단계 유지 (사용자가 다시 시도 가능)
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay}>
      <div style={s.inline} dir={isRTL ? 'rtl' : 'ltr'}>

        {/* 1단계 — 경고 */}
        {step === 'warning' && (
          <>
            <h3 style={s.title}>{t.warningTitle}</h3>
            <p style={s.intro}>{t.warningIntro}</p>
            <ul style={s.list}>
              <li style={s.listItem}>{t.warningItem1}</li>
              <li style={s.listItem}>{t.warningItem2}</li>
              <li style={s.listItem}>{t.warningItem3}</li>
            </ul>
            <p style={s.notice}>{t.warningIrreversible}</p>
            <p style={s.notice}>{t.warningPurchaseNote}</p>
            <p style={s.question}>{t.warningContinueQuestion}</p>
            {error && <p style={s.error}>{error}</p>}
            <div style={s.btnRow}>
              <button style={s.cancelBtn} onClick={onCancel} disabled={loading}>
                {tCommon.cancel}
              </button>
              <button style={s.confirmBtn} onClick={handleContinue} disabled={loading}>
                {t.warningContinueBtn}
              </button>
            </div>
          </>
        )}

        {/* 2단계 — 재인증 */}
        {step === 'reauth' && (
          <>
            <h3 style={s.title}>{t.reauthTitle}</h3>
            <p style={s.intro}>{t.reauthDesc}</p>

            {isGoogle && (
              <button style={s.oauthBtn} onClick={handleReauthAndDelete} disabled={loading}>
                {t.reauthGoogleBtn}
              </button>
            )}
            {isApple && (
              <button style={s.oauthBtn} onClick={handleReauthAndDelete} disabled={loading}>
                {t.reauthAppleBtn}
              </button>
            )}
            {isEmail && (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.reauthEmailLabel}
                  style={s.input}
                  disabled={loading}
                />
                <button style={s.oauthBtn} onClick={handleReauthAndDelete} disabled={loading || !password}>
                  {t.reauthEmailBtn}
                </button>
              </>
            )}

            {error && <p style={s.error}>{error}</p>}

            <div style={s.btnRow}>
              <button style={s.cancelBtn} onClick={onCancel} disabled={loading}>
                {tCommon.cancel}
              </button>
            </div>
          </>
        )}

        {/* 3단계 — 삭제 진행 중 */}
        {step === 'deleting' && (
          <p style={s.deleting}>{t.deleting}</p>
        )}

      </div>
    </div>
  );
};

// ==== 스타일 (OAuth D3 톤과 통일) ====
const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,26,31,0.85)',
    zIndex: 9500,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 24px 80px',
  },
  inline: {
    width: '100%',
    maxWidth: '360px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    color: 'rgba(220,228,224,0.85)',
    fontSize: '20px',
    fontWeight: 400,
    margin: '0 0 16px 0',
    textAlign: 'center',
    letterSpacing: '0.3px',
  },
  intro: {
    fontSize: '13px',
    color: 'rgba(220,228,224,0.6)',
    lineHeight: 1.6,
    margin: '0 0 12px 0',
    textAlign: 'left',
  },
  list: {
    margin: '0 0 14px 0',
    paddingLeft: '20px',
  },
  listItem: {
    fontSize: '13px',
    color: 'rgba(220,228,224,0.6)',
    lineHeight: 1.7,
    listStyle: 'disc',
  },
  notice: {
    fontSize: '12.5px',
    color: 'rgba(220,228,224,0.55)',
    lineHeight: 1.55,
    margin: '0 0 10px 0',
    textAlign: 'left',
  },
  question: {
    fontSize: '13px',
    color: 'rgba(220,228,224,0.7)',
    lineHeight: 1.6,
    margin: '14px 0 0 0',
    textAlign: 'left',
  },
  oauthBtn: {
    width: '100%',
    padding: '11px 16px',
    background: 'transparent',
    border: '1px solid rgba(138,168,150,0.5)',
    borderRadius: '8px',
    color: '#8aa896',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    marginTop: '12px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(220,228,224,0.12)',
    borderRadius: '8px',
    color: 'rgba(220,228,224,0.9)',
    fontSize: '14px',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    marginTop: '12px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    fontSize: '12px',
    color: 'rgba(220,170,160,0.85)',  // 옅은 코랄 (sage 톤과 어울림)
    margin: '12px 0 0 0',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '22px',
    justifyContent: 'center',
  },
  cancelBtn: {
    padding: '10px 22px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(220,228,224,0.4)',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  confirmBtn: {
    padding: '10px 28px',
    background: 'transparent',
    border: '1px solid rgba(138,168,150,0.5)',
    borderRadius: '8px',
    color: '#8aa896',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  deleting: {
    fontSize: '14px',
    color: 'rgba(220,228,224,0.7)',
    textAlign: 'center',
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    letterSpacing: '0.3px',
  },
};

export default DeleteAccountModal;
