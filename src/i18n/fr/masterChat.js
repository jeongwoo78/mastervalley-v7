// ========================================
// masterChat — Français (fr)
// Total 49 entrées (7 communes + 42 par maître)
// 2026-03-11
// ========================================

export const masterChat = {
  // ===== UI commun (7) =====
  common: {
    chatWith: 'Discuter avec {masterName} (IA)',
    helpText: 'Discutez avec le maître',
    chatEnded: 'La conversation avec le maître est terminée.',
    retransformComplete: '💡 Retransformation terminée ! L\'image précédente est sauvegardée dans votre galerie.',
    requestModify: 'Modifier',
    errorMessage: '...Pardonnez-moi, j\'ai perdu le fil un instant. Pourriez-vous répéter ?',
    modifying: 'Modification du tableau de {masterName}.',
    senderMe: 'Moi',
    placeholderEnded: 'Conversation avec le maître terminée',
    placeholderConverting: 'Transformation en cours...',
    placeholderDefault: 'Converser avec {masterName}...'
  },

  // ===== Noms des maîtres (7) =====
  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  // ===== Salutations initiales (7) =====
  greetings: {
    'VAN GOGH': 'Je suis Van Gogh, d\'Arles. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'KLIMT': 'Je suis Klimt, de Vienne. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'MUNCH': 'Je suis Munch, d\'Oslo. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'CHAGALL': 'Je suis Chagall, de Vitebsk. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'MATISSE': 'Je suis Matisse, de Nice. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'FRIDA': 'Je suis Frida, du Mexique. Je suis ressuscitée grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?',
    'LICHTENSTEIN': 'Je suis Lichtenstein, de New York. Je suis ressuscité grâce à l\'IA. J\'ai terminé votre tableau, qu\'en pensez-vous ?'
  },

  // ===== Questions suggérées (7 × 4 = 28) =====
  suggestedQuestions: {
    'VAN GOGH': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'KLIMT': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'MUNCH': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'CHAGALL': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'MATISSE': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'FRIDA': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
    'LICHTENSTEIN': ['Peut-on modifier le tableau ?', 'J'aimerais en savoir plus sur vous'],
  },

  // ===== Messages de modification terminée (7) =====
  resultMessages: {
    'VAN GOGH': 'C\'est fait ! Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.',
    'KLIMT': 'J\'ai effectué les modifications. Qu\'en pensez-vous ? Faites-moi savoir si vous souhaitez changer autre chose.',
    'MUNCH': 'C\'est fait. Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.',
    'CHAGALL': 'C\'est fait ! Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.',
    'MATISSE': 'C\'est fait ! Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.',
    'FRIDA': 'C\'est fait. Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.',
    'LICHTENSTEIN': 'C\'est fait ! Qu\'en pensez-vous ? Dites-moi si vous souhaitez d\'autres modifications.'
  },

  // ===== Messages d\'au revoir (7) =====
  farewellMessages: {
    'VAN GOGH': 'J\'ai apprécié notre conversation. Mais les étoiles m\'appellent — je dois retourner à mon atelier.',
    'KLIMT': 'Notre conversation fut un plaisir. Mais les rêves dorés m\'attendent — je dois retourner à mon atelier.',
    'MUNCH': 'J\'ai apprécié notre conversation. Mais les voix intérieures m\'appellent à nouveau — je dois retourner à mon atelier.',
    'CHAGALL': 'J\'ai apprécié notre conversation. Mais il est temps de revoler vers mon atelier de rêves.',
    'MATISSE': 'J\'ai apprécié notre conversation. Mais les couleurs m\'attendent — je dois retourner à mon atelier.',
    'FRIDA': 'J\'ai apprécié notre échange. Mais il est temps de retourner à mon atelier.',
    'LICHTENSTEIN': 'J\'ai apprécié notre échange. Mais les points m\'attendent à l\'atelier !'
  }
,
  // ===== 거장 프로필 (아바타 탭 모달) =====
  profile: {
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Pays-Bas · Post-Impressionnisme', quote: '"Je mets mon cœur et mon âme dans mon travail."', description: 'Un peintre qui a déversé la douleur et la passion dans des coups de pinceau ardents. Maître du postimpressionnisme ayant laissé 900 œuvres en une courte vie.' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Autriche · Art Nouveau', quote: '"À chaque époque son art, à chaque art sa liberté."', description: 'Un peintre qui a dépeint l\'amour par la feuille d\'or et l\'ornementation. Il a mené la Sécession viennoise, ouvrant un monde de sensualité somptueuse.' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Norvège · Expressionnisme', quote: '"Je ne peins pas ce que je vois, mais ce que j\'ai vu."', description: 'Un peintre qui a capturé l\'angoisse et la peur de l\'âme humaine. Pionnier de l\'expressionnisme qui a peint le cri de l\'esprit.' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'France · Fauvisme', quote: '"Le but de la couleur n\'est pas de décrire la forme mais d\'exprimer l\'émotion."', description: 'Un peintre qui a libéré l\'émotion par la couleur pure. Il a mené les fauves, créant un monde où la couleur précède la forme.' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Russie/France · Surréalisme', quote: '"Dans notre vie, il n\'y a qu\'une seule couleur : celle de l\'amour."', description: 'Un peintre qui a chanté l\'amour et les rêves à travers la couleur. Il a capturé les souvenirs de Vitebsk dans des visions fantastiques.' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'Mexique · Surréalisme', quote: '"Des pieds, pourquoi en voudrais-je si j\'ai des ailes pour voler ?"', description: 'Une peintre mexicaine qui a transformé la souffrance en art. Elle a exploré sans cesse la vie et l\'identité à travers ses autoportraits.' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'États-Unis · Pop Art', quote: '"Je ne dessine pas des BD, je peins des tableaux sur les BD."', description: 'Maître du Pop Art qui a élevé la bande dessinée au rang d\'art. Il a réinterprété la culture populaire avec des points Ben-Day et des contours audacieux.' },
  }
};

export default masterChat;