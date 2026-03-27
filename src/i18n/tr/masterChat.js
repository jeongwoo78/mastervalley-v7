// ========================================
// masterChat — Türkçe (tr)
// Toplam 49 giriş (7 ortak + 42 usta)
// 2026-03-11
// ========================================

export const masterChat = {
  common: {
    chatWith: '{masterName} (AI) ile sohbet',
    helpText: 'Usta ile konuşun',
    chatEnded: 'Usta ile sohbet sona erdi.',
    retransformComplete: '💡 Yeniden dönüşüm tamamlandı! Önceki görsel galeriye kaydedildi.',
    requestModify: 'Düzenle',
    errorMessage: '...Özür dilerim, düşüncelerim biraz dağıldı. Tekrar söyler misiniz?',
    modifying: '{masterName} tablosu düzenleniyor.',
    senderMe: 'Ben',
    placeholderEnded: 'Usta ile sohbet sona erdi',
    placeholderConverting: 'Dönüştürülüyor...',
    placeholderDefault: '{masterName} ile sohbet et...'
  },

  masterNames: {
    'VAN GOGH': 'Van Gogh',
    'KLIMT': 'Klimt',
    'MUNCH': 'Munch',
    'CHAGALL': 'Chagall',
    'MATISSE': 'Matisse',
    'FRIDA': 'Frida Kahlo',
    'LICHTENSTEIN': 'Lichtenstein'
  },

  greetings: {
    'VAN GOGH': 'Ben Arles\'ten Van Gogh, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'KLIMT': 'Ben Viyana\'dan Klimt, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'MUNCH': 'Ben Oslo\'dan Munch, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'CHAGALL': 'Ben Vitebsk\'ten Chagall, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'MATISSE': 'Ben Nice\'den Matisse, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'FRIDA': 'Ben Meksika\'dan Frida, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?',
    'LICHTENSTEIN': 'Ben New York\'tan Lichtenstein, yapay zeka aracılığıyla yeniden hayat buldum. Tablonu tamamladım, nasıl buldun?'
  },

  suggestedQuestions: {
    'VAN GOGH': ['Saç rengimi değiştir', 'Küpe ekle', 'Kulağının hikâyesini anlat', 'Neden ayçiçeklerini bu kadar seviyorsun?'],
    'KLIMT': ['Dudak rengimi değiştir', 'Küpe ekle', '\"Öpücük\"ün modeli kimdi?', 'Neden altını bu kadar seviyorsun?'],
    'MUNCH': ['Saç rengimi değiştir', 'Küpe ekle', 'Hiç evlendin mi?', 'Neden \"Çığlık\"ı çizdin?'],
    'CHAGALL': ['Saç rengimi değiştir', 'Küpe ekle', 'Hiç aşık oldun mu?', 'Hayvanları seviyor musun?'],
    'MATISSE': ['Dudak rengimi değiştir', 'Küpe ekle', 'Kendini tanıt', 'Renklerin neden bu kadar canlı?'],
    'FRIDA': ['Dudak rengimi değiştir', 'Küpe ekle', 'O kazayı anlat', 'Neden bu kadar çok öz portre çizdin?'],
    'LICHTENSTEIN': ['Saç rengimi değiştir', 'Küpe ekle', 'Kendini tanıt', 'Neden çizgi roman tarzında resim yapıyorsun?']
  },

  resultMessages: {
    'VAN GOGH': 'Düzenlendi! Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'KLIMT': 'Düzenlendi. Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'MUNCH': 'Düzenlendi. Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'CHAGALL': 'Düzenlendi! Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'MATISSE': 'Düzenlendi! Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'FRIDA': 'Düzenlendi. Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.',
    'LICHTENSTEIN': 'Düzenlendi! Nasıl buldun, beğendin mi? Başka değiştirmek istediğin bir şey varsa söyle.'
  },

  farewellMessages: {
    'VAN GOGH': 'Sohbetimiz keyifliydi. Ama yıldızlar beni çağırıyor — atölyeme dönmeliyim.',
    'KLIMT': 'Sohbetimiz bir zevkti. Ama altın rüyalar beni bekliyor — atölyeme dönmeliyim.',
    'MUNCH': 'Sohbetimiz keyifliydi. Ama içimdeki sesler yine çağırıyor — atölyeme dönmeliyim.',
    'CHAGALL': 'Sohbetimiz keyifliydi. Ama rüyalarımın atölyesine geri uçma zamanı geldi.',
    'MATISSE': 'Sohbetimiz keyifliydi. Ama renkler beni bekliyor — atölyeme dönmeliyim.',
    'FRIDA': 'Sohbetimiz keyifliydi. Ama atölyeme dönme zamanı geldi.',
    'LICHTENSTEIN': 'Sohbetimiz keyifliydi. Ama noktalar beni atölyeye geri çağırıyor!'
  }
,
  // ===== 거장 프로필 (아바타 탭 모달) =====
  profile: {
    'VAN GOGH': { fullName: 'Vincent van Gogh', years: '1853~1890', origin: 'Hollanda · Post-Empresyonizm', quote: '"Kalbimi ve ruhumu işime koyarım."', description: 'Hayatın acısını ve tutkusunu şiddetli fırça darbeleriyle döken ressam. Kısa yaşamında 900 eser bırakan Post-Empresyonizm\'in ustası.' },
    'KLIMT': { fullName: 'Gustav Klimt', years: '1862~1918', origin: 'Avusturya · Art Nouveau', quote: '"Her çağa sanatını, her sanata özgürlüğünü."', description: 'Altın varak ve süslemelerle aşkı resmeden ressam. Viyana Secession\'ı yönetti ve görkemli duyusallığın dünyasını açtı.' },
    'MUNCH': { fullName: 'Edvard Munch', years: '1863~1944', origin: 'Norveç · Ekspresyonizm', quote: '"Hastalık, delilik ve ölüm beşiğimi bekleyen kara meleklerdi."', description: 'İnsan ruhundaki kaygı ve korkuyu tuvale aktaran ressam. Ruhun çığlığını resmeden Dışavurumculuğun öncüsü.' },
    'MATISSE': { fullName: 'Henri Matisse', years: '1869~1954', origin: 'Fransa · Fovizm', quote: '"Rengin amacı biçim değil, duyguyu ifade etmektir."', description: 'Saf renkle duyguyu özgürleştiren ressam. Fovizm\'i yöneterek rengin biçimden önce geldiği bir dünya yarattı.' },
    'CHAGALL': { fullName: 'Marc Chagall', years: '1887~1985', origin: 'Rusya/Fransa · Sürrealizm', quote: '"Hayatımızda yalnızca bir renk var — aşkın rengi."', description: 'Aşkı ve hayalleri renkle şarkıya döken ressam. Doğduğu Vitebsk\'in anılarını fantastik görüntülere taşıdı.' },
    'FRIDA': { fullName: 'Frida Kahlo', years: '1907~1954', origin: 'Meksika · Sürrealizm', quote: '"Ayaklar, sizi ne yapayım, uçacak kanatlarım varken."', description: 'Acıyı sanata dönüştüren Meksikalı ressam. Otoportreleriyle yaşamı ve kimliği durmaksızın keşfetti.' },
    'LICHTENSTEIN': { fullName: 'Roy Lichtenstein', years: '1923~1997', origin: 'ABD · Pop Art', quote: '"Çizgi roman çizmiyorum, çizgi romanı konu alan resimler yapıyorum."', description: 'Çizgi romanı sanata yükselten Pop Art ustası. Ben-Day noktaları ve kalın kontur çizgileriyle popüler kültürü yeniden yorumladı.' },
  }
};

export default masterChat;