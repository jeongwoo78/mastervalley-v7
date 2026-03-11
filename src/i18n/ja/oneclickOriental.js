// ========================================
// ワンクリック 東洋画専用 教育資料
// 2026-03-11
// ----------------------------------------
// 1次: 詩的トーン（ローディング待機、期待感）
// 2次: 国の定義/特徴（固定）→ スタイル紹介/特徴（変更）
// ========================================

// ==================== 基本情報（2次結果用）====================

export const oneclickOrientalBasicInfo = {
  // 韓国
  'korean-minhwa': {
    name: '韓国伝統絵画（Korean Traditional Painting）',
    subtitle1: '民画（Minhwa）',
    subtitle2: '願いを込めた民衆の絵'
  },
  'korean-pungsokdo': {
    name: '韓国伝統絵画（Korean Traditional Painting）',
    subtitle1: '風俗図（Pungsokdo）',
    subtitle2: '民衆の暮らしを描く'
  },
  'korean-jingyeong': {
    name: '韓国伝統絵画（Korean Traditional Painting）',
    subtitle1: '真景山水画（Jingyeong Sansuhwa）',
    subtitle2: '朝鮮の目で見た山河'
  },
  // 中国
  'chinese-ink': {
    name: '中国伝統絵画（Chinese Traditional Painting）',
    subtitle1: '水墨画（Ink Wash）',
    subtitle2: '墨で描く精神の風景'
  },
  'chinese-gongbi': {
    name: '中国伝統絵画（Chinese Traditional Painting）',
    subtitle1: '工筆画（Gongbi）',
    subtitle2: '精密さの極致'
  },
  // 日本
  'japanese-ukiyoe': {
    name: '日本伝統絵画（Japanese Traditional Painting）',
    subtitle1: '浮世絵（Ukiyo-e）',
    subtitle2: '浮き世を版木に刻む'
  },
  'japanese-rinpa': {
    name: '日本伝統絵画（Japanese Traditional Painting）',
    subtitle1: '琳派（Rinpa）',
    subtitle2: '金箔の上に咲く装飾の美学'
  }
};

// ==================== 1次教育資料（ローディング画面用）====================

export const oneclickOrientalPrimary = {
  content: `西洋が満たしたとき、東洋は空けました。
描かないことで語る術。

墨と余白の間の韓国、
山水と装飾の間の中国、
はかなさと華やかさが共存する日本。

三つの国、三本の筆先。
いま、あなたがそこに留まります。`
};

// ==================== 2次教育資料（結果画面用）====================

export const oneclickOrientalSecondary = {

  // ========== 韓国 ==========
  'korean-minhwa': {
    content: `韓国伝統絵画は余白を活かし、筆先に精神を宿した芸術です。
士人は墨で、民衆は色で暮らしを描きました。

民画は朝鮮の民衆が暮らしの願いを込めて描いた絵です。
虎、カササギ、牡丹など象徴的な題材を自由に構成しました。`
  },

  'korean-pungsokdo': {
    content: `韓国伝統絵画は余白を活かし、筆先に精神を宿した芸術です。
士人は墨で、民衆は色で暮らしを描きました。

風俗図は朝鮮の庶民の日常を描いた絵です。
相撲、洗濯、書堂の風景を軽やかな筆運びで記録しました。`
  },

  'korean-jingyeong': {
    content: `韓国伝統絵画は余白を活かし、筆先に精神を宿した芸術です。
士人は墨で、民衆は色で暮らしを描きました。

真景山水画は朝鮮の実際の山河を直接見て描いた絵です。
謙斎・鄭敾が垂直の皴法と大胆な構図で完成させました。`
  },

  // ========== 中国 ==========
  'chinese-ink': {
    content: `中国伝統絵画は墨の濃淡で宇宙の気韻を捉えた芸術です。
文人の精神と宮廷の技巧が千年にわたり共存しました。

水墨画は墨の濃淡だけで世界を描いた文人の芸術です。
描かれなかった余白が最も多くを語ります。`
  },

  'chinese-gongbi': {
    content: `中国伝統絵画は墨の濃淡で宇宙の気韻を捉えた芸術です。
文人の精神と宮廷の技巧が千年にわたり共存しました。

工筆画は一筋の乱れもなく精密に描いた宮廷絵画です。
透明な色を何層も重ねて深みを生み出しました。`
  },

  // ========== 日本 ==========
  'japanese-ukiyoe': {
    content: `日本伝統絵画は大衆の感覚と宮廷の華やかさが共存する芸術です。
街の版画と金色の装飾画がそれぞれの美を花開かせました。

浮世絵は江戸時代の庶民が楽しんだ木版画です。
太い輪郭線と平面的な色面が印象派に霊感を与えました。`
  },

  'japanese-rinpa': {
    content: `日本伝統絵画は大衆の感覚と宮廷の華やかさが共存する芸術です。
街の版画と金色の装飾画がそれぞれの美を花開かせました。

琳派は金箔の上に自然を華やかに装飾した宮廷絵画です。
色を幾重にも滲ませ、花や波に自然な広がりを生み出しました。`
  }
};

export default {
  oneclickOrientalBasicInfo,
  oneclickOrientalPrimary,
  oneclickOrientalSecondary
};
