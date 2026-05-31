import { useMemo } from "react"

import { getAchievementsById } from "../utils/achievementEngine"
import { getMasteryProgress } from "../utils/masteryLevels"

export function createEmptyGamificationProgress() {
  return {
    achievementIds: [],
    lessonStreak: {
      best: 0,
      current: 0,
      total: 0,
    },
    totalXP: 0,
    version: 1,
    xpHistory: [],
  }
}

function useGamification(progress = {}) {
  return useMemo(() => {
    const gamification = {
      ...createEmptyGamificationProgress(),
      ...(progress.gamification && typeof progress.gamification === "object"
        ? progress.gamification
        : {}),
    }
    const mastery = getMasteryProgress(gamification.totalXP)

    return {
      achievements: getAchievementsById(gamification.achievementIds),
      gamification,
      lessonStreak: gamification.lessonStreak,
      mastery,
      recentXP: gamification.xpHistory?.[0] || null,
      totalXP: gamification.totalXP,
    }
  }, [progress])
}

export default useGamification
