// Master Valley - FCM Push Notifications
// Capacitor Push Notifications 플러그인으로 FCM 토큰 관리
//
// 사용법:
//   import { initFCM, getFCMToken } from './fcm';
//   await initFCM();  // 앱 시작 시 1회
//   const token = getFCMToken();  // 변환 요청 시 토큰 전달

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { db, auth } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

let fcmToken = null;
let onNotificationTapCallback = null;

/**
 * 알림 탭 시 콜백 등록 (App.jsx에서 호출)
 */
export function onNotificationTap(callback) {
  onNotificationTapCallback = callback;
}

/**
 * FCM 초기화 + 토큰 등록
 * 앱 시작 시 1회 호출
 */
export async function initFCM() {
  // 웹 브라우저에서는 FCM 미지원 (네이티브 앱 전용)
  if (!Capacitor.isNativePlatform()) {
    console.log('📱 FCM: 웹 환경 - 푸시 알림 미지원');
    return;
  }

  try {
    // 권한 요청
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive !== 'granted') {
      console.log('📱 FCM: 푸시 알림 권한 거부됨');
      return;
    }

    // 푸시 알림 등록
    await PushNotifications.register();

    // 토큰 수신 리스너
    PushNotifications.addListener('registration', async (token) => {
      fcmToken = token.value;
      console.log('📱 FCM 토큰 등록:', fcmToken.substring(0, 20) + '...');
      
      // Firestore에 토큰 저장 (유저가 로그인된 경우)
      await saveFCMToken(fcmToken);
    });

    // 등록 에러 리스너
    PushNotifications.addListener('registrationError', (error) => {
      console.error('📱 FCM 등록 에러:', error);
    });

    // 푸시 알림 수신 리스너 (앱이 포그라운드일 때)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📱 푸시 수신 (포그라운드):', notification);
      // 포그라운드에서는 Firestore 리스닝이 처리하므로 별도 동작 불필요
    });

    // 푸시 알림 탭 리스너 (알림을 눌러서 앱 열었을 때)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('📱 푸시 탭:', action);
      const data = action.notification.data;
      
      // v83: 단일 변환 + 원클릭 완료 알림 모두 처리
      if ((data?.type === 'transform_complete' || data?.type === 'oneclick_complete') && (data?.transformId || data?.sessionId)) {
        console.log('📱 변환 완료 알림 탭 →', data.type, data.transformId || data.sessionId);
        if (onNotificationTapCallback) onNotificationTapCallback(data);
      }
    });

  } catch (error) {
    console.error('📱 FCM 초기화 에러:', error);
  }
}

/**
 * FCM 토큰을 Firestore users 문서에 저장
 */
async function saveFCMToken(token) {
  try {
    const user = auth.currentUser;
    if (!user || !token) return;
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { fcmToken: token });
    console.log('📱 FCM 토큰 Firestore 저장 완료');
  } catch (error) {
    console.error('📱 FCM 토큰 저장 에러:', error);
  }
}

/**
 * 현재 FCM 토큰 반환
 * 변환 요청 시 Cloud Functions에 전달용
 */
export function getFCMToken() {
  return fcmToken;
}
