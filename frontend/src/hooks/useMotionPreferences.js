import { useMemo } from "react"

import useSettingsManager from "./useSettingsManager"
import useReducedMotion from "./useReducedMotion"
import { motionTransitions } from "../utils/motionTokens"

function useMotionPreferences() {
  const systemReducedMotion = useReducedMotion()
  const { settings } = useSettingsManager()
  const motionSettings = settings.motion
  const prefersReducedMotion =
    motionSettings.reducedMotion ||
    !motionSettings.transitionsEnabled ||
    (motionSettings.respectSystemReducedMotion && systemReducedMotion)

  return useMemo(
    () => ({
      prefersReducedMotion,
      getTransition(name = "panel") {
        if (prefersReducedMotion) {
          return { duration: 0.01 }
        }

        const transition = motionTransitions[name] || motionTransitions.panel

        if (motionSettings.intensity === "minimal") {
          return { ...transition, duration: Math.min(transition.duration || 0.2, 0.18) }
        }

        if (motionSettings.intensity === "expressive") {
          return { ...transition, duration: (transition.duration || 0.24) * 1.15 }
        }

        return transition
      },
      shouldAnimate: !prefersReducedMotion,
    }),
    [motionSettings.intensity, prefersReducedMotion]
  )
}

export default useMotionPreferences
