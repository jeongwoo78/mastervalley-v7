// api/deduct-credit.js - v80: 안전한 크레딧 차감 (멱등성 보장)
// Firestore transaction으로 이중 차감 완전 방지

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

    const { transformId, cost } = req.body;

    // 필수 파라미터 검증
    if (!transformId || !cost) {
      return res.status(400).json({ 
        error: 'Missing required fields: transformId, cost' 
      });
    }

    // 비용 범위 검증 (조작 방지)
    const validCosts = [0.10, 0.20, 0.25, 0.50, 1.50, 2.00];
    if (!validCosts.includes(Number(cost))) {
      return res.status(400).json({ error: 'Invalid cost amount' });
    }

    const userRef = db.collection('users').doc(userId);
    const txRef = db.collection('transactions').doc(transformId);

    // Firestore Transaction - 원자적 실행 (이중 차감 불가능)
    const result = await db.runTransaction(async (transaction) => {
      // 1. 멱등성 체크: 이 transformId로 이미 차감했는지
      const txDoc = await transaction.get(txRef);
      if (txDoc.exists) {
        return { 
          success: true, 
          alreadyCharged: true, 
          balance: null,
          message: 'Already processed' 
        };
      }

      // 2. 유저 잔액 확인
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const currentBalance = userDoc.data().credits || 0;
      
      // 3. 잔액 부족 체크
      if (currentBalance < cost) {
        throw new Error(`Insufficient balance: ${currentBalance} < ${cost}`);
      }

      // 4. 차감 실행 (원자적)
      const newBalance = Math.round((currentBalance - cost) * 100) / 100; // 부동소수점 방지
      transaction.update(userRef, { 
        credits: newBalance,
        lastTransaction: FieldValue.serverTimestamp()
      });

      // 5. 트랜잭션 기록 (멱등성 키)
      transaction.set(txRef, {
        userId,
        cost: Number(cost),
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        timestamp: FieldValue.serverTimestamp()
      });

      return {
        success: true,
        alreadyCharged: false,
        balance: newBalance
      };
    });

    console.log(`💰 크레딧 차감: ${userId} | $${cost} | transformId: ${transformId} | ${result.alreadyCharged ? '(중복 → 무시)' : '완료'}`);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Credit deduction error:', error);
    
    if (error.message?.includes('Insufficient balance')) {
      return res.status(402).json({ 
        success: false, 
        error: 'insufficient_balance',
        message: error.message 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
