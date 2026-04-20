// AddFundsScreen.jsx - Add Funds Screen (RevenueCat IAP 연동)
// v95 (2026-04): 서버 영수증 검증 연동 — transactionId 제거, RC 반영 대기 retry 추가
import React, { useState } from 'react';
import { getUi } from '../i18n';
import { purchasePack, isNativeIAP } from '../utils/revenueCat';
import { auth } from '../config/firebase';

const API_BASE_URL = 'https://mastervalley-v7.vercel.app';

const AddFundsScreen = ({ onBack, userCredits = 0, userId, onPurchaseComplete, lang = 'en' }) => {
  const [purchasing, setPurchasing] = useState(null);  // 구매 중인 팩 ID

  const t = getUi(lang).addFunds;

  const packs = [
    { id: 'starter', name: 'Starter', price: 0.99, value: 0.99, bonus: null, bonusAmount: null, productId: 'mv_starter_099', tagline: t.tagStarter },
    { id: 'standard', name: 'Standard', price: 4.99, value: 5.49, bonus: '+10%', bonusAmount: 0.50, productId: 'mv_standard_499', tagline: t.tagStandard },
    { id: 'plus', name: 'Plus', price: 49.99, value: 59.99, bonus: '+20%', bonusAmount: 10.00, productId: 'mv_plus_4999', tagline: t.tagPlus, featured: true }
  ];

  const handlePurchase = async (pack) => {
    if (purchasing) return;  // 이중 탭 방지

    // 웹 환경: IAP 불가
    if (!isNativeIAP()) {
      alert(lang === 'ko'
        ? '인앱결제는 앱에서만 가능합니다.'
        : 'In-app purchases are only available in the app.');
      return;
    }

    setPurchasing(pack.id);

    try {
      // 1. OS 결제 시트 (RevenueCat)
      const result = await purchasePack(pack.id);

      if (!result.success) {
        if (result.error !== 'cancelled') {
          alert(lang === 'ko'
            ? '구매 처리 중 오류가 발생했습니다.'
            : 'An error occurred during purchase.');
        }
        return;
      }

      // 2. 서버 크레딧 추가 요청 (RC 반영 지연 대비 retry 루프)
      //    v95: productId만 전송 — 서버가 RC REST API로 직접 검증
      const authToken = await auth.currentUser?.getIdToken().catch(() => null);

      let addData = null;
      let lastError = null;
      const retryDelays = [0, 2000, 4000, 6000]; // 0s, 2s, 4s, 6s → 최대 ~12초

      for (let attempt = 0; attempt < retryDelays.length; attempt++) {
        if (retryDelays[attempt] > 0) {
          await new Promise(r => setTimeout(r, retryDelays[attempt]));
        }

        try {
          const addResult = await fetch(`${API_BASE_URL}/api/add-credit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken && { 'Authorization': `Bearer ${authToken}` })
            },
            body: JSON.stringify({ productId: pack.productId })
          });

          addData = await addResult.json();
          lastError = null;

          if (addData.success) break;

          // RevenueCat 반영 대기 중 → retry
          if (addData.reason === 'no_purchase' || addData.reason === 'no_recent_purchase') {
            console.log(`⏳ RC 반영 대기 (${attempt + 1}/${retryDelays.length}): ${addData.reason}`);
            continue;
          }

          // 그 외 에러(인증/검증 실패 등)는 즉시 중단
          break;

        } catch (fetchErr) {
          lastError = fetchErr;
          console.warn(`⚠️ add-credit 네트워크 에러 (${attempt + 1}/${retryDelays.length}):`, fetchErr.message);
          continue;  // 네트워크 에러도 retry
        }
      }

      // 3. 결과 처리
      if (addData?.success) {
        // 잔액은 Firestore onSnapshot이 자동 반영
        onPurchaseComplete?.();
      } else {
        console.error('크레딧 추가 실패:', addData?.error || lastError?.message);

        // 결제는 됐는데 크레딧 미반영 — 정확히 안내
        // (2단계 Webhook 배포되면 자동 복구됨)
        alert(lang === 'ko'
          ? '결제는 완료되었습니다. 크레딧 반영에 시간이 걸릴 수 있으니, 잠시 후 앱을 다시 실행해 주세요. 계속 문제가 있으면 고객지원에 문의해 주세요.'
          : 'Payment completed. Credits may take a moment to appear. Please restart the app shortly. If the issue persists, contact support.');
      }

    } catch (error) {
      console.error('Purchase error:', error);
      alert(lang === 'ko' ? '결제 처리 중 오류가 발생했습니다.' : 'An error occurred during purchase.');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="funds-screen">
      {/* Header */}
      <header className="funds-header">
        <button className="back-btn" onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <span className="header-title">{t.title}</span>
        <span className="header-spacer"></span>
      </header>

      {/* Balance Section */}
      <div className="balance-section">
        <div className="balance-label">{t.balance}</div>
        <div className="balance-amount">${userCredits.toFixed(2)}</div>
      </div>

      {/* Packs Section */}
      <div className="packs-section">
        {packs.map(pack => (
          <div
            key={pack.id}
            className={`pack-item ${pack.featured ? 'featured' : ''}`}
          >
            <div className="pack-info">
              <div className="pack-header">
                <span className="pack-name">{pack.name}</span>
                {pack.bonus && (
                  <span className="bonus">{pack.bonus}</span>
                )}
              </div>
              <div className="pack-desc">
                {t.get} <span className="get-amount">${pack.value.toFixed(2)}</span>
                {pack.bonusAmount && (
                  <span className="bonus-text"> (+${pack.bonusAmount.toFixed(2)} {t.bonusLabel})</span>
                )}
                <span className="tagline">{pack.tagline}</span>
              </div>
            </div>
            <button
              className="pack-price-btn"
              onClick={() => handlePurchase(pack)}
              disabled={!!purchasing}
              style={purchasing === pack.id ? { opacity: 0.6 } : {}}
            >
              {purchasing === pack.id ? '...' : `$${pack.price.toFixed(2)}`}
            </button>
          </div>
        ))}
      </div>

      {/* Info Text */}
      <div className="info-text">
        <p>{t.info1}</p>
        <p>{t.info2}</p>
      </div>

      <style>{`
        .funds-screen {
          min-height: calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 12px);
          min-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 12px);
          background: #0a1a1f;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Header */
        .funds-header {
          display: flex;
          align-items: center;
          padding: 14px 20px;
        }

        .back-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 4px 8px;
          display: flex;
          align-items: center;
        }

        .header-title {
          flex: 1;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          text-align: center;
        }

        .header-spacer {
          width: 40px;
        }

        /* Balance Section */
        .balance-section {
          text-align: center;
          padding: 48px 20px 28px;
        }

        .balance-label {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 40px;
          font-weight: 700;
          color: #fff;
        }

        /* Packs Section */
        .packs-section {
          flex: 1;
          padding: 0 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .pack-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          background: #1a2a2f;
          border-radius: 14px;
        }

        .pack-item.featured {
          border: 1.5px solid #3a7a7a;
          background: #1a2a2f;
        }

        .pack-info {
          flex: 1;
        }

        .pack-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .pack-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .bonus {
          padding: 2px 8px;
          background: #22c55e;
          border-radius: 10px;
          font-size: 12px;
          color: #fff;
          font-weight: 600;
        }

        .pack-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .get-amount {
          color: #fff;
          font-weight: 700;
          font-size: 15px;
        }

        .bonus-text {
          color: #fff;
          font-weight: 500;
        }

        .tagline {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          font-style: italic;
        }

        .pack-price-btn {
          padding: 12px 18px;
          background: #3a7a7a;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          min-width: 72px;
          text-align: center;
          margin-inline-start: 16px;
          transition: all 0.2s;
        }

        .pack-price-btn:hover {
          background: #6d28d9;
          transform: scale(1.02);
        }

        /* Info Text */
        .info-text {
          padding: 16px 20px 24px;
          text-align: center;
        }

        .info-text p {
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .balance-amount {
            font-size: 34px;
          }

          .pack-price-btn {
            padding: 10px 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddFundsScreen;
