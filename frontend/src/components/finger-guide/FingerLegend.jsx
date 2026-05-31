import { fingerLegend } from "../../data/fingerMap"

function FingerLegend({
  activeFingers = [],
  compactMode = false,
  pressedFingers = [],
  wrongFingers = [],
}) {
  const activeFingerSet = new Set(activeFingers)
  const pressedFingerSet = new Set(pressedFingers)
  const wrongFingerSet = new Set(wrongFingers)
  const visibleFingers = fingerLegend.filter(
    (finger) => !compactMode || finger.label !== "Thumb"
  )

  return (
    <div
      className={`grid gap-2 ${
        compactMode ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-2 sm:grid-cols-5"
      }`}
      aria-label="Finger color legend"
    >
      {visibleFingers.map((finger) => {
        const isWrong = wrongFingerSet.has(finger.id)
        const isPressed = pressedFingerSet.has(finger.id)
        const isActive = activeFingerSet.has(finger.id) || isPressed || isWrong

        return (
          <div
            key={finger.id}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition duration-200 ${
              isWrong
                ? "border-error/75 bg-error/14 text-primary shadow-[0_0_0_1px_rgba(224,131,104,0.18)]"
                : isActive
                  ? "border-[var(--finger-color)] bg-[var(--finger-soft)] text-primary shadow-[0_0_0_1px_var(--finger-glow)]"
                  : "border-white/10 bg-white/[0.035] text-muted"
            }`}
            style={{
              "--finger-color": finger.color,
              "--finger-soft": finger.softColor,
              "--finger-glow": finger.glowColor,
            }}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: isWrong ? "var(--color-error)" : finger.color,
              }}
            />
            <span className="min-w-0 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.12em]">
              {compactMode ? finger.shortLabel : `${finger.hand} ${finger.label}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default FingerLegend
