// InsufficientBalancePopup.jsx - Insufficient Balance Popup (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React from 'react';
import { getUi } from '../i18n';

const InsufficientBalancePopup = ({ 
  requiredAmount = 0.25, 
  currentBalance = 0.10, 
  onAddFunds, 
  onClose,
  lang = 'en'
}) => {

  const ui = getUi(lang);
  const t = ui.insufficientBalance;
  const tFunds = ui.addFunds;

  // 추천 팩 계산 (AddFundsScreen 팩 기준: Starter/Standard/Plus)
  const getRecommendedPack = () => {
    const needed = requiredAmount - currentBalance;
    if (needed <= 0.99) return { name: 'Starter', price: 0.99 };
    if (needed <= 4.99) return { name: 'Standard', price: 4.99 };
    return { name: 'Plus', price: 49.99 };
  };

  const recommendedPack = getRecommendedPack();

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
          </svg>
        </div>
        <div className="popup-title">{t.title}</div>
        <div className="popup-info">
          {t.requires} <span className="need">${requiredAmount.toFixed(2)}</span>
          <br />
          {t.yourBalance} <span className="current">${currentBalance.toFixed(2)}</span>
        </div>
        
        <div className="popup-recommend">
          <div className="rec-label">{t.recommended}</div>
          <div className="rec-value">{recommendedPack.name} - ${recommendedPack.price.toFixed(2)}</div>
        </div>
        
        <div className="popup-buttons">
          <button className="popup-btn primary" onClick={onAddFunds}>
            {t.addFundsNow}
          </button>
          <button className="popup-btn secondary" onClick={onClose}>
            {t.maybeLater}
          </button>
        </div>
      </div>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
        }

        .popup-card {
          background: #1a2a2f;
          border-radius: 24px;
          padding: 32px 24px 20px;
          width: 100%;
          max-width: 320px;
          text-align: center;
        }

        .popup-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #2a3a3f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .popup-title {
          color: rgba(255,255,255,0.95);
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .popup-info {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.7;
        }

        .popup-info .need {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }

        .popup-info .current {
          color: #ef4444;
          font-weight: 600;
        }

        .popup-recommend {
          padding: 16px;
          background: #2a3a3f;
          border-radius: 14px;
          margin-bottom: 24px;
          border: 1px solid #3a7a7a;
          cursor: pointer;
          transition: background 0.2s;
        }

        .popup-recommend:hover {
          background: #2a3a3f;
        }

        .rec-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }

        .rec-value {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
        }

        .popup-buttons {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .popup-btn {
          padding: 12px;
          border-radius: 0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: opacity 0.2s;
        }

        .popup-btn.primary {
          color: #6a9a9a;
          font-weight: 600;
        }

        .popup-btn.secondary {
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }

        /* Mobile */
        @media (max-width: 360px) {
          .popup-card {
            padding: 24px 20px;
          }

          .popup-emoji {
            font-size: 48px;
          }

          .popup-title {
            font-size: 20px;
          }

          .popup-btn {
            padding: 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default InsufficientBalancePopup;
