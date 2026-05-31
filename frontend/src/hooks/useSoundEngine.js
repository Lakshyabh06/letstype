import { useCallback, useEffect, useSyncExternalStore } from "react"

import soundManager, {
  soundCategories,
  soundThemes,
} from "../utils/soundManager"

function useSoundEngine({ globalInteractions = false } = {}) {
  const settings = useSyncExternalStore(
    soundManager.subscribe,
    soundManager.getSnapshot,
    soundManager.getSnapshot
  )

  useEffect(() => {
    if (!globalInteractions) {
      return undefined
    }

    function handlePointerDown(event) {
      if (event.target instanceof Element) {
        soundManager.unlock()
      }
    }

    function handleKeyDown(event) {
      if (event.target instanceof Element) {
        soundManager.unlock()
      }
    }

    function handleSoundEvent(event) {
      const { soundName, options } = event.detail || {}

      if (soundName) {
        soundManager.play(soundName, options)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown, true)
    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("typelearner:sound", handleSoundEvent)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true)
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("typelearner:sound", handleSoundEvent)
    }
  }, [globalInteractions])

  const play = useCallback((soundName, options) => {
    soundManager.play(soundName, options)
  }, [])
  const toggle = useCallback(() => soundManager.toggle(), [])
  const setEnabled = useCallback((enabled) => soundManager.setEnabled(enabled), [])
  const setMuted = useCallback((muted) => soundManager.setMuted(muted), [])
  const setTheme = useCallback((themeId) => soundManager.setTheme(themeId), [])
  const setVolume = useCallback((volume) => soundManager.setVolume(volume), [])
  const setMasterVolume = useCallback(
    (volume) => soundManager.setMasterVolume(volume),
    []
  )
  const setCategoryVolume = useCallback(
    (category, volume) => soundManager.setCategoryVolume(category, volume),
    []
  )

  return {
    ...settings,
    play,
    setCategoryVolume,
    setEnabled,
    setMasterVolume,
    setMuted,
    setTheme,
    setVolume,
    soundCategories,
    soundThemes,
    toggle,
  }
}

export default useSoundEngine
