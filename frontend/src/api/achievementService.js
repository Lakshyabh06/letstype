import { apiRequest } from "./apiClient"

export function getAchievements() {
  return apiRequest("/api/achievements")
}

export default {
  getAchievements,
}
