import { apiRequest } from "./apiClient"

function toNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback
}

export function mapTypingSessionResult(result = {}) {
  return {
    accuracy: toNumber(result.accuracy),
    duration: Math.max(1, Math.round(result.elapsedSeconds || result.seconds || 1)),
    errors: Math.max(
      0,
      Math.round(result.mistakes ?? result.incorrectAttempts ?? result.errors ?? 0)
    ),
    mode: result.modeLabel || result.modeId || result.summaryType || "practice",
    wpm: toNumber(result.wpm),
  }
}

export function getSessions() {
  return apiRequest("/api/sessions")
}

export function createSession(result) {
  return apiRequest("/api/sessions", {
    body: mapTypingSessionResult(result),
    method: "POST",
  })
}

export default {
  createSession,
  getSessions,
  mapTypingSessionResult,
}
