import { fingerMap, normalizeFingerKey } from "../data/fingerMap"
import { buildLessonConfidence } from "./confidenceEngine"

export const hesitationThresholdMs = 1200
export const slowTransitionThresholdMs = 900

export function getDisplayKey(keyValue) {
  if (keyValue === " ") {
    return "Space"
  }

  if (keyValue === "Backspace") {
    return "Backspace"
  }

  return keyValue || "Next"
}

export function getKeyId(keyValue) {
  const normalizedKey = normalizeFingerKey(keyValue)

  return normalizedKey || "UNKNOWN"
}

export function createAccuracy(correctAttempts, totalAttempts) {
  if (totalAttempts === 0) {
    return 100
  }

  return Math.round((correctAttempts / totalAttempts) * 100)
}

export function sortByLearningPriority(firstItem, secondItem) {
  if (secondItem.priorityScore !== firstItem.priorityScore) {
    return secondItem.priorityScore - firstItem.priorityScore
  }

  if (secondItem.mistakeRate !== firstItem.mistakeRate) {
    return secondItem.mistakeRate - firstItem.mistakeRate
  }

  return secondItem.mistakes - firstItem.mistakes
}

function createKeyStats(attempt) {
  return {
    accuracy: 100,
    attempts: 0,
    averageHesitationMs: 0,
    correct: 0,
    hesitationCount: 0,
    key: getDisplayKey(attempt.expectedKey),
    keyId: getKeyId(attempt.expectedKey),
    mistakeRate: 0,
    mistakes: 0,
    priorityScore: 0,
    repeatedMistakes: 0,
    slowTransitionCount: 0,
    totalHesitationMs: 0,
  }
}

function createFingerStats(fingerId) {
  const finger = fingerMap[fingerId]

  if (!finger) {
    return null
  }

  return {
    accuracy: 100,
    attempts: 0,
    color: finger.color,
    correct: 0,
    fingerId,
    hand: finger.hand,
    homeKey: finger.homeKey,
    label: finger.label,
    mistakeRate: 0,
    mistakes: 0,
    priorityScore: 0,
    problematicReaches: 0,
    reachZone: finger.reachZone,
    shortLabel: finger.shortLabel,
  }
}

function updateKeyPriority(keyStats) {
  keyStats.accuracy = createAccuracy(keyStats.correct, keyStats.attempts)
  keyStats.mistakeRate = Math.round(
    (keyStats.mistakes / keyStats.attempts) * 100
  )
  keyStats.averageHesitationMs =
    keyStats.hesitationCount === 0
      ? 0
      : Math.round(keyStats.totalHesitationMs / keyStats.hesitationCount)
  keyStats.priorityScore =
    keyStats.mistakes * 3 +
    keyStats.repeatedMistakes * 2 +
    keyStats.hesitationCount +
    keyStats.slowTransitionCount
}

function updateFingerPriority(fingerStats) {
  fingerStats.accuracy = createAccuracy(fingerStats.correct, fingerStats.attempts)
  fingerStats.mistakeRate = Math.round(
    (fingerStats.mistakes / fingerStats.attempts) * 100
  )
  fingerStats.priorityScore =
    fingerStats.mistakes * 3 + fingerStats.problematicReaches
}

function getTransitionKey(previousAttempt, attempt) {
  if (!previousAttempt?.expectedKey || !attempt?.expectedKey) {
    return null
  }

  return `${getDisplayKey(previousAttempt.expectedKey)} -> ${getDisplayKey(
    attempt.expectedKey
  )}`
}

export function analyzeAttemptHistory(attemptHistory = []) {
  const statsByKey = new Map()
  const heatByKey = new Map()
  const statsByFinger = new Map()
  const transitionsByPair = new Map()
  let previousAttempt = null
  let previousCorrectAttempt = null

  attemptHistory.forEach((attempt) => {
    const keyId = getKeyId(attempt.expectedKey)
    const keyStats = statsByKey.get(keyId) || createKeyStats(attempt)
    const isRepeatedMistake =
      !attempt.correct &&
      previousAttempt?.index === attempt.index &&
      previousAttempt?.expectedKey === attempt.expectedKey &&
      !previousAttempt.correct
    const hesitationMs =
      previousCorrectAttempt && attempt.timestamp
        ? attempt.timestamp - previousCorrectAttempt.timestamp
        : 0

    keyStats.attempts += 1

    if (attempt.correct) {
      keyStats.correct += 1
    } else {
      keyStats.mistakes += 1

      const heatStats = heatByKey.get(keyId) || {
        actualKeys: {},
        expectedKey: getDisplayKey(attempt.expectedKey),
        keyId,
        mistakes: 0,
      }
      const actualLabel = getDisplayKey(attempt.actualKey)

      heatStats.mistakes += 1
      heatStats.actualKeys[actualLabel] =
        (heatStats.actualKeys[actualLabel] || 0) + 1
      heatByKey.set(keyId, heatStats)
    }

    if (isRepeatedMistake) {
      keyStats.repeatedMistakes += 1
    }

    if (hesitationMs >= hesitationThresholdMs) {
      keyStats.hesitationCount += 1
      keyStats.totalHesitationMs += hesitationMs
    }

    if (hesitationMs >= slowTransitionThresholdMs) {
      keyStats.slowTransitionCount += 1

      const transitionKey = getTransitionKey(previousCorrectAttempt, attempt)

      if (transitionKey) {
        const transitionStats = transitionsByPair.get(transitionKey) || {
          averageMs: 0,
          count: 0,
          fromKey: getDisplayKey(previousCorrectAttempt.expectedKey),
          pair: transitionKey,
          slowCount: 0,
          toKey: getDisplayKey(attempt.expectedKey),
          totalMs: 0,
        }

        transitionStats.count += 1
        transitionStats.totalMs += hesitationMs

        if (hesitationMs >= slowTransitionThresholdMs) {
          transitionStats.slowCount += 1
        }

        transitionStats.averageMs = Math.round(
          transitionStats.totalMs / transitionStats.count
        )
        transitionsByPair.set(transitionKey, transitionStats)
      }
    }

    const expectedFingerIds = attempt.expectedFingerIds || []

    expectedFingerIds.forEach((fingerId) => {
      const fingerStats = statsByFinger.get(fingerId) || createFingerStats(fingerId)

      if (!fingerStats) {
        return
      }

      fingerStats.attempts += 1

      if (attempt.correct) {
        fingerStats.correct += 1
      } else {
        fingerStats.mistakes += 1
      }

      if (!attempt.correct || hesitationMs >= hesitationThresholdMs) {
        fingerStats.problematicReaches += 1
      }

      updateFingerPriority(fingerStats)
      statsByFinger.set(fingerId, fingerStats)
    })

    updateKeyPriority(keyStats)
    statsByKey.set(keyId, keyStats)
    previousAttempt = attempt

    if (attempt.correct) {
      previousCorrectAttempt = attempt
    }
  })

  const keyStats = Array.from(statsByKey.values())
  const fingerStats = Array.from(statsByFinger.values())
  const difficultTransitions = Array.from(transitionsByPair.values())
    .filter((transition) => transition.slowCount > 0)
    .sort((firstItem, secondItem) => {
      if (secondItem.slowCount !== firstItem.slowCount) {
        return secondItem.slowCount - firstItem.slowCount
      }

      return secondItem.averageMs - firstItem.averageMs
    })

  return {
    difficultTransitions,
    fingerStats,
    heatMap: Array.from(heatByKey.values()).sort(
      (firstItem, secondItem) => secondItem.mistakes - firstItem.mistakes
    ),
    keyStats,
    weakFingers: fingerStats
      .filter(
        (fingerStatsItem) =>
          fingerStatsItem.mistakes > 0 || fingerStatsItem.problematicReaches > 0
      )
      .sort(sortByLearningPriority)
      .slice(0, 3),
    weakKeys: keyStats
      .filter(
        (keyStatsItem) =>
          keyStatsItem.mistakes > 0 ||
          keyStatsItem.hesitationCount > 0 ||
          keyStatsItem.slowTransitionCount > 0
      )
      .sort(sortByLearningPriority)
      .slice(0, 4),
  }
}

export function summarizeDrillResult(result = {}) {
  const analysis = analyzeAttemptHistory(result.attemptHistory || [])

  return {
    ...result,
    ...analysis,
    confidence: getCompletionConfidence(result, analysis),
  }
}

export function summarizeLessonResults(stepResults = {}, assessmentResult = null) {
  const results = Object.values(stepResults).filter(Boolean)
  const attemptHistory = results.flatMap((result) => result.attemptHistory || [])
  const totals = results.reduce(
    (summary, result) => ({
      correctAttempts: summary.correctAttempts + (result.correctAttempts || 0),
      incorrectAttempts:
        summary.incorrectAttempts + (result.incorrectAttempts || 0),
      seconds: summary.seconds + (result.seconds || 0),
      totalAttempts: summary.totalAttempts + (result.totalAttempts || 0),
      wpm: Math.max(summary.wpm, result.wpm || 0),
    }),
    {
      correctAttempts: 0,
      incorrectAttempts: 0,
      seconds: 0,
      totalAttempts: 0,
      wpm: assessmentResult?.wpm || 0,
    }
  )
  const accuracy = createAccuracy(totals.correctAttempts, totals.totalAttempts)

  return summarizeDrillResult({
    ...totals,
    accuracy,
    assessmentAccuracy: assessmentResult?.accuracy ?? accuracy,
    attemptHistory,
    retryCount: assessmentResult?.retryCount || 0,
    stepCount: results.length,
  })
}

export function getCompletionConfidence(result = {}, analysis = null) {
  const analyzedResult = analysis || analyzeAttemptHistory(result.attemptHistory || [])

  return buildLessonConfidence(result, analyzedResult)
}
