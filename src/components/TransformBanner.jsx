// Master Valley - Transform Banner
// 진행 중/완료된 변환을 개별 이름으로 표시
// 화면 상단에 표시, 탭하면 갤러리로 이동

import React, { useState, useEffect } from 'react';
import transformManager from '../utils/transformManager';

const TransformBanner = ({ onTapGallery, excludeIds, lang }) => {
  const [transforms, setTransforms] = useState([]);
  
  useEffect(() => {
    const unsub = transformManager.subscribe((all) => {
      setTransforms(all);
    });
    return unsub;
  }, []);
  
  // ProcessingScreen이 추적 중인 건 제외 (조건부)
  const filtered = excludeIds?.size > 0
    ? transforms.filter(t => !excludeIds.has(t.transformId))
    : transforms;
  
  const visible = filtered.filter(t => 
    t.status === 'submitting' || t.status === 'pending' || t.status === 'processing' || t.status === 'completed'
  );
  
  if (visible.length === 0) return null;
  
  // 변환 이름 추출
  const getName = (entry) => {
    const style = entry.metadata?.selectedStyle;
    if (entry.selectedArtist) return entry.selectedArtist;
    if (style?.name) return style.name;
    return 'Transform';
  };
  
  return (
    <div style={styles.banner} onClick={onTapGallery}>
      <div style={styles.list}>
        {visible.map((entry, i) => {
          const isCompleted = entry.status === 'completed';
          const isLast = i === visible.length - 1;
          const name = getName(entry);
          
          return (
            <div 
              key={entry.transformId} 
              style={{
                ...styles.row,
                borderBottom: !isLast ? '1px solid rgba(255,255,255,0.06)' : 'none'
              }}
            >
              <div style={styles.left}>
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" fill="none" stroke="#5DCAA5" strokeWidth="1.5"/>
                    <path d="M4 7l2 2 4-4" fill="none" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <div style={styles.spinner} />
                )}
                <span style={styles.name}>{name}</span>
              </div>
              <span style={{
                ...styles.status,
                color: isCompleted ? '#5DCAA5' : 'rgba(255,255,255,0.35)'
              }}>
                {isCompleted ? '완료' : '변환 중'}
              </span>
            </div>
          );
        })}
      </div>
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
    borderRadius: '16px',
    padding: '6px 14px',
    zIndex: 8000,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)',
    minWidth: '200px',
    maxWidth: '280px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 0'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  spinner: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.15)',
    borderTopColor: '#F5DC82',
    borderRadius: '50%',
    animation: 'tfm-spin 1s linear infinite',
    flexShrink: 0
  },
  name: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    fontWeight: '500'
  },
  status: {
    fontSize: '11px',
    marginLeft: '12px',
    whiteSpace: 'nowrap'
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
