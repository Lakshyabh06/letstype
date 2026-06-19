import { apiRequest } from "./apiClient"

export async function getAnalyticsBundle() {
  const [summary, trends] = await Promise.all([
    apiRequest("/api/analytics"),
    apiRequest("/api/analytics/trends"),
  ])

  return {
    summary,
    trends,
  }
}

export default {
  getAnalyticsBundle,
}
