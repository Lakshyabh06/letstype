export const motionDurations = {
  instant: 0.12,
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
}

export const motionEase = [0.22, 1, 0.36, 1]

export const motionTransitions = {
  panel: {
    duration: motionDurations.base,
    ease: motionEase,
  },
  modal: {
    duration: motionDurations.slow,
    ease: motionEase,
  },
  reward: {
    duration: motionDurations.slow,
    ease: motionEase,
  },
  micro: {
    duration: motionDurations.fast,
    ease: motionEase,
  },
  route: {
    duration: motionDurations.instant,
    ease: motionEase,
  },
  springSoft: {
    damping: 24,
    mass: 0.72,
    stiffness: 260,
    type: "spring",
  },
}

export const motionVariants = {
  panel: {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.995 },
  },
  workspace: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  route: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modalBackdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modalPanel: {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.985 },
  },
  reveal: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  },
  reward: {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
  },
  errorShake: {
    idle: { x: 0 },
    shake: { x: [0, -3, 3, -2, 2, 0] },
  },
}

export default {
  durations: motionDurations,
  ease: motionEase,
  transitions: motionTransitions,
  variants: motionVariants,
}
