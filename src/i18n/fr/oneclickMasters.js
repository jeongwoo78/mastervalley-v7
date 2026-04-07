// ========================================
// One-Click Grands Maîtres — Français (fr)
// 2026-03-11
// ----------------------------------------
// 1re : ton poétique (chargement, attente)
// 2e : explicatif (définition → technique/style → caractéristiques → sens/évaluation)
// ========================================

// ==================== Informations de base (résultat 2e) ====================

export const oneclickMastersBasicInfo = {
  'vangogh': {
    name: 'Vincent van Gogh (1853–1890)',
    subtitle1: 'La Nuit étoilée · Les Tournesols · Autoportrait',
    subtitle2: 'La passion du pinceau en spirale'
  },
  'klimt': {
    name: 'Gustav Klimt (1862–1918)',
    subtitle1: 'Le Baiser · Adèle · L\'Arbre de vie',
    subtitle2: 'Le monde doré de la sensualité'
  },
  'munch': {
    name: 'Edvard Munch (1863–1944)',
    subtitle1: 'Le Cri · Madonna · La Danse de la vie',
    subtitle2: 'Peindre le cri intérieur'
  },
  'matisse': {
    name: 'Henri Matisse (1869–1954)',
    subtitle1: 'La Danse · La Chambre rouge · La Raie verte',
    subtitle2: 'Le magicien de la couleur'
  },
  'chagall': {
    name: 'Marc Chagall (1887–1985)',
    subtitle1: 'Au-dessus de la ville · Moi et le Village · Bouquet aux amoureux volants',
    subtitle2: 'Poète de l\'amour et des rêves'
  },
  'picasso': {
    name: 'Pablo Picasso (1881–1973)',
    subtitle1: 'Les Demoiselles d\'Avignon · Guernica · Portrait de Dora Maar',
    subtitle2: 'Le révolutionnaire qui déconstruisit le regard'
  },
  'frida': {
    name: 'Frida Kahlo (1907–1954)',
    subtitle1: 'La Colonne brisée · Collier d\'épines et colibri',
    subtitle2: 'L\'autoportrait qui affronta la douleur'
  },
  'lichtenstein': {
    name: 'Roy Lichtenstein (1923–1997)',
    subtitle1: 'Drowning Girl · Whaam! · In the Car',
    subtitle2: 'L\'homme qui transforma la BD en art'
  }
};

// ==================== 1re Éducation (écran de chargement) ====================

export const oneclickMastersPrimary = {
  content: `Sept maîtres : avant d\'être des génies,
ils furent des êtres en quête de leur propre langage.

Van Gogh laissa 900 œuvres en dix ans et s\'en alla ;
ses étoiles tournent encore en spirale.

Klimt cacha l\'amour et la mort sous l\'or ;
Munch exhala le cri de la perte toute sa vie.

Matisse protégea la joie de la couleur même dans la guerre ;
Chagall vola dans le ciel avec celle qu\'il aimait.

Frida affronta son corps brisé du regard ;
Lichtenstein interrogea le monde avec une case de bande dessinée.

Ils ont questionné, brisé et reconstruit.
Sept mondes. À vous de répondre.`
};

// ==================== 2e Éducation (écran de résultat) ====================

export const oneclickMastersSecondary = {

  'vangogh': {
    content: `Van Gogh fut un peintre qui révéla ses émotions directement par la couleur.
Il utilisait la technique de l\'empâtement, superposant la peinture en couches épaisses, et ses touches tourbillonnent avec violence.

L\'intense contraste complémentaire entre jaune et bleu domine la toile.
Dans chaque coup de pinceau, sa passion et sa solitude sont gravées intactes.`
  },

  'klimt': {
    content: `Klimt fut le peintre qui peignit le rêve doré de la Vienne fin de siècle.
Il appliquait de véritables feuilles d\'or sur la toile, et les motifs géométriques inspirés des mosaïques byzantines se répètent.

Spirales, cercles et triangles créent un rythme décoratif sur toute la surface.
Sous cet éclat doré, sensualité et sacralité s\'entrelacent.`
  },

  'munch': {
    content: `Munch fut un peintre qui ne peignit pas ce que l\'on voit, mais ce que l\'on ressent.
Par des courbes en spirale et des formes distordues, il révéla la psychologie humaine directement.

Des ciels couleur de sang et des couleurs maladives visualisent l\'angoisse existentielle et la terreur.
De la pointe de son pinceau jaillit le cri intérieur.`
  },

  'matisse': {
    content: `Matisse fut un peintre qui libéra la couleur comme langage des émotions.
Il ne suivit pas la couleur réelle : il posa du vert, du violet et de l\'orange sans hésiter même sur les visages.

Les formes complexes sont simplifiées avec audace en courbes et en aplats.
Sur ses toiles, la couleur chante d\'elle-même.`
  },

  'chagall': {
    content: `Chagall fut un peintre qui versa l\'amour et les rêves sur la toile.
Par des couleurs oniriques et des compositions irréelles, il peignit des mondes de souvenirs et de fantaisie.

Roses, lavandes et bleu cobalt enveloppent les souvenirs de son Vitebsk natal.
Sur ses toiles, réalité et rêve se fondent sans frontière.`
  },

  'picasso': {
    content: `Picasso fut le plus grand révolutionnaire du XXe siècle, fondateur du Cubisme.
Il décomposa les objets en plans géométriques et recomposa plusieurs perspectives sur une seule toile.

La structure multiperspective, où face et profil coexistent, est sa marque.
Il détruisit 500 ans d\'ordre perspectif.`
  },

  'frida': {
    content: `Frida Kahlo fut une artiste qui sublima la douleur en art.
Par un regard frontal intense et des éléments symboliques, elle se confronta à elle-même.

Les rouges, jaunes et verts du folklore mexicain dominent la toile.
Sur son canvas, douleur et existence ne font qu\'un.`
  },

  'lichtenstein': {
    content: `Lichtenstein fut un maître du Pop Art qui éleva la bande dessinée au rang d\'art.
Il agrandit à grande échelle les points Ben-Day de l\'imprimé et fixa les formes avec d\'épais contours noirs.

Seuls les primaires purs — rouge, bleu et jaune — remplissent la toile.
Il effaça la frontière entre culture populaire et beaux-arts.`
  }
};

export default {
  oneclickMastersBasicInfo,
  oneclickMastersPrimary,
  oneclickMastersSecondary
};
