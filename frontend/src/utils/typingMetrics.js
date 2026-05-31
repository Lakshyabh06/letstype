export function clampMetric(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

export function getWordRanges(text = "") {
  const ranges = []
  const matcher = /\S+/g
  let match = matcher.exec(text)

  while (match) {
    ranges.push({
      end: match.index + match[0].length,
      index: ranges.length,
      start: match.index,
      value: match[0],
    })
    match = matcher.exec(text)
  }

  return ranges
}

export function getActiveWordIndex(wordRanges = [], currentIndex = 0) {
  if (wordRanges.length === 0) {
    return 0
  }

  const activeRange = wordRanges.find(
    (range) => currentIndex >= range.start && currentIndex <= range.end
  )

  if (activeRange) {
    return activeRange.index
  }

  return wordRanges.findIndex((range) => currentIndex < range.start)
}

export function calculateTypingSnapshot({
  attemptHistory = null,
  elapsedSeconds = 0,
  keyEvents = [],
  targetText = "",
  typedText = "",
} = {}) {
  const typedLength = typedText.length
  const attemptedLength = Array.isArray(attemptHistory)
    ? attemptHistory.length
    : typedLength
  const elapsedMinutes = Math.max(elapsedSeconds / 60, 1 / 60)
  let correctCharacters = 0
  let mistakes = Array.isArray(attemptHistory)
    ? attemptHistory.filter((attempt) => !attempt.correct).length
    : 0

  for (let index = 0; index < typedLength; index += 1) {
    if (typedText[index] === targetText[index]) {
      correctCharacters += 1
    } else if (!Array.isArray(attemptHistory)) {
      mistakes += 1
    }
  }

  const accuracy =
    attemptedLength === 0
      ? 100
      : Math.round((correctCharacters / attemptedLength) * 100)
  const wpm =
    elapsedSeconds < 1
      ? 0
      : Math.round(correctCharacters / 5 / elapsedMinutes)
  const rawWpm =
    elapsedSeconds < 1
      ? 0
      : Math.round(Math.max(typedLength, keyEvents.length) / 5 / elapsedMinutes)
  const progress =
    targetText.length === 0
      ? 0
      : clampMetric(Math.round((typedLength / targetText.length) * 100))

  return {
    accuracy,
    correctCharacters,
    currentIndex: typedLength,
    mistakes,
    progress,
    rawWpm,
    typedLength,
    typingConsistency: calculateConsistency(keyEvents),
    wpm,
  }
}

export function calculateConsistency(keyEvents = []) {
  const intervals = []

  for (let index = 1; index < keyEvents.length; index += 1) {
    const interval = keyEvents[index].timestamp - keyEvents[index - 1].timestamp

    if (interval > 0 && interval < 5000) {
      intervals.push(interval)
    }
  }

  if (intervals.length < 4) {
    return {
      label: "Forming",
      score: 0,
    }
  }

  const average =
    intervals.reduce((total, interval) => total + interval, 0) /
    intervals.length
  const variance =
    intervals.reduce(
      (total, interval) => total + Math.pow(interval - average, 2),
      0
    ) / intervals.length
  const deviation = Math.sqrt(variance)
  const score = clampMetric(Math.round(100 - (deviation / average) * 85))

  return {
    label: score >= 82 ? "Steady" : score >= 64 ? "Variable" : "Uneven",
    score,
  }
}

export function summarizeWeakKeys(attemptHistory = []) {
  const weakKeyMap = new Map()

  attemptHistory.forEach((attempt) => {
    if (attempt.correct) {
      return
    }

    const key = attempt.expectedKey || "Unknown"
    const current = weakKeyMap.get(key) || {
      key,
      misses: 0,
    }

    weakKeyMap.set(key, {
      ...current,
      misses: current.misses + 1,
    })
  })

  return Array.from(weakKeyMap.values())
    .sort((firstItem, secondItem) => secondItem.misses - firstItem.misses)
    .slice(0, 6)
}
