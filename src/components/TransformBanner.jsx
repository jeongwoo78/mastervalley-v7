// Master Valley - Transform Banner
// 진행 중인 변환 개수를 보여주는 배너
// 화면 상단에 표시, 탭하면 갤러리로 이동

import React, { useState, useEffect } from 'react';
import transformManager from '../utils/transformManager';

const TransformBanner = ({ onTapGallery, lang }) => {
  const [transforms, setTransforms] = useState([]);
  
  useEffect(() => {
    const unsub = transformManager.subscribe((all) => {
      setTransforms(all);
    });
    return unsub;
  }, []);
  
  const activeCount = transforms.filter(t => 
    t.status === 'pending' || t.status === 'processing'
  ).length;
  
  const completedCount = transforms.filter(t => t.status === 'completed').length;
  
  // 아무것도 없으면 숨김
  if (activeCount === 0 && completedCount === 0) return null;
  
  return (
    <div style={styles.banner} onClick={onTapGallery}>
      <div style={styles.content}>
        <div style={styles.spinner} />
        <span style={styles.text}>
          {activeCount > 0 && `${activeCount}건 변환 중...`}
          {activeCount > 0 && completedCount > 0 && ' | '}
          {completedCount > 0 && `${completedCount}건 완료`}
        </span>
      </div>
      <span style={styles.arrow}>›</span>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30, 30, 30, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    zIndex: 8000,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.1)',
    minWidth: '160px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderTopColor: '#F5DC82',
    borderRadius: '50%',
    animation: 'tfm-spin 1s linear infinite'
  },
  text: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '13px',
    fontWeight: '500'
  },
  arrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '16px'
  }
};

// CSS 애니메이션 주입
if (typeof document !== 'undefined') {
  const styleId = 'tfm-banner-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `@keyframes tfm-spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }
}

export default TransformBanner;
