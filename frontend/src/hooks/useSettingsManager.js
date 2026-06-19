import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

import {
  buildBackendSettingsPatch,
  getSettings,
  mapBackendSettings,
  updateSettings,
} from "../api/settingsService"
import { syncOrQueue } from "../api/syncQueue"
import settingsStore from "../store/settingsStore"
import useAuth from "./useAuth"

function useSettingsManager() {
  const auth = useAuth()
  const [syncState, setSyncState] = useState({
    error: null,
    status: "idle",
  })
  const settings = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getSnapshot
  )

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return
    }

    let isCurrent = true

    getSettings()
      .then((backendSettings) => {
        if (!isCurrent) {
          return
        }

        settingsStore.updateSettings(mapBackendSettings(backendSettings))
        setSyncState({ error: null, status: "synced" })
      })
      .catch((error) => {
        if (!isCurrent) {
          return
        }

        setSyncState({ error: error.message, status: "error" })
      })

    return () => {
      isCurrent = false
    }
  }, [auth.isAuthenticated])

  const syncSection = useCallback(
    (section, sectionSettings) => {
      if (!auth.isAuthenticated) {
        return
      }

      const patch = buildBackendSettingsPatch(section, sectionSettings)

      if (Object.keys(patch).length === 0) {
        return
      }

      setSyncState({ error: null, status: "saving" })
      syncOrQueue("settings", patch, () => updateSettings(patch))
        .then(() => setSyncState({ error: null, status: "synced" }))
        .catch((error) =>
          setSyncState({ error: error.message, status: "error" })
        )
    },
    [auth.isAuthenticated]
  )

  const updateAudio = useCallback((audioSettings) => {
    settingsStore.updateSection("audio", audioSettings)
    syncSection("audio", audioSettings)
  }, [syncSection])
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
  const updateTheme = useCallback((themeSettings) => {
    settingsStore.updateSection("theme", themeSettings)
    syncSection("theme", themeSettings)
  }, [syncSection])
  const updateWorkspace = useCallback(
    (workspaceSettings) =>
      settingsStore.updateSection("workspace", workspaceSettings),
    []
  )

  return {
    resetSettings: settingsStore.resetSettings,
    settings,
    syncState,
    updateAudio,
    updateKeyboard,
    updateMotion,
    updatePractice,
    updateTheme,
    updateWorkspace,
  }
}

export default useSettingsManager
