import { fingerMap } from "../data/fingerMap"

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function formatKeyList(keys = []) {
  if (keys.length === 0) {
    return "review keys"
  }

  if (keys.length === 1) {
    return keys[0]
  }

  return `${keys.slice(0, -1).join(", ")} and ${keys[keys.length - 1]}`
}

function getReachLabel(keys = []) {
  const normalizedKeys = keys.map((key) => String(key).toLowerCase())

  if (normalizedKeys.some((key) => ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].includes(key))) {
    return "top-row reaches"
  }

  if (normalizedKeys.some((key) => ["z", "x", "c", "v", "b", "n", "m"].includes(key))) {
    return "bottom-row reaches"
  }

  if (normalizedKeys.some((key) => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(key))) {
    return "number-row reaches"
  }

  return "home-row control"
}

function buildKeyRecommendation(adaptive = {}) {
  const keys = (adaptive.weakKeys || []).slice(0, 3).map((keyStats) => keyStats.key)

  if (keys.length === 0) {
    return null
  }

  const reachLabel = getReachLabel(keys)

  return {
    action: `Practice ${reachLabel} again`,
    detail: `${formatKeyList(keys)} are asking for slower, cleaner repetitions.`,
    id: `keys-${keys.join("-")}`,
    keys,
    priority: adaptive.weakKeys[0]?.priorityScore || 1,
    tone: "review",
    type: "weak-keys",
  }
}

function buildFingerRecommendation(adaptive = {}) {
  const [fingerStats] = adaptive.weakFingers || []

  if (!fingerStats) {
    return null
  }

  const finger = fingerMap[fingerStats.fingerId]
  const label = finger
    ? `${finger.hand.toLowerCase()} ${finger.label.toLowerCase()}`
    : "one finger"

  return {
    action: `Slow the ${label} reach`,
    detail: `${fingerStats.reachZone || "This reach"} has shown inconsistent control.`,
    fingerId: fingerStats.fingerId,
    id: `finger-${fingerStats.fingerId}`,
    priority: fingerStats.priorityScore || 1,
    tone: "steady",
    type: "finger-control",
  }
}

function buildConfidenceRecommendation(adaptive = {}) {
  const trend = adaptive.performanceTrend

  if (
    !trend ||
    !["Needs Reinforcement", "Weak Area Detected"].includes(
      trend.confidenceLabel
    )
  ) {
    return null
  }

  return {
    action: "Repeat one focused review pass",
    detail: "Recent completion confidence is lower than accuracy alone suggests.",
    id: "confidence-review",
    priority: 4,
    tone: "review",
    type: "confidence",
  }
}

function buildTransitionRecommendation(adaptive = {}) {
  const [transition] = adaptive.difficultTransitions || []

  if (!transition) {
    return null
  }

  return {
    action: `Smooth ${transition.pair}`,
    detail: `This transition is averaging ${transition.averageMs}ms between clean presses.`,
    id: `transition-${transition.pair}`,
    priority: transition.slowCount || 1,
    tone: "steady",
    transition,
    type: "transition",
  }
}

export function buildAdaptiveRecommendations(adaptive = {}) {
  return unique([
    buildKeyRecommendation(adaptive),
    buildFingerRecommendation(adaptive),
    buildTransitionRecommendation(adaptive),
    buildConfidenceRecommendation(adaptive),
  ])
    .sort((firstItem, secondItem) => secondItem.priority - firstItem.priority)
    .slice(0, 3)
}

export function getAdaptiveSummary(adaptive = {}) {
  const weakKeyCount = adaptive.weakKeys?.length || 0
  const weakFingerCount = adaptive.weakFingers?.length || 0

  if ((adaptive.totalSessions || 0) === 0) {
    return {
      detail: "Adaptive guidance will appear after the first guided session.",
      title: "Ready to learn your rhythm",
      tone: "ready",
    }
  }

  if (weakKeyCount === 0 && weakFingerCount === 0) {
    return {
      detail: "Recent lessons show clean control without a strong review signal.",
      title: "Stable foundation",
      tone: "strong",
    }
  }

  if (weakKeyCount > 0) {
    const keys = adaptive.weakKeys.slice(0, 3).map((keyStats) => keyStats.key)

    return {
      detail: `${formatKeyList(keys)} will be useful in upcoming reinforcement.`,
      title: "A gentle review target is forming",
      tone: "review",
    }
  }

  return {
    detail: "Finger control needs slightly slower reaches before speed work.",
    title: "Finger balance is still settling",
    tone: "steady",
  }
}

export function createAdaptiveReviewDraft(recommendation, adaptive = {}) {
  if (!recommendation) {
    return null
  }

  const keys = recommendation.keys || adaptive.weakKeys?.slice(0, 3).map((keyStats) => keyStats.key) || []

  return {
    description:
      recommendation.type === "transition"
        ? "A future review drill can isolate this movement before returning to lesson text."
        : "A future review drill can blend these keys with recent course material.",
    focusKeys: keys,
    label: "Review foundation",
    title: recommendation.action,
  }
}
