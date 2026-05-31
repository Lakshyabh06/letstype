import { calculateAnalytics } from "./analyticsCalculator"
import { buildPersonalizedRecommendations } from "./recommendationEngine"
import { createAccuracy } from "./typingAnalysis"

function mergeKeyStats(currentKeys = {}, keyStats = []) {
  const nextKeys = { ...currentKeys }

  keyStats.forEach((keyStat) => {
    const keyId = keyStat.keyId

    if (!keyId) {
      return
    }

    const current = nextKeys[keyId] || {
      attempts: 0,
      correct: 0,
      hesitationCount: 0,
      key: keyStat.key,
      keyId,
      mistakes: 0,
      repeatedMistakes: 0,
      slowTransitionCount: 0,
      totalHesitationMs: 0,
    }
    const merged = {
      ...current,
      attempts: current.attempts + (keyStat.attempts || 0),
      correct: current.correct + (keyStat.correct || 0),
      hesitationCount:
        current.hesitationCount + (keyStat.hesitationCount || 0),
      mistakes: current.mistakes + (keyStat.mistakes || 0),
      repeatedMistakes:
        current.repeatedMistakes + (keyStat.repeatedMistakes || 0),
      slowTransitionCount:
        current.slowTransitionCount + (keyStat.slowTransitionCount || 0),
      totalHesitationMs:
        current.totalHesitationMs + (keyStat.totalHesitationMs || 0),
    }

    merged.accuracy = createAccuracy(merged.correct, merged.attempts)
    merged.mistakeRate =
      merged.attempts === 0
        ? 0
        : Math.round((merged.mistakes / merged.attempts) * 100)
    merged.averageHesitationMs =
      merged.hesitationCount === 0
        ? 0
        : Math.round(merged.totalHesitationMs / merged.hesitationCount)
    merged.priorityScore =
      merged.mistakes * 3 +
      merged.repeatedMistakes * 2 +
      merged.hesitationCount +
      merged.slowTransitionCount

    nextKeys[keyId] = merged
  })

  return nextKeys
}

function mergeFingerStats(currentFingers = {}, fingerStats = []) {
  const nextFingers = { ...currentFingers }

  fingerStats.forEach((fingerStat) => {
    const fingerId = fingerStat.fingerId

    if (!fingerId) {
      return
    }

    const current = nextFingers[fingerId] || {
      attempts: 0,
      color: fingerStat.color,
      correct: 0,
      fingerId,
      hand: fingerStat.hand,
      homeKey: fingerStat.homeKey,
      label: fingerStat.label,
      mistakes: 0,
      problematicReaches: 0,
      reachZone: fingerStat.reachZone,
      shortLabel: fingerStat.shortLabel,
    }
    const merged = {
      ...current,
      attempts: current.attempts + (fingerStat.attempts || 0),
      correct: current.correct + (fingerStat.correct || 0),
      mistakes: current.mistakes + (fingerStat.mistakes || 0),
      problematicReaches:
        current.problematicReaches + (fingerStat.problematicReaches || 0),
    }

    merged.accuracy = createAccuracy(merged.correct, merged.attempts)
    merged.mistakeRate =
      merged.attempts === 0
        ? 0
        : Math.round((merged.mistakes / merged.attempts) * 100)
    merged.priorityScore = merged.mistakes * 3 + merged.problematicReaches

    nextFingers[fingerId] = merged
  })

  return nextFingers
}

function mergeConfusionPairs(currentPairs = {}, heatMap = []) {
  const nextPairs = { ...currentPairs }

  heatMap.forEach((heatStats) => {
    Object.entries(heatStats.actualKeys || {}).forEach(([actualKey, count]) => {
      const pairId = `${heatStats.expectedKey}->${actualKey}`
      const current = nextPairs[pairId] || {
        actualKey,
        count: 0,
        expectedKey: heatStats.expectedKey,
        id: pairId,
        keyId: heatStats.keyId,
      }

      nextPairs[pairId] = {
        ...current,
        count: current.count + count,
      }
    })
  })

  return nextPairs
}

function mergeTransitions(currentTransitions = {}, transitions = []) {
  const nextTransitions = { ...currentTransitions }

  transitions.forEach((transition) => {
    const pair = transition.pair

    if (!pair) {
      return
    }

    const current = nextTransitions[pair] || {
      count: 0,
      fromKey: transition.fromKey,
      pair,
      slowCount: 0,
      toKey: transition.toKey,
      totalMs: 0,
    }
    const merged = {
      ...current,
      count: current.count + (transition.count || 0),
      slowCount: current.slowCount + (transition.slowCount || 0),
      totalMs: current.totalMs + (transition.totalMs || 0),
    }

    merged.averageMs =
      merged.count === 0 ? 0 : Math.round(merged.totalMs / merged.count)
    nextTransitions[pair] = merged
  })

  return nextTransitions
}

function buildPracticeAdaptive(practiceSessions = [], baseAdaptive = {}) {
  return practiceSessions.reduce(
    (adaptive, session) => ({
      ...adaptive,
      confusionPairs: mergeConfusionPairs(
        adaptive.confusionPairs,
        session.heatMap
      ),
      fingers: mergeFingerStats(adaptive.fingers, session.fingerStats),
      keys: mergeKeyStats(adaptive.keys, session.keyStats),
      transitions: mergeTransitions(
        adaptive.transitions,
        session.difficultTransitions
      ),
    }),
    {
      confusionPairs: { ...(baseAdaptive.confusionPairs || {}) },
      difficultKeys: [...(baseAdaptive.difficultKeys || [])],
      fingers: { ...(baseAdaptive.fingers || {}) },
      keys: { ...(baseAdaptive.keys || {}) },
      lessonConfidence: [...(baseAdaptive.lessonConfidence || [])],
      retryHistory: [...(baseAdaptive.retryHistory || [])],
      transitions: { ...(baseAdaptive.transitions || {}) },
      version: 1,
    }
  )
}

export function buildPracticeAnalytics(progress = {}, practiceProgress = {}) {
  const practiceSessions = Array.isArray(practiceProgress.sessions)
    ? practiceProgress.sessions
    : []
  const combinedProgress = {
    ...progress,
    adaptive: buildPracticeAdaptive(practiceSessions, progress.adaptive),
    sessions: [
      ...practiceSessions.map((session) => ({
        ...session,
        summaryType: session.summaryType || "practice-session",
      })),
      ...(progress.sessions || []),
    ],
  }
  const analytics = calculateAnalytics(combinedProgress)

  return {
    ...analytics,
    recommendations: buildPersonalizedRecommendations(analytics),
  }
}
