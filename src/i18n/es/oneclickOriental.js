// ========================================
// One-Click Pintura oriental — Español (es)
// v69 - 2026-02-03 (estructura: país→estilo)
// ----------------------------------------
// 1ª: tono poético (carga, expectación)
// 2ª: definición del país (fijo) → presentación del estilo (variable)
// ========================================

// ==================== Información básica (resultado 2ª) ====================

export const oneclickOrientalBasicInfo = {
  // Corea
  'korean-minhwa': {
    name: 'Pintura tradicional coreana (Korean Traditional Painting)',
    subtitle1: 'Minhwa (Minhwa)',
    subtitle2: 'Los deseos del pueblo hechos imagen'
  },
  'korean-pungsokdo': {
    name: 'Pintura tradicional coreana (Korean Traditional Painting)',
    subtitle1: 'Pungsokdo (Pungsokdo)',
    subtitle2: 'La vida cotidiana hecha arte'
  },
  'korean-jingyeong': {
    name: 'Pintura tradicional coreana (Korean Traditional Painting)',
    subtitle1: 'Jingyeong Sansuhwa (Jingyeong Sansuhwa)',
    subtitle2: 'Las montañas de Joseon con ojos propios'
  },
  // China
  'chinese-ink': {
    name: 'Pintura tradicional china (Chinese Traditional Painting)',
    subtitle1: 'Tinta (Ink Wash)',
    subtitle2: 'El paisaje del espíritu en tinta'
  },
  'chinese-gongbi': {
    name: 'Pintura tradicional china (Chinese Traditional Painting)',
    subtitle1: 'Gongbi (Gongbi)',
    subtitle2: 'La cumbre de la precisión'
  },
  // Japón
  'japanese-ukiyoe': {
    name: 'Pintura tradicional japonesa (Japanese Traditional Painting)',
    subtitle1: 'Ukiyo-e (Ukiyo-e)',
    subtitle2: 'El mundo flotante grabado en madera'
  },
  'japanese-rinpa': {
    name: 'Pintura tradicional japonesa (Japanese Traditional Painting)',
    subtitle1: 'Rinpa (Rinpa)',
    subtitle2: 'La estética decorativa sobre pan de oro'
  }
};

// ==================== 1ª Educación (pantalla de carga) ====================

export const oneclickOrientalPrimary = {
  content: `Cuando Occidente llenaba, Oriente vaciaba.
El arte de decir sin pintar.

Corea, entre la tinta y el vacío.
China, entre el paisaje y la ornamentación.
Japón, donde lo efímero y lo espléndido coexisten.

Tres países, tres puntas de pincel.
Ahora, tú te detienes aquí.`
};

// ==================== 2ª Educación (pantalla de resultado) ====================

export const oneclickOrientalSecondary = {

  // ========== Corea ==========
  'korean-minhwa': {
    content: `La pintura tradicional coreana es un arte que honra el vacío y alberga el espíritu en el pincel.
Los letrados pintaban con tinta; el pueblo, con color.

La minhwa son las pinturas donde el pueblo de Joseon plasmó sus deseos de vida.
Tigres, urracas, peonías y otros motivos simbólicos se disponen con libertad.`
  },

  'korean-pungsokdo': {
    content: `La pintura tradicional coreana es un arte que honra el vacío y alberga el espíritu en el pincel.
Los letrados pintaban con tinta; el pueblo, con color.

La pungsokdo son las pinturas que registran la vida cotidiana de la gente común de Joseon.
Lucha, lavandería y escenas de escuela, capturadas con trazos ágiles y ligeros.`
  },

  'korean-jingyeong': {
    content: `La pintura tradicional coreana es un arte que honra el vacío y alberga el espíritu en el pincel.
Los letrados pintaban con tinta; el pueblo, con color.

La jingyeong sansuhwa son las pinturas que retratan directamente las montañas reales de Joseon.
Gyeomjae Jeong Seon la perfeccionó con trazos verticales y composiciones audaces.`
  },

  // ========== China ==========
  'chinese-ink': {
    content: `La pintura tradicional china es un arte que captura el qi del universo con gradaciones de tinta.
El espíritu del literato y la técnica cortesana coexistieron durante mil años.

La pintura de tinta es el arte del literato que pintaba el mundo solo con gradaciones de tinta.
El vacío que no se pinta es lo que más dice.`
  },

  'chinese-gongbi': {
    content: `La pintura tradicional china es un arte que captura el qi del universo con gradaciones de tinta.
El espíritu del literato y la técnica cortesana coexistieron durante mil años.

La gongbi es la pintura cortesana de precisión impecable, sin un solo trazo fuera de lugar.
Capas de color transparente superpuestas crean profundidad y brillo.`
  },

  // ========== Japón ==========
  'japanese-ukiyoe': {
    content: `La pintura tradicional japonesa es un arte donde la sensibilidad popular y el esplendor cortesano coexisten.
Los grabados callejeros y la pintura decorativa dorada hicieron florecer cada una su propia belleza.

El ukiyo-e son los grabados en madera que disfrutaba el pueblo en la era Edo.
Sus contornos gruesos y planos de color inspiraron a los impresionistas.`
  },

  'japanese-rinpa': {
    content: `La pintura tradicional japonesa es un arte donde la sensibilidad popular y el esplendor cortesano coexisten.
Los grabados callejeros y la pintura decorativa dorada hicieron florecer cada una su propia belleza.

La rinpa es la pintura cortesana que decoró la naturaleza con esplendor sobre pan de oro.
Capas de color superpuestas crean en flores y olas una difuminación natural.`
  }
};

export default {
  oneclickOrientalBasicInfo,
  oneclickOrientalPrimary,
  oneclickOrientalSecondary
};
