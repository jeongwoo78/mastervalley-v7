// Firebase 설정 - Master Valley
// v85: iOS Capacitor gapi CORS 에러 해결
// 네이티브 → initializeAuth + indexedDBLocalPersistence (gapi 우회)
// 웹 → 기존 getAuth (gapi.iframes 정상 작동)
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

// Firebase 설정값 (Firebase Console에서 가져옴)
const firebaseConfig = {
  apiKey: "AIzaSyAHS1Cc22GBv7lQsdiYFU9sSwrUpqs-O9o",
  authDomain: "master-valley.firebaseapp.com",
  projectId: "master-valley",
  storageBucket: "master-valley.firebasestorage.app",
  messagingSenderId: "539777702177",
  appId: "1:539777702177:web:eca68b08d00f3d97dc866d",
  measurementId: "G-DZ6N09NZ25"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// v85: 네이티브(iOS/Android) → gapi 로드 우회
let auth;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);

// 로그인 제공자
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// 유저 문서 초기화 (첫 로그인 시 credits 필드 생성)
// - 서버 위임: provisionUser Cloud Function이 deleted_users 해시 체크 + 무료 크레딧 결정
// - 어뷰징 방지: 삭제된 계정으로 재가입 시 INITIAL_FREE_CREDITS 미지급
const PROVISION_USER_URL = 'https://us-central1-master-valley.cloudfunctions.net/provisionUser';

const ensureUserDoc = async (userId, email) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) return; // 이미 있으면 스킵 (네트워크 호출 절약)
  
  // 신규 — 서버에 위임
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(PROVISION_USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ email: email || '' })
    });
    
    if (!response.ok) {
      console.error('[ensureUserDoc] provisionUser 실패:', response.status);
      // fallback: 기존 방식으로 문서 생성 (어뷰징 가능하지만 사용성 우선)
      await setDoc(userRef, {
        email: email || '',
        credits: 0.30,
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('[ensureUserDoc] 네트워크 에러:', err);
    // fallback: 기존 방식
    await setDoc(userRef, {
      email: email || '',
      credits: 0.30,
      createdAt: new Date().toISOString()
    });
  }
};

export { auth, db, googleProvider, appleProvider, doc, onSnapshot, updateDoc, ensureUserDoc, collection, query, where, getDocs, getDoc, orderBy, Timestamp };
export default app;
