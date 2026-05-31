import { useCallback, useEffect, useMemo, useState } from "react"

import { evaluateAchievementUnlocks } from "../utils/achievementEngine"
import { calculateXPReward } from "../utils/xpCalculator"
import { createEmptyGamificationProgress } from "./useGamification"
import {
  updateLessonStreak,
  updatePracticeStreak,
} from "./useStreakTracking"
import { createAccuracy, summarizeDrillResult } from "../utils/typingAnalysis"
import { readStorage, writeStorage } from "../utils/storageManager"
import {
  readProgressSnapshot,
  writeProgressSnapshot,
} from "../store/progressStore"

const legacyCompletedLessonsKey = "typelearner.completedLessons"

function readJson(key, fallbackValue) {
  return readStorage(key, fallbackValue)
}

function createEmptyProgress() {
  return {
    version: 1,
    adaptive: createEmptyAdaptiveProgress(),
    completedLessonIds: [],
    gamification: createEmptyGamificationProgress(),
    sessions: [],
    accuracyHistory: [],
    streak: {
      best: 0,
      current: 0,
      lastPracticeDate: null,
    },
  }
}

function createEmptyAdaptiveProgress() {
  return {
    confusionPairs: {},
    difficultKeys: [],
    fingers: {},
    keys: {},
    lessonConfidence: [],
    retryHistory: [],
    transitions: {},
    version: 1,
  }
}

function normalizeProgress(storedProgress, lessons) {
  const baselineCompletedIds = lessons
    .filter((lesson) => lesson.status === "completed")
    .map((lesson) => lesson.id)
  const legacyCompletedIds = readJson(legacyCompletedLessonsKey, [])
  const progress =
    storedProgress && typeof storedProgress === "object"
      ? storedProgress
      : createEmptyProgress()

  return {
    ...createEmptyProgress(),
    ...progress,
    completedLessonIds: Array.from(
      new Set([
        ...baselineCompletedIds,
        ...(Array.isArray(legacyCompletedIds) ? legacyCompletedIds : []),
        ...(Array.isArray(progress.completedLessonIds)
          ? progress.completedLessonIds
          : []),
      ])
    ),
    sessions: Array.isArray(progress.sessions) ? progress.sessions : [],
    accuracyHistory: Array.isArray(progress.accuracyHistory)
      ? progress.accuracyHistory
      : [],
    adaptive: {
      ...createEmptyAdaptiveProgress(),
      ...(progress.adaptive && typeof progress.adaptive === "object"
        ? progress.adaptive
        : {}),
    },
    gamification: {
      ...createEmptyGamificationProgress(),
      ...(progress.gamification && typeof progress.gamification === "object"
        ? progress.gamification
        : {}),
      lessonStreak: {
        ...createEmptyGamificationProgress().lessonStreak,
        ...(progress.gamification?.lessonStreak &&
        typeof progress.gamification.lessonStreak === "object"
          ? progress.gamification.lessonStreak
          : {}),
      },
      achievementIds: Array.isArray(progress.gamification?.achievementIds)
        ? progress.gamification.achievementIds
        : [],
      xpHistory: Array.isArray(progress.gamification?.xpHistory)
        ? progress.gamification.xpHistory
        : [],
    },
    streak:
      progress.streak && typeof progress.streak === "object"
        ? { ...createEmptyProgress().streak, ...progress.streak }
        : createEmptyProgress().streak,
  }
}

function applyProgressionStatus(modules, completedLessonIds) {
  const completedSet = new Set(completedLessonIds)
  const flatLessons = modules.flatMap((module) => module.lessons)
  const firstIncompleteIndex = flatLessons.findIndex(
    (lesson) => !completedSet.has(lesson.id)
  )
  const statusByLessonId = new Map(
    flatLessons.map((lesson, index) => {
      if (completedSet.has(lesson.id)) {
        return [lesson.id, "completed"]
      }

      return [
        lesson.id,
        index === firstIncompleteIndex || firstIncompleteIndex === -1
          ? "unlocked"
          : "locked",
      ]
    })
  )

  return modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      status: statusByLessonId.get(lesson.id),
    })),
  }))
}

function buildSessionRecord(lesson, result = {}) {
  const completedAt = new Date().toISOString()

  return {
    id: `${lesson.id}-${Date.now()}`,
    lessonId: lesson.id,
    lessonNumber: lesson.number,
    lessonTitle: lesson.title,
    moduleId: lesson.moduleId,
    moduleTitle: lesson.moduleTitle,
    completedAt,
    accuracy: result.accuracy ?? 100,
    wpm: result.wpm ?? 0,
    seconds: result.seconds ?? 0,
    totalAttempts: result.totalAttempts ?? 0,
    incorrectAttempts: result.incorrectAttempts ?? 0,
    confidenceLabel: result.confidence?.label || "Unknown",
    confidenceScore: result.confidence?.score ?? null,
    retryCount: result.retryCount ?? 0,
    summaryType: "lesson-completion",
  }
}

function updateGamificationProgress({
  completedLessonIds,
  currentGamification = {},
  isFirstCompletion,
  lesson,
  practiceStreak,
  result,
  sessionRecord,
}) {
  const gamification = {
    ...createEmptyGamificationProgress(),
    ...currentGamification,
  }
  const nextLessonStreak = updateLessonStreak(
    gamification.lessonStreak,
    isFirstCompletion
  )
  const xpReward = calculateXPReward({
    isFirstCompletion,
    lesson,
    lessonStreak: nextLessonStreak,
    practiceStreak,
    result,
  })
  const unlockedAchievements = evaluateAchievementUnlocks({
    completedLessonIds,
    currentAchievementIds: gamification.achievementIds,
    practiceStreak,
    result,
  })
  const achievementIds = [
    ...gamification.achievementIds,
    ...unlockedAchievements.map((achievement) => achievement.id),
  ]
  const rewardRecord = {
    achievements: unlockedAchievements,
    completedAt: sessionRecord.completedAt,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonStreak: nextLessonStreak,
    practiceStreak,
    xp: xpReward,
  }

  return {
    gamification: {
      ...gamification,
      achievementIds,
      lessonStreak: nextLessonStreak,
      totalXP: (gamification.totalXP || 0) + xpReward.total,
      xpHistory: [rewardRecord, ...(gamification.xpHistory || [])].slice(0, 60),
    },
    reward: rewardRecord,
  }
}

function mergeKeyStats(currentKeys = {}, keyStats = []) {
  const nextKeys = { ...currentKeys }

  keyStats.forEach((keyStat) => {
    const keyId = keyStat.keyId
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
    merged.mistakeRate = Math.round((merged.mistakes / merged.attempts) * 100)
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
    merged.mistakeRate = Math.round((merged.mistakes / merged.attempts) * 100)
    merged.priorityScore = merged.mistakes * 3 + merged.problematicReaches

    nextFingers[fingerId] = merged
  })

  return nextFingers
}

function mergeTransitionStats(currentTransitions = {}, transitions = []) {
  const nextTransitions = { ...currentTransitions }

  transitions.forEach((transition) => {
    const current = nextTransitions[transition.pair] || {
      count: 0,
      fromKey: transition.fromKey,
      pair: transition.pair,
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

    nextTransitions[transition.pair] = merged
  })

  return nextTransitions
}

function mergeConfusionPairStats(currentPairs = {}, heatMap = []) {
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

function updateAdaptiveProgress(currentAdaptive = {}, lesson, sessionRecord, result = {}) {
  const adaptive = {
    ...createEmptyAdaptiveProgress(),
    ...currentAdaptive,
  }
  const analyzedResult = result.keyStats
    ? result
    : summarizeDrillResult(result)

  return {
    ...adaptive,
    fingers: mergeFingerStats(adaptive.fingers, analyzedResult.fingerStats),
    keys: mergeKeyStats(adaptive.keys, analyzedResult.keyStats),
    lessonConfidence: [
      {
        confidenceLabel: analyzedResult.confidence?.label || "Unknown",
        confidenceScore: analyzedResult.confidence?.score ?? null,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        recordedAt: sessionRecord.completedAt,
      },
      ...(adaptive.lessonConfidence || []),
    ].slice(0, 60),
    retryHistory: [
      {
        lessonId: lesson.id,
        recordedAt: sessionRecord.completedAt,
        retryCount: analyzedResult.retryCount || 0,
      },
      ...(adaptive.retryHistory || []),
    ].slice(0, 60),
    confusionPairs: mergeConfusionPairStats(
      adaptive.confusionPairs,
      analyzedResult.heatMap
    ),
    transitions: mergeTransitionStats(
      adaptive.transitions,
      analyzedResult.difficultTransitions
    ),
  }
}

function useProgressTracking(modules) {
  const baseLessons = useMemo(
    () => modules.flatMap((module) => module.lessons),
    [modules]
  )
  const [progress, setProgress] = useState(() =>
    normalizeProgress(readProgressSnapshot(null), baseLessons)
  )

  useEffect(() => {
    writeProgressSnapshot(progress)
    writeStorage(legacyCompletedLessonsKey, progress.completedLessonIds)
  }, [progress])

  const trackedModules = useMemo(
    () => applyProgressionStatus(modules, progress.completedLessonIds),
    [modules, progress.completedLessonIds]
  )
  const lessons = useMemo(
    () => trackedModules.flatMap((module) => module.lessons),
    [trackedModules]
  )
  const completedCount = useMemo(
    () => lessons.filter((lesson) => lesson.status === "completed").length,
    [lessons]
  )
  const progressPercent =
    lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100)
  const latestSession = progress.sessions[0] || null
  const averageAccuracy =
    progress.accuracyHistory.length === 0
      ? null
      : Math.round(
          progress.accuracyHistory.reduce(
            (total, entry) => total + entry.accuracy,
            0
          ) / progress.accuracyHistory.length
        )

  const recordLessonCompletion = useCallback((lesson, result = {}) => {
    const sessionRecord = buildSessionRecord(lesson, result)
    let completionSummary = null

    setProgress((currentProgress) => {
      const isFirstCompletion = !currentProgress.completedLessonIds.includes(
        lesson.id
      )
      const completedLessonIds = isFirstCompletion
        ? [...currentProgress.completedLessonIds, lesson.id]
        : currentProgress.completedLessonIds
      const practiceStreak = updatePracticeStreak(
        currentProgress.streak,
        sessionRecord.completedAt
      )
      const gamificationUpdate = updateGamificationProgress({
        completedLessonIds,
        currentGamification: currentProgress.gamification,
        isFirstCompletion,
        lesson,
        practiceStreak,
        result,
        sessionRecord,
      })

      completionSummary = {
        isFirstCompletion,
        reward: gamificationUpdate.reward,
        sessionRecord,
      }

      return {
        ...currentProgress,
        adaptive: updateAdaptiveProgress(
          currentProgress.adaptive,
          lesson,
          sessionRecord,
          result
        ),
        completedLessonIds,
        gamification: gamificationUpdate.gamification,
        sessions: [sessionRecord, ...currentProgress.sessions].slice(0, 40),
        accuracyHistory: [
          {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            accuracy: sessionRecord.accuracy,
            completedAt: sessionRecord.completedAt,
          },
          ...currentProgress.accuracyHistory,
        ].slice(0, 60),
        streak: practiceStreak,
      }
    })

    return completionSummary || { sessionRecord }
  }, [])

  return {
    averageAccuracy,
    completedCount,
    completedLessonIds: progress.completedLessonIds,
    latestSession,
    lessonCount: lessons.length,
    lessons,
    modules: trackedModules,
    progress,
    progressPercent,
    recordLessonCompletion,
  }
}

export default useProgressTracking
