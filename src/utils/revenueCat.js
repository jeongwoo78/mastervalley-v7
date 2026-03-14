// revenueCat.js - RevenueCat 인앱결제 서비스
// 설치: npm install @revenuecat/purchases-capacitor
// 설정: RevenueCat 대시보드에서 API Key 발급 필요

import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// RevenueCat API Keys (RevenueCat Dashboard → API Keys)
const RC_API_KEY_APPLE = 'appl_XXXXXXXXXXXXXXXXXX';   // TODO: 실제 키로 교체
const RC_API_KEY_GOOGLE = 'goog_XXXXXXXXXXXXXXXXXX';   // TODO: 실제 키로 교체

// 상품 ID ↔ 크레딧 매핑 (App Store / Google Play 등록 상품과 일치)
export const PRODUCT_MAP = {
  'mv_starter_099':  { price: 0.99, credits: 0.99,  name: 'Starter' },
  'mv_standard_499': { price: 4.99, credits: 5.49,  name: 'Standard' },
  'mv_plus_4999':    { price: 49.99, credits: 59.99, name: 'Plus' }
};

// RevenueCat 팩 ID ↔ 상품 ID 매핑
const PACK_TO_PRODUCT = {
  'starter':  'mv_starter_099',
  'standard': 'mv_standard_499',
  'plus':     'mv_plus_4999'
};

let isInitialized = false;

/**
 * RevenueCat 초기화 (앱 시작 시 1회)
 * @param {string} userId - Firebase UID
 */
export const initRevenueCat = async (userId) => {
  if (isInitialized) return;

  const platform = Capacitor.getPlatform();

  // 웹에서는 초기화 불가 (네이티브 전용)
  if (platform === 'web') {
    console.log('⚠️ RevenueCat: 웹 환경에서는 IAP 불가');
    return;
  }

  try {
    const apiKey = platform === 'ios' ? RC_API_KEY_APPLE : RC_API_KEY_GOOGLE;

    await Purchases.configure({
      apiKey,
      appUserID: userId  // Firebase UID로 식별
    });

    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    isInitialized = true;
    console.log('✅ RevenueCat 초기화 완료');
  } catch (error) {
    console.error('❌ RevenueCat 초기화 실패:', error);
  }
};

/**
 * 구매 가능한 상품 목록 가져오기
 * @returns {Array} offerings (패키지 목록)
 */
export const getOfferings = async () => {
  if (!isInitialized) return null;

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('❌ Offerings 조회 실패:', error);
    return null;
  }
};

/**
 * 인앱 구매 실행
 * @param {string} packId - 팩 ID ('starter' | 'standard' | 'plus')
 * @returns {{ success: boolean, productId?: string, credits?: number, error?: string }}
 */
export const purchasePack = async (packId) => {
  if (!isInitialized) {
    return { success: false, error: 'RevenueCat not initialized' };
  }

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      return { success: false, error: 'No offerings available' };
    }

    // Offering에서 해당 패키지 찾기
    const productId = PACK_TO_PRODUCT[packId];
    if (!productId) {
      return { success: false, error: `Unknown pack: ${packId}` };
    }

    // 모든 패키지에서 해당 상품 찾기
    const allPackages = current.availablePackages || [];
    const targetPackage = allPackages.find(
      pkg => pkg.product.identifier === productId
    );

    if (!targetPackage) {
      return { success: false, error: `Product not found: ${productId}` };
    }

    // 구매 실행 (OS 결제 시트 표시)
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: targetPackage });

    // 구매 성공 → 크레딧 정보 반환
    const creditInfo = PRODUCT_MAP[productId];
    return {
      success: true,
      productId,
      credits: creditInfo?.credits || 0,
      customerInfo
    };

  } catch (error) {
    // 유저가 취소한 경우
    if (error.code === '1' || error.userCancelled) {
      return { success: false, error: 'cancelled' };
    }
    console.error('❌ 구매 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 구매 복원 (앱 재설치 시)
 */
export const restorePurchases = async () => {
  if (!isInitialized) return null;

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('❌ 구매 복원 실패:', error);
    return null;
  }
};

/**
 * 웹 환경인지 체크 (IAP 불가)
 */
export const isNativeIAP = () => {
  return Capacitor.getPlatform() !== 'web';
};
