// api/add-credit.js - v95 (2026-04): RevenueCat 서버 영수증 검증
//
// 변경 핵심:
// - 이전: 클라이언트가 productId + transactionId 보내면 그대로 크레딧 추가 (검증 X)
// - 이후: productId만 받고, 서버가 RevenueCat REST API로 실제 구매 검증 후 처리
//
// 멱등성: purchases/{store_transaction_id} 문서로 중복 충전 원천 차단
//   store_transaction_id는 Apple/Google이 발급하는 구매별 고유 ID
//
// 어뷰징 방어: 최근 24시간 이내 구매 + 아직 미처리된 것만 지급
//
// 필요 환경변수:
//   REVENUECAT_SECRET_KEY (sk_xxx... 형식, RevenueCat Dashboard에서 발급)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

// 상품 ID → 크레딧 (src/utils/revenueCat.js PRODUCT_MAP과 동기화 필수)
const PRODUCT_CREDITS = {
  'mv_starter_099':  0.99,
  'mv_standard_499': 5.49,
  'mv_plus_4999':    59.99
};

// 구매 인정 창 (24시간)
const PURCHASE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * RevenueCat REST API v1: 사용자 구매 내역 조회
 */
async function fetchSubscriber(userId) {
  const secretKey = process.env.REVENUECAT_SECRET_KEY;
  if (!secretKey) throw new Error('REVENUECAT_SECRET_KEY not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`RevenueCat API ${response.status}: ${errText.slice(0, 200)}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * v98: 모든 미처리 구매 조회 (중복 구매 전수 지급용)
 * @returns {{found: boolean, purchases: Array, reason?: string}}
 *   purchases는 최신순 정렬된 미처리 구매 배열
 */
async function findAllUnclaimedPurchases(userId, productId) {
  const data = await fetchSubscriber(userId);
  const purchases = data.subscriber?.non_subscriptions?.[productId] || [];

  if (purchases.length === 0) {
    return { found: false, purchases: [], reason: 'no_purchase' };
  }

  // 최근 24시간 이내 구매만 후보
  const cutoffMs = Date.now() - PURCHASE_WINDOW_MS;
  const recent = purchases.filter(p => {
    const ms = new Date(p.purchase_date).getTime();
    return ms >= cutoffMs;
  });

  if (recent.length === 0) {
    return { found: false, purchases: [], reason: 'no_recent_purchase' };
  }

  // 최신순 정렬
  recent.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));

  // 모든 미처리 구매 수집 (Firestore에 기록 안 된 것들)
  const unclaimed = [];
  for (const purchase of recent) {
    const txId = purchase.store_transaction_id;
    if (!txId) continue;  // 샌드박스 등 ID 없는 케이스 스킵

    const doc = await db.collection('purchases').doc(txId).get();
    if (!doc.exists) {
      unclaimed.push(purchase);
    }
  }

  if (unclaimed.length === 0) {
    return { found: false, purchases: [], reason: 'all_already_claimed' };
  }

  return { found: true, purchases: unclaimed };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Firebase Auth
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: missing auth token' });
    }

    let userId;
    try {
      const decoded = await getAuth().verifyIdToken(authHeader.split('Bearer ')[1]);
      userId = decoded.uid;
    } catch {
      return res.status(401).json({ error: 'Unauthorized: invalid auth token' });
    }

    // 2. 입력 검증
    const { productId } = req.body || {};
    if (!productId) {
      return res.status(400).json({ error: 'Missing productId' });
    }
    const creditsToAdd = PRODUCT_CREDITS[productId];
    if (!creditsToAdd) {
      return res.status(400).json({ error: `Invalid product: ${productId}` });
    }

    // 3. RevenueCat 영수증 검증 (v98: 다건 지원)
    let verified;
    try {
      verified = await findAllUnclaimedPurchases(userId, productId);
    } catch (rcErr) {
      console.error(`❌ RevenueCat API error: ${rcErr.message}`);
      return res.status(503).json({
        success: false,
        error: 'revenuecat_unavailable',
        message: 'Verification service temporarily unavailable. Please try again.'
      });
    }

    if (!verified.found) {
      console.warn(`⚠️ 영수증 검증 실패: ${userId} | ${productId} | ${verified.reason}`);
      return res.status(402).json({
        success: false,
        error: 'purchase_not_verified',
        reason: verified.reason  // 클라이언트 retry 판단용
      });
    }

    // 4. v98: 미처리 구매 전부 순차 지급 (각자 멱등성 보장)
    //    동시 요청 중에도 Firestore 트랜잭션이 중복 차단 → 안전
    const unclaimedPurchases = verified.purchases;
    const userRef = db.collection('users').doc(userId);
    
    let totalCreditsAdded = 0;
    let processedCount = 0;
    let alreadyProcessedCount = 0;
    let finalBalance = 0;
    const processedTxIds = [];

    for (const purchase of unclaimedPurchases) {
      const storeTxId = purchase.store_transaction_id;
      const purchaseRef = db.collection('purchases').doc(storeTxId);

      try {
        const txResult = await db.runTransaction(async (transaction) => {
          // 멱등성: 동시 요청 race 방어 (findAll이 걸렀지만 이중 보장)
          const pDoc = await transaction.get(purchaseRef);
          if (pDoc.exists) {
            return { alreadyProcessed: true };
          }

          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) throw new Error('User document not found');

          const currentBalance = userDoc.data().credits || 0;
          const newBalance = Math.round((currentBalance + creditsToAdd) * 100) / 100;

          transaction.update(userRef, {
            credits: newBalance,
            lastPurchase: FieldValue.serverTimestamp()
          });

          transaction.set(purchaseRef, {
            userId,
            productId,
            creditsAdded: creditsToAdd,
            balanceBefore: currentBalance,
            balanceAfter: newBalance,
            storeTransactionId: storeTxId,
            store: purchase.store || 'unknown',
            isSandbox: !!purchase.is_sandbox,
            purchaseDate: purchase.purchase_date,
            source: 'rest',
            status: 'completed',
            timestamp: FieldValue.serverTimestamp()
          });

          return { alreadyProcessed: false, balance: newBalance };
        });

        if (txResult.alreadyProcessed) {
          alreadyProcessedCount++;
        } else {
          totalCreditsAdded += creditsToAdd;
          processedCount++;
          finalBalance = txResult.balance;
          processedTxIds.push(storeTxId);
        }
      } catch (txErr) {
        // 개별 트랜잭션 실패 — 로그만 남기고 다음 건 계속 처리
        console.error(`⚠️ 트랜잭션 실패 (storeTxId: ${storeTxId}): ${txErr.message}`);
        // continue to next purchase
      }
    }

    // 잔액 조회 (새로 처리된 게 없으면 현재 잔액 반환)
    if (processedCount === 0) {
      const userDoc = await userRef.get();
      finalBalance = userDoc.exists ? (userDoc.data().credits || 0) : 0;
    }

    console.log(`💰 크레딧 지급 완료: ${userId} | 신규 ${processedCount}건(+$${totalCreditsAdded.toFixed(2)}) | 중복 ${alreadyProcessedCount}건 | 잔액 $${finalBalance} | txIds: ${processedTxIds.join(',') || 'none'}`);
    
    return res.status(200).json({
      success: true,
      alreadyProcessed: processedCount === 0 && alreadyProcessedCount > 0,
      creditsAdded: totalCreditsAdded,
      processedCount,
      alreadyProcessedCount,
      balance: finalBalance
    });

  } catch (error) {
    console.error('Add credit error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
