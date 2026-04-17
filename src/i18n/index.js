// ========================================
// i18n — v77 (11개 언어 전부 정적 import)
// 11개 외 언어는 영어(en) fallback
// ========================================

// ── en ──
import * as enMasters           from './en/masters.js';
import * as enMovements         from './en/movements.js';
import * as enOriental          from './en/oriental.js';
import * as enOneclickMasters   from './en/oneclickMasters.js';
import * as enOneclickMovements from './en/oneclickMovements.js';
import * as enOneclickOriental  from './en/oneclickOriental.js';
import { ui as enUi }           from './en/ui.js';
import { masterChat as enMasterChat } from './en/masterChat.js';

// ── ko ──
import * as koMasters           from './ko/masters.js';
import * as koMovements         from './ko/movements.js';
import * as koOriental          from './ko/oriental.js';
import * as koOneclickMasters   from './ko/oneclickMasters.js';
import * as koOneclickMovements from './ko/oneclickMovements.js';
import * as koOneclickOriental  from './ko/oneclickOriental.js';
import { ui as koUi }           from './ko/ui.js';
import { masterChat as koMasterChat } from './ko/masterChat.js';

// ── ja ──
import * as jaMasters           from './ja/masters.js';
import * as jaMovements         from './ja/movements.js';
import * as jaOriental          from './ja/oriental.js';
import * as jaOneclickMasters   from './ja/oneclickMasters.js';
import * as jaOneclickMovements from './ja/oneclickMovements.js';
import * as jaOneclickOriental  from './ja/oneclickOriental.js';
import { ui as jaUi }           from './ja/ui.js';
import { masterChat as jaMasterChat } from './ja/masterChat.js';

// ── id ──
import * as idMasters           from './id/masters.js';
import * as idMovements         from './id/movements.js';
import * as idOriental          from './id/oriental.js';
import * as idOneclickMasters   from './id/oneclickMasters.js';
import * as idOneclickMovements from './id/oneclickMovements.js';
import * as idOneclickOriental  from './id/oneclickOriental.js';
import { ui as idUi }           from './id/ui.js';
import { masterChat as idMasterChat } from './id/masterChat.js';

// ── th ──
import * as thMasters           from './th/masters.js';
import * as thMovements         from './th/movements.js';
import * as thOriental          from './th/oriental.js';
import * as thOneclickMasters   from './th/oneclickMasters.js';
import * as thOneclickMovements from './th/oneclickMovements.js';
import * as thOneclickOriental  from './th/oneclickOriental.js';
import { ui as thUi }           from './th/ui.js';
import { masterChat as thMasterChat } from './th/masterChat.js';

// ── tr ──
import * as trMasters           from './tr/masters.js';
import * as trMovements         from './tr/movements.js';
import * as trOriental          from './tr/oriental.js';
import * as trOneclickMasters   from './tr/oneclickMasters.js';
import * as trOneclickMovements from './tr/oneclickMovements.js';
import * as trOneclickOriental  from './tr/oneclickOriental.js';
import { ui as trUi }           from './tr/ui.js';
import { masterChat as trMasterChat } from './tr/masterChat.js';

// ── ar ──
import * as arMasters           from './ar/masters.js';
import * as arMovements         from './ar/movements.js';
import * as arOriental          from './ar/oriental.js';
import * as arOneclickMasters   from './ar/oneclickMasters.js';
import * as arOneclickMovements from './ar/oneclickMovements.js';
import * as arOneclickOriental  from './ar/oneclickOriental.js';
import { ui as arUi }           from './ar/ui.js';
import { masterChat as arMasterChat } from './ar/masterChat.js';

// ── es ──
import * as esMasters           from './es/masters.js';
import * as esMovements         from './es/movements.js';
import * as esOriental          from './es/oriental.js';
import * as esOneclickMasters   from './es/oneclickMasters.js';
import * as esOneclickMovements from './es/oneclickMovements.js';
import * as esOneclickOriental  from './es/oneclickOriental.js';
import { ui as esUi }           from './es/ui.js';
import { masterChat as esMasterChat } from './es/masterChat.js';

// ── fr ──
import * as frMasters           from './fr/masters.js';
import * as frMovements         from './fr/movements.js';
import * as frOriental          from './fr/oriental.js';
import * as frOneclickMasters   from './fr/oneclickMasters.js';
import * as frOneclickMovements from './fr/oneclickMovements.js';
import * as frOneclickOriental  from './fr/oneclickOriental.js';
import { ui as frUi }           from './fr/ui.js';
import { masterChat as frMasterChat } from './fr/masterChat.js';

// ── pt ──
import * as ptMasters           from './pt/masters.js';
import * as ptMovements         from './pt/movements.js';
import * as ptOriental          from './pt/oriental.js';
import * as ptOneclickMasters   from './pt/oneclickMasters.js';
import * as ptOneclickMovements from './pt/oneclickMovements.js';
import * as ptOneclickOriental  from './pt/oneclickOriental.js';
import { ui as ptUi }           from './pt/ui.js';
import { masterChat as ptMasterChat } from './pt/masterChat.js';

// ── zh-TW ──
import * as zhTWMasters           from './zh-TW/masters.js';
import * as zhTWMovements         from './zh-TW/movements.js';
import * as zhTWOriental          from './zh-TW/oriental.js';
import * as zhTWOneclickMasters   from './zh-TW/oneclickMasters.js';
import * as zhTWOneclickMovements from './zh-TW/oneclickMovements.js';
import * as zhTWOneclickOriental  from './zh-TW/oneclickOriental.js';
import { ui as zhTWUi }           from './zh-TW/ui.js';
import { masterChat as zhTWMasterChat } from './zh-TW/masterChat.js';

// ── 저장소 ──────────────────────────────
const languages = {
  en: { masters: enMasters, movements: enMovements, oriental: enOriental,
        oneclickMasters: enOneclickMasters, oneclickMovements: enOneclickMovements,
        oneclickOriental: enOneclickOriental, ui: enUi, masterChat: enMasterChat },
  ko: { masters: koMasters, movements: koMovements, oriental: koOriental,
        oneclickMasters: koOneclickMasters, oneclickMovements: koOneclickMovements,
        oneclickOriental: koOneclickOriental, ui: koUi, masterChat: koMasterChat },
  ja: { masters: jaMasters, movements: jaMovements, oriental: jaOriental,
        oneclickMasters: jaOneclickMasters, oneclickMovements: jaOneclickMovements,
        oneclickOriental: jaOneclickOriental, ui: jaUi, masterChat: jaMasterChat },
  id: { masters: idMasters, movements: idMovements, oriental: idOriental,
        oneclickMasters: idOneclickMasters, oneclickMovements: idOneclickMovements,
        oneclickOriental: idOneclickOriental, ui: idUi, masterChat: idMasterChat },
  th: { masters: thMasters, movements: thMovements, oriental: thOriental,
        oneclickMasters: thOneclickMasters, oneclickMovements: thOneclickMovements,
        oneclickOriental: thOneclickOriental, ui: thUi, masterChat: thMasterChat },
  tr: { masters: trMasters, movements: trMovements, oriental: trOriental,
        oneclickMasters: trOneclickMasters, oneclickMovements: trOneclickMovements,
        oneclickOriental: trOneclickOriental, ui: trUi, masterChat: trMasterChat },
  ar: { masters: arMasters, movements: arMovements, oriental: arOriental,
        oneclickMasters: arOneclickMasters, oneclickMovements: arOneclickMovements,
        oneclickOriental: arOneclickOriental, ui: arUi, masterChat: arMasterChat },
  es: { masters: esMasters, movements: esMovements, oriental: esOriental,
        oneclickMasters: esOneclickMasters, oneclickMovements: esOneclickMovements,
        oneclickOriental: esOneclickOriental, ui: esUi, masterChat: esMasterChat },
  fr: { masters: frMasters, movements: frMovements, oriental: frOriental,
        oneclickMasters: frOneclickMasters, oneclickMovements: frOneclickMovements,
        oneclickOriental: frOneclickOriental, ui: frUi, masterChat: frMasterChat },
  pt: { masters: ptMasters, movements: ptMovements, oriental: ptOriental,
        oneclickMasters: ptOneclickMasters, oneclickMovements: ptOneclickMovements,
        oneclickOriental: ptOneclickOriental, ui: ptUi, masterChat: ptMasterChat },
  'zh-TW': { masters: zhTWMasters, movements: zhTWMovements, oriental: zhTWOriental,
              oneclickMasters: zhTWOneclickMasters, oneclickMovements: zhTWOneclickMovements,
              oneclickOriental: zhTWOneclickOriental, ui: zhTWUi, masterChat: zhTWMasterChat },
};

let currentLang = 'en';

// ── setLanguage (동기) ──────────────────
export const setLanguage = (lang) => {
  currentLang = languages[lang] ? lang : 'en';
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
  { code: 'en',    name: 'English',             native: 'English'          },
  { code: 'ko',    name: 'Korean',              native: '한국어'            },
  { code: 'ja',    name: 'Japanese',            native: '日本語'            },
  { code: 'id',    name: 'Indonesian',          native: 'Bahasa Indonesia'  },
  { code: 'th',    name: 'Thai',                native: 'ไทย'              },
  { code: 'tr',    name: 'Turkish',             native: 'Türkçe'           },
  { code: 'ar',    name: 'Arabic',              native: 'العربية'          },
  { code: 'es',    name: 'Spanish',             native: 'Español'          },
  { code: 'fr',    name: 'French',              native: 'Français'         },
  { code: 'pt',    name: 'Portuguese',          native: 'Português'        },
  { code: 'zh-TW', name: 'Traditional Chinese', native: '繁體中文'          },
];

export default { setLanguage, getLanguage, t, getEducation, getMasterChat, getSupportedLanguages };
