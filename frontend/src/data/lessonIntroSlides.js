const introCopy = {
  opening:
    "Before speed matters, your body needs a calm setup and your fingers need reliable landmarks.",
  posture:
    "Sit close enough to keep your shoulders relaxed, wrists floating, and eyes on the screen.",
  fingers:
    "The raised marks on F and J are your anchors. Let each index finger find them before every pattern.",
  keyboard:
    "Read the keyboard as small finger zones. Each key belongs to a finger, then the finger returns home.",
  ready:
    "Start slowly, keep the hands quiet, and let accuracy build the rhythm for the drill that follows.",
}

export function getLessonIntroSlides(lesson) {
  if (!lesson) {
    return []
  }

  const newKeys = lesson.newKeys || []
  const reviewKeys = lesson.reviewKeys || []
  const reinforcementKeys = lesson.reinforcementKeys || []
  const focusKeys =
    newKeys.length > 0
      ? newKeys
      : reinforcementKeys.length > 0
        ? reinforcementKeys
        : ["f", "j"]
  const lessonNumber = lesson.number ? `Lesson ${lesson.number}` : "Lesson"
  const sequencePreview = Object.entries(lesson.practiceSequences || {})
    .filter(([, sequences]) => sequences.length > 0)
    .slice(0, 3)
    .map(([name, sequences]) => `${name}: ${sequences[0]}`)

  return [
    {
      id: "welcome",
      eyebrow: lessonNumber,
      title: lesson.title,
      body: introCopy.opening,
      details: [
        lesson.goal,
        `Focus: ${lesson.focus}`,
        newKeys.length > 0
          ? `New keys: ${newKeys.join(" ")}`
          : "No new keys; this lesson reinforces earlier keys.",
        `Finger focus: ${lesson.fingers}`,
      ],
      illustration: {
        type: "lesson",
        keys: focusKeys,
        label: lesson.category,
      },
    },
    {
      id: "posture",
      eyebrow: "Posture",
      title: "Set a relaxed typing position",
      body: introCopy.posture,
      details: [
        "Feet flat and back supported.",
        "Elbows close to your sides.",
        "Wrists level and light, not planted.",
      ],
      illustration: {
        type: "posture",
      },
    },
    {
      id: "finger-placement",
      eyebrow: "Finger placement",
      title: "Find the home row anchors",
      body: introCopy.fingers,
      details: [
        "Left index rests on F.",
        "Right index rests on J.",
        "Other fingers settle naturally across the home row.",
      ],
      illustration: {
        type: "fingers",
        keys: focusKeys,
      },
    },
    {
      id: "keyboard-map",
      eyebrow: "Keyboard map",
      title: "Understand the keys in this lesson",
      body: introCopy.keyboard,
      details: [
        newKeys.length > 0
          ? "Highlighted keys are introduced in this step."
          : "Highlighted keys are review targets for this step.",
        `Review pool: ${
          reviewKeys.length > 0 ? reviewKeys.slice(-12).join(" ") : "none yet"
        }`,
        "Older learned keys continue appearing in reinforcement drills.",
      ],
      illustration: {
        type: "keyboard",
        keys: focusKeys,
      },
    },
    {
      id: "practice-plan",
      eyebrow: "Practice plan",
      title: "Blend new work with review",
      body:
        "Each drill is built from the cumulative curriculum so new keys are practiced alongside keys you have already learned.",
      details:
        sequencePreview.length > 0
          ? sequencePreview
          : ["Start with accuracy, then add speed only after the pattern feels steady."],
      illustration: {
        type: "ready",
        keys: focusKeys,
        label: lesson.stage,
      },
    },
    {
      id: "ready",
      eyebrow: "Ready",
      title: "Begin with accuracy first",
      body: introCopy.ready,
      details: [
        `New keys: ${newKeys.length > 0 ? newKeys.join(" ") : "review only"}`,
        `Cumulative keys: ${(lesson.cumulativeKeys || focusKeys).length}`,
        `Estimated time: ${lesson.duration}`,
        "Move only the finger you need, then reset.",
      ],
      illustration: {
        type: "ready",
        keys: focusKeys,
        label: "Slow, steady, accurate",
      },
    },
  ]
}
