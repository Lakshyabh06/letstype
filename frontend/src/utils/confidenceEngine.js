export const confidenceLabels = {
  excellent: "Excellent",
  stable: "Stable",
  needsReinforcement: "Needs Reinforcement",
  weakAreaDetected: "Weak Area Detected",
}

export function calculateConfidenceScore(result = {}, analysis = {}) {
  const retryCount = result.retryCount || 0
  const accuracy = result.assessmentAccuracy ?? result.accuracy ?? 100
  const incorrectAttempts = result.incorrectAttempts || 0
  const totalAttempts = result.totalAttempts || 0
  const errorLoad =
    totalAttempts === 0 ? 0 : Math.round((incorrectAttempts / totalAttempts) * 100)
  const hesitationLoad =
    analysis.weakKeys?.reduce(
      (total, keyStats) =>
        total + (keyStats.hesitationCount || 0) + (keyStats.slowTransitionCount || 0),
      0
    ) || 0
  const weakFingerLoad =
    analysis.weakFingers?.reduce(
      (total, fingerStats) => total + (fingerStats.problematicReaches || 0),
      0
    ) || 0
  let score =
    accuracy -
    retryCount * 7 -
    errorLoad * 0.4 -
    hesitationLoad * 2 -
    weakFingerLoad * 0.8

  if (incorrectAttempts === 0) {
    score += 4
  }

  if ((result.seconds || 0) > 0 && (result.wpm || 0) > 0) {
    score += 2
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getConfidenceLabel(score, analysis = {}, result = {}) {
  const weakKeyCount = analysis.weakKeys?.length || 0
  const weakFingerCount = analysis.weakFingers?.length || 0
  const retryCount = result.retryCount || 0

  if (score >= 96 && weakKeyCount === 0 && retryCount === 0) {
    return confidenceLabels.excellent
  }

  if (score >= 88 && weakKeyCount <= 2) {
    return confidenceLabels.stable
  }

  if (score < 78 || weakFingerCount >= 2 || weakKeyCount >= 4) {
    return confidenceLabels.weakAreaDetected
  }

  return confidenceLabels.needsReinforcement
}

export function getConfidenceTone(label) {
  if (label === confidenceLabels.excellent) {
    return "strong"
  }

  if (label === confidenceLabels.stable) {
    return "steady"
  }

  if (label === confidenceLabels.weakAreaDetected) {
    return "review"
  }

  return "reinforce"
}

export function buildLessonConfidence(result = {}, analysis = {}) {
  const score = calculateConfidenceScore(result, analysis)
  const label = getConfidenceLabel(score, analysis, result)

  return {
    label,
    score,
    tone: getConfidenceTone(label),
  }
}
