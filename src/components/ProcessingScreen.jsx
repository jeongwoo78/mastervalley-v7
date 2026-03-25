// PicoArt v83 - ProcessingScreen (서버 인라인 + 원클릭 병렬)
// 단일: processStyleTransfer (HTTP 직접 응답, 8~14초)
// 원클릭: processFullTransform (서버 병렬 + Firestore 리스닝)
import React, { useEffect, useState, useRef } from 'react';
import { processStyleTransfer, processFullTransform } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';
import { 
  getOneclickMovementsPrimary, 
  getOneclickMovementsSecondary,
  getOneclickMastersPrimary,
  getOneclickMastersSecondary,
  getOneclickOrientalPrimary,
  getOneclickOrientalSecondary,
  getMastersResultEducation,
  getUi
} from '../i18n';
import { normalizeKey, getDisplayInfo, getArtistName, getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo, getCategoryIcon, getStyleIcon, getStyleTitle, getStyleSubtitle, getStyleSubtitles } from '../utils/displayConfig';
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';

const ProcessingScreen = ({ photo, selectedStyle, onComplete, lang = 'en' }) => {
  const t = getUi(lang).processing;
  
  const oneclickMovementsPrimary = getOneclickMovementsPrimary(lang);
  const oneclickMovementsSecondary = getOneclickMovementsSecondary(lang);
  const oneclickMastersPrimary = getOneclickMastersPrimary(lang);
  const oneclickMastersSecondary = getOneclickMastersSecondary(lang);
  const oneclickOrientalPrimary = getOneclickOrientalPrimary(lang);
  const oneclickOrientalSecondary = getOneclickOrientalSecondary(lang);

  const [statusText, setStatusText] = useState(t.analyzing);
  const [showEducation, setShowEducation] = useState(false);
  
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);
  const [touchStartX, setTouchStartX] = useState(0);
  
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [];
  const totalCount = styles.length;

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    if (isFullTransform) {
      // ========== 원클릭: 서버 병렬 ==========
      setShowEducation(true);
      const categoryLabel = category === 'movements' ? t.movementsLabel : 
                           category === 'masters' ? t.mastersLabel : 
                           t.nationsLabel;
      setStatusText(`${totalCount} ${categoryLabel} ${t.inProgress}`);
      
      try {
        const results = await processFullTransform(
          photo,
          styles,
          selectedStyle,
          (progress) => {
            setCompletedCount(progress.completedCount);
            
            const validResults = progress.results.filter(r => r !== null);
            setCompletedResults(validResults);
            
            if (progress.latestIndex !== undefined && progress.results[progress.latestIndex]) {
              const latest = progress.results[progress.latestIndex];
              const latestName = latest.style?.name || '';
              const cat = latest.style?.category;
              const progressLabel = (cat === 'movements' || cat === 'oriental')
                ? `${latestName} ${t.masterInProgress}`
                : `${latestName} ${t.inProgress}`;
              setStatusText(`${progressLabel} [${progress.completedCount}/${progress.totalCount}]`);
            }
          },
          {},   // fcmOptions (서버가 lang 기반으로 메시지 생성)
          lang  // ← lang 전달
        );
        
        const categoryLabel2 = category === 'movements' ? t.movementsComplete : 
                              category === 'masters' ? t.mastersComplete : t.nationsComplete;
        setStatusText(`${t.done} ${totalCount} ${categoryLabel2}`);
        
        setCompletedCount(totalCount);
        setCompletedResults(results.filter(r => r !== null));
        
        await sleep(1000);
        
        onComplete(selectedStyle, results, { isFullTransform: true, category, results });
        
      } catch (error) {
        console.error('원클릭 변환 에러:', error);
        setStatusText(`${t.error}: ${error.message}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { isFullTransform: true, category, results: [], success: false, error: error.message });
      }
      
    } else {
      // ========== 단일 변환 ==========
      setShowEducation(true);
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(t.analyzing);
      }
      
      const result = await processSingleStyle(selectedStyle, 0, 1);
      
      if (result.success) {
        setStatusText(`${t.done} ${selectedStyle.name}`);
        await sleep(1000);
        
        onComplete(selectedStyle, result.resultUrl, {
          ...result,
          style: selectedStyle
        });
      } else {
        setStatusText(`${t.error}: ${result.error}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { success: false, error: result.error });
      }
    }
  };

  // ========== 단일 스타일 변환 ==========
  const processSingleStyle = async (style, index = 0, total = 1, fcmOptions = {}) => {
    const styleName = style.name;

    const mapProgress = (progressObj) => {
      if (typeof progressObj === 'string') return progressObj;
      
      const { status, progress } = progressObj;
      const cat = style.category;
      const progressText = (cat === 'movements' || cat === 'oriental')
        ? `${styleName} ${t.masterInProgress}`
        : `${styleName} ${t.inProgress}`;
      
      switch (status) {
        case 'analyzing':
          return (total > 1 && index > 0) ? progressText : t.analyzing;
        case 'downloading': return t.downloading || t.done;
        case 'processing':  
        default:            return progressText;
      }
    };

    try {
      const result = await processStyleTransfer(
        photo,
        style,
        null,
        (progressObj) => {
          const mapped = mapProgress(progressObj);
          if (total > 1) {
            setStatusText(`${mapped} [${index + 1}/${total}]`);
          } else {
            setStatusText(mapped);
          }
        },
        fcmOptions,
        lang  // ← lang 전달
      );

      if (result.success) {
        return {
          style,
          resultUrl: result.resultUrl,
          transformId: result.transformId,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,
          subjectType: result.subjectType,
          success: true
        };
      } else {
        return { 
          style, 
          error: result.error, 
          transformId: result.transformId,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,
          subjectType: result.subjectType,
          success: false 
        };
      }
    } catch (err) {
      return { style, error: err.message, success: false };
    }
  };

  // ========== 교육자료 ==========
  
  const getSingleEducationContent = (style) => {
    const cat = style.category;
    if (cat === 'movements') return educationContent.movements[style.id];
    if (cat === 'masters') return educationContent.masters[style.id];
    if (cat === 'oriental') return educationContent.oriental[style.id];
    return null;
  };

  const getPrimaryEducation = () => {
    if (category === 'movements') return oneclickMovementsPrimary;
    else if (category === 'masters') return oneclickMastersPrimary;
    else if (category === 'oriental') return oneclickOrientalPrimary;
    return null;
  };

  const getTitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleId = result?.style?.id;
    const styleName = result?.style?.name;
    return getStyleTitle(cat, styleId, artist || styleName, lang);
  };

  const getMasterFullName = (result) => getTitle(result);

  const getSecondaryEducation = (result) => {
    if (!result) return null;
    
    const artistName = result.aiSelectedArtist || '';
    const workName = result.selected_work || '';
    const resultCategory = result.style?.category;
    
    const key = getEducationKey(resultCategory, artistName, workName);
    
    console.log(`📚 교육자료 매칭: ${resultCategory} → ${key || '없음'} (${artistName}, ${workName || '-'})`);
    
    if (key) {
      if (resultCategory === 'masters' && !isFullTransform) {
        const mastersResult = getMastersResultEducation(lang);
        if (mastersResult[key]) {
          const edu = mastersResult[key];
          const content = edu.content || edu.description || edu.desc || null;
          if (content) {
            return { name: artistName, content: content };
          }
        }
      }
      
      const educationData = {
        masters: oneclickMastersSecondary,
        movements: oneclickMovementsSecondary,
        oriental: oneclickOrientalSecondary
      };
      
      const content = getEducationContent(resultCategory, key, educationData);
      
      if (content) {
        let eduName = artistName;
        if (resultCategory === 'masters' && oneclickMastersSecondary[key]) {
          eduName = oneclickMastersSecondary[key].name || artistName;
        } else if (resultCategory === 'movements' && oneclickMovementsSecondary[key]) {
          eduName = oneclickMovementsSecondary[key].name || artistName;
        } else if (resultCategory === 'oriental' && oneclickOrientalSecondary[key]) {
          eduName = oneclickOrientalSecondary[key].name || artistName;
        }
        return { name: eduName, content: content };
      }
    }
    
    return null;
  };

  // ========== UI 핸들러 ==========
  const handleDotClick = (idx) => {
    const hasResult = completedResults.some(r => r?.style === styles[idx]);
    if (hasResult) setViewIndex(idx);
  };
  
  const handleBackToEducation = () => setViewIndex(-1);

  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (!isFullTransform) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isFullTransform || !touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && viewIndex < completedCount - 1) setViewIndex(v => v + 1);
      if (diffX < 0 && viewIndex > -1) setViewIndex(v => v - 1);
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const getResultForIndex = (idx) => {
    if (idx < 0 || idx >= styles.length) return null;
    return completedResults.find(r => r?.style === styles[idx]) || null;
  };
  
  const previewResult = viewIndex >= 0 ? getResultForIndex(viewIndex) : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;
  
  const isDotDone = (idx) => {
    return completedResults.some(r => r?.style === styles[idx]);
  };

  return (
    <div className="processing-screen">
      <div 
        className="processing-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===== 원클릭 모드 ===== */}
        {isFullTransform && (
          <>
            {viewIndex === -1 && showEducation && getPrimaryEducation() && (
              <div className="oneclick-preview">
                <div className="img-placeholder">
                  <img src={URL.createObjectURL(photo)} alt="Original" />
                </div>
                
                <div className="oneclick-style-info">
                  <h3>{selectedStyle?.title || getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}</h3>
                  <div className="subtitle1">
                    {category === 'movements' ? t.movementsSub1 :
                     category === 'masters' ? t.mastersSub1 :
                     t.orientalSub1}
                  </div>
                  <div className="subtitle2">
                    {category === 'movements' ? t.movementsSub2 :
                     category === 'masters' ? t.mastersSub2 :
                     t.orientalSub2}
                  </div>
                </div>
                
                <div className="oneclick-edu-content">
                  {getPrimaryEducation().content}
                </div>
              </div>
            )}

            {viewIndex >= 0 && previewResult && (
              <div className="oneclick-preview">
                <div className="img-placeholder">
                  <img src={previewResult.resultUrl} alt="" />
                </div>
                
                <div className="oneclick-style-info">
                  <h3>{getTitle(previewResult)}</h3>
                  {(() => {
                    const result = previewResult;
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
                
                {previewEdu && (
                  <div className="oneclick-edu-content">
                    {previewEdu.content}
                  </div>
                )}
              </div>
            )}
            
            {viewIndex >= 0 && !previewResult && (
              <div className="oneclick-preview">
                <div className="img-placeholder">
                  <div className="spinner" style={{ width: 24, height: 24 }}></div>
                </div>
                <div className="oneclick-style-info">
                  <h3>{styles[viewIndex]?.name || ''}</h3>
                  <div className="subtitle1">{t.inProgress}</div>
                </div>
              </div>
            )}

            <div className="dots-nav">
              <div className="dots">
                <button className={`dot edu ${viewIndex === -1 ? 'active' : ''}`} onClick={handleBackToEducation}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></button>
                {styles.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`dot ${isDotDone(idx) ? 'done' : ''} ${viewIndex === idx ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    disabled={!isDotDone(idx)}
                  />
                ))}
                <span className="count">[{completedCount}/{totalCount}]</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-status">
                {completedCount < totalCount && <div className="spinner"></div>}
                <p>{statusText}</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
            </div>
          </>
        )}

        {/* ===== 단일 변환 모드 ===== */}
        {!isFullTransform && showEducation && (
          <div className="single-loading-container">
            <div className="single-loading-icon">
              {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
            </div>
            
            <div className="single-loading-content">
              <div className="single-loading-title">
                {getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}
              </div>
              {(() => {
                const [sub1, sub2] = getStyleSubtitles(selectedStyle?.category, selectedStyle?.id, 'loading-single', null, null, selectedStyle?.name, lang);
                return (
                  <>
                    {sub1 && <div className="single-loading-subtitle">{sub1}</div>}
                    {sub2 && <div className="single-loading-subtitle sub2">{sub2}</div>}
                  </>
                );
              })()}
              
              {getSingleEducationContent(selectedStyle) && (
                <div className="single-loading-edu">
                  <p>{getSingleEducationContent(selectedStyle).desc}</p>
                </div>
              )}
            </div>
            
            <div className="progress-section">
              <div className="progress-status">
                <div className="spinner"></div>
                <p>{statusText}</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill single-anim"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .processing-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: #0a1a1f;
        }
        .processing-content {
          background: #0a1a1f;
          padding: 20px;
          border-radius: 16px;
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .status.oneclick {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 16px;
        }
        .status.oneclick p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
        }
        .status.oneclick .spinner {
          width: 12px;
          height: 12px;
          border-width: 2px;
        }
        
        .oneclick-preview {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .oneclick-preview .img-placeholder {
          width: 100%;
          max-width: 340px;
          aspect-ratio: 1 / 1;
          background: #1a1a1a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .oneclick-preview .img-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .oneclick-style-info {
          width: 100%;
          max-width: 340px;
          text-align: center;
          margin-bottom: 12px;
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
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 12px;
        }
        
        .oneclick-edu-content {
          width: 100%;
          max-width: 340px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          text-align: start;
          white-space: pre-line;
        }
        
        .progress-section {
          width: 100%;
          margin-top: 16px;
          padding: 12px 0;
          background: #0a1a1f;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .progress-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .progress-status p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .progress-bar {
          width: 50%;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4a6aaa, #4a7a7a);
          transition: width 0.3s;
        }
        
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .status p { margin: 0; color: rgba(255,255,255,0.6); font-size: 13px; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top: 2px solid #4a6aaa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
        }
        .edu-card.primary { background: transparent; }
        .edu-card.secondary { background: transparent; }
        .edu-card h3 { color: #fff; margin: 0 0 10px; font-size: 15px; }
        .edu-card h4 { color: #4CAF50; margin: 0 0 8px; font-size: 14px; }
        .edu-card p { color: rgba(255,255,255,0.65); line-height: 1.8; font-size: 13px; margin: 0; white-space: pre-line; }
        .hint { color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 12px !important; }
        
        .single-loading-container {
          width: 100%;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .single-loading-icon {
          margin-top: 25vh;
          font-size: 56px;
        }
        .single-loading-content {
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 16px;
        }
        .single-loading-title {
          width: 100%;
          max-width: 340px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          text-align: center;
        }
        .single-loading-subtitle {
          width: 100%;
          max-width: 340px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
          text-align: center;
        }
        .single-loading-subtitle.sub2 {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }
        .single-loading-edu {
          width: 100%;
          max-width: 340px;
          text-align: start;
        }
        .single-loading-edu p {
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          font-size: 13px;
          margin: 0 0 12px;
          white-space: pre-line;
        }
        .single-loading-edu p:last-child {
          margin-bottom: 0;
        }
        
        .progress-fill.single-anim {
          width: 40%;
          animation: singleProgress 2s ease-in-out infinite;
        }
        @keyframes singleProgress {
          0% { width: 20%; }
          50% { width: 60%; }
          100% { width: 20%; }
        }
        
        .preview { background: #1a1a1a; border-radius: 12px; overflow: hidden; margin: 16px 0; }
        .preview img { width: 100%; display: block; }
        .preview-info { 
          padding: 16px; 
          text-align: start;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .preview-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .preview-icon { font-size: 2.2rem; line-height: 1; }
        .preview-text { flex: 1; }
        .preview-style { 
          font-size: 1.35rem; font-weight: 600; color: #fff; 
          margin-bottom: 6px; line-height: 1.3;
        }
        .preview-subtitle { font-size: 1.05rem; font-weight: 600; color: rgba(255,255,255,0.8); }
        .preview-subtitle.sub2 {
          font-size: 0.95rem; font-weight: 500;
          color: rgba(255,255,255,0.5); margin-top: 4px;
        }
        
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        .dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none; cursor: pointer; padding: 0;
        }
        .dot.done { background: rgba(74, 106, 170, 0.5); }
        .dot.active { background: #4a6aaa; transform: scale(1.3); }
        .dot:disabled { opacity: 0.4; cursor: default; }
        .dot.edu {
          width: auto; height: auto; background: none;
          font-size: 11px; display: flex; align-items: center;
          justify-content: center; color: rgba(255,255,255,0.4);
        }
        .dot.edu.active { color: #fff; transform: none; background: none; }
        .count {
          font-size: 10px; color: rgba(255,255,255,0.4);
          margin-inline-start: 2px;
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
