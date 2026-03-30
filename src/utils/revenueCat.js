// revenueCat.js - RevenueCat 인앱결제 서비스
// 설치: npm install @revenuecat/purchases-capacitor
// 네이티브 빌드 전까지는 설치 불필요 (dynamic import로 웹에서 안전)

import { Capacitor } from '@capacitor/core';

// RevenueCat API Keys (RevenueCat Dashboard → API Keys)
const RC_API_KEY_APPLE = 'appl_nyWDTETegiwVbaPHOyJESyNcqWI';
const RC_API_KEY_GOOGLE = 'goog_LtCSYKubyIwclSHlSkiEiozHmEJ';

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
let PurchasesModule = null;

/**
 * RevenueCat SDK 동적 로드 (네이티브 환경에서만)
 */
const loadSDK = async () => {
  if (PurchasesModule) return PurchasesModule;
  if (Capacitor.getPlatform() === 'web') return null;

  try {
    const mod = await import('@revenuecat/purchases-capacitor');
    PurchasesModule = mod;
    return mod;
  } catch (e) {
    console.warn('⚠️ RevenueCat SDK 미설치 — npm install @revenuecat/purchases-capacitor');
    return null;
  }
};

/**
 * RevenueCat 초기화 (앱 시작 시 1회)
 * @param {string} userId - Firebase UID
 */
export const initRevenueCat = async (userId) => {
  if (isInitialized) return;

  const sdk = await loadSDK();
  if (!sdk) return;

  const platform = Capacitor.getPlatform();

  try {
    const apiKey = platform === 'ios' ? RC_API_KEY_APPLE : RC_API_KEY_GOOGLE;

    await sdk.Purchases.configure({
      apiKey,
      appUserID: userId
    });

    await sdk.Purchases.setLogLevel({ level: sdk.LOG_LEVEL.DEBUG });
    isInitialized = true;
    console.log('✅ RevenueCat 초기화 완료');
  } catch (error) {
    console.error('❌ RevenueCat 초기화 실패:', error);
  }
};

/**
 * 구매 가능한 상품 목록 가져오기
 */
export const getOfferings = async () => {
  if (!isInitialized || !PurchasesModule) return null;

  try {
    const offerings = await PurchasesModule.Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('❌ Offerings 조회 실패:', error);
    return null;
  }
};

/**
 * 인앱 구매 실행
 * @param {string} packId - 팩 ID ('starter' | 'standard' | 'plus')
 */
export const purchasePack = async (packId) => {
  if (!isInitialized || !PurchasesModule) {
    return { success: false, error: 'RevenueCat not initialized' };
  }

  try {
    const offerings = await PurchasesModule.Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      return { success: false, error: 'No offerings available' };
    }

    const productId = PACK_TO_PRODUCT[packId];
    if (!productId) {
      return { success: false, error: `Unknown pack: ${packId}` };
    }

    const allPackages = current.availablePackages || [];
    const targetPackage = allPackages.find(
      pkg => pkg.product.identifier === productId
    );

    if (!targetPackage) {
      return { success: false, error: `Product not found: ${productId}` };
    }

    const { customerInfo } = await PurchasesModule.Purchases.purchasePackage({ aPackage: targetPackage });

    const creditInfo = PRODUCT_MAP[productId];
    return {
      success: true,
      productId,
      credits: creditInfo?.credits || 0,
      customerInfo
    };

  } catch (error) {
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
  if (!isInitialized || !PurchasesModule) return null;

  try {
    const { customerInfo } = await PurchasesModule.Purchases.restorePurchases();
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
