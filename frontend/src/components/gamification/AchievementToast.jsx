import { motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"
import { motionVariants } from "../../utils/motionTokens"

function AchievementToast({ achievements = [], subtle = false }) {
  const { getTransition, shouldAnimate } = useMotionPreferences()

  if (achievements.length === 0) {
    return null
  }

  return (
    <motion.div
      animate={shouldAnimate ? "visible" : undefined}
      className={`space-y-2 ${subtle ? "" : "rounded-[24px] border border-accent/20 bg-accent/10 p-4"}`}
      initial={shouldAnimate ? "hidden" : undefined}
      role="status"
      transition={getTransition("reward")}
      variants={motionVariants.reward}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Achievement unlocked
      </p>
      <div className="grid gap-2">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className="rounded-2xl border border-white/10 bg-background/45 p-3"
            variants={motionVariants.reveal}
          >
            <p className="text-sm font-semibold text-primary">
              {achievement.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              {achievement.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AchievementToast
