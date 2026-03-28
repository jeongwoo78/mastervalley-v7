// Firebase 설정 - Master Valley
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

// 로그인 제공자
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// 신규 유저 초기 크레딧 (폐쇄 테스트: $10.00, 프로덕션: $0.30)
const INITIAL_FREE_CREDITS = 10.00;

// 유저 문서 초기화 (첫 로그인 시 credits 필드 생성)
const ensureUserDoc = async (userId, email) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email: email || '',
      credits: INITIAL_FREE_CREDITS,
      createdAt: new Date().toISOString()
    });
  }
};

export { auth, db, googleProvider, appleProvider, doc, onSnapshot, updateDoc, ensureUserDoc, collection, query, where, getDocs, getDoc, orderBy, Timestamp };
export default app;
