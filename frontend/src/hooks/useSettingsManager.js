import { useCallback, useSyncExternalStore } from "react"

import settingsStore from "../store/settingsStore"

function useSettingsManager() {
  const settings = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getSnapshot
  )

  const updateAudio = useCallback(
    (audioSettings) => settingsStore.updateSection("audio", audioSettings),
    []
  )
  const updateKeyboard = useCallback(
    (keyboardSettings) =>
      settingsStore.updateSection("keyboard", keyboardSettings),
    []
  )
  const updateMotion = useCallback(
    (motionSettings) => settingsStore.updateSection("motion", motionSettings),
    []
  )
  const updatePractice = useCallback(
    (practiceSettings) =>
      settingsStore.updateSection("practice", practiceSettings),
    []
  )
  const updateTheme = useCallback(
    (themeSettings) => settingsStore.updateSection("theme", themeSettings),
    []
  )
  const updateWorkspace = useCallback(
    (workspaceSettings) =>
      settingsStore.updateSection("workspace", workspaceSettings),
    []
  )

  return {
    resetSettings: settingsStore.resetSettings,
    settings,
    updateAudio,
    updateKeyboard,
    updateMotion,
    updatePractice,
    updateTheme,
    updateWorkspace,
  }
}

export default useSettingsManager
