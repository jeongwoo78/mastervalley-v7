// Master Valley v2.0 - Gemini 모델 설정
// FLUX/SDXL → Gemini 전환

export const MODEL_CONFIG = {
  GEMINI: {
    model: "gemini-3.1-flash-image-preview",
    cost: 0.068,
    time: 10,
    label: "Gemini (AI 이미지 생성)"
  },
  // 하위 호환 (style.model이 없으면 'SDXL'로 fallback하는 클라이언트 코드 대응)
  SDXL: {
    model: "gemini-3.1-flash-image-preview",
    cost: 0.068,
    time: 10,
    label: "Gemini"
  },
  // 레거시 (참조용, 실사용 안 함)
  FLUX: {
    model: "flux-depth-dev",
    cost: 0.037,
    time: 12,
    label: "FLUX (레거시)"
  }
};

// 화가 데이터로 모델 가져오기
export function getModelForArtist(artistData) {
  return MODEL_CONFIG.GEMINI;
}

// 비용 및 시간 정보 포맷팅
export function formatModelInfo(modelType) {
  const model = MODEL_CONFIG[modelType] || MODEL_CONFIG.GEMINI;
  return {
    cost: `$${model.cost.toFixed(3)}`,
    time: `약 ${model.time}초`,
    label: model.label
  };
}
