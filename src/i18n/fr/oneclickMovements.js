// ========================================
// One-Click Mouvements — Français (fr)
// v69 - 2026-02-03 (structure : mouvement→artiste)
// ----------------------------------------
// 1re : ton poétique (chargement, attente)
// 2e : définition/caractéristiques du mouvement (fixe) → présentation de l\'artiste (variable)
// ========================================

// ==================== 1re Éducation (écran de chargement) ====================

export const oneclickMovementsPrimary = {
  content: `À quoi ressemblerait le corps parfait ?
Comment devrait-on peindre Dieu ?
De quelle couleur est la lumière ?
Quelle forme a la tristesse ?

Maintenant, votre photo rencontre ces questions.

Il y a 2800 ans, en Grèce, le corps humain devint pierre.
Le Moyen Âge choisit Dieu ; la Renaissance, l\'homme.
La lumière devint Baroque ; le rêve devint Rococo.

Après la révolution, la raison, l\'émotion et la réalité divergèrent.
Et l\'appareil photo demande : « Que peindre désormais ? »

Lumière et structure, couleur et âme, et le choix de briser les règles.

Onze mouvements. À votre tour.`
};

// ==================== Informations de base (résultat 2e) ====================

export const oneclickMovementsBasicInfo = {

  'classical-sculpture': {
    name: 'Grèce et Rome antiques (Ancient Greek & Roman, 800 av. J.-C.–500 apr. J.-C.)',
    subtitle1: 'Sculpture grecque (Classical Sculpture)',
    subtitle2: 'L\'origine de la proportion parfaite'
  },
  'roman-mosaic': {
    name: 'Grèce et Rome antiques (Ancient Greek & Roman, 800 av. J.-C.–500 apr. J.-C.)',
    subtitle1: 'Mosaïque romaine (Roman Mosaic)',
    subtitle2: 'Des récits gravés dans la pierre'
  },
  'byzantine': {
    name: 'Art médiéval (Medieval Art, IVe–XIVe siècle)',
    subtitle1: 'Byzantin (Byzantine)',
    subtitle2: 'Le monde doré du divin'
  },
  'gothic': {
    name: 'Art médiéval (Medieval Art, IVe–XIVe siècle)',
    subtitle1: 'Gothique (Gothic)',
    subtitle2: 'Le ciel bâti de lumière'
  },
  'islamic-miniature': {
    name: 'Art médiéval (Medieval Art, IVe–XIVe siècle)',
    subtitle1: 'Miniature islamique (Islamic Miniature)',
    subtitle2: 'La finesse des joyaux'
  },
  'leonardo': {
    name: 'Renaissance (Renaissance, XIVe–XVIe siècle)',
    subtitle1: 'Léonard de Vinci (Leonardo da Vinci)',
    subtitle2: 'Science et art réunis'
  },
  'michelangelo': {
    name: 'Renaissance (Renaissance, XIVe–XVIe siècle)',
    subtitle1: 'Michel-Ange (Michelangelo Buonarroti)',
    subtitle2: 'Libérer l\'âme de la pierre'
  },
  'raphael': {
    name: 'Renaissance (Renaissance, XIVe–XVIe siècle)',
    subtitle1: 'Raphaël (Raphael Sanzio)',
    subtitle2: 'Le peintre de l\'équilibre parfait'
  },
  'botticelli': {
    name: 'Renaissance (Renaissance, XIVe–XVIe siècle)',
    subtitle1: 'Botticelli (Sandro Botticelli)',
    subtitle2: 'Le poète qui chanta la beauté'
  },
  'titian': {
    name: 'Renaissance (Renaissance, XIVe–XVIe siècle)',
    subtitle1: 'Titien (Tiziano Vecellio)',
    subtitle2: 'Construire la forme par la couleur'
  },
  'caravaggio': {
    name: 'Baroque (Baroque, XVIIe siècle)',
    subtitle1: 'Le Caravage (Caravaggio)',
    subtitle2: 'Un rayon de lumière dans les ténèbres'
  },
  'rembrandt': {
    name: 'Baroque (Baroque, XVIIe siècle)',
    subtitle1: 'Rembrandt',
    subtitle2: 'Éclairer l\'âme par la lumière'
  },
  'velazquez': {
    name: 'Baroque (Baroque, XVIIe siècle)',
    subtitle1: 'Vélasquez (Velázquez)',
    subtitle2: 'Le peintre des peintres'
  },
  'rubens': {
    name: 'Baroque (Baroque, XVIIe siècle)',
    subtitle1: 'Rubens',
    subtitle2: 'Dynamisme et abondance'
  },
  'watteau': {
    name: 'Rococo (Rococo, XVIIIe siècle)',
    subtitle1: 'Watteau',
    subtitle2: 'Le début de la fête galante'
  },
  'boucher': {
    name: 'Rococo (Rococo, XVIIIe siècle)',
    subtitle1: 'Boucher',
    subtitle2: 'Peindre la splendeur de la cour'
  },
  'david': {
    name: 'Néoclassicisme (Neoclassicism, XVIIIe–XIXe siècle)',
    subtitle1: 'David (Jacques-Louis David)',
    subtitle2: 'Le peintre de la Révolution'
  },
  'ingres': {
    name: 'Néoclassicisme (Neoclassicism, XVIIIe–XIXe siècle)',
    subtitle1: 'Ingres (Jean-Auguste-Dominique Ingres)',
    subtitle2: 'La quête de la ligne parfaite'
  },
  'turner': {
    name: 'Romantisme (Romanticism, XIXe siècle)',
    subtitle1: 'Turner (J.M.W. Turner)',
    subtitle2: 'Le peintre de la lumière et de l\'atmosphère'
  },
  'delacroix': {
    name: 'Romantisme (Romanticism, XIXe siècle)',
    subtitle1: 'Delacroix (Eugène Delacroix)',
    subtitle2: 'Peindre la tempête des émotions'
  },
  'courbet': {
    name: 'Réalisme (Realism, XIXe siècle)',
    subtitle1: 'Courbet (Gustave Courbet)',
    subtitle2: 'Ne peindre que ce que l\'on voit'
  },
  'manet': {
    name: 'Réalisme (Realism, XIXe siècle)',
    subtitle1: 'Manet (Édouard Manet)',
    subtitle2: 'Ouvrir la porte de la peinture moderne'
  },
  'monet': {
    name: 'Impressionnisme (Impressionism, 1860–1890)',
    subtitle1: 'Claude Monet',
    subtitle2: 'Poursuivre l\'instant de lumière'
  },
  'renoir': {
    name: 'Impressionnisme (Impressionism, 1860–1890)',
    subtitle1: 'Pierre-Auguste Renoir',
    subtitle2: 'Peindre les instants de bonheur'
  },
  'degas': {
    name: 'Impressionnisme (Impressionism, 1860–1890)',
    subtitle1: 'Edgar Degas',
    subtitle2: 'Saisir l\'instant du mouvement'
  },
  'caillebotte': {
    name: 'Impressionnisme (Impressionism, 1860–1890)',
    subtitle1: 'Gustave Caillebotte',
    subtitle2: 'Le quotidien parisien sur la toile'
  },
  'vangogh': {
    name: 'Postimpressionnisme (Post-Impressionism, 1880–1910)',
    subtitle1: 'Vincent van Gogh',
    subtitle2: 'La passion du pinceau en spirale'
  },
  'gauguin': {
    name: 'Postimpressionnisme (Post-Impressionism, 1880–1910)',
    subtitle1: 'Paul Gauguin',
    subtitle2: 'Quitter la civilisation en quête de pureté'
  },
  'cezanne': {
    name: 'Postimpressionnisme (Post-Impressionism, 1880–1910)',
    subtitle1: 'Paul Cézanne',
    subtitle2: 'Construire la nature par la structure'
  },
  'matisse': {
    name: 'Fauvisme (Fauvism, 1905–1910)',
    subtitle1: 'Henri Matisse',
    subtitle2: 'Le magicien de la couleur'
  },
  'derain': {
    name: 'Fauvisme (Fauvism, 1905–1910)',
    subtitle1: 'André Derain',
    subtitle2: 'L\'explosion de la couleur'
  },
  'vlaminck': {
    name: 'Fauvisme (Fauvism, 1905–1910)',
    subtitle1: 'Maurice de Vlaminck',
    subtitle2: 'Faire exploser la couleur par instinct'
  },
  'munch': {
    name: 'Expressionnisme (Expressionism, 1905–1930)',
    subtitle1: 'Edvard Munch',
    subtitle2: 'Peindre le cri intérieur'
  },
  'kirchner': {
    name: 'Expressionnisme (Expressionism, 1905–1930)',
    subtitle1: 'Ernst Ludwig Kirchner',
    subtitle2: 'Révéler l\'angoisse urbaine'
  },
  'kokoschka': {
    name: 'Expressionnisme (Expressionism, 1905–1930)',
    subtitle1: 'Oskar Kokoschka',
    subtitle2: 'Le portrait comme champ de bataille psychologique'
  },
  'picasso': {
    name: 'Cubisme (Cubism, début du XXe siècle)',
    subtitle1: 'Pablo Picasso',
    subtitle2: 'Le révolutionnaire qui déconstruisit le regard'
  },
  'magritte': {
    name: 'Surréalisme (Surrealism, 1920–1960)',
    subtitle1: 'René Magritte',
    subtitle2: 'Le piège du visible'
  },
  'miro': {
    name: 'Surréalisme (Surrealism, 1920–1960)',
    subtitle1: 'Joan Miró',
    subtitle2: 'L\'émotion avant la forme'
  },
  'chagall': {
    name: 'Surréalisme (Surrealism, 1920–1960)',
    subtitle1: 'Marc Chagall',
    subtitle2: 'Poète de l\'amour et des rêves'
  },
  'lichtenstein': {
    name: 'Pop Art (Pop Art, 1950–1970)',
    subtitle1: 'Roy Lichtenstein',
    subtitle2: 'L\'homme qui transforma la BD en art'
  }
};

// ==================== 2e Éducation (écran de résultat) ====================

export const oneclickMovementsSecondary = {

  'classical-sculpture': {
    content: `Une ère qui explora la beauté idéale du corps humain.
La sculpture aux proportions parfaites et les mosaïques raffinées furent le point de départ de l\'art occidental.

La sculpture grecque incarna l\'équilibre corporel avec le nombre d\'or et le contrapposto.
Elle devint la référence de 2800 ans d\'art occidental.`
  },

  'roman-mosaic': {
    content: `Une ère qui explora la beauté idéale du corps humain.
La sculpture aux proportions parfaites et les mosaïques raffinées furent le point de départ de l\'art occidental.

La mosaïque romaine enregistra mythes et vie quotidienne avec des milliers de tesselles.
Après 2 000 ans, ses couleurs et ses scènes restent vives.`
  },

  'byzantine': {
    content: `Une ère où le centre de l\'art se déplaça de l\'homme au divin.
Mosaïques dorées, architecture de lumière et miniatures exquises révélèrent le monde de Dieu.

L\'art byzantin se distingue par des fonds dorés et des regards frontaux solennels.
Pendant mille ans, il illumina la foi de l\'Empire romain d\'Orient.`
  },

  'gothic': {
    content: `Une ère où le centre de l\'art se déplaça de l\'homme au divin.
Mosaïques dorées, architecture de lumière et miniatures exquises révélèrent le monde de Dieu.

L\'art gothique se distingue par des vitraux et des flèches qui percent le ciel.
Un livre de lumière pour les fidèles qui ne savaient pas lire.`
  },

  'islamic-miniature': {
    content: `Une ère où le centre de l\'art se déplaça de l\'homme au divin.
Mosaïques dorées, architecture de lumière et miniatures exquises révélèrent le monde de Dieu.

La miniature islamique se distingue par des couleurs de joyaux et des traits d\'une finesse extrême.
Elle évita les images figuratives et révéla le divin par l\'ordre et le symbole.`
  },

  'leonardo': {
    content: `Une ère où l\'homme redevint le centre.
La perspective et l\'anatomie reconstruisirent le monde avec des yeux humains.

De Vinci fondit les contours comme de la fumée grâce à la technique du sfumato.
Le premier génie universel qui abattit la barrière entre science et art.`
  },

  'michelangelo': {
    content: `Une ère où l\'homme redevint le centre.
La perspective et l\'anatomie reconstruisirent le monde avec des yeux humains.

Michel-Ange exprima la tension et la puissance musculaires par sa maîtrise de l\'anatomie.
Un maître qui conquit la sculpture, la peinture et l\'architecture.`
  },

  'raphael': {
    content: `Une ère où l\'homme redevint le centre.
La perspective et l\'anatomie reconstruisirent le monde avec des yeux humains.

Raphaël se distingue par des proportions idéales et de douces transitions de couleur.
Mort à 37 ans, il laissa pourtant le sommet de la beauté classique.`
  },

  'botticelli': {
    content: `Une ère où l\'homme redevint le centre.
La perspective et l\'anatomie reconstruisirent le monde avec des yeux humains.

Botticelli se distingue par des courbes fluides et des couleurs transparentes.
Le poète de la Renaissance qui chanta la beauté elle-même.`
  },

  'titian': {
    content: `Une ère où l\'homme redevint le centre.
La perspective et l\'anatomie reconstruisirent le monde avec des yeux humains.

Titien se distingue par son riche coloris et l\'expression sensuelle de la peau.
Un pionnier de la peinture moderne qui construisit la forme par la couleur.`
  },

  'caravaggio': {
    content: `Une ère où la lumière et l\'ombre devinrent drame.
Le clair-obscur dramatique et la composition dynamique firent éclater l\'émotion.

Le Caravage acheva le ténébrisme : un rayon de lumière dans les ténèbres absolues.
Par son contraste extrême de lumière et d\'ombre, il annonça le début de la peinture baroque.`
  },

  'rembrandt': {
    content: `Une ère où la lumière et l\'ombre devinrent drame.
Le clair-obscur dramatique et la composition dynamique firent éclater l\'émotion.

Rembrandt illumina l\'intérieur humain par son éclat doré.
Par la lumière et la psychologie, il acheva le Baroque hollandais du XVIIe siècle.`
  },

  'velazquez': {
    content: `Une ère où la lumière et l\'ombre devinrent drame.
Le clair-obscur dramatique et la composition dynamique firent éclater l\'émotion.

Vélasquez se distingue par sa description réaliste et sa palette contenue.
Par son réalisme de lumière et d\'air, il influença profondément Manet, Picasso et d\'autres.`
  },

  'rubens': {
    content: `Une ère où la lumière et l\'ombre devinrent drame.
Le clair-obscur dramatique et la composition dynamique firent éclater l\'émotion.

Rubens se distingue par des compositions dynamiques et des corps opulents.
Diplomate parcourant l\'Europe, il diffusa le Baroque sur tout le continent.`
  },

  'watteau': {
    content: `Une ère où le jeu aristocratique devint art.
Couleurs pastel, courbes et décoration élégante envahirent la toile.

Watteau peignit des atmosphères de rêve et des scènes d\'amoureux élégants.
Mort à 36 ans, il ouvrit pourtant la porte de la peinture rococo.`
  },

  'boucher': {
    content: `Une ère où le jeu aristocratique devint art.
Couleurs pastel, courbes et décoration élégante envahirent la toile.

Boucher se distingue par des nus sensuels et une ornementation exubérante.
Avec la faveur de la cour de France, il acheva l\'art rococo.`
  },

  'david': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

David construisit l\'image de la Révolution avec des contours nets et des proportions classiques.
Il mena le Néoclassicisme et devint le peintre officiel de l\'ère napoléonienne.`
  },

  'ingres': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

Ingres se distingue par sa peau lisse et ses lignes parfaitement maîtrisées.
Le dernier classiciste qui croyait que « la ligne est plus noble que la couleur ».`
  },

  'turner': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

Turner se distingue par des brumes qui dissolvent la forme et des tempêtes expressives.
Il atteignit l\'essence de la lumière avant les impressionnistes.`
  },

  'delacroix': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

Delacroix se distingue par des touches vigoureuses et de forts contrastes de couleur.
Il mena le Romantisme en traduisant la ferveur révolutionnaire dans le langage de l\'émotion.`
  },

  'courbet': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

Courbet peignit la réalité telle quelle, sans idéalisation.
Il déclara le Réalisme en disant : « Je ne peins pas les anges car je n\'en ai jamais vu. »`
  },

  'manet': {
    content: `Une ère où la révolution définit la direction de l\'art.
Le Néoclassicisme se tourna vers la raison ; le Romantisme, vers l\'émotion ; le Réalisme, vers le concret.

Manet se distingue par des aplats audacieux et des compositions hardies.
Il brisa les règles de la peinture traditionnelle et ouvrit la porte à l\'Impressionnisme.`
  },

  'monet': {
    content: `Une ère qui capta l\'instant où la lumière devient couleur.
Peignant en plein air avec des touches courtes et des couleurs pures juxtaposées, ils saisirent l\'impression de la lumière.

Monet explora en séries les variations chromatiques de la lumière.
Fondateur de l\'Impressionnisme et celui qui poursuivit la lumière jusqu\'au bout.`
  },

  'renoir': {
    content: `Une ère qui capta l\'instant où la lumière devient couleur.
Peignant en plein air avec des touches courtes et des couleurs pures juxtaposées, ils saisirent l\'impression de la lumière.

Renoir se distingue par des couleurs chaudes et une expression douce de la lumière.
Il garda sur la toile les moments les plus heureux de la vie.`
  },

  'degas': {
    content: `Une ère qui capta l\'instant où la lumière devient couleur.
Peignant en plein air avec des touches courtes et des couleurs pures juxtaposées, ils saisirent l\'impression de la lumière.

Degas explora les ballerines en coulisse et les poses fugaces.
Avec des compositions cadrées comme des photographies, il ouvrit un regard moderne.`
  },

  'caillebotte': {
    content: `Une ère qui capta l\'instant où la lumière devient couleur.
Peignant en plein air avec des touches courtes et des couleurs pures juxtaposées, ils saisirent l\'impression de la lumière.

Caillebotte peignit le quotidien parisien avec des perspectives audacieuses.
Avec des compositions photographiques et des paysages urbains, il apporta un nouveau regard à l\'Impressionnisme.`
  },

  'vangogh': {
    content: `Une ère qui alla au-delà de la lumière impressionniste, vers l\'intérieur.
Ils exprimèrent émotions et mondes intérieurs par la couleur et la forme.

Van Gogh révéla son intérieur par des touches en spirale et des couleurs intenses.
Mort à 37 ans, ses couleurs brûlent encore aujourd\'hui.`
  },

  'gauguin': {
    content: `Une ère qui alla au-delà de la lumière impressionniste, vers l\'intérieur.
Ils exprimèrent émotions et mondes intérieurs par la couleur et la forme.

Gauguin se distingue par des aplats de couleur et des couleurs symboliques.
Il quitta la civilisation et acheva à Tahiti sa peinture en quête de pureté.`
  },

  'cezanne': {
    content: `Une ère qui alla au-delà de la lumière impressionniste, vers l\'intérieur.
Ils exprimèrent émotions et mondes intérieurs par la couleur et la forme.

Cézanne reconstruisit la nature en structures géométriques.
Le père de la peinture moderne dont Picasso et Matisse prirent le départ.`
  },

  'matisse': {
    content: `Une ère où la couleur rugit comme un fauve.
Des primaires purs et audacieux, au-delà de la réalité, dominèrent la toile.

Matisse ne suivit pas la couleur de la réalité, mais posa la couleur de l\'émotion.
Il mena le Fauvisme et libéra la couleur comme langage émotionnel.`
  },

  'derain': {
    content: `Une ère où la couleur rugit comme un fauve.
Des primaires purs et audacieux, au-delà de la réalité, dominèrent la toile.

Derain se distingue par des couleurs explosives et des touches audacieuses.
Avec Matisse, il mena la théorie et la pratique du Fauvisme.`
  },

  'vlaminck': {
    content: `Une ère où la couleur rugit comme un fauve.
Des primaires purs et audacieux, au-delà de la réalité, dominèrent la toile.

Vlaminck se distingue par des primaires comme sortis du tube et des touches rudes.
Un peintre qui fit exploser la couleur par l\'instinct, non par la raison.`
  },

  'munch': {
    content: `Une ère qui peignit non ce que l\'on voit, mais ce que l\'on ressent.
Des formes distordues et des couleurs violentes firent éclater l\'émotion intérieure.

Munch se distingue par des courbes en spirale et des couleurs inquiétantes.
Un pionnier de l\'Expressionnisme qui fixa l\'angoisse en image.`
  },

  'kirchner': {
    content: `Une ère qui peignit non ce que l\'on voit, mais ce que l\'on ressent.
Des formes distordues et des couleurs violentes firent éclater l\'émotion intérieure.

Kirchner se distingue par des lignes acérées et de forts contrastes de primaires.
Un peintre qui dénonça la tension et l\'angoisse de la civilisation urbaine.`
  },

  'kokoschka': {
    content: `Une ère qui peignit non ce que l\'on voit, mais ce que l\'on ressent.
Des formes distordues et des couleurs violentes firent éclater l\'émotion intérieure.

Kokoschka se distingue par des touches rudes et une tension psychologique extrême.
Un peintre qui transforma le portrait en champ de bataille psychologique.`
  },

  'picasso': {
    content: `Une ère où toutes les règles s\'effondrèrent et furent réécrites.
Les traditions de perspective, de forme et de couleur furent déconstruites et recomposées.

Picasso décomposa géométriquement les objets et les montra depuis plusieurs points de vue à la fois.
Il fonda le Cubisme et détruisit 500 ans d\'ordre perspectif.`
  },

  'magritte': {
    content: `Une ère où toutes les règles s\'effondrèrent et furent réécrites.
Les traditions de perspective, de forme et de couleur furent déconstruites et recomposées.

Magritte subvertit la pensée en faisant se heurter objets quotidiens et langage.
Il révéla le piège entre ce que l\'on voit et ce que l\'on croit.`
  },

  'miro': {
    content: `Une ère où toutes les règles s\'effondrèrent et furent réécrites.
Les traditions de perspective, de forme et de couleur furent déconstruites et recomposées.

Miró est un peintre dont les lignes libres et les signes de couleurs primaires flottent sur la toile.
Il visualisa l\'émotion qui existe avant la forme.`
  },

  'chagall': {
    content: `Une ère où toutes les règles s\'effondrèrent et furent réécrites.
Les traditions de perspective, de forme et de couleur furent déconstruites et recomposées.

Chagall se distingue par des couleurs oniriques et des compositions irréelles.
Un peintre de l\'amour qui superposa les rêves sur la réalité.`
  },

  'lichtenstein': {
    content: `Une ère où toutes les règles s\'effondrèrent et furent réécrites.
Les traditions de perspective, de forme et de couleur furent déconstruites et recomposées.

Lichtenstein se distingue par des points Ben-Day, des contours épais et des primaires intenses.
Il porta la bande dessinée sur la toile et effaça la frontière entre art et culture populaire.`
  }
};

export default {
  oneclickMovementsPrimary,
  oneclickMovementsBasicInfo,
  oneclickMovementsSecondary
};
