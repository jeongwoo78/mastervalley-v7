// faqContent.js - Frequently Asked Questions content
// Used by MenuScreen for inline FAQ display
// 8 questions covering core user concerns
// Last updated: 2026-04-27 (Korean reviewed, other languages translated from Korean)

export const faqContent = {
  ko: [
    {
      title: 'Q1. 변환이 실패했어요. 어떻게 하나요?',
      text: '변환 실패는 일시적인 네트워크 문제, 서버 응답 지연, 또는 안전 정책에 의한 것일 수 있습니다.\n\n먼저 결과 화면의 "다시 시도" 버튼을 눌러보세요. 추가 차감 없이 다시 변환됩니다. 일시적 문제라면 두세 번의 시도로 해결되는 경우가 많습니다.\n\n문제가 지속되면 메뉴 → 문의하기로 연락 주세요.'
    },
    {
      title: 'Q2. 환불 가능한가요?',
      text: '결제는 Apple App Store 또는 Google Play를 통해 처리되며, 환불 신청과 승인 여부는 각 스토어가 결정합니다.\n\n신청 방법:\n- Apple: reportaproblem.apple.com\n- Google: Google Play 앱 → 결제 및 정기 결제 → 예산 및 주문 내역\n\n환불이 승인되면 해당 결제로 충전된 크레딧 전액이 회수됩니다. 이미 변환에 사용한 크레딧을 포함하므로, 환불 후 잔액이 부족해질 수 있습니다.\n\n환불 자체는 별도 신청이 필요 없으며, 스토어에서 승인되는 즉시 앱에 자동 반영됩니다.'
    },
    {
      title: 'Q3. 결과물을 상업적으로 사용해도 되나요?',
      text: '본 앱의 변환 결과물은 개인적, 비상업적 용도로만 사용할 수 있습니다. 본인의 소셜 미디어 게시, 친구와의 공유, 개인 소장은 자유롭게 가능합니다.\n\n판매, 광고, 굿즈 제작, 유료 콘텐츠 등 상업적 용도로 결과물을 사용하는 것은 불가합니다.\n\n자세한 내용은 메뉴 → 앱 정보 → 이용약관 9조와 10조를 참고하세요.'
    },
    {
      title: 'Q4. 내 사진은 안전한가요?',
      text: '원본 사진은 Master Valley 서버에 저장되지 않습니다. 변환 처리를 위해 AI 서비스(Replicate, Anthropic, Google, OpenAI)로 암호화된 통신으로 전송되며, 처리가 끝난 직후 삭제됩니다.\n\n각 AI 서비스는 사진을 자사 모델 학습에 사용하지 않는 정책을 따릅니다. 안면 인식이나 생체 정보 추출도 이루어지지 않습니다.\n\n변환 결과 이미지는 Master Valley 서버에 임시 저장되었다가 7일 후 자동 삭제됩니다. 갤러리에 저장한 결과는 귀하의 기기 내부에만 보관되며, 다른 사용자나 외부에서 접근할 수 없습니다.\n\n자세한 내용은 메뉴 → 앱 정보 → 이용약관 5조와 8조를 참고하세요.'
    },
    {
      title: 'Q5. 18세 미만도 사용할 수 있나요?',
      text: 'Master Valley는 만 18세 이상만 사용할 수 있습니다.\n\n본 앱은 미술사의 명화 구도를 사용하여 사진을 변환하며, 일부 화풍(고전 조각, 르네상스 등)에는 예술적 표현이 포함될 수 있어 성인 사용자를 대상으로 합니다.\n\n또한 어떠한 경우에도 18세 미만의 사진을 업로드할 수 없습니다. 본인이 보호자라고 하더라도 자녀나 다른 미성년자의 사진은 업로드할 수 없습니다.\n\n자세한 내용은 메뉴 → 앱 정보 → 이용약관 3조와 8조를 참고하세요.'
    },
    {
      title: 'Q6. 갤러리 사진은 어디에 저장되나요?',
      text: '갤러리(메뉴 → 갤러리)에 저장된 변환 결과물은 귀하의 기기 내부 저장소에 보관됩니다. 외부 클라우드에 백업되지 않으므로, 앱을 삭제하거나 기기 데이터를 초기화하면 사라집니다.\n\n중요한 결과물은 결과 화면의 "저장" 버튼으로 기기의 사진 앱에 별도로 저장하시기를 권장합니다. 사진 앱에 저장된 결과물은 앱과 무관하게 보관됩니다.'
    },
    {
      title: 'Q7. 언어를 바꿀 수 있나요?',
      text: '네, 메뉴 → 언어에서 11개 언어 중 선택할 수 있습니다.\n\n지원 언어: 한국어, 영어, 일본어, 스페인어, 프랑스어, 인도네시아어, 포르투갈어, 아랍어, 터키어, 태국어, 중국어 번체.\n\n언어 변경은 즉시 반영되며, 다음에 앱을 사용할 때도 선택한 언어로 표시됩니다.'
    },
    {
      title: 'Q8. 변환 결과가 마음에 들지 않아요.',
      text: '같은 사진이라도 화풍에 따라 매우 다른 결과가 나옵니다. 다른 화풍을 시도해 보시거나, 같은 화풍으로 다시 변환해 보세요. AI는 매번 다르게 해석하므로 결과 또한 달라집니다.\n\n거장(Masters) 카테고리에서는 결과 화면 하단에서 거장과 직접 대화하며 결과를 수정할 수 있습니다. "옷 색을 바꿔줘", "배경을 더 밝게" 같은 요청을 자연스럽게 보내시면 됩니다(추가 크레딧이 차감됩니다).\n\n사조(Movements)와 동양화(Oriental) 카테고리는 새로 변환하여 다른 결과를 얻으실 수 있습니다.'
    },
  ],

  en: [
    {
      title: 'Q1. The transformation failed. What should I do?',
      text: 'Transformation failures may occur due to temporary network issues, server response delays, or our safety policies.\n\nFirst, tap the "Retry" button on the result screen. Retrying does not deduct additional credits. Temporary issues are often resolved within two or three retries.\n\nIf the issue persists, please contact us via Menu → Contact Us.'
    },
    {
      title: 'Q2. Can I get a refund?',
      text: 'All payments are processed through Apple App Store or Google Play, and refund requests and approvals are determined by each store.\n\nHow to request:\n- Apple: reportaproblem.apple.com\n- Google: Google Play app → Payments & subscriptions → Budget and order history\n\nIf a refund is approved, the full credits added by that payment are reclaimed. Since this includes credits already used for transformations, your balance may become insufficient after the refund.\n\nNo separate request is needed in the app — the refund is automatically reflected as soon as the store approves it.'
    },
    {
      title: 'Q3. Can I use the results commercially?',
      text: 'Transformation results from this app may only be used for personal, non-commercial purposes. Posting on your own social media, sharing with friends, and personal keeping are all freely allowed.\n\nUsing the results for commercial purposes such as sales, advertising, merchandise production, or paid content is not permitted.\n\nFor details, see Menu → About → Terms of Service, Sections 9 and 10.'
    },
    {
      title: 'Q4. Are my photos safe?',
      text: 'Your original photos are not stored on Master Valley servers. They are transmitted via encrypted communication to AI services (Replicate, Anthropic, Google, OpenAI) for transformation processing, and deleted immediately after processing is complete.\n\nEach AI service follows a policy of not using photos to train their own models. No facial recognition or biometric information extraction is performed.\n\nTransformation result images are temporarily stored on Master Valley servers and automatically deleted after 7 days. Results saved to your gallery are stored only on your device and cannot be accessed by other users or from outside.\n\nFor details, see Menu → About → Terms of Service, Sections 5 and 8.'
    },
    {
      title: 'Q5. Can people under 18 use Master Valley?',
      text: 'Master Valley is only available to users 18 years of age or older.\n\nThis app transforms photos using the compositions of art history masterpieces. Some styles (such as classical sculpture and Renaissance) may include artistic expression, which is why the app is intended for adult users.\n\nIn addition, photos of anyone under 18 may not be uploaded under any circumstances. This applies even if you are their guardian — you may not upload photos of your children or other minors.\n\nFor details, see Menu → About → Terms of Service, Sections 3 and 8.'
    },
    {
      title: 'Q6. Where are gallery photos stored?',
      text: 'Transformation results saved in the gallery (Menu → Gallery) are stored in your device\'s internal storage. They are not backed up to external cloud, so they will disappear if you uninstall the app or reset your device data.\n\nFor important results, we recommend saving them separately to your device\'s photo app using the "Save" button on the result screen. Results saved in the photo app are kept independently of this app.'
    },
    {
      title: 'Q7. Can I change the language?',
      text: 'Yes, you can choose from 11 languages via Menu → Language.\n\nSupported languages: Korean, English, Japanese, Spanish, French, Indonesian, Portuguese, Arabic, Turkish, Thai, and Traditional Chinese.\n\nLanguage changes take effect immediately, and the selected language will be displayed the next time you use the app.'
    },
    {
      title: 'Q8. I don\'t like the transformation result.',
      text: 'The same photo can produce very different results depending on the art style. Try a different style, or transform with the same style again. AI interprets differently each time, so results also vary.\n\nIn the Masters category, you can modify the result by talking directly with the master at the bottom of the result screen. Send natural requests like "change the clothing color" or "make the background brighter" (additional credits will be deducted).\n\nFor the Movements and Oriental categories, you can perform a new transformation to get different results.'
    },
  ],

  ja: [
    {
      title: 'Q1. 変換に失敗しました。どうすればいいですか?',
      text: '変換の失敗は、一時的なネットワークの問題、サーバー応答の遅延、または安全ポリシーによるものである可能性があります。\n\nまず、結果画面の「再試行」ボタンを押してください。追加の課金なしに再変換されます。一時的な問題であれば、2〜3回の試行で解決することが多いです。\n\n問題が続く場合は、メニュー → お問い合わせからご連絡ください。'
    },
    {
      title: 'Q2. 返金は可能ですか?',
      text: '決済はすべてApple App StoreまたはGoogle Playを通じて処理され、返金申請と承認の可否は各ストアが決定します。\n\n申請方法:\n- Apple: reportaproblem.apple.com\n- Google: Google Playアプリ → お支払いと定期購入 → 予算と注文履歴\n\n返金が承認されると、当該決済でチャージされたクレジット全額が回収されます。すでに変換に使用したクレジットも含まれるため、返金後に残高が不足する場合があります。\n\n返金自体はアプリ内での別途申請は不要で、ストアで承認され次第、自動的に反映されます。'
    },
    {
      title: 'Q3. 結果物を商用利用してもいいですか?',
      text: '本アプリの変換結果物は、個人的、非商業的な用途でのみ使用できます。ご自身のSNSへの投稿、友人との共有、個人的な保管は自由に行えます。\n\n販売、広告、グッズ制作、有料コンテンツなど、商用目的で結果物を使用することはできません。\n\n詳細はメニュー → アプリ情報 → 利用規約の第9条および第10条をご参照ください。'
    },
    {
      title: 'Q4. 私の写真は安全ですか?',
      text: '元の写真はMaster Valleyのサーバーに保存されません。変換処理のためにAIサービス(Replicate、Anthropic、Google、OpenAI)へ暗号化された通信で送信され、処理完了後に直ちに削除されます。\n\n各AIサービスは、写真を自社モデルの学習に使用しないポリシーに従っています。顔認識や生体情報の抽出も行われません。\n\n変換結果の画像はMaster Valleyのサーバーに一時的に保存され、7日後に自動削除されます。ギャラリーに保存された結果はお使いのデバイス内にのみ保管され、他のユーザーや外部からアクセスすることはできません。\n\n詳細はメニュー → アプリ情報 → 利用規約の第5条および第8条をご参照ください。'
    },
    {
      title: 'Q5. 18歳未満でも使えますか?',
      text: 'Master Valleyは18歳以上の方のみご利用いただけます。\n\n本アプリは美術史の名画の構図を使用して写真を変換するため、一部の画風(古典彫刻、ルネサンスなど)には芸術的表現が含まれる可能性があり、成人ユーザーを対象としています。\n\nまた、いかなる場合でも18歳未満の写真をアップロードすることはできません。ご本人が保護者であっても、お子様や他の未成年者の写真をアップロードすることはできません。\n\n詳細はメニュー → アプリ情報 → 利用規約の第3条および第8条をご参照ください。'
    },
    {
      title: 'Q6. ギャラリーの写真はどこに保存されますか?',
      text: 'ギャラリー(メニュー → ギャラリー)に保存された変換結果物は、お使いのデバイス内のストレージに保管されます。外部クラウドにはバックアップされないため、アプリを削除したりデバイスのデータをリセットすると消えてしまいます。\n\n重要な結果物は、結果画面の「保存」ボタンでデバイスの写真アプリに別途保存することをお勧めします。写真アプリに保存された結果物は、本アプリとは無関係に保管されます。'
    },
    {
      title: 'Q7. 言語を変更できますか?',
      text: 'はい、メニュー → 言語から11言語の中から選択できます。\n\n対応言語: 韓国語、英語、日本語、スペイン語、フランス語、インドネシア語、ポルトガル語、アラビア語、トルコ語、タイ語、繁体字中国語。\n\n言語の変更は即座に反映され、次にアプリを使用する際にも選択した言語で表示されます。'
    },
    {
      title: 'Q8. 変換結果が気に入りません。',
      text: '同じ写真でも、画風によって非常に異なる結果が生まれます。別の画風を試してみるか、同じ画風で再度変換してみてください。AIは毎回異なる解釈をするため、結果も変わります。\n\n巨匠(Masters)カテゴリでは、結果画面下部で巨匠と直接対話しながら結果を修正できます。「服の色を変えて」「背景をもっと明るく」のような要望を自然に送ってください(追加のクレジットが消費されます)。\n\n美術史(Movements)と東洋画(Oriental)カテゴリは、新たに変換することで異なる結果を得られます。'
    },
  ],

  es: [
    {
      title: 'Q1. La transformación falló. ¿Qué debo hacer?',
      text: 'Las fallas en la transformación pueden ocurrir por problemas temporales de red, retrasos en la respuesta del servidor o por nuestras políticas de seguridad.\n\nPrimero, presiona el botón "Reintentar" en la pantalla de resultados. Reintentar no descuenta créditos adicionales. Los problemas temporales suelen resolverse en dos o tres intentos.\n\nSi el problema persiste, contáctanos a través de Menú → Contáctanos.'
    },
    {
      title: 'Q2. ¿Puedo obtener un reembolso?',
      text: 'Todos los pagos se procesan a través de Apple App Store o Google Play, y las solicitudes y aprobaciones de reembolso son determinadas por cada tienda.\n\nCómo solicitar:\n- Apple: reportaproblem.apple.com\n- Google: aplicación Google Play → Pagos y suscripciones → Presupuesto e historial de pedidos\n\nSi se aprueba un reembolso, se recuperan todos los créditos añadidos por ese pago. Como esto incluye los créditos ya usados en transformaciones, tu saldo puede quedar insuficiente después del reembolso.\n\nNo se necesita ninguna solicitud aparte en la aplicación: el reembolso se refleja automáticamente en cuanto la tienda lo aprueba.'
    },
    {
      title: 'Q3. ¿Puedo usar los resultados comercialmente?',
      text: 'Los resultados de transformación de esta aplicación solo pueden usarse con fines personales y no comerciales. Publicar en tus propias redes sociales, compartir con amigos y guardar de forma personal están permitidos libremente.\n\nNo está permitido usar los resultados con fines comerciales como ventas, publicidad, producción de mercancía o contenido de pago.\n\nPara más detalles, consulta Menú → Acerca de → Términos del Servicio, secciones 9 y 10.'
    },
    {
      title: 'Q4. ¿Mis fotos están seguras?',
      text: 'Tus fotos originales no se almacenan en los servidores de Master Valley. Se transmiten mediante comunicación cifrada a servicios de IA (Replicate, Anthropic, Google, OpenAI) para el procesamiento de la transformación y se eliminan inmediatamente después de completarse el procesamiento.\n\nCada servicio de IA sigue una política de no usar las fotos para entrenar sus propios modelos. Tampoco se realiza reconocimiento facial ni extracción de información biométrica.\n\nLas imágenes resultantes de la transformación se almacenan temporalmente en los servidores de Master Valley y se eliminan automáticamente después de 7 días. Los resultados guardados en tu galería se almacenan solo en tu dispositivo y no pueden ser accedidos por otros usuarios ni desde el exterior.\n\nPara más detalles, consulta Menú → Acerca de → Términos del Servicio, secciones 5 y 8.'
    },
    {
      title: 'Q5. ¿Pueden usarlo personas menores de 18 años?',
      text: 'Master Valley solo está disponible para usuarios de 18 años o más.\n\nEsta aplicación transforma fotos usando las composiciones de obras maestras de la historia del arte. Algunos estilos (como la escultura clásica y el Renacimiento) pueden incluir expresión artística, por lo que la aplicación está destinada a usuarios adultos.\n\nAdemás, no se pueden subir fotos de menores de 18 años bajo ninguna circunstancia. Esto se aplica incluso si eres su tutor: no puedes subir fotos de tus hijos ni de otros menores.\n\nPara más detalles, consulta Menú → Acerca de → Términos del Servicio, secciones 3 y 8.'
    },
    {
      title: 'Q6. ¿Dónde se almacenan las fotos de la galería?',
      text: 'Los resultados de transformación guardados en la galería (Menú → Galería) se almacenan en el almacenamiento interno de tu dispositivo. No se respaldan en la nube externa, por lo que desaparecerán si desinstalas la aplicación o restableces los datos de tu dispositivo.\n\nPara los resultados importantes, recomendamos guardarlos por separado en la aplicación de fotos de tu dispositivo usando el botón "Guardar" en la pantalla de resultados. Los resultados guardados en la aplicación de fotos se conservan independientemente de esta aplicación.'
    },
    {
      title: 'Q7. ¿Puedo cambiar el idioma?',
      text: 'Sí, puedes elegir entre 11 idiomas a través de Menú → Idioma.\n\nIdiomas compatibles: coreano, inglés, japonés, español, francés, indonesio, portugués, árabe, turco, tailandés y chino tradicional.\n\nLos cambios de idioma se aplican inmediatamente, y el idioma seleccionado se mostrará la próxima vez que uses la aplicación.'
    },
    {
      title: 'Q8. No me gusta el resultado de la transformación.',
      text: 'La misma foto puede producir resultados muy diferentes según el estilo artístico. Prueba un estilo diferente o transforma con el mismo estilo nuevamente. La IA interpreta de manera diferente cada vez, por lo que los resultados también varían.\n\nEn la categoría Maestros, puedes modificar el resultado conversando directamente con el maestro en la parte inferior de la pantalla de resultados. Envía solicitudes naturales como "cambia el color de la ropa" o "haz el fondo más brillante" (se descontarán créditos adicionales).\n\nPara las categorías Movimientos y Oriental, puedes realizar una nueva transformación para obtener resultados diferentes.'
    },
  ],

  fr: [
    {
      title: 'Q1. La transformation a échoué. Que faire ?',
      text: 'Les échecs de transformation peuvent être dus à des problèmes de réseau temporaires, à des délais de réponse du serveur ou à nos politiques de sécurité.\n\nTout d\'abord, appuyez sur le bouton « Réessayer » sur l\'écran des résultats. Réessayer ne déduit pas de crédits supplémentaires. Les problèmes temporaires se résolvent souvent en deux ou trois tentatives.\n\nSi le problème persiste, veuillez nous contacter via Menu → Nous contacter.'
    },
    {
      title: 'Q2. Puis-je obtenir un remboursement ?',
      text: 'Tous les paiements sont traités via Apple App Store ou Google Play, et les demandes et approbations de remboursement sont déterminées par chaque magasin.\n\nComment demander :\n- Apple : reportaproblem.apple.com\n- Google : application Google Play → Paiements et abonnements → Budget et historique des commandes\n\nSi un remboursement est approuvé, tous les crédits ajoutés par ce paiement sont récupérés. Comme cela inclut les crédits déjà utilisés pour les transformations, votre solde peut devenir insuffisant après le remboursement.\n\nAucune demande séparée n\'est nécessaire dans l\'application — le remboursement est automatiquement répercuté dès que le magasin l\'approuve.'
    },
    {
      title: 'Q3. Puis-je utiliser les résultats à des fins commerciales ?',
      text: 'Les résultats de transformation de cette application ne peuvent être utilisés qu\'à des fins personnelles et non commerciales. Publier sur vos propres réseaux sociaux, partager avec des amis et conserver à titre personnel sont librement autorisés.\n\nIl n\'est pas permis d\'utiliser les résultats à des fins commerciales telles que la vente, la publicité, la production de marchandises ou le contenu payant.\n\nPour plus de détails, consultez Menu → À propos → Conditions d\'utilisation, sections 9 et 10.'
    },
    {
      title: 'Q4. Mes photos sont-elles en sécurité ?',
      text: 'Vos photos originales ne sont pas stockées sur les serveurs de Master Valley. Elles sont transmises via une communication chiffrée à des services d\'IA (Replicate, Anthropic, Google, OpenAI) pour le traitement de transformation, et supprimées immédiatement après la fin du traitement.\n\nChaque service d\'IA suit une politique de non-utilisation des photos pour entraîner ses propres modèles. Aucune reconnaissance faciale ni extraction d\'informations biométriques n\'est effectuée.\n\nLes images résultant de la transformation sont temporairement stockées sur les serveurs de Master Valley et automatiquement supprimées après 7 jours. Les résultats enregistrés dans votre galerie sont stockés uniquement sur votre appareil et ne peuvent pas être consultés par d\'autres utilisateurs ni de l\'extérieur.\n\nPour plus de détails, consultez Menu → À propos → Conditions d\'utilisation, sections 5 et 8.'
    },
    {
      title: 'Q5. Les personnes de moins de 18 ans peuvent-elles l\'utiliser ?',
      text: 'Master Valley n\'est disponible que pour les utilisateurs de 18 ans ou plus.\n\nCette application transforme les photos en utilisant les compositions de chefs-d\'œuvre de l\'histoire de l\'art. Certains styles (comme la sculpture classique et la Renaissance) peuvent inclure une expression artistique, c\'est pourquoi l\'application est destinée aux utilisateurs adultes.\n\nDe plus, les photos de personnes de moins de 18 ans ne peuvent être téléchargées en aucune circonstance. Ceci s\'applique même si vous êtes leur tuteur — vous ne pouvez pas télécharger de photos de vos enfants ou d\'autres mineurs.\n\nPour plus de détails, consultez Menu → À propos → Conditions d\'utilisation, sections 3 et 8.'
    },
    {
      title: 'Q6. Où sont stockées les photos de la galerie ?',
      text: 'Les résultats de transformation enregistrés dans la galerie (Menu → Galerie) sont stockés dans le stockage interne de votre appareil. Ils ne sont pas sauvegardés sur un cloud externe, ils disparaîtront donc si vous désinstallez l\'application ou réinitialisez les données de votre appareil.\n\nPour les résultats importants, nous recommandons de les enregistrer séparément dans l\'application photo de votre appareil à l\'aide du bouton « Enregistrer » sur l\'écran des résultats. Les résultats enregistrés dans l\'application photo sont conservés indépendamment de cette application.'
    },
    {
      title: 'Q7. Puis-je changer la langue ?',
      text: 'Oui, vous pouvez choisir parmi 11 langues via Menu → Langue.\n\nLangues prises en charge : coréen, anglais, japonais, espagnol, français, indonésien, portugais, arabe, turc, thaï et chinois traditionnel.\n\nLes changements de langue prennent effet immédiatement, et la langue sélectionnée sera affichée la prochaine fois que vous utiliserez l\'application.'
    },
    {
      title: 'Q8. Je n\'aime pas le résultat de la transformation.',
      text: 'La même photo peut produire des résultats très différents selon le style artistique. Essayez un style différent ou transformez à nouveau avec le même style. L\'IA interprète différemment à chaque fois, donc les résultats varient également.\n\nDans la catégorie Maîtres, vous pouvez modifier le résultat en discutant directement avec le maître au bas de l\'écran des résultats. Envoyez des demandes naturelles comme « change la couleur du vêtement » ou « rend l\'arrière-plan plus lumineux » (des crédits supplémentaires seront déduits).\n\nPour les catégories Mouvements et Oriental, vous pouvez effectuer une nouvelle transformation pour obtenir des résultats différents.'
    },
  ],

  id: [
    {
      title: 'Q1. Transformasi gagal. Apa yang harus saya lakukan?',
      text: 'Kegagalan transformasi dapat terjadi karena masalah jaringan sementara, keterlambatan respons server, atau kebijakan keamanan kami.\n\nPertama, ketuk tombol "Coba Lagi" di layar hasil. Mencoba lagi tidak mengurangi kredit tambahan. Masalah sementara biasanya terselesaikan dalam dua atau tiga percobaan.\n\nJika masalah berlanjut, silakan hubungi kami melalui Menu → Hubungi Kami.'
    },
    {
      title: 'Q2. Bisakah saya mendapatkan pengembalian dana?',
      text: 'Semua pembayaran diproses melalui Apple App Store atau Google Play, dan permintaan serta persetujuan pengembalian dana ditentukan oleh masing-masing toko.\n\nCara meminta:\n- Apple: reportaproblem.apple.com\n- Google: aplikasi Google Play → Pembayaran & langganan → Anggaran dan riwayat pesanan\n\nJika pengembalian dana disetujui, seluruh kredit yang ditambahkan oleh pembayaran tersebut akan ditarik kembali. Karena ini termasuk kredit yang sudah digunakan untuk transformasi, saldo Anda mungkin menjadi tidak mencukupi setelah pengembalian dana.\n\nTidak diperlukan permintaan terpisah di aplikasi — pengembalian dana akan secara otomatis tercermin segera setelah toko menyetujuinya.'
    },
    {
      title: 'Q3. Bisakah saya menggunakan hasilnya secara komersial?',
      text: 'Hasil transformasi dari aplikasi ini hanya dapat digunakan untuk tujuan pribadi dan non-komersial. Memposting di media sosial Anda sendiri, berbagi dengan teman, dan menyimpan secara pribadi semuanya bebas diizinkan.\n\nMenggunakan hasil untuk tujuan komersial seperti penjualan, periklanan, produksi barang dagangan, atau konten berbayar tidak diizinkan.\n\nUntuk detailnya, lihat Menu → Tentang → Syarat Layanan, Bagian 9 dan 10.'
    },
    {
      title: 'Q4. Apakah foto saya aman?',
      text: 'Foto asli Anda tidak disimpan di server Master Valley. Foto tersebut dikirim melalui komunikasi terenkripsi ke layanan AI (Replicate, Anthropic, Google, OpenAI) untuk pemrosesan transformasi, dan dihapus segera setelah pemrosesan selesai.\n\nSetiap layanan AI mengikuti kebijakan untuk tidak menggunakan foto untuk melatih model mereka sendiri. Tidak ada pengenalan wajah atau ekstraksi informasi biometrik yang dilakukan.\n\nGambar hasil transformasi disimpan sementara di server Master Valley dan dihapus secara otomatis setelah 7 hari. Hasil yang disimpan ke galeri Anda hanya disimpan di perangkat Anda dan tidak dapat diakses oleh pengguna lain atau dari luar.\n\nUntuk detailnya, lihat Menu → Tentang → Syarat Layanan, Bagian 5 dan 8.'
    },
    {
      title: 'Q5. Apakah pengguna di bawah 18 tahun dapat menggunakannya?',
      text: 'Master Valley hanya tersedia untuk pengguna berusia 18 tahun ke atas.\n\nAplikasi ini mengubah foto menggunakan komposisi karya agung sejarah seni. Beberapa gaya (seperti patung klasik dan Renaisans) mungkin mengandung ekspresi artistik, sehingga aplikasi ini ditujukan untuk pengguna dewasa.\n\nSelain itu, foto siapa pun yang berusia di bawah 18 tahun tidak boleh diunggah dalam keadaan apa pun. Ini berlaku bahkan jika Anda adalah wali mereka — Anda tidak boleh mengunggah foto anak-anak Anda atau anak di bawah umur lainnya.\n\nUntuk detailnya, lihat Menu → Tentang → Syarat Layanan, Bagian 3 dan 8.'
    },
    {
      title: 'Q6. Di mana foto galeri disimpan?',
      text: 'Hasil transformasi yang disimpan di galeri (Menu → Galeri) disimpan di penyimpanan internal perangkat Anda. Hasil tersebut tidak dicadangkan ke cloud eksternal, jadi akan hilang jika Anda menghapus aplikasi atau mengatur ulang data perangkat.\n\nUntuk hasil penting, kami sarankan untuk menyimpannya secara terpisah ke aplikasi foto perangkat Anda menggunakan tombol "Simpan" pada layar hasil. Hasil yang disimpan di aplikasi foto disimpan secara independen dari aplikasi ini.'
    },
    {
      title: 'Q7. Bisakah saya mengubah bahasa?',
      text: 'Ya, Anda dapat memilih dari 11 bahasa melalui Menu → Bahasa.\n\nBahasa yang didukung: Korea, Inggris, Jepang, Spanyol, Prancis, Indonesia, Portugis, Arab, Turki, Thailand, dan Tionghoa Tradisional.\n\nPerubahan bahasa berlaku segera, dan bahasa yang dipilih akan ditampilkan saat Anda menggunakan aplikasi berikutnya.'
    },
    {
      title: 'Q8. Saya tidak suka hasil transformasinya.',
      text: 'Foto yang sama dapat menghasilkan hasil yang sangat berbeda tergantung pada gaya seni. Coba gaya yang berbeda, atau ubah dengan gaya yang sama lagi. AI menafsirkan secara berbeda setiap kali, jadi hasilnya juga bervariasi.\n\nDi kategori Maestro (Masters), Anda dapat memodifikasi hasil dengan berbicara langsung dengan maestro di bagian bawah layar hasil. Kirim permintaan alami seperti "ubah warna pakaian" atau "buat latar belakang lebih cerah" (kredit tambahan akan dikurangi).\n\nUntuk kategori Pergerakan (Movements) dan Oriental, Anda dapat melakukan transformasi baru untuk mendapatkan hasil yang berbeda.'
    },
  ],

  pt: [
    {
      title: 'Q1. A transformação falhou. O que devo fazer?',
      text: 'Falhas de transformação podem ocorrer devido a problemas temporários de rede, atrasos na resposta do servidor ou nossas políticas de segurança.\n\nPrimeiro, toque no botão "Tentar novamente" na tela de resultados. Tentar novamente não desconta créditos adicionais. Problemas temporários geralmente são resolvidos em duas ou três tentativas.\n\nSe o problema persistir, entre em contato conosco através de Menu → Fale Conosco.'
    },
    {
      title: 'Q2. Posso obter um reembolso?',
      text: 'Todos os pagamentos são processados pela Apple App Store ou Google Play, e as solicitações e aprovações de reembolso são determinadas por cada loja.\n\nComo solicitar:\n- Apple: reportaproblem.apple.com\n- Google: aplicativo Google Play → Pagamentos e assinaturas → Orçamento e histórico de pedidos\n\nSe um reembolso for aprovado, todos os créditos adicionados por aquele pagamento são recuperados. Como isso inclui os créditos já usados em transformações, seu saldo pode ficar insuficiente após o reembolso.\n\nNão é necessária nenhuma solicitação separada no aplicativo — o reembolso é refletido automaticamente assim que a loja o aprova.'
    },
    {
      title: 'Q3. Posso usar os resultados comercialmente?',
      text: 'Os resultados de transformação deste aplicativo só podem ser usados para fins pessoais e não comerciais. Publicar em suas próprias redes sociais, compartilhar com amigos e guardar de forma pessoal são livremente permitidos.\n\nNão é permitido usar os resultados para fins comerciais como vendas, publicidade, produção de mercadorias ou conteúdo pago.\n\nPara mais detalhes, consulte Menu → Sobre → Termos de Serviço, seções 9 e 10.'
    },
    {
      title: 'Q4. Minhas fotos estão seguras?',
      text: 'Suas fotos originais não são armazenadas nos servidores do Master Valley. Elas são transmitidas via comunicação criptografada para serviços de IA (Replicate, Anthropic, Google, OpenAI) para o processamento de transformação, e excluídas imediatamente após a conclusão do processamento.\n\nCada serviço de IA segue uma política de não usar fotos para treinar seus próprios modelos. Nenhum reconhecimento facial ou extração de informação biométrica é realizada.\n\nAs imagens resultantes da transformação são temporariamente armazenadas nos servidores do Master Valley e excluídas automaticamente após 7 dias. Os resultados salvos em sua galeria são armazenados apenas em seu dispositivo e não podem ser acessados por outros usuários ou do exterior.\n\nPara mais detalhes, consulte Menu → Sobre → Termos de Serviço, seções 5 e 8.'
    },
    {
      title: 'Q5. Pessoas menores de 18 anos podem usar?',
      text: 'O Master Valley está disponível apenas para usuários com 18 anos ou mais.\n\nEste aplicativo transforma fotos usando as composições de obras-primas da história da arte. Alguns estilos (como escultura clássica e Renascimento) podem incluir expressão artística, por isso o aplicativo é destinado a usuários adultos.\n\nAlém disso, fotos de qualquer pessoa menor de 18 anos não podem ser enviadas sob nenhuma circunstância. Isso se aplica mesmo se você for o responsável legal — você não pode enviar fotos de seus filhos ou de outros menores.\n\nPara mais detalhes, consulte Menu → Sobre → Termos de Serviço, seções 3 e 8.'
    },
    {
      title: 'Q6. Onde as fotos da galeria são armazenadas?',
      text: 'Os resultados de transformação salvos na galeria (Menu → Galeria) são armazenados no armazenamento interno do seu dispositivo. Eles não são copiados para a nuvem externa, portanto desaparecerão se você desinstalar o aplicativo ou redefinir os dados do dispositivo.\n\nPara resultados importantes, recomendamos salvá-los separadamente no aplicativo de fotos do seu dispositivo usando o botão "Salvar" na tela de resultados. Os resultados salvos no aplicativo de fotos são mantidos independentemente deste aplicativo.'
    },
    {
      title: 'Q7. Posso mudar o idioma?',
      text: 'Sim, você pode escolher entre 11 idiomas através de Menu → Idioma.\n\nIdiomas suportados: coreano, inglês, japonês, espanhol, francês, indonésio, português, árabe, turco, tailandês e chinês tradicional.\n\nAs mudanças de idioma têm efeito imediato, e o idioma selecionado será exibido na próxima vez que você usar o aplicativo.'
    },
    {
      title: 'Q8. Não gostei do resultado da transformação.',
      text: 'A mesma foto pode produzir resultados muito diferentes dependendo do estilo artístico. Tente um estilo diferente, ou transforme com o mesmo estilo novamente. A IA interpreta de forma diferente a cada vez, então os resultados também variam.\n\nNa categoria Mestres, você pode modificar o resultado conversando diretamente com o mestre na parte inferior da tela de resultados. Envie pedidos naturais como "mude a cor da roupa" ou "deixe o fundo mais claro" (créditos adicionais serão deduzidos).\n\nPara as categorias Movimentos e Oriental, você pode realizar uma nova transformação para obter resultados diferentes.'
    },
  ],

  ar: [
    {
      title: 'س1. فشلت عملية التحويل. ماذا أفعل؟',
      text: 'قد تحدث إخفاقات التحويل بسبب مشكلات شبكة مؤقتة، أو تأخر استجابة الخادم، أو سياسات السلامة لدينا.\n\nأولاً، اضغط على زر "إعادة المحاولة" في شاشة النتيجة. إعادة المحاولة لا تخصم أرصدة إضافية. عادةً ما تُحل المشكلات المؤقتة في غضون محاولتين أو ثلاث محاولات.\n\nإذا استمرت المشكلة، يرجى التواصل معنا عبر القائمة ← اتصل بنا.'
    },
    {
      title: 'س2. هل يمكنني الحصول على استرداد؟',
      text: 'تتم معالجة جميع المدفوعات من خلال Apple App Store أو Google Play، ويتم تحديد طلبات الاسترداد وموافقاتها من قبل كل متجر.\n\nكيفية الطلب:\n- Apple: reportaproblem.apple.com\n- Google: تطبيق Google Play ← المدفوعات والاشتراكات ← الميزانية وسجل الطلبات\n\nإذا تمت الموافقة على الاسترداد، يتم استرجاع جميع الأرصدة التي أُضيفت بهذا الدفع. ولأن هذا يشمل الأرصدة المستخدمة بالفعل في التحويلات، قد يصبح رصيدك غير كافٍ بعد الاسترداد.\n\nلا حاجة لطلب منفصل في التطبيق — يتم عكس الاسترداد تلقائيًا بمجرد موافقة المتجر.'
    },
    {
      title: 'س3. هل يمكنني استخدام النتائج تجاريًا؟',
      text: 'يمكن استخدام نتائج التحويل من هذا التطبيق فقط للأغراض الشخصية وغير التجارية. النشر على وسائل التواصل الاجتماعي الخاصة بك، والمشاركة مع الأصدقاء، والاحتفاظ الشخصي كلها مسموح بها بحرية.\n\nاستخدام النتائج للأغراض التجارية مثل البيع أو الإعلان أو إنتاج البضائع أو المحتوى المدفوع غير مسموح به.\n\nللمزيد من التفاصيل، راجع القائمة ← حول ← شروط الخدمة، القسمين 9 و10.'
    },
    {
      title: 'س4. هل صوري آمنة؟',
      text: 'لا يتم تخزين صورك الأصلية على خوادم Master Valley. يتم نقلها عبر اتصال مشفر إلى خدمات الذكاء الاصطناعي (Replicate وAnthropic وGoogle وOpenAI) لمعالجة التحويل، وتُحذف فور انتهاء المعالجة.\n\nتتبع كل خدمة من خدمات الذكاء الاصطناعي سياسة عدم استخدام الصور لتدريب نماذجها الخاصة. لا يتم إجراء تعرف على الوجوه أو استخراج للمعلومات البيومترية.\n\nيتم تخزين صور نتائج التحويل مؤقتًا على خوادم Master Valley وتُحذف تلقائيًا بعد 7 أيام. النتائج المحفوظة في معرضك تُخزن على جهازك فقط ولا يمكن الوصول إليها من قبل مستخدمين آخرين أو من الخارج.\n\nللمزيد من التفاصيل، راجع القائمة ← حول ← شروط الخدمة، القسمين 5 و8.'
    },
    {
      title: 'س5. هل يمكن للأشخاص دون سن 18 عامًا استخدامه؟',
      text: 'Master Valley متاح فقط للمستخدمين الذين تبلغ أعمارهم 18 عامًا أو أكثر.\n\nيقوم هذا التطبيق بتحويل الصور باستخدام تركيبات روائع تاريخ الفن. قد تتضمن بعض الأنماط (مثل النحت الكلاسيكي وعصر النهضة) تعبيرًا فنيًا، ولهذا فالتطبيق مخصص للمستخدمين البالغين.\n\nبالإضافة إلى ذلك، لا يجوز تحميل صور لأي شخص دون سن 18 عامًا تحت أي ظرف من الظروف. ينطبق هذا حتى لو كنت ولي أمرهم — لا يمكنك تحميل صور لأطفالك أو لأي قاصرين آخرين.\n\nللمزيد من التفاصيل، راجع القائمة ← حول ← شروط الخدمة، القسمين 3 و8.'
    },
    {
      title: 'س6. أين يتم تخزين صور المعرض؟',
      text: 'يتم تخزين نتائج التحويل المحفوظة في المعرض (القائمة ← المعرض) في وحدة التخزين الداخلية لجهازك. لا يتم نسخها احتياطيًا إلى السحابة الخارجية، لذا ستختفي إذا قمت بإلغاء تثبيت التطبيق أو إعادة تعيين بيانات الجهاز.\n\nللنتائج المهمة، نوصي بحفظها بشكل منفصل في تطبيق الصور بجهازك باستخدام زر "حفظ" في شاشة النتيجة. النتائج المحفوظة في تطبيق الصور تُحتفظ بها بشكل مستقل عن هذا التطبيق.'
    },
    {
      title: 'س7. هل يمكنني تغيير اللغة؟',
      text: 'نعم، يمكنك الاختيار من بين 11 لغة عبر القائمة ← اللغة.\n\nاللغات المدعومة: الكورية، الإنجليزية، اليابانية، الإسبانية، الفرنسية، الإندونيسية، البرتغالية، العربية، التركية، التايلاندية، والصينية التقليدية.\n\nتسري تغييرات اللغة فورًا، وستظهر اللغة المختارة في المرة التالية التي تستخدم فيها التطبيق.'
    },
    {
      title: 'س8. لم تعجبني نتيجة التحويل.',
      text: 'يمكن للصورة نفسها أن تنتج نتائج مختلفة جدًا بناءً على النمط الفني. جرّب نمطًا مختلفًا، أو حوّل بنفس النمط مرة أخرى. الذكاء الاصطناعي يفسر بشكل مختلف في كل مرة، لذا تتنوع النتائج أيضًا.\n\nفي فئة الأساتذة (Masters)، يمكنك تعديل النتيجة من خلال التحدث مباشرة مع الأستاذ في أسفل شاشة النتيجة. أرسل طلبات طبيعية مثل "غيّر لون الملابس" أو "اجعل الخلفية أكثر إشراقًا" (سيتم خصم أرصدة إضافية).\n\nلفئتي الحركات (Movements) والشرقية (Oriental)، يمكنك إجراء تحويل جديد للحصول على نتائج مختلفة.'
    },
  ],

  tr: [
    {
      title: 'S1. Dönüşüm başarısız oldu. Ne yapmalıyım?',
      text: 'Dönüşüm başarısızlıkları geçici ağ sorunları, sunucu yanıt gecikmeleri veya güvenlik politikalarımız nedeniyle olabilir.\n\nÖnce, sonuç ekranındaki "Tekrar Dene" düğmesine dokunun. Tekrar denemek ek kredi düşmez. Geçici sorunlar genellikle iki veya üç denemede çözülür.\n\nSorun devam ederse, lütfen Menü → Bize Ulaşın üzerinden bizimle iletişime geçin.'
    },
    {
      title: 'S2. İade alabilir miyim?',
      text: 'Tüm ödemeler Apple App Store veya Google Play üzerinden işlenir ve iade talepleri ile onayları her mağaza tarafından belirlenir.\n\nNasıl talep edilir:\n- Apple: reportaproblem.apple.com\n- Google: Google Play uygulaması → Ödemeler ve abonelikler → Bütçe ve sipariş geçmişi\n\nBir iade onaylanırsa, o ödemeyle eklenen tüm krediler geri alınır. Bu, dönüşümler için zaten kullanılmış kredileri içerdiğinden, iadeden sonra bakiyeniz yetersiz hale gelebilir.\n\nUygulamada ayrı bir talebe gerek yoktur — iade, mağaza onayladıktan hemen sonra otomatik olarak yansıtılır.'
    },
    {
      title: 'S3. Sonuçları ticari olarak kullanabilir miyim?',
      text: 'Bu uygulamanın dönüşüm sonuçları yalnızca kişisel, ticari olmayan amaçlarla kullanılabilir. Kendi sosyal medya hesaplarınızda paylaşmak, arkadaşlarınızla paylaşmak ve kişisel saklamak serbestçe mümkündür.\n\nSonuçları satış, reklam, ürün üretimi veya ücretli içerik gibi ticari amaçlarla kullanmak izin verilmez.\n\nDetaylar için Menü → Hakkında → Kullanım Koşulları, Bölüm 9 ve 10\'a bakın.'
    },
    {
      title: 'S4. Fotoğraflarım güvende mi?',
      text: 'Orijinal fotoğraflarınız Master Valley sunucularında saklanmaz. Dönüşüm işlemi için AI hizmetlerine (Replicate, Anthropic, Google, OpenAI) şifreli iletişim yoluyla iletilir ve işlem tamamlandıktan hemen sonra silinir.\n\nHer AI hizmeti, fotoğrafları kendi modellerini eğitmek için kullanmama politikasını izler. Yüz tanıma veya biyometrik bilgi çıkarma da yapılmaz.\n\nDönüşüm sonuç görüntüleri Master Valley sunucularında geçici olarak saklanır ve 7 gün sonra otomatik olarak silinir. Galerinize kaydedilen sonuçlar yalnızca cihazınızda saklanır ve diğer kullanıcılar veya dışarıdan erişilemez.\n\nDetaylar için Menü → Hakkında → Kullanım Koşulları, Bölüm 5 ve 8\'e bakın.'
    },
    {
      title: 'S5. 18 yaşından küçükler kullanabilir mi?',
      text: 'Master Valley yalnızca 18 yaş ve üzeri kullanıcılar için kullanılabilir.\n\nBu uygulama, sanat tarihi başyapıtlarının kompozisyonlarını kullanarak fotoğrafları dönüştürür. Bazı stiller (klasik heykel ve Rönesans gibi) sanatsal ifade içerebilir, bu nedenle uygulama yetişkin kullanıcılara yöneliktir.\n\nAyrıca, 18 yaşından küçük herhangi birinin fotoğrafları hiçbir koşulda yüklenemez. Bu, onların velisi olsanız bile geçerlidir — çocuklarınızın veya diğer küçüklerin fotoğraflarını yükleyemezsiniz.\n\nDetaylar için Menü → Hakkında → Kullanım Koşulları, Bölüm 3 ve 8\'e bakın.'
    },
    {
      title: 'S6. Galeri fotoğrafları nerede saklanıyor?',
      text: 'Galeride (Menü → Galeri) saklanan dönüşüm sonuçları cihazınızın dahili depolama alanında saklanır. Harici buluta yedeklenmezler, bu nedenle uygulamayı kaldırırsanız veya cihaz verilerinizi sıfırlarsanız kaybolurlar.\n\nÖnemli sonuçlar için, sonuç ekranındaki "Kaydet" düğmesini kullanarak cihazınızın fotoğraf uygulamasına ayrıca kaydetmenizi öneririz. Fotoğraf uygulamasında kaydedilen sonuçlar bu uygulamadan bağımsız olarak saklanır.'
    },
    {
      title: 'S7. Dili değiştirebilir miyim?',
      text: 'Evet, Menü → Dil üzerinden 11 dilden seçim yapabilirsiniz.\n\nDesteklenen diller: Korece, İngilizce, Japonca, İspanyolca, Fransızca, Endonezce, Portekizce, Arapça, Türkçe, Tayca ve Geleneksel Çince.\n\nDil değişiklikleri hemen geçerli olur ve seçilen dil, uygulamayı bir sonraki kullanışınızda görüntülenir.'
    },
    {
      title: 'S8. Dönüşüm sonucunu beğenmedim.',
      text: 'Aynı fotoğraf, sanat stiline bağlı olarak çok farklı sonuçlar üretebilir. Farklı bir stil deneyin veya aynı stille tekrar dönüştürün. AI her seferinde farklı yorumladığından sonuçlar da değişir.\n\nUstalar (Masters) kategorisinde, sonuç ekranının altında ustayla doğrudan konuşarak sonucu değiştirebilirsiniz. "Kıyafet rengini değiştir" veya "arka planı daha parlak yap" gibi doğal istekler gönderin (ek krediler düşülecektir).\n\nHareketler (Movements) ve Doğu (Oriental) kategorileri için farklı sonuçlar elde etmek için yeni bir dönüşüm gerçekleştirebilirsiniz.'
    },
  ],

  th: [
    {
      title: 'Q1. การแปลงล้มเหลว ฉันควรทำอย่างไร?',
      text: 'การแปลงที่ล้มเหลวอาจเกิดจากปัญหาเครือข่ายชั่วคราว การตอบสนองของเซิร์ฟเวอร์ที่ล่าช้า หรือนโยบายความปลอดภัยของเรา\n\nก่อนอื่น แตะปุ่ม "ลองอีกครั้ง" บนหน้าจอผลลัพธ์ การลองอีกครั้งจะไม่หักเครดิตเพิ่มเติม ปัญหาชั่วคราวมักจะแก้ไขได้ภายในสองหรือสามครั้ง\n\nหากปัญหายังคงอยู่ โปรดติดต่อเราผ่าน เมนู → ติดต่อเรา'
    },
    {
      title: 'Q2. ฉันสามารถขอคืนเงินได้หรือไม่?',
      text: 'การชำระเงินทั้งหมดดำเนินการผ่าน Apple App Store หรือ Google Play และคำขอคืนเงินรวมถึงการอนุมัติจะถูกกำหนดโดยแต่ละสโตร์\n\nวิธีการขอ:\n- Apple: reportaproblem.apple.com\n- Google: แอป Google Play → การชำระเงินและการสมัครสมาชิก → งบประมาณและประวัติการสั่งซื้อ\n\nหากการคืนเงินได้รับการอนุมัติ เครดิตทั้งหมดที่เพิ่มจากการชำระเงินนั้นจะถูกเรียกคืน เนื่องจากรวมถึงเครดิตที่ใช้ไปแล้วสำหรับการแปลง ยอดคงเหลือของคุณอาจไม่เพียงพอหลังการคืนเงิน\n\nไม่จำเป็นต้องมีคำขอแยกต่างหากในแอป — การคืนเงินจะสะท้อนโดยอัตโนมัติทันทีที่สโตร์อนุมัติ'
    },
    {
      title: 'Q3. ฉันสามารถใช้ผลลัพธ์ในเชิงพาณิชย์ได้หรือไม่?',
      text: 'ผลการแปลงจากแอปนี้สามารถใช้ได้เฉพาะเพื่อวัตถุประสงค์ส่วนตัวที่ไม่ใช่เชิงพาณิชย์เท่านั้น การโพสต์บนโซเชียลมีเดียของคุณ การแบ่งปันกับเพื่อน และการเก็บไว้ส่วนตัวสามารถทำได้อย่างอิสระ\n\nไม่อนุญาตให้ใช้ผลลัพธ์เพื่อวัตถุประสงค์เชิงพาณิชย์ เช่น การขาย การโฆษณา การผลิตสินค้า หรือเนื้อหาแบบเสียค่าบริการ\n\nสำหรับรายละเอียด ดูที่ เมนู → เกี่ยวกับ → ข้อกำหนดการใช้บริการ ข้อ 9 และ 10'
    },
    {
      title: 'Q4. รูปภาพของฉันปลอดภัยหรือไม่?',
      text: 'รูปต้นฉบับของคุณจะไม่ถูกจัดเก็บไว้บนเซิร์ฟเวอร์ Master Valley รูปจะถูกส่งผ่านการสื่อสารที่เข้ารหัสไปยังบริการ AI (Replicate, Anthropic, Google, OpenAI) เพื่อประมวลผลการแปลง และจะถูกลบทันทีหลังจากประมวลผลเสร็จสิ้น\n\nบริการ AI แต่ละรายการปฏิบัติตามนโยบายไม่ใช้รูปเพื่อฝึกโมเดลของตนเอง ไม่มีการจดจำใบหน้าหรือการสกัดข้อมูลไบโอเมตริก\n\nภาพผลลัพธ์การแปลงจะถูกจัดเก็บชั่วคราวบนเซิร์ฟเวอร์ Master Valley และลบโดยอัตโนมัติหลังจาก 7 วัน ผลลัพธ์ที่บันทึกไว้ในแกลเลอรีของคุณจะถูกจัดเก็บเฉพาะบนอุปกรณ์ของคุณ และผู้ใช้รายอื่นหรือบุคคลภายนอกไม่สามารถเข้าถึงได้\n\nสำหรับรายละเอียด ดูที่ เมนู → เกี่ยวกับ → ข้อกำหนดการใช้บริการ ข้อ 5 และ 8'
    },
    {
      title: 'Q5. ผู้ที่มีอายุต่ำกว่า 18 ปีสามารถใช้ได้หรือไม่?',
      text: 'Master Valley มีให้บริการเฉพาะผู้ใช้ที่มีอายุ 18 ปีขึ้นไปเท่านั้น\n\nแอปนี้แปลงรูปโดยใช้องค์ประกอบของผลงานชิ้นเอกในประวัติศาสตร์ศิลปะ บางสไตล์ (เช่น ประติมากรรมคลาสสิกและยุคฟื้นฟูศิลปวิทยา) อาจรวมถึงการแสดงออกทางศิลปะ ดังนั้นแอปจึงมีไว้สำหรับผู้ใช้ที่เป็นผู้ใหญ่\n\nนอกจากนี้ ห้ามอัปโหลดรูปของบุคคลที่อายุต่ำกว่า 18 ปีภายใต้สถานการณ์ใดๆ สิ่งนี้ใช้แม้ว่าคุณจะเป็นผู้ปกครองของพวกเขา — คุณไม่สามารถอัปโหลดรูปของลูกคุณหรือผู้เยาว์อื่นๆ\n\nสำหรับรายละเอียด ดูที่ เมนู → เกี่ยวกับ → ข้อกำหนดการใช้บริการ ข้อ 3 และ 8'
    },
    {
      title: 'Q6. รูปภาพในแกลเลอรีถูกเก็บไว้ที่ไหน?',
      text: 'ผลลัพธ์การแปลงที่บันทึกในแกลเลอรี (เมนู → แกลเลอรี) จะถูกเก็บไว้ในที่เก็บข้อมูลภายในของอุปกรณ์ของคุณ ไม่มีการสำรองข้อมูลไปยังคลาวด์ภายนอก ดังนั้นจะหายไปหากคุณถอนการติดตั้งแอปหรือรีเซ็ตข้อมูลอุปกรณ์\n\nสำหรับผลลัพธ์ที่สำคัญ เราแนะนำให้บันทึกแยกต่างหากในแอปรูปภาพของอุปกรณ์โดยใช้ปุ่ม "บันทึก" บนหน้าจอผลลัพธ์ ผลลัพธ์ที่บันทึกในแอปรูปภาพจะถูกเก็บไว้แยกต่างหากจากแอปนี้'
    },
    {
      title: 'Q7. ฉันสามารถเปลี่ยนภาษาได้หรือไม่?',
      text: 'ได้ คุณสามารถเลือกจาก 11 ภาษาผ่าน เมนู → ภาษา\n\nภาษาที่รองรับ: เกาหลี อังกฤษ ญี่ปุ่น สเปน ฝรั่งเศส อินโดนีเซีย โปรตุเกส อาหรับ ตุรกี ไทย และจีนตัวเต็ม\n\nการเปลี่ยนภาษามีผลทันที และภาษาที่เลือกจะแสดงในครั้งต่อไปที่คุณใช้แอป'
    },
    {
      title: 'Q8. ฉันไม่ชอบผลการแปลง',
      text: 'รูปเดียวกันสามารถให้ผลลัพธ์ที่แตกต่างกันมากขึ้นอยู่กับสไตล์ศิลปะ ลองสไตล์อื่น หรือแปลงด้วยสไตล์เดียวกันอีกครั้ง AI ตีความแตกต่างกันในแต่ละครั้ง ดังนั้นผลลัพธ์ก็แตกต่างกันด้วย\n\nในหมวดมาสเตอร์ (Masters) คุณสามารถปรับเปลี่ยนผลลัพธ์ได้โดยพูดคุยกับมาสเตอร์โดยตรงที่ด้านล่างของหน้าจอผลลัพธ์ ส่งคำขอแบบธรรมชาติ เช่น "เปลี่ยนสีเสื้อผ้า" หรือ "ทำให้พื้นหลังสว่างขึ้น" (จะมีการหักเครดิตเพิ่มเติม)\n\nสำหรับหมวดเคลื่อนไหว (Movements) และตะวันออก (Oriental) คุณสามารถทำการแปลงใหม่เพื่อให้ได้ผลลัพธ์ที่แตกต่าง'
    },
  ],

  'zh-TW': [
    {
      title: 'Q1. 轉換失敗了。我該怎麼辦？',
      text: '轉換失敗可能是由於暫時性網路問題、伺服器回應延遲，或我們的安全政策所致。\n\n請先點擊結果畫面的「重試」按鈕。重試不會額外扣除點數。暫時性問題通常在兩到三次嘗試內就能解決。\n\n如問題持續，請透過 選單 → 聯絡我們 與我們聯繫。'
    },
    {
      title: 'Q2. 我可以申請退款嗎？',
      text: '所有付款均透過 Apple App Store 或 Google Play 處理，退款申請和核准由各商店決定。\n\n申請方式：\n- Apple：reportaproblem.apple.com\n- Google：Google Play 應用程式 → 付款與訂閱 → 預算和訂單記錄\n\n如退款核准後，該筆付款所充值的點數將全數收回。由於這包括已用於轉換的點數，退款後您的餘額可能不足。\n\n應用程式內無需另行申請 — 商店核准退款後將自動反映。'
    },
    {
      title: 'Q3. 我可以將結果用於商業用途嗎？',
      text: '本應用程式的轉換結果僅可用於個人非商業用途。將結果發佈至您自己的社群媒體、與朋友分享、個人保存皆可自由進行。\n\n不允許將結果用於銷售、廣告、商品製作或付費內容等商業用途。\n\n詳情請見 選單 → 關於 → 服務條款，第 9 和 10 條。'
    },
    {
      title: 'Q4. 我的照片安全嗎？',
      text: '您的原始照片不會儲存於 Master Valley 伺服器。為了進行轉換處理，照片透過加密通訊傳送至 AI 服務（Replicate、Anthropic、Google、OpenAI），並於處理完成後立即刪除。\n\n各 AI 服務遵循不將照片用於訓練自家模型的政策。亦不會進行人臉辨識或生物識別資訊提取。\n\n轉換結果影像會暫存於 Master Valley 伺服器，並於 7 天後自動刪除。儲存至您圖庫的結果僅儲存在您的裝置上，無法被其他使用者或外部存取。\n\n詳情請見 選單 → 關於 → 服務條款，第 5 和 8 條。'
    },
    {
      title: 'Q5. 未滿 18 歲的人可以使用嗎？',
      text: 'Master Valley 僅適用於 18 歲以上的使用者。\n\n本應用程式使用藝術史名作的構圖來轉換照片。某些風格（如古典雕塑和文藝復興）可能包含藝術性表現，因此此應用程式針對成年使用者設計。\n\n此外，在任何情況下都不可上傳未滿 18 歲者的照片。即使您是其監護人 — 您也不能上傳您子女或其他未成年人的照片。\n\n詳情請見 選單 → 關於 → 服務條款，第 3 和 8 條。'
    },
    {
      title: 'Q6. 圖庫照片儲存在哪裡？',
      text: '儲存於圖庫（選單 → 圖庫）的轉換結果儲存在您裝置的內部儲存空間中。它們不會備份至外部雲端，因此如果您解除安裝應用程式或重設裝置資料，結果將會消失。\n\n對於重要的結果，建議使用結果畫面上的「儲存」按鈕，將其另外儲存到您裝置的相片應用程式中。儲存在相片應用程式中的結果，會獨立於本應用程式保存。'
    },
    {
      title: 'Q7. 我可以更改語言嗎？',
      text: '可以，您可以透過 選單 → 語言 從 11 種語言中選擇。\n\n支援語言：韓語、英語、日語、西班牙語、法語、印尼語、葡萄牙語、阿拉伯語、土耳其語、泰語和繁體中文。\n\n語言變更會立即生效，下次使用應用程式時也會以選擇的語言顯示。'
    },
    {
      title: 'Q8. 我不喜歡轉換結果。',
      text: '同一張照片根據藝術風格的不同會產生差異很大的結果。請嘗試不同的風格，或使用相同風格再次轉換。AI 每次的詮釋都不同，因此結果也會有所變化。\n\n在大師（Masters）類別中，您可以透過結果畫面下方與大師直接對話來修改結果。發送如「換衣服顏色」或「讓背景更亮」等自然請求即可（將收取額外點數）。\n\n對於藝術運動（Movements）和東方（Oriental）類別，您可以重新轉換以獲得不同的結果。'
    },
  ],
};
