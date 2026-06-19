import { useEffect, useMemo, useState } from "react"

import { getAchievements } from "../api/achievementService"
import { getAchievementsById } from "../utils/achievementEngine"
import { getMasteryProgress } from "../utils/masteryLevels"
import useAuth from "./useAuth"

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
  const auth = useAuth()
  const [remoteAchievements, setRemoteAchievements] = useState(null)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return undefined
    }

    let isCurrent = true

    getAchievements()
      .then((achievements) => {
        if (isCurrent) {
          setRemoteAchievements(Array.isArray(achievements) ? achievements : [])
        }
      })
      .catch(() => {
        if (isCurrent) {
          setRemoteAchievements(null)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [auth.isAuthenticated, progress?.sessions?.length])

  return useMemo(() => {
    const gamification = {
      ...createEmptyGamificationProgress(),
      ...(progress.gamification && typeof progress.gamification === "object"
        ? progress.gamification
        : {}),
    }
    const mastery = getMasteryProgress(gamification.totalXP)
    const achievements = auth.isAuthenticated && remoteAchievements
      ? remoteAchievements.map((achievement) => ({
          description: achievement.description,
          earnedAt: achievement.earnedAt,
          id: achievement.key,
          title: achievement.title,
        }))
      : getAchievementsById(gamification.achievementIds)

    return {
      achievements,
      gamification,
      lessonStreak: gamification.lessonStreak,
      mastery,
      recentXP: gamification.xpHistory?.[0] || null,
      totalXP: gamification.totalXP,
    }
  }, [auth.isAuthenticated, progress, remoteAchievements])
}

export default useGamification
