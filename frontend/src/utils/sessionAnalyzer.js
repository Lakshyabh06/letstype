import { analyzeAttemptHistory } from "./typingAnalysis"
import {
  calculateTypingSnapshot,
  summarizeWeakKeys,
} from "./typingMetrics"

function getPracticeXP({ accuracy, duration, typingConsistency, wpm }) {
  let xp = 20 + Math.round(Math.min(duration, 120) / 6)

  if (accuracy >= 96) {
    xp += 30
  } else if (accuracy >= 90) {
    xp += 16
  }

  if (wpm >= 45) {
    xp += 16
  }

  if ((typingConsistency?.score || 0) >= 80) {
    xp += 14
  }

  return xp
}

function getImprovementInsight({ accuracy, mistakes, typingConsistency, wpm }) {
  if (accuracy >= 96 && typingConsistency.score >= 80) {
    return "Your control and rhythm stayed aligned. Add speed only gradually."
  }

  if (mistakes > 8) {
    return "Accuracy is the best next lever. Slow the first pass and keep returns relaxed."
  }

  if (typingConsistency.score > 0 && typingConsistency.score < 65) {
    return "Your pace changed during the run. Aim for smaller, more even bursts."
  }

  if (wpm < 28) {
    return "The foundation is forming. Keep the next session short and precise."
  }

  return "A balanced session. Repeat this mode once, then rotate to a targeted drill."
}

export function analyzePracticeSession({
  analytics,
  attemptHistory = [],
  duration = 60,
  elapsedSeconds = 0,
  keyEvents = [],
  mode,
  targetText = "",
  typedText = "",
} = {}) {
  const snapshot = calculateTypingSnapshot({
    attemptHistory,
    elapsedSeconds,
    keyEvents,
    targetText,
    typedText,
  })
  const analysis = analyzeAttemptHistory(attemptHistory)
  const weakKeySummary = summarizeWeakKeys(attemptHistory)
  const recommendation = analytics?.recommendations?.[0]
  const xpEarned = getPracticeXP({
    accuracy: snapshot.accuracy,
    duration,
    typingConsistency: snapshot.typingConsistency,
    wpm: snapshot.wpm,
  })

  return {
    ...snapshot,
    ...analysis,
    adaptiveRecommendations: [
      weakKeySummary[0]
        ? `Give ${weakKeySummary[0].key} a slow isolation pass next.`
        : "Repeat this mode once to reinforce the rhythm.",
      recommendation?.action,
    ].filter(Boolean),
    completedAt: new Date().toISOString(),
    duration,
    elapsedSeconds,
    id: `practice-${Date.now()}`,
    improvementInsight: getImprovementInsight(snapshot),
    modeId: mode?.id || "focus",
    modeLabel: mode?.label || "Focus Mode",
    targetText,
    typedText,
    weakKeySummary,
    xpEarned,
  }
}
