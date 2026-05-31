export const achievementCatalog = [
  {
    id: "first-perfect-lesson",
    title: "First Perfect Lesson",
    description: "Complete a lesson without a recorded mistake.",
  },
  {
    id: "home-row-master",
    title: "Home Row Master",
    description: "Complete the home-row foundation sequence.",
  },
  {
    id: "accuracy-above-95",
    title: "Accuracy Above 95%",
    description: "Finish a lesson assessment at 95% accuracy or higher.",
  },
  {
    id: "ten-lessons-completed",
    title: "10 Lessons Completed",
    description: "Complete ten lessons in the guided curriculum.",
  },
  {
    id: "no-mistake-drill",
    title: "No Mistake Drill",
    description: "Finish a lesson session with clean drill control.",
  },
  {
    id: "consistency-streak",
    title: "Consistency Streak",
    description: "Practice on five consecutive days.",
  },
  {
    id: "first-try-success",
    title: "First-Try Success",
    description: "Pass the assessment without a retry.",
  },
]

const homeRowLessonIds = [
  "left-home-row",
  "right-home-row",
  "home-row-combinations",
  "center-home-reaches",
]

export function getAchievementById(achievementId) {
  return achievementCatalog.find((achievement) => achievement.id === achievementId)
}

export function getAchievementsById(achievementIds = []) {
  return achievementIds
    .map((achievementId) => getAchievementById(achievementId))
    .filter(Boolean)
}

export function evaluateAchievementUnlocks({
  completedLessonIds = [],
  currentAchievementIds = [],
  practiceStreak = {},
  result = {},
} = {}) {
  const unlockedAchievementIds = new Set(currentAchievementIds)
  const candidateIds = []
  const accuracy = result.assessmentAccuracy ?? result.accuracy ?? 100
  const incorrectAttempts = result.incorrectAttempts || 0
  const retryCount = result.retryCount || 0

  if (incorrectAttempts === 0) {
    candidateIds.push("first-perfect-lesson", "no-mistake-drill")
  }

  if (accuracy >= 95) {
    candidateIds.push("accuracy-above-95")
  }

  if (retryCount === 0 && accuracy >= 90) {
    candidateIds.push("first-try-success")
  }

  if (completedLessonIds.length >= 10) {
    candidateIds.push("ten-lessons-completed")
  }

  if (
    homeRowLessonIds.every((lessonId) => completedLessonIds.includes(lessonId))
  ) {
    candidateIds.push("home-row-master")
  }

  if ((practiceStreak.current || 0) >= 5) {
    candidateIds.push("consistency-streak")
  }

  return candidateIds
    .filter((achievementId) => !unlockedAchievementIds.has(achievementId))
    .map((achievementId) => getAchievementById(achievementId))
    .filter(Boolean)
}
