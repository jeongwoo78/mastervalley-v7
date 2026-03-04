// ========================================
// Peinture orientale — Français (fr)
// Structure i18n · 9 lignes 2 paragraphes (1er 3+2 / 2e 2+2)
// 1re(chargement) = passé (récit historique)
// 2e(résultat) = présent (techniques appliquées)
// v70 - 2026-02-03 (subtitle1, subtitle2 séparés)
// ========================================

// ========== Informations de base ==========
export const orientalBasicInfo = {
  // ── Niveau pays (écran de chargement) ──
  'korean': {
    loading: {
      name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
      subtitle1: 'Minhwa · Pungsokdo · Jingyeong Sansuhwa',
      subtitle2: 'L\'esprit dans le vide'
    }
  },
  'chinese': {
    loading: {
      name: 'Peinture traditionnelle chinoise (Chinese Traditional Painting)',
      subtitle1: 'Encre · Gongbi',
      subtitle2: 'L\'univers dans l\'encre'
    }
  },
  'japanese': {
    loading: {
      name: 'Peinture traditionnelle japonaise (Japanese Traditional Painting)',
      subtitle1: 'Ukiyo-e · Rinpa',
      subtitle2: 'Estampes populaires, décors dorés de cour'
    }
  },

  // ── Niveau genre (écran de résultat) ──
  'korean-minhwa': {
    result: {
      name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
      subtitle1: 'Minhwa (Minhwa)',
      subtitle2: 'Les vœux du peuple en images'
    }
  },
  'korean-pungsokdo': {
    result: {
      name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
      subtitle1: 'Pungsokdo (Pungsokdo)',
      subtitle2: 'Le quotidien fait art'
    }
  },
  'korean-jingyeong': {
    result: {
      name: 'Peinture traditionnelle coréenne (Korean Traditional Painting)',
      subtitle1: 'Jingyeong Sansuhwa (Jingyeong Sansuhwa)',
      subtitle2: 'Les montagnes de Joseon vues de ses propres yeux'
    }
  },
  'chinese-gongbi': {
    result: {
      name: 'Peinture traditionnelle chinoise (Chinese Traditional Painting)',
      subtitle1: 'Gongbi (Gongbi)',
      subtitle2: 'La précision forgée au pinceau'
    }
  },
  'chinese-ink': {
    result: {
      name: 'Peinture traditionnelle chinoise (Chinese Traditional Painting)',
      subtitle1: 'Encre (Ink Wash)',
      subtitle2: 'Le paysage de l\'esprit en encre'
    }
  },
  'japanese-ukiyoe': {
    result: {
      name: 'Peinture traditionnelle japonaise (Japanese Traditional Painting)',
      subtitle1: 'Ukiyo-e (Ukiyo-e)',
      subtitle2: 'Le monde flottant gravé sur bois'
    }
  },
  'japanese-rinpa': {
    result: {
      name: 'Peinture traditionnelle japonaise (Japanese Traditional Painting)',
      subtitle1: 'Rinpa (Rinpa)',
      subtitle2: 'L\'esthétique décorative sur feuille d\'or'
    }
  }
};


// ========== 1re Éducation : Panorama par pays (chargement, 5 lignes = 3+2, passé) ==========
export const orientalLoadingEducation = {

  // ── Corée ──
  korean: {
    description: `Les peintres de Joseon apprirent les techniques chinoises, mais ce qu'ils peignirent, ce fut leur propre terre et leur peuple.
La minhwa invoquait la bonne fortune avec des pies et des tigres ; la pungsokdo enregistrait la vie du peuple.
La jingyeong sansuhwa ne peignait pas des paysages idéalisés, mais les montagnes réelles qui s'étendaient devant leurs yeux.

Un art où le vide parle et le pinceau abrite l'esprit : telle est la peinture traditionnelle coréenne.
Vœux, quotidien et montagnes captés par le pinceau, éclos comme l'essence de cette terre.`
  },

  // ── Chine ──
  chinese: {
    description: `Devant un seul paysage peint, le lettré chinois lisait le monde entier.
La peinture à l'encre dressait les montagnes par de simples dégradés d'encre et faisait naître la brume avec le vide.
La gongbi peignait jusqu'au dernier pétale avec une précision minutieuse pour l'offrir à l'empereur.

La source millénaire de la peinture orientale est la peinture traditionnelle chinoise.
Mille ans tissés d'encre et de couleur : la racine de toute la peinture de l'Est.`
  },

  // ── Japon ──
  japanese: {
    description: `Dans les rues d'Edo fleurirent les estampes ; dans les cours de Kyoto, la peinture décorative.
L'ukiyo-e gravait acteurs, beautés et paysages célèbres sur des blocs de bois pour le peuple.
La rinpa peignait des iris et des dieux du vent sur feuille d'or, captivant l'aristocratie.

Un art où la sensibilité populaire et la splendeur de la cour coexistent : telle est la peinture traditionnelle japonaise.
Née dans les rues et les cours, elle traversa les mers et ébranla l'Occident.`
  }
};


// ========== 2e Éducation : Résultat par genre (résultat, 4 lignes = 2+2, présent) ==========
export const orientalResultEducation = {

  // ── Corée : Minhwa ──
  'korean-minhwa': {
    description: `Les couleurs vives et la composition libre de la minhwa ont été appliquées.
Peinte avec les cinq couleurs cardinales (bleu, rouge, jaune, blanc, noir) et disposée librement sans perspective.

La pivoine symbolise la richesse, la carpe l'ascension sociale et le tigre chasse les mauvais esprits.
Art populaire de Joseon qui ornait les paravents de chaque foyer, porteur de vœux et d'espérances.`
  },

  // ── Corée : Pungsokdo ──
  'korean-pungsokdo': {
    description: `Les traits rapides et la couleur sobre de la pungsokdo ont été appliqués.
La technique du pinceau fin et de la couleur légère capte le mouvement et les expressions, laissant de l'espace avec le vide.

Lutteurs, lavandières, un enfant endormi à l'école — le quotidien de Joseon prend vie.
Le réalisme coréen que Kim Hong-do et Shin Yun-bok firent fleurir à la pointe du pinceau.`
  },

  // ── Corée : Jingyeong Sansuhwa ──
  'korean-jingyeong': {
    description: `Les traits vigoureux et la composition audacieuse de la jingyeong sansuhwa ont été appliqués.
Abandonnant le paysage idéalisé, on peint directement ce que l'on voit : les montagnes réelles devant les yeux.

Les pics acérés du mont Geumgang et la pluie tombant sur l'Inwangsan revivent à travers des traits puissants.
L'esthétique que Gyeomjae Jeong Seon perfectionna : le vrai paysage de cette terre.`
  },

  // ── Chine : Gongbi ──
  'chinese-gongbi': {
    description: `Le trait précis et la couleur transparente de la gongbi ont été appliqués.
On trace d'abord le contour au pinceau fin, puis on superpose des couches de couleur transparente pour créer la profondeur.

Fleurs, oiseaux et figures sont peints avec une précision minutieuse, captivant l'empereur.
Le sommet de la miniature orientale et l'exquise subtilité chromatique née à la cour.`
  },

  // ── Chine : Encre ──
  'chinese-ink': {
    description: `La diffusion de l'encre et l'esthétique du vide de la peinture à l'encre ont été appliquées.
Avec les seuls dégradés de l'encre, on exprime montagnes, eau, brume et nuages ; le vide devient un espace infini.

La technique de l'encre éclaboussée capte la force vitale de la nature.
La quintessence de mille ans de peinture orientale, où le lettré transposa l'esprit sur la toile.`
  },

  // ── Japon : Ukiyo-e ──
  'japanese-ukiyoe': {
    description: `Les contours puissants et les aplats de couleur de l'ukiyo-e ont été appliqués.
Des lignes audacieuses définissent la forme et l'intérieur est rempli de zones de couleur plate.

Comme La Grande Vague de Kanagawa de Hokusai, un instant de dynamisme est gravé sur une seule planche.
Le regard qui traversa d'Orient en Occident, inspirant les impressionnistes.`
  },

  // ── Japon : Rinpa ──
  'japanese-rinpa': {
    description: `La décoration sur feuille d'or et la composition audacieuse de la rinpa ont été appliquées.
Sur la feuille d'or, on dépose des pigments et on laisse couler des couches de couleur pour créer des textures naturelles.

Comme les Iris d'Ogata Kōrin, une nature splendide s'épanouit sur le doré.
La quintessence de la peinture décorative japonaise, née du goût aristocratique et source d'inspiration de l'Art nouveau.`
  },


  // ── Valeurs par défaut (quand le genre n'est pas identifié, présent) ──
  'korean_default': {
    description: `Le trait et l'esthétique du vide de la peinture traditionnelle coréenne ont été appliqués.
Les lettrés peignaient à l'encre ; le peuple, en couleur — chacun exprimant la vie à sa manière.

Un art où le vide parle et le pinceau abrite l'esprit : telle est l'esthétique coréenne.
La cristallisation de cinq cents ans de Joseon qui coule à travers minhwa, pungsokdo et jingyeong sansuhwa.`
  },
  'chinese_default': {
    description: `L'harmonie de l'encre et de la couleur de la peinture traditionnelle chinoise a été appliquée.
D'un seul dégradé d'encre on dresse les montagnes ; d'un seul vide on fait naître la brume.

L'esprit du lettré et la technique de la cour coexistent : telle est la peinture chinoise.
La source millénaire de la peinture orientale qui coule à travers gongbi et encre.`
  },
  'japanese_default': {
    description: `Les contours et les aplats décoratifs de la peinture traditionnelle japonaise ont été appliqués.
Des contours audacieux et des couleurs brillantes sur feuille d'or gravent la beauté.

Un art où les estampes populaires d'Edo et la peinture décorative de cour coexistent.
Née dans les rues et les cours, elle traversa les mers et ébranla l'Occident.`
  }
};


export default { orientalBasicInfo, orientalLoadingEducation, orientalResultEducation };
