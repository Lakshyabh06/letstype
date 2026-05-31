import { useMemo } from "react"

export function toLocalDateKey(value = new Date()) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function getPreviousDateKey(value = new Date()) {
  const date = new Date(value)
  date.setDate(date.getDate() - 1)

  return toLocalDateKey(date)
}

export function updatePracticeStreak(currentStreak = {}, completedAt) {
  const todayKey = toLocalDateKey(completedAt)
  const yesterdayKey = getPreviousDateKey(completedAt)

  if (currentStreak.lastPracticeDate === todayKey) {
    return currentStreak
  }

  return {
    best: Math.max(
      currentStreak.best || 0,
      currentStreak.lastPracticeDate === yesterdayKey
        ? (currentStreak.current || 0) + 1
        : 1
    ),
    current:
      currentStreak.lastPracticeDate === yesterdayKey
        ? (currentStreak.current || 0) + 1
        : 1,
    lastPracticeDate: todayKey,
  }
}

export function updateLessonStreak(currentLessonStreak = {}, isFirstCompletion) {
  if (!isFirstCompletion) {
    return currentLessonStreak
  }

  const nextCurrent = (currentLessonStreak.current || 0) + 1

  return {
    best: Math.max(currentLessonStreak.best || 0, nextCurrent),
    current: nextCurrent,
    total: (currentLessonStreak.total || 0) + 1,
  }
}

function getConsistencyMilestones(currentStreak = 0) {
  return [3, 5, 10, 20, 30].map((dayCount) => ({
    dayCount,
    isReached: currentStreak >= dayCount,
  }))
}

function useStreakTracking(progress = {}) {
  return useMemo(() => {
    const practiceStreak = progress.streak || {}
    const lessonStreak = progress.gamification?.lessonStreak || {}
    const todayKey = toLocalDateKey()

    return {
      consistencyMilestones: getConsistencyMilestones(practiceStreak.current || 0),
      hasPracticedToday: practiceStreak.lastPracticeDate === todayKey,
      lessonStreak,
      practiceStreak,
    }
  }, [progress])
}

export default useStreakTracking
