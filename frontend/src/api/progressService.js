import { apiRequest } from "./apiClient"

export function getProgress() {
  return apiRequest("/api/progress")
}

export function updateLessonProgress({ completion = 100, lessonId, masteryScore = 100 }) {
  return apiRequest("/api/progress", {
    body: {
      completion,
      lessonId,
      masteryScore,
    },
    method: "PUT",
  })
}

export default {
  getProgress,
  updateLessonProgress,
}
