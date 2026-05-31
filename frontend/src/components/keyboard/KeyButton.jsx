import { memo } from "react"
import { motion } from "framer-motion"

import { getKeyTokens } from "../../data/keyboardLayout"
import { motionTransitions } from "../../utils/motionTokens"

function KeyButton({
  canGlow,
  keyData,
  finger,
  activeKeys,
  pressedKeys,
  wrongKeys,
  showFingerHints,
  shouldAnimate,
  compactMode,
  onKeySelect,
}) {
  const tokens = getKeyTokens(keyData)
  const isActive = tokens.some((token) => activeKeys.has(token))
  const isPressed = tokens.some((token) => pressedKeys.has(token))
  const isWrong = tokens.some((token) => wrongKeys.has(token))
  const isInstructional = isActive || isPressed || isWrong

  const stateClasses = isWrong
    ? `border-error/80 bg-error/18 text-primary ${
        canGlow
          ? "shadow-[0_0_0_1px_rgba(224,131,104,0.16),0_14px_34px_rgba(224,131,104,0.18)]"
          : ""
      }`
    : isPressed
      ? `border-primary/70 bg-primary text-background ${
          canGlow ? "shadow-[0_12px_34px_rgba(245,242,234,0.16)]" : ""
        }`
      : isActive
        ? `border-[var(--finger-color)] bg-[var(--finger-soft)] text-primary ${
            canGlow
              ? "shadow-[0_0_0_1px_var(--finger-glow),0_14px_34px_var(--finger-glow)]"
              : ""
          }`
        : keyData.home
          ? "border-white/14 bg-white/[0.065] text-primary/85"
          : "border-white/10 bg-white/[0.04] text-muted"

  return (
    <motion.button
      type="button"
      aria-label={`${keyData.label} key${finger ? `, ${finger.hand} ${finger.label}` : ""}`}
      aria-current={isActive ? "true" : undefined}
      aria-pressed={isPressed}
      onClick={() => onKeySelect?.(keyData)}
      animate={
        shouldAnimate
          ? {
              scale: isPressed ? 0.985 : 1,
              x: isWrong ? [0, -3, 3, -2, 2, 0] : 0,
              y: isPressed ? 1 : 0,
            }
          : undefined
      }
      transition={motionTransitions.micro}
      whileHover={shouldAnimate && !isPressed ? { y: -2 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.975 } : undefined}
      className={`group relative flex shrink-0 select-none flex-col items-center justify-center rounded-xl border outline-none transition duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/35 ${
        compactMode
          ? "h-9 min-w-0 px-1 text-[0.62rem] sm:h-10 sm:text-xs"
          : "h-11 min-w-0 px-1.5 text-xs sm:h-12 sm:text-sm lg:h-14"
      } ${stateClasses}`}
      style={{
        flex: `${keyData.size} ${keyData.size} 0`,
        "--finger-color": finger?.color ?? "#D8C7A3",
        "--finger-soft": finger?.softColor ?? "rgba(216, 199, 163, 0.14)",
        "--finger-glow": finger?.glowColor ?? "rgba(216, 199, 163, 0.22)",
      }}
    >
      {showFingerHints && finger && (
        <span
          className={`absolute left-1.5 top-1.5 rounded-full transition duration-200 ${
            compactMode ? "h-1.5 w-1.5" : "h-2 w-2"
          } ${isInstructional ? "opacity-100" : "opacity-55"}`}
          style={{ backgroundColor: finger.color }}
        />
      )}

      {keyData.shiftLabel && (
        <span className="text-[0.58rem] leading-none opacity-55 sm:text-[0.65rem]">
          {keyData.shiftLabel}
        </span>
      )}

      <span
        className={`leading-none ${
          keyData.label.length > 5
            ? "text-[0.56rem] font-semibold uppercase sm:text-[0.65rem]"
            : "font-semibold"
        }`}
      >
        {keyData.label}
      </span>

      {keyData.anchor && (
        <span
          className={`absolute bottom-1.5 rounded-full bg-current opacity-45 ${
            compactMode ? "h-0.5 w-3" : "h-0.5 w-4"
          }`}
        />
      )}
    </motion.button>
  )
}

export default memo(KeyButton)
