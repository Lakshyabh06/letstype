import { useMemo } from "react"

import { getFingerGuidanceForKeys } from "../../data/fingerMap"
import fullKeyboardLayout, { normalizeKeyboardKey } from "../../data/keyboardLayout"
import useMotionPreferences from "../../hooks/useMotionPreferences"
import useSettingsManager from "../../hooks/useSettingsManager"
import FingerLegend from "./FingerLegend"
import KeyboardRow from "./KeyboardRow"

function toKeySet(keyValue) {
  const values = Array.isArray(keyValue) ? keyValue : [keyValue]

  return new Set(values.filter(Boolean).map(normalizeKeyboardKey))
}

function Keyboard({
  activeKey,
  activeKeys,
  pressedKey,
  pressedKeys,
  wrongKey,
  wrongKeys,
  showFingerHints,
  showLegend,
  compactMode = false,
  layout = fullKeyboardLayout,
  className = "",
  onKeySelect,
}) {
  const { settings } = useSettingsManager()
  const { shouldAnimate } = useMotionPreferences()
  const resolvedShowFingerHints =
    showFingerHints ?? settings.keyboard.showFingerHints
  const resolvedShowLegend = showLegend ?? settings.keyboard.showLegend
  const canGlow = settings.keyboard.showKeyboardGlow
  const resolvedCompactMode = compactMode || settings.keyboard.compactMode
  const keyboardScale = settings.keyboard.sizeScale || 1
  const activeKeySet = useMemo(
    () => toKeySet(activeKeys ?? activeKey),
    [activeKey, activeKeys]
  )
  const pressedKeySet = useMemo(
    () => toKeySet(pressedKeys ?? pressedKey),
    [pressedKey, pressedKeys]
  )
  const wrongKeySet = useMemo(
    () => toKeySet(wrongKeys ?? wrongKey),
    [wrongKey, wrongKeys]
  )

  const activeFingers = useMemo(() => {
    return getFingerGuidanceForKeys(Array.from(activeKeySet)).activeFingerIds
  }, [activeKeySet])

  const isFullLayout = layout === fullKeyboardLayout
  const layoutWidthClass = isFullLayout
    ? resolvedCompactMode
      ? "min-w-[680px]"
      : "min-w-[760px]"
    : resolvedCompactMode
      ? "min-w-[360px]"
      : "min-w-[480px]"

  return (
    <section
      className={`w-full rounded-[28px] border border-white/10 bg-background/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.22)] ${
        resolvedCompactMode ? "sm:p-4" : "sm:p-5"
      } ${className}`}
      aria-label="Interactive keyboard"
    >
      <div className="overflow-x-auto pb-1">
        <div
          className={`mx-auto flex max-w-5xl flex-col gap-1.5 sm:gap-2 ${layoutWidthClass}`}
          style={{
            transform: `scale(${keyboardScale})`,
            transformOrigin: "top center",
          }}
        >
          {layout.map((row) => (
            <KeyboardRow
              key={row.id}
              row={row}
              activeKeys={activeKeySet}
              canGlow={canGlow}
              pressedKeys={pressedKeySet}
              wrongKeys={wrongKeySet}
              showFingerHints={resolvedShowFingerHints}
              shouldAnimate={shouldAnimate}
              compactMode={resolvedCompactMode}
              onKeySelect={onKeySelect}
            />
          ))}
        </div>
      </div>

      {resolvedShowFingerHints && resolvedShowLegend && (
        <div className={compactMode ? "mt-3" : "mt-4"}>
          <FingerLegend
            activeFingers={activeFingers}
          compactMode={resolvedCompactMode}
        />
        </div>
      )}
    </section>
  )
}

export default Keyboard
