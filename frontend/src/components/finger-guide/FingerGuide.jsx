import { useMemo } from "react"

import {
  HAND_IDS,
  fingerMap,
  getFingerGuidanceForKeys,
} from "../../data/fingerMap"
import FingerLegend from "./FingerLegend"
import HandOverlay from "./HandOverlay"

function toArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  return value ? [value] : []
}

function getDisplayKey(keyValue) {
  if (keyValue === " ") {
    return "Space"
  }

  if (keyValue === "ShiftLeft") {
    return "Left Shift"
  }

  if (keyValue === "ShiftRight") {
    return "Right Shift"
  }

  return keyValue || "Home"
}

function FingerGuide({
  activeKey,
  activeKeys = [],
  className = "",
  compactMode = false,
  expectedKey,
  pressedKey,
  pressedKeys = [],
  showLegend = true,
  showStatus = true,
  workspaceMode = false,
  wrongKey,
  wrongKeys = [],
}) {
  const targetKeys = useMemo(
    () => [...toArray(activeKeys), ...toArray(activeKey)].filter(Boolean),
    [activeKey, activeKeys]
  )
  const pressedKeyValues = useMemo(
    () => [...toArray(pressedKeys), ...toArray(pressedKey)].filter(Boolean),
    [pressedKey, pressedKeys]
  )
  const wrongKeyValues = useMemo(
    () => [...toArray(wrongKeys), ...toArray(wrongKey)].filter(Boolean),
    [wrongKey, wrongKeys]
  )
  const guidance = useMemo(
    () => getFingerGuidanceForKeys(targetKeys),
    [targetKeys]
  )
  const pressedGuidance = useMemo(
    () => getFingerGuidanceForKeys(pressedKeyValues),
    [pressedKeyValues]
  )
  const wrongGuidance = useMemo(
    () => getFingerGuidanceForKeys(wrongKeyValues),
    [wrongKeyValues]
  )
  const primaryFingerId =
    wrongGuidance.activeFingerIds[0] ||
    pressedGuidance.activeFingerIds[0] ||
    guidance.activeFingerIds[0]
  const primaryFinger = primaryFingerId ? fingerMap[primaryFingerId] : null
  const activeHandLabel =
    guidance.activeHand === "both"
      ? "Both hands"
      : guidance.activeHand === HAND_IDS.LEFT
        ? "Left hand"
        : guidance.activeHand === HAND_IDS.RIGHT
          ? "Right hand"
          : "Home position"
  const targetLabel = getDisplayKey(expectedKey || activeKey || targetKeys[0])
  const shiftCoordination = guidance.shiftCoordination

  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-background/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.18)] ${
        compactMode ? "sm:p-5" : "sm:p-6"
      } ${className}`}
      aria-label="Finger and hand guidance"
    >
      {showStatus && (
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${
            workspaceMode ? "mb-4" : "mb-5"
          }`}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-secondary">
              Finger guide
            </p>
            <p className="mt-2 text-lg font-semibold text-primary">
              {primaryFinger
                ? `${primaryFinger.hand} ${primaryFinger.label}`
                : activeHandLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {targetLabel}
            </span>
            {shiftCoordination && (
              <span className="rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {getDisplayKey(shiftCoordination.key)}
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className={`grid gap-3 ${
          workspaceMode ? "grid-cols-2" : "lg:grid-cols-2"
        }`}
      >
        <HandOverlay
          activeFingerIds={guidance.activeFingerIds}
          compactMode={workspaceMode}
          hand={HAND_IDS.LEFT}
          pressedFingerIds={pressedGuidance.activeFingerIds}
          primaryFingerId={primaryFingerId}
          wrongFingerIds={wrongGuidance.activeFingerIds}
        />
        <HandOverlay
          activeFingerIds={guidance.activeFingerIds}
          compactMode={workspaceMode}
          hand={HAND_IDS.RIGHT}
          pressedFingerIds={pressedGuidance.activeFingerIds}
          primaryFingerId={primaryFingerId}
          wrongFingerIds={wrongGuidance.activeFingerIds}
        />
      </div>

      {shiftCoordination?.partnerFinger && (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-muted">
          Hold {shiftCoordination.finger.hand}{" "}
          {shiftCoordination.finger.label.toLowerCase()} for Shift while{" "}
          {shiftCoordination.partnerFinger.hand.toLowerCase()}{" "}
          {shiftCoordination.partnerFinger.label.toLowerCase()} reaches.
        </p>
      )}

      {showLegend && (
        <div className="mt-5">
          <FingerLegend
            activeFingers={guidance.activeFingerIds}
            compactMode={compactMode}
            pressedFingers={pressedGuidance.activeFingerIds}
            wrongFingers={wrongGuidance.activeFingerIds}
          />
        </div>
      )}
    </section>
  )
}

export default FingerGuide
