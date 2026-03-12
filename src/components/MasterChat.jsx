// PicoArt - 거장(AI) 대화 컴포넌트
// ResultScreen 내에서 사용되는 인라인 대화 UI

import React, { useState, useEffect, useRef } from 'react';
import { getMasterChat } from '../i18n';

// v79: 거장 아바타 이미지 (자화상/본인사진 → 앱변환 → 120x120 크롭)
import vangoghAvatar from '../assets/avatars/vangogh.webp';
import klimtAvatar from '../assets/avatars/klimt.webp';
import munchAvatar from '../assets/avatars/munch.webp';
import chagallAvatar from '../assets/avatars/chagall.webp';
import matisseAvatar from '../assets/avatars/matisse.webp';
import fridaAvatar from '../assets/avatars/frida.webp';
import lichtensteinAvatar from '../assets/avatars/lichtenstein.webp';

// API 기본 URL
const API_BASE_URL = 'https://mastervalley-v7.vercel.app';

// 거장별 테마 색상 + 아바타 (7명)
const MASTER_THEMES = {
  'VAN GOGH': { primary: '#2E8B7E', gradient: 'linear-gradient(135deg, #2E8B7E, #257568)', icon: '🌻', avatar: vangoghAvatar },
  'KLIMT': { primary: '#D4AF37', gradient: 'linear-gradient(135deg, #D4AF37, #b8962e)', icon: '✨', avatar: klimtAvatar },
  'MUNCH': { primary: '#C4784A', gradient: 'linear-gradient(135deg, #C4784A, #a5623b)', icon: '😱', avatar: munchAvatar },
  'CHAGALL': { primary: '#E6A8D7', gradient: 'linear-gradient(135deg, #E6A8D7, #7EB6D8)', icon: '🎻', avatar: chagallAvatar },
  'MATISSE': { primary: '#8E44AD', gradient: 'linear-gradient(135deg, #8E44AD, #7D3C98)', icon: '💃', avatar: matisseAvatar },
  'FRIDA': { primary: '#2D8B57', gradient: 'linear-gradient(135deg, #2D8B57, #247048)', icon: '🦜', avatar: fridaAvatar },
  'LICHTENSTEIN': { primary: '#F5A623', gradient: 'linear-gradient(135deg, #F5A623, #e8941a)', icon: '💥', avatar: lichtensteinAvatar }
};

const MasterChat = ({ 
  masterKey,           // 거장 키 (예: "VAN GOGH")
  onRetransform,       // 재변환 콜백 (correctionPrompt를 전달)
  isRetransforming,    // 이 거장이 변환 중인지
  retransformCost = 100,  // 재변환 비용
  savedChatData,       // 저장된 대화 데이터 { messages, pendingCorrection, messageCount, isChatEnded }
  onChatDataChange,    // 대화 데이터 변경 콜백
  lang = 'en'          // 언어 설정
}) => {
  // i18n 데이터 로드
  const chatText = getMasterChat(lang);
  
  // 저장된 데이터가 있으면 사용, 없으면 초기값
  const [messages, setMessages] = useState(savedChatData?.messages || []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCorrection, setPendingCorrection] = useState(savedChatData?.pendingCorrection || null);
  const [messageCount, setMessageCount] = useState(savedChatData?.messageCount || 0);
  const [isChatEnded, setIsChatEnded] = useState(savedChatData?.isChatEnded || false);
  const [showProfile, setShowProfile] = useState(false);
  const chatAreaRef = useRef(null);
  const hasGreeted = useRef(savedChatData?.messages?.length > 0);
  const isChatEndedRef = useRef(savedChatData?.isChatEnded || false);
  
  const MAX_MESSAGES = 20; // 최대 대화 횟수

  // 테마 색상
  const theme = MASTER_THEMES[masterKey] || MASTER_THEMES['VAN GOGH'];
  const masterName = chatText.masterNames[masterKey] || masterKey;
  
  // 한글 조사 선택 (받침 있으면 "이", 없으면 "가") - 한국어만 적용
  const getSubjectParticle = (name) => {
    if (lang !== 'ko') return '';
    const lastChar = name[name.length - 1];
    const hasJongsung = (lastChar.charCodeAt(0) - 0xAC00) % 28 !== 0;
    return hasJongsung ? '이' : '가';
  };

  // 대화 데이터 변경 시 부모에게 알림
  useEffect(() => {
    if (onChatDataChange) {
      onChatDataChange({
        messages,
        pendingCorrection,
        messageCount,
        isChatEnded
      });
    }
  }, [messages, pendingCorrection, messageCount, isChatEnded]);

  // 첫 마운트 시 인사 (저장된 대화 없을 때만)
  useEffect(() => {
    if (!hasGreeted.current && masterKey) {
      hasGreeted.current = true;
      loadGreeting();
    }
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 첫 인사 로드 (i18n에서 가져옴)
  const loadGreeting = () => {
    const greeting = chatText.greetings[masterKey] || chatText.greetings['VAN GOGH'];
    setMessages([
      {
        role: 'master',
        content: greeting
      },
      {
        role: 'system',
        content: chatText.common.helpText
      }
    ]);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || isRetransforming || isChatEnded) return;
    
    // 30회 제한 체크
    if (messageCount >= MAX_MESSAGES) {
      setIsChatEnded(true);
      isChatEndedRef.current = true;
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 사용자 메시지 추가 및 카운트 증가
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    // 30회 도달 시 종료 처리
    if (newCount >= MAX_MESSAGES) {
      setIsChatEnded(true);
      isChatEndedRef.current = true;
      // 잠시 후 종료 메시지 표시
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'master', 
          content: chatText.farewellMessages[masterKey] || chatText.farewellMessages['VAN GOGH']
        }, {
          role: 'system',
          content: chatText.common.chatEnded
        }]);
      }, 500);
      return;  // API 호출 차단
    }
    
    setIsLoading(true);
    try {
      // 대화 히스토리 구성 (Claude API 형식) - 시스템 메시지 제외
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));

      const response = await fetch(`${API_BASE_URL}/api/master-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterName: masterKey,
          conversationType: 'feedback',
          userMessage: userMessage,
          conversationHistory: conversationHistory,
          lang: lang
        })
      });
      
      const data = await response.json();
      
      console.log('Master feedback response:', data);
      
      // 대화 종료 후 도착한 응답은 무시 (ref로 최신값 확인)
      if (isChatEndedRef.current) return;
      
      if (data.success && data.masterResponse) {
        // 거장 응답 추가
        setMessages(prev => [...prev, {
          role: 'master',
          content: data.masterResponse
        }]);
        
        // 보정 프롬프트 저장
        if (data.correctionPrompt) {
          setPendingCorrection(data.correctionPrompt);
        }
      } else {
        // 응답 실패 시 에러 로그
        console.error('Invalid response:', data);
        setMessages(prev => [...prev, {
          role: 'master',
          content: chatText.common.errorMessage
        }]);
      }
    } catch (error) {
      console.error('Feedback error:', error);
      setMessages(prev => [...prev, {
        role: 'master',
        content: chatText.common.errorMessage
      }]);
    }
    setIsLoading(false);
  };

  // 재변환 실행
  const handleRetransform = async () => {
    if (!pendingCorrection || isRetransforming) return;
    
    // 부모 컴포넌트에 재변환 요청
    onRetransform(pendingCorrection);
  };

  // 재변환 완료 플래그 체크 (동기적으로 메시지 추가)
  useEffect(() => {
    if (savedChatData?.retransformCompleted) {
      showCompletionMessage();
      // 플래그 리셋
      if (onChatDataChange) {
        onChatDataChange({
          ...savedChatData,
          retransformCompleted: false
        });
      }
    }
  }, [savedChatData?.retransformCompleted]);
  
  // 완료 메시지 표시 함수 (i18n 사용)
  const showCompletionMessage = () => {
    const resultMessage = chatText.resultMessages[masterKey] || chatText.resultMessages['VAN GOGH'];
    setMessages(prev => [
      ...prev,
      { role: 'system', content: chatText.common.retransformComplete },
      { role: 'master', content: resultMessage }
    ]);
    setPendingCorrection(null);
  };

  // 엔터키 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="master-chat-section" style={{ 
      '--master-color': theme.primary,
      background: `${theme.primary}14`,
      borderColor: `${theme.primary}40`
    }}>
      {/* 헤더 (v79: 원형 아바타 이미지) */}
      <div className="master-chat-header">
        <img className="master-avatar-img" src={theme.avatar} alt={masterName} onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }} />
        <div className="master-info">
          <h3>{masterName}<span className="ai-tag">(AI)</span></h3>
        </div>
      </div>

      {/* 대화 영역 */}
      <div className="chat-area" ref={chatAreaRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.role === 'master' && (
              <img className="avatar-img-small" src={theme.avatar} alt={masterName} onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }} />
            )}
            {msg.role === 'system' ? (
              <div className="system-message">
                {msg.content}
              </div>
            ) : (
              <div>
                <div className="sender" style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.role === 'master' ? `${masterName}(AI)` : chatText.common.senderMe}
                </div>
                <div className="bubble" dir="auto" style={msg.role === 'master' ? { 
                  background: `${theme.primary}20`,
                  borderColor: `${theme.primary}40`
                } : {}}>
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* 타이핑 인디케이터 */}
        {isLoading && (
          <div className="chat-message master">
            <img className="avatar-img-small" src={theme.avatar} alt={masterName} onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }} />
            <div className="bubble typing" style={{ 
              background: `${theme.primary}20`,
              borderColor: `${theme.primary}40`
            }}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* 추천 질문 - 로딩 중에만 숨김 */}
      {!isLoading && !isRetransforming && !isChatEnded && (
        <div className="suggested-questions">
          {(chatText.suggestedQuestions[masterKey] || []).map((q, qIdx) => (
            <button
              key={qIdx}
              className="question-chip"
              onClick={() => {
                setInputValue(q);
                setTimeout(() => {
                  document.querySelector('.send-btn')?.click();
                }, 50);
              }}
              style={{ 
                background: `${theme.primary}10`,
                borderColor: `${theme.primary}40`,
                color: theme.primary
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 입력 영역 (먼저!) */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isChatEnded 
            ? chatText.common.placeholderEnded
            : isRetransforming 
              ? chatText.common.placeholderConverting
              : chatText.common.placeholderDefault
                  .replace('{masterName}', masterName)
                  .replace('{withParticle}', (() => {
                    // 한국어 조사 와/과 판별 (받침 유무)
                    const lastChar = masterName[masterName.length - 1];
                    const code = lastChar.charCodeAt(0);
                    if (code >= 0xAC00 && code <= 0xD7A3) {
                      return (code - 0xAC00) % 28 === 0 ? '와' : '과';
                    }
                    return '와'; // 한글 아닌 경우 기본값
                  })())}
          disabled={isLoading || isRetransforming || isChatEnded}
          style={{ borderColor: inputValue ? theme.primary : undefined }}
        />
        <button 
          className="send-btn"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading || isRetransforming || isChatEnded}
          style={{ color: theme.primary }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>

      {/* 재변환 버튼 (입력창 아래!) */}
      <button 
        className="retransform-btn"
        onClick={handleRetransform}
        disabled={!pendingCorrection || isRetransforming || isChatEnded}
        style={{ 
          color: pendingCorrection && !isRetransforming && !isChatEnded ? theme.primary : 'rgba(255,255,255,0.4)',
          opacity: !pendingCorrection || isRetransforming || isChatEnded ? 0.5 : 1
        }}
      >
        {isRetransforming ? (
          <>
            <span className="spinner-small"></span>
            {lang === 'ko' 
              ? chatText.common.modifying.replace('{masterName}', masterName + getSubjectParticle(masterName))
              : chatText.common.modifying.replace('{masterName}', masterName)
            }
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            {chatText.common.requestModify}
            <span style={{marginLeft: '6px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.45)'}}>$0.10</span>
          </>
        )}
      </button>

      {/* 거장 프로필 모달 */}
      {showProfile && (() => {
        const profile = chatText.profile?.[masterKey] || {};
        return (
        <div
          onClick={() => setShowProfile(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            animation: 'profileFadeIn 0.2s ease',
            padding: 24
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            style={{
              background: '#1a1a1a',
              borderRadius: 20,
              padding: '28px 24px 32px',
              maxWidth: 320, width: '100%',
              animation: 'profileScaleIn 0.25s ease',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowProfile(false)}
              style={{
                position: 'absolute', top: 12, [lang === 'ar' ? 'left' : 'right']: 12,
                background: 'rgba(255,255,255,0.08)', border: 'none',
                color: 'rgba(255,255,255,0.4)', fontSize: 16,
                width: 30, height: 30, borderRadius: '50%',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 20 }}>
              <img
                src={theme.avatar}
                style={{
                  width: 160, height: 160,
                  borderRadius: '50%', objectFit: 'cover',
                  border: `3px solid ${theme.primary}60`,
                  boxShadow: `0 0 24px ${theme.primary}30`
                }}
                alt={masterName}
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              {profile.fullName || masterName}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
              {profile.years || ''}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: theme.primary, fontWeight: 500, marginBottom: 18 }}>
              {profile.origin || ''}
            </div>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 auto 18px' }} />
            <div style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.70)', fontStyle: 'italic', lineHeight: 1.7, padding: '0 8px' }}>
              {profile.quote || ''}
            </div>
          </div>
        </div>
        );
      })()}

      <style>{`
        /* ===== 마스터 챗 컨테이너 (목업 06-result-single.html 준수) ===== */
        .master-chat-section {
          width: 100%;
          max-width: 340px;
          border: 1px solid;
          border-radius: 16px;
          padding: 14px;
          margin: 0 auto 16px;
          direction: ltr;
        }

        .master-chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .master-avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .master-info h3 {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .master-info h3 .ai-tag {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          margin-inline-start: 4px;
        }

        .chat-area {
          max-height: 180px;
          overflow-y: auto;
          margin-bottom: 12px;
          padding-inline-end: 4px;
        }

        .chat-message {
          margin-bottom: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-message.master {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
        }

        .chat-message.master .avatar-img-small {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.15);
        }

        .chat-message .sender {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 4px;
        }

        .chat-message.system {
          display: flex;
          justify-content: center;
          margin: 12px 0;
        }

        .system-message {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          padding: 6px 14px;
          border-radius: 20px;
          text-align: center;
        }

        /* 추천 질문 (가로 wrap, 입력창 위) */
        .suggested-questions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .question-chip {
          border-radius: 14px;
          padding: 5px 10px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid;
          white-space: nowrap;
        }

        .question-chip:hover {
          filter: brightness(1.2);
          transform: translateY(-1px);
        }

        .question-chip:active {
          transform: translateY(0);
        }

        /* 메시지 버블 (다크 테마) */
        .chat-message.master .bubble {
          background: rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 10px 12px;
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          line-height: 1.5;
          max-width: 85%;
          text-align: start;
        }

        .chat-message.user {
          width: fit-content;
          max-width: 85%;
          margin-left: auto;
        }

        .chat-message.user .bubble {
          background: rgba(124, 58, 237, 0.3);
          border-radius: 14px;
          padding: 10px 12px;
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          line-height: 1.5;
          text-align: right;
        }

        .chat-message .bubble.typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .chat-message .bubble.typing span {
          width: 6px;
          height: 6px;
          background: var(--master-color, #F5A623);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .chat-message .bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-message .bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* 입력 영역 (목업 준수) */
        .chat-input-area {
          display: flex;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .chat-input:focus {
          border-color: var(--master-color, rgba(245, 166, 35, 0.5));
        }

        .chat-input:disabled {
          background: rgba(255,255,255,0.05);
          cursor: not-allowed;
        }

        .send-btn {
          background: none;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 수정 버튼 (입력창 아래) */
        .retransform-btn {
          width: 100%;
          background: none;
          border: none;
          border-radius: 0;
          padding: 8px 0 2px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
          transition: opacity 0.2s;
        }

        .retransform-btn:hover:not(:disabled) {
          opacity: 0.8;
        }

        .retransform-btn:disabled {
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes profileFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes profileScaleIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MasterChat;
