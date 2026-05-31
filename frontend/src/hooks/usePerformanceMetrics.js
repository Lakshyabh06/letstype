import { useEffect, useState } from "react"

import { createPerformanceSampler } from "../utils/performanceOptimizer"

function shouldEnableOverlay() {
  if (typeof window === "undefined") {
    return false
  }

  const params = new URLSearchParams(window.location.search)

  return (
    params.get("perf") === "1" ||
    window.localStorage.getItem("typelearner.performanceOverlay") === "true"
  )
}

function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState(() => ({
    enabled: shouldEnableOverlay(),
    fps: 60,
    inputLatency: 0,
    longTasks: 0,
    memory: 0,
    status: "stable",
  }))

  useEffect(() => {
    if (!metrics.enabled) {
      return undefined
    }

    const sampler = createPerformanceSampler(setMetrics)

    sampler.start()

    return () => sampler.stop()
  }, [metrics.enabled])

  return metrics
}

export default usePerformanceMetrics
