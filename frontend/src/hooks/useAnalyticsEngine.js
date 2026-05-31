import { useMemo } from "react"

import { calculateAnalytics } from "../utils/analyticsCalculator"
import { buildPersonalizedRecommendations } from "../utils/recommendationEngine"

function useAnalyticsEngine(progress) {
  return useMemo(() => {
    const analytics = calculateAnalytics(progress)

    return {
      ...analytics,
      recommendations: buildPersonalizedRecommendations(analytics),
    }
  }, [progress])
}

export default useAnalyticsEngine
