import { fingerMap, fingerColumns } from "../data/fingerMap"
import fullKeyboardLayout, { getKeyTokens, normalizeKeyboardKey } from "../data/keyboardLayout"

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function average(values = []) {
  const validValues = values.filter((value) => Number.isFinite(value))

  if (validValues.length === 0) {
    return null
  }

  return Math.round(
    validValues.reduce((total, value) => total + value, 0) / validValues.length
  )
}

function getTrendDirection(values = []) {
  if (values.length < 4) {
    return "forming"
  }

  const recent = average(values.slice(0, Math.ceil(values.length / 2)))
  const older = average(values.slice(Math.ceil(values.length / 2)))

  if (recent === null || older === null || Math.abs(recent - older) < 2) {
    return "steady"
  }

  return recent > older ? "improving" : "softening"
}

function getKeyboardKeyStats(keys = {}) {
  const keyStats = Object.values(keys)

  return fullKeyboardLayout.flatMap((row) =>
    row.keys.map((keyData) => {
      const tokens = getKeyTokens(keyData)
      const stat = keyStats.find((item) =>
        tokens.includes(normalizeKeyboardKey(item.keyId || item.key))
      )
      const attempts = stat?.attempts || 0
      const mistakeRate = stat?.mistakeRate || 0
      const hesitationRate =
        attempts === 0 ? 0 : ((stat?.hesitationCount || 0) / attempts) * 100
      const mastery = attempts === 0 ? 0 : clamp((stat?.accuracy || 0) - hesitationRate * 0.4)
      const weakness = clamp(
        mistakeRate * 0.72 +
          hesitationRate * 0.42 +
          (stat?.repeatedMistakes || 0) * 5 +
          (stat?.slowTransitionCount || 0) * 4
      )

      return {
        ...keyData,
        attempts,
        fingerId: keyData.finger,
        key: keyData.label,
        keyId: tokens[0],
        mastery: Math.round(mastery),
        stat,
        weakness: Math.round(weakness),
      }
    })
  )
}

function getZoneForKeys(keys = []) {
  const normalizedKeys = keys.map((key) => normalizeKeyboardKey(key))

  if (normalizedKeys.some((key) => ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].includes(key))) {
    return "Top row"
  }

  if (normalizedKeys.some((key) => ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"].includes(key))) {
    return "Bottom row"
  }

  if (normalizedKeys.some((key) => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(key))) {
    return "Number row"
  }

  return "Home row"
}

function getWeakKeyClusters(keys = {}, confusionPairs = {}) {
  const weakKeys = Object.values(keys)
    .filter(
      (keyStats) =>
        (keyStats.mistakes || 0) > 0 ||
        (keyStats.hesitationCount || 0) > 0 ||
        (keyStats.slowTransitionCount || 0) > 0
    )
    .sort((firstItem, secondItem) => {
      if ((secondItem.priorityScore || 0) !== (firstItem.priorityScore || 0)) {
        return (secondItem.priorityScore || 0) - (firstItem.priorityScore || 0)
      }

      return (secondItem.mistakes || 0) - (firstItem.mistakes || 0)
    })
  const clusterMap = new Map()

  weakKeys.forEach((keyStats) => {
    const zone = getZoneForKeys([keyStats.keyId || keyStats.key])
    const cluster = clusterMap.get(zone) || {
      accuracy: 100,
      hesitationCount: 0,
      keys: [],
      mistakeCount: 0,
      priority: 0,
      retryCount: 0,
      title: zone,
    }

    cluster.keys.push(keyStats)
    cluster.hesitationCount += keyStats.hesitationCount || 0
    cluster.mistakeCount += keyStats.mistakes || 0
    cluster.priority += keyStats.priorityScore || 0
    cluster.retryCount += keyStats.repeatedMistakes || 0
    cluster.accuracy = average(cluster.keys.map((item) => item.accuracy || 100))
    clusterMap.set(zone, cluster)
  })

  const confusionCluster = Object.values(confusionPairs)
    .filter((pair) => (pair.count || 0) > 0)
    .sort((firstItem, secondItem) => (secondItem.count || 0) - (firstItem.count || 0))
    .slice(0, 3)

  return Array.from(clusterMap.values())
    .sort((firstItem, secondItem) => secondItem.priority - firstItem.priority)
    .slice(0, 4)
    .map((cluster) => ({
      ...cluster,
      confusionPairs: confusionCluster.filter((pair) =>
        cluster.keys.some((keyStats) => pair.expectedKey === keyStats.key)
      ),
    }))
}

function getStrongestZones(fingers = {}) {
  return Object.values(fingers)
    .filter((fingerStats) => (fingerStats.attempts || 0) >= 3)
    .sort((firstItem, secondItem) => {
      if ((secondItem.accuracy || 0) !== (firstItem.accuracy || 0)) {
        return (secondItem.accuracy || 0) - (firstItem.accuracy || 0)
      }

      return (firstItem.problematicReaches || 0) - (secondItem.problematicReaches || 0)
    })
    .slice(0, 3)
    .map((fingerStats) => ({
      ...fingerStats,
      title: `${fingerStats.hand} ${fingerStats.label}`,
    }))
}

function getWeakFingerZones(fingers = {}) {
  return Object.values(fingers)
    .filter(
      (fingerStats) =>
        (fingerStats.mistakes || 0) > 0 || (fingerStats.problematicReaches || 0) > 0
    )
    .sort((firstItem, secondItem) => {
      if ((secondItem.priorityScore || 0) !== (firstItem.priorityScore || 0)) {
        return (secondItem.priorityScore || 0) - (firstItem.priorityScore || 0)
      }

      return (secondItem.mistakeRate || 0) - (firstItem.mistakeRate || 0)
    })
    .slice(0, 4)
    .map((fingerStats) => ({
      ...fingerStats,
      columns: fingerColumns[fingerStats.fingerId] || [],
      finger: fingerMap[fingerStats.fingerId],
      label: `${fingerStats.hand} ${fingerStats.label}`,
    }))
}

function getSessionTrends(sessions = [], confidence = []) {
  const recentSessions = sessions.slice(0, 8)
  const wpmValues = recentSessions.map((session) => session.wpm || 0)
  const accuracyValues = recentSessions.map((session) => session.accuracy || 0)
  const retryValues = recentSessions.map((session) => session.retryCount || 0)
  const recent = recentSessions.slice(0, 3)
  const previous = recentSessions.slice(3, 6)
  const recentAccuracy = average(recent.map((session) => session.accuracy || 0))
  const previousAccuracy = average(previous.map((session) => session.accuracy || 0))
  const recentWpm = average(recent.map((session) => session.wpm || 0))
  const previousWpm = average(previous.map((session) => session.wpm || 0))
  const fatigue =
    recent.length >= 2 &&
    previous.length >= 2 &&
    recentAccuracy !== null &&
    previousAccuracy !== null &&
    recentWpm !== null &&
    previousWpm !== null &&
    recentAccuracy < previousAccuracy - 3 &&
    recentWpm < previousWpm

  return {
    accuracyAverage: average(accuracyValues),
    accuracyDirection: getTrendDirection(accuracyValues),
    confidenceAverage: average(
      confidence.slice(0, 6).map((entry) => entry.confidenceScore)
    ),
    consistency:
      accuracyValues.length < 2
        ? "forming"
        : Math.max(...accuracyValues) - Math.min(...accuracyValues) <= 6
          ? "steady"
          : "variable",
    fatigue,
    retryAverage: average(retryValues) || 0,
    sessionCount: sessions.length,
    visibleSessions: recentSessions,
    wpmAverage: average(wpmValues),
    wpmDirection: getTrendDirection(wpmValues),
  }
}

export function calculateAnalytics(progress = {}) {
  const adaptive = progress.adaptive || {}
  const sessions = progress.sessions || []
  const confidence = adaptive.lessonConfidence || []
  const keyboardStats = getKeyboardKeyStats(adaptive.keys || {})
  const weakKeyClusters = getWeakKeyClusters(
    adaptive.keys || {},
    adaptive.confusionPairs || {}
  )
  const weakFingerZones = getWeakFingerZones(adaptive.fingers || {})
  const strongestZones = getStrongestZones(adaptive.fingers || {})

  return {
    confidence,
    confusionPairs: Object.values(adaptive.confusionPairs || {})
      .sort((firstItem, secondItem) => (secondItem.count || 0) - (firstItem.count || 0))
      .slice(0, 5),
    keyboardStats,
    mastery: {
      keyboardAverage: average(
        keyboardStats
          .filter((keyStats) => keyStats.attempts > 0)
          .map((keyStats) => keyStats.mastery)
      ),
      strongestZones,
      weakFingerZones,
      weakKeyClusters,
    },
    sessions,
    trends: getSessionTrends(sessions, confidence),
  }
}
