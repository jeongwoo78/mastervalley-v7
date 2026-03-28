// ImageZoomViewer.jsx - 핀치줌 + 더블탭 줌 이미지 뷰어
// GalleryScreen, ResultScreen 모달에서 공용 사용
// 기능: 핀치줌(2손가락), 더블탭(1→2.5x 토글), 팬(확대 시 드래그), 경계 제한

import React, { useState, useRef, useCallback } from 'react';

const ImageZoomViewer = ({ src, alt, style, className, onSingleTap }) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const lastTapRef = useRef(0);         // 더블탭 감지용
  const pinchStartRef = useRef(null);    // 핀치 시작 거리
  const pinchScaleRef = useRef(1);       // 핀치 시작 시 scale
  const panStartRef = useRef(null);      // 팬 시작 좌표
  const panTranslateRef = useRef({ x: 0, y: 0 }); // 팬 시작 시 translate
  const isPinchingRef = useRef(false);   // 핀치 중 여부
  const isPanningRef = useRef(false);    // 팬 중 여부
  const hasPannedRef = useRef(false);    // 팬이 실제로 발생했는지

  // 두 손가락 사이 거리 계산
  const getDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 경계 제한 (확대 시 이미지가 화면 밖으로 너무 벗어나지 않게)
  const clampTranslate = (x, y, s) => {
    if (s <= 1) return { x: 0, y: 0 };
    const container = containerRef.current;
    if (!container) return { x, y };
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const maxX = (w * (s - 1)) / 2;
    const maxY = (h * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  };

  const handleTouchStart = useCallback((e) => {
    // 핀치 (2손가락)
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinchingRef.current = true;
      isPanningRef.current = false;
      pinchStartRef.current = getDistance(e.touches[0], e.touches[1]);
      pinchScaleRef.current = scale;
      return;
    }

    // 팬 또는 탭 (1손가락, 확대 상태에서만 팬)
    if (e.touches.length === 1) {
      hasPannedRef.current = false;
      if (scale > 1) {
        isPanningRef.current = true;
        panStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panTranslateRef.current = { ...translate };
      }
    }
  }, [scale, translate]);

  const handleTouchMove = useCallback((e) => {
    // 핀치 줌
    if (e.touches.length === 2 && isPinchingRef.current && pinchStartRef.current) {
      e.preventDefault();
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      const ratio = currentDist / pinchStartRef.current;
      let newScale = pinchScaleRef.current * ratio;
      newScale = Math.max(1, Math.min(5, newScale)); // 1x ~ 5x 제한
      
      // 축소하면 translate도 축소
      const clamped = clampTranslate(translate.x, translate.y, newScale);
      setScale(newScale);
      setTranslate(clamped);
      return;
    }

    // 팬 (확대 상태 + 1손가락)
    if (e.touches.length === 1 && isPanningRef.current && panStartRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      
      // 5px 이상 움직여야 팬으로 판정 (탭과 구분)
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasPannedRef.current = true;
      }
      
      const newX = panTranslateRef.current.x + dx;
      const newY = panTranslateRef.current.y + dy;
      const clamped = clampTranslate(newX, newY, scale);
      setTranslate(clamped);
    }
  }, [scale, translate]);

  const handleTouchEnd = useCallback((e) => {
    // 핀치 끝
    if (isPinchingRef.current) {
      isPinchingRef.current = false;
      pinchStartRef.current = null;
      // 1x 이하로 축소했으면 리셋
      if (scale <= 1.05) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      }
      return;
    }

    // 팬 끝
    if (isPanningRef.current) {
      isPanningRef.current = false;
      panStartRef.current = null;
      // 팬 없이 탭만 했으면 더블탭 체크
      if (!hasPannedRef.current) {
        checkDoubleTap(e);
      }
      return;
    }

    // 줌 안 된 상태에서 탭
    if (e.touches.length === 0 && !isPinchingRef.current) {
      checkDoubleTap(e);
    }
  }, [scale]);

  // 더블탭 감지 — 300ms 이내 두 번 탭하면 줌 토글
  const checkDoubleTap = useCallback((e) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // 더블탭: 줌 토글
      if (scale > 1.1) {
        // 확대 상태 → 원래로
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        // 원래 상태 → 2.5배 확대 (탭한 위치 중심)
        setScale(2.5);
        setTranslate({ x: 0, y: 0 });
      }
      lastTapRef.current = 0; // 리셋
    } else {
      lastTapRef.current = now;
      // 싱글탭 콜백 (300ms 후 더블탭이 아닌 경우)
      if (onSingleTap) {
        setTimeout(() => {
          if (Date.now() - lastTapRef.current >= 290) {
            // 더블탭이 아닌 경우에만 실행
            // onSingleTap은 사용하지 않을 수 있으므로 주석 처리 가능
          }
        }, 310);
      }
    }
  }, [scale, onSingleTap]);

  const imageStyle = {
    ...style,
    transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
    transition: isPinchingRef.current || isPanningRef.current ? 'none' : 'transform 0.2s ease-out',
    transformOrigin: 'center center',
    touchAction: 'none',       // 브라우저 기본 제스처 비활성화
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  return (
    <div
      ref={containerRef}
      style={{ 
        overflow: 'hidden', 
        position: 'relative',
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={src}
        alt={alt || ''}
        className={className}
        style={imageStyle}
        draggable={false}
      />
      {/* 줌 인디케이터 — 확대 시에만 표시 */}
      {scale > 1.1 && (
        <div style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: 11,
          padding: '3px 8px',
          borderRadius: 10,
          pointerEvents: 'none',
        }}>
          {scale.toFixed(1)}x
        </div>
      )}
    </div>
  );
};

export default ImageZoomViewer;
