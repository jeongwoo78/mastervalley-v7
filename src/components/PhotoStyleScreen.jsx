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

const PhotoStyleScreen = ({ mainCategory, onBack, onSelect, onMenu, onAddFunds, onCategoryChange, userCredits = 0, creditsLoaded = false, lang = 'en' }) => {
  const fileInputRef = useRef(null);
  const screenRef = useRef(null);
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
      tabName: ps.movementsTabName || ps.movementsName,
      price: '$0.20',
      fullPrice: '$1.99',
      emojis: '🏎️⚡🕰️',
      selectLabel: ps.selectMovement,
      priceLabel: `$0.20/${ps.perTransform}`,
      desc1: ps.movementsDesc1,
      desc2: ps.movementsDesc2,
      fullTransformLabel: ps.movementsFullTransformLabel || '11 사조 전체 변환',
      gradient: 'linear-gradient(135deg, #b8d4d4 0%, #5a9a8a 100%)',
      boxShadow: '0 4px 15px rgba(58, 122, 122, 0.3)',
      color: '#0a2020',
      accent: '#5a9a8a',
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
      tabName: ps.mastersTabName || ps.mastersName,
      price: '$0.25',
      fullPrice: '$1.50',
      emojis: '🔥🎨💥',
      selectLabel: ps.selectMaster,
      priceLabel: `$0.25/${ps.perTransform}`,
      desc1: ps.mastersDesc1,
      desc2: ps.mastersDesc2,
      fullTransformLabel: ps.mastersFullTransformLabel || '7인 거장 전체 변환',
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
        tabName: ps.orientalTabName || ps.orientalName,
        price: '$0.20',
        fullPrice: '$0.50',
        emojis: orientalEmojis,
        selectLabel: ps.selectStyle,
        priceLabel: `$0.20/${ps.perTransform}`,
        desc1: ps.orientalDesc1,
        desc2: ps.orientalDesc2,
        fullTransformLabel: ps.orientalFullTransformLabel || '동양화 전체 변환',
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
    if (selectedStyle?.isFullTransform && selectedStyle?.category === catKey) {
      setSelectedStyle(null);
    } else {
      setSelectedStyle(categoryData[catKey].fullTransform);
    }
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
    onCategoryChange?.(categoryOrder[clamped]);
    const _dir2 = lang === 'ar' ? 1 : -1; setTrackTransform(_dir2 * clamped * PAGE_W_REF.current, true);
  }, [activeCategory, setTrackTransform, onCategoryChange]);

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

    // 첫 번째 카테고리에서 홈으로 (LTR: 오른쪽 스와이프, RTL: 왼쪽 스와이프)
    const backDx = lang === 'ar' ? -dx : dx;
    const backVel = lang === 'ar' ? -velocity : velocity;
    if (idx === 0 && backDx > 0 && (backVel > 0.6 || backDx > pw * 0.35)) {
      // 슬라이드 아웃 애니메이션 후 홈으로
      if (screenRef.current) {
        screenRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        screenRef.current.style.transform = lang === 'ar' ? 'translateX(-100%)' : 'translateX(100%)';
        screenRef.current.style.opacity = '0';
        setTimeout(() => onBack?.(), 280);
      } else {
        onBack?.();
      }
      return;
    }

    let target = idx;
    const swipeDir = lang === 'ar' ? -1 : 1;

    if (Math.abs(velocity) > 0.3) {
      target = velocity < 0 ? idx + swipeDir : idx - swipeDir;
    } else if (Math.abs(dx) > pw * 0.2) {
      target = dx < 0 ? idx + swipeDir : idx - swipeDir;
    }

    snapToPage(target);
  }, [activeCategory, snapToPage, onBack, lang]);

  // ─── 카테고리별 페이지 렌더 ───
  const renderCategoryPage = (catKey) => {
    const cat = categoryData[catKey];
    const isCircle = catKey === 'masters';
    return (
      <div className="swipe-page" key={catKey}>
        {cat.desc1 && (
          <div className="category-desc" style={{ borderLeftColor: `${cat.accent}40` }}>
            <p className="category-desc-1">{cat.desc1}</p>
            <p className="category-desc-2">{cat.desc2}</p>
          </div>
        )}
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
          <div className={`ft-thumbnails-row ${catKey === 'oriental' ? 'ft-thumbnails-spread' : ''}`}>
            {(() => {
              const count = cat.styles.length;
              const thumbSize = 48;
              const noOverlap = catKey === 'oriental';
              return cat.styles.map((style, idx) => (
                <div
                  key={style.id}
                  className={`ft-thumb ${isCircle ? 'ft-thumb-circle' : ''}`}
                  style={{
                    zIndex: idx + 1,
                    borderColor: `${cat.accent}88`,
                    marginInlineEnd: noOverlap
                      ? (idx < count - 1 ? '8px' : 0)
                      : (idx < count - 1 ? `calc((100% - ${thumbSize * count}px) / ${count - 1})` : 0)
                  }}
                >
                  <img src={style.thumbnail} alt={style.name} />
                </div>
              ));
            })()}
          </div>
          <div className="ft-content">
            <div className="ft-row-1">
              <span className="ft-label-inline">
                <span className="ft-label">One-Click</span>
                <span className="ft-pipe">|</span>
                <span className="ft-sub">{cat.fullTransformLabel}</span>
                {selectedStyle?.isFullTransform && selectedStyle?.category === catKey && (
                  <span className="ft-check">✓</span>
                )}
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
              </div>
              <div className="style-text">
                <span className="style-name">{style.name}</span>
                <span className="style-period">{style.period}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="subscription-info">
          <p>{ps.artNotice}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="style-screen" ref={screenRef}>
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
          <svg className="menu-icon-svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <circle cx="12" cy="8" r="4"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <span className="menu-label">{ui.menu.title}</span>
        </button>
        <button className="credits-btn" onClick={() => onAddFunds?.()}>
          {creditsLoaded ? `$${userCredits.toFixed(2)}` : <span className="credits-skeleton"></span>}
        </button>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={lang === 'ar' ? { transform: 'scaleX(-1)' } : {}}><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="tab-list">
          {categoryOrder.map((cat, i) => (
            <button
              key={cat}
              className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
              style={activeCategory === cat ? { color: categoryData[cat].accent, borderBottomColor: categoryData[cat].accent } : {}}
              onClick={() => snapToPage(i)}
            >
              {categoryData[cat].tabName}
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
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .credits-btn {
          background: transparent;
          border: none;
          padding: 8px 0;
          color: rgba(58,122,122,0.9);
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
        }

        .credits-btn:active {
          opacity: 0.7;
        }

        @keyframes shimmer {
          0% { background-position: -80px 0; }
          100% { background-position: 80px 0; }
        }
        .credits-skeleton {
          display: inline-block;
          width: 72px;
          height: 17px;
          border-radius: 4px;
          background: linear-gradient(90deg, rgba(58,122,122,0.1) 25%, rgba(58,122,122,0.25) 50%, rgba(58,122,122,0.1) 75%);
          background-size: 160px 100%;
          animation: shimmer 1.5s infinite;
          vertical-align: middle;
        }

        .photo-section {
          margin: 0 28px 8px;
          background: #1a2a2f;
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
          color: rgba(255,255,255,0.4);
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
          color: rgba(255,255,255,0.2);
          font-size: 15px;
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
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          text-align: start;
        }

        .full-transform-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .full-transform-btn:focus {
          outline: none;
        }

        .ft-thumbnails-row {
          display: flex;
          width: 100%;
          padding-bottom: 6px;
        }

        .ft-thumbnails-spread {
          width: auto;
        }

        .ft-thumb {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1.5px solid;
        }

        .ft-thumb:last-child {
          margin-inline-end: 0 !important;
        }

        .ft-thumb-circle {
          border-radius: 50%;
        }

        .ft-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ft-content {
          flex: 1;
          width: 100%;
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
          letter-spacing: 0.5px;
          position: relative;
          display: inline-block;
          overflow: hidden;
        }

        .ft-label::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: ft-shimmer 1.5s ease-in-out infinite;
        }

        @keyframes ft-shimmer {
          0% { left: -100%; }
          75% { left: 150%; }
          100% { left: 150%; }
        }

        .ft-pipe {
          font-size: 13px;
          opacity: 0.4;
        }

        .ft-check {
          font-size: 16px;
          font-weight: 700;
          margin-left: 6px;
        }

        .full-transform-btn.selected .ft-label::after {
          display: none;
        }

        .ft-sub {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.85;
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
          font-size: 13px;
          opacity: 0.8;
        }

        .ft-emojis {
          font-size: 18px;
          margin-inline-start: 8px;
        }

        .select-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 42px 14px 40px;
          margin-top: 10px;
        }

        .select-label {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          font-weight: 600;
        }

        .per-transform-price {
          background: rgba(58,122,122,0.2);
          border: 1px solid rgba(58,122,122,0.4);
          border-radius: 20px;
          padding: 4px 12px;
          color: #6ab8a0;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .style-grid {
          padding: 4px 42px 24px 40px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 33px;
          row-gap: 14px;
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
          width: 100%;
          aspect-ratio: 1;
          background: #1a2a2f;
          border-radius: 10px;
          overflow: hidden;
        }

        .style-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .style-text {
          padding: 6px 4px 2px;
          text-align: start;
        }

        .style-name {
          display: block;
          color: rgba(255,255,255,0.8);
          font-size: 12.5px;
          font-weight: 600;
          line-height: 1.3;
        }

        .style-period {
          display: block;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          margin-top: 2px;
        }

        /* Category Description */
        .category-desc {
          border-left: 2px solid rgba(106,154,154,0.25);
          padding: 4px 0 4px 12px;
          margin: 9px 24px 12px 28px;
        }
        [dir="rtl"] .category-desc,
        .category-desc:lang(ar) {
          border-left: none;
          border-right: 2px solid rgba(106,154,154,0.25);
          padding: 4px 12px 4px 0;
          margin: 9px 28px 12px 24px;
        }
        .category-desc-1 {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin: 0 0 2px;
          line-height: 1.6;
        }
        .category-desc-2 {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.5;
        }

        /* Art Notice */
        .subscription-info {
          text-align: center;
          padding: 0px 24px 20px;
          margin-top: -8px;
        }

        .subscription-info p {
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 400px) {
          .style-grid {
            column-gap: 24px;
            row-gap: 12px;
            padding: 0 44px 20px;
          }

          .style-name {
            font-size: 11.5px;
          }

          .style-period {
            font-size: 9.5px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoStyleScreen;
