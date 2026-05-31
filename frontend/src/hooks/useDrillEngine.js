import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  getFingerIdsForKey,
  getFingerGuidanceForKeys,
  getGuidanceKeysForCharacter,
} from "../data/fingerMap"
import useSoundEngine from "./useSoundEngine"
import { summarizeDrillResult } from "../utils/typingAnalysis"

const ignoredKeys = new Set([
  "Alt",
  "CapsLock",
  "Control",
  "Escape",
  "Meta",
  "Shift",
  "Tab",
])

const modeSettings = {
  strict: {
    allowBackspace: false,
    enforceCorrectKey: true,
    showMistakesInOutput: false,
  },
  practice: {
    allowBackspace: false,
    enforceCorrectKey: true,
    showMistakesInOutput: false,
  },
  assessment: {
    allowBackspace: false,
    enforceCorrectKey: true,
    showMistakesInOutput: false,
  },
  freeTyping: {
    allowBackspace: true,
    enforceCorrectKey: false,
    showMistakesInOutput: true,
  },
}

function normalizeTypedKey(key) {
  if (key === "Spacebar") {
    return " "
  }

  return key
}

function isPrintableKey(key) {
  return key.length === 1
}

function getWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function getAccuracy(correctAttempts, totalAttempts) {
  if (totalAttempts === 0) {
    return 100
  }

  return Math.floor((correctAttempts / totalAttempts) * 100)
}

function getWpm(typedText, elapsedSeconds) {
  if (elapsedSeconds <= 0 || typedText.trim().length === 0) {
    return 0
  }

  return Math.floor((getWordCount(typedText) / elapsedSeconds) * 60)
}

function getVisibleCharacter(character) {
  if (character === " ") {
    return "Space"
  }

  return character || ""
}

function createAttemptRecord({
  actualKey,
  correct,
  expectedKey,
  index,
  mode,
  timestamp,
}) {
  return {
    actualFingerIds: getFingerIdsForKey(actualKey),
    actualKey,
    correct,
    expectedFingerIds: getFingerIdsForKey(expectedKey),
    expectedKey,
    index,
    mode,
    timestamp,
  }
}

function useDrillEngine({ mode = "strict", text = "" } = {}) {
  const { play } = useSoundEngine()
  const settings = modeSettings[mode] || modeSettings.strict
  const [typedText, setTypedText] = useState("")
  const [startedAt, setStartedAt] = useState(null)
  const [lastActivityAt, setLastActivityAt] = useState(null)
  const [completedAt, setCompletedAt] = useState(null)
  const [correctAttempts, setCorrectAttempts] = useState(0)
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [attemptHistory, setAttemptHistory] = useState([])
  const [pressedKeys, setPressedKeys] = useState([])
  const [wrongKeys, setWrongKeys] = useState([])
  const [feedback, setFeedback] = useState(null)
  const clearFeedbackRef = useRef(null)

  const currentIndex = typedText.length
  const expectedKey = text[currentIndex] || ""
  const isCompleted = text.length > 0 && currentIndex >= text.length
  const totalAttempts = correctAttempts + incorrectAttempts
  const elapsedSeconds = startedAt
    ? Math.max(((completedAt || lastActivityAt || startedAt) - startedAt) / 1000, 1)
    : 0
  const accuracy = getAccuracy(correctAttempts, totalAttempts)
  const wpm = getWpm(typedText, elapsedSeconds)
  const progress = text.length === 0 ? 0 : Math.floor((currentIndex / text.length) * 100)
  const activeTargetKeys = useMemo(
    () => getGuidanceKeysForCharacter(expectedKey),
    [expectedKey]
  )
  const activeGuidance = useMemo(
    () => getFingerGuidanceForKeys(activeTargetKeys),
    [activeTargetKeys]
  )

  const result = useMemo(
    () =>
      summarizeDrillResult({
        accuracy,
        attemptHistory,
        correctAttempts,
        incorrectAttempts,
        mode,
        seconds: Math.round(elapsedSeconds || 0),
        textLength: text.length,
        totalAttempts,
        wpm,
      }),
    [
      accuracy,
      attemptHistory,
      correctAttempts,
      elapsedSeconds,
      incorrectAttempts,
      mode,
      text.length,
      totalAttempts,
      wpm,
    ]
  )

  const clearFeedbackSoon = useCallback(() => {
    if (clearFeedbackRef.current) {
      window.clearTimeout(clearFeedbackRef.current)
    }

    clearFeedbackRef.current = window.setTimeout(() => {
      setPressedKeys([])
      setWrongKeys([])
      setFeedback(null)
    }, 240)
  }, [])

  const resetDrill = useCallback(() => {
    if (clearFeedbackRef.current) {
      window.clearTimeout(clearFeedbackRef.current)
    }

    setTypedText("")
    setStartedAt(null)
    setLastActivityAt(null)
    setCompletedAt(null)
    setCorrectAttempts(0)
    setIncorrectAttempts(0)
    setAttemptHistory([])
    setPressedKeys([])
    setWrongKeys([])
    setFeedback(null)
  }, [])

  const recordAttempt = useCallback(
    ({ actualKey, correct, expectedKey: targetKey, index, timestamp }) => {
      setAttemptHistory((currentHistory) => [
        ...currentHistory,
        createAttemptRecord({
          actualKey,
          correct,
          expectedKey: targetKey,
          index,
          mode,
          timestamp,
        }),
      ])
    },
    [mode]
  )

  const handleIncorrectKey = useCallback(
    (key, message, eventTime = Date.now()) => {
      const keys = getGuidanceKeysForCharacter(key)

      play("wrong")
      setIncorrectAttempts((currentAttempts) => currentAttempts + 1)
      recordAttempt({
        actualKey: key,
        correct: false,
        expectedKey,
        index: currentIndex,
        timestamp: eventTime,
      })
      setPressedKeys(keys)
      setWrongKeys(keys)
      setFeedback({
        tone: "error",
        message:
          message ||
          `Stay on ${getVisibleCharacter(expectedKey)}. Progress waits for the correct key.`,
      })
      clearFeedbackSoon()
    },
    [clearFeedbackSoon, currentIndex, expectedKey, play, recordAttempt]
  )

  const handleKeyDown = useCallback(
    (event) => {
      const key = normalizeTypedKey(event.key)
      const isBackspace = key === "Backspace"
      const canHandleKey = isPrintableKey(key) || isBackspace

      if (ignoredKeys.has(key) || !canHandleKey || isCompleted) {
        return
      }

      event.preventDefault()

      const eventTime = Date.now()

      if (!startedAt) {
        setStartedAt(eventTime)
      }

      setLastActivityAt(eventTime)

      if (isBackspace) {
        if (!settings.allowBackspace) {
          handleIncorrectKey(
            "Backspace",
            "Backspace is disabled in guided mode.",
            eventTime
          )
          return
        }

        setTypedText((currentText) => currentText.slice(0, -1))
        setPressedKeys(["Backspace"])
        setWrongKeys([])
        setFeedback(null)
        clearFeedbackSoon()
        return
      }

      const isCorrectKey = mode === "freeTyping" || key === expectedKey

      if (!isCorrectKey) {
        if (settings.enforceCorrectKey) {
          handleIncorrectKey(key, undefined, eventTime)
          return
        }

        play("wrong")
        setIncorrectAttempts((currentAttempts) => currentAttempts + 1)
        recordAttempt({
          actualKey: key,
          correct: false,
          expectedKey,
          index: currentIndex,
          timestamp: eventTime,
        })
        setWrongKeys(getGuidanceKeysForCharacter(key))
      } else {
        play("correct")
        setCorrectAttempts((currentAttempts) => currentAttempts + 1)
        recordAttempt({
          actualKey: key,
          correct: true,
          expectedKey,
          index: currentIndex,
          timestamp: eventTime,
        })
        setWrongKeys([])
      }

      setPressedKeys(getGuidanceKeysForCharacter(key))
      const nextLength = currentIndex + 1

      setTypedText((currentText) => {
        const nextText =
          isCorrectKey || settings.showMistakesInOutput
            ? `${currentText}${key}`
            : currentText

        return nextText.slice(0, text.length || nextText.length)
      })

      if (
        (isCorrectKey || settings.showMistakesInOutput) &&
        text.length > 0 &&
        nextLength >= text.length
      ) {
        setCompletedAt(eventTime)
      }

      setFeedback(
        isCorrectKey
          ? null
          : {
              tone: "error",
              message: `Expected ${getVisibleCharacter(expectedKey)}.`,
            }
      )
      clearFeedbackSoon()
    },
    [
      clearFeedbackSoon,
      expectedKey,
      handleIncorrectKey,
      currentIndex,
      isCompleted,
      mode,
      play,
      recordAttempt,
      settings.allowBackspace,
      settings.enforceCorrectKey,
      settings.showMistakesInOutput,
      startedAt,
      text.length,
    ]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(
    () => () => {
      if (clearFeedbackRef.current) {
        window.clearTimeout(clearFeedbackRef.current)
      }
    },
    []
  )

  return {
    accuracy,
    activeFinger: activeGuidance.activeFinger,
    activeGuidance,
    activeHand: activeGuidance.activeHand,
    activeTargetKeys,
    attemptHistory,
    correctAttempts,
    currentIndex,
    expectedKey,
    feedback,
    incorrectAttempts,
    isCompleted,
    isStrict: settings.enforceCorrectKey,
    mode,
    pressedKeys,
    progress,
    resetDrill,
    result,
    seconds: Math.round(elapsedSeconds || 0),
    text,
    totalAttempts,
    typedText,
    wpm,
    wrongKeys,
  }
}

export default useDrillEngine
