// pricing.js - 변환 비용 계산
// deduct-credit.js의 validCosts와 동기화 필수

const PRICES = {
  single: {
    movements: 0.20,
    masters: 0.25,
    oriental: 0.20
  },
  oneclick: {
    movements: 2.00,
    masters: 1.50,
    oriental: 0.50
  },
  retransform: 0.10
};

/**
 * 변환 비용 계산
 * @param {object} style - selectedStyle 객체
 * @param {boolean} isRetransform - 재변환 여부
 * @returns {number} 비용 (달러)
 */
export const getTransformCost = (style, isRetransform = false) => {
  if (isRetransform) return PRICES.retransform;

  const category = style?.category;
  if (!category) return 0;

  if (style.isFullTransform) {
    return PRICES.oneclick[category] || 0;
  }

  return PRICES.single[category] || 0;
};

export default PRICES;
