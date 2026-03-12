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
    'VAN GOGH': 'Aku menikmati percakapan kita. Tapi bintang-bintang memanggilku — aku harus kembali ke studio.',
    'KLIMT': 'Percakapan kita sangat menyenangkan. Tapi mimpi keemasan menungguku — aku harus kembali ke studio.',
    'MUNCH': 'Aku menikmati percakapan kita. Tapi suara-suara dalam diri memanggilku lagi — aku harus kembali ke studio.',
    'CHAGALL': 'Aku menikmati percakapan kita. Tapi sudah waktunya terbang kembali ke studio mimpiku.',
    'MATISSE': 'Aku menikmati percakapan kita. Tapi warna-warna menungguku — aku harus kembali ke studio.',
    'FRIDA': 'Aku menikmati obrolan kita. Tapi sudah waktunya kembali ke studioku.',
    'LICHTENSTEIN': 'Aku menikmati obrolan kita. Tapi titik-titik sudah memanggilku kembali ke studio!'
  }
,
  // ===== 거장 프로필 (아바타 탭 모달) =====
  profile: {
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Belanda · Post-Impresionisme', quote: '"Aku menaruh hati dan jiwaku dalam karyaku."' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Austria · Art Nouveau', quote: '"Setiap zaman seninya, setiap seni kebebasannya."' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Norwegia · Ekspresionisme', quote: '"Aku tidak melukis apa yang kulihat, tapi apa yang pernah kulihat."' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'Prancis · Fauvisme', quote: '"Tujuan warna bukan menggambarkan bentuk, tapi mengekspresikan emosi."' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Rusia/Prancis · Surealisme', quote: '"Dalam hidup kita hanya ada satu warna — warna cinta."' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'Meksiko · Surealisme', quote: '"Kaki, untuk apa jika aku punya sayap untuk terbang?"' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'AS · Pop Art', quote: '"Aku tidak menggambar komik, aku melukis tentang komik."' },
  }
};

export default masterChat;