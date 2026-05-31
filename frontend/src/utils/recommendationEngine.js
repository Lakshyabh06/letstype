function formatKeyList(keys = []) {
  if (keys.length === 0) {
    return "review keys"
  }

  if (keys.length === 1) {
    return keys[0]
  }

  return `${keys.slice(0, -1).join(", ")} and ${keys[keys.length - 1]}`
}

function getClusterRecommendation(cluster) {
  if (!cluster) {
    return null
  }

  const keys = cluster.keys.slice(0, 4).map((keyStats) => keyStats.key)

  if (cluster.title === "Bottom row") {
    return {
      action: "Bottom row needs reinforcement",
      detail: `${formatKeyList(keys)} should be practiced with slower resets to home row.`,
      id: "cluster-bottom-row",
      priority: cluster.priority + 4,
      tone: "review",
      type: "weak-cluster",
    }
  }

  if (cluster.title === "Top row") {
    return {
      action: "Reach control is drifting on the top row",
      detail: `${formatKeyList(keys)} need calm reach-and-return repetitions.`,
      id: "cluster-top-row",
      priority: cluster.priority + 3,
      tone: "steady",
      type: "weak-cluster",
    }
  }

  return {
    action: `Reinforce ${cluster.title.toLowerCase()} precision`,
    detail: `${formatKeyList(keys)} are carrying the strongest review signal.`,
    id: `cluster-${cluster.title.toLowerCase().replace(/\s+/g, "-")}`,
    priority: cluster.priority,
    tone: "review",
    type: "weak-cluster",
  }
}

function getFingerRecommendation(fingerZone) {
  if (!fingerZone) {
    return null
  }

  const label = `${fingerZone.hand.toLowerCase()} ${fingerZone.label.toLowerCase()}`

  return {
    action: `${fingerZone.hand}-hand reach accuracy is dropping`,
    detail: `The ${label} zone needs a slower setup before speed work.`,
    fingerId: fingerZone.fingerId,
    id: `finger-zone-${fingerZone.fingerId}`,
    priority: (fingerZone.priorityScore || 0) + 3,
    tone: "steady",
    type: "weak-finger",
  }
}

function getShiftRecommendation(keyboardStats = []) {
  const shiftedKeys = keyboardStats.filter((keyStats) =>
    [";", "'", ",", ".", "/", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(
      keyStats.key
    )
  )
  const shiftLoad = shiftedKeys.reduce(
    (total, keyStats) =>
      total + (keyStats.stat?.slowTransitionCount || 0) + (keyStats.stat?.mistakes || 0),
    0
  )

  if (shiftLoad < 2) {
    return null
  }

  return {
    action: "Practice uppercase coordination",
    detail: "Shift and punctuation movement are showing a small timing cost.",
    id: "shift-coordination",
    priority: shiftLoad + 2,
    tone: "steady",
    type: "shift-coordination",
  }
}

function getPunctuationRecommendation(confusionPairs = []) {
  const punctuationPair = confusionPairs.find((pair) =>
    /[;:'",.<>/?[\]{}\\|]/.test(`${pair.expectedKey}${pair.actualKey}`)
  )

  if (!punctuationPair) {
    return null
  }

  return {
    action: "Recommended next drill: punctuation rhythm",
    detail: `${punctuationPair.expectedKey} is being mixed with ${punctuationPair.actualKey}. Isolate the pair before returning to words.`,
    id: "punctuation-rhythm",
    priority: (punctuationPair.count || 0) + 5,
    tone: "review",
    type: "punctuation",
  }
}

function getFatigueRecommendation(trends = {}) {
  if (!trends.fatigue) {
    return null
  }

  return {
    action: "Shorten the next practice block",
    detail: "Recent pace and accuracy dipped together, so consistency work should come before speed.",
    id: "fatigue-pattern",
    priority: 5,
    tone: "reinforce",
    type: "fatigue",
  }
}

export function buildPersonalizedRecommendations(analytics = {}) {
  const recommendations = [
    getClusterRecommendation(analytics.mastery?.weakKeyClusters?.[0]),
    getFingerRecommendation(analytics.mastery?.weakFingerZones?.[0]),
    getShiftRecommendation(analytics.keyboardStats),
    getPunctuationRecommendation(analytics.confusionPairs),
    getFatigueRecommendation(analytics.trends),
  ].filter(Boolean)

  return recommendations
    .sort((firstItem, secondItem) => secondItem.priority - firstItem.priority)
    .slice(0, 4)
}
