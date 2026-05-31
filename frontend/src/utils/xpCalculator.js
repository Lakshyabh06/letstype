function addReward(rewards, reason, xp) {
  if (xp <= 0) {
    return
  }

  rewards.push({ reason, xp })
}

export function calculateXPReward({
  isFirstCompletion = true,
  lessonStreak = {},
  practiceStreak = {},
  result = {},
} = {}) {
  const rewards = []
  const accuracy = result.assessmentAccuracy ?? result.accuracy ?? 100
  const incorrectAttempts = result.incorrectAttempts || 0
  const retryCount = result.retryCount || 0

  addReward(
    rewards,
    isFirstCompletion ? "Lesson completion" : "Focused review",
    isFirstCompletion ? 60 : 20
  )

  if (accuracy >= 95) {
    addReward(rewards, "High accuracy", accuracy >= 98 ? 35 : 20)
  }

  if (incorrectAttempts === 0) {
    addReward(rewards, "Perfect drill control", 45)
  }

  if (retryCount === 0 && accuracy >= 90) {
    addReward(rewards, "First-try success", 25)
  }

  if ((practiceStreak.current || 0) >= 2) {
    addReward(
      rewards,
      "Daily consistency",
      practiceStreak.current >= 10 ? 50 : practiceStreak.current >= 5 ? 30 : 12
    )
  }

  if ((lessonStreak.current || 0) >= 3) {
    addReward(rewards, "Lesson streak", lessonStreak.current >= 10 ? 35 : 15)
  }

  return {
    breakdown: rewards,
    total: rewards.reduce((total, reward) => total + reward.xp, 0),
  }
}
