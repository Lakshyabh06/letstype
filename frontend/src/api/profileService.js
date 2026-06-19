import { apiRequest } from "./apiClient"

export function getProfile() {
  return apiRequest("/api/user/profile")
}

export function updateProfile(profilePatch) {
  return apiRequest("/api/user/profile", {
    body: profilePatch,
    method: "PATCH",
  })
}

export default {
  getProfile,
  updateProfile,
}
