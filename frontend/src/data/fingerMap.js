export const FINGER_IDS = {
  LEFT_PINKY: "leftPinky",
  LEFT_RING: "leftRing",
  LEFT_MIDDLE: "leftMiddle",
  LEFT_INDEX: "leftIndex",
  LEFT_THUMB: "leftThumb",
  RIGHT_THUMB: "rightThumb",
  RIGHT_INDEX: "rightIndex",
  RIGHT_MIDDLE: "rightMiddle",
  RIGHT_RING: "rightRing",
  RIGHT_PINKY: "rightPinky",
}

export const HAND_IDS = {
  LEFT: "left",
  RIGHT: "right",
}

export const fingerMap = {
  [FINGER_IDS.LEFT_PINKY]: {
    id: FINGER_IDS.LEFT_PINKY,
    handId: HAND_IDS.LEFT,
    hand: "Left",
    label: "Pinky",
    shortLabel: "LP",
    homeKey: "A",
    reachZone: "Outer left column",
    color: "#F08C7D",
    softColor: "rgba(240, 140, 125, 0.14)",
    glowColor: "rgba(240, 140, 125, 0.26)",
  },
  [FINGER_IDS.LEFT_RING]: {
    id: FINGER_IDS.LEFT_RING,
    handId: HAND_IDS.LEFT,
    hand: "Left",
    label: "Ring",
    shortLabel: "LR",
    homeKey: "S",
    reachZone: "Left ring column",
    color: "#E4B86D",
    softColor: "rgba(228, 184, 109, 0.14)",
    glowColor: "rgba(228, 184, 109, 0.24)",
  },
  [FINGER_IDS.LEFT_MIDDLE]: {
    id: FINGER_IDS.LEFT_MIDDLE,
    handId: HAND_IDS.LEFT,
    hand: "Left",
    label: "Middle",
    shortLabel: "LM",
    homeKey: "D",
    reachZone: "Left middle column",
    color: "#D8C7A3",
    softColor: "rgba(216, 199, 163, 0.14)",
    glowColor: "rgba(216, 199, 163, 0.25)",
  },
  [FINGER_IDS.LEFT_INDEX]: {
    id: FINGER_IDS.LEFT_INDEX,
    handId: HAND_IDS.LEFT,
    hand: "Left",
    label: "Index",
    shortLabel: "LI",
    homeKey: "F",
    reachZone: "Left index columns",
    color: "#8FB8AA",
    softColor: "rgba(143, 184, 170, 0.16)",
    glowColor: "rgba(143, 184, 170, 0.28)",
  },
  [FINGER_IDS.LEFT_THUMB]: {
    id: FINGER_IDS.LEFT_THUMB,
    handId: HAND_IDS.LEFT,
    hand: "Left",
    label: "Thumb",
    shortLabel: "LT",
    homeKey: "Space",
    reachZone: "Left thumb rest",
    color: "#9AB8D9",
    softColor: "rgba(154, 184, 217, 0.14)",
    glowColor: "rgba(154, 184, 217, 0.24)",
  },
  [FINGER_IDS.RIGHT_THUMB]: {
    id: FINGER_IDS.RIGHT_THUMB,
    handId: HAND_IDS.RIGHT,
    hand: "Right",
    label: "Thumb",
    shortLabel: "RT",
    homeKey: "Space",
    reachZone: "Right thumb rest",
    color: "#9AB8D9",
    softColor: "rgba(154, 184, 217, 0.14)",
    glowColor: "rgba(154, 184, 217, 0.24)",
  },
  [FINGER_IDS.RIGHT_INDEX]: {
    id: FINGER_IDS.RIGHT_INDEX,
    handId: HAND_IDS.RIGHT,
    hand: "Right",
    label: "Index",
    shortLabel: "RI",
    homeKey: "J",
    reachZone: "Right index columns",
    color: "#79B6C8",
    softColor: "rgba(121, 182, 200, 0.15)",
    glowColor: "rgba(121, 182, 200, 0.26)",
  },
  [FINGER_IDS.RIGHT_MIDDLE]: {
    id: FINGER_IDS.RIGHT_MIDDLE,
    handId: HAND_IDS.RIGHT,
    hand: "Right",
    label: "Middle",
    shortLabel: "RM",
    homeKey: "K",
    reachZone: "Right middle column",
    color: "#A7C785",
    softColor: "rgba(167, 199, 133, 0.14)",
    glowColor: "rgba(167, 199, 133, 0.24)",
  },
  [FINGER_IDS.RIGHT_RING]: {
    id: FINGER_IDS.RIGHT_RING,
    handId: HAND_IDS.RIGHT,
    hand: "Right",
    label: "Ring",
    shortLabel: "RR",
    homeKey: "L",
    reachZone: "Right ring column",
    color: "#C6A3D8",
    softColor: "rgba(198, 163, 216, 0.13)",
    glowColor: "rgba(198, 163, 216, 0.22)",
  },
  [FINGER_IDS.RIGHT_PINKY]: {
    id: FINGER_IDS.RIGHT_PINKY,
    handId: HAND_IDS.RIGHT,
    hand: "Right",
    label: "Pinky",
    shortLabel: "RP",
    homeKey: ";",
    reachZone: "Outer right column",
    color: "#E89BB0",
    softColor: "rgba(232, 155, 176, 0.13)",
    glowColor: "rgba(232, 155, 176, 0.22)",
  },
}

export const fingerLegend = [
  fingerMap.leftPinky,
  fingerMap.leftRing,
  fingerMap.leftMiddle,
  fingerMap.leftIndex,
  fingerMap.leftThumb,
  fingerMap.rightThumb,
  fingerMap.rightIndex,
  fingerMap.rightMiddle,
  fingerMap.rightRing,
  fingerMap.rightPinky,
]

const {
  LEFT_PINKY,
  LEFT_RING,
  LEFT_MIDDLE,
  LEFT_INDEX,
  LEFT_THUMB,
  RIGHT_THUMB,
  RIGHT_INDEX,
  RIGHT_MIDDLE,
  RIGHT_RING,
  RIGHT_PINKY,
} = FINGER_IDS

const aliases = {
  " ": "SPACE",
  Spacebar: "SPACE",
  Space: "SPACE",
  Return: "ENTER",
  Esc: "ESCAPE",
  Del: "DELETE",
  Ctrl: "CONTROL",
}

export const shiftedCharacterMap = {
  "~": "`",
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
}

export const keyFingerMap = {
  "`": LEFT_PINKY,
  "1": LEFT_PINKY,
  "2": LEFT_RING,
  "3": LEFT_MIDDLE,
  "4": LEFT_INDEX,
  "5": LEFT_INDEX,
  "6": RIGHT_INDEX,
  "7": RIGHT_INDEX,
  "8": RIGHT_MIDDLE,
  "9": RIGHT_RING,
  "0": RIGHT_PINKY,
  "-": RIGHT_PINKY,
  "=": RIGHT_PINKY,
  BACKSPACE: RIGHT_PINKY,
  TAB: LEFT_PINKY,
  Q: LEFT_PINKY,
  W: LEFT_RING,
  E: LEFT_MIDDLE,
  R: LEFT_INDEX,
  T: LEFT_INDEX,
  Y: RIGHT_INDEX,
  U: RIGHT_INDEX,
  I: RIGHT_MIDDLE,
  O: RIGHT_RING,
  P: RIGHT_PINKY,
  "[": RIGHT_PINKY,
  "]": RIGHT_PINKY,
  "\\": RIGHT_PINKY,
  CAPSLOCK: LEFT_PINKY,
  A: LEFT_PINKY,
  S: LEFT_RING,
  D: LEFT_MIDDLE,
  F: LEFT_INDEX,
  G: LEFT_INDEX,
  H: RIGHT_INDEX,
  J: RIGHT_INDEX,
  K: RIGHT_MIDDLE,
  L: RIGHT_RING,
  ";": RIGHT_PINKY,
  "'": RIGHT_PINKY,
  ENTER: RIGHT_PINKY,
  SHIFT: [LEFT_PINKY, RIGHT_PINKY],
  SHIFTLEFT: LEFT_PINKY,
  SHIFTRIGHT: RIGHT_PINKY,
  Z: LEFT_PINKY,
  X: LEFT_RING,
  C: LEFT_MIDDLE,
  V: LEFT_INDEX,
  B: LEFT_INDEX,
  N: RIGHT_INDEX,
  M: RIGHT_INDEX,
  ",": RIGHT_MIDDLE,
  ".": RIGHT_RING,
  "/": RIGHT_PINKY,
  CONTROL: [LEFT_PINKY, RIGHT_PINKY],
  CONTROLLEFT: LEFT_PINKY,
  CONTROLRIGHT: RIGHT_PINKY,
  METALEFT: LEFT_THUMB,
  METARIGHT: RIGHT_THUMB,
  ALTLEFT: LEFT_THUMB,
  ALTRIGHT: RIGHT_THUMB,
  SPACE: [LEFT_THUMB, RIGHT_THUMB],
  CONTEXTMENU: RIGHT_PINKY,
}

export const fingerColumns = {
  [FINGER_IDS.LEFT_PINKY]: ["`", "1", "Q", "A", "Z", "Shift"],
  [FINGER_IDS.LEFT_RING]: ["2", "W", "S", "X"],
  [FINGER_IDS.LEFT_MIDDLE]: ["3", "E", "D", "C"],
  [FINGER_IDS.LEFT_INDEX]: ["4", "5", "R", "T", "F", "G", "V", "B"],
  [FINGER_IDS.LEFT_THUMB]: ["Space"],
  [FINGER_IDS.RIGHT_THUMB]: ["Space"],
  [FINGER_IDS.RIGHT_INDEX]: ["6", "7", "Y", "U", "H", "J", "N", "M"],
  [FINGER_IDS.RIGHT_MIDDLE]: ["8", "I", "K", ","],
  [FINGER_IDS.RIGHT_RING]: ["9", "O", "L", "."],
  [FINGER_IDS.RIGHT_PINKY]: ["0", "-", "=", "P", "[", "]", "\\", ";", "'", "/", "Shift"],
}

export const fingersByHand = {
  [HAND_IDS.LEFT]: [
    fingerMap.leftPinky,
    fingerMap.leftRing,
    fingerMap.leftMiddle,
    fingerMap.leftIndex,
    fingerMap.leftThumb,
  ],
  [HAND_IDS.RIGHT]: [
    fingerMap.rightThumb,
    fingerMap.rightIndex,
    fingerMap.rightMiddle,
    fingerMap.rightRing,
    fingerMap.rightPinky,
  ],
}

export function normalizeFingerKey(keyValue) {
  if (keyValue === null || keyValue === undefined || keyValue === "") {
    return ""
  }

  const value = String(keyValue)

  if (aliases[value]) {
    return aliases[value]
  }

  if (value.startsWith("Key") && value.length === 4) {
    return value.slice(3).toUpperCase()
  }

  if (value.startsWith("Digit") && value.length === 6) {
    return value.slice(5)
  }

  if (shiftedCharacterMap[value]) {
    return shiftedCharacterMap[value].toUpperCase()
  }

  return value.toUpperCase()
}

export function requiresShift(keyValue) {
  if (!keyValue) {
    return false
  }

  const value = String(keyValue)

  return (value.length === 1 && /[A-Z]/.test(value)) || Boolean(shiftedCharacterMap[value])
}

export function getFingerIdsForKey(keyValue) {
  const normalizedKey = normalizeFingerKey(keyValue)
  const mappedFinger = keyFingerMap[normalizedKey]

  if (!mappedFinger) {
    return []
  }

  return Array.isArray(mappedFinger) ? mappedFinger : [mappedFinger]
}

export function getPrimaryFingerForKey(keyValue) {
  const [fingerId] = getFingerIdsForKey(keyValue)

  return fingerId ? fingerMap[fingerId] : null
}

export function getShiftCoordinationForKey(keyValue) {
  if (!requiresShift(keyValue)) {
    return null
  }

  const typingFinger = getPrimaryFingerForKey(keyValue)

  if (!typingFinger || typingFinger.handId === HAND_IDS.LEFT) {
    return {
      key: "ShiftRight",
      fingerId: RIGHT_PINKY,
      finger: fingerMap[RIGHT_PINKY],
      partnerFinger: typingFinger,
    }
  }

  return {
    key: "ShiftLeft",
    fingerId: LEFT_PINKY,
    finger: fingerMap[LEFT_PINKY],
    partnerFinger: typingFinger,
  }
}

export function getGuidanceKeysForCharacter(character) {
  if (!character) {
    return []
  }

  const keys = [character]
  const shiftCoordination = getShiftCoordinationForKey(character)

  if (shiftCoordination) {
    keys.unshift(shiftCoordination.key)
  }

  return keys
}

export function getFingerGuidanceForKeys(keys = []) {
  const keyValues = Array.isArray(keys) ? keys : [keys]
  const mappings = keyValues.filter(Boolean).map((keyValue) => {
    const fingerIds = getFingerIdsForKey(keyValue)

    return {
      key: keyValue,
      normalizedKey: normalizeFingerKey(keyValue),
      fingerIds,
      fingers: fingerIds.map((fingerId) => fingerMap[fingerId]).filter(Boolean),
      shiftCoordination: getShiftCoordinationForKey(keyValue),
    }
  })
  const activeFingerIds = Array.from(
    new Set(mappings.flatMap((mapping) => mapping.fingerIds))
  )
  const activeFingers = activeFingerIds
    .map((fingerId) => fingerMap[fingerId])
    .filter(Boolean)
  const activeHandIds = Array.from(
    new Set(activeFingers.map((finger) => finger.handId))
  )

  return {
    activeFinger: activeFingers[0] || null,
    activeFingerIds,
    activeFingers,
    activeHand: activeHandIds.length === 1 ? activeHandIds[0] : "both",
    activeHandIds,
    mappings,
    shiftCoordination:
      mappings.find((mapping) => mapping.shiftCoordination)?.shiftCoordination ||
      null,
  }
}

export default fingerMap
