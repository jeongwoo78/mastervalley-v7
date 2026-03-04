// ========================================
// masterChat — Español (es)
// Total 49 entradas (7 comunes + 42 por maestro)
// v70 - 2026-03-04
// ========================================

export const masterChat = {
  // ===== UI Común (7) =====
  common: {
    chatWith: 'Chatear con {masterName} (IA)',
    helpText: 'Pídele al maestro que modifique el resultado o hazle cualquier pregunta.',
    chatEnded: 'La conversación ha finalizado.',
    retransformComplete: '💡 ¡Retransformación completada! La imagen anterior está guardada en tu galería.',
    requestModify: 'Modificar',
    errorMessage: '...Perdona, me he distraído un momento. ¿Podrías repetirlo?',
    modifying: 'Modificando el cuadro de {masterName}.',
    senderMe: 'Yo',
    placeholderEnded: 'Conversación finalizada',
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

  // ===== Preguntas sugeridas (7 × 3 = 21) =====
  suggestedQuestions: {
    'VAN GOGH': ['Cambia el color de mi pelo', 'Añade pendientes', 'Cuéntame sobre tu oreja', '¿Por qué te gustan los girasoles?'],
    'KLIMT': ['Cambia el color de mis labios', 'Añade pendientes', '¿Quién fue el modelo de El beso?', '¿Por qué usas tanto el oro?'],
    'MUNCH': ['Cambia el color de mi pelo', 'Añade pendientes', '¿Te casaste alguna vez?', '¿Por qué pintaste El grito?'],
    'CHAGALL': ['Cambia el color de mi pelo', 'Añade pendientes', '¿Has estado enamorado?', '¿Te gustan los animales?'],
    'MATISSE': ['Cambia el color de mis labios', 'Añade pendientes', 'Preséntate', '¿Por qué tus colores son tan vivos?'],
    'FRIDA': ['Cambia el color de mis labios', 'Añade pendientes', 'Cuéntame sobre el accidente', '¿Por qué pintabas tantos autorretratos?'],
    'LICHTENSTEIN': ['Cambia el color de mi pelo', 'Añade pendientes', 'Preséntate', '¿Por qué pintas como un cómic?']
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
    'VAN GOGH': 'Bueno, vuelvo a mi estudio.',
    'KLIMT': 'Bien, regreso a mi estudio.',
    'MUNCH': 'Bueno, vuelvo a mi estudio.',
    'CHAGALL': 'Bueno, vuelvo a mi estudio.',
    'MATISSE': 'Bueno, vuelvo a mi estudio.',
    'FRIDA': 'Bueno, vuelvo a mi estudio.',
    'LICHTENSTEIN': 'Bueno, vuelvo a mi estudio.'
  }
};

export default masterChat;
