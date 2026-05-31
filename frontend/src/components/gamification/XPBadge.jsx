import { motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"

function XPBadge({ className = "", totalXP = 0, recentXP = null }) {
  const { getTransition, shouldAnimate } = useMotionPreferences()

  return (
    <motion.div
      animate={shouldAnimate && recentXP?.xp?.total > 0 ? { scale: [1, 1.025, 1] } : undefined}
      className={`rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 shadow-[0_0_40px_rgba(216,199,163,0.06)] ${className}`}
      transition={getTransition("reward")}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Experience
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="text-2xl font-semibold text-primary">{totalXP}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          XP
        </span>
      </div>
      {recentXP?.xp?.total > 0 && (
        <p className="mt-1 text-xs leading-5 text-muted">
          +{recentXP.xp.total} from {recentXP.lessonTitle}
        </p>
      )}
    </motion.div>
  )
}

export default XPBadge
