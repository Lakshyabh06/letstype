import { apiRequest } from "./apiClient"

const validBackendThemes = new Set(["dark", "light", "system"])

export function mapBackendSettings(settings = {}) {
  return {
    audio: {
      masterVolume:
        Number.isFinite(settings.volume) ? settings.volume / 100 : undefined,
      themeId: settings.soundProfile,
      volume: Number.isFinite(settings.volume) ? settings.volume / 100 : undefined,
    },
    theme: {
      id: settings.theme,
    },
  }
}

export function buildBackendSettingsPatch(section, sectionSettings = {}) {
  const patch = {}

  if (section === "theme" && validBackendThemes.has(sectionSettings.id)) {
    patch.theme = sectionSettings.id
  }

  if (section === "audio") {
    if (sectionSettings.themeId) {
      patch.soundProfile = sectionSettings.themeId
    }

    const volume = sectionSettings.masterVolume ?? sectionSettings.volume

    if (Number.isFinite(volume)) {
      patch.volume = Math.round(Math.max(0, Math.min(1, volume)) * 100)
    }
  }

  return patch
}

export function getSettings() {
  return apiRequest("/api/settings")
}

export function updateSettings(settingsPatch) {
  return apiRequest("/api/settings", {
    body: settingsPatch,
    method: "PATCH",
  })
}

export default {
  buildBackendSettingsPatch,
  getSettings,
  mapBackendSettings,
  updateSettings,
}
