// api/revenuecat-webhook.js - v96 (2026-04): RevenueCat Webhook 수신
//
// 목적:
// 1. NON_RENEWING_PURCHASE — REST 경로(add-credit.js) 실패 시 복구 fallback
// 2. CANCELLATION — 환불 자동 감지 및 크레딧 회수 (전액, 마이너스 허용)
//
// 보안: Authorization header 검증 (REVENUECAT_WEBHOOK_SECRET)
// 멱등성: webhook_events/{event_id} + purchases/{store_transaction_id}
// RC 특성: at-least-once delivery → 중복 이벤트 방어 필수
// 응답: RC는 60초 내 응답 필요. 실패 시 최대 5회 재시도.
//
// 필요 환경변수:
//   REVENUECAT_WEBHOOK_SECRET (Authorization header와 비교할 비밀 토큰)
//
// 관련 문서:
//   https://www.revenuecat.com/docs/integrations/webhooks
//   https://www.revenuecat.com/docs/event-types-and-fields

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = getFirestore();

// 상품 ID → 크레딧 (api/add-credit.js PRODUCT_CREDITS와 동기화 필수)
const PRODUCT_CREDITS = {
  'mv_starter_099':  0.99,
  'mv_standard_499': 5.49,
  'mv_plus_4999':    59.99
};

export default async function handler(req, res) {
  // GET 등은 405 (CORS preflight는 RC 웹훅에 불필요)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authorization 검증
  const expectedAuth = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!expectedAuth) {
    console.error('❌ REVENUECAT_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader !== expectedAuth) {
    console.warn(`🚨 Webhook auth 실패: header=${authHeader.slice(0, 20)}...`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. 페이로드 파싱
  const { event } = req.body || {};
  if (!event || !event.type || !event.id) {
    console.warn('⚠️ Invalid webhook payload');
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const eventId = event.id;
  const eventType = event.type;

  console.log(`📨 Webhook: ${eventType} | eventId: ${eventId} | user: ${event.app_user_id || 'N/A'}`);

  try {
    // 3. 이벤트 멱등성 (at-least-once delivery 방어)
    const eventRef = db.collection('webhook_events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
      console.log(`⏭️ 중복 이벤트 스킵: ${eventId}`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // 4. 이벤트별 처리
    let result;
    switch (eventType) {
      case 'NON_RENEWING_PURCHASE':
      case 'INITIAL_PURCHASE':  // 안전하게 둘 다 처리 (정우님 상품은 NON_RENEWING)
        result = await handlePurchase(event);
        break;

      case 'CANCELLATION':
        result = await handleCancellation(event);
        break;

      case 'TEST':
        console.log('🧪 Test webhook received');
        result = { action: 'test_acknowledged' };
        break;

      default:
        // RENEWAL, EXPIRATION, PRODUCT_CHANGE 등은 소모성 IAP와 무관
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
        result = { action: 'ignored' };
    }

    // 5. 이벤트 멱등성 기록
    await eventRef.set({
      eventType,
      processedAt: FieldValue.serverTimestamp(),
      storeTxId: event.store_transaction_id || null,
      result: result.action || 'unknown'
    });

    return res.status(200).json({ received: true, ...result });

  } catch (err) {
    console.error(`❌ Webhook 처리 에러 (${eventType}):`, err);
    // 500 반환 시 RC가 최대 5회 재시도 → 멱등성 보장되므로 안전
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 구매 이벤트 처리 (REST 실패 fallback)
 * 이미 REST 경로로 처리됐으면 스킵, 없으면 크레딧 지급
 */
async function handlePurchase(event) {
  const {
    app_user_id: userId,
    product_id: productId,
    store_transaction_id: storeTxId,
    purchased_at_ms,
    environment,
    store
  } = event;

  if (!userId || !productId || !storeTxId) {
    console.warn(`⚠️ Invalid purchase data: user=${userId}, product=${productId}, tx=${storeTxId}`);
    return { action: 'invalid_purchase_data' };
  }

  const creditsToAdd = PRODUCT_CREDITS[productId];
  if (!creditsToAdd) {
    console.warn(`⚠️ Unknown product: ${productId}`);
    return { action: 'unknown_product', productId };
  }

  const userRef = db.collection('users').doc(userId);
  const purchaseRef = db.collection('purchases').doc(storeTxId);

  return await db.runTransaction(async (t) => {
    // 이미 처리됐으면 스킵 (REST 경로가 먼저 처리한 경우)
    const pDoc = await t.get(purchaseRef);
    if (pDoc.exists) {
      console.log(`⏭️ 이미 처리됨 (source: ${pDoc.data().source}): ${storeTxId}`);
      return { action: 'already_processed', source: pDoc.data().source };
    }

    const userDoc = await t.get(userRef);
    if (!userDoc.exists) {
      console.warn(`⚠️ User not found: ${userId}`);
      return { action: 'user_not_found' };
    }

    const currentBalance = userDoc.data().credits || 0;
    const newBalance = Math.round((currentBalance + creditsToAdd) * 100) / 100;

    t.update(userRef, {
      credits: newBalance,
      lastPurchase: FieldValue.serverTimestamp()
    });

    t.set(purchaseRef, {
      userId,
      productId,
      creditsAdded: creditsToAdd,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      storeTransactionId: storeTxId,
      // RC는 store를 'APP_STORE' 등 대문자로 보냄 → 소문자 정규화
      store: (store || '').toLowerCase().replace('_', '_') || 'unknown',
      isSandbox: environment === 'SANDBOX',
      purchaseDate: purchased_at_ms ? new Date(purchased_at_ms).toISOString() : null,
      source: 'webhook',  // REST와 구분
      status: 'completed',
      timestamp: FieldValue.serverTimestamp()
    });

    console.log(`💰 Webhook 크레딧 추가 (REST fallback): ${userId} | +$${creditsToAdd} | ${storeTxId}`);
    return { action: 'credited', creditsAdded: creditsToAdd, balance: newBalance };
  });
}

/**
 * 환불 이벤트 처리 (전액 회수, 마이너스 허용)
 *
 * 정책 (A안):
 *  - 지급된 크레딧 전액 차감
 *  - 마이너스 잔액 허용 → 다음 결제 시 자동 복구
 *  - UI는 App.jsx에서 displayCredits = Math.max(0, userCredits)로 $0.00 표시
 *  - 어뷰저 방어: 결제-소진-환불 패턴 시 마이너스로 서비스 차단
 */
async function handleCancellation(event) {
  const {
    app_user_id: userId,
    store_transaction_id: storeTxId,
    cancel_reason
  } = event;

  if (!userId || !storeTxId) {
    console.warn(`⚠️ Invalid cancellation data: user=${userId}, tx=${storeTxId}`);
    return { action: 'invalid_cancellation_data' };
  }

  const userRef = db.collection('users').doc(userId);
  const purchaseRef = db.collection('purchases').doc(storeTxId);

  return await db.runTransaction(async (t) => {
    const pDoc = await t.get(purchaseRef);
    if (!pDoc.exists) {
      // 웹훅이 REST보다 먼저 도착한 이상한 케이스 (이론상 가능하지만 드묾)
      // 또는 구매 기록이 시스템 외부에서 발생한 경우
      console.warn(`⚠️ 환불 대상 구매 기록 없음: ${storeTxId}`);
      return { action: 'purchase_not_found' };
    }

    const pData = pDoc.data();
    if (pData.status === 'refunded') {
      console.log(`⏭️ 이미 환불 처리됨: ${storeTxId}`);
      return { action: 'already_refunded' };
    }

    const creditsToDeduct = pData.creditsAdded || 0;
    const userDoc = await t.get(userRef);
    const currentBalance = userDoc.exists ? (userDoc.data().credits || 0) : 0;
    const newBalance = Math.round((currentBalance - creditsToDeduct) * 100) / 100;
    // ⚠️ A안 정책: 마이너스 허용 (newBalance < 0 가능)

    // users 업데이트
    if (userDoc.exists) {
      t.update(userRef, {
        credits: newBalance,
        refundCount: FieldValue.increment(1),
        refundedTotal: FieldValue.increment(creditsToDeduct),
        lastTransaction: FieldValue.serverTimestamp()
      });
    }

    // purchases 문서 업데이트
    t.update(purchaseRef, {
      status: 'refunded',
      refundedAt: FieldValue.serverTimestamp(),
      refundReason: cancel_reason || 'UNKNOWN',
      refundBalanceBefore: currentBalance,
      refundBalanceAfter: newBalance
    });

    console.log(`🔙 환불 회수: ${userId} | -$${creditsToDeduct} | reason: ${cancel_reason} | 새 잔액: $${newBalance}${newBalance < 0 ? ' (마이너스)' : ''}`);
    return {
      action: 'refunded',
      creditsDeducted: creditsToDeduct,
      balance: newBalance,
      isNegative: newBalance < 0
    };
  });
}
