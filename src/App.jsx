// Master Valley v77 - Main App (i18n 지원)
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences';
import { App as CapApp } from '@capacitor/app';
import { auth, db, doc, onSnapshot, updateDoc, ensureUserDoc, collection, query, where, getDocs, orderBy, Timestamp } from './config/firebase';
import { setLanguage, getLanguage, t, getUi } from './i18n';
import LoginScreen from './components/LoginScreen';
import CategorySelection from './components/CategorySelection';
import PhotoStyleScreen from './components/PhotoStyleScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ResultScreen from './components/ResultScreen';
import GalleryScreen, { saveToGallery, isDeletedTransformId } from './components/GalleryScreen';
import AddFundsScreen from './components/AddFundsScreen';
import MenuScreen from './components/MenuScreen';
// LanguageScreen removed - 메뉴 아코디언에서 직접 변경
import InsufficientBalancePopup from './components/InsufficientBalancePopup';
import { getTransformCost } from './utils/pricing';
import { initRevenueCat, logOutRC } from './utils/revenueCat';
import { initFCM, onNotificationTap } from './utils/fcm';
import './styles/App.css';

const App = () => {
  // 인증 상태
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // URL 파라미터 → 저장된 언어 → 브라우저 언어 순으로 감지
  const SUPPORTED_LANGS = ['en', 'ko', 'ja', 'es', 'fr', 'id', 'pt', 'ar', 'tr', 'th', 'zh-TW'];
  const detectBrowserLang = () => {
    // 1순위: URL ?lang= 파라미터 (홈페이지에서 유입)
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang) {
        if (urlLang.startsWith('zh')) return 'zh-TW';
        const short = urlLang.split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.includes(short)) return short;
      }
    } catch (e) {}
    // 2순위: 브라우저 언어 감지
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    if (browserLang.startsWith('zh')) return 'zh-TW';
    const short = browserLang.split('-')[0].toLowerCase();
    return SUPPORTED_LANGS.includes(short) ? short : 'en';
  };

  // 언어 상태 (기본: 브라우저 언어 감지)
  const [lang, setLang] = useState(detectBrowserLang);

  // 화면 상태: 'category' | 'photoStyle' | 'processing' | 'result' | 'addFunds' | 'menu'
  const [currentScreen, setCurrentScreen] = useState('category');
  const prevScreenRef = useRef('category');
  const prevScreenForAddFundsRef = useRef('category');  // v98: 충전 화면 전용 이전 화면 기록
  const menuBackHandlerRef = useRef(null);  // v98: 메뉴 서브뷰 뒤로가기 처리
  const recoverPromiseRef = useRef(null);  // 진행 중인 복원 Promise 공유
  const resultScreenActiveRef = useRef(false);  // ResultScreen 활성 시 recovery 차단
  const [showGallery, setShowGallery] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  
  // 크레딧 상태 (Firestore 실시간 구독)
  const [userCredits, setUserCredits] = useState(0);
  const [creditsLoaded, setCreditsLoaded] = useState(false);
  
  // v96: UI 표시용 잔액 (환불로 마이너스가 된 경우 $0.00으로 숨김)
  // 내부 로직(userCredits < cost 체크 등)은 원본 userCredits 사용 (마이너스면 자동 차단)
  const displayCredits = Math.max(0, userCredits);
  
  // 잔액 부족 팝업
  const [showInsufficientPopup, setShowInsufficientPopup] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  
  // AI 데이터 처리 동의 팝업 (Firestore 기반)
  const [aiConsentGiven, setAiConsentGiven] = useState(false);
  const [showAiConsent, setShowAiConsent] = useState(false);
  const [pendingTransform, setPendingTransform] = useState(null);
  
  // 데이터 상태
  const [mainCategory, setMainCategory] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState(null);
  const [photoPreviewBase64, setPhotoPreviewBase64] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [aiSelectedArtist, setAiSelectedArtist] = useState(null);
  const [aiSelectedWork, setAiSelectedWork] = useState(null);
  const [subjectType, setSubjectType] = useState(null);
  const [currentTransformId, setCurrentTransformId] = useState(null);
  
  // 원클릭 결과
  const [fullTransformResults, setFullTransformResults] = useState(null);
  const [fullTransformIds, setFullTransformIds] = useState(null);  // v94: 새로고침 버튼용
  
  // 거장 관련
  const [masterChatData, setMasterChatData] = useState({});
  const [currentMasterIndex, setCurrentMasterIndex] = useState(0);
  const [masterResultImages, setMasterResultImages] = useState({});
  const [retransformingMasters, setRetransformingMasters] = useState({});
  const [prefetchedGreetings, setPrefetchedGreetings] = useState({});

  // 앱 시작 시 저장된 언어 로드 (URL 파라미터가 있으면 우선)
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        // URL ?lang= 파라미터가 있으면 최우선 (홈페이지에서 유입)
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        if (urlLang) {
          setLanguage(lang); // detectBrowserLang에서 이미 처리됨
          await Preferences.set({ key: 'mastervalley-lang', value: lang });
          return;
        }
        // URL 파라미터 없으면 저장된 언어 로드
        const { value } = await Preferences.get({ key: 'mastervalley-lang' });
        if (value) {
          setLang(value);
          setLanguage(value);
        } else {
          setLanguage(lang);
        }
      } catch (e) {
        console.log('Failed to load language setting');
        setLanguage(lang);
      }
    };
    loadSavedLanguage();
  }, []);

  // 언어 변경 핸들러 (저장 포함)
  const handleLanguageChange = async (newLang) => {
    setLang(newLang);
    setLanguage(newLang);
    try {
      await Preferences.set({ key: 'mastervalley-lang', value: newLang });
    } catch (e) {
      console.log('Failed to save language setting');
    }
  };

  // Firebase 인증 상태 감시 + Firestore 크레딧 실시간 구독
  useEffect(() => {
    let unsubCredits = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      // 이전 구독 해제
      if (unsubCredits) {
        unsubCredits();
        unsubCredits = null;
      }

      if (currentUser) {
        console.log('✅ User logged in:', currentUser.email);

        // 유저 문서 보장 (첫 로그인 시 생성)
        await ensureUserDoc(currentUser.uid, currentUser.email);

        // RevenueCat 초기화 (네이티브 환경에서만 동작)
        initRevenueCat(currentUser.uid);

        // FCM 푸시 알림 초기화 (네이티브 앱에서만 동작)
        initFCM();

        // 알림 탭 시 갤러리 즉시 열기 + 복원 후 새로고침
        onNotificationTap(async () => {
          setGalleryLoading(true);
          setShowGallery(true);
          
          const timeout = setTimeout(() => setGalleryLoading(false), 15000);
          
          await recoverMissedTransforms(currentUser.uid);
          
          clearTimeout(timeout);
          // true→false 전환으로 GalleryScreen 새로고침 트리거
          setGalleryLoading(true);
          setTimeout(() => setGalleryLoading(false), 150);
        });

        // 미수신 변환 복원 (앱 재시작 시)
        recoverMissedTransforms(currentUser.uid);

        // Firestore 실시간 잔액 구독
        const userRef = doc(db, 'users', currentUser.uid);
        unsubCredits = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserCredits(data.credits ?? 0);
            setAiConsentGiven(data.aiConsent === true);
          }
          setCreditsLoaded(true);
        }, (error) => {
          console.error('Credits subscription error:', error);
          setCreditsLoaded(true);  // 에러 시에도 로딩 완료 처리
        });
      } else {
        setUserCredits(0);
        setCreditsLoaded(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubCredits) unsubCredits();
    };
  }, []);

  // 미수신 변환 복원 (강제종료/백그라운드 복구)
  // Promise 공유: 동시 호출 시 실제 작업은 1회만, 모든 호출자가 같은 완료를 기다림
  const recoverMissedTransforms = (userId) => {
    // Lock: ResultScreen이 활성이면 recovery 불필요
    if (resultScreenActiveRef.current) return Promise.resolve();
    if (recoverPromiseRef.current) return recoverPromiseRef.current;
    
    const promise = (async () => {
      try {
        const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
        const q = query(
          collection(db, 'transforms'),
          where('userId', '==', userId),
          where('status', '==', 'completed'),
          where('completedAt', '>=', oneHourAgo)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return;

        let recovered = 0;

        // 유효한 복원 대상 필터링 (status+completedAt은 서버에서 필터됨)
        const validDocs = [];
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (!data.resultUrl) continue;
          if (isDeletedTransformId(docSnap.id)) continue;
          validDocs.push({ id: docSnap.id, data });
        }

        // 세션별 그룹 + styleIndex 정렬 (원클릭 갤러리 순서 보장)
        validDocs.sort((a, b) => {
          if (a.data.sessionId !== b.data.sessionId) {
            const aTime = a.data.createdAt?.toMillis?.() || 0;
            const bTime = b.data.createdAt?.toMillis?.() || 0;
            return aTime - bTime;
          }
          return (a.data.styleIndex ?? 999) - (b.data.styleIndex ?? 999);
        });

        const baseTime = Date.now();
        for (let i = 0; i < validDocs.length; i++) {
          const { id, data } = validDocs[i];

          const saved = await saveToGallery(data.resultUrl, {
            category: data.selectedStyle?.category || data.category || '',
            artistName: data.selectedArtist || data.selectedStyle?.name || '',
            movementName: data.selectedStyle?.name || '',
            workName: data.selectedWork || null,
            styleId: data.selectedStyle?.id || '',
            isRetransform: false,
            transformId: id,
            sessionId: data.sessionId || null,
            savedAt: new Date(baseTime + i * 100).toISOString(),
            styleIndex: data.styleIndex ?? i
          });
          if (saved) recovered++;
        }
        if (recovered > 0) {
          console.log(`✅ ${recovered}건 갤러리 복원 완료`);
        }
      } catch (error) {
        console.error('갤러리 복원 실패:', error);
      } finally {
        recoverPromiseRef.current = null;  // 완료 후 다음 호출 허용
      }
    })();
    
    recoverPromiseRef.current = promise;
    return promise;
  };

  // 앱 포그라운드 복귀 시 복원
  useEffect(() => {
    const stateHandler = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive && user) {
        recoverMissedTransforms(user.uid);
      }
    });
    return () => {
      stateHandler.then(h => h.remove());
    };
  }, [user]);

  // 뒤로가기 차단 토스트
  const [showBackBlockedToast, setShowBackBlockedToast] = useState(false);
  const backBlockedTimerRef = useRef(null);

  // 안드로이드 뒤로가기 버튼 처리
  useEffect(() => {
    const backHandler = CapApp.addListener('backButton', () => {
      // 갤러리 열려있으면 GalleryScreen이 자체 처리 (모달→선택모드→닫기)
      if (showGallery) {
        return;
      }
      
      // 잔액 부족 팝업 열려있으면 닫기
      if (showInsufficientPopup) {
        setShowInsufficientPopup(false);
        return;
      }
      
      // AI 동의 팝업 열려있으면 닫기
      if (showAiConsent) {
        setShowAiConsent(false);
        setPendingTransform(null);
        return;
      }

      // 화면별 뒤로가기
      switch (currentScreen) {
        case 'result':
          // ResultScreen이 자체 처리 (모달→저장/공유→결과화면 나가기)
          break;
        case 'processing':
          // 변환 중 → 차단 + 토스트 메시지
          if (!showBackBlockedToast) {
            setShowBackBlockedToast(true);
            if (backBlockedTimerRef.current) clearTimeout(backBlockedTimerRef.current);
            backBlockedTimerRef.current = setTimeout(() => {
              setShowBackBlockedToast(false);
              backBlockedTimerRef.current = null;
            }, 1000);
          }
          return;  // 화면 전환 차단
        case 'photoStyle':
          handleBackToCategory();
          break;
        case 'addFunds':
          setCurrentScreen(prevScreenForAddFundsRef.current);  // v98: 충전 전용 이전 화면 복귀
          break;
        case 'menu':
          // v98: 서브뷰(앱정보/이용약관/개인정보) 열려있으면 서브뷰만 닫기
          if (menuBackHandlerRef.current && menuBackHandlerRef.current()) {
            break;  // 서브뷰 닫힘 → 메뉴 유지
          }
          setCurrentScreen(prevScreenRef.current);
          break;
        case 'category':
          // 메인 화면에서 뒤로가기 → 앱 백그라운드로
          CapApp.minimizeApp();
          break;
        default:
          break;
      }
    });

    return () => {
      backHandler.then(h => h.remove());
    };
  }, [currentScreen, showGallery, showInsufficientPopup, showAiConsent, showBackBlockedToast]);

  // 로그인 성공
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logOutRC();
      await signOut(auth);
      setUser(null);
      handleReset();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 1단계: 대카테고리 선택
  const handleCategorySelect = (categoryId) => {
    setMainCategory(categoryId);
    setCurrentScreen('photoStyle');
  };

  // 변환 시작 공통 로직 (잔액 체크 포함)
  const startTransform = (photo, style, preview) => {
    const cost = getTransformCost(style);
    if (cost > 0 && userCredits < cost) {
      setRequiredAmount(cost);
      setShowInsufficientPopup(true);
      return;
    }
    setUploadedPhoto(photo);
    // v87: 하이브리드 원본 URL (Blob 즉시 → base64 교체, 깜빡임+만료 원천 차단)
    try {
      const blobUrl = URL.createObjectURL(photo);
      setOriginalPhotoUrl(blobUrl);
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalPhotoUrl(reader.result);
        URL.revokeObjectURL(blobUrl);
      };
      reader.readAsDataURL(photo);
    } catch (e) {
      console.warn('originalPhotoUrl 생성 실패:', e);
    }
    if (preview) setPhotoPreviewBase64(preview);
    setSelectedStyle(style);
    setCurrentScreen('processing');
  };

  // 2단계: 사진 + 스타일 선택 완료 → 변환 시작
  const handlePhotoStyleSelect = (photo, style, preview) => {
    // AI 데이터 처리 동의 확인 (Firestore 기반, 첫 1회만)
    if (!aiConsentGiven) {
      setPendingTransform({ photo, style, preview });
      setShowAiConsent(true);
      return;
    }
    startTransform(photo, style, preview);
  };

  // AI 동의 확인 후 변환 진행
  const handleAiConsentConfirm = async () => {
    // Firestore에 동의 저장 (도메인/캐시와 무관하게 영구 보존)
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { aiConsent: true });
      } catch (e) {
        console.error('AI consent save error:', e);
      }
    }
    setAiConsentGiven(true);
    setShowAiConsent(false);
    if (pendingTransform) {
      startTransform(pendingTransform.photo, pendingTransform.style, pendingTransform.preview);
      setPendingTransform(null);
    }
  };

  // ========================================
  // MasterChat 그리팅 프리로드
  // ========================================
  const MASTER_AGE_RANGE = {
    'VAN GOGH': { min: 35, max: 37 }, 'KLIMT': { min: 48, max: 53 },
    'MUNCH': { min: 33, max: 77 }, 'CHAGALL': { min: 31, max: 94 },
    'MATISSE': { min: 39, max: 81 }, 'FRIDA': { min: 23, max: 44 },
    'LICHTENSTEIN': { min: 41, max: 70 }
  };
  const MASTER_BIRTH = {
    'VAN GOGH': 1853, 'KLIMT': 1862, 'MUNCH': 1863, 'CHAGALL': 1887,
    'MATISSE': 1869, 'FRIDA': 1907, 'LICHTENSTEIN': 1923
  };

  const artistToMasterKey = (name) => {
    if (!name) return null;
    const n = name.toUpperCase();
    if (n.includes('GOGH') || n.includes('고흐')) return 'VAN GOGH';
    if (n.includes('KLIMT') || n.includes('클림트')) return 'KLIMT';
    if (n.includes('MUNCH') || n.includes('뭉크') || n.includes('มุงก์')) return 'MUNCH';
    if (n.includes('CHAGALL') || n.includes('샤갈') || n.includes('ชาการ์ล')) return 'CHAGALL';
    if (n.includes('MATISSE') || n.includes('마티스') || n.includes('มาติส')) return 'MATISSE';
    if (n.includes('FRIDA') || n.includes('KAHLO') || n.includes('프리다') || n.includes('ฟรีดา')) return 'FRIDA';
    if (n.includes('LICHTENSTEIN') || n.includes('리히텐') || n.includes('ลิชเทนสไตน์')) return 'LICHTENSTEIN';
    return null;
  };

  const prefetchGreeting = async (masterKey, subType) => {
    const range = MASTER_AGE_RANGE[masterKey] || { min: 30, max: 50 };
    const age = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    const birth = MASTER_BIRTH[masterKey] || 1870;
    const year = birth + age;
    const month = new Date().getMonth() + 1;
    const tt = { year, age, month };

    const authToken = await auth.currentUser?.getIdToken().catch(() => null);
    fetch('https://mastervalley-v7.vercel.app/api/master-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      body: JSON.stringify({
        masterName: masterKey,
        conversationType: 'greeting',
        userMessage: '',
        lang: lang,
        timeTravel: tt,
        subjectType: subType || 'person'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.masterResponse) {
        setPrefetchedGreetings(prev => ({
          ...prev,
          [masterKey]: { message: data.masterResponse, timeTravel: tt }
        }));
      }
    })
    .catch(err => console.warn('⚠️ 그리팅 프리로드 실패:', err.message));
  };

  // 변환 완료 → 화면 전환 (크레딧 차감은 서버에서 처리, 잔액은 onSnapshot 자동 업데이트)
  const handleProcessingComplete = async (style, resultImageUrl, result) => {

    if (result && result.isFullTransform) {
      setFullTransformResults(result.results);
      setFullTransformIds(result.transformIds || null);  // v94
      setResultImage(null);
      setAiSelectedArtist(null);
      setAiSelectedWork(null);
      setSubjectType(result.results?.find(r => r.subjectType)?.subjectType || null);
      setCurrentMasterIndex(0);
      setCurrentTransformId(null);  // 원클릭은 개별 transformId 사용
    } else {
      setFullTransformResults(null);
      setResultImage(resultImageUrl);
      setCurrentTransformId(result?.transformId || null);  // 단일 변환 transformId 저장
      
      if (result && result.aiSelectedArtist) {
        setAiSelectedArtist(result.aiSelectedArtist);
      } else {
        setAiSelectedArtist(null);
      }
      
      if (result && result.selected_work) {
        setAiSelectedWork(result.selected_work);
      } else {
        setAiSelectedWork(null);
      }
      
      setSubjectType(result?.subjectType || null);
    }
    
    // masters 카테고리 원클릭이면 그리팅 프리로드 (백그라운드)
    // 단독변환은 MasterChat이 직접 loadGreeting 호출 (프리페치 중복 방지)
    if (style?.category === 'masters' && result?.isFullTransform && result.results) {
      const subType = result.results?.find(r => r.subjectType)?.subjectType;
      result.results.forEach(r => {
        if (r.success && r.aiSelectedArtist) {
          const key = artistToMasterKey(r.aiSelectedArtist);
          if (key) prefetchGreeting(key, subType);
        }
      });
    }
    
    setCurrentScreen('result');
  };

  // 처음으로
  const handleReset = () => {
    setCurrentScreen('category');
    setMainCategory(null);
    setUploadedPhoto(null);
    setOriginalPhotoUrl(null);
    setPhotoPreviewBase64(null);
    setSelectedStyle(null);
    setResultImage(null);
    setAiSelectedArtist(null);
    setAiSelectedWork(null);
    setSubjectType(null);
    setCurrentTransformId(null);
    setFullTransformResults(null);
    setFullTransformIds(null);  // v94
    setMasterChatData({});
    setPrefetchedGreetings({});
    setCurrentMasterIndex(0);
    setMasterResultImages({});
    setRetransformingMasters({});
  };

  // 뒤로가기
  const handleBackToCategory = () => {
    setCurrentScreen('category');
    setMainCategory(null);
    setUploadedPhoto(null);
    setOriginalPhotoUrl(null);
    setPhotoPreviewBase64(null);
  };

  // Add Funds 화면
  const handleGoToAddFunds = () => {
    prevScreenForAddFundsRef.current = currentScreen;  // v98: 충전 전용 이전 화면 기록
    setCurrentScreen('addFunds');
  };

  // Menu 화면
  const handleGoToMenu = () => {
    prevScreenRef.current = currentScreen;
    setCurrentScreen('menu');
  };

  // 계정 삭제 (나중에 구현)
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      console.log('Delete account requested');
      // TODO: Implement account deletion
    }
  };

  // 다시 시도 성공 시
  const handleRetrySuccess = (result) => {
    if (result.isFullTransform) {
      setFullTransformResults(result.results);
    } else {
      setResultImage(result.resultUrl);
      setAiSelectedArtist(result.aiSelectedArtist || null);
      setAiSelectedWork(result.selected_work || null);
      setSubjectType(result.subjectType || null);
    }
  };

  // 로딩 중 (인증 + 로그인 유저는 크레딧까지)
  if (authLoading || (user && !creditsLoaded)) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>{getUi(lang).common.loading}</p>
        <style>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #0a1a1f;
            color: white;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} lang={lang} />;
  }

  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* 변환 중 뒤로가기 차단 토스트 */}
      {showBackBlockedToast && (
        <div className="back-blocked-toast">
          {getUi(lang).processing.backBlocked}
        </div>
      )}
      {/* AI 데이터 처리 동의 팝업 */}
      {showAiConsent && (
        <div className="ai-consent-overlay" onClick={() => {}}>
          <div className="ai-consent-modal">
            <p className="ai-consent-text">{getUi(lang).aiConsent.message}</p>
            <button className="ai-consent-btn" onClick={handleAiConsentConfirm}>
              {getUi(lang).aiConsent.confirm}
            </button>
          </div>
        </div>
      )}

      {/* 잔액 부족 팝업 */}
      {showInsufficientPopup && (
        <InsufficientBalancePopup
          requiredAmount={requiredAmount}
          currentBalance={displayCredits}
          onAddFunds={() => {
            setShowInsufficientPopup(false);
            prevScreenForAddFundsRef.current = currentScreen;  // v98
            setCurrentScreen('addFunds');
          }}
          onClose={() => setShowInsufficientPopup(false)}
          lang={lang}
        />
      )}

      {/* 갤러리 화면 */}
      {showGallery && (
        <GalleryScreen 
          onBack={() => {
            setShowGallery(false);
            setGalleryLoading(false);  // 갤러리 닫을 때 로딩 해제
          }} 
          onHome={() => {
            setShowGallery(false);
            setGalleryLoading(false);
            handleReset();
          }}
          lang={lang}
          externalLoading={galleryLoading}
        />
      )}

      {/* 메인 앱 - 갤러리 시 숨기기만 (언마운트 X → blob URL 보존) */}
      <div style={{ display: showGallery ? 'none' : 'block' }}>
          {currentScreen === 'category' && (
            <CategorySelection 
              onSelect={handleCategorySelect}
              onGallery={() => setShowGallery(true)}
              onMenu={handleGoToMenu}
              onAddFunds={handleGoToAddFunds}
              userCredits={displayCredits}
              creditsLoaded={creditsLoaded}
              lang={lang}
            />
          )}

          {currentScreen === 'addFunds' && (
            <AddFundsScreen
              onBack={() => setCurrentScreen(prevScreenForAddFundsRef.current)}
              userCredits={displayCredits}
              userId={user?.uid}
              onPurchaseComplete={() => {
                // 잔액은 Firestore onSnapshot이 자동 반영
                setCurrentScreen(prevScreenForAddFundsRef.current);
              }}
              lang={lang}
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen
              onBack={() => setCurrentScreen(prevScreenRef.current)}
              onGallery={() => setShowGallery(true)}
              onAddFunds={handleGoToAddFunds}
              onLanguage={handleLanguageChange}
              onSupport={() => console.log('Support')}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              menuBackHandlerRef={menuBackHandlerRef}
              lang={lang}
            />
          )}

          {currentScreen === 'photoStyle' && (
            <PhotoStyleScreen
              mainCategory={mainCategory}
              onBack={handleBackToCategory}
              onSelect={handlePhotoStyleSelect}
              onMenu={handleGoToMenu}
              onAddFunds={handleGoToAddFunds}
              userCredits={displayCredits}
              creditsLoaded={creditsLoaded}
              lang={lang}
            />
          )}

          {currentScreen === 'processing' && (
            <ProcessingScreen
              photo={uploadedPhoto}
              originalPhotoUrl={originalPhotoUrl}
              selectedStyle={selectedStyle}
              onComplete={handleProcessingComplete}
              lang={lang}
            />
          )}

          {currentScreen === 'result' && (
            <ResultScreen
              resultScreenActiveRef={resultScreenActiveRef}
              originalPhoto={uploadedPhoto}
              originalPhotoUrl={originalPhotoUrl}
              photoPreviewBase64={photoPreviewBase64}
              resultImage={resultImage}
              selectedStyle={selectedStyle}
              aiSelectedArtist={aiSelectedArtist}
              aiSelectedWork={aiSelectedWork}
              subjectType={subjectType}
              transformId={currentTransformId}
              fullTransformResults={fullTransformResults}
              fullTransformIds={fullTransformIds}
              onReset={handleReset}
              onBack={() => {
                setCurrentScreen('photoStyle');
                setResultImage(null);
                setAiSelectedArtist(null);
                setAiSelectedWork(null);
                setSubjectType(null);
                setFullTransformResults(null);
                setFullTransformIds(null);  // v94
              }}
              onGallery={() => setShowGallery(true)}
              onRetrySuccess={handleRetrySuccess}
              masterChatData={masterChatData}
              prefetchedGreetings={prefetchedGreetings}
              onMasterChatDataChange={setMasterChatData}
              currentMasterIndex={currentMasterIndex}
              onMasterIndexChange={setCurrentMasterIndex}
              masterResultImages={masterResultImages}
              onMasterResultImagesChange={setMasterResultImages}
              retransformingMasters={retransformingMasters}
              onRetransformingMastersChange={setRetransformingMasters}
              userId={user?.uid}
              userCredits={displayCredits}
              onInsufficientBalance={(cost) => {
                setRequiredAmount(cost);
                setShowInsufficientPopup(true);
              }}
              lang={lang}
              isGalleryOpen={showGallery}
            />
          )}
      </div>

      <style>{`
        .app {
          min-height: 100vh;
          position: relative;
        }
        
        .user-header {
          position: fixed;
          top: 0;
          right: 0;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 0 0 0 12px;
        }
        
        .user-email {
          color: white;
          font-size: 13px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .logout-btn {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .ai-consent-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 24px;
        }
        .ai-consent-modal {
          background: #1e1e1e;
          border-radius: 16px;
          padding: 20px 20px 12px;
          max-width: 260px;
          width: 100%;
          text-align: center;
        }
        .ai-consent-text {
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          line-height: 1.55;
          margin-bottom: 16px;
          text-align: left;
        }
        .ai-consent-btn {
          width: 100%;
          padding: 10px;
          background: transparent;
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .back-blocked-toast {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 9999;
          text-align: center;
          white-space: pre-line;
          animation: toastFadeIn 0.2s ease;
        }
        @keyframes toastFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
