// ========================================
// masterChat — Bahasa Indonesia (id)
// Total 49 entri (7 umum + 42 per maestro)
// 2026-03-11
// ========================================

export const masterChat = {
  // ===== UI Umum (7) =====
  common: {
    chatWith: 'Bicara dengan {masterName} (AI)',
    helpText: 'Minta maestro untuk memodifikasi hasilnya, atau tanyakan apa saja.',
    chatEnded: 'Percakapan dengan maestro telah berakhir.',
    retransformComplete: '💡 Retransformasi selesai! Gambar sebelumnya tersimpan di galeri.',
    requestModify: 'Modifikasi',
    errorMessage: '...Maaf, pikiranku sempat teralihkan. Bisakah kau ulangi?',
    modifying: 'Memodifikasi lukisan {masterName}.',
    senderMe: 'Saya',
    placeholderEnded: 'Percakapan dengan maestro telah berakhir',
    placeholderConverting: 'Mentransformasi...',
    placeholderDefault: 'Bicara dengan {masterName}...'
  },

  // ===== Nama Maestro (7) =====
  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  // ===== Salam Pembuka (7) =====
  greetings: {
    'VAN GOGH': 'Aku Van Gogh dari Arles. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'KLIMT': 'Aku Klimt dari Wina. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'MUNCH': 'Aku Munch dari Oslo. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'CHAGALL': 'Aku Chagall dari Vitebsk. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'MATISSE': 'Aku Matisse dari Nice. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'FRIDA': 'Aku Frida dari Meksiko. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?',
    'LICHTENSTEIN': 'Aku Lichtenstein dari New York. Aku dibangkitkan kembali melalui AI. Aku telah menyelesaikan lukisanmu, bagaimana menurutmu?'
  },

  // ===== Pertanyaan yang Disarankan (7 × 4) =====
  suggestedQuestions: {
    'VAN GOGH': ['Ubah warna rambutku', 'Tambahkan anting', 'Ceritakan soal telingamu', 'Kenapa kamu suka bunga matahari?'],
    'KLIMT': ['Ubah warna bibirku', 'Tambahkan anting', 'Siapa model dalam "The Kiss"?', 'Kenapa kamu suka warna emas?'],
    'MUNCH': ['Ubah warna rambutku', 'Tambahkan anting', 'Pernah menikah?', 'Kenapa kamu melukis "The Scream"?'],
    'CHAGALL': ['Ubah warna rambutku', 'Tambahkan anting', 'Pernah jatuh cinta?', 'Kamu suka binatang?'],
    'MATISSE': ['Ubah warna bibirku', 'Tambahkan anting', 'Perkenalkan dirimu', 'Kenapa warnamu begitu cerah?'],
    'FRIDA': ['Ubah warna bibirku', 'Tambahkan anting', 'Ceritakan tentang kecelakaanmu', 'Kenapa kamu banyak melukis potret diri?'],
    'LICHTENSTEIN': ['Ubah warna rambutku', 'Tambahkan anting', 'Perkenalkan dirimu', 'Kenapa kamu melukis seperti komik?']
  },

  // ===== Pesan Modifikasi Selesai (7) =====
  resultMessages: {
    'VAN GOGH': 'Sudah dimodifikasi! Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'KLIMT': 'Sudah dimodifikasi. Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'MUNCH': 'Sudah dimodifikasi. Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'CHAGALL': 'Sudah dimodifikasi! Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'MATISSE': 'Sudah dimodifikasi! Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'FRIDA': 'Sudah dimodifikasi. Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.',
    'LICHTENSTEIN': 'Sudah dimodifikasi! Bagaimana, suka? Kalau ada yang ingin diubah lagi, bilang saja.'
  },

  // ===== Pesan Perpisahan (7) =====
  farewellMessages: {
    'VAN GOGH': 'Aku menikmati percakapan kita. Tapi bintang-bintang memanggilku — aku harus kembali ke kanvasku.',
    'KLIMT': 'Percakapan kita sangat menyenangkan. Tapi mimpi keemasan menungguku — aku harus pergi.',
    'MUNCH': 'Aku menikmati percakapan kita. Tapi suara-suara dalam diri memanggilku lagi — aku harus pergi.',
    'CHAGALL': 'Aku menikmati percakapan kita. Tapi sudah waktunya terbang kembali ke dunia mimpiku.',
    'MATISSE': 'Aku menikmati percakapan kita. Tapi warna-warna menungguku — aku harus pergi.',
    'FRIDA': 'Aku menikmati obrolan kita. Tapi sudah waktunya kembali ke cerminku.',
    'LICHTENSTEIN': 'Aku menikmati obrolan kita. Tapi titik-titik sudah memanggilku!'
  }
};

export default masterChat;
