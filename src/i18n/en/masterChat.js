// ========================================
// masterChat — English (en)
// Total 49 items (7 common + 42 per-master)
// ========================================

export const masterChat = {
  // ===== Common UI (7) =====
  common: {
    chatWith: 'Chat with {masterName}(AI)',
    helpText: 'Chat with the master',
    chatEnded: 'Chat with the master has ended.',
    retransformComplete: '💡 Retransform complete! Previous image saved to gallery.',
    requestModify: 'Modify',
    errorMessage: "...Sorry, my thoughts wandered. Could you say that again?",
    modifying: '{masterName} is modifying the artwork.',
    senderMe: 'Me',
    placeholderEnded: 'Chat with the master has ended',
    placeholderConverting: 'Converting...',
    placeholderDefault: 'Chat with {masterName}...'
  },

  // ===== Master Names (7) =====
  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  // ===== Greetings (7) =====
  greetings: {
    'VAN GOGH': "I am Van Gogh of Arles. I\'ve been revived through AI. I\'ve completed your portrait—what do you think?",
    'KLIMT': "I am Klimt of Vienna. I\'ve been revived through AI. I\'ve completed your portrait—what do you think?",
    'MUNCH': "I am Munch of Oslo. I\'ve been revived through AI. I\'ve completed your portrait—what do you think?",
    'CHAGALL': "I am Chagall of Vitebsk. I\'ve been revived through AI. I\'ve completed your portrait—what do you think?",
    'MATISSE': "I am Matisse of Nice. I\'ve been revived through AI. I\'ve completed your portrait—what do you think?",
    'FRIDA': "I\'m Frida from Mexico. I\'ve been revived through AI. I\'ve finished your portrait—what do you think?",
    'LICHTENSTEIN': "I\'m Lichtenstein from New York. I\'ve been revived through AI. I\'ve finished your portrait—what do you think?"
  },

  // ===== Suggested Questions (7 × 4 = 28) =====
  suggestedQuestions: {
    'VAN GOGH': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'KLIMT': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'MUNCH': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'CHAGALL': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'MATISSE': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'FRIDA': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
    'LICHTENSTEIN': ['Can I modify the painting?', 'Who are you? Please introduce yourself.'],
  },

  // ===== Result Messages (7) =====
  resultMessages: {
    'VAN GOGH': "Done! What do you think? Let me know if you\'d like more changes.",
    'KLIMT': "Done. What do you think? Let me know if you\'d like more changes.",
    'MUNCH': "Done. What do you think? Let me know if you\'d like more changes.",
    'CHAGALL': "Done! What do you think? Let me know if you\'d like more changes.",
    'MATISSE': "Done! What do you think? Let me know if you\'d like more changes.",
    'FRIDA': "Done. What do you think? Let me know if you want more changes.",
    'LICHTENSTEIN': "Done! What do you think? Let me know if you want more changes."
  },

  // ===== Farewell Messages (7) =====
  farewellMessages: {
    'VAN GOGH': 'I enjoyed our conversation. But alas, the stars are calling — I must return to my studio.',
    'KLIMT': 'Our conversation was a pleasure. But alas, golden dreams await — I must return to my studio.',
    'MUNCH': 'I enjoyed our conversation. But alas, the voices within call again — I must return to my studio.',
    'CHAGALL': 'I enjoyed our conversation. But alas, it is time to fly back to my studio of dreams.',
    'MATISSE': 'I enjoyed our conversation. But alas, the colors are waiting — I must return to my studio.',
    'FRIDA': 'I enjoyed our chat. But it\'s time to go back to my studio.',
    'LICHTENSTEIN': 'I enjoyed our chat. But the dots are calling me back to the studio!'
  }
,
  // ===== 거장 프로필 (아바타 탭 모달) =====
  profile: {
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Netherlands · Post-Impressionism', quote: '"I put my heart and soul into my work."', description: 'A painter who poured life\'s pain and passion into fierce brushstrokes. A Post-Impressionist master who left 900 works in a brief lifetime.' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Austria · Art Nouveau', quote: '"To every age its art, to every art its freedom."', description: 'A painter who depicted love through gold leaf and ornamentation. He led the Vienna Secession, opening a world of lavish sensuality.' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Norway · Expressionism', quote: '"I paint not what I see, but what I saw."', description: 'A painter who captured the anxiety and dread within the human soul. A pioneer of Expressionism who painted the scream of the spirit.' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'France · Fauvism', quote: '"The purpose of color is not to describe form but to express emotion."', description: 'A painter who liberated emotion through pure color alone. He led the Fauves, creating a world where color came before form.' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Russia/France · Surrealism', quote: '"In our life there is a single color — the color of love."', description: 'A painter who sang of love and dreams through color. He captured the memories of his hometown Vitebsk in fantastical visions.' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'Mexico · Surrealism', quote: '"Feet, what do I need them for if I have wings to fly?"', description: 'A Mexican painter who transformed suffering into art. She endlessly explored life and identity through her self-portraits.' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'USA · Pop Art', quote: '"I don\'t draw comics, I paint pictures about comics."', description: 'A Pop Art master who elevated comics to fine art. He reinterpreted popular culture through Ben-Day dots and bold outlines.' },
  }
};

export default masterChat;