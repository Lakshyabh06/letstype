import { motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"

function FocusModeOverlay({
  className = "",
  isFocusMode,
  onToggle,
  size = "default",
}) {
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const label = isFocusMode ? "Exit focus" : "Focus"

  return (
    <motion.button
      type="button"
      aria-pressed={isFocusMode}
      onClick={onToggle}
      whileTap={shouldAnimate ? { scale: 0.97 } : undefined}
      transition={getTransition("micro")}
      className={`inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-accent/35 ${
        size === "compact" ? "h-9 px-3" : "h-10 px-4"
      } ${
        isFocusMode
          ? "border-accent/35 bg-accent/12 text-accent shadow-[0_0_34px_rgba(216,199,163,0.08)]"
          : "border-white/10 bg-white/[0.035] text-muted hover:border-white/20 hover:text-primary"
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full transition duration-200 ${
          isFocusMode ? "bg-accent shadow-[0_0_16px_rgba(216,199,163,0.55)]" : "bg-muted"
        }`}
      />
      {label}
    </motion.button>
  )
}

export default FocusModeOverlay
