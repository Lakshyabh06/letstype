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
  "observe",
  "forward",
  "compose",
  "balance",
  "anchor",
  "repeat",
  "gentle",
  "motion",
  "stable",
  "intent",
  "careful",
  "patient",
  "flow",
  "measure",
  "listen",
  "prepare",
  "train",
  "refine",
  "growth",
  "skill",
  "finish",
  "simple",
  "direct",
  "smooth",
  "learn",
  "improve",
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
  "target",
  "correct",
  "notice",
  "repair",
  "align",
  "patient",
  "measure",
  "reduce",
  "missed",
  "finger",
  "position",
  "repeat",
  "check",
  "stable",
  "clean",
  "even",
  "control",
  "quiet",
  "track",
  "review",
  "shape",
  "score",
  "steady",
  "sample",
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
  "a clear target turns effort into useful information",
  "practice feels lighter when the next step is obvious",
  "smooth rhythm grows from patient corrections",
  "good feedback keeps attention close to the work",
  "speed arrives when accuracy stops feeling fragile",
  "short focused sessions build trust in the hands",
  "the quietest improvement is often the most durable",
  "every clean repetition makes the next one easier",
  "confidence grows when mistakes become visible",
  "use the first pass to learn and the second to refine",
  "steady pace beats rushed effort over a long session",
  "the keyboard feels smaller when movement is relaxed",
  "review the pattern then return to the line",
  "clarity keeps practice from turning into guessing",
  "the best run leaves you ready for one more",
  "each correction is a signal not a setback",
  "train the difficult key before it trains you",
  "small wins become durable when they are repeated",
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
  "asdf fdsa jkl ljk",
  "qaz wsx edc rfvt",
  "ujm ik ol p",
  "fr de sw aq",
  "ju ki lo p",
  "aa ss dd ff jj kk ll",
  "left hand right hand",
  "home reach home reach",
  "sad lad fall ask",
  "seal desk safe lead",
  "quiet quick equal",
  "right light tight",
]

const numberDrills = [
  "12345 67890",
  "49581 27364",
  "10293 84756",
  "24680 13579",
  "90817 26354",
  "31415 92653",
  "11223 34455",
  "66778 89900",
  "2026 1492 7531",
  "8080 4040 9090",
  "135 246 579 680",
  "7001 8204 9365",
  "12 34 56 78 90",
  "9012 3456 7890",
  "500 250 125 062",
  "1984 2001 2048",
]

const symbolDrills = [
  "! @ # $ % ^ & * ( )",
  "` ~ - _ = + [ ] { }",
  "; : ' \" , . / ?",
  "< > | \\",
  "[] {} () <>",
  "$25.00 @ 10%",
  "name@example.com",
  "value === true;",
  "path/to/file",
  "left -> right",
  "score += 1;",
  "(alpha) [beta] {gamma}",
  "price: $48.50",
  "ratio = 3:2",
  "save_as_final.txt",
  "ready? yes!",
]

const mixedCharacterDrills = [
  "A7d! F4k# L2",
  "q9@ W3$ e5%",
  "R2d2 C3p0",
  "m8*N v6&B",
  "Z1x! C2v@ B3n#",
  "Type4Fun!",
  "PlanA-27 ready?",
  "Focus_90 @ home",
  "Key#42 = steady",
  "R5t! L8m? Q2",
  "alpha-7 beta_9",
  "Run(30) then review",
  "Save_v2 before 5pm",
  "A1 s2 D3 f4 J5",
  "mix: 18% clean",
  "ID-7420 ok!",
]

const alphanumericDrills = [
  "A7D4 F9K2 L5S8",
  "user42 key19 code73",
  "B2C4 D6E8 F1G3",
  "alpha7 beta9 gamma3",
  "K8M1 P4R6 T2Y5",
  "ID2048 PIN7391",
  "route66 cabin12 signal5",
  "A1B2 C3D4 E5F6",
  "task24 batch18 build07",
  "Q7W8 E9R1 T2Y3",
  "level3 stage5 round8",
  "zone12 grid45 path89",
  "M4N7 B2V9 C6X1",
  "alpha2026 beta140 gamma73",
  "room101 floor8 desk42",
  "key19 key27 key38",
]

const programmingLines = [
  "const user = \"LetsType\";",
  "function calculateWpm() {}",
  "return wordsTyped / minutes;",
  "if (isCorrect) { score += 1; }",
  "const keys = [\"a\", \"s\", \"d\", \"f\"];",
  "for (let index = 0; index < total; index += 1) {}",
  "const active = items.filter(Boolean);",
  "return input.trim().toLowerCase();",
  "if (!user) { return null; }",
  "items.map((item) => item.id);",
  "const score = Math.max(0, value);",
  "while (queue.length > 0) {}",
  "export function resetSession() {}",
  "const next = current + step;",
  "try { await saveDraft(); } catch (error) {}",
  "button.addEventListener(\"click\", start);",
  "const total = values.reduce((sum, item) => sum + item, 0);",
  "return `${firstName}.${lastName}`;",
]

const emailLines = [
  "hello@example.com",
  "support@company.com",
  "team.member@startup.io",
  "first.last+practice@mail.co",
  "billing_2026@service.net",
  "learn.typing@letstype.app",
  "practice.team@example.org",
  "first.last@workplace.dev",
  "typing-coach@learning.io",
  "review+daily@inbox.com",
  "hello.world@domain.co",
  "team_42@product.app",
  "support+trial@service.io",
  "name.surname@company.net",
  "student2026@school.edu",
  "updates@letstype.app",
]

function seededRandom(seed = 0) {
  let value = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b)

  return () => {
    value += 0x6d2b79f5
    let next = Math.imul(value ^ (value >>> 15), value | 1)

    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed(items, seed = 0) {
  const output = [...items]
  const random = seededRandom(seed)

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = output[index]

    output[index] = output[swapIndex]
    output[swapIndex] = current
  }

  return output
}

function repeatToLength(items, targetCount, seed = 0) {
  const output = []
  let round = 0

  while (output.length < targetCount) {
    output.push(...shuffleWithSeed(items, seed + round * 131))
    round += 1
  }

  return output.slice(0, targetCount)
}

function repeatLinesToText(lines, targetWordCount, seed = 0) {
  const output = []
  let wordCount = 0
  let round = 0

  while (wordCount < targetWordCount) {
    const lineSet = shuffleWithSeed(lines, seed + round * 193)

    for (const line of lineSet) {
      if (wordCount >= targetWordCount) {
        break
      }

      output.push(line)
      wordCount += line.split(/\s+/).filter(Boolean).length
    }

    round += 1
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
