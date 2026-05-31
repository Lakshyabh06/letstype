import PracticeWorkspace from "../components/practice/PracticeWorkspace"
import courseModules from "../data/course"
import useAdaptiveLearning from "../hooks/useAdaptiveLearning"
import useAdaptiveTraining from "../hooks/useAdaptiveTraining"
import useAnalyticsEngine from "../hooks/useAnalyticsEngine"
import useGamification from "../hooks/useGamification"
import useProgressTracking from "../hooks/useProgressTracking"
import useStreakTracking from "../hooks/useStreakTracking"

function Practice() {
  const { progress } = useProgressTracking(courseModules)
  const adaptive = useAdaptiveLearning(progress)
  const analytics = useAnalyticsEngine(progress)
  const { practicePlan } = useAdaptiveTraining(analytics)
  const gamification = useGamification(progress)
  const streaks = useStreakTracking(progress)

  return (
    <PracticeWorkspace
      adaptive={adaptive}
      analytics={analytics}
      gamification={gamification}
      practicePlan={practicePlan}
      progress={progress}
      streaks={streaks}
    />
  )
}

export default Practice
