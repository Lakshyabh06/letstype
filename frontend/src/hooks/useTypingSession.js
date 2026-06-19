import { useCallback, useEffect, useMemo, useState } from "react"

import {
  readPracticeSnapshot,
  writePracticeSnapshot,
} from "../store/progressStore"
import { createSession } from "../api/sessionService"
import { syncOrQueue } from "../api/syncQueue"
import useAuth from "./useAuth"

function toDateKey(value = new Date()) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getPreviousDateKey(value = new Date()) {
  const date = new Date(value)

  date.setDate(date.getDate() - 1)

  return toDateKey(date)
}

function createEmptyPracticeProgress() {
  return {
    bestScores: {},
    sessions: [],
    streak: {
      best: 0,
      current: 0,
      lastPracticeDate: null,
    },
    totalXP: 0,
    version: 1,
  }
}

function readPracticeProgress() {
  const parsed = readPracticeSnapshot(null)

  return {
    ...createEmptyPracticeProgress(),
    ...(parsed && typeof parsed === "object" ? parsed : {}),
    sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : [],
    streak:
      parsed?.streak && typeof parsed.streak === "object"
        ? { ...createEmptyPracticeProgress().streak, ...parsed.streak }
        : createEmptyPracticeProgress().streak,
  }
}

function updateStreak(currentStreak = {}, completedAt) {
  const todayKey = toDateKey(completedAt)
  const yesterdayKey = getPreviousDateKey(completedAt)

  if (currentStreak.lastPracticeDate === todayKey) {
    return currentStreak
  }

  const nextCurrent =
    currentStreak.lastPracticeDate === yesterdayKey
      ? (currentStreak.current || 0) + 1
      : 1

  return {
    best: Math.max(currentStreak.best || 0, nextCurrent),
    current: nextCurrent,
    lastPracticeDate: todayKey,
  }
}

function updateBestScores(bestScores = {}, session) {
  const currentBest = bestScores[session.modeId]

  if (currentBest && currentBest.wpm > session.wpm) {
    return bestScores
  }

  return {
    ...bestScores,
    [session.modeId]: {
      accuracy: session.accuracy,
      completedAt: session.completedAt,
      modeLabel: session.modeLabel,
      rawWpm: session.rawWpm,
      wpm: session.wpm,
    },
  }
}

function getImprovementPattern(sessions = []) {
  const recent = sessions.slice(0, 4)
  const previous = sessions.slice(4, 8)

  if (recent.length < 2 || previous.length < 2) {
    return "Building baseline"
  }

  const recentWpm =
    recent.reduce((total, session) => total + session.wpm, 0) / recent.length
  const previousWpm =
    previous.reduce((total, session) => total + session.wpm, 0) /
    previous.length

  if (recentWpm > previousWpm + 3) {
    return "Speed improving"
  }

  if (recentWpm < previousWpm - 3) {
    return "Consolidating control"
  }

  return "Stable progression"
}

function useTypingSession() {
  const auth = useAuth()
  const [practiceProgress, setPracticeProgress] = useState(readPracticeProgress)

  useEffect(() => {
    writePracticeSnapshot(practiceProgress)
  }, [practiceProgress])

  const recordSession = useCallback((session) => {
    let recordedSession = session

    setPracticeProgress((currentProgress) => {
      const nextSession = {
        ...session,
        cumulativeXP: (currentProgress.totalXP || 0) + (session.xpEarned || 0),
      }

      recordedSession = nextSession

      return {
        ...currentProgress,
        bestScores: updateBestScores(currentProgress.bestScores, nextSession),
        sessions: [nextSession, ...currentProgress.sessions].slice(0, 80),
        streak: updateStreak(currentProgress.streak, nextSession.completedAt),
        totalXP: (currentProgress.totalXP || 0) + (nextSession.xpEarned || 0),
      }
    })

    if (auth.isAuthenticated) {
      syncOrQueue("session", session, () => createSession(session)).catch(() => {
        // Practice history is already cached locally; retryable failures are queued.
      })
    }

    return recordedSession
  }, [auth.isAuthenticated])

  return useMemo(
    () => ({
      bestScores: practiceProgress.bestScores,
      improvementPattern: getImprovementPattern(practiceProgress.sessions),
      practiceProgress,
      recentSessions: practiceProgress.sessions.slice(0, 8),
      recordSession,
      streak: practiceProgress.streak,
      totalXP: practiceProgress.totalXP,
    }),
    [practiceProgress, recordSession]
  )
}

export default useTypingSession
