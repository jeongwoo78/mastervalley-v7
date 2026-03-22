// Master Valley - Transform Manager
// 동시다중 변환 관리 (최대 4개)
//
// 사용법:
//   import transformManager from './transformManager';
//   transformManager.subscribe(listener);  // 상태 변화 리스닝
//   transformManager.start(transformId, metadata);  // 변환 추적 시작
//   transformManager.getActiveCount();  // 진행 중 개수
//   transformManager.canStartNew();  // 새 변환 가능 여부

import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const MAX_CONCURRENT = 4;

// 변환 상태: 'pending' | 'processing' | 'completed' | 'failed'
// { transformId, status, metadata, resultUrl, selectedArtist, ... }
let activeTransforms = new Map();
let listeners = [];

function notifyListeners() {
  const snapshot = getAll();
  listeners.forEach(fn => {
    try { fn(snapshot); } catch (e) { console.error('TransformManager listener error:', e); }
  });
}

/**
 * 상태 변화 구독
 * @returns {Function} unsubscribe
 */
function subscribe(fn) {
  listeners.push(fn);
  // 즉시 현재 상태 전달
  fn(getAll());
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

/**
 * 새 변환 추적 시작
 * Firestore 실시간 리스닝으로 상태 감지
 */
function start(transformId, metadata = {}) {
  if (activeTransforms.has(transformId)) return;
  
  const entry = {
    transformId,
    status: 'pending',
    metadata,  // { selectedStyle, photoBlob, ... }
    resultUrl: null,
    selectedArtist: null,
    selectedWork: null,
    error: null,
    startedAt: Date.now(),
    unsubscribe: null
  };
  
  // Firestore 리스닝 시작
  const docRef = doc(db, 'transforms', transformId);
  const unsub = onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    
    const existing = activeTransforms.get(transformId);
    if (!existing) return;
    
    existing.status = data.status;
    
    if (data.status === 'completed') {
      existing.resultUrl = data.resultUrl;
      existing.selectedArtist = data.selectedArtist || null;
      existing.selectedWork = data.selectedWork || null;
      existing.subjectType = data.subjectType || null;
      existing.completedAt = Date.now();
      notifyListeners();
      
      // 완료 후 5분 뒤 자동 정리
      setTimeout(() => {
        remove(transformId);
      }, 300000);
    }
    
    if (data.status === 'failed') {
      existing.error = data.error || '변환 실패';
      existing.completedAt = Date.now();
      notifyListeners();
      
      // 실패 후 1분 뒤 자동 정리
      setTimeout(() => {
        remove(transformId);
      }, 60000);
    }
    
    if (data.status === 'processing') {
      notifyListeners();
    }
  }, (error) => {
    console.error(`TransformManager: Firestore 에러 (${transformId})`, error);
    const existing = activeTransforms.get(transformId);
    if (existing) {
      existing.status = 'failed';
      existing.error = error.message;
      notifyListeners();
    }
  });
  
  entry.unsubscribe = unsub;
  activeTransforms.set(transformId, entry);
  notifyListeners();
  
  console.log(`📋 TransformManager: 추적 시작 ${transformId} (${getActiveCount()}/${MAX_CONCURRENT})`);
}

/**
 * 변환 제거 (리스닝 해제)
 */
function remove(transformId) {
  const entry = activeTransforms.get(transformId);
  if (entry) {
    if (entry.unsubscribe) entry.unsubscribe();
    activeTransforms.delete(transformId);
    notifyListeners();
  }
}

/**
 * 완료된 변환 가져오고 목록에서 제거
 */
function popCompleted() {
  const completed = [];
  for (const [id, entry] of activeTransforms) {
    if (entry.status === 'completed') {
      completed.push({ ...entry });
      if (entry.unsubscribe) entry.unsubscribe();
      activeTransforms.delete(id);
    }
  }
  if (completed.length > 0) notifyListeners();
  return completed;
}

/**
 * 진행 중(pending + processing) 개수
 */
function getActiveCount() {
  let count = 0;
  for (const entry of activeTransforms.values()) {
    if (entry.status === 'pending' || entry.status === 'processing') count++;
  }
  return count;
}

/**
 * 새 변환 시작 가능 여부
 */
function canStartNew() {
  return getActiveCount() < MAX_CONCURRENT;
}

/**
 * 전체 변환 목록 (복사본)
 */
function getAll() {
  return Array.from(activeTransforms.values()).map(e => ({ ...e, unsubscribe: undefined }));
}

/**
 * 전체 초기화
 */
function clear() {
  for (const entry of activeTransforms.values()) {
    if (entry.unsubscribe) entry.unsubscribe();
  }
  activeTransforms.clear();
  notifyListeners();
}

const transformManager = {
  subscribe,
  start,
  remove,
  popCompleted,
  getActiveCount,
  canStartNew,
  getAll,
  clear,
  MAX_CONCURRENT
};

export default transformManager;
