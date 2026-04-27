// TermsConsentModal.jsx - 약관/개인정보 인앱 표시 모달 (BLOCKER #46)
// 회원가입 시 약관/개인정보 보기 버튼 누르면 풀스크린 모달로 표시
// type: 'terms' | 'privacy'
import React from 'react';
import { getUi } from '../i18n';
import { termsContent, privacyContent } from '../data/legalContent';

const TermsConsentModal = ({ type, onClose, lang = 'en' }) => {
  const ta = getUi(lang).about;
  const isTerms = type === 'terms';
  const sections = isTerms
    ? (termsContent[lang] || termsContent.en)
    : (privacyContent[lang] || privacyContent.en);

  const title = isTerms ? ta.termsOfService : ta.privacyPolicy;
  // 최종 수정일은 termsContent / privacyContent 자체에 안 들어있어서 menu와 동일하게 fallback 처리
  const lastUpdated = lang === 'ko' ? '최종 수정일: 2026년 3월 13일' : 'Last updated: March 13, 2026';

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="terms-modal-header">
          <button className="terms-modal-back" onClick={onClose} aria-label="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <span className="terms-modal-title">{title}</span>
          <span className="terms-modal-spacer"></span>
        </header>
        <div className="terms-modal-scroll" dir="ltr" style={{ textAlign: 'left' }}>
          <p className="terms-modal-updated">{lastUpdated}</p>
          {sections.map((s, i) => (
            <div key={i} className="terms-modal-section">
              <h3 className="terms-modal-section-title">{s.title}</h3>
              <p className="terms-modal-section-text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .terms-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 10000;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px) 0;
        }
        .terms-modal-container {
          width: 100%;
          max-width: 480px;
          background: #0a1a1f;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .terms-modal-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #2a3a3f;
          flex-shrink: 0;
        }
        .terms-modal-back {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 4px 8px;
          display: flex;
          align-items: center;
        }
        .terms-modal-title {
          flex: 1;
          color: rgba(255, 255, 255, 0.9);
          font-size: 17px;
          font-weight: 600;
          text-align: center;
        }
        .terms-modal-spacer {
          width: 40px;
        }
        .terms-modal-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px 40px;
          -webkit-overflow-scrolling: touch;
        }
        .terms-modal-updated {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          margin: 0 0 24px 0;
        }
        .terms-modal-section {
          margin-bottom: 20px;
        }
        .terms-modal-section-title {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        .terms-modal-section-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default TermsConsentModal;
