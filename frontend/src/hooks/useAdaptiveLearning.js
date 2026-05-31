import { useMemo } from "react"

import {
  buildAdaptiveRecommendations,
  getAdaptiveSummary,
} from "../utils/adaptiveRecommendations"

function sortByPriority(firstItem, secondItem) {
  if (secondItem.priorityScore !== firstItem.priorityScore) {
    return secondItem.priorityScore - firstItem.priorityScore
  }

  return secondItem.mistakes - firstItem.mistakes
}

function getPerformanceTrend(progress = {}) {
  const sessions = progress.sessions || []
  const confidenceRecords = progress.adaptive?.lessonConfidence || []
  const recentSessions = sessions.slice(0, 6)
  const recentConfidence = confidenceRecords.slice(0, 4)
  const averageAccuracy =
    recentSessions.length === 0
      ? null
      : Math.round(
          recentSessions.reduce(
            (total, session) => total + (session.accuracy || 0),
            0
          ) / recentSessions.length
        )
  const averageConfidence =
    recentConfidence.length === 0
      ? null
      : Math.round(
          recentConfidence.reduce(
            (total, entry) => total + (entry.confidenceScore || 0),
            0
          ) / recentConfidence.length
        )
  const retryCount = recentSessions.reduce(
    (total, session) => total + (session.retryCount || 0),
    0
  )
  const olderAccuracy = sessions.slice(6, 12)
  const previousAverageAccuracy =
    olderAccuracy.length === 0
      ? null
      : Math.round(
          olderAccuracy.reduce(
            (total, session) => total + (session.accuracy || 0),
            0
          ) / olderAccuracy.length
        )

  return {
    averageAccuracy,
    averageConfidence,
    confidenceLabel:
      averageConfidence === null
        ? "Unknown"
        : averageConfidence >= 96
          ? "Excellent"
          : averageConfidence >= 88
            ? "Stable"
            : averageConfidence >= 78
              ? "Needs Reinforcement"
              : "Weak Area Detected",
    improvement:
      averageAccuracy !== null && previousAverageAccuracy !== null
        ? averageAccuracy - previousAverageAccuracy
        : null,
    retryCount,
  }
}

function normalizeAdaptive(progress = {}) {
  const adaptive = progress.adaptive || {}
  const weakKeys = Object.values(adaptive.keys || {})
    .filter(
      (keyStats) =>
        keyStats.mistakes > 0 ||
        keyStats.hesitationCount > 0 ||
        keyStats.slowTransitionCount > 0
    )
    .sort(sortByPriority)
    .slice(0, 5)
  const weakFingers = Object.values(adaptive.fingers || {})
    .filter(
      (fingerStats) =>
        fingerStats.mistakes > 0 || fingerStats.problematicReaches > 0
    )
    .sort(sortByPriority)
    .slice(0, 4)
  const difficultTransitions = Object.values(adaptive.transitions || {})
    .filter((transition) => transition.slowCount > 0)
    .sort((firstItem, secondItem) => {
      if (secondItem.slowCount !== firstItem.slowCount) {
        return secondItem.slowCount - firstItem.slowCount
      }

      return secondItem.averageMs - firstItem.averageMs
    })
    .slice(0, 4)
  const performanceTrend = getPerformanceTrend(progress)
  const normalized = {
    difficultTransitions,
    lessonConfidence: adaptive.lessonConfidence || [],
    performanceTrend,
    totalSessions: progress.sessions?.length || 0,
    weakFingers,
    weakKeys,
  }

  return {
    ...normalized,
    recommendations: buildAdaptiveRecommendations(normalized),
    summary: getAdaptiveSummary(normalized),
  }
}

function useAdaptiveLearning(progress) {
  return useMemo(() => normalizeAdaptive(progress), [progress])
}

export default useAdaptiveLearning
