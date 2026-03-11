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
        <p>{ui.subscriptionInfo.line1}</p>
        <p>{ui.subscriptionInfo.line2}</p>
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
          padding: 80px 20px 0;
          position: relative;
          z-index: 1;
        }

        .brand-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 44px;
          font-weight: 500;
          background: linear-gradient(135deg, #B8922E, #F5DC82);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 10px;
          letter-spacing: 1px;
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

        /* Category Grid */
        .category-grid {
          padding: 40px 20px 16px;
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
          font-size: 14px;
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
            padding: 72px 16px 0;
          }

          .brand-title {
            font-size: 44px;
          }

          .category-grid {
            padding: 36px 16px 16px;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySelection;
