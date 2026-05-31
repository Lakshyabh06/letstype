export const curriculumKeyGroups = {
  lowercase: {
    anchors: ["f", "j"],
    leftHome: ["a", "s", "d"],
    rightHome: ["k", "l", ";"],
    centerHome: ["g", "h"],
    home: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    indexTop: ["r", "t", "y", "u"],
    outerTop: ["q", "w", "e", "i", "o", "p"],
    indexBottom: ["v", "b", "n", "m"],
    outerBottom: ["z", "x", "c"],
    all: [
      "a",
      "s",
      "d",
      "f",
      "j",
      "k",
      "l",
      ";",
      "r",
      "t",
      "y",
      "u",
      "q",
      "w",
      "e",
      "i",
      "o",
      "p",
      "v",
      "b",
      "n",
      "m",
      "z",
      "x",
      "c",
      "g",
      "h",
    ],
  },
  uppercase: {
    modifiers: ["Shift"],
    home: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    bottom: ["Z", "X", "C", "V", "B", "N", "M"],
    all: [
      "A",
      "S",
      "D",
      "F",
      "J",
      "K",
      "L",
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "G",
      "H",
    ],
  },
  punctuation: {
    home: [";", "'"],
    sentence: [",", ".", "?", "!"],
    paired: ["(", ")", '"', ":"],
  },
  numbers: {
    left: ["1", "2", "3", "4", "5"],
    right: ["6", "7", "8", "9", "0"],
  },
  symbols: {
    numberRow: ["!", "@", "#", "$", "%", "^", "&", "*"],
    operators: ["-", "_", "=", "+", "/", "\\"],
    brackets: ["[", "]", "{", "}"],
  },
  advanced: {
    spacing: ["Space"],
    wordFlow: ["common words", "short sentences", "paragraph rhythm"],
  },
}

const curriculumPlan = [
  {
    id: "orientation",
    title: "Orientation",
    eyebrow: "Start here",
    description: "Build posture, hand placement, and calm typing rhythm.",
    lessons: [
      {
        id: "posture-and-home-position",
        title: "Posture and Home Position",
        status: "completed",
        durationMinutes: 6,
        category: "Foundation",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Find the lowercase f and j anchor keys with relaxed hands.",
        goal: "Place both index fingers on f and j without looking down.",
        newKeys: curriculumKeyGroups.lowercase.anchors,
        fingers: "Index fingers",
        practiceSequences: {
          warmup: ["ffff jjjj", "ff jj ff jj"],
          focus: ["fj jf fj jf", "ffjj jjff"],
          challenge: ["fjfj jfjf ffjj jjff"],
        },
      },
      {
        id: "home-row-anchors",
        title: "Home Row Anchor Rhythm",
        status: "unlocked",
        durationMinutes: 8,
        category: "Foundation",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Repeat f and j while keeping every other finger resting.",
        goal: "Build a steady left-right rhythm before adding new keys.",
        newKeys: [],
        fingers: "Left and right index",
        practiceSequences: {
          warmup: ["f j f j", "ff jj fj jf"],
          focus: ["fjfj jfjf", "fff jjj fjf jfj"],
          challenge: ["ffj jjf fjj jff"],
        },
      },
    ],
  },
  {
    id: "home-row",
    title: "Lowercase Home Row",
    eyebrow: "Beginner path",
    description:
      "Introduce small lowercase clusters while earlier anchor keys keep returning.",
    lessons: [
      {
        id: "left-home-row",
        title: "Left Hand Home Row",
        durationMinutes: 10,
        category: "Finger control",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase a, s, and d while f and j stay in practice.",
        goal: "Return each left-hand finger to home position after every press.",
        newKeys: curriculumKeyGroups.lowercase.leftHome,
        fingers: "Left pinky to index",
        practiceSequences: {
          warmup: ["asdf fdsa", "a s d f j"],
          focus: ["sadf fad jdf", "asdf fj fj"],
          challenge: ["as fj sad fjd"],
        },
      },
      {
        id: "right-home-row",
        title: "Right Hand Home Row",
        durationMinutes: 10,
        category: "Finger control",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase k, l, and semicolon without dropping f and j.",
        goal: "Balance right-hand motion with the full learned home row.",
        newKeys: curriculumKeyGroups.lowercase.rightHome,
        fingers: "Right index to pinky",
        practiceSequences: {
          warmup: ["jkl; ;lkj", "f j k l ;"],
          focus: ["fjkl ;lkj asdf", "jkl; fjfj"],
          challenge: ["asdf jkl; sadf fjkl"],
        },
      },
      {
        id: "home-row-combinations",
        title: "Home Row Combinations",
        durationMinutes: 12,
        category: "Rhythm",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Blend the learned home-row keys into short alternating drills.",
        goal: "Type core home-row patterns without visual checking.",
        newKeys: [],
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["asdf jkl;", "fdsa ;lkj"],
          focus: ["ask dad fall flask", "sad lad; jak"],
          challenge: ["a flask; a fall; sad dad"],
        },
      },
      {
        id: "center-home-reaches",
        title: "Center Home Reaches",
        durationMinutes: 10,
        category: "Reach training",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase g and h while reviewing the full home row.",
        goal: "Reach inward with index fingers and return to f and j.",
        newKeys: curriculumKeyGroups.lowercase.centerHome,
        fingers: "Index fingers",
        practiceSequences: {
          warmup: ["fg hj gf jh", "g h f j"],
          focus: ["hash flag glass", "high glad hall"],
          challenge: ["high glass; glad flash"],
        },
      },
    ],
  },
  {
    id: "top-row",
    title: "Lowercase Top Row",
    eyebrow: "Reach training",
    description:
      "Add top-row reaches while home-row review remains part of every drill.",
    lessons: [
      {
        id: "top-row-index-reach",
        title: "Index Finger Reaches",
        durationMinutes: 12,
        category: "Reach training",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase r, t, y, and u from the home row anchors.",
        goal: "Reach up and return without shifting the whole hand.",
        newKeys: curriculumKeyGroups.lowercase.indexTop,
        fingers: "Index fingers",
        practiceSequences: {
          warmup: ["fr jt fy ju", "rt yu rt yu"],
          focus: ["try fury rut", "trust just study"],
          challenge: ["rusty study; just try"],
        },
      },
      {
        id: "top-row-outer-reaches",
        title: "Outer Top Row Reaches",
        durationMinutes: 14,
        category: "Accuracy",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add q, w, e, i, o, and p while keeping home-row resets.",
        goal: "Keep accuracy steady as reach distance increases.",
        newKeys: curriculumKeyGroups.lowercase.outerTop,
        fingers: "Outer fingers",
        practiceSequences: {
          warmup: ["qwer uiop", "we io qe op"],
          focus: ["type quiet word", "power tower flow"],
          challenge: ["type a quiet word; flow steady"],
        },
      },
    ],
  },
  {
    id: "bottom-row",
    title: "Lowercase Bottom Row",
    eyebrow: "Full lowercase",
    description:
      "Complete the lowercase alphabet before capitals, numbers, or symbols appear.",
    lessons: [
      {
        id: "bottom-row-index-reach",
        title: "Bottom Row Index Reaches",
        durationMinutes: 12,
        category: "Reach training",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase v, b, n, and m with full lowercase review.",
        goal: "Reach down and return to home row without wrist movement.",
        newKeys: curriculumKeyGroups.lowercase.indexBottom,
        fingers: "Index fingers",
        practiceSequences: {
          warmup: ["fv jb fn jm", "vb nm bv mn"],
          focus: ["main move brave", "number seven"],
          challenge: ["move brave minds; type even"],
        },
      },
      {
        id: "bottom-row-outer-reaches",
        title: "Outer Bottom Row Reaches",
        durationMinutes: 14,
        category: "Accuracy",
        difficulty: "Beginner",
        stage: "lowercase",
        focus: "Add lowercase z, x, and c while reviewing all earlier letters.",
        goal: "Finish lowercase control before learning Shift.",
        newKeys: curriculumKeyGroups.lowercase.outerBottom,
        fingers: "Left outer fingers",
        practiceSequences: {
          warmup: ["za xs dc", "zx cv cz"],
          focus: ["exact civic cozy", "size text cycle"],
          challenge: ["exact cozy text; civic rhythm"],
        },
      },
    ],
  },
  {
    id: "shift-capitals",
    title: "Shift and Capitals",
    eyebrow: "Capital letters",
    description:
      "Teach Shift deliberately after lowercase control is established.",
    lessons: [
      {
        id: "shift-key-coordination",
        title: "Shift Key Coordination",
        durationMinutes: 10,
        category: "Modifier control",
        difficulty: "Intermediate",
        stage: "uppercase",
        focus:
          "Use Shift as a held modifier, then release it before returning to lowercase.",
        goal: "Press Shift with one hand while the opposite hand types the letter.",
        newKeys: curriculumKeyGroups.uppercase.modifiers,
        fingers: "Both pinkies",
        practiceSequences: {
          warmup: ["f F j J", "d D k K"],
          focus: ["a A s S j J k K", "ff FF jj JJ"],
          challenge: ["aSdf FjKl"],
        },
      },
      {
        id: "opposite-hand-capitals",
        title: "Opposite-Hand Capitals",
        durationMinutes: 14,
        category: "Capital letters",
        difficulty: "Intermediate",
        stage: "uppercase",
        focus:
          "Coordinate left Shift for right-hand capitals and right Shift for left-hand capitals.",
        goal: "Choose the opposite Shift key automatically for capital letters.",
        newKeys: curriculumKeyGroups.uppercase.home,
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["A S D F J K L", "aA sS dD fF jJ kK lL"],
          focus: ["Ask Dad", "Jill Falls", "A sad lad"],
          challenge: ["aSdf FjKl Ask Jill"],
        },
      },
      {
        id: "top-row-capitals",
        title: "Top Row Capitals",
        durationMinutes: 16,
        category: "Capital letters",
        difficulty: "Intermediate",
        stage: "uppercase",
        focus: "Add top-row capitals while lowercase review stays active.",
        goal: "Use the opposite Shift key for every top-row capital.",
        newKeys: curriculumKeyGroups.uppercase.top,
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["TypE Type Try", "Word Flow Quiet"],
          focus: ["The Quick Type", "Use Right Shift; Use Left Shift"],
          challenge: ["TypE aSdf FjKl Quiet Flow"],
        },
      },
      {
        id: "bottom-row-capitals",
        title: "Bottom Row Capitals",
        durationMinutes: 14,
        category: "Capital letters",
        difficulty: "Intermediate",
        stage: "uppercase",
        focus: "Add bottom-row capitals with full lowercase review.",
        goal: "Keep wrist position calm while Shift and bottom reaches combine.",
        newKeys: curriculumKeyGroups.uppercase.bottom,
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["Z X C V B N M", "zZ xX cC vV bB nN mM"],
          focus: ["Move Back Now", "Civic Zone Mix"],
          challenge: ["Move Back Now; TypE a Civic Zone"],
        },
      },
      {
        id: "mixed-case-word-flow",
        title: "Mixed-Case Word Flow",
        durationMinutes: 16,
        category: "Mixed case",
        difficulty: "Intermediate",
        stage: "uppercase",
        focus: "Practice lowercase and uppercase together in word-like drills.",
        goal: "Keep rhythm steady while capitals appear inside normal typing.",
        newKeys: [],
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["aSdf FjKl TypE", "Word Flow Quiet"],
          focus: ["The Quick Type", "Use Right Shift; Use Left Shift"],
          challenge: ["TypE aSdf FjKl Quiet Flow"],
        },
      },
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation",
    eyebrow: "Sentence control",
    description:
      "Add punctuation after Shift so drills can include realistic mixed-case sentences.",
    lessons: [
      {
        id: "sentence-punctuation",
        title: "Sentence Punctuation",
        durationMinutes: 14,
        category: "Punctuation",
        difficulty: "Intermediate",
        stage: "punctuation",
        focus: "Add commas, periods, question marks, and exclamation marks.",
        goal: "Type simple sentence endings without breaking hand position.",
        newKeys: curriculumKeyGroups.punctuation.sentence,
        fingers: "Right middle, ring, and pinky",
        practiceSequences: {
          warmup: [", . ? !", "yes, no. Why? Try!"],
          focus: ["Ask Jill, then Type.", "Why try? Type well!"],
          challenge: ["Type well, Ask clearly, and Try again!"],
        },
      },
    ],
  },
  {
    id: "numbers-symbols",
    title: "Numbers and Symbols",
    eyebrow: "Precision row",
    description:
      "Introduce numbers before shifted symbols, with earlier letters and capitals still in rotation.",
    lessons: [
      {
        id: "number-row",
        title: "Number Row",
        durationMinutes: 16,
        category: "Numbers",
        difficulty: "Intermediate",
        stage: "numbers",
        focus: "Add the number row in left and right hand groups.",
        goal: "Reach upward for digits and return to home row cleanly.",
        newKeys: [
          ...curriculumKeyGroups.numbers.left,
          ...curriculumKeyGroups.numbers.right,
        ],
        fingers: "Top-row reaches",
        practiceSequences: {
          warmup: ["12345 67890", "1a 2s 3d 4f 7j 8k 9l 0;"],
          focus: ["Type 10 lines", "Ask 2 times, then type 4 words."],
          challenge: ["Type 24 Words, then Rest 10 Seconds."],
        },
      },
      {
        id: "common-symbols",
        title: "Common Symbols",
        durationMinutes: 18,
        category: "Symbols",
        difficulty: "Advanced",
        stage: "symbols",
        focus: "Add shifted number-row symbols and common operators.",
        goal: "Use Shift for symbols with the same opposite-hand discipline.",
        newKeys: [
          ...curriculumKeyGroups.symbols.numberRow,
          ...curriculumKeyGroups.symbols.operators,
        ],
        fingers: "Both hands",
        practiceSequences: {
          warmup: ["! @ # $ % ^ & *", "- _ = + / \\"],
          focus: ["Save 10% + Type 5", "Focus @ 9:00!"],
          challenge: ["Type 5 + 5 = 10, then Rest @ Home."],
        },
      },
    ],
  },
  {
    id: "advanced-drills",
    title: "Advanced Drills",
    eyebrow: "Fluency",
    description:
      "Use cumulative drills that mix letters, capitals, punctuation, numbers, and symbols.",
    lessons: [
      {
        id: "mixed-fluency",
        title: "Mixed Fluency",
        durationMinutes: 20,
        category: "Advanced drills",
        difficulty: "Advanced",
        stage: "advanced",
        focus:
          "Practice realistic mixed typing while reinforcing every prior key family.",
        goal: "Keep accuracy and rhythm stable across varied text.",
        newKeys: [],
        fingers: "Full keyboard",
        practiceSequences: {
          warmup: ["aSdf FjKl TypE 123", "Focus @ 10, Rest @ 11."],
          focus: [
            "Type 12 clean lines, then review 3 errors.",
            "Ask: Why did TypE speed rise 10%?",
          ],
          challenge: [
            "The Quick Typist scored 98% accuracy at 42 WPM!",
          ],
        },
      },
    ],
  },
]

const sequenceOrder = [
  "warmup",
  "focus",
  "reinforcement",
  "challenge",
  "assessment",
]

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function takeRecent(values, count) {
  return values.slice(Math.max(values.length - count, 0))
}

function weaveKeys(primaryKeys, reviewKeys) {
  const length = Math.max(primaryKeys.length, reviewKeys.length)
  const woven = []

  for (let index = 0; index < length; index += 1) {
    if (reviewKeys[index]) {
      woven.push(reviewKeys[index])
    }

    if (primaryKeys[index]) {
      woven.push(primaryKeys[index])
    }
  }

  return unique(woven)
}

function buildReinforcementSequences(reviewKeys, newKeys) {
  if (reviewKeys.length === 0) {
    return []
  }

  const recentReview = takeRecent(reviewKeys, 8)
  const sequenceKeys = newKeys.length > 0 ? weaveKeys(newKeys, recentReview) : recentReview

  return [
    sequenceKeys.join(" "),
    sequenceKeys
      .slice()
      .reverse()
      .join(" "),
  ]
}

function normalizePracticeSequences(practiceSequences, reviewKeys, newKeys) {
  const providedSequences = Array.isArray(practiceSequences)
    ? { focus: practiceSequences }
    : practiceSequences || {}
  const generatedReinforcement = buildReinforcementSequences(reviewKeys, newKeys)

  return {
    ...providedSequences,
    reinforcement: unique([
      ...generatedReinforcement,
      ...(providedSequences.reinforcement || []),
    ]),
  }
}

function flattenPracticeText(practiceSequences) {
  return sequenceOrder
    .flatMap((sequenceName) => practiceSequences[sequenceName] || [])
    .join(" ")
}

function buildCourseModules(plan) {
  let learnedKeys = []
  let lessonIndex = 0

  return plan.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => {
      lessonIndex += 1

      const newKeys = lesson.newKeys || []
      const reviewKeys = unique(lesson.reviewKeys || learnedKeys)
      const cumulativeKeys = unique([...learnedKeys, ...newKeys])
      const practiceSequences = normalizePracticeSequences(
        lesson.practiceSequences,
        reviewKeys,
        newKeys
      )

      learnedKeys = cumulativeKeys

      return {
        ...lesson,
        number: String(lessonIndex).padStart(2, "0"),
        status: lesson.status || "locked",
        duration: `${lesson.durationMinutes} min`,
        durationSeconds: lesson.durationMinutes * 60,
        newKeys,
        reviewKeys,
        cumulativeKeys,
        reinforcementKeys: unique([...reviewKeys, ...newKeys]),
        keys: cumulativeKeys,
        practiceSequences,
        lessonText: flattenPracticeText(practiceSequences),
        moduleId: module.id,
        moduleTitle: module.title,
      }
    }),
  }))
}

const courseModules = buildCourseModules(curriculumPlan)

export function getCourseLessons() {
  return courseModules.flatMap((module) => module.lessons)
}

export function getActiveLesson() {
  const lessons = getCourseLessons()

  return (
    lessons.find((lesson) => lesson.status === "unlocked") ||
    lessons.find((lesson) => lesson.status === "locked") ||
    lessons[lessons.length - 1]
  )
}

export function getLessonById(lessonId) {
  return getCourseLessons().find((lesson) => lesson.id === lessonId)
}

export function getLessonsByStage(stage) {
  return getCourseLessons().filter((lesson) => lesson.stage === stage)
}

export default courseModules
