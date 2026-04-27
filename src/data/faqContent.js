// faqContent.js - Frequently Asked Questions content
// Used by MenuScreen for inline FAQ display
// 8 questions covering core user concerns
// Last updated: 2026-04-27

export const faqContent = {
  ko: [
    {
      title: 'Q1. 변환이 실패했어요. 어떻게 하나요?',
      text: '같은 사진을 다시 시도해 주세요. 일부 사진은 화풍과 잘 맞지 않거나 안전 필터에 의해 처리되지 않을 수 있습니다. 다른 화풍이나 다른 사진으로 시도해 보시거나, 단독 변환에서는 결과 화면의 "다시 시도" 버튼을 눌러주세요. 같은 사진이 여러 번 실패한다면 인물이 명확하게 보이고 충분한 빛이 있는 사진을 사용해 보세요.'
    },
    {
      title: 'Q2. 환불 가능한가요?',
      text: '결제는 모두 Apple App Store 또는 Google Play를 통해 처리되며, 환불 정책은 각 스토어의 정책을 따릅니다. Apple: reportaproblem.apple.com, Google Play: play.google.com → 주문 내역에서 신청 가능합니다. 환불이 처리되면 잔여 크레딧은 자동으로 회수됩니다. 결제 후 즉시 변환을 사용한 경우 환불이 거절될 수 있습니다.'
    },
    {
      title: 'Q3. 결과물을 상업적으로 사용해도 되나요?',
      text: '아니요. 변환 결과물은 개인적, 비상업적 용도로만 사용할 수 있습니다. 소셜 미디어에 올리거나 친구와 공유하는 것은 가능하지만, 판매, 광고, 상품 제작 등 상업적 용도로는 사용할 수 없습니다. 자세한 내용은 메뉴 → 앱 정보 → 이용약관 9조와 10조를 참고하세요.'
    },
    {
      title: 'Q4. 내 사진은 안전한가요?',
      text: '귀하의 원본 사진은 Master Valley 서버에 저장되지 않습니다. 변환을 위해 AI 서비스(Replicate, Anthropic, Google, OpenAI)에 실시간으로 전송되며, 처리 완료 후 즉시 삭제됩니다. 안면 인식 데이터베이스 구축이나 AI 모델 학습에 사용되지 않습니다. 변환 결과물은 갤러리에 저장될 경우 기기 내부에만 보관됩니다.'
    },
    {
      title: 'Q5. 18세 미만도 사용할 수 있나요?',
      text: '아니요. Master Valley는 만 18세 이상만 사용할 수 있습니다. 또한 어떠한 경우에도 18세 미만의 사진을 업로드할 수 없습니다. 본인이 부모 또는 법정 대리인인 경우에도 마찬가지입니다.'
    },
    {
      title: 'Q6. 갤러리 사진은 어디에 저장되나요?',
      text: '갤러리에 저장된 변환 결과물은 귀하의 기기 내부 저장소(IndexedDB)에 보관됩니다. 클라우드에 백업되지 않으므로, 앱을 삭제하거나 기기 데이터를 초기화하면 사라질 수 있습니다. 중요한 결과물은 "다운로드" 버튼으로 기기 갤러리에 저장하는 것을 권장합니다.'
    },
    {
      title: 'Q7. 언어를 바꿀 수 있나요?',
      text: '네, 메뉴 → Language에서 11개 언어 중 선택할 수 있습니다. 한국어, 영어, 일본어, 스페인어, 프랑스어, 인도네시아어, 포르투갈어, 아랍어, 터키어, 태국어, 중국어 번체를 지원합니다.'
    },
    {
      title: 'Q8. 변환 결과가 마음에 들지 않아요.',
      text: 'AI 변환은 본질적으로 예측 불가능한 면이 있습니다. 같은 사진이라도 다른 화풍을 선택하면 전혀 다른 결과가 나옵니다. 또한 거장 카테고리에서는 결과 화면 하단의 거장 대화 영역에서 "재변환" 요청을 통해 결과를 수정할 수 있습니다(추가 크레딧 차감). 인물이 명확하게 보이고 빛이 충분한 사진일수록 좋은 결과가 나옵니다.'
    },
  ],

  en: [
    {
      title: 'Q1. The transformation failed. What should I do?',
      text: 'Please try the same photo again. Some photos may not match well with certain art styles or may be filtered by our safety system. Try a different style or different photo, or use the "Retry" button on the result screen for single transformations. If the same photo fails repeatedly, try a photo with a clearly visible subject and good lighting.'
    },
    {
      title: 'Q2. Can I get a refund?',
      text: 'All payments are processed through Apple App Store or Google Play, and refunds follow each store\'s policy. Apple: reportaproblem.apple.com. Google Play: play.google.com → Order history. When a refund is processed, remaining credits are automatically reclaimed. Refunds may be denied if you have already used the credits for transformations.'
    },
    {
      title: 'Q3. Can I use the results commercially?',
      text: 'No. Transformation results may only be used for personal, non-commercial purposes. You may post them on social media or share with friends, but you may not use them for selling, advertising, merchandise, or other commercial purposes. See Menu → About → Terms of Service, Sections 9 and 10 for details.'
    },
    {
      title: 'Q4. Are my photos safe?',
      text: 'Your original photos are not stored on Master Valley servers. They are transmitted to AI services (Replicate, Anthropic, Google, OpenAI) only for real-time transformation and deleted immediately after processing. They are not used to build facial recognition databases or to train AI models. Transformation results, if saved to the gallery, are stored only on your device.'
    },
    {
      title: 'Q5. Can people under 18 use Master Valley?',
      text: 'No. Master Valley is only available to users 18 years of age or older. You also may not upload photos of anyone under 18 under any circumstances, even if you are their parent or legal guardian.'
    },
    {
      title: 'Q6. Where are gallery photos stored?',
      text: 'Transformation results saved to the gallery are stored in your device\'s internal storage (IndexedDB). They are not backed up to the cloud, so they may be lost if you uninstall the app or reset your device. We recommend saving important results to your device gallery using the "Save" button.'
    },
    {
      title: 'Q7. Can I change the language?',
      text: 'Yes. Go to Menu → Language to choose from 11 languages: Korean, English, Japanese, Spanish, French, Indonesian, Portuguese, Arabic, Turkish, Thai, and Traditional Chinese.'
    },
    {
      title: 'Q8. I don\'t like the transformation result.',
      text: 'AI transformations are inherently unpredictable. The same photo will produce very different results depending on the chosen art style. In the Masters category, you can also request modifications through the master\'s dialogue at the bottom of the result screen (additional credits apply). Photos with clearly visible subjects and good lighting tend to produce better results.'
    },
  ],

  ja: [
    {
      title: 'Q1. 変換に失敗しました。どうすればいいですか?',
      text: '同じ写真でもう一度お試しください。一部の写真は特定の画風と相性が良くないか、安全フィルターによって処理されないことがあります。別の画風や別の写真をお試しいただくか、単独変換では結果画面の「再試行」ボタンを押してください。同じ写真が何度も失敗する場合は、人物がはっきり見え、十分な光量がある写真をご使用ください。'
    },
    {
      title: 'Q2. 返金は可能ですか?',
      text: '決済はすべてApple App StoreまたはGoogle Playを通じて処理され、返金ポリシーは各ストアのポリシーに従います。Apple: reportaproblem.apple.com、Google Play: play.google.com → 注文履歴から申請可能です。返金が処理されると、残りのクレジットは自動的に回収されます。決済直後に変換を使用した場合、返金が拒否される可能性があります。'
    },
    {
      title: 'Q3. 結果物を商用利用してもいいですか?',
      text: 'いいえ。変換結果物は個人的、非商業的な用途のみご使用いただけます。SNSへの投稿や友人との共有は可能ですが、販売、広告、商品制作などの商用利用はできません。詳細はメニュー → アプリ情報 → 利用規約の第9条および第10条をご参照ください。'
    },
    {
      title: 'Q4. 私の写真は安全ですか?',
      text: 'お客様の元の写真はMaster Valleyのサーバーに保存されません。変換のためにAIサービス(Replicate、Anthropic、Google、OpenAI)にリアルタイムで送信され、処理完了後に即時削除されます。顔認識データベースの構築やAIモデルの学習には使用されません。変換結果物はギャラリーに保存される場合、お使いのデバイス内にのみ保管されます。'
    },
    {
      title: 'Q5. 18歳未満でも使えますか?',
      text: 'いいえ。Master Valleyは18歳以上の方のみご利用いただけます。また、いかなる場合でも18歳未満の方の写真をアップロードすることはできません。ご本人が保護者または法定代理人である場合も同様です。'
    },
    {
      title: 'Q6. ギャラリーの写真はどこに保存されますか?',
      text: 'ギャラリーに保存された変換結果物は、お使いのデバイス内のストレージ(IndexedDB)に保管されます。クラウドにバックアップされないため、アプリを削除したり、デバイスのデータをリセットすると消える可能性があります。重要な結果物は「ダウンロード」ボタンでデバイスのギャラリーに保存することをお勧めします。'
    },
    {
      title: 'Q7. 言語を変更できますか?',
      text: 'はい、メニュー → Languageから11言語の中から選択できます。韓国語、英語、日本語、スペイン語、フランス語、インドネシア語、ポルトガル語、アラビア語、トルコ語、タイ語、繁体字中国語に対応しています。'
    },
    {
      title: 'Q8. 変換結果が気に入りません。',
      text: 'AI変換は本質的に予測不可能な面があります。同じ写真でも別の画風を選ぶとまったく異なる結果になります。また、巨匠カテゴリでは、結果画面下部の巨匠との対話エリアから「再変換」をリクエストして結果を修正できます(追加クレジットが消費されます)。人物がはっきり見え、光量が十分な写真ほど良い結果が得られます。'
    },
  ],

  es: [
    {
      title: 'Q1. La transformación falló. ¿Qué debo hacer?',
      text: 'Intenta con la misma foto nuevamente. Algunas fotos pueden no coincidir bien con ciertos estilos artísticos o ser filtradas por nuestro sistema de seguridad. Prueba un estilo diferente o una foto diferente, o usa el botón "Reintentar" en la pantalla de resultados para transformaciones individuales. Si la misma foto falla repetidamente, prueba una foto con un sujeto claramente visible y buena iluminación.'
    },
    {
      title: 'Q2. ¿Puedo obtener un reembolso?',
      text: 'Todos los pagos se procesan a través de Apple App Store o Google Play, y los reembolsos siguen la política de cada tienda. Apple: reportaproblem.apple.com. Google Play: play.google.com → Historial de pedidos. Cuando se procesa un reembolso, los créditos restantes se recuperan automáticamente. Los reembolsos pueden ser denegados si ya has usado los créditos para transformaciones.'
    },
    {
      title: 'Q3. ¿Puedo usar los resultados comercialmente?',
      text: 'No. Los resultados de las transformaciones solo pueden usarse con fines personales y no comerciales. Puedes publicarlos en redes sociales o compartirlos con amigos, pero no puedes usarlos para vender, publicidad, mercancía u otros fines comerciales. Consulta Menú → Acerca de → Términos del Servicio, secciones 9 y 10 para más detalles.'
    },
    {
      title: 'Q4. ¿Mis fotos están seguras?',
      text: 'Tus fotos originales no se almacenan en los servidores de Master Valley. Se transmiten a servicios de IA (Replicate, Anthropic, Google, OpenAI) solo para la transformación en tiempo real y se eliminan inmediatamente después del procesamiento. No se usan para construir bases de datos de reconocimiento facial ni para entrenar modelos de IA. Los resultados de las transformaciones, si se guardan en la galería, se almacenan solo en tu dispositivo.'
    },
    {
      title: 'Q5. ¿Pueden usarlo personas menores de 18 años?',
      text: 'No. Master Valley solo está disponible para usuarios de 18 años o más. Tampoco puedes subir fotos de menores de 18 años bajo ninguna circunstancia, incluso si eres su padre/madre o tutor legal.'
    },
    {
      title: 'Q6. ¿Dónde se almacenan las fotos de la galería?',
      text: 'Los resultados de las transformaciones guardados en la galería se almacenan en el almacenamiento interno de tu dispositivo (IndexedDB). No se respaldan en la nube, por lo que pueden perderse si desinstalas la aplicación o restableces tu dispositivo. Recomendamos guardar los resultados importantes en la galería de tu dispositivo usando el botón "Guardar".'
    },
    {
      title: 'Q7. ¿Puedo cambiar el idioma?',
      text: 'Sí. Ve a Menú → Language para elegir entre 11 idiomas: coreano, inglés, japonés, español, francés, indonesio, portugués, árabe, turco, tailandés y chino tradicional.'
    },
    {
      title: 'Q8. No me gusta el resultado de la transformación.',
      text: 'Las transformaciones de IA son inherentemente impredecibles. La misma foto producirá resultados muy diferentes según el estilo artístico elegido. En la categoría Maestros, también puedes solicitar modificaciones a través del diálogo con el maestro en la parte inferior de la pantalla de resultados (se aplican créditos adicionales). Las fotos con sujetos claramente visibles y buena iluminación tienden a producir mejores resultados.'
    },
  ],

  fr: [
    {
      title: 'Q1. La transformation a échoué. Que faire ?',
      text: 'Veuillez réessayer avec la même photo. Certaines photos peuvent ne pas bien correspondre à certains styles artistiques ou être filtrées par notre système de sécurité. Essayez un autre style ou une autre photo, ou utilisez le bouton « Réessayer » sur l\'écran des résultats pour les transformations individuelles. Si la même photo échoue à plusieurs reprises, essayez une photo avec un sujet clairement visible et un bon éclairage.'
    },
    {
      title: 'Q2. Puis-je obtenir un remboursement ?',
      text: 'Tous les paiements sont traités via Apple App Store ou Google Play, et les remboursements suivent la politique de chaque magasin. Apple : reportaproblem.apple.com. Google Play : play.google.com → Historique des commandes. Lorsqu\'un remboursement est traité, les crédits restants sont automatiquement récupérés. Les remboursements peuvent être refusés si vous avez déjà utilisé les crédits pour des transformations.'
    },
    {
      title: 'Q3. Puis-je utiliser les résultats à des fins commerciales ?',
      text: 'Non. Les résultats de transformation ne peuvent être utilisés qu\'à des fins personnelles et non commerciales. Vous pouvez les publier sur les réseaux sociaux ou les partager avec des amis, mais vous ne pouvez pas les utiliser pour la vente, la publicité, la marchandise ou d\'autres fins commerciales. Voir Menu → À propos → Conditions d\'utilisation, sections 9 et 10 pour plus de détails.'
    },
    {
      title: 'Q4. Mes photos sont-elles en sécurité ?',
      text: 'Vos photos originales ne sont pas stockées sur les serveurs de Master Valley. Elles sont transmises à des services d\'IA (Replicate, Anthropic, Google, OpenAI) uniquement pour la transformation en temps réel et supprimées immédiatement après le traitement. Elles ne sont pas utilisées pour construire des bases de données de reconnaissance faciale ni pour entraîner des modèles d\'IA. Les résultats de transformation, s\'ils sont enregistrés dans la galerie, sont stockés uniquement sur votre appareil.'
    },
    {
      title: 'Q5. Les personnes de moins de 18 ans peuvent-elles l\'utiliser ?',
      text: 'Non. Master Valley n\'est disponible que pour les utilisateurs de 18 ans ou plus. Vous ne pouvez pas non plus télécharger de photos de personnes de moins de 18 ans en aucune circonstance, même si vous êtes leur parent ou tuteur légal.'
    },
    {
      title: 'Q6. Où sont stockées les photos de la galerie ?',
      text: 'Les résultats de transformation enregistrés dans la galerie sont stockés dans le stockage interne de votre appareil (IndexedDB). Ils ne sont pas sauvegardés dans le cloud, ils peuvent donc être perdus si vous désinstallez l\'application ou réinitialisez votre appareil. Nous vous recommandons d\'enregistrer les résultats importants dans la galerie de votre appareil à l\'aide du bouton « Enregistrer ».'
    },
    {
      title: 'Q7. Puis-je changer la langue ?',
      text: 'Oui. Allez dans Menu → Language pour choisir parmi 11 langues : coréen, anglais, japonais, espagnol, français, indonésien, portugais, arabe, turc, thaï et chinois traditionnel.'
    },
    {
      title: 'Q8. Je n\'aime pas le résultat de la transformation.',
      text: 'Les transformations IA sont intrinsèquement imprévisibles. La même photo produira des résultats très différents selon le style artistique choisi. Dans la catégorie Maîtres, vous pouvez également demander des modifications via le dialogue du maître en bas de l\'écran des résultats (des crédits supplémentaires s\'appliquent). Les photos avec des sujets clairement visibles et un bon éclairage ont tendance à produire de meilleurs résultats.'
    },
  ],

  id: [
    {
      title: 'Q1. Transformasi gagal. Apa yang harus saya lakukan?',
      text: 'Silakan coba foto yang sama lagi. Beberapa foto mungkin tidak cocok dengan gaya seni tertentu atau disaring oleh sistem keamanan kami. Coba gaya lain atau foto lain, atau gunakan tombol "Coba Lagi" di layar hasil untuk transformasi tunggal. Jika foto yang sama gagal berulang kali, coba foto dengan subjek yang terlihat jelas dan pencahayaan yang baik.'
    },
    {
      title: 'Q2. Bisakah saya mendapatkan pengembalian dana?',
      text: 'Semua pembayaran diproses melalui Apple App Store atau Google Play, dan pengembalian dana mengikuti kebijakan masing-masing toko. Apple: reportaproblem.apple.com. Google Play: play.google.com → Riwayat pesanan. Saat pengembalian dana diproses, kredit yang tersisa secara otomatis ditarik kembali. Pengembalian dana dapat ditolak jika Anda telah menggunakan kredit untuk transformasi.'
    },
    {
      title: 'Q3. Bisakah saya menggunakan hasilnya secara komersial?',
      text: 'Tidak. Hasil transformasi hanya dapat digunakan untuk tujuan pribadi dan non-komersial. Anda dapat mempostingnya di media sosial atau membagikannya dengan teman, tetapi tidak dapat menggunakannya untuk menjual, mengiklankan, membuat barang dagangan, atau tujuan komersial lainnya. Lihat Menu → Tentang → Syarat Layanan, Bagian 9 dan 10 untuk detailnya.'
    },
    {
      title: 'Q4. Apakah foto saya aman?',
      text: 'Foto asli Anda tidak disimpan di server Master Valley. Foto tersebut dikirim ke layanan AI (Replicate, Anthropic, Google, OpenAI) hanya untuk transformasi secara real-time dan dihapus segera setelah pemrosesan. Foto tidak digunakan untuk membangun basis data pengenalan wajah atau untuk melatih model AI. Hasil transformasi, jika disimpan ke galeri, disimpan hanya di perangkat Anda.'
    },
    {
      title: 'Q5. Apakah pengguna di bawah 18 tahun dapat menggunakannya?',
      text: 'Tidak. Master Valley hanya tersedia untuk pengguna berusia 18 tahun ke atas. Anda juga tidak boleh mengunggah foto siapa pun yang berusia di bawah 18 tahun dalam keadaan apa pun, bahkan jika Anda adalah orang tua atau wali hukum mereka.'
    },
    {
      title: 'Q6. Di mana foto galeri disimpan?',
      text: 'Hasil transformasi yang disimpan di galeri disimpan di penyimpanan internal perangkat Anda (IndexedDB). Hasil tersebut tidak dicadangkan ke cloud, jadi dapat hilang jika Anda menghapus aplikasi atau mengatur ulang perangkat. Kami menyarankan untuk menyimpan hasil penting ke galeri perangkat Anda menggunakan tombol "Simpan".'
    },
    {
      title: 'Q7. Bisakah saya mengubah bahasa?',
      text: 'Ya. Buka Menu → Language untuk memilih dari 11 bahasa: Korea, Inggris, Jepang, Spanyol, Prancis, Indonesia, Portugis, Arab, Turki, Thailand, dan Tionghoa Tradisional.'
    },
    {
      title: 'Q8. Saya tidak suka hasil transformasinya.',
      text: 'Transformasi AI pada dasarnya tidak dapat diprediksi. Foto yang sama akan menghasilkan hasil yang sangat berbeda tergantung pada gaya seni yang dipilih. Dalam kategori Maestro, Anda juga dapat meminta modifikasi melalui dialog maestro di bagian bawah layar hasil (kredit tambahan berlaku). Foto dengan subjek yang terlihat jelas dan pencahayaan yang baik cenderung menghasilkan hasil yang lebih baik.'
    },
  ],

  pt: [
    {
      title: 'Q1. A transformação falhou. O que devo fazer?',
      text: 'Tente a mesma foto novamente. Algumas fotos podem não combinar bem com determinados estilos artísticos ou ser filtradas pelo nosso sistema de segurança. Tente um estilo diferente ou outra foto, ou use o botão "Tentar novamente" na tela de resultados para transformações individuais. Se a mesma foto falhar repetidamente, tente uma foto com sujeito claramente visível e boa iluminação.'
    },
    {
      title: 'Q2. Posso obter um reembolso?',
      text: 'Todos os pagamentos são processados pela Apple App Store ou Google Play, e os reembolsos seguem a política de cada loja. Apple: reportaproblem.apple.com. Google Play: play.google.com → Histórico de pedidos. Quando um reembolso é processado, os créditos restantes são recuperados automaticamente. Os reembolsos podem ser negados se você já tiver usado os créditos para transformações.'
    },
    {
      title: 'Q3. Posso usar os resultados comercialmente?',
      text: 'Não. Os resultados das transformações só podem ser usados para fins pessoais e não comerciais. Você pode publicá-los nas redes sociais ou compartilhá-los com amigos, mas não pode usá-los para venda, publicidade, mercadorias ou outros fins comerciais. Consulte Menu → Sobre → Termos de Serviço, seções 9 e 10 para mais detalhes.'
    },
    {
      title: 'Q4. Minhas fotos estão seguras?',
      text: 'Suas fotos originais não são armazenadas nos servidores do Master Valley. Elas são transmitidas a serviços de IA (Replicate, Anthropic, Google, OpenAI) apenas para a transformação em tempo real e excluídas imediatamente após o processamento. Não são usadas para construir bancos de dados de reconhecimento facial ou para treinar modelos de IA. Os resultados das transformações, se salvos na galeria, são armazenados apenas no seu dispositivo.'
    },
    {
      title: 'Q5. Pessoas menores de 18 anos podem usar?',
      text: 'Não. O Master Valley está disponível apenas para usuários com 18 anos ou mais. Você também não pode enviar fotos de menores de 18 anos sob nenhuma circunstância, mesmo sendo pai/mãe ou responsável legal.'
    },
    {
      title: 'Q6. Onde as fotos da galeria são armazenadas?',
      text: 'Os resultados das transformações salvos na galeria são armazenados no armazenamento interno do seu dispositivo (IndexedDB). Eles não são copiados para a nuvem, portanto podem ser perdidos se você desinstalar o aplicativo ou redefinir o dispositivo. Recomendamos salvar os resultados importantes na galeria do seu dispositivo usando o botão "Salvar".'
    },
    {
      title: 'Q7. Posso mudar o idioma?',
      text: 'Sim. Vá em Menu → Language para escolher entre 11 idiomas: coreano, inglês, japonês, espanhol, francês, indonésio, português, árabe, turco, tailandês e chinês tradicional.'
    },
    {
      title: 'Q8. Não gostei do resultado da transformação.',
      text: 'As transformações de IA são inerentemente imprevisíveis. A mesma foto produzirá resultados muito diferentes dependendo do estilo artístico escolhido. Na categoria Mestres, você também pode solicitar modificações através do diálogo com o mestre na parte inferior da tela de resultados (créditos adicionais se aplicam). Fotos com sujeitos claramente visíveis e boa iluminação tendem a produzir melhores resultados.'
    },
  ],

  ar: [
    {
      title: 'س1. فشلت عملية التحويل. ماذا أفعل؟',
      text: 'يرجى المحاولة مرة أخرى بنفس الصورة. قد لا تتطابق بعض الصور بشكل جيد مع أنماط فنية معينة أو قد يتم تصفيتها بواسطة نظام الأمان لدينا. جرب نمطًا مختلفًا أو صورة مختلفة، أو استخدم زر "إعادة المحاولة" في شاشة النتيجة للتحويلات الفردية. إذا فشلت نفس الصورة بشكل متكرر، فجرب صورة بها موضوع واضح وإضاءة جيدة.'
    },
    {
      title: 'س2. هل يمكنني الحصول على استرداد؟',
      text: 'تتم معالجة جميع المدفوعات من خلال Apple App Store أو Google Play، وتتبع المبالغ المستردة سياسة كل متجر. Apple: reportaproblem.apple.com. Google Play: play.google.com ← سجل الطلبات. عند معالجة الاسترداد، يتم استرداد الأرصدة المتبقية تلقائيًا. قد يتم رفض المبالغ المستردة إذا كنت قد استخدمت بالفعل الأرصدة لإجراء تحويلات.'
    },
    {
      title: 'س3. هل يمكنني استخدام النتائج تجاريًا؟',
      text: 'لا. يمكن استخدام نتائج التحويل فقط للأغراض الشخصية وغير التجارية. يمكنك نشرها على وسائل التواصل الاجتماعي أو مشاركتها مع الأصدقاء، ولكن لا يمكنك استخدامها للبيع أو الإعلان أو البضائع أو لأي أغراض تجارية أخرى. راجع القائمة ← حول ← شروط الخدمة، القسمين 9 و10 للحصول على التفاصيل.'
    },
    {
      title: 'س4. هل صوري آمنة؟',
      text: 'لا يتم تخزين صورك الأصلية على خوادم Master Valley. يتم نقلها إلى خدمات الذكاء الاصطناعي (Replicate وAnthropic وGoogle وOpenAI) فقط للتحويل في الوقت الفعلي وحذفها فور انتهاء المعالجة. لا تُستخدم لبناء قواعد بيانات التعرف على الوجوه أو لتدريب نماذج الذكاء الاصطناعي. يتم تخزين نتائج التحويل، إذا تم حفظها في المعرض، على جهازك فقط.'
    },
    {
      title: 'س5. هل يمكن للأشخاص دون سن 18 عامًا استخدامه؟',
      text: 'لا. يتوفر Master Valley فقط للمستخدمين الذين تبلغ أعمارهم 18 عامًا أو أكثر. لا يمكنك أيضًا تحميل صور لأي شخص دون سن 18 عامًا تحت أي ظرف من الظروف، حتى لو كنت والدًا أو ولي أمر شرعيًا له.'
    },
    {
      title: 'س6. أين يتم تخزين صور المعرض؟',
      text: 'يتم تخزين نتائج التحويل المحفوظة في المعرض في وحدة التخزين الداخلية لجهازك (IndexedDB). لا يتم نسخها احتياطيًا إلى السحابة، لذا قد تُفقد إذا قمت بإلغاء تثبيت التطبيق أو إعادة تعيين جهازك. نوصي بحفظ النتائج المهمة في معرض جهازك باستخدام زر "حفظ".'
    },
    {
      title: 'س7. هل يمكنني تغيير اللغة؟',
      text: 'نعم. انتقل إلى القائمة ← Language للاختيار من بين 11 لغة: الكورية والإنجليزية واليابانية والإسبانية والفرنسية والإندونيسية والبرتغالية والعربية والتركية والتايلاندية والصينية التقليدية.'
    },
    {
      title: 'س8. لم تعجبني نتيجة التحويل.',
      text: 'تحويلات الذكاء الاصطناعي غير قابلة للتنبؤ بطبيعتها. ستنتج الصورة نفسها نتائج مختلفة جدًا اعتمادًا على النمط الفني المختار. في فئة الأساتذة، يمكنك أيضًا طلب التعديلات من خلال حوار الأستاذ في أسفل شاشة النتيجة (تنطبق أرصدة إضافية). تميل الصور ذات الموضوعات الواضحة والإضاءة الجيدة إلى إعطاء نتائج أفضل.'
    },
  ],

  tr: [
    {
      title: 'S1. Dönüşüm başarısız oldu. Ne yapmalıyım?',
      text: 'Lütfen aynı fotoğrafı tekrar deneyin. Bazı fotoğraflar belirli sanat stilleriyle iyi eşleşmeyebilir veya güvenlik sistemimiz tarafından filtrelenebilir. Farklı bir stil veya farklı bir fotoğraf deneyin ya da tekli dönüşümler için sonuç ekranındaki "Tekrar Dene" düğmesini kullanın. Aynı fotoğraf tekrar tekrar başarısız olursa, açıkça görülebilir bir özne ve iyi aydınlatması olan bir fotoğraf deneyin.'
    },
    {
      title: 'S2. İade alabilir miyim?',
      text: 'Tüm ödemeler Apple App Store veya Google Play üzerinden işlenir ve iadeler her mağazanın politikasına uyar. Apple: reportaproblem.apple.com. Google Play: play.google.com → Sipariş geçmişi. Bir iade işleme alındığında, kalan krediler otomatik olarak geri alınır. Kredileri zaten dönüşümler için kullandıysanız iadeler reddedilebilir.'
    },
    {
      title: 'S3. Sonuçları ticari olarak kullanabilir miyim?',
      text: 'Hayır. Dönüşüm sonuçları yalnızca kişisel, ticari olmayan amaçlarla kullanılabilir. Bunları sosyal medyada paylaşabilir veya arkadaşlarınızla paylaşabilirsiniz, ancak satış, reklam, ürün veya diğer ticari amaçlar için kullanamazsınız. Ayrıntılar için Menü → Hakkında → Kullanım Koşulları, Bölüm 9 ve 10\'a bakın.'
    },
    {
      title: 'S4. Fotoğraflarım güvende mi?',
      text: 'Orijinal fotoğraflarınız Master Valley sunucularında saklanmaz. Yalnızca gerçek zamanlı dönüşüm için AI hizmetlerine (Replicate, Anthropic, Google, OpenAI) iletilir ve işlemden hemen sonra silinir. Yüz tanıma veritabanları oluşturmak veya AI modellerini eğitmek için kullanılmazlar. Galeriye kaydedilen dönüşüm sonuçları yalnızca cihazınızda saklanır.'
    },
    {
      title: 'S5. 18 yaşından küçükler kullanabilir mi?',
      text: 'Hayır. Master Valley yalnızca 18 yaş veya üstü kullanıcılar için kullanılabilir. Ayrıca, ebeveyn veya yasal vasi olsanız bile, hiçbir koşulda 18 yaşından küçük kişilerin fotoğraflarını yükleyemezsiniz.'
    },
    {
      title: 'S6. Galeri fotoğrafları nerede saklanıyor?',
      text: 'Galeriye kaydedilen dönüşüm sonuçları cihazınızın dahili depolamasında (IndexedDB) saklanır. Buluta yedeklenmezler, bu nedenle uygulamayı kaldırırsanız veya cihazınızı sıfırlarsanız kaybolabilirler. Önemli sonuçları "Kaydet" düğmesi ile cihaz galerinize kaydetmenizi öneririz.'
    },
    {
      title: 'S7. Dili değiştirebilir miyim?',
      text: 'Evet. 11 dilden seçim yapmak için Menü → Language\'a gidin: Korece, İngilizce, Japonca, İspanyolca, Fransızca, Endonezce, Portekizce, Arapça, Türkçe, Tayca ve Geleneksel Çince.'
    },
    {
      title: 'S8. Dönüşüm sonucunu beğenmedim.',
      text: 'AI dönüşümleri doğası gereği öngörülemezdir. Aynı fotoğraf, seçilen sanat stiline bağlı olarak çok farklı sonuçlar üretecektir. Ustalar kategorisinde, sonuç ekranının altındaki usta diyaloğu aracılığıyla değişiklikler de talep edebilirsiniz (ek krediler geçerlidir). Açıkça görülebilir özneler ve iyi aydınlatma içeren fotoğraflar daha iyi sonuçlar üretme eğilimindedir.'
    },
  ],

  th: [
    {
      title: 'Q1. การแปลงล้มเหลว ฉันควรทำอย่างไร?',
      text: 'โปรดลองรูปเดิมอีกครั้ง รูปบางรูปอาจไม่เข้ากันดีกับสไตล์ศิลปะบางอย่างหรืออาจถูกกรองโดยระบบความปลอดภัยของเรา ลองสไตล์อื่นหรือรูปอื่น หรือใช้ปุ่ม "ลองอีกครั้ง" บนหน้าจอผลลัพธ์สำหรับการแปลงเดี่ยว หากรูปเดิมล้มเหลวซ้ำๆ ลองใช้รูปที่มีตัวแบบมองเห็นได้ชัดเจนและมีแสงสว่างเพียงพอ'
    },
    {
      title: 'Q2. ฉันสามารถขอคืนเงินได้หรือไม่?',
      text: 'การชำระเงินทั้งหมดดำเนินการผ่าน Apple App Store หรือ Google Play และการคืนเงินเป็นไปตามนโยบายของแต่ละสโตร์ Apple: reportaproblem.apple.com Google Play: play.google.com → ประวัติการสั่งซื้อ เมื่อมีการคืนเงิน เครดิตที่เหลือจะถูกเรียกคืนโดยอัตโนมัติ การคืนเงินอาจถูกปฏิเสธหากคุณใช้เครดิตสำหรับการแปลงไปแล้ว'
    },
    {
      title: 'Q3. ฉันสามารถใช้ผลลัพธ์ในเชิงพาณิชย์ได้หรือไม่?',
      text: 'ไม่ได้ ผลลัพธ์การแปลงสามารถใช้ได้เพื่อวัตถุประสงค์ส่วนตัวที่ไม่ใช่เชิงพาณิชย์เท่านั้น คุณสามารถโพสต์บนโซเชียลมีเดียหรือแบ่งปันกับเพื่อนๆ ได้ แต่ไม่สามารถใช้เพื่อการขาย การโฆษณา สินค้า หรือวัตถุประสงค์เชิงพาณิชย์อื่นๆ ดูรายละเอียดได้ที่ เมนู → เกี่ยวกับ → ข้อกำหนดการใช้บริการ ข้อ 9 และ 10'
    },
    {
      title: 'Q4. รูปภาพของฉันปลอดภัยหรือไม่?',
      text: 'รูปต้นฉบับของคุณไม่ได้ถูกจัดเก็บไว้บนเซิร์ฟเวอร์ Master Valley รูปเหล่านี้จะถูกส่งไปยังบริการ AI (Replicate, Anthropic, Google, OpenAI) เพื่อการแปลงแบบเรียลไทม์เท่านั้น และจะถูกลบทันทีหลังจากประมวลผล รูปเหล่านี้ไม่ได้ถูกใช้เพื่อสร้างฐานข้อมูลการจดจำใบหน้าหรือเพื่อฝึกโมเดล AI ผลลัพธ์การแปลงที่บันทึกไว้ในแกลเลอรีจะถูกเก็บไว้บนอุปกรณ์ของคุณเท่านั้น'
    },
    {
      title: 'Q5. ผู้ที่มีอายุต่ำกว่า 18 ปีสามารถใช้ได้หรือไม่?',
      text: 'ไม่ได้ Master Valley ใช้ได้เฉพาะผู้ใช้ที่มีอายุ 18 ปีขึ้นไป คุณยังไม่สามารถอัปโหลดรูปของผู้ที่มีอายุต่ำกว่า 18 ปีได้ภายใต้สถานการณ์ใดๆ แม้ว่าคุณจะเป็นพ่อแม่หรือผู้ปกครองตามกฎหมายก็ตาม'
    },
    {
      title: 'Q6. รูปภาพในแกลเลอรีถูกเก็บไว้ที่ไหน?',
      text: 'ผลลัพธ์การแปลงที่บันทึกไว้ในแกลเลอรีจะถูกเก็บไว้ในที่เก็บข้อมูลภายในของอุปกรณ์ของคุณ (IndexedDB) ไม่ได้ถูกสำรองไปยังคลาวด์ ดังนั้นอาจสูญหายได้หากคุณถอนการติดตั้งแอปหรือรีเซ็ตอุปกรณ์ เราขอแนะนำให้บันทึกผลลัพธ์ที่สำคัญไปยังแกลเลอรีของอุปกรณ์โดยใช้ปุ่ม "บันทึก"'
    },
    {
      title: 'Q7. ฉันสามารถเปลี่ยนภาษาได้หรือไม่?',
      text: 'ได้ ไปที่ เมนู → Language เพื่อเลือกจาก 11 ภาษา: เกาหลี อังกฤษ ญี่ปุ่น สเปน ฝรั่งเศส อินโดนีเซีย โปรตุเกส อาหรับ ตุรกี ไทย และจีนตัวเต็ม'
    },
    {
      title: 'Q8. ฉันไม่ชอบผลการแปลง',
      text: 'การแปลงด้วย AI นั้นไม่สามารถคาดเดาได้โดยธรรมชาติ รูปเดียวกันจะให้ผลลัพธ์ที่แตกต่างกันมากขึ้นอยู่กับสไตล์ศิลปะที่เลือก ในหมวด Masters คุณยังสามารถขอแก้ไขผ่านบทสนทนากับมาสเตอร์ที่ด้านล่างของหน้าจอผลลัพธ์ได้ (เครดิตเพิ่มเติมจะถูกหัก) รูปที่มีตัวแบบมองเห็นได้ชัดเจนและมีแสงสว่างเพียงพอมักจะให้ผลลัพธ์ที่ดีกว่า'
    },
  ],

  'zh-TW': [
    {
      title: 'Q1. 轉換失敗了。我該怎麼辦？',
      text: '請再試一次相同的照片。某些照片可能與特定藝術風格不太匹配，或被我們的安全系統過濾。請嘗試不同的風格或不同的照片，或在單獨轉換的結果畫面中使用「重試」按鈕。如果同一張照片反覆失敗，請嘗試使用主體清晰可見且光線良好的照片。'
    },
    {
      title: 'Q2. 我可以申請退款嗎？',
      text: '所有付款均通過 Apple App Store 或 Google Play 處理，退款遵循各商店的政策。Apple：reportaproblem.apple.com。Google Play：play.google.com → 訂單記錄。處理退款時，剩餘的點數將自動收回。如果您已經將點數用於轉換，退款可能會被拒絕。'
    },
    {
      title: 'Q3. 我可以將結果用於商業用途嗎？',
      text: '不可以。轉換結果僅可用於個人非商業用途。您可以將其發佈到社交媒體或與朋友分享，但不能用於銷售、廣告、商品或其他商業目的。詳情請見 選單 → 關於 → 服務條款，第 9 和 10 節。'
    },
    {
      title: 'Q4. 我的照片安全嗎？',
      text: '您的原始照片不會儲存在 Master Valley 伺服器上。它們僅為了即時轉換而傳送至 AI 服務（Replicate、Anthropic、Google、OpenAI），並在處理完成後立即刪除。它們不會用於建立人臉識別資料庫或訓練 AI 模型。儲存到圖庫的轉換結果僅儲存在您的裝置上。'
    },
    {
      title: 'Q5. 未滿 18 歲的人可以使用嗎？',
      text: '不可以。Master Valley 僅適用於 18 歲以上的使用者。在任何情況下，您也不能上傳未滿 18 歲者的照片，即使您是其父母或法定監護人。'
    },
    {
      title: 'Q6. 圖庫照片儲存在哪裡？',
      text: '儲存到圖庫的轉換結果儲存在您裝置的內部儲存空間 (IndexedDB) 中。它們不會備份到雲端，因此如果您解除安裝應用程式或重設裝置，可能會遺失。我們建議使用「儲存」按鈕將重要結果儲存到您的裝置圖庫。'
    },
    {
      title: 'Q7. 我可以更改語言嗎？',
      text: '可以。前往 選單 → Language 從 11 種語言中選擇：韓語、英語、日語、西班牙語、法語、印尼語、葡萄牙語、阿拉伯語、土耳其語、泰語和繁體中文。'
    },
    {
      title: 'Q8. 我不喜歡轉換結果。',
      text: 'AI 轉換本質上是不可預測的。同一張照片會根據所選的藝術風格產生截然不同的結果。在大師類別中，您還可以通過結果畫面底部的大師對話請求修改（將收取額外點數）。主體清晰可見且光線良好的照片往往會產生更好的結果。'
    },
  ],
};
