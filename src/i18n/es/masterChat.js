// ========================================
// masterChat — Español (es)
// Total 49 entradas (7 comunes + 42 por maestro)
// 2026-03-11
// ========================================

export const masterChat = {
  // ===== UI Común (7) =====
  common: {
    chatWith: 'Chatear con {masterName} (IA)',
    helpText: 'Habla con el maestro',
    chatEnded: 'La conversación con el maestro ha finalizado.',
    retransformComplete: '💡 ¡Retransformación completada! La imagen anterior está guardada en tu galería.',
    requestModify: 'Modificar',
    errorMessage: '...Perdona, me he distraído un momento. ¿Podrías repetirlo?',
    modifying: 'Modificando el cuadro de {masterName}.',
    senderMe: 'Yo',
    placeholderEnded: 'Conversación con el maestro finalizada',
    placeholderConverting: 'Transformando...',
    placeholderDefault: 'Conversar con {masterName}...'
  },

  // ===== Nombres de maestros (7) =====
  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  // ===== Saludos iniciales (7) =====
  greetings: {
    'VAN GOGH': 'Soy Van Gogh, de Arlés. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?',
    'KLIMT': 'Soy Klimt, de Viena. He resucitado a través de la IA. He terminado tu cuadro, ¿qué opinas?',
    'MUNCH': 'Soy Munch, de Oslo. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?',
    'CHAGALL': 'Soy Chagall, de Vítebsk. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?',
    'MATISSE': 'Soy Matisse, de Niza. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?',
    'FRIDA': 'Soy Frida, de México. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?',
    'LICHTENSTEIN': 'Soy Lichtenstein, de Nueva York. He resucitado a través de la IA. He terminado tu cuadro, ¿qué te parece?'
  },

  // ===== Preguntas sugeridas (7 × 4 = 28) =====
  suggestedQuestions: {
    'VAN GOGH': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'KLIMT': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'MUNCH': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'CHAGALL': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'MATISSE': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'FRIDA': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
    'LICHTENSTEIN': ['¿Se puede modificar el cuadro?', 'Me encantaría saber más sobre usted'],
  },

  // ===== Mensajes de modificación completada (7) =====
  resultMessages: {
    'VAN GOGH': '¡Listo! ¿Qué te parece? Si quieres cambiar algo más, dímelo.',
    'KLIMT': 'He realizado los cambios. ¿Qué opinas? Dime si deseas modificar algo más.',
    'MUNCH': 'Hecho. ¿Qué te parece? Si quieres cambiar algo más, dímelo.',
    'CHAGALL': '¡Listo! ¿Qué te parece? Si quieres cambiar algo más, dímelo.',
    'MATISSE': '¡Listo! ¿Qué te parece? Si quieres cambiar algo más, dímelo.',
    'FRIDA': 'Hecho. ¿Qué te parece? Si quieres cambiar algo más, dímelo.',
    'LICHTENSTEIN': '¡Listo! ¿Qué te parece? Si quieres cambiar algo más, dímelo.'
  },

  // ===== Despedidas (7) =====
  farewellMessages: {
    'VAN GOGH': 'Disfruté nuestra conversación. Pero las estrellas me llaman — debo volver a mi estudio.',
    'KLIMT': 'Nuestra conversación fue un placer. Pero los sueños dorados me esperan — debo volver a mi estudio.',
    'MUNCH': 'Disfruté nuestra conversación. Pero las voces interiores me llaman de nuevo — debo volver a mi estudio.',
    'CHAGALL': 'Disfruté nuestra conversación. Pero es hora de volar de vuelta a mi estudio de sueños.',
    'MATISSE': 'Disfruté nuestra conversación. Pero los colores me esperan — debo volver a mi estudio.',
    'FRIDA': 'Disfruté nuestra charla. Pero es hora de volver a mi estudio.',
    'LICHTENSTEIN': 'Disfruté nuestra charla. ¡Pero los puntos me esperan en el estudio!'
  }
,
  // ===== 거장 프로필 (아바타 탭 모달) =====
  profile: {
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Países Bajos · Postimpresionismo', quote: '"Pongo mi corazón y mi alma en mi trabajo."', description: 'Un pintor que vertió el dolor y la pasión de la vida en pinceladas intensas. Maestro del Postimpresionismo que dejó 900 obras en una breve vida.' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Austria · Art Nouveau', quote: '"A cada época su arte, a cada arte su libertad."', description: 'Un pintor que retrató el amor con pan de oro y ornamentación. Lideró la Secesión de Viena, abriendo un mundo de suntuosa sensualidad.' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Noruega · Expresionismo', quote: '"No pinto lo que veo, sino lo que vi."', description: 'Un pintor que capturó la angustia y el miedo del alma humana. Pionero del Expresionismo que pintó el grito del espíritu.' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'Francia · Fauvismo', quote: '"El propósito del color no es describir la forma, sino expresar la emoción."', description: 'Un pintor que liberó la emoción a través del color puro. Lideró a los fauves, creando un mundo donde el color precedía a la forma.' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Rusia/Francia · Surrealismo', quote: '"En nuestra vida solo hay un color: el color del amor."', description: 'Un pintor que cantó al amor y los sueños a través del color. Capturó los recuerdos de su Vítebsk natal en visiones fantásticas.' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'México · Surrealismo', quote: '"Pies, ¿para qué los quiero si tengo alas para volar?"', description: 'Una pintora mexicana que transformó el sufrimiento en arte. Exploró incansablemente la vida y la identidad a través de sus autorretratos.' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'EE.UU. · Pop Art', quote: '"No dibujo cómics, pinto cuadros sobre cómics."', description: 'Maestro del Pop Art que elevó el cómic a arte. Reinterpretó la cultura popular a través de puntos Ben-Day y líneas audaces.' },
  }
};

export default masterChat;