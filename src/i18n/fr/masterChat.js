// ========================================
// masterChat — Français (fr)
// Total 49 entrées (7 communes + 42 par maître)
// 2026-03-11
// ========================================

export const masterChat = {
  // ===== UI commun (7) =====
  common: {
    chatWith: 'Discuter avec {masterName} (IA)',
    helpText: 'Demandez au maître de modifier le résultat ou posez-lui n\'importe quelle question.',
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
    'VAN GOGH': ['Changez la couleur de mes cheveux', 'Ajoutez des boucles d\'oreilles', 'Parlez-moi de votre oreille', 'Pourquoi aimez-vous les tournesols ?'],
    'KLIMT': ['Changez la couleur de mes lèvres', 'Ajoutez des boucles d\'oreilles', 'Qui était le modèle du Baiser ?', 'Pourquoi utilisez-vous autant l\'or ?'],
    'MUNCH': ['Changez la couleur de mes cheveux', 'Ajoutez des boucles d\'oreilles', 'Vous êtes-vous marié ?', 'Pourquoi avez-vous peint Le Cri ?'],
    'CHAGALL': ['Changez la couleur de mes cheveux', 'Ajoutez des boucles d\'oreilles', 'Avez-vous connu l\'amour ?', 'Aimez-vous les animaux ?'],
    'MATISSE': ['Changez la couleur de mes lèvres', 'Ajoutez des boucles d\'oreilles', 'Présentez-vous', 'Pourquoi vos couleurs sont-elles si vives ?'],
    'FRIDA': ['Changez la couleur de mes lèvres', 'Ajoutez des boucles d\'oreilles', 'Parlez-moi de l\'accident', 'Pourquoi peigniez-vous autant d\'autoportraits ?'],
    'LICHTENSTEIN': ['Changez la couleur de mes cheveux', 'Ajoutez des boucles d\'oreilles', 'Présentez-vous', 'Pourquoi peignez-vous comme une bande dessinée ?']
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
    'VAN GOGH': 'J\'ai apprécié notre conversation. Mais les étoiles m\'appellent — je dois retourner à ma toile.',
    'KLIMT': 'Notre conversation fut un plaisir. Mais les rêves dorés m\'attendent — je dois partir.',
    'MUNCH': 'J\'ai apprécié notre conversation. Mais les voix intérieures m\'appellent à nouveau — je dois partir.',
    'CHAGALL': 'J\'ai apprécié notre conversation. Mais il est temps de revoler dans mes rêves.',
    'MATISSE': 'J\'ai apprécié notre conversation. Mais les couleurs m\'attendent — je dois partir.',
    'FRIDA': 'J\'ai apprécié notre échange. Mais il est temps de retourner devant mon miroir.',
    'LICHTENSTEIN': 'J\'ai apprécié notre échange. Mais les points m\'attendent !'
  }
};

export default masterChat;
