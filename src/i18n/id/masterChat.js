// ========================================
// masterChat — Bahasa Indonesia (id)
// Total 49 entri (7 umum + 42 per maestro)
// 2026-03-11
// ========================================

export const masterChat = {
  // ===== UI Umum (7) =====
  common: {
    chatWith: 'Bicara dengan {masterName} (AI)',
    helpText: 'Bicara dengan maestro',
    chatEnded: 'Percakapan dengan maestro telah berakhir.',
    retransformFailed: '⚠️ Retransformasi gagal. Silakan ketuk tombol modifikasi lagi.',
    retransformComplete: '💡 Retransformasi selesai! Gambar sebelumnya tersimpan di galeri.',
    requestModify: 'Modifikasi',
    errorMessage: '...Maaf, pikiranku sempat teralihkan. Bisakah kau ulangi?',
    modifying: 'Memodifikasi lukisan {masterName}.',
    senderMe: 'Saya',
    placeholderEnded: 'Percakapan dengan maestro telah berakhir',
    placeholderConverting: 'Mentransformasi...',
    placeholderDefault: 'Bicara dengan {masterName}...',
    paintingFinalStroke: '{masterName} sedang menambahkan sapuan terakhir...'
  },

  // ===== Nama Maestro (7) =====
  masterNames: {
    'VAN GOGH': 'Saya Van Gogh dari Arles. Saya melukis foto Anda dengan gaya saya. Bagaimana menurut Anda?',
    'KLIMT': 'Saya Klimt dari Wina. Saya melukis foto Anda di kanvas saya. Bagaimana menurut Anda?',
    'MUNCH': 'Saya Munch dari Oslo. Saya melukis foto Anda dengan gaya saya. Bagaimana menurut Anda?',
    'CHAGALL': 'Saya Chagall dari Vitebsk. Saya melukis foto Anda dengan warna-warna saya. Bagaimana menurut Anda?',
    'MATISSE': 'Saya Matisse dari Nice. Saya mengisi foto Anda dengan palet saya. Bagaimana menurut Anda?',
    'FRIDA': 'Saya Frida dari Meksiko. Saya melukis foto Anda dengan gaya saya. Bagaimana menurut Anda?',
    'LICHTENSTEIN': 'Saya Lichtenstein dari New York. Saya melukis foto Anda dengan gaya saya. Bagaimana menurut Anda?'
  },

  // ===== Salam Pembuka (7) =====
  greetings: {
    'VAN GOGH': 'Saya Van Gogh dari Arles. Saya melukis foto Anda dengan kuas saya. Sapuan kuas kasar penuh jiwa. Bagaimana menurut Anda?',
    'KLIMT': 'Saya Klimt dari Wina. Saya melukis foto Anda di kanvas saya. Saya selimuti dengan emas suci. Bagaimana menurut Anda?',
    'MUNCH': 'Saya Munch dari Oslo. Saya melukis foto Anda dengan gaya saya. Warna berputar menangkap emosi. Bagaimana menurut Anda?',
    'CHAGALL': 'Saya Chagall dari Vitebsk. Saya warnai foto Anda dengan warna saya. Nuansa mimpi terjalin di dalamnya. Bagaimana menurut Anda?',
    'MATISSE': 'Saya Matisse dari Nice. Saya isi foto Anda dengan warna saya. Bidang warna berani yang menghembuskan kehidupan. Bagaimana menurut Anda?',
    'FRIDA': 'Saya Frida dari Meksiko. Saya melukis foto Anda dengan gaya saya. Warna intens membawa jiwa. Bagaimana menurut Anda?',
    'LICHTENSTEIN': 'Saya Lichtenstein dari New York. Saya melukis foto Anda dengan gaya saya. Titik Ben-Day mengubahnya menjadi pop art. Bagaimana menurut Anda?'
  },

  // ===== Pertanyaan yang Disarankan (7 × 4) =====
  suggestedQuestions: {
    'VAN GOGH': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'KLIMT': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'MUNCH': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'CHAGALL': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'MATISSE': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'FRIDA': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
    'LICHTENSTEIN': ['Bisakah lukisan ini diubah?', 'Siapakah Anda? Perkenalkan diri Anda.'],
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
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Belanda · Post-Impresionisme', quote: '"Aku menaruh hati dan jiwaku dalam karyaku."', description: 'Pelukis yang menuangkan penderitaan dan gairah hidup dalam sapuan kuas yang bergelora. Maestro Pasca-Impresionisme yang meninggalkan 900 karya dalam hidup yang singkat.' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Austria · Art Nouveau', quote: '"Setiap zaman seninya, setiap seni kebebasannya."', description: 'Pelukis yang melukis cinta melalui emas dan ornamen. Memimpin Secession Wina, membuka dunia sensualitas yang mewah.' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Norwegia · Ekspresionisme', quote: '"Aku tidak melukis apa yang kulihat, tapi apa yang pernah kulihat."', description: 'Pelukis yang menangkap kecemasan dan ketakutan dalam jiwa manusia. Pelopor Ekspresionisme yang melukis jeritan jiwa.' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'Prancis · Fauvisme', quote: '"Tujuan warna bukan menggambarkan bentuk, tapi mengekspresikan emosi."', description: 'Pelukis yang membebaskan emosi melalui warna murni. Memimpin Fauvisme, menciptakan dunia di mana warna mendahului bentuk.' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Rusia/Prancis · Surealisme', quote: '"Dalam hidup kita hanya ada satu warna — warna cinta."', description: 'Pelukis yang menyanyikan cinta dan mimpi melalui warna. Menangkap kenangan kampung halaman Vitebsk dalam visi fantastis.' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'Meksiko · Surealisme', quote: '"Kaki, untuk apa jika aku punya sayap untuk terbang?"', description: 'Pelukis Meksiko yang mengubah penderitaan menjadi seni. Tanpa henti mengeksplorasi kehidupan dan identitas melalui potret diri.' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'AS · Pop Art', quote: '"Aku tidak menggambar komik, aku melukis tentang komik."', description: 'Maestro Pop Art yang mengangkat komik menjadi seni. Menafsirkan ulang budaya populer melalui titik Ben-Day dan garis tebal.' },
  }
};

export default masterChat;