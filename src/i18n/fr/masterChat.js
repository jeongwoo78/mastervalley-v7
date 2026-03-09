// ========================================
// masterChat — Français (fr)
// Total 49 entrées (7 communes + 42 par maître)
// v70 - 2026-03-04
// ========================================

export const masterChat = {
  // ===== UI commun (7) =====
  common: {
    chatWith: 'Discuter avec {masterName} (IA)',
    helpText: 'Demandez au maître de modifier le résultat ou posez-lui n\'importe quelle question.',
    chatEnded: 'La conversation est terminée.',
    retransformComplete: '💡 Retransformation terminée ! L\'image précédente est sauvegardée dans votre galerie.',
    requestModify: 'Modifier',
    errorMessage: '...Pardonnez-moi, j\'ai perdu le fil un instant. Pourriez-vous répéter ?',
    modifying: 'Modification du tableau de {masterName}.',
    senderMe: 'Moi',
    placeholderEnded: 'Conversation terminée',
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
    'VAN GOGH': 'Bien, je retourne à mon atelier.',
    'KLIMT': 'Bien, je regagne mon atelier.',
    'MUNCH': 'Bien, je retourne à mon atelier.',
    'CHAGALL': 'Bien, je retourne à mon atelier.',
    'MATISSE': 'Bien, je retourne à mon atelier.',
    'FRIDA': 'Bien, je retourne à mon atelier.',
    'LICHTENSTEIN': 'Bien, je retourne à mon atelier.'
  }
};

export default masterChat;
