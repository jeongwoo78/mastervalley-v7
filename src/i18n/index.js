// ========================================
// i18n — v75 (8개 언어 지원)
// ko + en: 정적 import
// ja, id, th, tr, vi, ar: 동적 import
// ========================================

// ── 정적 import (ko + en) ──────────────
import * as koMasters           from './ko/masters.js';
import * as enMasters           from './en/masters.js';
import * as koMovements         from './ko/movements.js';
import * as enMovements         from './en/movements.js';
import * as koOriental          from './ko/oriental.js';
import * as enOriental          from './en/oriental.js';
import * as koOneclickMasters   from './ko/oneclickMasters.js';
import * as enOneclickMasters   from './en/oneclickMasters.js';
import * as koOneclickMovements from './ko/oneclickMovements.js';
import * as enOneclickMovements from './en/oneclickMovements.js';
import * as koOneclickOriental  from './ko/oneclickOriental.js';
import * as enOneclickOriental  from './en/oneclickOriental.js';
import { ui as koUi }           from './ko/ui.js';
import { ui as enUi }           from './en/ui.js';
import { masterChat as koMasterChat } from './ko/masterChat.js';
import { masterChat as enMasterChat } from './en/masterChat.js';

// ── 동적 로더 ───────────────────────────
const makeDynamicLoader = (lang) => async () => {
  const [masters, movements, oriental, ui, masterChat] = await Promise.all([
    import(`./${lang}/masters.js`),
    import(`./${lang}/movements.js`),
    import(`./${lang}/oriental.js`),
    import(`./${lang}/ui.js`),
    import(`./${lang}/masterChat.js`),
  ]);
  return {
    masters, movements, oriental,
    oneclickMasters:   enOneclickMasters,
    oneclickMovements: enOneclickMovements,
    oneclickOriental:  enOneclickOriental,
    ui:         ui.ui,
    masterChat: masterChat.masterChat,
  };
};

const dynamicLoaders = {
  ja: makeDynamicLoader('ja'),
  id: makeDynamicLoader('id'),
  th: makeDynamicLoader('th'),
  tr: makeDynamicLoader('tr'),
  vi: makeDynamicLoader('vi'),
  ar: makeDynamicLoader('ar'),
};

// ── 저장소 ──────────────────────────────
const languages = {
  ko: { masters: koMasters, movements: koMovements, oriental: koOriental,
        oneclickMasters: koOneclickMasters, oneclickMovements: koOneclickMovements,
        oneclickOriental: koOneclickOriental, ui: koUi, masterChat: koMasterChat },
  en: { masters: enMasters, movements: enMovements, oriental: enOriental,
        oneclickMasters: enOneclickMasters, oneclickMovements: enOneclickMovements,
        oneclickOriental: enOneclickOriental, ui: enUi, masterChat: enMasterChat },
};

let currentLang = 'en';

// ── setLanguage (async) ─────────────────
export const setLanguage = async (lang) => {
  if (lang === currentLang) return;
  if (languages[lang]) { currentLang = lang; return; }
  if (dynamicLoaders[lang]) {
    try {
      languages[lang] = await dynamicLoaders[lang]();
      currentLang = lang;
    } catch (e) {
      console.warn(`Failed to load language: ${lang}, fallback to en`);
      currentLang = 'en';
    }
    return;
  }
  currentLang = 'en';
};

export const getLanguage = () => currentLang;

export const t = (key) => {
  const keys = key.split('.');
  let value = languages[currentLang]?.ui;
  for (const k of keys) value = value?.[k];
  return value || key;
};

// ── Getters ──────────────────────────────
const L = (lang) => languages[lang] || languages['en'];

export const getUi         = (lang = currentLang) => L(lang).ui;
export const getMasterChat = (lang = currentLang) => L(lang).masterChat;
export const getEducation  = (type, lang = currentLang) => L(lang)[type];

export const getMovementsBasicInfo        = (lang = currentLang) => L(lang).movements?.movementsBasicInfo;
export const getMovementsLoadingEducation = (lang = currentLang) => L(lang).movements?.movementsLoadingEducation;
export const getMovementsResultEducation  = (lang = currentLang) => L(lang).movements?.movementsResultEducation;

export const getMastersBasicInfo          = (lang = currentLang) => L(lang).masters?.mastersBasicInfo;
export const getMastersLoadingEducation   = (lang = currentLang) => L(lang).masters?.mastersLoadingEducation;
export const getMastersResultEducation    = (lang = currentLang) => L(lang).masters?.mastersResultEducation;

export const getOrientalBasicInfo         = (lang = currentLang) => L(lang).oriental?.orientalBasicInfo;
export const getOrientalLoadingEducation  = (lang = currentLang) => L(lang).oriental?.orientalLoadingEducation;
export const getOrientalResultEducation   = (lang = currentLang) => L(lang).oriental?.orientalResultEducation;

export const getOneclickMovementsPrimary   = (lang = currentLang) => L(lang).oneclickMovements?.oneclickMovementsPrimary;
export const getOneclickMovementsSecondary = (lang = currentLang) => L(lang).oneclickMovements?.oneclickMovementsSecondary;
export const getOneclickMastersPrimary     = (lang = currentLang) => L(lang).oneclickMasters?.oneclickMastersPrimary;
export const getOneclickMastersSecondary   = (lang = currentLang) => L(lang).oneclickMasters?.oneclickMastersSecondary;
export const getOneclickOrientalPrimary    = (lang = currentLang) => L(lang).oneclickOriental?.oneclickOrientalPrimary;
export const getOneclickOrientalSecondary  = (lang = currentLang) => L(lang).oneclickOriental?.oneclickOrientalSecondary;

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English',    native: 'English'          },
  { code: 'ko', name: 'Korean',     native: '한국어'            },
  { code: 'ja', name: 'Japanese',   native: '日本語'            },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia'  },
  { code: 'th', name: 'Thai',       native: 'ภาษาไทย'          },
  { code: 'tr', name: 'Turkish',    native: 'Türkçe'           },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt'       },
  { code: 'ar', name: 'Arabic',     native: 'العربية'          },
];

export default { setLanguage, getLanguage, t, getEducation, getMasterChat, getSupportedLanguages };
