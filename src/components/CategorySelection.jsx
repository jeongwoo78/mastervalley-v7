// CategorySelection.jsx - Main Screen (Dark Theme + Luxury Deco)
// Design A: 골드+퍼플 장식 + 넓은 골드 그라데이션 타이틀
import React from 'react';
import { getUi } from '../i18n';

// Thumbnail imports
import movementsThumbnail from '../assets/thumbnails/categories/movements.webp';
import mastersThumbnail from '../assets/thumbnails/categories/masters.webp';
import orientalThumbnail from '../assets/thumbnails/categories/oriental.webp';

const CategorySelection = ({ onSelect, onGallery, onMenu, onAddFunds, userCredits = 2.50, lang = 'en' }) => {

  const ui = getUi(lang);
  const t = ui.category;

  const categories = [
    {
      id: 'movements',
      name: t.westernArt,
      description: t.westernArtDesc,
      thumbnail: movementsThumbnail,
      accent: '#a855f7'
    },
    {
      id: 'masters',
      name: t.masterCollection,
      description: t.masterCollectionDesc,
      thumbnail: mastersThumbnail,
      accent: '#daa520'
    },
    {
      id: 'oriental',
      name: t.eastAsianArt,
      description: t.eastAsianArtDesc,
      thumbnail: orientalThumbnail,
      accent: '#f472b6'
    }
  ];

  const handleMenuClick = () => {
    onMenu?.();
  };

  return (
    <div className="main-screen">
      {/* 배경 장식 SVG */}
      <div className="deco-layer" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 골드 곡선: 우상단 */}
          <path d="M 430 -20 C 380 50, 400 130, 350 190 C 300 250, 370 310, 330 380" stroke="url(#decoGold1)" strokeWidth="2.5" fill="none"/>
          <path d="M 415 0 C 365 65, 385 140, 335 200 C 285 260, 355 320, 315 390" stroke="url(#decoGold2)" strokeWidth="1.6" fill="none"/>
          {/* 골드 곡선: 좌하단 */}
          <path d="M -20 720 C 40 660, 15 590, 70 530" stroke="url(#decoGold3)" strokeWidth="2" fill="none"/>
          {/* 퍼플 곡선: 우하단 */}
          <path d="M 430 580 C 380 620, 350 660, 320 700 C 290 740, 250 770, 180 820" stroke="url(#decoPurp1)" strokeWidth="2.8" fill="none"/>
          <path d="M 420 610 C 370 640, 335 680, 305 720 C 275 760, 235 790, 160 840" stroke="url(#decoPurp2)" strokeWidth="1.6" fill="none"/>
          {/* 퍼플 곡선: 좌상단 미세 */}
          <path d="M -15 100 C 15 140, 0 180, 20 225 C 40 270, 15 300, 35 340" stroke="url(#decoPurp3)" strokeWidth="1.4" fill="none"/>
          {/* 골드 원 */}
          <circle cx="370" cy="250" r="90" stroke="url(#decoGoldC)" strokeWidth="2" fill="none"/>
          <circle cx="35" cy="650" r="45" stroke="rgba(218,165,32,0.18)" strokeWidth="1.4" fill="none"/>
          {/* 글로우 */}
          <ellipse cx="380" cy="110" rx="110" ry="90" fill="url(#decoGoldGlow)"/>
          <ellipse cx="390" cy="720" rx="130" ry="110" fill="url(#decoPurpGlow)"/>

          <defs>
            <linearGradient id="decoGold1" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="rgba(218,165,32,0.6)"/>
              <stop offset="50%" stopColor="rgba(218,165,32,0.35)"/>
              <stop offset="100%" stopColor="rgba(218,165,32,0)"/>
            </linearGradient>
            <linearGradient id="decoGold2" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="rgba(218,165,32,0.35)"/>
              <stop offset="100%" stopColor="rgba(218,165,32,0)"/>
            </linearGradient>
            <linearGradient id="decoGold3" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="rgba(218,165,32,0.4)"/>
              <stop offset="100%" stopColor="rgba(218,165,32,0)"/>
            </linearGradient>
            <linearGradient id="decoPurp1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147,102,240,0.6)"/>
              <stop offset="50%" stopColor="rgba(147,102,240,0.3)"/>
              <stop offset="100%" stopColor="rgba(147,102,240,0)"/>
            </linearGradient>
            <linearGradient id="decoPurp2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147,102,240,0.4)"/>
              <stop offset="100%" stopColor="rgba(147,102,240,0)"/>
            </linearGradient>
            <linearGradient id="decoPurp3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147,102,240,0.35)"/>
              <stop offset="100%" stopColor="rgba(147,102,240,0)"/>
            </linearGradient>
            <linearGradient id="decoGoldC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(218,165,32,0.3)"/>
              <stop offset="100%" stopColor="rgba(218,165,32,0.06)"/>
            </linearGradient>
            <radialGradient id="decoGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(218,165,32,0.1)"/>
              <stop offset="100%" stopColor="rgba(218,165,32,0)"/>
            </radialGradient>
            <radialGradient id="decoPurpGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(147,102,240,0.12)"/>
              <stop offset="100%" stopColor="rgba(147,102,240,0)"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <header className="main-header">
        <button className="menu-btn" onClick={handleMenuClick}>
          <svg className="menu-icon-svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <circle cx="12" cy="8" r="4"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <span className="menu-label">{ui.menu.title}</span>
        </button>
        <button className="credits-btn" onClick={() => onAddFunds?.()}>${userCredits.toFixed(2)}</button>
      </header>

      <div className="branding">
        <h1 className="brand-title">Master Valley</h1>
        <p className="brand-tagline">{t.tagline}</p>
        <p className="brand-sub-tagline">{t.subTagline}</p>
        <div className="gold-divider" />
      </div>

      {/* Category Grid */}
      <div className="category-grid">
        {categories.map(cat => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => onSelect(cat.id)}
          >
            {lang === 'ar' ? (
              <>
                <svg className="card-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
                <div className="card-info">
                  <span className="card-name" style={{ color: cat.accent }}>{cat.name}</span>
                  <span className="card-desc">{cat.description}</span>
                </div>
                <div className="card-thumbnail">
                  <img src={cat.thumbnail} alt={cat.name} />
                </div>
              </>
            ) : (
              <>
                <div className="card-thumbnail">
                  <img src={cat.thumbnail} alt={cat.name} />
                </div>
                <div className="card-info">
                  <span className="card-name" style={{ color: cat.accent }}>{cat.name}</span>
                  <span className="card-desc">{cat.description}</span>
                </div>
                <svg className="card-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Subscription Info */}
      <div className="subscription-info">
        <p>{ui.subscriptionInfo.line1}.</p>
        <p>{ui.subscriptionInfo.line2}.</p>
      </div>

      <style>{`
        .main-screen {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        /* 배경 장식 레이어 */
        .deco-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px 16px;
          position: relative;
          z-index: 1;
        }

        .menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 8px;
        }

        .menu-icon-svg {
          display: block;
        }

        .menu-label {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .credits-btn {
          background: transparent;
          border: none;
          padding: 8px 0;
          color: rgba(147,102,240,0.9);
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
        }

        .credits-btn:active {
          opacity: 0.7;
        }

        /* Branding */
        .branding {
          text-align: center;
          padding: 40px 20px 0;
          position: relative;
          z-index: 1;
        }

        .brand-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 44px;
          font-weight: 600;
          margin: 0 0 10px;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #a855f7 0%, #b77df7 36%, #daa520 50%, #e88aaf 64%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          font-size: 15px;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .brand-sub-tagline {
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          margin: 6px 0 0;
        }

        .gold-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(218,165,32,0.4), transparent);
          margin: 28px auto 0;
        }

        /* Category Grid */
        .category-grid {
          flex: 1;
          padding: 28px 20px 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .category-card {
          background: transparent;
          border: none;
          border-radius: 12px;
          padding: 8px 0;
          min-height: 104px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: start;
        }

        .category-card:hover {
          background: rgba(255,255,255,0.05);
        }

        .category-card:active {
          transform: scale(0.98);
        }

        /* 썸네일 - 96×96 */
        .card-thumbnail {
          width: 96px;
          height: 96px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }

        .card-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: start;
        }

        .card-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          text-align: start;
          letter-spacing: 0.3px;
        }

        .card-desc {
          color: rgba(255,255,255,0.4);
          font-size: 12.5px;
          text-align: start;
          line-height: 1.4;
        }

        .card-arrow-svg {
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          padding-inline-end: 4px;
        }

        /* Subscription Info */
        .subscription-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 24px 20px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .subscription-info p {
          color: rgba(255,255,255,0.25);
          font-size: 12.5px;
          margin: 0 0 2px;
          text-align: center;
          line-height: 1.7;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .main-header {
            padding: 16px 16px 12px;
          }

          .branding {
            padding: 32px 16px 0;
          }

          .brand-title {
            font-size: 44px;
          }

          .category-grid {
            padding: 24px 16px 16px;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySelection;
