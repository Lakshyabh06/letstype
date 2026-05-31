import { motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"
import { motionVariants } from "../../utils/motionTokens"

function AnimatedPanel({
  as = "section",
  children,
  className = "",
  layout = false,
  style,
  transition = "panel",
  variant = "panel",
  ...props
}) {
  const MotionComponent = motion[as] || motion.section
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const variants = motionVariants[variant] || motionVariants.panel

  if (!shouldAnimate) {
    return (
      <MotionComponent
        className={className}
        layout={layout}
        style={{ minWidth: 0, ...style }}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }

  return (
    <MotionComponent
      animate="visible"
      className={className}
      exit="exit"
      initial="hidden"
      layout={layout}
      style={{ minWidth: 0, ...style }}
      transition={getTransition(transition)}
      variants={variants}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

export default AnimatedPanel
