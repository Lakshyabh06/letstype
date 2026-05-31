import { mergeObjects, readStorage, writeStorage } from "../utils/storageManager"

export const settingsStorageKey = "typelearner.settings.v1"
const legacySoundStorageKey = "typelearner.sound.settings"

export const defaultSettings = {
  audio: {
    categories: {
      feedback: 1,
      rewards: 0.86,
      typing: 1,
      ui: 0,
    },
    enabled: true,
    masterVolume: 1,
    muted: false,
    themeId: "mechanical",
    volume: 1,
  },
  keyboard: {
    compactMode: false,
    showFingerHints: true,
    showKeyboardGlow: true,
    showLegend: true,
    sizeScale: 1,
  },
  motion: {
    reducedMotion: false,
    intensity: "subtle",
    respectSystemReducedMotion: true,
    transitionsEnabled: true,
  },
  practice: {
    customText: "",
    duration: 60,
    modeId: "focus",
    restoreSession: true,
  },
  theme: {
    colorIntensity: 0.72,
    id: "dark",
    futureLightTheme: false,
  },
  workspace: {
    compactMode: false,
    focusMode: false,
    lastLessonId: null,
    lastRoute: "/",
  },
}

function readInitialSettings() {
  const storedSettings = readStorage(settingsStorageKey, null)
  const legacySoundSettings = readStorage(legacySoundStorageKey, null)
  const migratedSettings =
    legacySoundSettings && typeof legacySoundSettings === "object"
      ? {
          audio: {
            enabled: legacySoundSettings.enabled,
            themeId: legacySoundSettings.themeId,
            volume: legacySoundSettings.volume,
          },
        }
      : null

  return mergeObjects(
    defaultSettings,
    storedSettings || migratedSettings || defaultSettings
  )
}

let settingsSnapshot = readInitialSettings()
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

function persist(nextSettings) {
  settingsSnapshot = mergeObjects(defaultSettings, nextSettings)
  writeStorage(settingsStorageKey, settingsSnapshot)
  notify()
}

export const settingsStore = {
  getSnapshot: () => settingsSnapshot,
  subscribe(listener) {
    listeners.add(listener)

    return () => listeners.delete(listener)
  },
  updateSettings(updater) {
    const nextSettings =
      typeof updater === "function" ? updater(settingsSnapshot) : updater

    persist({
      ...settingsSnapshot,
      ...nextSettings,
    })
  },
  updateSection(section, sectionSettings) {
    persist({
      ...settingsSnapshot,
      [section]: {
        ...settingsSnapshot[section],
        ...sectionSettings,
      },
    })
  },
  resetSettings() {
    persist(defaultSettings)
  },
}

export default settingsStore
