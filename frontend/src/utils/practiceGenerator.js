export const timedOptions = [15, 30, 60, 120]

export const practiceModes = [
  {
    description: "A clean time box with live pace, raw speed, and honest accuracy.",
    id: "timed",
    label: "Timed Test",
  },
  {
    description: "Slower precision work where missed keys carry extra weight.",
    id: "accuracy",
    label: "Accuracy Mode",
  },
  {
    description: "A calm workspace with fewer panels and softer visual noise.",
    id: "focus",
    label: "Focus Mode",
  },
  {
    description: "Train short editorial passages with natural rhythm.",
    id: "quote",
    label: "Quote Practice",
  },
  {
    description: "Paste your own text while keeping strict typing rules.",
    id: "custom",
    label: "Custom Text",
  },
  {
    description: "Adaptive weak-key drills generated from your current analytics.",
    id: "review",
    label: "Review Practice",
  },
  {
    defaultDuration: 30,
    description: "A short pressure run tuned for clean acceleration.",
    id: "sprint",
    label: "Sprint Trial",
    timed: true,
  },
  {
    description: "Mistake-aware control work with heavier weak-key rotation.",
    id: "precision",
    label: "Precision Lock",
  },
  {
    defaultDuration: 120,
    description: "A longer practice run for rhythm, stamina, and consistency.",
    id: "endurance",
    label: "Endurance Run",
    timed: true,
  },
]

export const practiceCategories = [
  {
    description: "Isolated letter drills for clean hand placement and rhythm.",
    id: "letter",
    label: "Letter Practice",
  },
  {
    description: "Number-row repetition with grouped digit patterns.",
    id: "number",
    label: "Number Practice",
  },
  {
    description: "Punctuation and symbol drills for stronger reach control.",
    id: "symbol",
    label: "Symbol Practice",
  },
  {
    description: "Short mixed runs combining letters, numbers, and symbols.",
    id: "mixed",
    label: "Mixed Characters",
  },
  {
    description: "Letter-and-number combinations for passwords and IDs.",
    id: "alphanumeric",
    label: "Alphanumeric Practice",
  },
  {
    description: "Editorial lines with natural phrasing and cadence.",
    id: "quote",
    label: "Quote Practice",
  },
  {
    description: "Code-shaped syntax with braces, quotes, and operators.",
    id: "programming",
    label: "Programming Practice",
  },
  {
    description: "Email addresses and domain patterns for everyday typing.",
    id: "email",
    label: "Email Practice",
  },
  {
    description: "Paste your own material into the same practice engine.",
    id: "custom",
    label: "Custom Text",
  },
]

const modeCatalog = [...practiceModes, ...practiceCategories]

export function getPracticeModes() {
  return practiceModes
}

export function getPracticeCategories() {
  return practiceCategories
}

export function getPracticeMode(modeId) {
  return (
    modeCatalog.find((mode) => mode.id === modeId) ||
    practiceModes[0]
  )
}

export function isTimedPracticeMode(modeId) {
  return Boolean(
    modeCatalog.find((mode) => mode.id === modeId)?.timed ||
      modeId === "timed"
  )
}

const focusWords = [
  "steady",
  "calm",
  "signal",
  "method",
  "review",
  "control",
  "lesson",
  "focus",
  "rhythm",
  "memory",
  "practice",
  "clarity",
  "typing",
  "guided",
]

const accuracyWords = [
  "level",
  "sense",
  "draft",
  "adjust",
  "steady",
  "local",
  "reset",
  "control",
  "inside",
  "return",
  "detail",
  "smooth",
]

const beginnerWords = [
  "as",
  "sad",
  "lad",
  "fall",
  "jazz",
  "ask",
  "seal",
  "desk",
  "safe",
  "lead",
  "calm",
  "steady",
]

const quoteLines = [
  "deep work begins when attention has a clear place to land",
  "accuracy gives speed a place to stand",
  "small deliberate repetitions compound into reliable skill",
  "the best systems make the next good action easy",
  "calm hands learn the path before they chase the pace",
  "progress is easier to keep when feedback is specific",
]

const letterDrills = [
  "asdf jkl",
  "qwer tyui",
  "zxcv bnm",
  "fjdk slar",
  "home row",
  "clean form",
  "shift keys",
  "Aa Bb Cc Dd",
]

const numberDrills = [
  "12345 67890",
  "49581 27364",
  "10293 84756",
  "24680 13579",
  "90817 26354",
  "31415 92653",
]

const symbolDrills = [
  "! @ # $ % ^ & * ( )",
  "` ~ - _ = + [ ] { }",
  "; : ' \" , . / ?",
  "< > | \\",
  "[] {} () <>",
  "$25.00 @ 10%",
]

const mixedCharacterDrills = [
  "A7d! F4k# L2",
  "q9@ W3$ e5%",
  "R2d2 C3p0",
  "m8*N v6&B",
  "Z1x! C2v@ B3n#",
  "Type4Fun!",
]

const alphanumericDrills = [
  "A7D4 F9K2 L5S8",
  "user42 key19 code73",
  "B2C4 D6E8 F1G3",
  "alpha7 beta9 gamma3",
  "K8M1 P4R6 T2Y5",
  "ID2048 PIN7391",
]

const programmingLines = [
  "const user = \"LetsType\";",
  "function calculateWpm() {}",
  "return wordsTyped / minutes;",
  "if (isCorrect) { score += 1; }",
  "const keys = [\"a\", \"s\", \"d\", \"f\"];",
  "for (let index = 0; index < total; index += 1) {}",
]

const emailLines = [
  "hello@example.com",
  "support@company.com",
  "team.member@startup.io",
  "first.last+practice@mail.co",
  "billing_2026@service.net",
  "learn.typing@letstype.app",
]

function repeatToLength(items, targetCount, seed = 0) {
  const output = []

  for (let index = 0; output.length < targetCount; index += 1) {
    output.push(items[(index + seed) % items.length])
  }

  return output
}

function repeatLinesToText(lines, targetWordCount, seed = 0) {
  const output = []
  let wordCount = 0

  for (let index = 0; wordCount < targetWordCount; index += 1) {
    const line = lines[(index + seed) % lines.length]

    output.push(line)
    wordCount += line.split(/\s+/).filter(Boolean).length
  }

  return output.join(" ")
}

function pickWeakKeyWords(analytics = {}) {
  const weakKeys =
    analytics.mastery?.weakKeyClusters?.[0]?.keys
      ?.slice(0, 4)
      .map((keyStats) => keyStats.key)
      .filter(Boolean) || []

  if (weakKeys.length === 0) {
    return []
  }

  return weakKeys.flatMap((key) => [
    key.toLowerCase(),
    `${key.toLowerCase()}${key.toLowerCase()}`,
    "reset",
    "steady",
  ])
}

export function generatePracticePrompt({
  analytics,
  customText = "",
  duration = 60,
  modeId = "focus",
  practicePlan,
  seed = 0,
} = {}) {
  const mode = getPracticeMode(modeId)
  const targetWordCount = Math.max(18, Math.round(duration * 1.65))
  const weakKeyWords = pickWeakKeyWords(analytics)
  let words = focusWords

  if (mode.id === "custom") {
    const text = customText.trim().replace(/\s+/g, " ")

    return {
      focusKeys: [],
      mode,
      text:
        text ||
        "paste a custom line here then train it with strict accuracy",
      title: mode.label,
    }
  }

  if (mode.id === "beginner") {
    words = beginnerWords
  }

  if (mode.id === "focus") {
    words = [
      ...focusWords,
      ...accuracyWords,
    ].filter(Boolean)
  }

  if (mode.id === "timed" || mode.id === "sprint") {
    words = [...focusWords, ...accuracyWords, ...weakKeyWords].filter(Boolean)
  }

  if (mode.id === "accuracy" || mode.id === "precision") {
    words = [
      ...accuracyWords,
      ...weakKeyWords,
      ...accuracyWords,
      "pause",
      "align",
      "control",
    ].filter(Boolean)
  }

  if (mode.id === "quote") {
    return {
      focusKeys: practicePlan?.focusKeys || weakKeyWords.slice(0, 4),
      mode,
      text: repeatToLength(
        quoteLines,
        Math.max(2, Math.round(duration / 25)),
        seed
      ).join(" "),
      title: mode.label,
    }
  }

  if (mode.id === "letter") {
    return {
      focusKeys: [],
      mode,
      text: repeatLinesToText(letterDrills, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "number") {
    return {
      focusKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      mode,
      text: repeatLinesToText(numberDrills, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "symbol") {
    return {
      focusKeys: ["!", "@", "#", "$", "%", "^", "&", "*"],
      mode,
      text: repeatLinesToText(symbolDrills, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "mixed") {
    return {
      focusKeys: [],
      mode,
      text: repeatLinesToText(mixedCharacterDrills, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "alphanumeric") {
    return {
      focusKeys: [],
      mode,
      text: repeatLinesToText(alphanumericDrills, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "programming") {
    return {
      focusKeys: ["{", "}", "(", ")", ";", "="],
      mode,
      text: repeatLinesToText(programmingLines, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "email") {
    return {
      focusKeys: ["@", ".", "-", "_", "+"],
      mode,
      text: repeatLinesToText(emailLines, targetWordCount, seed),
      title: mode.label,
    }
  }

  if (mode.id === "review") {
    words = [
      ...(practicePlan?.drillText ? practicePlan.drillText.split(/\s+/) : []),
      ...weakKeyWords,
      ...accuracyWords,
      ...focusWords,
    ].filter(Boolean)
  }

  if (mode.id === "endurance") {
    words = [
      ...quoteLines.join(" ").split(/\s+/),
      ...focusWords,
      ...accuracyWords,
      ...weakKeyWords,
    ].filter(Boolean)
  }

  return {
    focusKeys: practicePlan?.focusKeys || weakKeyWords.slice(0, 4),
    mode,
    text: repeatToLength(words, targetWordCount, seed).join(" "),
    title:
      mode.id === "focus" && practicePlan?.title
        ? practicePlan.title
        : mode.label,
  }
}
