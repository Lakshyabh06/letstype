export const masteryLevels = [
  {
    id: "beginner",
    label: "Beginner",
    minXP: 0,
    description: "Building posture, focus, and key awareness.",
  },
  {
    id: "rhythm-builder",
    label: "Rhythm Builder",
    minXP: 250,
    description: "Developing steady movement across short patterns.",
  },
  {
    id: "precision-learner",
    label: "Precision Learner",
    minXP: 700,
    description: "Prioritizing accuracy while the keyboard expands.",
  },
  {
    id: "flow-typist",
    label: "Flow Typist",
    minXP: 1400,
    description: "Keeping calm control through mixed practice.",
  },
  {
    id: "touch-typing-expert",
    label: "Touch Typing Expert",
    minXP: 2400,
    description: "Practicing with confident, screen-first fluency.",
  },
]

export function getMasteryLevel(totalXP = 0) {
  return masteryLevels.reduce((currentLevel, level) => {
    if (totalXP >= level.minXP) {
      return level
    }

    return currentLevel
  }, masteryLevels[0])
}

export function getNextMasteryLevel(totalXP = 0) {
  return masteryLevels.find((level) => level.minXP > totalXP) || null
}

export function getMasteryProgress(totalXP = 0) {
  const currentLevel = getMasteryLevel(totalXP)
  const nextLevel = getNextMasteryLevel(totalXP)

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel,
      percent: 100,
      xpRemaining: 0,
    }
  }

  const levelRange = nextLevel.minXP - currentLevel.minXP
  const levelXP = totalXP - currentLevel.minXP

  return {
    currentLevel,
    nextLevel,
    percent: Math.round((levelXP / levelRange) * 100),
    xpRemaining: nextLevel.minXP - totalXP,
  }
}
