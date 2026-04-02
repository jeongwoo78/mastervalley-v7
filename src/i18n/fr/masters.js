// ========================================
// Grands Maîtres — Français (fr)
// Structure i18n · 9 lignes 2 paragraphes (1er 5 lignes 3+2 / 2e 4 lignes 2+2)
// 1re(chargement) = passé (récit historique)
// 2e(résultat) = présent (description des techniques appliquées)
// 2026-03-11 수정 반영본
// ========================================

// ========== Informations de base ==========
export const mastersBasicInfo = {

  // ===== Niveau maître (écran de chargement) =====
  'vangogh': {
    loading: {
      name: 'Vincent van Gogh (1853–1890)',
      subtitle1: 'Post-Impressionnisme · Pays-Bas',
      subtitle2: 'La passion du pinceau en spirale'
    },
    result: {
      name: 'Vincent van Gogh (1853–1890)',
      subtitle1: 'La Nuit étoilée · Les Tournesols · Autoportrait',
      subtitle2: 'La passion du pinceau en spirale',
      works: {
        'starrynight': { subtitle1: 'La Nuit étoilée (The Starry Night)', subtitle2: 'Le ciel nocturne peint en tourbillons' },
        'cafe': { subtitle1: 'La Terrasse du café la nuit (Café Terrace at Night)', subtitle2: 'Une lueur chaude de jaune sous la lumière des étoiles' },
        'sunflowers': { subtitle1: 'Les Tournesols (Sunflowers)', subtitle2: 'Fleurs baignées de soleil, brûlant de passion' },
        'selfportrait': { subtitle1: 'Autoportrait (Self-Portrait, 1889)', subtitle2: 'Un regard dans le miroir de l\'âme' },
        'wheatfield': { subtitle1: 'Champ de blé aux cyprès (Wheat Field with Cypresses)', subtitle2: 'Des champs dorés dansant dans le vent' },
      }
    },
  },
  'klimt': {
    loading: {
      name: 'Gustav Klimt (1862–1918)',
      subtitle1: 'Art Nouveau · Autriche',
      subtitle2: 'Le monde doré de la sensualité'
    },
    result: {
      name: 'Gustav Klimt (1862–1918)',
      subtitle1: 'Le Baiser · Judith · L\'Arbre de vie',
      subtitle2: 'Un monde de sensualité dorée',
      works: {
        'kiss': { subtitle1: 'Le Baiser (The Kiss)', subtitle2: 'Un baiser éternel dissous dans l\'or' },
        'treeoflife': { subtitle1: 'L\'Arbre de vie (The Tree of Life)', subtitle2: 'Des branches dorées chantant la chanson de la vie' },
        'judith': { subtitle1: 'Judith I', subtitle2: 'Entre le sacré et le sensuel, séduction dorée' },
      }
    },
  },
  'munch': {
    loading: {
      name: 'Edvard Munch (1863–1944)',
      subtitle1: 'Expressionnisme · Norvège',
      subtitle2: 'Peindre le cri intérieur'
    },
    result: {
      name: 'Edvard Munch (1863–1944)',
      subtitle1: 'Le Cri · Madonna · La Danse de la vie',
      subtitle2: 'Peindre le cri intérieur',
      works: {
        'scream': { subtitle1: 'Le Cri (The Scream)', subtitle2: 'Une âme qui pleure sous un ciel rouge sang' },
        'madonna': { subtitle1: 'Madonna', subtitle2: 'Une figure mystérieuse entre la vie et la mort' },
        'danceoflife': { subtitle1: 'La Danse de la vie (The Dance of Life)', subtitle2: 'Une valse d\'amour et de perte' },
      }
    },
  },
  'matisse': {
    loading: {
      name: 'Henri Matisse (1869–1954)',
      subtitle1: 'Fauvisme · France',
      subtitle2: 'Le magicien de la couleur'
    },
    result: {
      name: 'Henri Matisse (1869–1954)',
      subtitle1: 'La Danse · La Chambre rouge · La Raie verte',
      subtitle2: 'Maître de la couleur',
      works: {
        'greenstripe': { subtitle1: 'La Raie verte (The Green Stripe)', subtitle2: 'Une seule ligne verte qui a déclaré une révolution chromatique' },
        'purplecoat': { subtitle1: 'Femme au manteau violet (Woman in a Purple Coat)', subtitle2: 'Élégance enveloppée dans une couleur vibrante' },
        'redroom': { subtitle1: 'La Chambre rouge (The Red Room)', subtitle2: 'Un festin de décoration dominé par le rouge' },
        'derain': { subtitle1: 'Portrait d\'André Derain (Portrait of André Derain)', subtitle2: 'Un collègue fauviste peint avec les couleurs du sauvage' },
      }
    },
  },
  'chagall': {
    loading: {
      name: 'Marc Chagall (1887–1985)',
      subtitle1: 'Surréalisme · Russie/France',
      subtitle2: 'Poète de l\'amour et des rêves'
    },
    result: {
      name: 'Marc Chagall (1887–1985)',
      subtitle1: 'L\'Anniversaire · Moi et le village · La Mariée',
      subtitle2: 'Poète de l\'amour et des rêves',
      works: {
        'lovers': { subtitle1: 'Les Amoureux aux fleurs (Lovers with Flowers)', subtitle2: 'L\'amour rayonnant au cœur d\'un bouquet' },
        'lamariee': { subtitle1: 'La Mariée (La Mariée)', subtitle2: 'Une mariée flottant entre rêve et réalité' },
        'village': { subtitle1: 'Moi et le village (I and the Village)', subtitle2: 'Des souvenirs du foyer dérivant comme un rêve' },
      }
    },
  },
  'picasso': {
    loading: {
      name: 'Pablo Picasso (1881–1973)',
      subtitle1: 'Cubisme · Espagne',
      subtitle2: 'Le révolutionnaire qui déconstruisit le regard'
    },
    result: {
      name: 'Pablo Picasso (1881–1973)',
      subtitle1: 'Les Demoiselles d\'Avignon · Guernica · Portrait de Dora Maar',
      subtitle2: 'Un révolutionnaire qui a déconstruit la vision',
      works: {
        'doramaar': { subtitle1: 'Portrait de Dora Maar (Portrait of Dora Maar)', subtitle2: 'Un portrait déconstruit où le face-à-face rencontre le profil' },
      }
    },
  },
  'frida': {
    loading: {
      name: 'Frida Kahlo (1907–1954)',
      subtitle1: 'Surréalisme · Mexique',
      subtitle2: 'L\'autoportrait qui affronta la douleur'
    },
    result: {
      name: 'Frida Kahlo (1907–1954)',
      subtitle1: 'Surréalisme · Mexique',
      subtitle2: 'Autoportrait face à la douleur',
      works: {
        'parrots': { subtitle1: 'Moi et mes perroquets (Me and My Parrots)', subtitle2: 'Un autoportrait dans la solitude, avec des perroquets' },
        'monkeys': { subtitle1: 'Autoportrait aux singes (Self-Portrait with Monkeys)', subtitle2: 'Un portrait de douleur, embrassé par des singes' },
      }
    },
  },
  'lichtenstein': {
    loading: {
      name: 'Roy Lichtenstein (1923–1997)',
      subtitle1: 'Pop Art · États-Unis',
      subtitle2: 'L\'homme qui transforma la bande dessinée en art'
    },
    result: {
      name: 'Roy Lichtenstein (1923–1997)',
      subtitle1: 'In the Car · M-Maybe · Forget It!',
      subtitle2: 'Transformer les bandes dessinées en art',
      works: {
        'inthecar': { subtitle1: 'In the Car', subtitle2: 'Silence sans bulles, émotions à grande vitesse' },
        'mmaybe': { subtitle1: 'M-Maybe', subtitle2: "Un mot d'hésitation, un drame Pop Art" },
        'forgetit': { subtitle1: 'Forget It!', subtitle2: "Un cri d'adieu capturé en une case" },
        'ohhhalright': { subtitle1: 'Ohhh...Alright...', subtitle2: "Résignation et acceptation en un souffle" },
        'stilllife': { subtitle1: 'Still Life with Crystal Bowl', subtitle2: 'Nature morte renaissant par les points Ben-Day' }
      }
    }
  },

  // ===== Niveau œuvre (écran de résultat) =====

  // --- Van Gogh ---
  // --- Klimt ---
  // --- Munch ---
// --- Matisse ---
// --- Chagall ---
// --- Picasso ---
  // --- Frida ---
  // --- Lichtenstein ---
};


// ========== 1re Éducation : Chargement (récit biographique) ==========
export const mastersLoadingEducation = {

  // ── Van Gogh ──
  'vangogh': {
    name: 'Van Gogh',
    description: `La technique de l\'impasto épais et les coups de pinceau tourbillonnants ont été appliqués.
L\'intense contraste du jaune et du bleu exprime directement l\'émotion de l\'âme.

Van Gogh est une figure déterminante du Post-Impressionnisme.
Il a commencé à peindre à 27 ans et a produit 900 peintures à l\'huile en seulement dix ans, mais une seule s\'est vendue de son vivant.
Des chefs-d\'œuvre comme La Nuit étoilée, Les Tournesols et La Terrasse du café le soir sont tous nés dans la pauvreté et la souffrance mentale.

"Je mets mon cœur et mon âme dans mon travail." — Un peintre qui forgea une beauté immortelle à partir de la souffrance.`
  },

  // ── Klimt ──
  'klimt': {
    name: 'Klimt',
    description: `De vraies feuilles d\'or et des motifs géométriques inspirés des mosaïques byzantines ont été appliqués.
Des rectangles sur les côtés et des cercles en haut—les détails décoratifs enveloppent maintenant votre silhouette.

Klimt était le principal peintre Art Nouveau de la Vienne de la fin du XIXe siècle.
Il a créé une technique unique combinant peinture à l\'huile et incrustations d\'or.

"À chaque époque son art, à chaque art sa liberté." — Un peintre qui captura la beauté du fin de siècle en or.`
  },

  // ── Munch ──
  'munch': {
    name: 'Munch',
    description: `Des courbes tourbillonnantes, des formes distordues et des couleurs intenses ont été appliquées.
Des ciels rouge sang et des lignes ondulantes expriment l\'anxiété et les émotions profondes.

Munch fut le pionnier de l\'Expressionnisme qui peignait non ce qu\'il voyait, mais ce qu\'il ressentait.
Il a perdu sa mère à 5 ans et sa sœur préférée à 14 ans—ce traumatisme est devenu la source permanente de son œuvre.

"La maladie, la folie et la mort furent les anges noirs qui veillèrent sur mon berceau." — Un peintre qui transforma ses ténèbres intérieures en art.`
  },

  // ── Matisse ──
  'matisse': {
    name: 'Matisse',
    description: `Des formes simplifiées et des couleurs primaires audacieuses ont été appliquées.
Plutôt que la précision anatomique, l\'accent est mis sur l\'expression des émotions à travers la couleur.

Matisse était le chef de file du Fauvisme—mouvement utilisant des couleurs sauvages pour exprimer les sentiments plutôt que la réalité.
Il a découvert la peinture en se remettant d\'une appendicite à l\'âge de 20 ans et ne s\'est jamais arrêté.

"Le but de la couleur n'est pas de décrire la forme mais d'exprimer l'émotion." — Un peintre qui chanta la joie par la couleur.`
  },

  // ── Chagall ──
  'chagall': {
    name: 'Chagall',
    description: `Une atmosphère onirique de rose, de bleu cobalt et de couleurs chatoyantes a été appliquée.
Des bouquets, des amoureux flottants et des animaux fantastiques flottent entre rêve et réalité.

Chagall est né à Vitebsk, en Biélorussie, et y a trouvé toutes les couleurs de sa vie.
Son amour pour Bella, sa femme toute sa vie, est devenu le thème éternel de son œuvre.

"Dans notre vie, il n'y a qu'une seule couleur : celle de l'amour." — Un poète qui effaça la frontière entre rêve et réalité.`
  },

  // ── Picasso ──
  'picasso': {
    name: 'Picasso',
    description: `Les techniques cubistes qui déconstruisent les sujets en plans géométriques et montrent le devant et le côté simultanément ont été appliquées.
Votre visage est maintenant partout à la fois—vu sous tous les angles simultanément.

Picasso était l\'artiste le plus influent du XXe siècle.
À 13 ans, il peignait déjà mieux que son père, qui était professeur d\'art.

Avec Braque, il a développé le Cubisme—une révolution qui a brisé la perspective traditionnelle et ouvert la porte à l\'art abstrait.`
  },

  // ── Frida ──
  'frida': {
    name: 'Frida Kahlo',
    description: `Des couleurs folkloriques mexicaines traditionnelles, du feuillage tropical et une communion avec les animaux ont été appliqués.
Dans Autoportrait au collier d\'épines, la douleur devient art.

À 18 ans, Frida Kahlo a subi un terrible accident de bus qui lui a brisé la colonne vertébrale.
Pendant sa convalescence, elle a commencé à peindre—transformant la douleur en art.

"Des pieds, pourquoi en voudrais-je si j'ai des ailes pour voler ?" — Une peintre invincible qui transforma la douleur en art.`
  },

  // ── Lichtenstein ──
  'lichtenstein': {
    name: 'Lichtenstein',
    description: `Les techniques du pop art utilisant des points Ben-Day de bandes dessinées imprimées, des contours noirs épais et des couleurs primaires ont été appliquées.
Votre visage ressemble maintenant à un panneau de bande dessinée—brillant, audacieux et plein d\'expression dramatique.

En 1961, Lichtenstein a peint une bande dessinée de Mickey Mouse et le monde de l\'art a tremblé.
Le magazine Life a demandé : 'Est-il le pire artiste des États-Unis ?'

"Je ne dessine pas des BD, je peins des tableaux sur les BD." — Un peintre qui effaça la ligne entre culture pop et beaux-arts.`
  }
};


// ========== 2e Éducation : Résultat (techniques par œuvre) ==========
export const mastersResultEducation = {
  'vangogh-selfportrait': {
    description: `Le fond tourbillonnant et les épaisses touches d'impasto de 〈Autoportrait〉 ont été appliqués.
Les tons froids de vert et de bleu créent une intensité psychologique.

〈Autoportrait〉 est le miroir dans lequel Van Gogh se regardait lui-même—et nous avec lui.
Au cours de ses 10 années de carrière, il a peint plus de 30 autoportraits, chacun révélant différentes couches de l'âme.

Ce portrait, avec son fond bleu tourbillonnant, est considéré comme le sommet de ses capacités techniques et de son expression intérieure.`
  },
  'klimt-kiss': {
    description: `Le fond de feuille d'or et les motifs décoratifs géométriques de 〈Le Baiser〉 ont été appliqués.
Des rectangles et des cercles alternent pour créer un manteau doré enveloppant deux silhouettes.

〈Le Baiser〉 est le chef-d'œuvre de l'Art Nouveau qui est maintenant l'une des peintures les plus aimées au monde.
L'or véritable brille sur la toile—Klimt a mélangé les techniques de peinture traditionnelles avec des matériaux luxueux.

Deux silhouettes qui s'étreignent au bord d'un précipice sont devenues un symbole universel de l'amour et de la vulnérabilité.`
  },
  'klimt-judith': {
    description: `La décoration en feuille d'or et les couleurs sensuelles chatoyantes de 〈Judith〉 ont été appliquées.
Du velours transparent et un manteau doré créent une expression contradictoire de pouvoir et de désir.

〈Judith〉 est la guerrière de l'Ancien Testament qui a décapité Holopherne—mais Klimt l'a peinte non comme une héroïne, mais comme une femme fatale en extase.

Les yeux mi-clos et l'expression des lèvres entrouvertes créent une ambiguïté entre plaisir et victoire qui est la marque distinctive de Klimt.`
  },
  'klimt-treeoflife': {
    description: `Les courbes spirales et les motifs décoratifs dorés de 〈L'Arbre de vie〉 ont été appliqués.
Des triangles, des yeux et des spirales superposés créent une tapisserie de vie et de mort.

〈L'Arbre de vie〉 est la pièce centrale de la Frise Stoclet—une décoration murale monumentale que Klimt a créée pour un palais à Bruxelles.
L'arbre aux branches en spirale symbolise le cycle éternel de la vie.

C'est l'exemple parfait du Gesamtkunstwerk—œuvre d'art totale unissant peinture, architecture et artisanat.`
  },
  'munch-scream': {
    description: `Les courbes ondulantes et les formes distordues de 〈Le Cri〉 ont été appliquées.
Un ciel rouge sang et des lignes tremblantes expriment une pure anxiété existentielle.

〈Le Cri〉 est né d'une expérience réelle de Munch—un soir à Oslo, il a senti que la nature lui 'criait dessus'.
Trois versions en peinture et une en pastel—chacune capturant le moment où l'être humain ressent le vide de l'univers.

C'est maintenant le symbole visuel de l'anxiété moderne le plus reconnu au monde.`
  },
  'munch-madonna': {
    description: `Le halo rouge et les courbes sensuelles ondulantes de 〈Madonna〉 ont été appliqués.
À la frontière entre la vie et la mort, la silhouette se dresse les yeux fermés.

〈Madonna〉 n'est pas une Madonna religieuse—c'est la célébration par Munch de la naissance, de l'amour et de la mort en une seule figure.
Des vagues rouges enveloppent la silhouette nue, tandis que le cadre montre un fœtus et un crâne.

C'est une méditation sur le cycle éternel de la vie que seul Munch pouvait exprimer avec un tel courage.`
  },
  'matisse-redroom': {
    description: `La composition en plans de couleur plate qui défie la perspective dans 〈La Chambre rouge〉 a été appliquée.
Le mur rouge et la table rouge fusionnent en un seul—les motifs d'arabesques recouvrent tout l'espace.

〈La Chambre rouge〉 a d'abord été peinte en bleu, mais Matisse l'a repeinte en rouge juste avant de terminer.
Même la vue par la fenêtre apparaît comme une décoration plate—effaçant la frontière entre intérieur et extérieur.

C'est la preuve du courage de Matisse : que la couleur peut être plus puissante que la réalité.`
  },
  'picasso-doramaar': {
    description: `La vue simultanée de face et de profil de 〈Portrait de Dora Maar〉 a été appliquée.
Des couleurs primaires intenses remplissent les plans géométriques.

Dora Maar était photographe et artiste qui est devenue la muse et l'amante de Picasso pendant la Seconde Guerre mondiale.
〈Portrait de Dora Maar〉 capture son visage sous plusieurs angles simultanément—expression visuelle de la complexité psychologique d'une personne.

Picasso a ensuite dit : 'Dora, pour moi, pleurait toujours.' Ce tableau est un monument à son intelligence et à sa souffrance.`
  },
  'lichtenstein-inthecar': {
    description: `Les points Ben-Day et les contours noirs épais de 〈Dans la voiture〉 ont été appliqués.
Seules des couleurs primaires pures remplissent les contours épais—comme un panneau de bande dessinée agrandi.

〈Dans la voiture〉 capture un couple dans une voiture dans le style de bande dessinée caractéristique de Lichtenstein.
Les expressions faciales plates et la distance émotionnelle entre les deux figures créent l'ironie froide caractéristique de Lichtenstein.

Cette peinture pose la question : sommes-nous vraiment connectés, ou ne sommes-nous que des images de connexion ?`
  },


  // ── Van Gogh ──
  // ── Klimt ──
  // ── Munch ──
// ── Matisse ──
// ── Chagall ──
// ── Picasso ──
  // ── Frida ──
  // ── Lichtenstein ──
  // ===== Secours par artiste (quand aucune œuvre spécifique n\'est identifiée) =====
  'vangogh': {
    name: 'Style Van Gogh',
    description: `Le style expressif de Van Gogh, avec ses touches en spirale et ses couleurs intenses, a été appliqué.
Les touches fortes et directionnelles créent des textures vibrantes pleines d\'énergie émotionnelle.

Le contraste entre bleu profond et jaune éclatant définit la palette d\'un artiste qui peignit avec le cœur.
Un style inimitable où chaque trace révèle l\'âme tourmentée et passionnée du peintre.`
  },
  'klimt': {
    name: 'Style Klimt',
    description: `Le style décoratif de Klimt, avec feuille d\'or et motifs géométriques, a été appliqué.
Les mosaïques dorées et les spirales ornementales créent un monde de luxe sensuel.

Des figures planes enveloppées de motifs où l\'organique et le géométrique s\'entrelacent.
L\'esthétique de la Sécession viennoise, où la décoration devient expression de l\'âme.`
  },
  'munch': {
    name: 'Style Munch',
    description: `Le style expressionniste de Munch, avec ses couleurs inquiétantes et ses formes ondulantes, a été appliqué.
Les lignes sinueuses et les tons maladifs transmettent directement l\'angoisse psychologique.

Des paysages qui se distordent au rythme des émotions internes, où rien ne reste stable.
Le langage visuel de l\'anxiété, pionnier dans la conversion de l\'intérieur de l\'âme en image.`
  },
  'matisse': {
    name: 'Style Matisse',
    description: `Le style fauviste de Matisse, avec ses couleurs pures et ses formes simplifiées, a été appliqué.
Des primaires audacieux sont disposés sans respecter la réalité, et les formes sont réduites à leur essence.

La ligne se fait danse et la couleur se fait musique — chaque élément chante avec indépendance.
L\'art de la joie pure, où la couleur est libre de toute obligation descriptive.`
  },
  'chagall': {
    name: 'Style Chagall',
    description: `Le style onirique de Chagall, avec ses couleurs pastel et ses figures flottantes, a été appliqué.
Amoureux, animaux et toits flottent dans un espace sans gravité, teinté de nostalgie.

Roses, violets et bleus se fondent comme des souvenirs qui se mêlent en rêves.
Un monde où l\'amour et la mémoire défient les lois de la physique et du temps.`
  },
  'picasso': {
    name: 'Style Picasso',
    description: `Le style cubiste de Picasso, avec ses formes géométriques et sa perspective multiple, a été appliqué.
Les visages et les corps se fragmentent en plans angulaires, montrant plusieurs points de vue simultanément.

Des lignes audacieuses et des couleurs contrastées construisent une réalité déconstruite et recomposée.
La révolution visuelle qui détruisit 500 ans de perspective traditionnelle.`
  },
  'frida': {
    name: 'Style Frida Kahlo',
    description: `Le style symbolique de Frida, avec ses couleurs mexicaines et son regard frontal intense, a été appliqué.
Les rouges, verts et jaunes de la tradition mexicaine encadrent une iconographie profondément personnelle.

Chaque élément — épines, animaux, plantes — est un symbole codé de douleur, de résistance et d\'amour.
L\'art de la confession où le corps brisé devient territoire d\'identité et de lutte.`
  },
  'lichtenstein': {
    name: 'Style Lichtenstein',
    description: `Le style Pop Art de Lichtenstein, avec ses points Ben-Day et ses contours épais, a été appliqué.
Des trames de points réguliers et des couleurs primaires en aplat transforment l\'esthétique de la bande dessinée en art.

Noir, rouge, bleu et jaune en compositions graphiques qui questionnent ce qui est art et ce qui est culture populaire.
L\'essence du Pop Art qui effaça la frontière entre le musée et la culture de masse.`
  },
  'vangogh-starrynight': {
    description: `La technique d\'impasto tourbillonnant de 〈La Nuit étoilée〉 a été appliquée.
Le contraste intense du bleu cobalt et du jaune chrome libère l\'énergie de la nuit.

〈La Nuit étoilée〉 est la vision réimaginée par Van Gogh du paysage au-delà de la fenêtre de son asile à Saint-Rémy.
Plutôt que de peindre le ciel nocturne réel, il a projeté ses tourments intérieurs sur les étoiles.`
  },
  'vangogh-cafe': {
    description: `La technique de paysage nocturne aux couleurs complémentaires de 〈La Terrasse du café le soir〉, sans utiliser le noir, a été appliquée.
Les réverbères jaunes et le ciel bleu profond expriment l\'obscurité uniquement par contraste des couleurs.

〈La Terrasse du café le soir〉 est la première scène nocturne en extérieur que Van Gogh peignit sous les étoiles à la Place du Forum d\'Arles.
Les chaises vides sur la terrasse et les passants évoquent à la fois la quiétude et la chaleur de la nuit.`
  },
  'vangogh-sunflowers': {
    description: `Les subtiles variations tonales d\'un jaune chrome unique dans 〈Les Tournesols〉 ont été appliquées.
La peinture épaissement superposée capture la texture des pétales tels qu\'ils sont.

〈Les Tournesols〉 est une série que Van Gogh peignit pour décorer la Maison Jaune à Arles avant l\'arrivée de Gauguin.
Fleurs épanouies, fleurs fanées et graines révèlent ensemble le cycle de la vie.`
  },
  'vangogh-wheatfield': {
    description: `Les coups de pinceau courbes dynamiques et les contrastes de couleurs complémentaires de 〈Champ de blé avec cyprès〉 ont été appliqués.
Le blé agité par le vent et les cyprès semblables à des flammes transmettent l\'énergie vitale de la nature.

〈Champ de blé avec cyprès〉 est un paysage que Van Gogh peignit à plusieurs reprises près de l\'asile de Saint-Rémy.
L\'horizon doré du champ de blé et le cyprès vertical relient la terre et le ciel.`
  },
  'matisse-greenstripe': {
    description: `La division audacieuse des plans de couleur qui divise le visage en deux dans 〈La Raie verte〉 a été appliquée.
Le rose, le jaune et le vert coexistent sur la peau, ignorant complètement la couleur naturelle.

〈La Raie verte〉 est un portrait que Matisse peignit de son épouse Amélie, provoquant des cris de 'bêtes sauvages !' au Salon de 1905.
Une seule raie verte au centre du visage divise lumière et ombre uniquement par la couleur.`
  },
  'matisse-purplecoat': {
    description: `Les intenses plans de couleur et la composition plate décorative de 〈Femme au manteau violet〉 ont été appliqués.
La frontière entre la figure et l\'arrière-plan se dissout, la couleur elle-même créant l\'espace.

〈Femme au manteau violet〉 est une œuvre où Matisse a exprimé l\'émotion à travers des formes simplifiées et une couleur pure.
Le vaste plan de couleur du manteau violet domine la toile, se fondant avec les motifs du fond en un tout.`
  },
  'matisse-derain': {
    description: `Les coups de pinceau rugueux et les couleurs de peau non naturelles du 〈Portrait d\'André Derain〉 ont été appliqués.
Les ombres vertes et la peau orange, avec des couleurs primaires audacieuses, rendent le sujet d\'une manière sauvage et fauviste.

Le 〈Portrait d\'André Derain〉 est un portrait d\'amitié que Matisse peignit de son confrère André Derain.
Les deux peintres échangèrent des portraits l\'un de l\'autre en même temps, partageant ensemble leurs expériences fauves.`
  },
  'chagall-lovers': {
    description: `Les couleurs oniriques et les images superposées de 〈Les Amoureux aux fleurs〉 ont été appliquées.
Le rose, le bleu cobalt et le violet se fondent, effaçant la frontière entre rêve et réalité.

〈Les Amoureux aux fleurs〉 est une œuvre que Chagall peignit sur son amour pour Bella, sa muse et épouse toute sa vie.
Les amoureux superposés comme un rêve sur un fond réel expriment l\'ivresse de l\'amour.`
  },
  'chagall-lamariee': {
    description: `Le contraste onirique des bouquets rouges et du ciel nocturne bleu dans 〈La Mariée〉 a été appliqué.
Animaux et personnages se mêlent comme des apparitions, déployant une fantaisie festive.

〈La Mariée〉 capture les toits et les clochers de la ville natale de Chagall, Vitebsk, comme un paysage de mémoire.
La mariée tenant un bouquet rouge, superposée à la scène du village, renferme nostalgie et joie.`
  },
  'chagall-village': {
    description: `Les perspectives multiples et les images transparentes superposées de 〈Moi et le village〉 ont été appliquées.
Personnes, animaux et paysages villageois se mêlent comme dans un rêve, défiant échelle et proportion.

〈Moi et le village〉 fut peint à Paris alors que Chagall était nostalgique de sa ville natale de Vitebsk.
Réalité et mémoire se fondent sur une seule toile, capturant un désir infini du foyer.`
  },
  'munch-danceoflife': {
    description: `Le contraste symbolique des couleurs claires et sombres dans 〈La Danse de la vie〉 a été appliqué.
Avec la femme centrale en robe rouge comme axe, l\'innocence et le désespoir sont placés de chaque côté.

〈La Danse de la vie〉 est l\'œuvre autobiographique de Munch qui compresse des souvenirs d\'amour et de chagrins en une seule toile.
Les couleurs claires et sombres alternent sur une seule toile, capturant à la fois le début et la fin de l\'amour.`
  },
  'frida-parrots': {
    description: `Le regard frontal intense et les couleurs folkloriques mexicaines de 〈Moi et mes perroquets〉 ont été appliqués.
Des rouges, verts et bleus vifs remplissent la toile aux côtés du feuillage tropical.

〈Moi et mes perroquets〉 est un autoportrait dans lequel Frida est entourée de quatre perroquets.
Les perroquets sont des messagers d\'amour dans le folklore mexicain, et des compagnons fidèles dans la solitude de Frida.`
  },
  'frida-monkeys': {
    description: `Le regard frontal et le luxuriant fond tropical de 〈Autoportrait aux singes〉 ont été appliqués.
Parmi les feuilles vert foncé, ses yeux intenses et ses sourcils joints révèlent son identité.

〈Autoportrait aux singes〉 est un autoportrait que Frida peignit avec ses singes de compagnie.
Dans la mythologie mexicaine, les singes symbolisent le désir, mais pour Frida ils remplaçaient les enfants qu\'elle ne pouvait pas avoir.`
  },
  'lichtenstein-mmaybe': {
    description: `Les points Ben-Day et la narration de bande dessinée des bulles de dialogue dans 〈M-Peut-être〉 ont été appliqués.
Les couleurs primaires remplissent à plat dans des contours épais, recréant la texture d\'une page imprimée.

〈M-Peut-être〉 était une œuvre que Lichtenstein conservait dans sa collection personnelle, vendue 30 000 $—cinq fois le prix habituel.
Elle est maintenant exposée comme pièce maîtresse de la collection Pop Art au Museum Ludwig de Cologne, en Allemagne.`
  },
  'lichtenstein-forgetit': {
    description: `Les points Ben-Day et les intenses contrastes de couleurs primaires de 〈Oublie ça !〉 ont été appliqués.
Les épais contours noirs fixent la forme comme un panneau de bande dessinée, comprimant l\'émotion dramatiquement.

〈Oublie ça !〉 est un chef-d\'œuvre précoce créé juste après la première exposition solo de Lichtenstein en 1962.
Cette même année, le magazine Life titrait : 'Est-il le pire artiste des États-Unis ?'—à son sujet.`
  },
  'lichtenstein-ohhhalright': {
    description: `Les points Ben-Day et la composition de plans de couleur plate de 〈Ohhh...Très bien...〉 ont été appliqués.
Le rouge, le bleu et le jaune se séparent nettement dans des contours noirs, aussi nets qu\'une page imprimée.

〈Ohhh...Très bien...〉 est une œuvre de 1964 empruntée au numéro 88 de Secret Hearts.
Elle s\'est vendue 42,6 millions de dollars chez Christie\'s en 2010, renversant la valeur de ce qu\'il appelait autrefois 'toile usagée'.`
  },
  'lichtenstein-stilllife': {
    description: `Les points Ben-Day et les contours épais créant une expression plate dans 〈Nature morte〉 ont été appliqués.
Les plans de couleurs primaires simplifient les objets à la manière d\'une bande dessinée, recréant la texture de l\'impression.

〈Nature morte〉 fait partie d\'une série des années 1970 dans laquelle Lichtenstein réinterprétait un genre traditionnel en hommage à Picasso.
'Il n\'y a pas d\'ambiance dans mes natures mortes—ce ne sont que des citrons et des pamplemousses', disait-il.`
  },

};
export default { mastersBasicInfo, mastersLoadingEducation, mastersResultEducation };
