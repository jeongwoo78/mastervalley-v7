// ========================================
// One-Click Movimientos — Español (es)
// v69 - 2026-02-03 (estructura: movimiento→artista)
// ----------------------------------------
// 1ª: tono poético (carga, expectación)
// 2ª: definición/características del movimiento (fijo) → presentación del artista (variable)
// ========================================

// ==================== 1ª Educación (pantalla de carga) ====================

export const oneclickMovementsPrimary = {
  content: `¿Cómo sería el cuerpo perfecto?
¿Cómo se debería pintar a Dios?
¿De qué color es la luz?
¿Qué forma tiene la tristeza?

Ahora, tu foto se encuentra con esas preguntas.

Hace 2800 años, en Grecia, el cuerpo humano se convirtió en piedra.
El Medievo eligió a Dios; el Renacimiento, al ser humano.
La luz se hizo Barroco; el sueño se hizo Rococó.

Tras la revolución, la razón, la emoción y la realidad se separaron.
Y la cámara pregunta: "¿Qué pintamos ahora?"

Luz y estructura, color y alma, y la decisión de romper las reglas.

Once movimientos. Ahora te toca a ti.`
};

// ==================== Información básica (resultado 2ª) ====================

export const oneclickMovementsBasicInfo = {

  // ----- Antigua Grecia-Roma -----
  'classical-sculpture': {
    name: 'Antigua Grecia y Roma (Ancient Greek & Roman, 800 a.C.–500 d.C.)',
    subtitle1: 'Escultura griega (Classical Sculpture)',
    subtitle2: 'El origen de la proporción perfecta'
  },
  'roman-mosaic': {
    name: 'Antigua Grecia y Roma (Ancient Greek & Roman, 800 a.C.–500 d.C.)',
    subtitle1: 'Mosaico romano (Roman Mosaic)',
    subtitle2: 'Historias talladas en piedra'
  },

  // ----- Medieval -----
  'byzantine': {
    name: 'Arte Medieval (Medieval Art, siglos IV–XIV)',
    subtitle1: 'Bizantino (Byzantine)',
    subtitle2: 'El mundo dorado de lo divino'
  },
  'gothic': {
    name: 'Arte Medieval (Medieval Art, siglos IV–XIV)',
    subtitle1: 'Gótico (Gothic)',
    subtitle2: 'El cielo construido con luz'
  },
  'islamic-miniature': {
    name: 'Arte Medieval (Medieval Art, siglos IV–XIV)',
    subtitle1: 'Miniatura islámica (Islamic Miniature)',
    subtitle2: 'Precisión de joyas'
  },

  // ----- Renacimiento -----
  'leonardo': {
    name: 'Renacimiento (Renaissance, siglos XIV–XVI)',
    subtitle1: 'Leonardo da Vinci',
    subtitle2: 'Ciencia y arte en uno solo'
  },
  'michelangelo': {
    name: 'Renacimiento (Renaissance, siglos XIV–XVI)',
    subtitle1: 'Miguel Ángel (Michelangelo Buonarroti)',
    subtitle2: 'Liberar el alma de la piedra'
  },
  'raphael': {
    name: 'Renacimiento (Renaissance, siglos XIV–XVI)',
    subtitle1: 'Rafael (Raphael Sanzio)',
    subtitle2: 'El pintor del equilibrio perfecto'
  },
  'botticelli': {
    name: 'Renacimiento (Renaissance, siglos XIV–XVI)',
    subtitle1: 'Botticelli (Sandro Botticelli)',
    subtitle2: 'El poeta que cantó a la belleza'
  },
  'titian': {
    name: 'Renacimiento (Renaissance, siglos XIV–XVI)',
    subtitle1: 'Tiziano (Tiziano Vecellio)',
    subtitle2: 'Construir la forma con color'
  },

  // ----- Barroco -----
  'caravaggio': {
    name: 'Barroco (Baroque, siglo XVII)',
    subtitle1: 'Caravaggio',
    subtitle2: 'Un rayo de luz en la oscuridad'
  },
  'rembrandt': {
    name: 'Barroco (Baroque, siglo XVII)',
    subtitle1: 'Rembrandt',
    subtitle2: 'Iluminar el alma con luz'
  },
  'velazquez': {
    name: 'Barroco (Baroque, siglo XVII)',
    subtitle1: 'Velázquez',
    subtitle2: 'El pintor de pintores'
  },
  'rubens': {
    name: 'Barroco (Baroque, siglo XVII)',
    subtitle1: 'Rubens',
    subtitle2: 'Dinamismo y abundancia'
  },

  // ----- Rococó -----
  'watteau': {
    name: 'Rococó (Rococo, siglo XVIII)',
    subtitle1: 'Watteau',
    subtitle2: 'El comienzo de la fiesta soñada'
  },
  'boucher': {
    name: 'Rococó (Rococo, siglo XVIII)',
    subtitle1: 'Boucher',
    subtitle2: 'Pintar el esplendor de la corte'
  },

  // ----- Neo / Romanticismo / Realismo -----
  'david': {
    name: 'Neoclasicismo (Neoclassicism, siglos XVIII–XIX)',
    subtitle1: 'David (Jacques-Louis David)',
    subtitle2: 'El pintor de la revolución'
  },
  'ingres': {
    name: 'Neoclasicismo (Neoclassicism, siglos XVIII–XIX)',
    subtitle1: 'Ingres (Jean-Auguste-Dominique Ingres)',
    subtitle2: 'En busca de la línea perfecta'
  },
  'turner': {
    name: 'Romanticismo (Romanticism, siglo XIX)',
    subtitle1: 'Turner (J.M.W. Turner)',
    subtitle2: 'El pintor de la luz y la atmósfera'
  },
  'delacroix': {
    name: 'Romanticismo (Romanticism, siglo XIX)',
    subtitle1: 'Delacroix (Eugène Delacroix)',
    subtitle2: 'Pintar la tormenta de emociones'
  },
  'courbet': {
    name: 'Realismo (Realism, siglo XIX)',
    subtitle1: 'Courbet (Gustave Courbet)',
    subtitle2: 'Pintar solo lo que se ve'
  },
  'manet': {
    name: 'Realismo (Realism, siglo XIX)',
    subtitle1: 'Manet (Édouard Manet)',
    subtitle2: 'Abrir la puerta de la pintura moderna'
  },

  // ----- Impresionismo -----
  'monet': {
    name: 'Impresionismo (Impressionism, 1860–1890)',
    subtitle1: 'Claude Monet',
    subtitle2: 'Perseguir el instante de la luz'
  },
  'renoir': {
    name: 'Impresionismo (Impressionism, 1860–1890)',
    subtitle1: 'Pierre-Auguste Renoir',
    subtitle2: 'Pintar los momentos felices'
  },
  'degas': {
    name: 'Impresionismo (Impressionism, 1860–1890)',
    subtitle1: 'Edgar Degas',
    subtitle2: 'Capturar el instante del movimiento'
  },
  'caillebotte': {
    name: 'Impresionismo (Impressionism, 1860–1890)',
    subtitle1: 'Gustave Caillebotte',
    subtitle2: 'Reflejar la vida cotidiana de París'
  },

  // ----- Postimpresionismo -----
  'vangogh': {
    name: 'Postimpresionismo (Post-Impressionism, 1880–1910)',
    subtitle1: 'Vincent van Gogh',
    subtitle2: 'La pasión del pincel en espiral'
  },
  'gauguin': {
    name: 'Postimpresionismo (Post-Impressionism, 1880–1910)',
    subtitle1: 'Paul Gauguin',
    subtitle2: 'Dejar la civilización en busca de lo puro'
  },
  'cezanne': {
    name: 'Postimpresionismo (Post-Impressionism, 1880–1910)',
    subtitle1: 'Paul Cézanne',
    subtitle2: 'Construir la naturaleza con estructura'
  },

  // ----- Fauvismo -----
  'matisse': {
    name: 'Fauvismo (Fauvism, 1905–1910)',
    subtitle1: 'Henri Matisse',
    subtitle2: 'El mago del color'
  },
  'derain': {
    name: 'Fauvismo (Fauvism, 1905–1910)',
    subtitle1: 'André Derain',
    subtitle2: 'La explosión del color'
  },
  'vlaminck': {
    name: 'Fauvismo (Fauvism, 1905–1910)',
    subtitle1: 'Maurice de Vlaminck',
    subtitle2: 'Hacer estallar el color por instinto'
  },

  // ----- Expresionismo -----
  'munch': {
    name: 'Expresionismo (Expressionism, 1905–1930)',
    subtitle1: 'Edvard Munch',
    subtitle2: 'Pintar el grito interior'
  },
  'kirchner': {
    name: 'Expresionismo (Expressionism, 1905–1930)',
    subtitle1: 'Ernst Ludwig Kirchner',
    subtitle2: 'Revelar la angustia urbana'
  },
  'kokoschka': {
    name: 'Expresionismo (Expressionism, 1905–1930)',
    subtitle1: 'Oskar Kokoschka',
    subtitle2: 'El retrato como campo de batalla psicológico'
  },

  // ----- Modernismo -----
  'picasso': {
    name: 'Cubismo (Cubism, principios del siglo XX)',
    subtitle1: 'Pablo Picasso',
    subtitle2: 'El revolucionario que deconstruyó la mirada'
  },
  'magritte': {
    name: 'Surrealismo (Surrealism, 1920–1960)',
    subtitle1: 'René Magritte',
    subtitle2: 'La trampa de lo visible'
  },
  'miro': {
    name: 'Surrealismo (Surrealism, 1920–1960)',
    subtitle1: 'Joan Miró',
    subtitle2: 'Emoción antes que forma'
  },
  'chagall': {
    name: 'Surrealismo (Surrealism, 1920–1960)',
    subtitle1: 'Marc Chagall',
    subtitle2: 'Poeta del amor y los sueños'
  },
  'lichtenstein': {
    name: 'Pop Art (Pop Art, 1950–1970)',
    subtitle1: 'Roy Lichtenstein',
    subtitle2: 'El hombre que convirtió el cómic en arte'
  }
};

// ==================== 2ª Educación (pantalla de resultado) ====================

export const oneclickMovementsSecondary = {

  // ----- Antigua Grecia-Roma -----
  'classical-sculpture': {
    content: `Una era que exploró la belleza ideal del cuerpo humano.
La escultura de proporciones perfectas y los mosaicos refinados fueron el punto de partida del arte occidental.

La escultura griega plasmó el equilibrio corporal con la proporción áurea y el contrapposto.
Se convirtió en el referente de 2800 años de arte occidental.`
  },

  'roman-mosaic': {
    content: `Una era que exploró la belleza ideal del cuerpo humano.
La escultura de proporciones perfectas y los mosaicos refinados fueron el punto de partida del arte occidental.

El mosaico romano registró mitos y vida cotidiana con miles de teselas.
Después de 2.000 años, sus colores y escenas siguen vivos.`
  },

  // ----- Medieval -----
  'byzantine': {
    content: `Una era en que el centro del arte se desplazó del ser humano a lo divino.
Mosaicos dorados, arquitectura de luz y miniaturas exquisitas revelaron el mundo de Dios.

El arte bizantino se distingue por fondos dorados y miradas frontales solemnes.
Durante mil años iluminó la fe del Imperio romano de Oriente.`
  },

  'gothic': {
    content: `Una era en que el centro del arte se desplazó del ser humano a lo divino.
Mosaicos dorados, arquitectura de luz y miniaturas exquisitas revelaron el mundo de Dios.

El arte gótico se distingue por vidrieras y agujas que perforan el cielo.
Un libro de texto de luz para los fieles que no sabían leer.`
  },

  'islamic-miniature': {
    content: `Una era en que el centro del arte se desplazó del ser humano a lo divino.
Mosaicos dorados, arquitectura de luz y miniaturas exquisitas revelaron el mundo de Dios.

La miniatura islámica se distingue por colores como joyas y trazos extremadamente delicados.
Evitó las imágenes figurativas y reveló lo divino a través del orden y el símbolo.`
  },

  // ----- Renacimiento -----
  'leonardo': {
    content: `Una era en que el ser humano volvió a ser el centro.
La perspectiva y la anatomía reconstruyeron el mundo con ojos humanos.

Da Vinci difuminó los contornos como humo con la técnica del sfumato.
El primer genio universal que derribó la barrera entre ciencia y arte.`
  },

  'michelangelo': {
    content: `Una era en que el ser humano volvió a ser el centro.
La perspectiva y la anatomía reconstruyeron el mundo con ojos humanos.

Miguel Ángel expresó la tensión y la fuerza muscular con dominio de la anatomía.
Un maestro que conquistó la escultura, la pintura y la arquitectura.`
  },

  'raphael': {
    content: `Una era en que el ser humano volvió a ser el centro.
La perspectiva y la anatomía reconstruyeron el mundo con ojos humanos.

Rafael se distingue por proporciones ideales y suaves transiciones de color.
Murió a los 37 años, pero dejó la cima de la belleza clásica.`
  },

  'botticelli': {
    content: `Una era en que el ser humano volvió a ser el centro.
La perspectiva y la anatomía reconstruyeron el mundo con ojos humanos.

Botticelli se distingue por curvas fluidas y colores transparentes.
El poeta del Renacimiento que cantó a la belleza misma.`
  },

  'titian': {
    content: `Una era en que el ser humano volvió a ser el centro.
La perspectiva y la anatomía reconstruyeron el mundo con ojos humanos.

Tiziano se distingue por su rico colorido y la expresión sensual de la piel.
Un pionero de la pintura moderna que construyó la forma con color.`
  },

  // ----- Barroco -----
  'caravaggio': {
    content: `Una era en que la luz y la sombra se convirtieron en drama.
El claroscuro dramático y la composición dinámica hicieron estallar la emoción.

Caravaggio completó el tenebrismo: un rayo de luz en la oscuridad absoluta.
Con su contraste extremo de luz y sombra anunció el inicio de la pintura barroca.`
  },

  'rembrandt': {
    content: `Una era en que la luz y la sombra se convirtieron en drama.
El claroscuro dramático y la composición dinámica hicieron estallar la emoción.

Rembrandt iluminó el interior humano con su resplandor dorado.
Con luz y psicología completó el Barroco holandés del siglo XVII.`
  },

  'velazquez': {
    content: `Una era en que la luz y la sombra se convirtieron en drama.
El claroscuro dramático y la composición dinámica hicieron estallar la emoción.

Velázquez se distingue por su descripción realista y su paleta contenida.
Con su realismo de luz y aire influyó profundamente en Manet, Picasso y otros.`
  },

  'rubens': {
    content: `Una era en que la luz y la sombra se convirtieron en drama.
El claroscuro dramático y la composición dinámica hicieron estallar la emoción.

Rubens se distingue por composiciones dinámicas y cuerpos opulentos.
Como diplomático recorrió Europa, extendiendo el Barroco por todo el continente.`
  },

  // ----- Rococó -----
  'watteau': {
    content: `Una era en que el juego aristocrático se convirtió en arte.
Colores pastel, curvas y decoración elegante llenaron el lienzo.

Watteau pintó atmósferas de ensueño y escenas de amantes elegantes.
Murió a los 36 años, pero abrió la puerta de la pintura rococó.`
  },

  'boucher': {
    content: `Una era en que el juego aristocrático se convirtió en arte.
Colores pastel, curvas y decoración elegante llenaron el lienzo.

Boucher se distingue por desnudos sensuales y ornamentación exuberante.
Con el favor de la corte francesa, completó el arte rococó.`
  },

  // ----- Neo / Romanticismo / Realismo -----
  'david': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

David construyó la imagen de la revolución con contornos nítidos y proporciones clásicas.
Lideró el Neoclasicismo y se convirtió en el pintor oficial de la era napoleónica.`
  },

  'ingres': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

Ingres se distingue por su piel suave y sus líneas perfectamente controladas.
El último clasicista que creyó que "la línea es más noble que el color".`
  },

  'turner': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

Turner se distingue por nieblas que disuelven la forma y tormentas expresivas.
Alcanzó la esencia de la luz antes que los impresionistas.`
  },

  'delacroix': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

Delacroix se distingue por pinceladas vigorosas y fuertes contrastes de color.
Lideró el Romanticismo traduciendo el fervor revolucionario al lenguaje de la emoción.`
  },

  'courbet': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

Courbet pintó la realidad tal cual, sin idealización.
Declaró el Realismo diciendo: "No puedo pintar un ángel porque nunca he visto uno."`
  },

  'manet': {
    content: `Una era en que la revolución definió la dirección del arte.
El Neoclasicismo se dirigió a la razón; el Romanticismo, a la emoción; el Realismo, a lo concreto.

Manet se distingue por planos de color audaces y composiciones atrevidas.
Rompió las reglas de la pintura tradicional y abrió la puerta al Impresionismo.`
  },

  // ----- Impresionismo -----
  'monet': {
    content: `Una era que capturó el instante en que la luz se convierte en color.
Pintando al aire libre con pinceladas cortas y colores puros yuxtapuestos, atraparon la impresión de la luz.

Monet exploró en series la cambiante coloración de la luz.
Fundador del Impresionismo y el que persiguió la luz hasta el final.`
  },

  'renoir': {
    content: `Una era que capturó el instante en que la luz se convierte en color.
Pintando al aire libre con pinceladas cortas y colores puros yuxtapuestos, atraparon la impresión de la luz.

Renoir se distingue por colores cálidos y una expresión suave de la luz.
Dejó en el lienzo los momentos más felices de la vida.`
  },

  'degas': {
    content: `Una era que capturó el instante en que la luz se convierte en color.
Pintando al aire libre con pinceladas cortas y colores puros yuxtapuestos, atraparon la impresión de la luz.

Degas exploró las bailarinas entre bastidores y las poses fugaces.
Con composiciones recortadas como fotografías abrió una mirada moderna.`
  },

  'caillebotte': {
    content: `Una era que capturó el instante en que la luz se convierte en color.
Pintando al aire libre con pinceladas cortas y colores puros yuxtapuestos, atraparon la impresión de la luz.

Caillebotte pintó la vida cotidiana de París con perspectivas audaces.
Con composiciones fotográficas y paisajes urbanos aportó una nueva mirada al Impresionismo.`
  },

  // ----- Postimpresionismo -----
  'vangogh': {
    content: `Una era que fue más allá de la luz impresionista, adentrándose en el interior.
Expresaron emociones y mundos interiores con color y forma.

Van Gogh reveló su interior con pinceladas en espiral y colores intensos.
Murió a los 37 años, pero sus colores siguen ardiendo hoy.`
  },

  'gauguin': {
    content: `Una era que fue más allá de la luz impresionista, adentrándose en el interior.
Expresaron emociones y mundos interiores con color y forma.

Gauguin se distingue por planos de color y colores simbólicos.
Dejó la civilización y completó en Tahití su pintura en busca de lo puro.`
  },

  'cezanne': {
    content: `Una era que fue más allá de la luz impresionista, adentrándose en el interior.
Expresaron emociones y mundos interiores con color y forma.

Cézanne reconstruyó la naturaleza en estructuras geométricas.
El padre de la pintura moderna del que Picasso y Matisse partieron.`
  },

  // ----- Fauvismo -----
  'matisse': {
    content: `Una era en que el color rugió como una fiera.
Primarios puros y audaces, más allá de la realidad, dominaron el lienzo.

Matisse no siguió el color de la realidad, sino que colocó el color de la emoción.
Lideró el Fauvismo y liberó el color como lenguaje emocional.`
  },

  'derain': {
    content: `Una era en que el color rugió como una fiera.
Primarios puros y audaces, más allá de la realidad, dominaron el lienzo.

Derain se distingue por colores explosivos y pinceladas audaces.
Junto con Matisse, lideró la teoría y la práctica del Fauvismo.`
  },

  'vlaminck': {
    content: `Una era en que el color rugió como una fiera.
Primarios puros y audaces, más allá de la realidad, dominaron el lienzo.

Vlaminck se distingue por primarios como exprimidos del tubo y pinceladas rudas.
Un pintor que hizo estallar el color por instinto, no por razón.`
  },

  // ----- Expresionismo -----
  'munch': {
    content: `Una era que pintó no lo que se ve, sino lo que se siente.
Formas distorsionadas y colores violentos hicieron estallar la emoción interior.

Munch se distingue por curvas en espiral y colores inquietantes.
Un pionero del Expresionismo que fijó la angustia en imagen.`
  },

  'kirchner': {
    content: `Una era que pintó no lo que se ve, sino lo que se siente.
Formas distorsionadas y colores violentos hicieron estallar la emoción interior.

Kirchner se distingue por líneas afiladas y fuertes contrastes de primarios.
Un pintor que denunció la tensión y la angustia de la civilización urbana.`
  },

  'kokoschka': {
    content: `Una era que pintó no lo que se ve, sino lo que se siente.
Formas distorsionadas y colores violentos hicieron estallar la emoción interior.

Kokoschka se distingue por pinceladas rudas y una tensión psicológica extrema.
Un pintor que convirtió el retrato en campo de batalla psicológico.`
  },

  // ----- Modernismo -----
  'picasso': {
    content: `Una era en que todas las reglas se derrumbaron y se reescribieron.
Las tradiciones de perspectiva, forma y color fueron deconstruidas y recompuestas.

Picasso descompuso los objetos geométricamente y los mostró desde múltiples puntos de vista a la vez.
Fundó el Cubismo y destruyó 500 años de orden perspectivo.`
  },

  'magritte': {
    content: `Una era en que todas las reglas se derrumbaron y se reescribieron.
Las tradiciones de perspectiva, forma y color fueron deconstruidas y recompuestas.

Magritte subvirtió el pensamiento haciendo colisionar objetos cotidianos y lenguaje.
Reveló la trampa entre lo que se ve y lo que se cree.`
  },

  'miro': {
    content: `Una era en que todas las reglas se derrumbaron y se reescribieron.
Las tradiciones de perspectiva, forma y color fueron deconstruidas y recompuestas.

Miró es un pintor cuyas líneas libres y signos de colores primarios flotan por el lienzo.
Visualizó la emoción que existe antes de la forma.`
  },

  'chagall': {
    content: `Una era en que todas las reglas se derrumbaron y se reescribieron.
Las tradiciones de perspectiva, forma y color fueron deconstruidas y recompuestas.

Chagall se distingue por colores de ensueño y composiciones irreales.
Un pintor del amor que superpuso sueños sobre la realidad.`
  },

  'lichtenstein': {
    content: `Una era en que todas las reglas se derrumbaron y se reescribieron.
Las tradiciones de perspectiva, forma y color fueron deconstruidas y recompuestas.

Lichtenstein se distingue por puntos Ben-Day, contornos gruesos y primarios intensos.
Llevó el cómic al lienzo y borró la frontera entre arte y cultura popular.`
  }
};

export default {
  oneclickMovementsPrimary,
  oneclickMovementsBasicInfo,
  oneclickMovementsSecondary
};
