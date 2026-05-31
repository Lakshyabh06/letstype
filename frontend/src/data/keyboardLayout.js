import { FINGER_IDS } from "./fingerMap"

export const HOME_KEYS = ["A", "S", "D", "F", "J", "K", "L", ";"]
export const ANCHOR_KEYS = ["F", "J"]

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

function key(id, label, finger, options = {}) {
  return {
    id,
    label,
    value: options.value ?? label,
    shiftLabel: options.shiftLabel,
    finger,
    size: options.size ?? 1,
    home: HOME_KEYS.includes(label),
    anchor: ANCHOR_KEYS.includes(label),
    tokens: options.tokens ?? [],
  }
}

export const fullKeyboardLayout = [
  {
    id: "number-row",
    label: "Number row",
    keys: [
      key("Backquote", "`", LEFT_PINKY, { shiftLabel: "~" }),
      key("Digit1", "1", LEFT_PINKY, { shiftLabel: "!" }),
      key("Digit2", "2", LEFT_RING, { shiftLabel: "@" }),
      key("Digit3", "3", LEFT_MIDDLE, { shiftLabel: "#" }),
      key("Digit4", "4", LEFT_INDEX, { shiftLabel: "$" }),
      key("Digit5", "5", LEFT_INDEX, { shiftLabel: "%" }),
      key("Digit6", "6", RIGHT_INDEX, { shiftLabel: "^" }),
      key("Digit7", "7", RIGHT_INDEX, { shiftLabel: "&" }),
      key("Digit8", "8", RIGHT_MIDDLE, { shiftLabel: "*" }),
      key("Digit9", "9", RIGHT_RING, { shiftLabel: "(" }),
      key("Digit0", "0", RIGHT_PINKY, { shiftLabel: ")" }),
      key("Minus", "-", RIGHT_PINKY, { shiftLabel: "_" }),
      key("Equal", "=", RIGHT_PINKY, { shiftLabel: "+" }),
      key("Backspace", "Backspace", RIGHT_PINKY, {
        size: 1.8,
        tokens: ["Delete"],
      }),
    ],
  },
  {
    id: "top-row",
    label: "Top row",
    keys: [
      key("Tab", "Tab", LEFT_PINKY, { size: 1.45 }),
      key("KeyQ", "Q", LEFT_PINKY, { value: "q" }),
      key("KeyW", "W", LEFT_RING, { value: "w" }),
      key("KeyE", "E", LEFT_MIDDLE, { value: "e" }),
      key("KeyR", "R", LEFT_INDEX, { value: "r" }),
      key("KeyT", "T", LEFT_INDEX, { value: "t" }),
      key("KeyY", "Y", RIGHT_INDEX, { value: "y" }),
      key("KeyU", "U", RIGHT_INDEX, { value: "u" }),
      key("KeyI", "I", RIGHT_MIDDLE, { value: "i" }),
      key("KeyO", "O", RIGHT_RING, { value: "o" }),
      key("KeyP", "P", RIGHT_PINKY, { value: "p" }),
      key("BracketLeft", "[", RIGHT_PINKY, { shiftLabel: "{" }),
      key("BracketRight", "]", RIGHT_PINKY, { shiftLabel: "}" }),
      key("Backslash", "\\", RIGHT_PINKY, { shiftLabel: "|", size: 1.35 }),
    ],
  },
  {
    id: "home-row",
    label: "Home row",
    keys: [
      key("CapsLock", "Caps", LEFT_PINKY, {
        size: 1.75,
        tokens: ["CapsLock"],
      }),
      key("KeyA", "A", LEFT_PINKY, { value: "a" }),
      key("KeyS", "S", LEFT_RING, { value: "s" }),
      key("KeyD", "D", LEFT_MIDDLE, { value: "d" }),
      key("KeyF", "F", LEFT_INDEX, { value: "f" }),
      key("KeyG", "G", LEFT_INDEX, { value: "g" }),
      key("KeyH", "H", RIGHT_INDEX, { value: "h" }),
      key("KeyJ", "J", RIGHT_INDEX, { value: "j" }),
      key("KeyK", "K", RIGHT_MIDDLE, { value: "k" }),
      key("KeyL", "L", RIGHT_RING, { value: "l" }),
      key("Semicolon", ";", RIGHT_PINKY, { shiftLabel: ":" }),
      key("Quote", "'", RIGHT_PINKY, { shiftLabel: '"' }),
      key("Enter", "Enter", RIGHT_PINKY, { size: 2 }),
    ],
  },
  {
    id: "bottom-row",
    label: "Bottom row",
    keys: [
      key("ShiftLeft", "Shift", LEFT_PINKY, {
        size: 2.25,
        tokens: ["Shift"],
      }),
      key("KeyZ", "Z", LEFT_PINKY, { value: "z" }),
      key("KeyX", "X", LEFT_RING, { value: "x" }),
      key("KeyC", "C", LEFT_MIDDLE, { value: "c" }),
      key("KeyV", "V", LEFT_INDEX, { value: "v" }),
      key("KeyB", "B", LEFT_INDEX, { value: "b" }),
      key("KeyN", "N", RIGHT_INDEX, { value: "n" }),
      key("KeyM", "M", RIGHT_INDEX, { value: "m" }),
      key("Comma", ",", RIGHT_MIDDLE, { shiftLabel: "<" }),
      key("Period", ".", RIGHT_RING, { shiftLabel: ">" }),
      key("Slash", "/", RIGHT_PINKY, { shiftLabel: "?" }),
      key("ShiftRight", "Shift", RIGHT_PINKY, {
        size: 2.5,
        tokens: ["Shift"],
      }),
    ],
  },
  {
    id: "thumb-row",
    label: "Thumb row",
    keys: [
      key("ControlLeft", "Ctrl", LEFT_PINKY, {
        size: 1.25,
        tokens: ["Control", "Ctrl"],
      }),
      key("MetaLeft", "Meta", LEFT_THUMB, {
        size: 1.25,
        tokens: ["Meta", "OS"],
      }),
      key("AltLeft", "Alt", LEFT_THUMB, { size: 1.25, tokens: ["Alt"] }),
      key("Space", "Space", LEFT_THUMB, {
        value: " ",
        size: 6.25,
        tokens: ["Spacebar"],
      }),
      key("AltRight", "Alt", RIGHT_THUMB, { size: 1.25, tokens: ["Alt"] }),
      key("MetaRight", "Meta", RIGHT_THUMB, {
        size: 1.25,
        tokens: ["Meta", "OS"],
      }),
      key("ContextMenu", "Menu", RIGHT_PINKY, { size: 1.25 }),
      key("ControlRight", "Ctrl", RIGHT_PINKY, {
        size: 1.25,
        tokens: ["Control", "Ctrl"],
      }),
    ],
  },
]

export const learningKeyboardLayout = [
  {
    id: "learning-top-row",
    label: "Top row",
    keys: fullKeyboardLayout[1].keys.slice(1, 11),
  },
  {
    id: "learning-home-row",
    label: "Home row",
    keys: fullKeyboardLayout[2].keys.slice(1, 11),
  },
  {
    id: "learning-bottom-row",
    label: "Bottom row",
    keys: fullKeyboardLayout[3].keys.slice(1, 11),
  },
]

const aliasMap = {
  " ": "SPACE",
  Spacebar: "SPACE",
  Esc: "ESCAPE",
  Del: "DELETE",
  Return: "ENTER",
  Control: "CTRL",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  ArrowUp: "UP",
  ArrowDown: "DOWN",
}

export function normalizeKeyboardKey(keyValue) {
  if (keyValue === null || keyValue === undefined || keyValue === "") {
    return ""
  }

  const value = String(keyValue)

  if (aliasMap[value]) {
    return aliasMap[value]
  }

  if (value.startsWith("Key") && value.length === 4) {
    return value.slice(3).toUpperCase()
  }

  if (value.startsWith("Digit") && value.length === 6) {
    return value.slice(5)
  }

  return value.toUpperCase()
}

export function getKeyTokens(keyData) {
  return [
    keyData.id,
    keyData.label,
    keyData.value,
    keyData.shiftLabel,
    ...keyData.tokens,
  ]
    .filter(Boolean)
    .map(normalizeKeyboardKey)
}

export default fullKeyboardLayout
