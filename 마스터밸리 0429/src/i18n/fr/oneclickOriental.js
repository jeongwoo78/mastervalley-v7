// ========================================
// One-Click Peinture orientale — Français (fr)
// 2026-03-11
// ----------------------------------------
// 1re : ton poétique (chargement, attente)
// 2e : définition du pays (fixe) → présentation du style (variable)
// ========================================

// ==================== Informations de base (résultat 2e) ====================

export const oneclickOrientalBasicInfo = {
  // Corée
  'korean-minhwa': {
    name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
    subtitle1: 'Minhwa (Minhwa)',
    subtitle2: 'Les vœux du peuple en images'
  },
  'korean-pungsokdo': {
    name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
    subtitle1: 'Pungsokdo (Pungsokdo)',
    subtitle2: 'Le quotidien fait art'
  },
  'korean-jingyeong': {
    name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
    subtitle1: 'Jingyeong Sansuhwa (Jingyeong Sansuhwa)',
    subtitle2: 'Les montagnes de Joseon vues de ses propres yeux'
  },
  // Chine
  'chinese-ink': {
    name: 'Peinture traditionnelle chinoise (Chinese Traditional Painting)',
    subtitle1: 'Encre (Ink Wash)',
    subtitle2: 'Le paysage de l\'esprit en encre'
  },
  'chinese-gongbi': {
    name: 'Peinture traditionnelle chinoise (Chinese Traditional Painting)',
    subtitle1: 'Gongbi (Gongbi)',
    subtitle2: 'Le sommet de la précision'
  },
  // Japon
  'japanese-ukiyoe': {
    name: 'Peinture traditionnelle japonaise (Japanese Traditional Painting)',
    subtitle1: 'Ukiyo-e (Ukiyo-e)',
    subtitle2: 'Le monde flottant gravé sur bois'
  },
  'japanese-rinpa': {
    name: 'Peinture traditionnelle japonaise (Japanese Traditional Painting)',
    subtitle1: 'Rinpa (Rinpa)',
    subtitle2: 'L\'esthétique décorative sur feuille d\'or'
  }
};

// ==================== 1re Éducation (écran de chargement) ====================

export const oneclickOrientalPrimary = {
  content: `Quand l\'Occident remplissait, l\'Orient vidait.
L\'art de dire sans peindre.

La Chine, entre le paysage et l\'ornement.
Le Japon, où l\'éphémère et le splendide coexistent.
La Corée, entre l\'encre et le vide.

Trois pays, trois pointes de pinceau.
Maintenant, c\'est vous qui vous arrêtez ici.`
};

// ==================== 2e Éducation (écran de résultat) ====================

export const oneclickOrientalSecondary = {

  // ========== Corée ==========
  'korean-minhwa': {
    content: `La peinture traditionnelle coréenne est un art qui honore le vide et abrite l\'esprit dans le pinceau.
Les lettrés peignaient à l\'encre ; le peuple, en couleur.

La minhwa est la peinture où le peuple de Joseon exprima ses vœux de vie.
Tigres, pies, pivoines et d\'autres motifs symboliques sont disposés librement.`
  },

  'korean-pungsokdo': {
    content: `La peinture traditionnelle coréenne est un art qui honore le vide et abrite l\'esprit dans le pinceau.
Les lettrés peignaient à l\'encre ; le peuple, en couleur.

La pungsokdo est la peinture qui enregistre le quotidien des gens ordinaires de Joseon.
Lutte, lessive et scènes d\'école, captées par des traits agiles et légers.`
  },

  'korean-jingyeong': {
    content: `La peinture traditionnelle coréenne est un art qui honore le vide et abrite l\'esprit dans le pinceau.
Les lettrés peignaient à l\'encre ; le peuple, en couleur.

La jingyeong sansuhwa est la peinture qui dépeint directement les montagnes réelles de Joseon.
Gyeomjae Jeong Seon la perfectionna avec des traits verticaux et des compositions audacieuses.`
  },

  // ========== Chine ==========
  'chinese-ink': {
    content: `La peinture traditionnelle chinoise est un art qui capte le qi de l\'univers par les dégradés de l\'encre.
L\'esprit du lettré et la technique de la cour coexistèrent pendant mille ans.

La peinture à l\'encre est l\'art du lettré qui peignait le monde avec les seuls dégradés de l\'encre.
Le vide non peint est ce qui dit le plus.`
  },

  'chinese-gongbi': {
    content: `La peinture traditionnelle chinoise est un art qui capte le qi de l\'univers par les dégradés de l\'encre.
L\'esprit du lettré et la technique de la cour coexistèrent pendant mille ans.

La gongbi est la peinture de cour d\'une précision impeccable, sans un seul trait de travers.
Des couches de couleur transparente superposées créent la profondeur.`
  },

  // ========== Japon ==========
  'japanese-ukiyoe': {
    content: `La peinture traditionnelle japonaise est un art où la sensibilité populaire et la splendeur de la cour coexistent.
Les estampes des rues et la peinture décorative dorée firent fleurir chacune leur beauté.

L\'ukiyo-e est l\'estampe sur bois que le peuple d\'Edo appréciait.
Ses contours épais et ses aplats de couleur inspirèrent les impressionnistes.`
  },

  'japanese-rinpa': {
    content: `La peinture traditionnelle japonaise est un art où la sensibilité populaire et la splendeur de la cour coexistent.
Les estampes des rues et la peinture décorative dorée firent fleurir chacune leur beauté.

La rinpa est la peinture de cour qui décora la nature avec splendeur sur feuille d\'or.
Des couches de couleur superposées créent dans les fleurs et les vagues une diffusion naturelle.`
  }
};

export default {
  oneclickOrientalBasicInfo,
  oneclickOrientalPrimary,
  oneclickOrientalSecondary
};
