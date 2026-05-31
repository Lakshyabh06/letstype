import { AnimatePresence, motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"
import { motionVariants } from "../../utils/motionTokens"

function TransitionWrapper({
  children,
  className = "",
  mode = "wait",
  style,
  transition = "panel",
  transitionKey,
  variant = "workspace",
}) {
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const variants = motionVariants[variant] || motionVariants.workspace

  if (!shouldAnimate) {
    return (
      <div key={transitionKey} className={className} style={{ minWidth: 0, ...style }}>
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={transitionKey}
        animate="visible"
        className={className}
        exit="exit"
        initial="hidden"
        style={{ minWidth: 0, ...style }}
        transition={getTransition(transition)}
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default TransitionWrapper
