import { useCallback, useState } from "react"

import useSettingsManager from "./useSettingsManager"

function useFocusMode({ persist = false } = {}) {
  const { settings, updateWorkspace } = useSettingsManager()
  const [isFocusMode, setIsFocusMode] = useState(() =>
    persist ? settings.workspace.focusMode : false
  )

  const setFocusMode = useCallback(
    (nextValue) => {
      setIsFocusMode(nextValue)

      if (persist) {
        updateWorkspace({ focusMode: nextValue })
      }
    },
    [persist, updateWorkspace]
  )

  const enterFocusMode = useCallback(() => setFocusMode(true), [setFocusMode])
  const exitFocusMode = useCallback(() => setFocusMode(false), [setFocusMode])
  const toggleFocusMode = useCallback(
    () => setFocusMode(!isFocusMode),
    [isFocusMode, setFocusMode]
  )

  return {
    enterFocusMode,
    exitFocusMode,
    isFocusMode,
    setIsFocusMode: setFocusMode,
    toggleFocusMode,
  }
}

export default useFocusMode
