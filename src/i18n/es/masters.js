// ========================================
// Grandes Maestros — Español (es)
// Estructura i18n · 9 líneas 2 párrafos (1º 5 líneas 3+2 / 2º 4 líneas 2+2)
// 1ª(carga) = pasado (narrativa histórica)
// 2ª(resultado) = presente (descripción de técnicas aplicadas)
// 2026-03-11 수정 반영본
// ========================================

// ========== Información básica ==========
export const mastersBasicInfo = {

  // ===== Nivel de maestro (pantalla de carga) =====
  'vangogh': {
    loading: {
      name: 'Vincent van Gogh (1853–1890)',
      subtitle1: 'Postimpresionismo · Países Bajos',
      subtitle2: 'La pasión del pincel en espiral'
    },
    result: {
      name: 'Vincent van Gogh (1853–1890)',
      subtitle1: 'La noche estrellada · Los girasoles · Autorretrato',
      subtitle2: 'La pasión del pincel en espiral',
      works: {
        'starrynight': { subtitle1: 'La noche estrellada (The Starry Night)', subtitle2: 'El cielo nocturno pintado en espirales' },
        'cafe': { subtitle1: 'Terraza del café por la noche (Café Terrace at Night)', subtitle2: 'Un cálido resplandor amarillo bajo la luz de las estrellas' },
        'sunflowers': { subtitle1: 'Girasoles (Sunflowers)', subtitle2: 'Flores bañadas de sol, ardiendo de pasión' },
        'selfportrait': { subtitle1: 'Autorretrato (Self-Portrait, 1889)', subtitle2: 'Una mirada al espejo del alma' },
        'wheatfield': { subtitle1: 'Campo de trigo con cipreses (Wheat Field with Cypresses)', subtitle2: 'Campos dorados danzando en el viento' },
      }
    },
  },
  'klimt': {
    loading: {
      name: 'Gustav Klimt (1862–1918)',
      subtitle1: 'Art Nouveau · Austria',
      subtitle2: 'El mundo dorado de la sensualidad'
    },
    result: {
      name: 'Gustav Klimt (1862–1918)',
      subtitle1: 'El beso · Adele · El árbol de la vida',
      subtitle2: 'Un mundo de sensualidad dorada',
      works: {
        'kiss': { subtitle1: 'El beso (The Kiss)', subtitle2: 'Un beso eterno disuelto en oro' },
        'treeoflife': { subtitle1: 'El árbol de la vida (The Tree of Life)', subtitle2: 'Ramas doradas cantando la canción de la vida' },
        'adele': { subtitle1: 'Retrato de Adele Bloch-Bauer I', subtitle2: 'Un retrato inmortalizado en oro' },
      }
    },
  },
  'munch': {
    loading: {
      name: 'Edvard Munch (1863–1944)',
      subtitle1: 'Expresionismo · Noruega',
      subtitle2: 'Pintar el grito interior'
    },
    result: {
      name: 'Edvard Munch (1863–1944)',
      subtitle1: 'El grito · Madonna · La danza de la vida',
      subtitle2: 'Pintando el grito interior',
      works: {
        'scream': { subtitle1: 'El grito (The Scream)', subtitle2: 'Un alma llorando bajo un cielo rojo sangre' },
        'madonna': { subtitle1: 'Madonna (Madonna)', subtitle2: 'Una figura misteriosa entre la vida y la muerte' },
        'danceoflife': { subtitle1: 'La danza de la vida (The Dance of Life)', subtitle2: 'Un vals de amor y pérdida' },
      }
    },
  },
  'matisse': {
    loading: {
      name: 'Henri Matisse (1869–1954)',
      subtitle1: 'Fauvismo · Francia',
      subtitle2: 'El mago del color'
    },
    result: {
      name: 'Henri Matisse (1869–1954)',
      subtitle1: 'La danza · La habitación roja · La raya verde',
      subtitle2: 'Maestro del color',
      works: {
        'greenstripe': { subtitle1: 'La raya verde (The Green Stripe)', subtitle2: 'Una sola línea verde que declaró una revolución cromática' },
        'purplecoat': { subtitle1: 'Mujer con abrigo violeta (Woman in a Purple Coat)', subtitle2: 'Elegancia envuelta en color vibrante' },
        'redroom': { subtitle1: 'La habitación roja (The Red Room)', subtitle2: 'Un festín de decoración dominado por el rojo' },
        'derain': { subtitle1: 'Retrato de André Derain (Portrait of André Derain)', subtitle2: 'Un colega fauvista pintado con los colores de lo salvaje' },
      }
    },
  },
  'chagall': {
    loading: {
      name: 'Marc Chagall (1887–1985)',
      subtitle1: 'Surrealismo · Rusia/Francia',
      subtitle2: 'Poeta del amor y los sueños'
    },
    result: {
      name: 'Marc Chagall (1887–1985)',
      subtitle1: 'Amantes con flores · Yo y la aldea · La novia',
      subtitle2: 'Poeta del amor y los sueños',
      works: {
        'lovers': { subtitle1: 'Amantes con flores (Lovers with Flowers)', subtitle2: 'Amor que brilla cálidamente en un ramo' },
        'lamariee': { subtitle1: 'La novia (La Mariée)', subtitle2: 'Una novia flotando entre el sueño y la realidad' },
        'village': { subtitle1: 'Yo y la aldea (I and the Village)', subtitle2: 'Recuerdos del hogar a la deriva como un sueño' },
      }
    },
  },
  'picasso': {
    loading: {
      name: 'Pablo Picasso (1881–1973)',
      subtitle1: 'Cubismo · España',
      subtitle2: 'El revolucionario que deconstruyó la mirada'
    },
    result: {
      name: 'Pablo Picasso (1881–1973)',
      subtitle1: 'Las señoritas de Avignon · Guernica · Retrato de Dora Maar',
      subtitle2: 'Un revolucionario que deconstruyó la visión',
      works: {
        'doramaar': { subtitle1: 'Retrato de Dora Maar (Portrait of Dora Maar)', subtitle2: 'Un retrato deconstruido donde el frente se encuentra con el perfil' },
      }
    },
  },
  'frida': {
    loading: {
      name: 'Frida Kahlo (1907–1954)',
      subtitle1: 'Surrealismo · México',
      subtitle2: 'El autorretrato que enfrentó el dolor'
    },
    result: {
      name: 'Frida Kahlo (1907–1954)',
      subtitle1: 'Yo y mis pericos · La columna rota · Autorretrato con monos',
      subtitle2: 'Autorretrato mirando el dolor',
      works: {
        'parrots': { subtitle1: 'Yo y mis pericos (Me and My Parrots)', subtitle2: 'Un autorretrato en soledad, con loros' },
        'monkeys': { subtitle1: 'Autorretrato con monos (Self-Portrait with Monkeys)', subtitle2: 'Un retrato de dolor, abrazado por monos' },
      }
    },
  },
  'lichtenstein': {
    loading: {
      name: 'Roy Lichtenstein (1923–1997)',
      subtitle1: 'Pop Art · Estados Unidos',
      subtitle2: 'El hombre que convirtió el cómic en arte'
    },
    result: {
      name: 'Roy Lichtenstein (1923–1997)',
      subtitle1: 'In the Car · M-Maybe · Forget It!',
      subtitle2: 'Convertir cómics en arte',
      works: {
        'inthecar': { subtitle1: 'En el auto (In the Car)', subtitle2: 'Tensión silenciosa, emociones a toda velocidad' },
        'mmaybe': { subtitle1: 'Quizás (M-Maybe)', subtitle2: 'Una palabra de duda, un drama Pop Art' },
        'forgetit': { subtitle1: '¡Olvídalo! (Forget It!)', subtitle2: 'Un grito de despedida en una viñeta' },
        'ohhhalright': { subtitle1: 'Ohhh...Alright...', subtitle2: 'Resignación y aceptación en un suspiro' },
        'stilllife': { subtitle1: 'Naturaleza muerta (Still Life with Crystal Bowl)', subtitle2: 'Naturaleza muerta renacida con puntos Ben-Day' }
      }
    }
  },

  // ===== Nivel de obra (pantalla de resultado) =====

  // --- Van Gogh ---
  // --- Klimt ---
  // --- Munch ---
// --- Matisse ---
// --- Chagall ---
// --- Picasso ---
  // --- Frida ---
  // --- Lichtenstein ---
};


// ========== 1ª Educación: Carga (narrativa biográfica) ==========
export const mastersLoadingEducation = {

  // ── Van Gogh ──
  'vangogh': {
    name: 'Van Gogh',
    description: `La técnica de impasto grueso y las pinceladas arremolinadas han sido aplicadas.
El intenso contraste de amarillo y azul expresa directamente la emoción del alma.

Van Gogh es una figura definitoria del Post-Impresionismo.
Comenzó a pintar a los 27 años y produjo 900 pinturas al óleo en solo diez años, pero solo una se vendió durante su vida.
Obras maestras como La noche estrellada, Girasoles y Terraza del café por la noche nacieron en la pobreza y la angustia mental.

"Pongo mi corazón y mi alma en mi trabajo." — Un pintor que forjó belleza inmortal desde el sufrimiento.`
  },

  // ── Klimt ──
  'klimt': {
    name: 'Klimt',
    description: `Láminas de oro real y patrones geométricos inspirados en mosaicos bizantinos han sido aplicados.
Rectángulos a los lados y círculos arriba—los detalles decorativos ahora envuelven tu figura.

Klimt fue el principal pintor Art Nouveau de la Viena de finales del siglo XIX.
Creó una técnica única que combina pintura al óleo con incrustaciones de oro.

"A cada época su arte, a cada arte su libertad." — Un pintor que capturó la belleza del fin de siglo en oro.`
  },

  // ── Munch ──
  'munch': {
    name: 'Munch',
    description: `Curvas arremolinadas, formas distorsionadas y colores intensos han sido aplicados.
Cielos de color rojo sangre y líneas ondulantes expresan ansiedad y emociones profundas.

Munch fue el pionero del Expresionismo que pintó no lo que veía, sino lo que sentía.
Perdió a su madre a los 5 años y a su hermana favorita a los 14—ese trauma se convirtió en la fuente perenne de su obra.

"La enfermedad, la locura y la muerte fueron los ángeles negros que vigilaron mi cuna." — Un pintor que transformó su oscuridad interior en arte.`
  },

  // ── Matisse ──
  'matisse': {
    name: 'Matisse',
    description: `Formas simplificadas y colores primarios audaces han sido aplicados.
En lugar de la precisión anatómica, el enfoque está en expresar la emoción a través del color.

Matisse fue el líder del Fauvismo—movimiento que usó colores salvajes para expresar sentimientos en lugar de realidad.
Descubrió la pintura mientras se recuperaba de una apendicitis a los 20 años y nunca se detuvo.

"El propósito del color no es describir la forma, sino expresar la emoción." — Un pintor que cantó la alegría a través del color.`
  },

  // ── Chagall ──
  'chagall': {
    name: 'Chagall',
    description: `Una atmósfera onírica de rosa, azul cobalto y colores joya ha sido aplicada.
Bouquets, amantes flotantes y animales fantásticos flotan entre el sueño y la realidad.

Chagall nació en Vitebsk, Bielorrusia, y encontró allí todos los colores de su vida.
Su amor por Bella, su esposa de toda la vida, se convirtió en el tema eterno de su obra.

"En nuestra vida solo hay un color: el color del amor." — Un poeta que borró la frontera entre el sueño y la realidad.`
  },

  // ── Picasso ──
  'picasso': {
    name: 'Picasso',
    description: `Las técnicas cubistas que deconstruyen los sujetos en planos geométricos y muestran el frente y el lado simultáneamente han sido aplicadas.
Tu rostro ahora está en todas partes a la vez—visto desde todos los ángulos simultáneamente.

Picasso fue el artista más influyente del siglo XX.
A los 13 años, ya pintaba mejor que su padre, que era profesor de arte.

Junto con Braque, desarrolló el Cubismo—una revolución que destruyó la perspectiva tradicional y abrió la puerta al arte abstracto.`
  },

  // ── Frida ──
  'frida': {
    name: 'Frida Kahlo',
    description: `Colores folclóricos mexicanos tradicionales, follaje tropical y comunión con animales han sido aplicados.
En Autorretrato con collar de espinas, el dolor se convierte en arte.

A los 18 años, Frida Kahlo sufrió un terrible accidente de autobús que le destrozó la columna vertebral.
Durante la recuperación, comenzó a pintar—transformando el dolor en arte.

"Pies, ¿para qué los quiero si tengo alas para volar?" — Una pintora invencible que transformó el dolor en arte.`
  },

  // ── Lichtenstein ──
  'lichtenstein': {
    name: 'Lichtenstein',
    description: `Las técnicas del pop art que usan puntos Ben-Day de cómics impresos, contornos negros gruesos y colores primarios han sido aplicadas.
Tu rostro ahora parece un panel de cómic—brillante, audaz y lleno de expresión dramática.

En 1961, Lichtenstein pintó un cómic de Mickey Mouse y el mundo del arte se sacudió.
La revista Life preguntó: '¿Es el peor artista de EE.UU.?'

"No dibujo cómics, pinto cuadros sobre cómics." — Un pintor que borró la línea entre la cultura pop y las bellas artes.`
  }
};


// ========== 2ª Educación: Resultado (técnicas por obra) ==========
export const mastersResultEducation = {
  'vangogh-selfportrait': {
    description: `El fondo arremolinado y las gruesas pinceladas de impasto de 〈Autorretrato〉 han sido aplicados.
Los tonos fríos de verde y azul crean una intensidad psicológica.

〈Autorretrato〉 es el espejo en el que Van Gogh se miraba a sí mismo—y nosotros con él.
Durante sus 10 años de carrera, pintó más de 30 autorretratos, cada uno revelando diferentes capas del alma.

Este retrato, con su fondo azul arremolinado, es considerado la cúspide de su capacidad técnica y expresión interior.`
  },
  'klimt-kiss': {
    description: `El fondo de lámina de oro y los patrones decorativos geométricos de 〈El beso〉 han sido aplicados.
Rectángulos y círculos se alternan creando un manto dorado que envuelve a dos figuras.

〈El beso〉 es la obra maestra del Art Nouveau que ahora es una de las pinturas más amadas del mundo.
El oro real brilla sobre el lienzo—Klimt mezcló técnicas de pintura tradicional con materiales lujosos.

Dos figuras que se abrazan en el borde de un precipicio se han convertido en símbolo universal del amor y la vulnerabilidad.`
  },
  'klimt-adele': {
    description: `La decoración en oro y plata y los colores como joyas del 〈Retrato de Adele Bloch-Bauer I〉 han sido aplicados.
Un choker de diamantes y un vestido dorado con motivos geométricos crean un mundo de opulenta decoración.

〈Adele〉 es la cumbre de la fase dorada de Klimt, una obra maestra completada en cuatro años con más de 100 bocetos preparatorios.
Inspirados en los mosaicos bizantinos, el oro y la plata lo envuelven todo, dejando solo el rostro y las manos en un realismo fotográfico.`
  },
  'klimt-treeoflife': {
    description: `Las curvas espirales y los patrones decorativos dorados de 〈El árbol de la vida〉 han sido aplicados.
Triángulos, ojos y espirales superpuestos crean un tapiz de vida y muerte.

〈El árbol de la vida〉 es la pieza central del Friso Stoclet—una decoración mural monumental que Klimt creó para un palacio en Bruselas.
El árbol de ramas en espiral simboliza el ciclo eterno de la vida.

Es el ejemplo perfecto del Gesamtkunstwerk—obra de arte total que une pintura, arquitectura y artesanía.`
  },
  'munch-scream': {
    description: `Las curvas ondulantes y las formas distorsionadas de 〈El Grito〉 han sido aplicadas.
Un cielo rojo sangre y líneas temblorosas expresan pura ansiedad existencial.

〈El Grito〉 nació de una experiencia real de Munch—una tarde en Oslo, sintió que la naturaleza 'le gritaba'.
Tres versiones en pintura y una en pastel—cada una capturando el momento en que el ser humano siente el vacío del universo.

Ahora es el símbolo visual de la ansiedad moderna más reconocido en el mundo.`
  },
  'munch-madonna': {
    description: `El halo rojo y las curvas sensuales ondulantes de 〈Madonna〉 han sido aplicados.
En la frontera entre la vida y la muerte, la figura se alza con los ojos cerrados.

〈Madonna〉 no es una Madonna religiosa—es la celebración de Munch del nacimiento, el amor y la muerte en una sola figura.
Olas rojas envuelven la figura desnuda, mientras el marco muestra un feto y una calavera.

Es una meditación sobre el ciclo eterno de la vida que solo Munch podía expresar con tal valentía.`
  },
  'matisse-redroom': {
    description: `La composición de planos de color plano que desafía la perspectiva en 〈La habitación roja〉 ha sido aplicada.
La pared roja y la mesa roja se fusionan en una sola—los patrones de arabescos cubren todo el espacio.

〈La habitación roja〉 fue originalmente pintada en azul, pero Matisse la repintó de rojo justo antes de terminar.
Incluso la vista por la ventana aparece como decoración plana—borrando el límite entre interior y exterior.

Esto es prueba de la valentía de Matisse: que el color puede ser más poderoso que la realidad.`
  },
  'picasso-doramaar': {
    description: `La vista simultánea de frente y de lado de 〈Retrato de Dora Maar〉 ha sido aplicada.
Colores primarios intensos llenan los planos geométricos.

Dora Maar era fotógrafa y artista que se convirtió en musa y amante de Picasso durante la Segunda Guerra Mundial.
〈Retrato de Dora Maar〉 captura su rostro desde múltiples ángulos simultáneamente—expresión visual de la complejidad psicológica de una persona.

Picasso luego dijo: 'Dora, para mí, siempre estaba llorando.' Esta pintura es un monumento a su inteligencia y sufrimiento.`
  },
  'lichtenstein-inthecar': {
    description: `Los puntos Ben-Day y los contornos negros gruesos de 〈En el coche〉 han sido aplicados.
Solo colores primarios puros llenan los contornos gruesos—como un panel de cómic ampliado.

〈En el coche〉 captura a una pareja en un automóvil en el estilo de cómic característico de Lichtenstein.
Las expresiones faciales planas y la distancia emocional entre las dos figuras crean la ironía fría característica de Lichtenstein.

Esta pintura pregunta: ¿estamos realmente conectados, o solo somos imágenes de conexión?`
  },


  // ── Van Gogh ──
  // ── Klimt ──
  // ── Munch ──
// ── Matisse ──
// ── Chagall ──
// ── Picasso ──
  // ── Frida ──
  // ── Lichtenstein ──
  // ===== Respaldo por artista (cuando no se identifica obra específica) =====
  'vangogh': {
    name: 'Estilo Van Gogh',
    description: `Se ha aplicado el estilo expresivo de Van Gogh, con sus pinceladas en espiral y colores intensos.
Las pinceladas fuertes y direccionales crean texturas vibrantes llenas de energía emocional.

El contraste entre azul profundo y amarillo brillante define la paleta de un artista que pintó con el corazón.
Un estilo inconfundible donde cada trazo revela el alma atormentada y apasionada del pintor.`
  },
  'klimt': {
    name: 'Estilo Klimt',
    description: `Se ha aplicado el estilo decorativo de Klimt, con pan de oro y patrones geométricos.
Los mosaicos dorados y las espirales ornamentales crean un mundo de lujo sensual.

Figuras planas envueltas en patrones donde lo orgánico y lo geométrico se entrelazan.
La estética de la Secesión vienesa, donde la decoración se convierte en expresión del alma.`
  },
  'munch': {
    name: 'Estilo Munch',
    description: `Se ha aplicado el estilo expresionista de Munch, con colores inquietantes y formas ondulantes.
Las líneas sinuosas y los tonos enfermizos transmiten directamente la angustia psicológica.

Paisajes que se distorsionan al ritmo de las emociones internas, donde nada permanece estable.
El lenguaje visual de la ansiedad, pionero en convertir el interior del alma en imagen.`
  },
  'matisse': {
    name: 'Estilo Matisse',
    description: `Se ha aplicado el estilo fauvista de Matisse, con colores puros y formas simplificadas.
Primarios audaces se disponen sin respetar la realidad, y las formas se reducen a su esencia.

La línea se convierte en danza y el color en música — cada elemento canta con independencia.
El arte de la alegría pura, donde el color es libre de toda obligación descriptiva.`
  },
  'chagall': {
    name: 'Estilo Chagall',
    description: `Se ha aplicado el estilo onírico de Chagall, con colores pastel y figuras flotantes.
Amantes, animales y tejados flotan en un espacio sin gravedad, teñido de nostalgia.

Rosas, violetas y azules se funden como recuerdos que se mezclan en sueños.
Un mundo donde el amor y la memoria desafían las leyes de la física y del tiempo.`
  },
  'picasso': {
    name: 'Estilo Picasso',
    description: `Se ha aplicado el estilo cubista de Picasso, con formas geométricas y perspectiva múltiple.
Rostros y cuerpos se fragmentan en planos angulares, mostrando varios puntos de vista simultáneamente.

Líneas audaces y colores contrastantes construyen una realidad deconstruida y recompuesta.
La revolución visual que destruyó 500 años de perspectiva tradicional.`
  },
  'frida': {
    name: 'Estilo Frida Kahlo',
    description: `Se ha aplicado el estilo simbólico de Frida, con colores mexicanos y una mirada frontal intensa.
Rojos, verdes y amarillos de la tradición mexicana enmarcan una iconografía profundamente personal.

Cada elemento — espinas, animales, plantas — es un símbolo codificado de dolor, resistencia y amor.
El arte de la confesión donde el cuerpo roto se convierte en territorio de identidad y lucha.`
  },
  'lichtenstein': {
    name: 'Estilo Lichtenstein',
    description: `Se ha aplicado el estilo Pop Art de Lichtenstein, con puntos Ben-Day y contornos gruesos.
Patrones de puntos regulares y colores primarios planos transforman la estética del cómic en arte.

Negro, rojo, azul y amarillo en composiciones gráficas que cuestionan qué es arte y qué es cultura popular.
La esencia del Pop Art que borró la frontera entre el museo y la cultura de masas.`
  },
  'vangogh-starrynight': {
    description: `Se ha aplicado la técnica de impasto arremolinado de 〈La noche estrellada〉.
El intenso contraste del azul cobalto y el amarillo cromo libera la energía de la noche.

〈La noche estrellada〉 fue la visión reimaginada de Van Gogh del paisaje más allá de la ventana del sanatorio en Saint-Rémy.
En lugar de pintar el cielo nocturno real, proyectó su tormento interior sobre las estrellas.`
  },
  'vangogh-cafe': {
    description: `Se ha aplicado la técnica de paisaje nocturno de colores complementarios de 〈Terraza del café por la noche〉, sin usar negro.
Las luces de gas amarillas y el cielo azul oscuro expresan la oscuridad solo a través del contraste de colores.

〈Terraza del café por la noche〉 fue la primera escena nocturna al aire libre que Van Gogh pintó bajo la luz de las estrellas en la Place du Forum de Arlés.
Las sillas vacías en la terraza y las figuras que pasan guardan tanto la quietud como el calor de la noche.`
  },
  'vangogh-sunflowers': {
    description: `Se han aplicado las sutiles variaciones tonales del amarillo cromo único en 〈Girasoles〉.
La pintura aplicada en capas gruesas captura la textura de los pétalos tal como son.

〈Girasoles〉 es una serie que Van Gogh pintó para decorar la Casa Amarilla en Arlés antes de la llegada de Gauguin.
Flores en plena floración, flores marchitas y semillas juntas revelan el ciclo de la vida.`
  },
  'vangogh-wheatfield': {
    description: `Se han aplicado las pinceladas curvas dinámicas y los contrastes de colores complementarios de 〈Campo de trigo con cipreses〉.
El trigo agitado por el viento y los cipreses como llamas transmiten la energía vital de la naturaleza.

〈Campo de trigo con cipreses〉 es un paisaje que Van Gogh pintó repetidamente cerca del sanatorio en Saint-Rémy.
El horizonte dorado del campo de trigo y el ciprés vertical conectan la tierra y el cielo.`
  },
  'matisse-greenstripe': {
    description: `Se ha aplicado la audaz división de planos de color que bisecta el rostro en 〈La raya verde〉.
Rosa, amarillo y verde coexisten en la piel, ignorando completamente el color natural.

〈La raya verde〉 es un retrato que Matisse pintó de su esposa Amélie, provocando los gritos de '¡bestias salvajes!' en el Salón de 1905.
Una sola raya verde en el centro del rostro divide la luz y la sombra solo a través del color.`
  },
  'matisse-purplecoat': {
    description: `Se han aplicado los intensos planos de color y la composición plana decorativa de 〈Mujer con abrigo morado〉.
El límite entre la figura y el fondo se disuelve, con el color mismo creando espacio.

〈Mujer con abrigo morado〉 es una obra donde Matisse transmitió emoción a través de formas simplificadas y color puro.
El vasto plano de color del abrigo morado domina el lienzo, fusionándose con los patrones del fondo como uno solo.`
  },
  'matisse-derain': {
    description: `Se han aplicado las pinceladas ásperas y los colores de piel antinaturales de 〈Retrato de André Derain〉.
Sombras verdes y piel naranja, con colores primarios audaces, representan al sujeto de manera salvaje y fauvista.

〈Retrato de André Derain〉 es un retrato de amistad que Matisse pintó de su compañero artista André Derain.
Los dos pintores intercambiaron retratos el uno del otro al mismo tiempo, compartiendo sus experimentos fauvistas juntos.`
  },
  'chagall-lovers': {
    description: `Se han aplicado los colores oníricos y las imágenes superpuestas de 〈Amantes con flores〉.
El rosa, el azul cobalto y el violeta se mezclan, borrando el límite entre el sueño y la realidad.

〈Amantes con flores〉 es una obra que Chagall pintó sobre su amor por Bella, su musa y esposa de toda la vida.
Un ramo vívido de flores rojas y blancas brilla sobre un fondo de verde profundo y azul marino, expresando la calidez del amor.`
  },
  'chagall-lamariee': {
    description: `Se ha aplicado el contraste onírico de los ramos rojos y el cielo nocturno azul en 〈La Mariée〉.
Animales y figuras se mezclan como apariciones, desplegando una fantasía festiva.

〈La Mariée〉 captura los tejados y las agujas de la iglesia de la ciudad natal de Chagall, Vitebsk, como un paisaje de memoria.
La novia sosteniendo un ramo rojo, superpuesta con la escena del pueblo, guarda tanto nostalgia como alegría.`
  },
  'chagall-village': {
    description: `Se han aplicado las múltiples perspectivas y las imágenes superpuestas transparentemente de 〈Yo y el pueblo〉.
Personas, animales y escenarios del pueblo se entremezclan como en un sueño, desafiando escala y proporción.

〈Yo y el pueblo〉 fue pintado en París mientras Chagall añoraba su ciudad natal de Vitebsk.
La realidad y la memoria se fusionan en un solo lienzo, capturando un anhelo interminable por el hogar.`
  },
  'munch-danceoflife': {
    description: `Se ha aplicado el contraste simbólico de colores claros y oscuros en 〈La danza de la vida〉.
Con la mujer central en vestido rojo como eje, la inocencia y la desesperación se colocan a cada lado.

〈La danza de la vida〉 es la obra autobiográfica de Munch que comprime recuerdos de amor y corazón roto en un solo lienzo.
Colores claros y oscuros se alternan en un solo lienzo, capturando tanto el comienzo como el fin del amor.`
  },
  'frida-parrots': {
    description: `Se han aplicado la intensa mirada frontal y los colores populares mexicanos de 〈Yo y mis pericos〉.
Rojos, verdes y azules vívidos llenan el lienzo junto con el follaje tropical.

〈Yo y mis pericos〉 es un autorretrato en el que Frida está rodeada de cuatro pericos.
Los pericos son mensajeros de amor en el folclore mexicano, y fieles compañeros en la soledad de Frida.`
  },
  'frida-monkeys': {
    description: `Se han aplicado la mirada frontal y el exuberante fondo tropical de 〈Autorretrato con monos〉.
Entre hojas verde oscuro, sus intensos ojos y cejas unidas revelan su identidad.

〈Autorretrato con monos〉 es un autorretrato que Frida pintó con sus monos mascota.
En la mitología mexicana los monos simbolizan el deseo, pero para Frida eran sustitutos de los hijos que nunca pudo tener.`
  },
  'lichtenstein-mmaybe': {
    description: `Se han aplicado los puntos Ben-Day y la narrativa de cómic de los globos de diálogo en 〈M-Quizás〉.
Los colores primarios llenan planos dentro de contornos gruesos, recreando la textura de una página impresa.

〈M-Quizás〉 fue una obra que Lichtenstein conservó en su colección personal, que se vendió por $30,000—cinco veces el precio habitual.
Ahora se exhibe como pieza central de la colección de Pop Art en el Museum Ludwig de Colonia, Alemania.`
  },
  'lichtenstein-forgetit': {
    description: `Se han aplicado los puntos Ben-Day y los intensos contrastes de colores primarios de 〈¡Olvídalo!〉.
Los gruesos contornos negros fijan la forma como un panel de cómic, comprimiendo la emoción dramáticamente.

〈¡Olvídalo!〉 es una obra maestra temprana creada justo después de la primera exposición individual de Lichtenstein en 1962.
Ese mismo año, la revista Life publicó el titular: '¿Es el Peor Artista de EE.UU.?'—sobre él.`
  },
  'lichtenstein-ohhhalright': {
    description: `Se han aplicado los puntos Ben-Day y la composición de planos de color plano de 〈Ohhh...Está bien...〉.
El rojo, el azul y el amarillo se separan limpiamente dentro de contornos negros, tan nítidos como una página impresa.

〈Ohhh...Está bien...〉 es una obra de 1964 tomada del número #88 de Secret Hearts.
Se vendió por $42,6 millones en Christie\'s en 2010, revirtiendo el valor de lo que él llamó 'lienzo usado'.`
  },
  'lichtenstein-stilllife': {
    description: `Se han aplicado los puntos Ben-Day y los contornos gruesos que crean expresión plana en 〈Naturaleza muerta〉.
Los planos de colores primarios simplifican los objetos de manera similar a un cómic, recreando la textura de la impresión.

〈Naturaleza muerta〉 es parte de una serie de los años 70 en la que Lichtenstein reinterpretó un género tradicional como homenaje a Picasso.
'No hay estado de ánimo en mis naturalezas muertas—solo limones y toronjas', dijo.`
  },

};
export default { mastersBasicInfo, mastersLoadingEducation, mastersResultEducation };
