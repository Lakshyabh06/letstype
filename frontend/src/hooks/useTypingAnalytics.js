import { useMemo } from "react"

import { analyzeAttemptHistory } from "../utils/typingAnalysis"

function buildInsightSummary({ accuracy, currentIndex, isCompleted, weakFingers, weakKeys }) {
  if (isCompleted && weakKeys.length === 0) {
    return {
      tone: "strong",
      title: "Clean pass",
      message: "This drill stayed balanced. Keep the same calm rhythm.",
    }
  }

  if (isCompleted) {
    return {
      tone: "review",
      title: "Review target",
      message: `${weakKeys[0].key} and ${weakFingers[0]?.shortLabel || "one finger"} need the next slow rep.`,
    }
  }

  if (currentIndex === 0) {
    return {
      tone: "ready",
      title: "Ready state",
      message: "Start slow, watch the guide, and let accuracy lead the pace.",
    }
  }

  if (weakKeys.length > 0) {
    return {
      tone: "review",
      title: "Learning signal",
      message: `${weakKeys[0].key} is the current watch key. Reset before pressing it again.`,
    }
  }

  if (accuracy >= 96) {
    return {
      tone: "strong",
      title: "Stable control",
      message: "Accuracy is holding. Keep the hands quiet between reaches.",
    }
  }

  return {
    tone: "steady",
    title: "Settle the pace",
    message: "Accuracy is forming. Slow the next two keys and reset to home.",
  }
}

function buildIndicators({ accuracy, incorrectAttempts, progress, wpm }) {
  return [
    {
      label: "Control",
      value: accuracy >= 96 ? "Stable" : accuracy >= 90 ? "Building" : "Careful",
    },
    {
      label: "Error load",
      value: incorrectAttempts === 0 ? "Clear" : `${incorrectAttempts} miss${incorrectAttempts === 1 ? "" : "es"}`,
    },
    {
      label: "Pace",
      value: wpm > 0 ? `${wpm} WPM` : "Untimed",
    },
    {
      label: "Progress",
      value: `${progress}%`,
    },
  ]
}

function useTypingAnalytics({
  accuracy = 100,
  attemptHistory = [],
  correctAttempts = 0,
  currentIndex = 0,
  incorrectAttempts = 0,
  isCompleted = false,
  progress = 0,
  text = "",
  totalAttempts = 0,
  wpm = 0,
} = {}) {
  return useMemo(() => {
    const analysis = analyzeAttemptHistory(attemptHistory)
    const indicators = buildIndicators({
      accuracy,
      incorrectAttempts,
      progress,
      wpm,
    })

    return {
      ...analysis,
      indicators,
      liveStats: {
        accuracy,
        correctAttempts,
        currentIndex,
        incorrectAttempts,
        progress,
        remaining: Math.max(text.length - currentIndex, 0),
        totalAttempts,
        wpm,
      },
      summary: buildInsightSummary({
        accuracy,
        currentIndex,
        isCompleted,
        weakFingers: analysis.weakFingers,
        weakKeys: analysis.weakKeys,
      }),
    }
  }, [
    accuracy,
    attemptHistory,
    correctAttempts,
    currentIndex,
    incorrectAttempts,
    isCompleted,
    progress,
    text.length,
    totalAttempts,
    wpm,
  ])
}

export default useTypingAnalytics
