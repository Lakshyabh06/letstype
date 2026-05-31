const keyWordBank = {
  A: ["ask", "salad", "data", "atlas"],
  S: ["sass", "desk", "lesson", "sense"],
  D: ["did", "added", "drill", "steady"],
  F: ["faff", "staff", "after", "draft"],
  J: ["jazz", "judge", "major", "adjust"],
  K: ["kick", "skill", "track", "keyboard"],
  L: ["level", "local", "lesson", "parallel"],
  ";": ["fall;", "all;", "ask;", "level;"],
  Q: ["quiet", "equal", "quick", "quote"],
  W: ["word", "lower", "sweet", "window"],
  E: ["even", "reset", "speed", "sense"],
  R: ["rare", "error", "return", "reader"],
  T: ["test", "state", "letter", "target"],
  Y: ["you", "rhythm", "yellow", "typing"],
  U: ["unit", "usual", "focus", "upper"],
  I: ["input", "still", "typing", "inside"],
  O: ["solo", "proof", "motion", "control"],
  P: ["pop", "upper", "repeat", "prompt"],
  Z: ["zest", "fizz", "zone", "zigzag"],
  X: ["exit", "extra", "index", "syntax"],
  C: ["cue", "civic", "coach", "accuracy"],
  V: ["vivid", "value", "review", "curve"],
  B: ["base", "bottom", "stable", "number"],
  N: ["none", "inner", "training", "pattern"],
  M: ["mom", "minimum", "memory", "rhythm"],
  ",": ["slow,", "reset,", "again,", "calm,"],
  ".": ["stop.", "reset.", "steady.", "focus."],
  "/": ["yes/no", "left/right", "up/down", "tap/tap"],
}

const fallbackWords = ["reset", "steady", "focus", "rhythm", "control", "lesson"]

function repeatKeys(keys = []) {
  if (keys.length === 0) {
    return "asdf jkl; asdf jkl;"
  }

  return keys
    .map((key) => `${key.toLowerCase()} ${key.toLowerCase()} ${key.toLowerCase()}`)
    .join("   ")
}

function wordsForKeys(keys = []) {
  return keys.flatMap((key) => keyWordBank[key] || keyWordBank[key.toUpperCase()] || [])
}

export function generateAdaptivePractice(analytics = {}) {
  const weakCluster = analytics.mastery?.weakKeyClusters?.[0]
  const weakFinger = analytics.mastery?.weakFingerZones?.[0]
  const confusionPair = analytics.confusionPairs?.[0]
  const focusKeys =
    weakCluster?.keys?.slice(0, 4).map((keyStats) => keyStats.key) ||
    weakFinger?.columns?.slice(0, 4) ||
    []
  const focusWords = wordsForKeys(focusKeys).slice(0, 8)

  if (confusionPair) {
    return {
      description: `Separate ${confusionPair.expectedKey} from ${confusionPair.actualKey} with slow alternating presses.`,
      drillText: `${confusionPair.expectedKey} ${confusionPair.actualKey} ${confusionPair.expectedKey} ${confusionPair.actualKey}  ${focusWords.slice(0, 4).join(" ")}`,
      focusKeys: [confusionPair.expectedKey, confusionPair.actualKey],
      title: "Confusion pair isolation",
      type: "confusion-pair",
    }
  }

  if (weakCluster) {
    return {
      description: `${weakCluster.title} is the strongest current review cluster.`,
      drillText: `${repeatKeys(focusKeys)}   ${
        focusWords.length > 0 ? focusWords.join(" ") : fallbackWords.join(" ")
      }`,
      focusKeys,
      title: `${weakCluster.title} review drill`,
      type: "weak-cluster",
    }
  }

  if (weakFinger) {
    return {
      description: `${weakFinger.label} needs relaxed reach-and-return practice.`,
      drillText: `${repeatKeys(focusKeys)}   ${fallbackWords.join(" ")}`,
      focusKeys,
      title: `${weakFinger.label} reach control`,
      type: "weak-finger",
    }
  }

  return {
    description: "No sharp weak area yet. Use this to keep rhythm even.",
    drillText: "asdf jkl; steady rhythm steady rhythm focus control",
    focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";"],
    title: "Balanced rhythm review",
    type: "balanced",
  }
}
