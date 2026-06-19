import { useEffect, useMemo, useState } from "react"

import { getAnalyticsBundle } from "../api/analyticsService"
import { calculateAnalytics } from "../utils/analyticsCalculator"
import { buildPersonalizedRecommendations } from "../utils/recommendationEngine"
import useAuth from "./useAuth"

function mapBackendAnalytics(bundle) {
  const summary = bundle?.summary || {}
  const trends = bundle?.trends || {}
  const wpmTrend = Array.isArray(trends.wpmTrend) ? trends.wpmTrend : []
  const accuracyTrend = Array.isArray(trends.accuracyTrend)
    ? trends.accuracyTrend
    : []
  const sessions = wpmTrend
    .map((entry, index) => ({
      accuracy: accuracyTrend[index]?.value ?? 0,
      completedAt: entry.createdAt,
      id: entry.sessionId,
      summaryType: "backend-session",
      wpm: entry.value,
    }))
    .reverse()

  return {
    backend: {
      ...summary,
      trends,
    },
    sessions,
    trends: {
      accuracyAverage: summary.averageAccuracy || null,
      accuracyDirection: "backend",
      consistency: "backend",
      sessionCount: summary.totalSessions || 0,
      totalPracticeTime: summary.totalPracticeTime || 0,
      visibleSessions: sessions.slice(0, 8),
      wpmAverage: summary.averageWpm || null,
      wpmDirection: "backend",
    },
  }
}

function useAnalyticsEngine(progress) {
  const auth = useAuth()
  const [remoteAnalytics, setRemoteAnalytics] = useState(null)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return undefined
    }

    let isCurrent = true

    getAnalyticsBundle()
      .then((bundle) => {
        if (isCurrent) {
          setRemoteAnalytics(mapBackendAnalytics(bundle))
        }
      })
      .catch(() => {
        if (isCurrent) {
          setRemoteAnalytics(null)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [auth.isAuthenticated, progress?.sessions?.length])

  return useMemo(() => {
    const analytics = calculateAnalytics(progress)
    const backendAnalytics = auth.isAuthenticated ? remoteAnalytics || {} : {}

    return {
      ...analytics,
      ...backendAnalytics,
      sessions: backendAnalytics.sessions || analytics.sessions,
      trends: {
        ...analytics.trends,
        ...(backendAnalytics.trends || {}),
      },
      recommendations: buildPersonalizedRecommendations(analytics),
    }
  }, [auth.isAuthenticated, progress, remoteAnalytics])
}

export default useAnalyticsEngine
