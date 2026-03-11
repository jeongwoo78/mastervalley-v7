// ========================================
// Pintura oriental — Español (es)
// Estructura i18n · 9 líneas 2 párrafos (1º 3+2 / 2º 2+2)
// 1ª(carga) = pasado (narrativa histórica)
// 2ª(resultado) = presente (técnicas aplicadas)
// 2026-03-11 수정 반영본
// ========================================

// ========== Información básica ==========
export const orientalBasicInfo = {
  // ── Nivel de país (pantalla de carga) ──
  'korean': {
    loading: {
      name: 'Pintura tradicional coreana (Korean Traditional Painting)',
      subtitle1: 'Minhwa · Pungsokdo · Jingyeong Sansuhwa',
      subtitle2: 'El espíritu en el vacío'
    }
  },
  'chinese': {
    loading: {
      name: 'Pintura tradicional china (Chinese Traditional Painting)',
      subtitle1: 'Tinta · Gongbi',
      subtitle2: 'El universo en la tinta'
    }
  },
  'japanese': {
    loading: {
      name: 'Pintura tradicional japonesa (Japanese Traditional Painting)',
      subtitle1: 'Ukiyo-e · Rinpa',
      subtitle2: 'Grabados populares, dorada decoración cortesana'
    }
  },

  // ── Nivel de género (pantalla de resultado) ──
  'korean-minhwa': {
    result: {
      name: 'Pintura tradicional coreana (Korean Traditional Painting)',
      subtitle1: 'Minhwa (Minhwa)',
      subtitle2: 'Los deseos del pueblo hechos imagen'
    }
  },
  'korean-pungsokdo': {
    result: {
      name: 'Pintura tradicional coreana (Korean Traditional Painting)',
      subtitle1: 'Pungsokdo (Pungsokdo)',
      subtitle2: 'La vida cotidiana hecha arte'
    }
  },
  'korean-jingyeong': {
    result: {
      name: 'Pintura tradicional coreana (Korean Traditional Painting)',
      subtitle1: 'Jingyeong Sansuhwa (Jingyeong Sansuhwa)',
      subtitle2: 'Las montañas de Joseon con ojos propios'
    }
  },
  'chinese-gongbi': {
    result: {
      name: 'Pintura tradicional china (Chinese Traditional Painting)',
      subtitle1: 'Gongbi (Gongbi)',
      subtitle2: 'Precisión forjada con el pincel'
    }
  },
  'chinese-ink': {
    result: {
      name: 'Pintura tradicional china (Chinese Traditional Painting)',
      subtitle1: 'Tinta (Ink Wash)',
      subtitle2: 'El paisaje del espíritu en tinta'
    }
  },
  'japanese-ukiyoe': {
    result: {
      name: 'Pintura tradicional japonesa (Japanese Traditional Painting)',
      subtitle1: 'Ukiyo-e (Ukiyo-e)',
      subtitle2: 'El mundo flotante grabado en madera'
    }
  },
  'japanese-rinpa': {
    result: {
      name: 'Pintura tradicional japonesa (Japanese Traditional Painting)',
      subtitle1: 'Rinpa (Rinpa)',
      subtitle2: 'La estética decorativa sobre pan de oro'
    }
  }
};


// ========== 1ª Educación: Panorama por país (carga, 5 líneas = 3+2, pasado) ==========
export const orientalLoadingEducation = {

  // ── Corea ──
  korean: {
    description: `Los pintores de Joseon aprendieron las técnicas chinas, pero lo que pintaron fue su propia tierra y su gente.
La minhwa invocaba la buena fortuna con urracas y tigres; la pungsokdo registraba la vida del pueblo llano.
La jingyeong sansuhwa no pintaba paisajes idealizados, sino las montañas reales que se extendían ante sus ojos.

Un arte donde el vacío habla y el pincel alberga el espíritu: esa es la pintura tradicional coreana.
Deseos, cotidianidad y montañas captados con el pincel, florecidos como algo propio de esta tierra.`
  },

  // ── China ──
  chinese: {
    description: `Ante un solo paisaje pintado, el literato chino leía el mundo entero.
La pintura de tinta levantaba montañas con simples gradaciones de tinta y hacía brotar la niebla con el vacío.
La gongbi pintaba hasta el último pétalo con minuciosa precisión para ofrecerla al emperador.

La fuente milenaria de la pintura oriental es la pintura tradicional china.
Mil años tejidos con tinta y color: la raíz de toda la pintura del Este.`
  },

  // ── Japón ──
  japanese: {
    description: `En las calles de Edo florecieron los grabados; en las cortes de Kioto, la pintura decorativa.
El ukiyo-e grababa actores, bellezas y paisajes famosos en bloques de madera para el pueblo.
La rinpa pintaba lirios y dioses del viento sobre pan de oro, cautivando los ojos de la aristocracia.

Un arte donde la sensibilidad popular y el esplendor cortesano coexisten: esa es la pintura tradicional japonesa.
La pintura tradicional japonesa, nacida en las calles y las cortes, cruzó el mar e influyó profundamente en el arte occidental.`
  }
};


// ========== 2ª Educación: Resultado por género (resultado, 4 líneas = 2+2, presente) ==========
export const orientalResultEducation = {

  // ── Corea: Minhwa ──
  'korean-minhwa': {
    description: `Se han aplicado los colores vivos y la composición libre de la minhwa.
Pintada con los cinco colores cardinales (azul, rojo, amarillo, blanco, negro) y dispuesta libremente sin perspectiva.

La peonía simboliza riqueza, la carpa representa el ascenso social y el tigre ahuyenta los males.
Minhwa es arte popular de Joseon que adornaba los biombos de cada hogar, portando deseos y esperanzas.`
  },

  // ── Corea: Pungsokdo ──
  'korean-pungsokdo': {
    description: `Se han aplicado los trazos rápidos y el color sobrio de la pungsokdo.
La técnica de pincel fino y color ligero captura el movimiento y las expresiones, dejando espacio con el vacío.

Luchadores, lavanderas, un niño durmiendo en la escuela — la vida cotidiana de Joseon cobra vida.
Pungsokdo es el realismo coreano que Kim Hong-do y Shin Yun-bok hicieron florecer con la punta del pincel.`
  },

  // ── Corea: Jingyeong Sansuhwa ──
  'korean-jingyeong': {
    description: `Se han aplicado los trazos vigorosos y la composición audaz de la jingyeong sansuhwa.
Abandonando el paisaje idealizado, se pinta directamente lo que se ve: las montañas reales ante los ojos.

Los picos afilados del monte Geumgang y la lluvia cayendo sobre el Inwangsan reviven con trazos poderosos.
Jingyeong Sansuhwa es la estética que Gyeomjae Jeong Seon perfeccionó: el verdadero paisaje de esta tierra.`
  },

  // ── China: Gongbi ──
  'chinese-gongbi': {
    description: `Se han aplicado el trazo preciso y el color transparente de la gongbi.
Primero se traza el contorno con un pincel fino, luego se superponen capas de color transparente para crear profundidad.

Flores, pájaros y figuras se pintan con minuciosa precisión, cautivando al emperador.
Gongbi es la cumbre de la miniatura oriental y la exquisitez cromática nacida en la corte.`
  },

  // ── China: Tinta ──
  'chinese-ink': {
    description: `Se han aplicado la difuminación de la tinta y la estética del vacío de la pintura de tinta.
Solo con las gradaciones de la tinta se expresan montañas, agua, niebla y nubes; el vacío se convierte en espacio infinito.

La técnica de tinta salpicada captura la fuerza vital de la naturaleza.
La quintaesencia de mil años de pintura oriental, donde el literato trasladó el espíritu al lienzo.`
  },

  // ── Japón: Ukiyo-e ──
  'japanese-ukiyoe': {
    description: `Se han aplicado los contornos potentes y los planos de color del ukiyo-e.
Líneas audaces definen la forma y el interior se llena de áreas de color plano.

Como La Gran Ola de Kanagawa de Hokusai, un instante de dinamismo queda grabado en una sola plancha.
Ukiyo-e es la mirada que cruzó de Oriente a Occidente, inspirando a los impresionistas.`
  },

  // ── Japón: Rinpa ──
  'japanese-rinpa': {
    description: `Se han aplicado la decoración en pan de oro y la composición audaz de la rinpa.
Sobre el pan de oro se depositan pigmentos y se dejan fluir capas de color para crear texturas naturales.

Como los Lirios de Ogata Kōrin, una naturaleza espléndida florece sobre el dorado.
Rinpa es la quintaesencia de la pintura decorativa japonesa, nacida del gusto aristocrático e inspiración del Art Nouveau.`
  },


  // ── Valores por defecto (cuando no se identifica género, presente) ──
  'korean_default': {
    description: `Se han aplicado el trazo y la estética del vacío de la pintura tradicional coreana.
Los letrados pintaban con tinta; el pueblo, con color — cada uno expresando la vida a su manera.

Un arte donde el vacío habla y el pincel alberga el espíritu: esa es la estética coreana.
La pintura tradicional coreana, representada por minhwa, pungsokdo y jingyeong sansuhwa, es un arte que floreció durante 500 años de Joseon.`
  },
  'chinese_default': {
    description: `Se han aplicado la armonía de tinta y color de la pintura tradicional china.
Con una sola gradación de tinta se levantan montañas; con un solo vacío se hace brotar la niebla.

El espíritu del literato y la técnica cortesana coexisten: eso es la pintura china.
La fuente milenaria de la pintura oriental que fluye a través de gongbi y tinta.`
  },
  'japanese_default': {
    description: `Se han aplicado los contornos y los planos decorativos de la pintura tradicional japonesa.
Contornos audaces y colores brillantes sobre pan de oro graban la belleza.

Un arte donde los grabados populares de Edo y la pintura decorativa cortesana coexisten.
La pintura tradicional japonesa, nacida en las calles y las cortes, cruzó el mar e influyó profundamente en el arte occidental.`
  }
};


export default { orientalBasicInfo, orientalLoadingEducation, orientalResultEducation };
