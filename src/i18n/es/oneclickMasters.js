// ========================================
// One-Click Grandes Maestros — Español (es)
// v69 - 2026-02-03 (2 párrafos prosa, BasicInfo añadido)
// ----------------------------------------
// 1ª: tono poético (carga, expectación)
// 2ª: explicativo (definición → técnica/estilo → características → significado/valoración)
// ========================================

// ==================== Información básica (resultado 2ª) ====================

export const oneclickMastersBasicInfo = {
  'vangogh': {
    name: 'Vincent van Gogh (1853–1890)',
    subtitle1: 'La noche estrellada · Los girasoles · Autorretrato',
    subtitle2: 'La pasión del pincel en espiral'
  },
  'klimt': {
    name: 'Gustav Klimt (1862–1918)',
    subtitle1: 'El beso · Judit · El árbol de la vida',
    subtitle2: 'El mundo dorado de la sensualidad'
  },
  'munch': {
    name: 'Edvard Munch (1863–1944)',
    subtitle1: 'El grito · Madonna · Pubertad',
    subtitle2: 'Pintar el grito interior'
  },
  'matisse': {
    name: 'Henri Matisse (1869–1954)',
    subtitle1: 'La danza · La habitación roja · La mujer del sombrero',
    subtitle2: 'El mago del color'
  },
  'chagall': {
    name: 'Marc Chagall (1887–1985)',
    subtitle1: 'Sobre la ciudad · Yo y la aldea · Ramo de flores con amantes',
    subtitle2: 'Poeta del amor y los sueños'
  },
  'picasso': {
    name: 'Pablo Picasso (1881–1973)',
    subtitle1: 'Las señoritas de Avignon · Guernica · Retrato de Dora Maar',
    subtitle2: 'El revolucionario que deconstruyó la mirada'
  },
  'frida': {
    name: 'Frida Kahlo (1907–1954)',
    subtitle1: 'La columna rota · Collar de espinas y colibrí',
    subtitle2: 'El autorretrato que enfrentó el dolor'
  },
  'lichtenstein': {
    name: 'Roy Lichtenstein (1923–1997)',
    subtitle1: 'Chica ahogándose · ¡Whaam! · En el coche',
    subtitle2: 'El hombre que convirtió el cómic en arte'
  }
};

// ==================== 1ª Educación (pantalla de carga) ====================

export const oneclickMastersPrimary = {
  content: `Siete maestros: antes de ser genios,
fueron personas buscando su propio lenguaje.

Van Gogh dejó 900 obras en diez años y partió;
sus estrellas siguen girando en espiral.

Klimt escondió amor y muerte bajo el oro;
Munch exhaló el grito de la pérdida durante toda su vida.

Matisse protegió la alegría del color incluso en la guerra;
Chagall voló por los cielos junto a quien amaba.

Frida enfrentó su cuerpo roto con la mirada;
Lichtenstein cuestionó al mundo con una viñeta de cómic.

Preguntaron, rompieron y reconstruyeron.
Siete mundos. Ahora tú respondes.`
};

// ==================== 2ª Educación (pantalla de resultado) ====================

export const oneclickMastersSecondary = {

  'vangogh': {
    content: `Van Gogh fue un pintor que reveló sus emociones directamente a través del color.
Usaba la técnica del empaste, apilando pintura gruesa, y sus pinceladas se arremolinan con violencia.

El intenso contraste complementario entre amarillo y azul domina el lienzo.
En cada trazo de pincel queda grabada, intacta, su pasión y su soledad.`
  },

  'klimt': {
    content: `Klimt fue el pintor que retrató el sueño dorado de la Viena del fin de siglo.
Aplicaba verdadero pan de oro sobre el lienzo, y los patrones geométricos inspirados en mosaicos bizantinos se repiten.

Espirales, círculos y triángulos crean un ritmo decorativo en toda la superficie.
Bajo ese brillo dorado, la sensualidad y lo sagrado se entrelazan.`
  },

  'munch': {
    content: `Munch fue un pintor que no pintó lo que se ve, sino lo que se siente.
Con curvas en espiral y formas distorsionadas, reveló la psicología humana directamente.

Cielos color sangre y colores enfermizos visualizan la angustia existencial y el terror.
De la punta de su pincel brota el grito interior.`
  },

  'matisse': {
    content: `Matisse fue un pintor que liberó el color como lenguaje de las emociones.
No siguió el color real: puso verde, violeta y naranja sin vacilar incluso sobre los rostros.

Las formas complejas se simplifican con audacia en curvas y planos.
En sus lienzos, el color canta por sí mismo.`
  },

  'chagall': {
    content: `Chagall fue un pintor que volcó amor y sueños sobre el lienzo.
Con colores de ensueño y composiciones irreales, pintó mundos de recuerdos y fantasía.

Rosas, lavandas y azul cobalto envuelven los recuerdos de su Vitebsk natal.
En sus lienzos, la realidad y el sueño se funden sin fronteras.`
  },

  'picasso': {
    content: `Picasso fue el mayor revolucionario del siglo XX, fundador del Cubismo.
Descompuso los objetos en planos geométricos y reensamblaba múltiples perspectivas en un solo lienzo.

La estructura de perspectiva múltiple, donde frente y perfil coexisten, es su sello.
Destruyó 500 años de orden perspectivo.`
  },

  'frida': {
    content: `Frida Kahlo fue una artista que sublimó el dolor en arte.
Con una mirada frontal intensa y elementos simbólicos, se enfrentó a sí misma.

Los rojos, amarillos y verdes del folclore mexicano dominan el lienzo.
En su lienzo, dolor y existencia se hacen uno.`
  },

  'lichtenstein': {
    content: `Lichtenstein fue un maestro del Pop Art que elevó el cómic a la categoría de arte.
Amplió a gran escala los puntos Ben-Day de la impresión y fijó las formas con gruesos contornos negros.

Solo los primarios puros — rojo, azul y amarillo — llenan el lienzo.
Borró la frontera entre cultura popular y bellas artes.`
  }
};

export default {
  oneclickMastersBasicInfo,
  oneclickMastersPrimary,
  oneclickMastersSecondary
};
