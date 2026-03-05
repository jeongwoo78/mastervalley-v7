// PicoArt v75 - ResultScreen (모바일 공유/저장 지원)
// v75: Original 이미지 깜빡임 버그 수정 (originalPhotoUrl state 캐싱)
// v74: Capacitor Share/Filesystem 네이티브 API 지원
// v72: Original+1차교육 ↔ 결과+2차교육 스와이프
// v71: displayConfig.js 컨트롤 타워 사용
// v73: 통합 스타일 표시 함수 사용

import React, { useState, useEffect, useRef, useMemo } from 'react';
import BeforeAfter from './BeforeAfter';
import MasterChat from './MasterChat';
// v77: i18n 구조에서 교육 데이터 가져오기
import { 
  getMovementsBasicInfo, 
  getMovementsLoadingEducation, 
  getMovementsResultEducation,
  getMastersBasicInfo,
  getMastersLoadingEducation,
  getMastersResultEducation,
  getOrientalBasicInfo,
  getOrientalLoadingEducation,
  getOrientalResultEducation,
  getOneclickMovementsPrimary,
  getOneclickMovementsSecondary,
  getOneclickMastersPrimary,
  getOneclickMastersSecondary,
  getOneclickOrientalPrimary,
  getOneclickOrientalSecondary,
  getUi
} from '../i18n';
// 단독변환용 교육자료
import { educationContent } from '../data/educationContent';
import { saveToGallery } from './GalleryScreen';
import { processStyleTransfer } from '../utils/styleTransferAPI';
// v73: displayConfig 통합 함수
import { normalizeKey, getDisplayInfo, getArtistName, getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo, getStyleIcon, getStyleTitle, getStyleSubtitle, getStyleSubtitles } from '../utils/displayConfig';
import { getEducationKey, getEducationContent, getMasterEducationKey } from '../utils/educationMatcher';
// v74: 모바일 공유/저장 유틸리티
import { saveImage, shareImage, isNativePlatform, addWatermark } from '../utils/mobileShare';


const ResultScreen = ({ 
  originalPhoto, 
  resultImage, 
  selectedStyle, 
  aiSelectedArtist,
  aiSelectedWork,
  fullTransformResults,
  onReset,
  onGallery,
  onRetrySuccess,
  masterChatData: appMasterChatData,
  onMasterChatDataChange,
  currentMasterIndex: appCurrentIndex,
  onMasterIndexChange,
  masterResultImages: appMasterResultImages,
  onMasterResultImagesChange,
  retransformingMasters: appRetransformingMasters,
  onRetransformingMastersChange,
  lang = 'en'
}) => {

  // i18n texts from ui.js
  const t = getUi(lang).result;
  const tProcessing = getUi(lang).processing;
  const tPhotoStyle = getUi(lang).photoStyle;
  
  // v77: i18n 교육 데이터 (lang에 따라 동적 로드)
  const movementsBasicInfo = getMovementsBasicInfo(lang);
  const movementsOverview = getMovementsLoadingEducation(lang);  // 로딩 교육 = Overview
  const movementsEducation = getMovementsResultEducation(lang);  // 결과 교육
  const mastersBasicInfo = getMastersBasicInfo(lang);
  const mastersLoadingEducation = getMastersLoadingEducation(lang);
  const mastersResultEducation = getMastersResultEducation(lang);
  const mastersEducation = getMastersResultEducation(lang);  // 기존 코드 호환용 alias
  const orientalBasicInfo = getOrientalBasicInfo(lang);
  const orientalOverview = getOrientalLoadingEducation(lang);  // 로딩 교육 = Overview
  const orientalEducation = getOrientalResultEducation(lang);  // 결과 교육
  
  // v77: 원클릭 교육 데이터 (i18n)
  const oneclickMovementsPrimary = getOneclickMovementsPrimary(lang);
  const oneclickMovementsSecondary = getOneclickMovementsSecondary(lang);
  const oneclickMastersPrimary = getOneclickMastersPrimary(lang);
  const oneclickMastersSecondary = getOneclickMastersSecondary(lang);
  const oneclickOrientalPrimary = getOneclickOrientalPrimary(lang);
  const oneclickOrientalSecondary = getOneclickOrientalSecondary(lang);
  
  // ========== 원클릭 결과 처리 ==========
  const isFullTransform = fullTransformResults && fullTransformResults.length > 0;
  
  // currentIndex를 App.jsx에서 관리 (갤러리 이동해도 유지)
  const currentIndex = appCurrentIndex || 0;
  const setCurrentIndex = (val) => {
    if (onMasterIndexChange) {
      onMasterIndexChange(typeof val === 'function' ? val(currentIndex) : val);
    }
  };
  
  // ========== 스와이프 ==========
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // ========== Save/Share 메뉴 ==========
  const [showSaveShareMenu, setShowSaveShareMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showModalSaveShare, setShowModalSaveShare] = useState(false);
  
  // v79: Original 이미지 URL (useMemo로 동기 생성 → 갤러리 왕복 시 깜빡임 완전 제거)
  const originalPhotoUrl = useMemo(() => {
    if (originalPhoto) {
      return URL.createObjectURL(originalPhoto);
    }
    return null;
  }, [originalPhoto]);
  
  useEffect(() => {
    return () => {
      if (originalPhotoUrl) {
        URL.revokeObjectURL(originalPhotoUrl);
      }
    };
  }, [originalPhotoUrl]);
  
  // v72: viewIndex - Original/결과 스와이프용 (-1: Original, 0~n: 결과)
  // 단독 변환: 항상 0 (결과만 표시, 목업 준수)
  // 원클릭: currentIndex와 동기화
  const [viewIndex, setViewIndex] = useState(isFullTransform ? (appCurrentIndex || 0) : 0);
  
  // viewIndex가 결과 범위를 벗어나지 않도록 보정 (-1은 Original이므로 허용)
  const maxViewIndex = isFullTransform 
    ? fullTransformResults.length - 1 
    : 0;
  const safeViewIndex = viewIndex === -1 
    ? -1 
    : Math.max(0, Math.min(viewIndex, maxViewIndex));
  
  // safeViewIndex와 viewIndex가 다르면 동기화
  React.useEffect(() => {
    if (viewIndex !== safeViewIndex) {
      setViewIndex(safeViewIndex);
    }
  }, [viewIndex, safeViewIndex]);
  
  // v72: 1차 교육자료 (Original 화면용)
  const getPrimaryEducation = () => {
    const category = selectedStyle?.category;
    
    // 원클릭: 카테고리 전체 소개
    if (isFullTransform) {
      if (category === 'movements') {
        return { ...oneclickMovementsPrimary, title: '2,500년 서양미술사 관통' };
      } else if (category === 'masters') {
        return oneclickMastersPrimary;
      } else if (category === 'oriental') {
        return oneclickOrientalPrimary;
      }
    }
    
    // 단독변환: 해당 스타일의 1차 교육자료
    if (!isFullTransform && selectedStyle?.id) {
      const styleId = selectedStyle.id;
      if (category === 'movements' && educationContent.movements[styleId]) {
        return educationContent.movements[styleId];
      } else if (category === 'masters' && educationContent.masters[styleId]) {
        return educationContent.masters[styleId];
      } else if (category === 'oriental' && educationContent.oriental[styleId]) {
        return educationContent.oriental[styleId];
      }
    }
    
    return null;
  };
  
  // ========== 재시도 관련 ==========
  const [results, setResults] = useState(fullTransformResults || []);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryProgress, setRetryProgress] = useState('');
  
  // fullTransformResults가 변경되면 results도 업데이트
  useEffect(() => {
    if (fullTransformResults) {
      setResults(fullTransformResults);
    }
  }, [fullTransformResults]);
  
  // 실패한 결과 개수
  const failedCount = results.filter(r => !r.success).length;
  
  // currentIndex 범위 체크 (results 범위 내로 보정)
  const safeCurrentIndex = isFullTransform 
    ? Math.max(0, Math.min(currentIndex, results.length - 1))
    : 0;
  
  // 현재 보여줄 결과
  const currentResult = isFullTransform ? results[safeCurrentIndex] : null;
  // 단독변환: 재시도 성공 시 singleRetryResult 사용
  const [singleRetryResultState, setSingleRetryResultState] = useState(null);
  const displayImage = isFullTransform 
    ? currentResult?.resultUrl 
    : (singleRetryResultState?.resultUrl || resultImage);
  const displayArtist = isFullTransform 
    ? currentResult?.aiSelectedArtist 
    : (singleRetryResultState?.aiSelectedArtist || aiSelectedArtist);
  const displayWork = isFullTransform 
    ? currentResult?.selected_work 
    : (singleRetryResultState?.selected_work || aiSelectedWork);
  const displayCategory = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
  
  // ========== State ==========
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const hasSavedRef = useRef(false);

  // ========== 거장 AI 대화 관련 State (v68) ==========
  // Modify 상태 (App.jsx에서 관리, 객체로 안전하게)
  const retransformingMasters = appRetransformingMasters || {};
  
  // 거장 변환 시작
  const startRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => ({ ...prev, [masterKey]: true }));
    }
  };
  
  // 거장 변환 완료
  const stopRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => {
        const newState = { ...prev };
        delete newState[masterKey];
        return newState;
      });
    }
  };
  
  // 변환 중 여부 (갤러리 버튼 비활성화용)
  const isAnyMasterRetransforming = Object.keys(retransformingMasters).length > 0;
  
  // 거장별 Modify 이미지 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterResultImages = appMasterResultImages || {};
  const setMasterResultImages = (val) => {
    if (onMasterResultImagesChange) {
      onMasterResultImagesChange(typeof val === 'function' ? val(masterResultImages) : val);
    }
  };
  
  // 거장별 대화 데이터 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterChatData = appMasterChatData || {};
  
  // 거장 키 추출 (displayArtist에서) - 영문/한글 모두 지원
  const getMasterKey = (artistName) => {
    if (!artistName) return null;
    const name = artistName.toUpperCase();
    // VAN GOGH — ko/ja/ar/th/tr/id/pt/fr/es/zh-TW
    if (name.includes('VAN GOGH') || name.includes('GOGH') || name.includes('고흐') ||
        name.includes('ゴッホ') || name.includes('غوغ') || name.includes('غوخ') ||
        name.includes('โก๊ะ') || name.includes('VAN GOG') || name.includes('GOGH')) return 'VAN GOGH';
    // KLIMT
    if (name.includes('KLIMT') || name.includes('클림트') || name.includes('クリムト') ||
        name.includes('كليمت') || name.includes('คลิมต์') || name.includes('KLİMT')) return 'KLIMT';
    // MUNCH
    if (name.includes('MUNCH') || name.includes('뭉크') || name.includes('ムンク') ||
        name.includes('مونك') || name.includes('มุงค์') || name.includes('MUNK') ||
        name.includes('MUNCK')) return 'MUNCH';
    // CHAGALL
    if (name.includes('CHAGALL') || name.includes('샤갈') || name.includes('シャガール') ||
        name.includes('شاغال') || name.includes('ชากาล') || name.includes('ŞAGAL')) return 'CHAGALL';
    // MATISSE
    if (name.includes('MATISSE') || name.includes('마티스') || name.includes('マティス') ||
        name.includes('ماتيس') || name.includes('มาติส') || name.includes('MATİS')) return 'MATISSE';
    // FRIDA
    if (name.includes('FRIDA') || name.includes('KAHLO') || name.includes('프리다') || name.includes('칼로') ||
        name.includes('フリーダ') || name.includes('カーロ') || name.includes('فريدا') || name.includes('كاهلو') ||
        name.includes('ฟรีดา') || name.includes('คาห์โล') || name.includes('FRİDA')) return 'FRIDA';
    // LICHTENSTEIN
    if (name.includes('LICHTENSTEIN') || name.includes('리히텐') || name.includes('リキテンスタイン') ||
        name.includes('ليختنشتاين') || name.includes('ลิกเตนสไตน์') || name.includes('LİCHTENSTEİN')) return 'LICHTENSTEIN';
    // PICASSO (마지막 — 다른 이름과 충돌 없음)
    if (name.includes('PICASSO') || name.includes('피카소') || name.includes('ピカソ') ||
        name.includes('بيكاسو') || name.includes('ปิกาสโซ') || name.includes('PİKASO')) return 'PICASSO';
    return null;
  };
  
  const currentMasterKey = displayCategory === 'masters' ? getMasterKey(displayArtist) : null;
  
  // 현재 거장이 변환 중인지 (스피너 표시용)
  const isCurrentMasterWorking = currentMasterKey && retransformingMasters[currentMasterKey];
  
  // 현재 거장의 Modify 이미지
  const currentMasterResultImage = currentMasterKey ? masterResultImages[currentMasterKey] : null;
  
  // 현재 표시할 결과 이미지 (거장별 Modify 결과 우선)
  const finalDisplayImage = currentMasterResultImage || displayImage;
  
  // 거장별 대화 데이터 업데이트
  const updateMasterChatData = (masterKey, chatData) => {
    if (onMasterChatDataChange) {
      onMasterChatDataChange({
        ...masterChatData,
        [masterKey]: chatData
      });
    }
  };

  // 거장 AI Modify 핸들러 (다중 변환 지원)
  const handleMasterRetransform = async (correctionPrompt, masterKey) => {
    console.log('🔴 handleMasterRetransform 호출됨', { correctionPrompt, masterKey });
    
    // 이미 이 거장이 변환 중이면 차단
    if (!correctionPrompt || !masterKey || retransformingMasters[masterKey]) return;
    
    console.log('🔴 Modify 시작!', masterKey);
    startRetransforming(masterKey);  // 이 거장 변환 시작
    
    let success = false;
    
    try {
      // 원클릭 모드: currentResult의 style 사용, 단독: selectedStyle 사용
      const styleToUse = isFullTransform ? currentResult?.style : selectedStyle;
      
      // v69: 점진적 수정 - Original이 아닌 현재 결과물 기반으로 Modify
      // 이미 Modify한 결과가 있으면 그것을, 없으면 1차 결과를 사용
      const currentImageUrl = masterResultImages[masterKey] || displayImage;
      
      // URL을 Blob으로 변환 (processStyleTransfer는 File/Blob을 기대)
      let imageToModify;
      if (currentImageUrl && typeof currentImageUrl === 'string' && 
          (currentImageUrl.startsWith('http') || currentImageUrl.startsWith('blob:'))) {
        // URL인 경우 fetch해서 Blob으로 변환
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        imageToModify = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      } else {
        // 이미 File/Blob인 경우 그대로 사용
        imageToModify = currentImageUrl || originalPhoto;
      }
      
      // 기존 FLUX API 호출 (보정 프롬프트 추가)
      const result = await processStyleTransfer(
        imageToModify,
        styleToUse,
        correctionPrompt  // 보정 프롬프트 전달
      );
      
      if (result.success && result.resultUrl) {
        success = true;
        
        // 거장별로 Modify 이미지 저장
        setMasterResultImages(prev => ({
          ...prev,
          [masterKey]: result.resultUrl
        }));
        
        // 갤러리에 자동 저장
        const category = styleToUse?.category;
        const rawName = displayArtist || styleToUse?.name || 'Converted Image';
        await saveToGallery(result.resultUrl, {
          category,
          artistName: rawName,
          movementName: '',
          workName: displayWork || null,
          styleId: styleToUse?.id || '',
          isRetransform: true
        });
      }
    } catch (error) {
      console.error('Master retransform error:', error);
    }
    
    // 완료 플래그 먼저 설정 (MasterChat이 메시지 추가하도록)
    if (success) {
      // v70: 2초 딜레이 추가 (거장이 정성들여 수정하는 느낌)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateMasterChatData(masterKey, {
        ...masterChatData[masterKey],
        retransformCompleted: true  // 완료 플래그
      });
    }
    
    // 그 다음 버튼 활성화
    stopRetransforming(masterKey);
  };


  // ========== 갤러리 자동 저장 ==========
  useEffect(() => {
    // 원클릭은 별도 저장 로직
    if (isFullTransform) {
      // 모든 Save result
      const saveAllResults = async () => {
        for (const result of fullTransformResults) {
          if (result.success && result.resultUrl) {
            const category = result.style?.category || selectedStyle?.category;
            const rawName = result.aiSelectedArtist || result.style?.name || 'Converted Image';
            const workName = result.selected_work || null;
            await saveToGallery(result.resultUrl, {
              category,
              artistName: rawName,
              movementName: result.style?.name || selectedStyle?.name || '',
              workName,
              styleId: result.style?.id || selectedStyle?.id || '',
              isRetransform: false
            });
          }
        }
        // console.log('✅ 원클릭 결과 모두 갤러리에 저장됨');
      };
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        saveAllResults();
      }
      return;
    }
    
    // 단일 변환: 기존 로직
    if (hasSavedRef.current || !resultImage) return;
    
    const saveToGalleryAsync = async () => {
      // 스타일 정보 (i18n 표시용 원본 키 저장)
      const category = selectedStyle?.category;
      const rawName = aiSelectedArtist || selectedStyle?.name || 'Converted Image';
      const workName = aiSelectedWork || null;
      
      // 갤러리에 저장 (async)
      const saved = await saveToGallery(resultImage, {
        category,
        artistName: rawName,
        movementName: selectedStyle?.name || '',
        workName,
        styleId: selectedStyle?.id || '',
        isRetransform: false
      });
      if (saved) {
        hasSavedRef.current = true;
        setSavedToGallery(true);
        // console.log('✅ 갤러리에 자동 저장 완료 (IndexedDB):', styleName);
      }
    };
    
    saveToGalleryAsync();
  }, [resultImage, selectedStyle, aiSelectedArtist, fullTransformResults, isFullTransform]);


  // ========== 다시 시도 함수 ==========
  const handleRetry = async () => {
    if (!originalPhoto || isRetrying) return;
    
    const failedResults = results.filter(r => !r.success);
    if (failedResults.length === 0) return;
    
    setIsRetrying(true);
    // console.log(`🔄 다시 시도 시작: ${failedResults.length}개 실패한 변환`);
    
    let successCount = 0;
    let updatedResults = [...results];  // 업데이트된 결과 추적용
    
    for (let i = 0; i < failedResults.length; i++) {
      const failed = failedResults[i];
      const failedIndex = results.findIndex(r => r.style?.id === failed.style?.id);
      
      setRetryProgress(t.retrying);
      
      try {
        const result = await processStyleTransfer(
          originalPhoto,
          failed.style,
          null,
          () => {}  // 진행 콜백 불필요
        );
        
        if (result.success) {
          // 성공하면 해당 인덱스 결과 업데이트
          const newResult = {
            style: failed.style,
            resultUrl: result.resultUrl,
            aiSelectedArtist: result.aiSelectedArtist,
            selected_work: result.selected_work,
            success: true
          };
          
          setResults(prev => {
            const newResults = [...prev];
            newResults[failedIndex] = newResult;
            return newResults;
          });
          
          updatedResults[failedIndex] = newResult;  // 로컬 추적용도 업데이트
          successCount++;
          // console.log(`✅ 다시 시도 성공: ${failed.style?.name}`);
          
          // 갤러리에 저장 - i18n 원본 키 저장
          const category = failed.style?.category;
          const rawName = result.aiSelectedArtist || failed.style?.name || 'Converted Image';
          const workName = result.selected_work || null;
          await saveToGallery(result.resultUrl, {
            category,
            artistName: rawName,
            movementName: failed.style?.name || '',
            workName,
            styleId: failed.style?.id || '',
            isRetransform: false
          });
          hasSavedRef.current = true;  // useEffect 이중 저장 방지
        } else {
          // console.log(`❌ 다시 시도 실패: ${failed.style?.name} - ${result.error}`);
        }
      } catch (error) {
        console.error(`❌ 다시 시도 에러: ${failed.style?.name}`, error);
      }
    }
    
    setIsRetrying(false);
    setRetryProgress('');
    
    if (successCount > 0) {
      // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
      if (onRetrySuccess) {
        onRetrySuccess({ isFullTransform: true, results: updatedResults });
      }
      alert(t.retrySuccess);
    }
    // 실패 시 alert 없이 자연스럽게 UI로 복귀
  };

  // ========== 단독변환 다시 시도 함수 ==========
  const handleSingleModeRetry = async () => {
    if (!originalPhoto || !selectedStyle || isRetrying) return;
    
    setIsRetrying(true);
    setRetryProgress(`${selectedStyle.name} ${t.retrying}`);
    // console.log(`🔄 단독변환 다시 시도: ${selectedStyle.name}`);
    
    try {
      const result = await processStyleTransfer(
        originalPhoto,
        selectedStyle,
        null,
        () => setRetryProgress(`${selectedStyle.name} ${t.retrying}`)
      );
      
      if (result.success) {
        // console.log(`✅ 단독변환 다시 시도 성공: ${selectedStyle.name}`);
        setSingleRetryResultState(result);
        
        // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
        if (onRetrySuccess) {
          onRetrySuccess(result);
        }
        
        // 갤러리에 저장 - i18n 원본 키 저장
        const category = selectedStyle.category;
        const rawName = result.aiSelectedArtist || selectedStyle.name || 'Converted Image';
        const workName = result.selected_work || null;
        await saveToGallery(result.resultUrl, {
          category,
          artistName: rawName,
          movementName: selectedStyle.name || '',
          workName,
          styleId: selectedStyle.id || '',
          isRetransform: false
        });
        hasSavedRef.current = true;  // useEffect 이중 저장 방지
        
        alert(t.retrySuccess);
      } else {
        // console.log(`❌ 단독변환 다시 시도 실패: ${selectedStyle.name} - ${result.error}`);
        // 실패 시 alert 없이 자연스럽게 UI로 복귀
      }
    } catch (error) {
      console.error(`❌ 단독변환 다시 시도 에러:`, error);
      // 에러 시에도 alert 없이 UI로 복귀
    }
    
    setIsRetrying(false);
    setRetryProgress('');
  };


  // ========== Effects ==========
  // aiSelectedArtist가 변경될 때마다 2차 교육 재생성
  // 원클릭: currentIndex 변경 또는 currentResult 업데이트 시 재생성
  useEffect(() => {
    // console.log('🎨 ResultScreen mounted or aiSelectedArtist changed');
    generate2ndEducation();
  }, [aiSelectedArtist, currentIndex, currentResult?.aiSelectedArtist, currentResult?.selected_work]);

  // 원클릭: 화면 이동 시 현재 결과 로그
  useEffect(() => {
    console.log('🔍 [NavLog Debug] isFullTransform:', isFullTransform, 'currentResult:', !!currentResult);
    
    if (isFullTransform && currentResult) {
      // v68: 화면 전환 시 콘솔 네비 로그 (그룹핑 + 상세정보)
      const category = currentResult.style?.category;
      const styleName = currentResult.style?.name;
      const artist = currentResult.aiSelectedArtist;
      const work = currentResult.selected_work;
      
      console.log('');
      console.log(`📍 [${currentIndex + 1}/${results.length}] ─────────────────────`);
      
      if (category === 'masters') {
        const masterInfo = getMasterInfo(artist);
        console.log(`   🎨 ${masterInfo.fullName}`);
        console.log(`   📌 ${masterInfo.movement}`);
      } else if (category === 'movements') {
        const movementInfo = getMovementDisplayInfo(styleName, artist);
        console.log(`   🎨 ${movementInfo.title}`);
        console.log(`   👤 ${movementInfo.subtitle}`);
      } else if (category === 'oriental') {
        const orientalInfo = getOrientalDisplayInfo(artist);
        console.log(`   🎨 ${orientalInfo.title}`);
        console.log(`   📌 ${orientalInfo.subtitle}`);
      } else {
        console.log(`   🎨 ${styleName}`);
        console.log(`   👤 ${artist || '?'}`);
      }
      
      if (work) {
        console.log(`   🖼️ ${work}`);
      }
      
      if (currentResult.success) {
        console.log(`   ✅ 성공`);
      } else {
        console.log(`   ❌ 에러: ${currentResult.error}`);
      }
    }
  }, [currentIndex, isFullTransform, currentResult, results.length]);


  // ========== 원클릭용 키 매칭 (v51: educationMatcher.js 사용) ==========
  // 기존 복잡한 로직을 educationMatcher.js로 분리함


  // ========== 2차 교육 로드 (v51: 새로운 매칭 로직) ==========
  const generate2ndEducation = () => {
    // console.log('');
    // console.log('🔥🔥🔥 LOAD EDUCATION START (v51) 🔥🔥🔥');
    // console.log('   - category:', selectedStyle?.category);
    // console.log('   - isFullTransform:', isFullTransform);
    // console.log('   - displayArtist:', displayArtist);
    // console.log('   - displayWork:', displayWork);
    // console.log('');
    
    setIsLoadingEducation(true);
    
    let content = null;
    
    // ========== 원클릭: 새로운 매칭 로직 사용 ==========
    if (isFullTransform) {
      // console.log('📜 ONECLICK MODE - using educationMatcher.js');
      
      // currentResult에서 정보 추출
      const category = currentResult?.style?.category || displayCategory;
      const artist = currentResult?.aiSelectedArtist || displayArtist;
      const work = currentResult?.selected_work || displayWork;
      
      // console.log('   - category:', category);
      // console.log('   - artist:', artist);
      // console.log('   - work:', work);
      
      // 새로운 매칭 함수 사용
      const key = getEducationKey(category, artist, work);
      // console.log('   - matched key:', key);
      
      if (key) {
        // 거장 카테고리: 단독변환일 때만 작품별 교육자료 시도 (mastersResultEducation)
        // → 원클릭일 때는 oneclickMastersSecondary 사용
        if (category === 'masters' && !isFullTransform && mastersResultEducation[key]) {
          const edu = mastersResultEducation[key];
          content = edu.content || edu.description || edu.desc || null;
        }
        
        // 작품별 매칭 실패 시 원래 교육자료 데이터 사용
        if (!content) {
          const educationData = {
            masters: oneclickMastersSecondary,
            movements: oneclickMovementsSecondary,
            oriental: oneclickOrientalSecondary
          };
          content = getEducationContent(category, key, educationData);
        }
        
        if (content) {
          // console.log('✅ Found oneclick education for:', key);
          // console.log('   - content preview:', content.substring(0, 50) + '...');
        } else {
          // console.log('❌ No education data found for key:', key);
        }
      } else {
        // console.log('❌ No key matched');
      }
    }
    
    // ========== 단일 변환: 기존 교육자료 사용 ==========
    if (!content && !isFullTransform) {
      const category = selectedStyle.category;
      
      // 1. 동양화 (oriental)
      if (category === 'oriental') {
        // console.log('📜 Loading oriental education...');
        content = getOrientalEducation();
      }
      
      // 2. 미술사조 (movements)
      else if (category !== 'masters') {
        // console.log('📜 Loading movements education...');
        content = getMovementsEducation();
      }
      
      // 3. 거장 (masters)
      else {
        // console.log('📜 Loading masters education...');
        content = getMastersEducation();
      }
    }
    
    // 결과 설정
    if (content) {
      // console.log('✅ Education loaded successfully!');
      // console.log('   Content type:', typeof content);
      // console.log('   Content length:', content.length);
      // console.log('   Preview:', content.substring(0, 80) + '...');
      // console.log('   Setting educationText to:', content);
      setEducationText(content);
      // console.log('   ✅ setEducationText called');
    } else {
      console.error('❌ No education content found!');
      const fallback = getFallbackMessage();
      // console.log('   Using fallback:', fallback);
      setEducationText(fallback);
    }
    
    // console.log('   Setting isLoadingEducation to false');
    setIsLoadingEducation(false);
    // console.log('🏁 Loading complete');
    // console.log('');
  };


  // ========== 미술사조 교육 콘텐츠 (v49 - 동양화 방식) ==========
  const getMovementsEducation = (overrideArtist = null) => {
    const category = selectedStyle.category;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MOVEMENTS EDUCATION (v52):');
    // console.log('========================================');
    // console.log('   - category:', category);
    // console.log('   - artistSource:', artistSource);
    // console.log('========================================');
    // console.log('');
    
    // 화가 이름 정규화
    let artistName = (artistSource || '')
      .replace(/\s*\([^)]*\)/g, '')  // 괄호 제거
      .trim();
    
    if (!artistName) {
      // console.log('⚠️ No artist name provided');
      return null;
    }
    
    // 여러 매칭 패턴 시도
    const words = artistName.split(/\s+/);
    const patterns = [];
    
    // 특수문자 변환 함수 (é → e 등)
    const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // 패턴 1: 전체 이름 (소문자, 공백 제거)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, ''));
    
    // 패턴 2: 전체 이름 (소문자, 하이픈)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, '-'));
    
    // 패턴 3: 마지막 단어 (성)
    if (words.length > 1) {
      patterns.push(words[words.length - 1].toLowerCase());
    }
    
    // 패턴 4: 첫 단어 (이름)
    patterns.push(words[0].toLowerCase());
    
    // 패턴 5: 전체 소문자
    patterns.push(artistName.toLowerCase());
    
    // 패턴 6-10: 특수문자 제거 버전 (é → e 등)
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '')));
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '-')));
    if (words.length > 1) {
      patterns.push(normalize(words[words.length - 1].toLowerCase()));
    }
    patterns.push(normalize(words[0].toLowerCase()));
    patterns.push(normalize(artistName.toLowerCase()));
    
    // console.log('   - trying patterns:', patterns);
    // console.log('');
    
    // 각 패턴으로 매칭 시도
    let education = null;
    let matchedPattern = null;
    
    for (const pattern of patterns) {
      if (movementsEducation[pattern]) {
        education = movementsEducation[pattern];
        matchedPattern = pattern;
        break;
      }
    }
    
    if (education && education.description) {
      // console.log('✅ Found artist education with pattern:', matchedPattern);
      // console.log('✅ Original name:', artistName);
      // console.log('✅ Matched key:', matchedPattern);
      // console.log('✅ description length:', education.description.length);
      // console.log('========================================');
      // console.log('');
      return education.description;
    }
    
    // console.log('⚠️ No artist education found for:', artistName);
    // console.log('⚠️ Tried patterns:', patterns);
    // console.log('⚠️ Available keys (first 15):', Object.keys(movementsEducation).slice(0, 15));
    // console.log('========================================');
    // console.log('');
    
    // Fallback: 1차 교육 사용
    if (movementsOverview && movementsOverview[category]) {
      // console.log('📚 Using 1st education as fallback for category:', category);
      return movementsOverview[category].description || movementsOverview[category].desc;
    }
    
    return null;
  };


  // ========== 거장 교육 콘텐츠 (v62 - 화풍별 2차 교육) ==========
  const getMastersEducation = (overrideArtist = null) => {
    const artistSource = overrideArtist || aiSelectedArtist || selectedStyle.name || '';
    const artist = artistSource.replace(/\s*\([^)]*\)/g, '').trim();
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MASTERS EDUCATION (v62 화풍별):');
    // console.log('========================================');
    // console.log('   - artistSource:', artistSource);
    // console.log('   - normalized artist:', artist);
    // console.log('   - selectedStyle.id:', selectedStyle?.id);
    // console.log('========================================');
    // console.log('');
    
    // ========== 2차 교육자료 (작품별 → 거장 fallback) ==========
    // selectedStyle.id에서 masterId 추출
    const styleId = selectedStyle?.id || '';
    const masterId = styleId.replace('-master', ''); // 'vangogh-master' → 'vangogh'
    
    // 1단계: 작품별 교육자료 시도 (educationMatcher의 masterData.works 활용)
    if (masterId && aiSelectedWork) {
      const workSpecificKey = getMasterEducationKey(masterId, aiSelectedWork);
      if (workSpecificKey && mastersEducation[workSpecificKey]) {
        const education = mastersEducation[workSpecificKey];
        return education.description || education.desc;
      }
    }
    
    // 2단계: 거장 레벨 fallback
    if (masterId && mastersEducation[masterId]) {
      const education = mastersEducation[masterId];
      return education.description || education.desc;
    }
    
    // ========== 1차 교육자료 (거장 개요) ==========
    // 한글 이름 → mastersEducation 키 매핑
    const artistKeyMap = {
      '빈센트 반 고흐': 'vangogh-master',
      '반 고흐': 'vangogh-master',
      'van gogh': 'vangogh-master',
      'vincent van gogh': 'vangogh-master',
      '구스타프 클림트': 'klimt-master',
      '클림트': 'klimt-master',
      'klimt': 'klimt-master',
      'gustav klimt': 'klimt-master',
      '에드바르 뭉크': 'munch-master',
      '뭉크': 'munch-master',
      'munch': 'munch-master',
      'edvard munch': 'munch-master',
      '앙리 마티스': 'matisse-master',
      '마티스': 'matisse-master',
      'matisse': 'matisse-master',
      'henri matisse': 'matisse-master',
      '마르크 샤갈': 'chagall-master',
      '샤갈': 'chagall-master',
      'chagall': 'chagall-master',
      'marc chagall': 'chagall-master',
      '파블로 피카소': 'picasso-master',
      '피카소': 'picasso-master',
      'picasso': 'picasso-master',
      'pablo picasso': 'picasso-master',
      '프리다 칼로': 'frida-master',
      '프리다': 'frida-master',
      'frida': 'frida-master',
      'frida kahlo': 'frida-master',
      '로이 리히텐슈타인': 'lichtenstein-master',
      '리히텐슈타인': 'lichtenstein-master',
      'lichtenstein': 'lichtenstein-master',
      'roy lichtenstein': 'lichtenstein-master'
    };
    
    // 키 매칭 시도
    const normalizedArtist = artist.toLowerCase();
    let masterKey = artistKeyMap[artist] || artistKeyMap[normalizedArtist];
    
    // 부분 매칭 시도
    if (!masterKey) {
      for (const [name, key] of Object.entries(artistKeyMap)) {
        if (normalizedArtist.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedArtist)) {
          masterKey = key;
          break;
        }
      }
    }
    
    // console.log('   - masterKey:', masterKey);
    
    if (masterKey && mastersEducation[masterKey]) {
      const education = mastersEducation[masterKey];
      // console.log('✅ Found 1st education (거장 개요)!');
      // console.log('   - title:', education.title || education.name);
      // console.log('   - desc length:', education.description?.length || education.desc?.length);
      return education.description || education.desc;
    }
    
    // console.log('⚠️ Masters education not found for:', artist);
    // console.log('');
    
    return null;
  };



  // ========== 갤러리용 이름 포맷: i18n으로 이동 (displayConfig.js 활용) ==========
  // formatGalleryName, formatWorkName 제거됨 — saveToGallery에 원본 키 저장 → GalleryScreen에서 lang 기반 표시




  // ========== 동양화 교육 콘텐츠 (v30) ==========
  const getOrientalEducation = (overrideArtist = null) => {
    const styleId = selectedStyle.id;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    console.log('');
    console.log('========================================');
    console.log('🔍 ORIENTAL EDUCATION DEBUG');
    console.log('========================================');
    console.log('📌 selectedStyle.id:', styleId);
    console.log('📌 aiSelectedArtist:', aiSelectedArtist);
    console.log('📌 overrideArtist:', overrideArtist);
    console.log('📌 artistSource:', artistSource);
    console.log('========================================');
    console.log('');
    
    
    // ========== 한국 전통회화 (3가지) ==========
    if (styleId === 'korean') {
      const genre = artistSource?.toLowerCase() || '';
      // console.log('🇰🇷 KOREAN ART DETECTION:');
      // console.log('   - genre string:', genre);
      // console.log('');
      
      // 민화
      if (genre.includes('minhwa') || genre.includes('민화')) {
        // console.log('✅ MATCH: Korean Minhwa (민화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-minhwa']?.description 
            || orientalEducation.korean_default?.description;
      } 
      
      // 풍속화
      else if (genre.includes('genre') || genre.includes('풍속') || genre.includes('pungsokdo') || genre.includes('풍속도')) {
        // console.log('✅ MATCH: Korean Genre Painting (풍속화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-pungsokdo']?.description 
            || orientalEducation.korean_default?.description;
      } 
      
      // 진경산수화
      else if (genre.includes('jingyeong') || genre.includes('진경') || genre.includes('landscape')) {
        // console.log('✅ MATCH: Korean True-View Landscape (진경산수화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-jingyeong']?.description 
            || orientalEducation.korean_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Korean Traditional Painting (한국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_default?.description;
      }
    }
    
    
    // ========== 중국 전통회화 (3가지) ==========
    if (styleId === 'chinese') {
      const artist = aiSelectedArtist?.toLowerCase() || '';
      // console.log('🇨🇳 CHINESE ART DETECTION:');
      // console.log('   - artist string:', artist);
      // console.log('');
      
      // 공필화
      if (artist.includes('gongbi') || artist.includes('공필')) {
        // console.log('✅ MATCH: Chinese Gongbi (工筆畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['chinese-gongbi']?.description 
            || orientalEducation.chinese_default?.description;
      } 
      
      // 수묵화
      else if (artist.includes('ink') || artist.includes('수묵') || artist.includes('wash')) {
        // console.log('✅ MATCH: Chinese Ink Wash (水墨畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['chinese-ink']?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Chinese Traditional Painting (중국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_default?.description;
      }
    }
    
    
    // ========== 일본 전통회화 (1가지) ==========
    if (styleId === 'japanese') {
      // console.log('🇯🇵 JAPANESE ART DETECTION:');
      // console.log('✅ MATCH: Japanese Ukiyo-e (浮世繪)');
      // console.log('========================================');
      // console.log('');
      return orientalEducation['japanese-ukiyoe']?.description 
          || orientalEducation.japanese_default?.description;
    }
    
    
    // console.log('⚠️ NO MATCH - Returning null');
    // console.log('========================================');
    // console.log('');
    return null;
  };


  // ========== Fallback 메시지 ==========
  const getFallbackMessage = () => {
    // 원클릭 모드에서 현재 결과가 실패인 경우
    if (isFullTransform && currentResult && !currentResult.success) {
      return t.conversionFailedRetry || t.conversionFailed;
    }
    
    // 원클릭인 경우 currentResult에서 정보 가져오기
    const category = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
    const styleName = isFullTransform 
      ? (currentResult?.aiSelectedArtist || currentResult?.style?.name)
      : (displayArtist || selectedStyle?.name);
    
    return (t.convertedInStyle || 'This artwork was converted in {style} style.').replace('{style}', styleName);
  };


  // ========== 저장 (v74: 모바일 네이티브 지원) ==========
  const handleDownload = async () => {
    // 원클릭 모드면 현재 결과의 이미지, 아니면 단독 결과 이미지
    const imageToSave = finalDisplayImage || resultImage;
    if (!imageToSave) {
      alert(t.noImageToSave);
      return;
    }
    
    try {
      const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
      const fileName = `mastervalley-${styleId || 'art'}-${Date.now()}.jpg`;
      
      const result = await saveImage(imageToSave, fileName);
      
      if (result.success) {
        if (result.gallery) {
          alert(t.savedToGallery);
        } else if (isNativePlatform()) {
          alert(`${t.saved}\n${t.filesLocation}`);
        }
      } else if (result.error) {
        alert(`${t.saveFailed}: ${result.error}`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(t.saveFailedRetry);
    }
  };


  // ========== 공유 (v74: 모바일 네이티브 지원 + 워터마크) ==========
  const handleShare = async () => {
    // 원클릭 모드면 현재 결과의 이미지, 아니면 단독 결과 이미지
    const imageToShare = finalDisplayImage || resultImage;
    if (!imageToShare) {
      alert(t.noImageToShare);
      return;
    }
    
    try {
      const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
      const styleName = isFullTransform ? currentResult?.style?.name : selectedStyle?.name;
      
      // 워터마크 추가
      const watermarkedImage = await addWatermark(imageToShare);
      
      const shareTitle = t.shareTitle;
      const shareText = `${styleName || 'Art'} ${t.shareText}`;
      
      const result = await shareImage(watermarkedImage, shareTitle, shareText);
      
      if (result.clipboard) {
        alert(t.linkCopied);
      }
      // 성공이나 취소는 별도 알림 불필요
    } catch (error) {
      console.error('Share failed:', error);
      // 공유 실패 시 조용히 처리
    }
  };


  // ========== v72: 스와이프 핸들러 (viewIndex 기반) ==========
  const totalResults = isFullTransform ? results.length : 1;
  
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // 왼쪽 스와이프 → 다음
        if (viewIndex < totalResults - 1) {
          const newIndex = viewIndex + 1;
          setViewIndex(newIndex);
          if (isFullTransform) setCurrentIndex(newIndex >= 0 ? newIndex : 0);
        }
      } else {
        // 오른쪽 스와이프 → 이전
        if (viewIndex > -1) {
          const newIndex = viewIndex - 1;
          setViewIndex(newIndex);
          if (isFullTransform && newIndex >= 0) setCurrentIndex(newIndex);
        }
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };


  // ========== Render ==========
  return (
    <div className="result-screen">
      <div 
        className="result-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Header 제거 - 목업에 없음 */}

        {/* ===== 원클릭 결과 화면 (목업 07-result-oneclick.html 준수) ===== */}
        {/* 원클릭: viewIndex === -1 → 1차 교육 + Original */}
        {isFullTransform && viewIndex === -1 && getPrimaryEducation() && (
          <div className="preview-card">
            <img src={originalPhotoUrl} alt="Original 사진" className="preview-image" />
            <div className="preview-info">
              <div className="preview-header">
                <span className="preview-icon">
                  {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
                </span>
                <div className="preview-text">
                  <div className="preview-style">
                    {displayCategory === 'movements' ? tPhotoStyle.movementsFullTitle :
                     displayCategory === 'masters' ? tPhotoStyle.mastersFullTitle :
                     tPhotoStyle.orientalFullTitle}
                  </div>
                  <div className="preview-subtitle">
                    {displayCategory === 'movements' ? tProcessing.movementsSub1 :
                     displayCategory === 'masters' ? tProcessing.mastersSub1 :
                     tProcessing.orientalSub1}
                  </div>
                  <div className="preview-subtitle sub2">
                    {displayCategory === 'movements' ? tProcessing.movementsSub2 :
                     displayCategory === 'masters' ? tProcessing.mastersSub2 :
                     tProcessing.orientalSub2}
                  </div>
                </div>
              </div>
            </div>
            <div className="edu-card primary">
              <p>{getPrimaryEducation().content}</p>
            </div>
          </div>
        )}

        {/* 원클릭: viewIndex >= 0 → 결과만 + 스타일 정보 + 교육 (목업 07 준수) */}
        {isFullTransform && viewIndex >= 0 && results[viewIndex] && (
          <div className="oneclick-result-section">
            {/* 결과 이미지만 (목업: 248×248, 원본 없음) */}
            <div className="oneclick-image" onClick={() => setShowImageModal(true)} style={{ cursor: 'pointer' }}>
              <img src={masterResultImages[getMasterKey(results[viewIndex]?.aiSelectedArtist)] || results[viewIndex]?.resultUrl} alt="Result" />
            </div>
            
            {/* 스타일 정보 - 가운데 정렬 (목업: style-info) */}
            <div className="oneclick-style-info">
              <h3>
                {(() => {
                  const result = results[viewIndex];
                  const category = result?.style?.category;
                  const styleId = result?.style?.id;
                  const artistName = result?.aiSelectedArtist || result?.style?.name;
                  return getStyleTitle(category, styleId, artistName, lang);
                })()}
              </h3>
              {(() => {
                const result = results[viewIndex];
                const [sub1, sub2] = getStyleSubtitles(
                  result?.style?.category,
                  result?.style?.id,
                  'result-oneclick',
                  result?.aiSelectedArtist,
                  result?.selected_work,
                  result?.style?.name,
                  lang
                );
                return (
                  <>
                    {sub1 && <div className="subtitle1">{sub1}</div>}
                    {sub2 && <div className="subtitle2">{sub2}</div>}
                  </>
                );
              })()}
            </div>
            
            {/* 교육 섹션 (목업: edu-section) - 거장만 토글 */}
            {displayCategory === 'masters' ? (
              <div className="oneclick-edu-section">
                <div className="edu-header">
                  <button className="toggle-btn" onClick={() => setShowInfo(!showInfo)}>
                    {showInfo ? '▼' : '▶'} {showInfo ? t.hide : t.show}
                  </button>
                </div>
                {showInfo && educationText && (
                  <div className="edu-content">
                    {educationText}
                  </div>
                )}
              </div>
            ) : (
              /* 사조/동양화는 항상 표시 */
              educationText && (
                <div className="oneclick-edu-section">
                  <div className="edu-content">
                    {educationText}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 단일 변환: viewIndex에 따라 Original/결과 표시 */}
        {/* v72: Original 화면 - ProcessingScreen 카드형 레이아웃 */}
        {/* v73: 통합 함수 사용 */}
        {!isFullTransform && viewIndex === -1 && getPrimaryEducation() && (
          <div className="preview-card">
            <img src={originalPhotoUrl} alt="Original 사진" className="preview-image" />
            <div className="preview-info">
              <div className="preview-header">
                <span className="preview-icon">
                  {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
                </span>
                <div className="preview-text">
                  <div className="preview-style">
                    {getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}
                  </div>
                  {/* v74: 단독 Original 화면 3줄 표기 (result-original) */}
                  {(() => {
                    const [sub1, sub2] = getStyleSubtitles(selectedStyle?.category, selectedStyle?.id, 'result-original', null, null, selectedStyle?.name, lang);
                    return (
                      <>
                        {sub1 && <div className="preview-subtitle">{sub1}</div>}
                        {sub2 && <div className="preview-subtitle sub2">{sub2}</div>}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="edu-card primary">
              <p>{getPrimaryEducation().content || getPrimaryEducation().desc}</p>
            </div>
          </div>
        )}
        {!isFullTransform && viewIndex >= 0 && finalDisplayImage && (
          <div className="single-result-section">
            <div className="ba-section">
              <div className="ba-image">
                <img src={originalPhotoUrl} alt="Before" />
              </div>
              <div className="ba-image" onClick={() => setShowImageModal(true)} style={{ cursor: 'pointer' }}>
                <img src={finalDisplayImage} alt="After" />
              </div>
            </div>
          </div>
        )}

        {/* v79: 단독변환 실패 시 이미지 영역 대체 */}
        {!isFullTransform && (!finalDisplayImage || isRetrying) && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-placeholder">
                <div className="spinner-medium"></div>
                <p className="placeholder-text">{t.aiRetrying}</p>
              </div>
            ) : (
              <div className="retry-placeholder">
                <div className="placeholder-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="placeholder-text">{t.conversionFailed}</p>
                <button 
                  className="btn-retry-inline"
                  onClick={handleSingleModeRetry}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  {t.retry}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button - 단독 변환 거장(masters)만 표시 (목업 준수) */}
        {/* 원클릭은 oneclick-edu-section에서 자체 토글 사용 */}
        {!isFullTransform && viewIndex >= 0 && displayCategory === 'masters' && (
          <div className="info-toggle">
            <button 
              className="toggle-button"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo 
                ? `▼ ${t.hide}`
                : `▶ ${t.show}`
              }
            </button>
          </div>
        )}

        {/* v72: 결과 화면 - 2차 교육자료 (단독 변환만) */}
        {/* 목업 준수: masters는 showInfo로 토글, 사조/동양화는 항상 표시 */}
        {/* 원클릭은 oneclick-result-section에서 교육 표시 */}
        {!isFullTransform && viewIndex >= 0 && (displayCategory !== 'masters' || showInfo) && (
          <div className="technique-card">
            
            {/* Card Header - ProcessingScreen과 동일 구조 */}
            <div className="card-header">
                <h2>
                  {(() => {
                    const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                    const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
                    const artistName = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                    return getStyleTitle(category, styleId, artistName, lang);
                  })()}
                </h2>
                {(() => {
                  const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                  const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
                  const artistName = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                  const [sub1, sub2] = getStyleSubtitles(category, styleId, 'result-transformed', displayArtist, displayWork, artistName, lang);
                  return (
                    <>
                      {sub1 && <div className="subtitle1">{sub1}</div>}
                      {sub2 && <div className="subtitle2">{sub2}</div>}
                    </>
                  );
                })()}
            </div>

            {/* Card Content */}
            <div className="card-content">
              {(() => {
                // console.log('');
                // console.log('🖼️ RENDERING EDUCATION CONTENT:');
                // console.log('   - isLoadingEducation:', isLoadingEducation);
                // console.log('   - educationText:', educationText);
                // console.log('   - educationText length:', educationText?.length);
                // console.log('');
                return null;
              })()}
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>{t.loadingEducation}</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  {educationText.split('\n\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>
                        {paragraph.trim().split('\n').map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < paragraph.trim().split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    )
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* v79: 원클릭 실패 시 이미지 영역 대체 */}
        {isFullTransform && currentResult && !currentResult.success && viewIndex >= 0 && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-placeholder">
                <div className="spinner-medium"></div>
                <p className="placeholder-text">{t.aiRetrying}</p>
              </div>
            ) : (
              <div className="retry-placeholder">
                <div className="placeholder-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="placeholder-text">{t.conversionFailed}</p>
                <button 
                  className="btn-retry-inline"
                  onClick={handleRetry}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  {failedCount > 1 ? t.retryAll : t.retry}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 거장(AI) 대화 섹션 - 거장 카테고리 + 결과 화면일 때만 표시 */}
        {displayCategory === 'masters' && currentMasterKey && viewIndex >= 0 && (
          <MasterChat
            key={currentMasterKey}
            masterKey={currentMasterKey}
            onRetransform={(correctionPrompt) => handleMasterRetransform(correctionPrompt, currentMasterKey)}
            isRetransforming={isCurrentMasterWorking}
            retransformCost={100}
            savedChatData={masterChatData[currentMasterKey]}
            onChatDataChange={(data) => updateMasterChatData(currentMasterKey, data)}
            lang={lang}
          />
        )}

        {/* 원클릭 네비게이션 (Prev/Next 제거 — 스와이프 + dot 탭만) */}
        {isFullTransform && (
          <div className="fullTransform-nav">
            <div className="nav-dots">
              <button
                className={`nav-dot edu ${viewIndex === -1 ? 'active' : ''}`}
                onClick={() => setViewIndex(-1)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </button>
              {fullTransformResults.map((_, idx) => (
                <button
                  key={idx}
                  className={`nav-dot ${viewIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    setViewIndex(idx);
                    setCurrentIndex(idx);
                  }}
                />
              ))}
              <span className="nav-count">[{viewIndex === -1 ? 0 : viewIndex + 1}/{fullTransformResults.length}]</span>
            </div>
          </div>
        )}

        {/* 단독 변환 네비게이션 - 목업 준수: 제거됨 */}
        {/* 단독 변환은 네비게이션 없음 */}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-save-share" 
            onClick={() => setShowSaveShareMenu(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t.save}/{t.share}
          </button>
          
          <button 
            className="btn btn-gallery" 
            onClick={onGallery}
            disabled={isAnyMasterRetransforming || isRetrying}
            style={{ 
              opacity: (isAnyMasterRetransforming || isRetrying) ? 0.5 : 1,
              cursor: (isAnyMasterRetransforming || isRetrying) ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            {t.gallery}
          </button>
          
          <button 
            className="btn btn-reset" 
            onClick={onReset}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t.newPhoto}
          </button>
        </div>
        
        {/* Save/Share 팝업 메뉴 */}
        {showSaveShareMenu && (
          <div className="save-share-overlay" onClick={() => setShowSaveShareMenu(false)}>
            <div className="save-share-menu" onClick={(e) => e.stopPropagation()}>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowSaveShareMenu(false);
                  handleDownload();
                }}
              >
                <span className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
                {t.saveToDevice}
              </button>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowSaveShareMenu(false);
                  handleShare();
                }}
              >
                <span className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                {t.shareArt}
              </button>
              <button 
                className="menu-item menu-cancel"
                onClick={() => setShowSaveShareMenu(false)}
              >
                {t.close || '닫기'}
              </button>
            </div>
          </div>
        )}
        
      </div>

      {/* 카드 모달 - 이미지 크게 보기 */}
      {showImageModal && (() => {
        const modalImage = isFullTransform
          ? (masterResultImages[getMasterKey(results[viewIndex]?.aiSelectedArtist)] || results[viewIndex]?.resultUrl)
          : finalDisplayImage;
        if (!modalImage) return null;
        return (
          <div className="image-modal-overlay" onClick={() => { if (!showModalSaveShare) setShowImageModal(false); }}>
            <div className="image-modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="image-modal-close" onClick={() => { setShowImageModal(false); setShowModalSaveShare(false); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              
              <img src={modalImage} alt="Result" className="image-modal-img" />
              
              <div className="image-modal-actions">
                <button className="image-modal-btn save-share" onClick={() => setShowModalSaveShare(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {t.save}/{t.share}
                </button>
                <button className="image-modal-btn gallery" onClick={() => { setShowImageModal(false); onGallery(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  {t.gallery}
                </button>
              </div>

              {showModalSaveShare && (
                <div className="save-share-overlay" onClick={() => setShowModalSaveShare(false)}>
                  <div className="save-share-menu" onClick={(e) => e.stopPropagation()}>
                    <button className="menu-item" onClick={() => { setShowModalSaveShare(false); setShowImageModal(false); handleDownload(); }}>
                      <span className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
                      {t.saveToDevice}
                    </button>
                    <button className="menu-item" onClick={() => { setShowModalSaveShare(false); setShowImageModal(false); handleShare(); }}>
                      <span className="menu-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                      {t.shareArt}
                    </button>
                    <button className="menu-item menu-cancel" onClick={() => setShowModalSaveShare(false)}>
                      {t.close || '닫기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Styles */}
      <style>{`
        .result-screen {
          min-height: 100vh;
          background: #0d0d0d;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .result-container {
          max-width: 400px;
          width: 100%;
          background: #0d0d0d;
        }

        .result-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .result-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .result-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        /* ===== 원클릭 결과 화면 (목업 07-result-oneclick.html 준수) ===== */
        .oneclick-result-section {
          width: 100%;
          max-width: 340px;
          margin: 0 auto 16px;
        }

        .oneclick-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 12px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .oneclick-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== 단독변환 결과 (목업 06-result-single.html 준수) ===== */
        .single-result-section {
          width: 100%;
          max-width: 340px;
          margin: 0 auto 16px;
        }

        .ba-section {
          margin-bottom: 16px;
        }

        .ba-section .ba-image {
          width: 100%;
          aspect-ratio: 6 / 5;
          margin-bottom: 10px;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .ba-section .ba-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .oneclick-style-info {
          text-align: center;
          margin-bottom: 12px;
          width: 100%;
        }

        .oneclick-style-info h3 {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }

        .oneclick-style-info .subtitle1 {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
        }

        .oneclick-style-info .subtitle2 {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 10px;
        }

        .oneclick-edu-section {
          margin-top: 12px;
        }

        .oneclick-edu-section .edu-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 8px;
        }

        .oneclick-edu-section .toggle-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .oneclick-edu-section .toggle-btn:hover {
          color: rgba(255,255,255,0.6);
        }

        .oneclick-edu-section .edu-content {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          text-align: left;
          white-space: pre-line;
        }

        .comparison-wrapper {
          background: none;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          margin-bottom: 1rem;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .info-toggle {
          text-align: right;
          margin-bottom: 8px;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .toggle-button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.35);
          padding: 4px 8px;
          border-radius: 0;
          font-size: 11px;
          font-weight: 400;
          cursor: pointer;
          transition: color 0.2s;
        }

        .toggle-button:hover {
          background: none;
          color: rgba(255,255,255,0.5);
        }

        .technique-card {
          background: none;
          border-radius: 0;
          padding: 0;
          margin-bottom: 1rem;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          text-align: center;
          padding-bottom: 0;
          border-bottom: none;
          margin-bottom: 12px;
        }

        .card-header h2 {
          margin: 0 0 6px 0;
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.3;
          text-align: center;
        }

        .card-header .subtitle1 {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
          text-align: center;
        }
        .card-header .subtitle2 {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        .style-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          color: white;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          vertical-align: middle;
          transform: translateY(-1px);
        }

        .style-badge.neoclassical {
          background: #2E86AB;
        }

        .style-badge.romantic {
          background: #A23B72;
        }

        .style-badge.realist {
          background: #C77B58;
        }

        .style-badge.cubism {
          background: #5D5D5D;
        }

        .style-badge.surrealism {
          background: #9B59B6;
        }

        .style-badge.popart {
          background: #E74C3C;
        }

        .movement-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #0d0d0d;
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);
        }

        .loading-education {
          text-align: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-education p {
          color: rgba(255,255,255,0.6);
          font-size: 16px;
        }

        .technique-explanation {
          background: none;
          padding: 0;
          border-radius: 0;
          border-left: none;
          max-width: 340px;
          margin: 0 auto;
        }

        .technique-explanation h3 {
          display: none;
        }

        .technique-explanation p {
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          font-size: 13px;
          margin: 0 0 10px 0;
          text-align: left;
        }
        
        .technique-explanation p:last-child {
          margin-bottom: 0;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 28px;
          max-width: 340px;
          margin: 0 auto;
          padding: 14px 0 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .btn {
          padding: 8px 4px;
          border: none;
          border-radius: 0;
          background: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: rgba(255,255,255,0.7);
        }

        .btn-save-share {
          color: #7c3aed;
          font-weight: 600;
        }

        .btn-save-share:hover {
          opacity: 0.8;
        }

        .btn-gallery {
          color: rgba(255,255,255,0.7);
        }

        .btn-gallery:hover {
          color: rgba(255,255,255,0.9);
        }

        .btn-reset {
          color: rgba(255,255,255,0.7);
        }

        .btn-reset:hover {
          color: rgba(255,255,255,0.9);
        }

        /* Save/Share 팝업 메뉴 */
        .save-share-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .save-share-menu {
          background: none;
          border: none;
          border-radius: 0;
          padding: 0;
          min-width: 200px;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px 40px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          color: #7c3aed;
          cursor: pointer;
          border-radius: 0;
          letter-spacing: 0.3px;
          transition: opacity 0.2s;
        }

        .menu-item:hover {
          opacity: 0.8;
        }

        .menu-icon {
          margin-right: 8px;
          font-size: 18px;
        }

        .menu-cancel {
          color: rgba(255, 255, 255, 0.35);
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          margin-top: 4px;
          border-top: none;
          padding-top: 16px;
        }

        /* 다시 시도 섹션 */
        /* v79: 에러 — 이미지 영역 대체 스타일 */
        .retry-section {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .retry-placeholder {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .placeholder-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.25;
        }

        .placeholder-text {
          color: rgba(255, 255, 255, 0.35);
          font-size: 14px;
        }

        .btn-retry-inline {
          background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.25);
          color: #a78bfa;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }

        .btn-retry-inline:hover {
          background: rgba(124, 58, 237, 0.2);
          transform: translateY(-1px);
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .result-screen {
            padding: 1rem;
          }

          .result-header h1 {
            font-size: 2rem;
          }

          .result-subtitle {
            font-size: 0.95rem;
          }

          .comparison-wrapper {
            padding: 1rem;
          }

          .technique-card {
            padding: 1.5rem;
          }

          .technique-icon {
            font-size: 2.5rem;
            min-width: 2.5rem;
          }

          .card-header h2 {
            font-size: 1.25rem;
          }

          .action-buttons {
            gap: 20px;
          }
        }

        /* 원클릭 네비게이션 */
        .fullTransform-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }
        .nav-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 11px;
          cursor: pointer;
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .nav-dot.done {
          background: rgba(124, 58, 237, 0.5);
        }
        .nav-dot.active {
          background: #7c3aed;
          transform: scale(1.3);
        }
        .nav-dot:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .nav-dot.edu {
          width: auto;
          height: auto;
          background: none;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
        }
        .nav-dot.edu.active {
          color: #fff;
          transform: none;
          background: none;
        }
        .nav-count {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-left: 2px;
        }
        
        /* 원클릭 이미지 */
        .result-image-wrapper {
          width: 100%;
          max-width: 340px;
          aspect-ratio: 1 / 1;
          margin: 0 auto 16px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .result-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* v72: Original 화면 - ProcessingScreen 카드형 레이아웃 */
        .preview-card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          margin: 16px auto;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .preview-card .preview-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .preview-card .preview-info {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .preview-card .preview-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .preview-card .preview-icon {
          font-size: 2.2rem;
          line-height: 1;
        }
        .preview-card .preview-text {
          flex: 1;
        }
        .preview-card .preview-style {
          font-size: 1.35rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .preview-card .preview-subtitle {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }
        .preview-card .preview-subtitle.sub2 {
          font-size: 14px;
          color: #888;
          margin-top: 4px;
        }
        .preview-card .edu-card {
          padding: 16px;
          border-radius: 0;
          margin: 0;
        }
        .preview-card .edu-card.primary {
          background: transparent;
        }
        .preview-card .edu-card h3 {
          color: #fff;
          margin: 0 0 10px;
          font-size: 15px;
        }
        .preview-card .edu-card p {
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          font-size: 13px;
          margin: 0;
          white-space: pre-line;
        }
        /* 카드 모달 - 이미지 크게 보기 */
        .image-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          padding: 20px;
        }
        .image-modal-card {
          background: #1a1a2e;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
          position: relative;
        }
        .image-modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-modal-img {
          width: 100%;
          display: block;
          border-radius: 16px 16px 0 0;
        }
        .image-modal-actions {
          display: flex;
          justify-content: center;
          gap: 60px;
          padding: 14px 20px 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .image-modal-btn {
          padding: 8px 4px;
          border: none;
          border-radius: 0;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: rgba(255,255,255,0.7);
        }
        .image-modal-btn.save-share {
          background: none;
          border: none;
          color: #7c3aed;
        }
        .image-modal-btn.gallery {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
        }

      `}</style>
    </div>
  );
};

export default ResultScreen;
