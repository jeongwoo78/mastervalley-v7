// ========================================
// revenueCatStub.js - Web/Dev 환경용 스텁
// v81 - 2026-03-16
// ========================================
// Capacitor 네이티브 패키지를 웹에서 import할 때 에러 방지
// 실제 결제는 네이티브 빌드에서만 동작

export const Purchases = {
  configure: () => console.warn('[RevenueCat] Stub: configure (web)'),
  getOfferings: () => Promise.resolve({ current: null }),
  purchasePackage: () => Promise.reject(new Error('IAP not available on web')),
  restorePurchases: () => Promise.resolve({ customerInfo: null }),
  getCustomerInfo: () => Promise.resolve({ customerInfo: null }),
};

export default { Purchases };
