// MenuScreen.jsx - Menu Screen (Dark Theme, SVG Icons)
// v3: 12 languages all active
import React, { useState } from 'react';
import { getUi } from '../i18n';
import { termsContent, privacyContent } from '../data/legalContent';

// ===== SVG Icons =====
const IconImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconMessageCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// 11 languages (alphabetical by native name)
const ALL_LANGS = [
  { code: 'ar',    native: 'العربية',           active: true },
  { code: 'id',    native: 'Bahasa Indonesia',  active: true },
  { code: 'en',    native: 'English',           active: true },
  { code: 'es',    native: 'Español',           active: true },
  { code: 'fr',    native: 'Français',          active: true },
  { code: 'ja',    native: '日本語',             active: true },
  { code: 'ko',    native: '한국어',             active: true },
  { code: 'pt',    native: 'Português',         active: true },
  { code: 'th',    native: 'ไทย',               active: true },
  { code: 'tr',    native: 'Türkçe',            active: true },
  { code: 'zh-TW', native: '繁體中文',           active: true },
];

const MenuScreen = ({ 
  onBack, 
  onGallery, 
  onAddFunds, 
  onLanguage, 
  onSupport, 
  onLogout, 
  onDeleteAccount,
  lang = 'en'
}) => {

  const [langOpen, setLangOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const t = getUi(lang).menu;
  const ta = getUi(lang).about;

  const currentLangName = ALL_LANGS.find(l => l.code === lang)?.native || 'English';

  const handleLanguageSelect = (newLang) => {
    const langItem = ALL_LANGS.find(l => l.code === newLang);
    if (!langItem?.active) return;
    if (onLanguage) {
      onLanguage(newLang);
    }
    setLangOpen(false);
  };

  // ===== Terms View =====
  if (showTerms) {
    const sections = termsContent[lang] || termsContent.en;
    return (
      <div className="menu-screen">
        <header className="menu-header">
          <button className="back-btn" onClick={() => setShowTerms(false)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <span className="header-title">{lang === 'ko' ? ta.termsOfService : 'Terms of Service'}</span>
          <span className="header-spacer"></span>
        </header>
        <div className="legal-scroll" dir="ltr" style={{ textAlign: 'left' }}>
          <p className="legal-updated">{lang === 'ko' ? '최종 수정일: 2026년 3월 13일' : 'Last updated: March 13, 2026'}</p>
          {sections.map((s, i) => (
            <div key={i} className="legal-section">
              <h3 className="legal-title">{s.title}</h3>
              <p className="legal-text">{s.text}</p>
            </div>
          ))}
        </div>
        <style>{menuStyles}</style>
      </div>
    );
  }

  // ===== Privacy View =====
  if (showPrivacy) {
    const sections = privacyContent[lang] || privacyContent.en;
    return (
      <div className="menu-screen">
        <header className="menu-header">
          <button className="back-btn" onClick={() => setShowPrivacy(false)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <span className="header-title">{lang === 'ko' ? ta.privacyPolicy : 'Privacy Policy'}</span>
          <span className="header-spacer"></span>
        </header>
        <div className="legal-scroll" dir="ltr" style={{ textAlign: 'left' }}>
          <p className="legal-updated">{lang === 'ko' ? '최종 수정일: 2026년 3월 13일' : 'Last updated: March 13, 2026'}</p>
          {sections.map((s, i) => (
            <div key={i} className="legal-section">
              <h3 className="legal-title">{s.title}</h3>
              <p className="legal-text">{s.text}</p>
            </div>
          ))}
        </div>
        <style>{menuStyles}</style>
      </div>
    );
  }

  // ===== About View =====
  if (showAbout) {
    return (
      <div className="menu-screen">
        <header className="menu-header">
          <button className="back-btn" onClick={() => setShowAbout(false)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <span className="header-title">{ta.title}</span>
          <span className="header-spacer"></span>
        </header>

        <div className="menu-section">
          {/* App Name & Version */}
          <div className="about-app-info">
            <span className="about-app-name">Master Valley</span>
            <span className="about-version">{ta.version} 1.0.0</span>
          </div>

          {/* Terms of Service */}
          <div className="menu-item-svg" onClick={() => setShowTerms(true)}>
            <span className="menu-label">{lang === 'ko' ? ta.termsOfService : 'Terms of Service'}</span>
            <span className="menu-chevron-svg"><IconChevron /></span>
          </div>

          {/* Privacy Policy */}
          <div className="menu-item-svg" onClick={() => setShowPrivacy(true)}>
            <span className="menu-label">{lang === 'ko' ? ta.privacyPolicy : 'Privacy Policy'}</span>
            <span className="menu-chevron-svg"><IconChevron /></span>
          </div>

          {/* Image Credits */}
          <div className="about-credits">
            <span className="about-credits-title">{lang === 'ko' ? ta.imageCredits : 'Image Credits'}</span>
            <span className="about-credits-text">{ta.lichtensteinCredit}</span>
          </div>
        </div>

        <style>{menuStyles}</style>
      </div>
    );
  }

  // ===== Menu View =====
  return (
    <div className="menu-screen">
      <header className="menu-header">
        <button className="back-btn" onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <span className="header-title">{t.title}</span>
        <span className="header-spacer"></span>
      </header>

      <div className="menu-section">
        {/* Gallery */}
        <div className="menu-item-svg" onClick={onGallery}>
          <span className="menu-svg-icon"><IconImage /></span>
          <span className="menu-label">{t.myGallery}</span>
          <span className="menu-chevron-svg"><IconChevron /></span>
        </div>

        {/* Language - Accordion */}
        <div 
          className={`menu-item-svg ${langOpen ? 'accordion-open' : ''}`}
          onClick={() => setLangOpen(!langOpen)}
        >
          <span className="menu-svg-icon"><IconGlobe /></span>
          <span className="menu-label">{t.language}</span>
          <span className="menu-value">{currentLangName}</span>
          <span className={`menu-chevron-svg ${langOpen ? 'open' : ''}`}><IconChevron /></span>
        </div>

        {langOpen && (
          <div className="lang-accordion">
            {ALL_LANGS.map(l => {
              const isSelected = lang === l.code;
              const isActive = l.active;
              return (
                <div 
                  key={l.code}
                  className={`lang-option ${isSelected ? 'active' : ''} ${!isActive ? 'inactive' : ''}`}
                  onClick={() => handleLanguageSelect(l.code)}
                  style={{ cursor: isActive ? 'pointer' : 'default' }}
                >
                  <span className="lang-dash">-</span>
                  <span className="lang-name" style={{
                    color: isSelected ? '#fff' : isActive ? 'rgba(255,255,255,0.8)' : '#444',
                  }}>{l.native}</span>
                  {isSelected && <span className="lang-check"><IconCheck /></span>}
                  {!isActive && !isSelected && <span className="lang-soon">soon</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Funds */}
        <div className="menu-item-svg" onClick={onAddFunds}>
          <span className="menu-svg-icon"><IconCreditCard /></span>
          <span className="menu-label">{t.addFunds}</span>
          <span className="menu-chevron-svg"><IconChevron /></span>
        </div>

        {/* Support - Accordion */}
        <div 
          className={`menu-item-svg ${supportOpen ? 'accordion-open' : ''}`}
          onClick={() => setSupportOpen(!supportOpen)}
        >
          <span className="menu-svg-icon"><IconMessageCircle /></span>
          <span className="menu-label">{t.support}</span>
          <span className={`menu-chevron-svg ${supportOpen ? 'open' : ''}`}><IconChevron /></span>
        </div>

        {supportOpen && (
          <div className="support-accordion">
            <div className="support-option" onClick={onSupport}>
              <span className="support-text">{t.contactUs}</span>
            </div>
            <div className="support-option">
              <span className="support-text">{t.faq}</span>
            </div>
          </div>
        )}

        {/* About */}
        <div className="menu-item-svg" onClick={() => setShowAbout(true)}>
          <span className="menu-svg-icon"><IconInfo /></span>
          <span className="menu-label">{t.about}</span>
          <span className="menu-chevron-svg"><IconChevron /></span>
        </div>

        <div className="menu-divider"></div>

        {/* Log Out */}
        <div className="menu-item-svg" onClick={onLogout}>
          <span className="menu-svg-icon"><IconLogOut /></span>
          <span className="menu-label">{t.logOut}</span>
          <span className="menu-chevron-svg"><IconChevron /></span>
        </div>

        {/* Delete Account */}
        <div className="menu-item-svg danger" onClick={onDeleteAccount}>
          <span className="menu-svg-icon"><IconAlertTriangle /></span>
          <span className="menu-label">{t.deleteAccount}</span>
          <span className="menu-chevron-svg"><IconChevron /></span>
        </div>
      </div>

      <style>{menuStyles}</style>
    </div>
  );
};

const menuStyles = `
  .menu-screen {
    min-height: 100vh;
    background: #0a1a1f;
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
  }
  .menu-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #2a3a3f;
  }
  .back-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 4px 8px;
    width: 40px;
    display: flex;
    align-items: center;
  }
  .header-title {
    flex: 1;
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
  }
  .header-spacer { width: 40px; }
  .menu-section { padding: 14px 20px; }

  .menu-item-svg {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #1a2a2f;
    border-radius: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .menu-item-svg:hover { background: #222; }
  .menu-item-svg:active { background: #2a3a3f; }
  .menu-item-svg.accordion-open {
    margin-bottom: 0;
    border-radius: 12px 12px 0 0;
    background: #1e1e1e;
  }
  .menu-svg-icon {
    color: #888;
    display: flex;
    width: 24px;
    justify-content: center;
    flex-shrink: 0;
  }
  .menu-label { flex: 1; color: #e5e5e5; font-size: 14px; }
  .menu-value { color: #555; font-size: 14px; margin-inline-end: 4px; }
  .menu-chevron-svg {
    color: #333;
    display: flex;
    transition: transform 0.2s;
  }
  .menu-chevron-svg.open { transform: rotate(90deg); }
  .menu-divider { height: 1px; background: #2a3a3f; margin: 12px 0; }
  .menu-item-svg.danger .menu-label { color: #ef4444; }

  .lang-accordion {
    background: #161616;
    border-radius: 0 0 12px 12px;
    margin-bottom: 10px;
    overflow: hidden;
    border-top: 1px solid #2a3a3f;
  }
  .lang-option {
    display: flex;
    align-items: center;
    padding: 11px 16px 11px 48px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .lang-option:hover { background: rgba(255,255,255,0.08); }
  .lang-option.active { background: rgba(58, 122, 122, 0.1); }
  .lang-option.inactive:hover { background: transparent; }
  .lang-dash { color: rgba(255,255,255,0.2); font-size: 14px; margin-inline-end: 10px; }
  .lang-option.inactive .lang-dash { color: rgba(255,255,255,0.08); }
  .lang-name { color: rgba(255,255,255,0.8); font-size: 14px; flex: 1; }
  .lang-check { color: #6a9a9a; display: flex; }
  .lang-soon { font-size: 10px; color: #333; font-style: italic; }

  .support-accordion {
    background: #161616;
    border-radius: 0 0 12px 12px;
    margin-bottom: 10px;
    overflow: hidden;
    border-top: 1px solid #2a3a3f;
  }
  .support-option {
    padding: 12px 16px 12px 48px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .support-option:hover { background: rgba(255,255,255,0.08); }
  .support-text { color: rgba(255,255,255,0.6); font-size: 14px; }

  .about-app-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px 20px;
    gap: 4px;
  }
  .about-app-name { color: #fff; font-size: 18px; font-weight: 600; }
  .about-version { color: #555; font-size: 13px; }
  .about-credits {
    margin-top: 16px;
    padding: 14px 16px;
    background: #1a2a2f;
    border-radius: 12px;
  }
  .about-credits-title { display: block; color: #888; font-size: 12px; margin-bottom: 6px; }
  .about-credits-text { display: block; color: rgba(255,255,255,0.4); font-size: 11px; line-height: 1.5; }

  .legal-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px 40px;
    -webkit-overflow-scrolling: touch;
  }
  .legal-updated { color: rgba(255,255,255,0.2); font-size: 12px; margin-bottom: 20px; }
  .legal-section { margin-bottom: 20px; }
  .legal-title { color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .legal-text { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.65; }

  @media (max-width: 400px) {
    .menu-item-svg { padding: 13px 14px; }
    .menu-label { font-size: 14px; }
  }
`;

export default MenuScreen;
