// api/add-credit.js - 인앱결제 후 크레딧 추가
// RevenueCat 구매 성공 → 클라이언트가 호출 → Firestore 크레딧 추가
// 이중 충전 방지: transactionId 기반 멱등성

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Firebase Admin 초기화
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

// 상품 ID → 크레딧 매핑 (revenueCat.js의 PRODUCT_MAP과 동기화)
const PRODUCT_CREDITS = {
  'mv_starter_099':  0.99,
  'mv_standard_499': 5.49,
  'mv_plus_4999':    59.99
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // A-2: Firebase Auth 토큰 검증
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: missing auth token' });
    }
    let userId;
    try {
      const decodedToken = await getAuth().verifyIdToken(authHeader.split('Bearer ')[1]);
      userId = decodedToken.uid;
    } catch (authErr) {
      return res.status(401).json({ error: 'Unauthorized: invalid auth token' });
    }

    const { productId, transactionId } = req.body;

    // 필수 파라미터 검증
    if (!productId || !transactionId) {
      return res.status(400).json({
        error: 'Missing required fields: productId, transactionId'
      });
    }

    // 상품 ID 검증
    const creditsToAdd = PRODUCT_CREDITS[productId];
    if (!creditsToAdd) {
      return res.status(400).json({ error: `Invalid product: ${productId}` });
    }

    const userRef = db.collection('users').doc(userId);
    const purchaseRef = db.collection('purchases').doc(transactionId);

    // Firestore Transaction — 이중 충전 방지
    const result = await db.runTransaction(async (transaction) => {
      // 1. 멱등성 체크: 이 transactionId로 이미 충전했는지
      const purchaseDoc = await transaction.get(purchaseRef);
      if (purchaseDoc.exists) {
        return {
          success: true,
          alreadyProcessed: true,
          message: 'Already processed'
        };
      }

      // 2. 유저 문서 확인
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const currentBalance = userDoc.data().credits || 0;
      const newBalance = Math.round((currentBalance + creditsToAdd) * 100) / 100;

      // 3. 크레딧 추가
      transaction.update(userRef, {
        credits: newBalance,
        lastPurchase: FieldValue.serverTimestamp()
      });

      // 4. 구매 기록 저장 (멱등성 키)
      transaction.set(purchaseRef, {
        userId,
        productId,
        creditsAdded: creditsToAdd,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        timestamp: FieldValue.serverTimestamp()
      });

      return {
        success: true,
        alreadyProcessed: false,
        creditsAdded: creditsToAdd,
        balance: newBalance
      };
    });

    console.log(`💰 크레딧 추가: ${userId} | +$${creditsToAdd} (${productId}) | tx: ${transactionId} | ${result.alreadyProcessed ? '(중복 → 무시)' : '완료'}`);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Add credit error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
