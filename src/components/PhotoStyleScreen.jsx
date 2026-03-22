// PhotoStyleScreen.jsx - Style Selection Screen (Dark Theme) + Category Swipe
// Based on 0224 + 3-page drag swipe
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getUi } from '../i18n';

// Thumbnail imports - Movements
import grecoRoman from '../assets/thumbnails/movements/greco-roman.webp';
import medieval from '../assets/thumbnails/movements/medieval.webp';
import renaissance from '../assets/thumbnails/movements/renaissance.webp';
import baroque from '../assets/thumbnails/movements/baroque.webp';
import rococo from '../assets/thumbnails/movements/rococo.webp';
import neoclassicism from '../assets/thumbnails/movements/neoclassicism.webp';
import impressionism from '../assets/thumbnails/movements/impressionism.webp';
import postImpressionism from '../assets/thumbnails/movements/post-impressionism.webp';
import fauvism from '../assets/thumbnails/movements/fauvism.webp';
import expressionism from '../assets/thumbnails/movements/expressionism.webp';
import modernism from '../assets/thumbnails/movements/modernism.webp';

// Thumbnail imports - Masters
import vangogh from '../assets/thumbnails/masters/vangogh.webp';
import klimt from '../assets/thumbnails/masters/klimt.webp';
import munch from '../assets/thumbnails/masters/munch.webp';
import matisse from '../assets/thumbnails/masters/matisse.webp';
import chagall from '../assets/thumbnails/masters/chagall.webp';
import frida from '../assets/thumbnails/masters/frida.webp';
import lichtenstein from '../assets/thumbnails/masters/lichtenstein.webp';

// Thumbnail imports - Oriental
import korean from '../assets/thumbnails/oriental/korean.webp';
import chinese from '../assets/thumbnails/oriental/chinese.webp';
import japanese from '../assets/thumbnails/oriental/japanese.webp';

const PhotoStyleScreen = ({ mainCategory, onBack, onSelect, onMenu, onAddFunds, userCredits = 0, lang = 'en' }) => {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // 카테고리 스와이프
  const categoryOrder = ['movements', 'masters', 'oriental'];
  const [activeCategory, setActiveCategory] = useState(mainCategory || 'movements');
  const trackRef = useRef(null);
  const touchRef = useRef({ startX: 0, startY: 0, lastX: 0, lastTime: 0, isDragging: false, direction: null });
  const PAGE_W_REF = useRef(375);

  const ui = getUi(lang);
  const ps = ui.photoStyle;

  // Category data with thumbnails (i18n via ui.js)
  const categoryData = {
    movements: {
      name: ps.movementsName,
      price: '$0.20',
      fullPrice: '$2.00',
      emojis: '🏎️⚡🕰️',
      selectLabel: ps.selectMovement,
      priceLabel: `$0.20/${ps.perTransform}`,
      gradient: 'linear-gradient(135deg, #b8d4d4 0%, #4a7a7a 100%)',
      boxShadow: '0 4px 15px rgba(74, 106, 170, 0.3)',
      color: '#0a2020',
      accent: '#4a7a7a',
      fullTransform: {
        id: 'movements-all',
        title: ps.movementsFullTitle,
        desc: ps.movementsFullDesc,
        count: 11,
        isFullTransform: true,
        category: 'movements'
      },
      styles: [
        { id: 'ancient', name: ps.grecoRoman, period: 'BC 800 - AD 500', thumbnail: grecoRoman, category: 'movements' },
        { id: 'medieval', name: ps.medieval, period: '400 - 1400', thumbnail: medieval, category: 'movements' },
        { id: 'renaissance', name: ps.renaissance, period: '1400 - 1600', thumbnail: renaissance, category: 'movements' },
        { id: 'baroque', name: ps.baroque, period: '1600 - 1750', thumbnail: baroque, category: 'movements' },
        { id: 'rococo', name: ps.rococo, period: '1700 - 1800', thumbnail: rococo, category: 'movements' },
        { id: 'neoclassicism_vs_romanticism_vs_realism', name: ps.neoRomanReal, period: '1750 - 1880', thumbnail: neoclassicism, category: 'movements' },
        { id: 'impressionism', name: ps.impressionism, period: '1860 - 1890', thumbnail: impressionism, category: 'movements' },
        { id: 'postImpressionism', name: ps.postImpressionism, period: '1880 - 1910', thumbnail: postImpressionism, category: 'movements' },
        { id: 'fauvism', name: ps.fauvism, period: '1905 - 1910', thumbnail: fauvism, category: 'movements' },
        { id: 'expressionism', name: ps.expressionism, period: '1905 - 1930', thumbnail: expressionism, category: 'movements' },
        { id: 'modernism', name: ps.modernism, period: '1907 - 1970', thumbnail: modernism, category: 'movements' }
      ]
    },
    masters: {
      name: ps.mastersName,
      price: '$0.25',
      fullPrice: '$1.50',
      emojis: '🔥🎨💥',
      selectLabel: ps.selectMaster,
      priceLabel: `$0.25/${ps.perTransform}`,
      gradient: 'linear-gradient(135deg, #e0d0a8 0%, #b89a5a 100%)',
      boxShadow: '0 4px 15px rgba(184, 154, 90, 0.3)',
      color: '#2a2210',
      accent: '#b89a5a',
      fullTransform: {
        id: 'masters-all',
        title: ps.mastersFullTitle,
        desc: ps.mastersFullDesc,
        count: 7,
        isFullTransform: true,
        category: 'masters'
      },
      styles: [
        { id: 'vangogh-master', name: ps.vanGogh, period: '1853 - 1890', thumbnail: vangogh, category: 'masters' },
        { id: 'klimt-master', name: ps.klimt, period: '1862 - 1918', thumbnail: klimt, category: 'masters' },
        { id: 'munch-master', name: ps.munch, period: '1863 - 1944', thumbnail: munch, category: 'masters' },
        { id: 'matisse-master', name: ps.matisse, period: '1869 - 1954', thumbnail: matisse, category: 'masters' },
        { id: 'chagall-master', name: ps.chagall, period: '1887 - 1985', thumbnail: chagall, category: 'masters' },
        { id: 'frida-master', name: ps.frida, period: '1907 - 1954', thumbnail: frida, category: 'masters' },
        { id: 'lichtenstein-master', name: ps.lichtenstein, period: '1923 - 1997', thumbnail: lichtenstein, category: 'masters' }
      ]
    },
    oriental: (() => {
      // 동양화 순서: ko=한중일, ja=일중한, 기본=중일한
      const koreanStyle = { id: 'korean', name: ps.korean, period: ps.koreanSub, thumbnail: korean, category: 'oriental' };
      const chineseStyle = { id: 'chinese', name: ps.chinese, period: ps.chineseSub, thumbnail: chinese, category: 'oriental' };
      const japaneseStyle = { id: 'japanese', name: ps.japanese, period: ps.japaneseSub, thumbnail: japanese, category: 'oriental' };

      const orientalStyles = lang === 'ko' ? [koreanStyle, chineseStyle, japaneseStyle]
        : lang === 'ja' ? [japaneseStyle, chineseStyle, koreanStyle]
        : [chineseStyle, japaneseStyle, koreanStyle];
      const orientalEmojis = lang === 'ko' ? '🐅🐼🌸'
        : lang === 'ja' ? '🌸🐼🐅'
        : '🐼🌸🐅';

      return {
        name: ps.orientalName,
        price: '$0.20',
        fullPrice: '$0.50',
        emojis: orientalEmojis,
        selectLabel: ps.selectStyle,
        priceLabel: `$0.20/${ps.perTransform}`,
        gradient: 'linear-gradient(135deg, #e8b8c8 0%, #c07090 100%)',
        boxShadow: '0 4px 15px rgba(192, 112, 144, 0.3)',
        color: '#3a1528',
        accent: '#c07090',
        fullTransform: {
          id: 'oriental-all',
          title: ps.orientalFullTitle,
          desc: ps.orientalFullDesc,
          count: 3,
          isFullTransform: true,
          category: 'oriental'
        },
        styles: orientalStyles
      };
    })()
  };

  // Auto-start when both photo and style selected
  useEffect(() => {
    if (photo && selectedStyle) {
      const cat = selectedStyle.category || activeCategory;
      const catData = categoryData[cat];
      if (selectedStyle.isFullTransform) {
        onSelect(photo, { ...selectedStyle, styles: catData.styles });
      } else {
        onSelect(photo, selectedStyle);
      }
    }
  }, [photo, selectedStyle]);

  // 뷰포트 너비 측정
  useEffect(() => {
    const measure = () => {
      if (trackRef.current?.parentElement) {
        PAGE_W_REF.current = trackRef.current.parentElement.offsetWidth;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // activeCategory 변경 시 트랙 위치 동기화
  useEffect(() => {
    const idx = categoryOrder.indexOf(activeCategory);
    if (trackRef.current?.parentElement) {
      PAGE_W_REF.current = trackRef.current.parentElement.offsetWidth;
    }
    const _dir = lang === 'ar' ? 1 : -1; setTrackTransform(_dir * idx * PAGE_W_REF.current, true);
  }, [activeCategory]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleFullTransform = (catKey) => {
    setSelectedStyle(categoryData[catKey].fullTransform);
  };

  // ─── 스와이프 핸들러 ───
  const setTrackTransform = useCallback((x, animated) => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = animated
      ? 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)'
      : 'none';
    trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  const snapToPage = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(2, idx));
    if (categoryOrder[clamped] !== activeCategory) {
      setSelectedStyle(null); // 카테고리 전환 시 선택 해제
    }
    setActiveCategory(categoryOrder[clamped]);
    const _dir2 = lang === 'ar' ? 1 : -1; setTrackTransform(_dir2 * clamped * PAGE_W_REF.current, true);
  }, [activeCategory, setTrackTransform]);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      lastX: t.clientX,
      lastTime: Date.now(),
      isDragging: true,
      direction: null
    };
    if (trackRef.current) {
      const matrix = new DOMMatrix(getComputedStyle(trackRef.current).transform);
      setTrackTransform(matrix.m41, false);
    }
  }, [setTrackTransform]);

  const handleTouchMove = useCallback((e) => {
    const tr = touchRef.current;
    if (!tr.isDragging) return;

    const t = e.touches[0];
    const dx = t.clientX - tr.startX;
    const dy = t.clientY - tr.startY;

    if (tr.direction === null && (Math.abs(dx) >= 10 || Math.abs(dy) >= 10)) {
      tr.direction = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
    }
    if (tr.direction !== 'h') return;

    e.preventDefault();
    tr.lastX = t.clientX;
    tr.lastTime = Date.now();

    const idx = categoryOrder.indexOf(activeCategory);
    const pw = PAGE_W_REF.current;
    const _dirD = lang === 'ar' ? 1 : -1; let targetX = _dirD * idx * pw + dx;

    const minX = Math.min(0, _dirD * 2 * pw);
    const maxX = Math.max(0, _dirD * 2 * pw);
    if (targetX > maxX) {
      targetX = maxX + (targetX - maxX) * 0.25;
    } else if (targetX < minX) {
      targetX = minX + (targetX - minX) * 0.25;
    }

    setTrackTransform(targetX, false);
  }, [activeCategory, setTrackTransform]);

  const handleTouchEnd = useCallback((e) => {
    const tr = touchRef.current;
    tr.isDragging = false;
    if (tr.direction !== 'h') {
      snapToPage(categoryOrder.indexOf(activeCategory));
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - tr.startX;
    const recentDt = Date.now() - tr.lastTime;
    const velocity = recentDt > 0 ? (t.clientX - tr.lastX) / recentDt : 0;

    const idx = categoryOrder.indexOf(activeCategory);
    const pw = PAGE_W_REF.current;
    let target = idx;

    if (Math.abs(velocity) > 0.3) {
      target = velocity < 0 ? idx + 1 : idx - 1;
    } else if (Math.abs(dx) > pw * 0.2) {
      target = dx < 0 ? idx + 1 : idx - 1;
    }

    snapToPage(target);
  }, [activeCategory, snapToPage]);

  // ─── 카테고리별 페이지 렌더 ───
  const renderCategoryPage = (catKey) => {
    const cat = categoryData[catKey];
    return (
      <div className="swipe-page" key={catKey}>
        <button
          className={`full-transform-btn ${selectedStyle?.isFullTransform && selectedStyle?.category === catKey ? 'selected' : ''}`}
          onClick={() => handleFullTransform(catKey)}
          style={{
            background: cat.gradient,
            boxShadow: selectedStyle?.isFullTransform && selectedStyle?.category === catKey
              ? `0 0 0 2px ${cat.accent}, 0 0 12px ${cat.accent}66`
              : cat.boxShadow,
            color: cat.color
          }}
        >
          <span className="ft-sparkles">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
            </svg>
          </span>
          <div className="ft-content">
            <div className="ft-row-1">
              <span className="ft-label-inline">
                <span className="ft-label">One-Click</span>
                <span className="ft-pipe">|</span>
                <span className="ft-sub">{ps.fullTransform}</span>
              </span>
              <span className="ft-price">{cat.fullPrice}</span>
            </div>
            <div className="ft-row-2">
              <span className="ft-desc">{cat.fullTransform.title}</span>
              <span className="ft-emojis">{cat.emojis}</span>
            </div>
          </div>
        </button>

        <div className="select-price-row">
          <span className="select-label">{cat.selectLabel}</span>
          <span className="per-transform-price">{cat.priceLabel}</span>
        </div>

        {catKey === 'masters' && ps.mastersGalleryDesc && (
          <p className="masters-gallery-desc">※ {ps.mastersGalleryDesc}</p>
        )}

        <div className="style-grid">
          {cat.styles.map(style => (
            <button
              key={style.id}
              className={`style-card ${selectedStyle?.id === style.id ? 'selected' : ''}`}
              onClick={() => handleStyleSelect(style)}
              style={selectedStyle?.id === style.id ? {
                borderColor: cat.accent,
                boxShadow: `0 0 12px ${cat.accent}66`
              } : {}}
            >
              <div className="style-thumb">
                <img src={style.thumbnail} alt={style.name} />
                <div className="style-overlay">
                  <span className="style-name">{style.name}</span>
                  <span className="style-period">{style.period}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="subscription-info">
          <p>{ui.subscriptionInfo.line1}</p>
          <p>{ui.subscriptionInfo.line2}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="style-screen">
      {/* Atmosphere blobs — 메인화면과 동일 */}
      <div className="atmo-layer">
        <div className="atmo-blob atmo-blue" />
        <div className="atmo-blob atmo-gold" />
        <div className="atmo-blob atmo-pink" />
        <div className="atmo-line" />
      </div>

      {/* Header — 메인화면과 동일 */}
      <header className="style-header">
        <button className="menu-btn" onClick={() => onMenu?.()}>
          <svg className="menu-icon-svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <circle cx="12" cy="8" r="4"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <span className="menu-label">{ui.menu.title}</span>
        </button>
        <button className="credits-btn" onClick={() => onAddFunds?.()}>${userCredits.toFixed(2)}</button>
      </header>

      {/* Photo Section (고정, 스와이프 밖) */}
      <div
        className={`photo-section ${!photo ? 'awaiting-photo' : ''}`}
        onClick={handlePhotoClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {photoPreview ? (
          <img src={photoPreview} alt="Selected" className="photo-preview" />
        ) : (
          <div className="photo-placeholder">
            <span className="photo-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg></span>
            <span className="photo-text">{ps.tapToSelectPhoto}</span>
          </div>
        )}
      </div>

      {/* 카테고리 탭 바 (< + 텍스트 탭) */}
      <div className="category-tab-bar">
        <button className="tab-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="tab-list">
          {categoryOrder.map((cat, i) => (
            <button
              key={cat}
              className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
              style={activeCategory === cat ? { color: categoryData[cat].accent, borderBottomColor: categoryData[cat].accent } : {}}
              onClick={() => snapToPage(i)}
            >
              {categoryData[cat].name}
            </button>
          ))}
        </div>
        <div className="tab-spacer" />
      </div>

      {/* 스와이프 영역 */}
      <div
        className="swipe-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={trackRef} className="swipe-track">
          {categoryOrder.map(catKey => renderCategoryPage(catKey))}
        </div>
      </div>

      <style>{`
        .style-screen {
          height: calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 12px);
          height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 12px);
          background: #0a1a1f;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }

        /* Atmosphere blobs */
        .atmo-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .atmo-blob {
          position: absolute;
          border-radius: 50%;
        }
        .atmo-blue {
          top: -60px;
          left: -60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(74,122,122,0.18) 0%, transparent 70%);
          filter: blur(40px);
        }
        .atmo-gold {
          top: 220px;
          right: -50px;
          width: 250px;
          height: 320px;
          background: radial-gradient(ellipse, rgba(184,154,90,0.10) 0%, transparent 70%);
          filter: blur(50px);
          transform: rotate(-20deg);
        }
        .atmo-pink {
          bottom: 40px;
          left: -30px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(192,112,144,0.09) 0%, transparent 70%);
          filter: blur(40px);
        }
        .atmo-line {
          position: absolute;
          top: 38%;
          left: 8%;
          width: 84%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,122,122,0.04), rgba(184,154,90,0.03), transparent);
        }

        /* Header — 메인화면과 동일 */
        .style-header {
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
          color: rgba(74,106,170,0.9);
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
        }

        .credits-btn:active {
          opacity: 0.7;
        }

        .photo-section {
          margin: 0 28px 8px;
          background: #1a1a1a;
          border-radius: 12px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          border: none;
          box-shadow: none;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .photo-section:not(.awaiting-photo) {
          height: auto;
          aspect-ratio: 4 / 3;
          background: transparent;
        }

        .photo-section.awaiting-photo {
          border: 2px solid #4b5563;
        }

        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .photo-icon {
          font-size: 32px;
          opacity: 0.4;
        }

        .photo-text {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }

        .photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        /* 카테고리 탭 바 */
        .category-tab-bar {
          display: flex;
          align-items: center;
          padding: 8px 16px 0;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .tab-back-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .tab-back-btn:active {
          opacity: 0.6;
        }

        .tab-spacer {
          width: 36px;
          flex-shrink: 0;
        }

        .tab-list {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 0;
        }

        .tab-item {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          font-weight: 600;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-item:active {
          opacity: 0.7;
        }

        /* 스와이프 레이아웃 */
        .swipe-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
          min-height: 0;
          z-index: 1;
        }

        .swipe-track {
          display: flex;
          width: 300%;
          height: 100%;
          will-change: transform;
          transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        .swipe-page {
          width: calc(100% / 3);
          flex-shrink: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
        }
        .swipe-page > * {
          flex-shrink: 0;
        }
        .swipe-page::-webkit-scrollbar {
          display: none;
        }

        .full-transform-btn {
          margin: 14px 28px 6px;
          padding: 14px 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: start;
        }

        .full-transform-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .full-transform-btn:focus {
          outline: none;
        }

        .ft-sparkles {
          display: flex;
          flex-shrink: 0;
        }

        .ft-content {
          flex: 1;
        }

        .ft-row-1 {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ft-label-inline {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .ft-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: 20px;
          font-weight: 700;
        }

        .ft-pipe {
          font-size: 11px;
          opacity: 0.25;
        }

        .ft-sub {
          font-size: 11px;
          opacity: 0.5;
        }

        .ft-price {
          font-size: 14px;
          font-weight: 700;
        }

        .ft-row-2 {
          display: flex;
          align-items: center;
          margin-top: 3px;
        }

        .ft-desc {
          font-size: 12px;
          opacity: 0.7;
        }

        .ft-emojis {
          font-size: 18px;
          margin-inline-start: 8px;
        }

        .select-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 28px 14px;
        }

        .select-label {
          color: #888;
          font-size: 13px;
        }

        .per-transform-price {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }

        .masters-gallery-desc {
          color: rgba(255,255,255,0.45);
          font-size: 11.5px;
          text-align: start;
          padding: 4px 28px 0;
          margin: 0;
          line-height: 1.5;
        }

        .style-grid {
          padding: 4px 28px 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          overflow-y: auto;
        }

        .style-card {
          background: none;
          border: 3px solid transparent;
          padding: 0;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .style-card:focus {
          outline: none;
        }

        .style-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #1a1a1a;
        }

        .style-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .style-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px 10px;
          background: none;
          text-align: start;
        }

        .style-name {
          display: block;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
        }

        .style-period {
          display: block;
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          margin-top: 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
        }

        /* Subscription Info */
        .subscription-info {
          text-align: center;
          padding: 16px 24px 20px;
        }

        .subscription-info p {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 400px) {
          .style-grid {
            gap: 14px;
            padding: 0 24px 20px;
          }

          .style-name {
            font-size: 12px;
          }

          .style-period {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoStyleScreen;
