// revenueCat.js - RevenueCat 인앱결제 서비스 (v15: dynamic import 복원)
//
// 설치: npm install @revenuecat/purchases-capacitor
// 동적 import로 웹에서 안전 (네이티브 플랫폼에서만 SDK 로드)

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

let PurchasesModule = null;
let isInitialized = false;
// 🐛 DEBUG v15: 초기화 실패 원인 추적
let lastInitError = null;
let sdkLoadError = null;

/**
 * 동적으로 RevenueCat SDK 로드 (네이티브 플랫폼에서만)
 */
const loadSDK = async () => {
  if (PurchasesModule) return PurchasesModule;
  if (Capacitor.getPlatform() === 'web') return null;

  try {
    const mod = await import('@revenuecat/purchases-capacitor');
    PurchasesModule = mod;
    sdkLoadError = null;
    return mod;
  } catch (error) {
    sdkLoadError = `import failed: ${error.message || String(error)}`;
    console.error('❌ RevenueCat SDK 로드 실패:', error);
    return null;
  }
};

/**
 * RevenueCat 초기화 (앱 시작 시 1회)
 * @param {string} userId - Firebase UID
 */
export const initRevenueCat = async (userId) => {
  if (isInitialized) return;

  if (Capacitor.getPlatform() === 'web') {
    lastInitError = 'web platform (no native IAP)';
    return;
  }

  const sdk = await loadSDK();
  if (!sdk) {
    lastInitError = `loadSDK returned null (${sdkLoadError || 'unknown'})`;
    return;
  }

  const { Purchases, LOG_LEVEL } = sdk;
  const platform = Capacitor.getPlatform();

  try {
    const apiKey = platform === 'ios' ? RC_API_KEY_APPLE : RC_API_KEY_GOOGLE;

    if (!userId) {
      lastInitError = 'userId is empty/null';
      return;
    }
    if (!apiKey) {
      lastInitError = `apiKey empty for platform=${platform}`;
      return;
    }

    await Purchases.configure({
      apiKey,
      appUserID: userId
    });

    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    isInitialized = true;
    lastInitError = null;
    console.log('✅ RevenueCat 초기화 완료');
  } catch (error) {
    lastInitError = `configure failed: ${error.message || error.code || String(error)}`;
    console.error('❌ RevenueCat 초기화 실패:', error);
  }
};

/**
 * 구매 가능한 상품 목록 가져오기
 */
export const getOfferings = async () => {
  if (!isInitialized || !PurchasesModule) return null;
  const { Purchases } = PurchasesModule;

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
 */
export const purchasePack = async (packId) => {
  if (!isInitialized || !PurchasesModule) {
    return {
      success: false,
      error: 'RevenueCat not initialized',
      _debug: {
        isInit: isInitialized,
        hasModule: !!PurchasesModule,
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        initError: lastInitError || 'none',
        sdkError: sdkLoadError || 'none'
      }
    };
  }

  const { Purchases } = PurchasesModule;

  try {
    const offerings = await Purchases.getOfferings();
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

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: targetPackage });

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
  const { Purchases } = PurchasesModule;

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
