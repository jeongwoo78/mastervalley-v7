// Master Valley - FCM Push Notifications
// Capacitor Push Notifications 플러그인으로 FCM 토큰 관리

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { db, auth } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

let fcmToken = null;
let onNotificationTapCallback = null;
let pendingNotification = null;  // 콜백 등록 전 도착한 알림 탭 저장

export function onNotificationTap(callback) {
  onNotificationTapCallback = callback;
  // 콜백 등록 전에 탭된 알림이 있으면 즉시 실행
  if (pendingNotification) {
    callback(pendingNotification);
    pendingNotification = null;
  }
}

export function hasPendingNotification() {
  return pendingNotification !== null;
}

export async function initFCM() {
  if (!Capacitor.isNativePlatform()) {
    console.log('📱 FCM: 웹 환경 - 푸시 알림 미지원');
    return;
  }

  try {
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive !== 'granted') {
      console.log('📱 FCM: 푸시 알림 권한 거부됨');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      fcmToken = token.value;
      console.log('📱 FCM 토큰 등록:', fcmToken.substring(0, 20) + '...');
      await saveFCMToken(fcmToken);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('📱 FCM 등록 에러:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📱 푸시 수신 (포그라운드):', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('📱 푸시 탭:', action);
      const data = action.notification.data;
      
      // 단일 + 원클릭 완료 알림 모두 처리
      if ((data?.type === 'transform_complete' || data?.type === 'oneclick_complete') && (data?.transformId || data?.sessionId)) {
        console.log('📱 변환 완료 알림 탭 →', data.type, data.transformId || data.sessionId);
        if (onNotificationTapCallback) {
          onNotificationTapCallback(data);
        } else {
          pendingNotification = data;  // 콜백 등록 전이면 저장
        }
      }
    });

  } catch (error) {
    console.error('📱 FCM 초기화 에러:', error);
  }
}

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

export function getFCMToken() {
  return fcmToken;
}
