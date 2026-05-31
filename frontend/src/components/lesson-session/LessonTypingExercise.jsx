import { useEffect, useMemo, useRef, useState } from "react"

import { getGuidanceKeysForCharacter } from "../../data/fingerMap"
import Keyboard from "../keyboard/Keyboard"
import FingerGuide from "../finger-guide/FingerGuide"
import { calculateAccuracy, calculateWPM } from "../../utils/calculateStats"
import useTyping from "../../hooks/useTyping"
import useSoundEngine from "../../hooks/useSoundEngine"

const ignoredKeys = new Set([
  "Alt",
  "CapsLock",
  "Control",
  "Escape",
  "Meta",
  "Shift",
  "Tab",
])

function LessonTypingExercise({
  activeKeys = [],
  onComplete,
  prompt,
  text,
  tone = "guided",
}) {
  const { play } = useSoundEngine()
  const {
    currentIndex,
    handleTyping,
    isCompleted,
    resetTyping,
    typedText,
  } = useTyping(text)
  const [startedAt, setStartedAt] = useState(null)
  const [lastInputAt, setLastInputAt] = useState(null)
  const [completedAt, setCompletedAt] = useState(null)
  const [pressedKey, setPressedKey] = useState("")
  const [wrongKey, setWrongKey] = useState("")
  const completeRef = useRef(false)
  const clearKeyStateRef = useRef(null)

  const expectedKey = text[currentIndex] || ""
  const timeSpent = startedAt
    ? Math.max(((completedAt || lastInputAt || startedAt) - startedAt) / 1000, 1)
    : 0
  const accuracy = calculateAccuracy(text, typedText)
  const wpm = calculateWPM(typedText, timeSpent)
  const keyboardActiveKeys = useMemo(
    () => [...activeKeys, ...getGuidanceKeysForCharacter(expectedKey)].filter(Boolean),
    [activeKeys, expectedKey]
  )

  useEffect(() => {
    if (!isCompleted || completeRef.current) {
      return
    }

    const finishedAt = Date.now()
    const elapsedSeconds = startedAt
      ? Math.max((finishedAt - startedAt) / 1000, 1)
      : 1

    completeRef.current = true
    setCompletedAt(finishedAt)
    play("lessonComplete", { throttleMs: 500 })
    onComplete?.({
      accuracy,
      seconds: Math.round(elapsedSeconds),
      wpm: calculateWPM(typedText, elapsedSeconds),
    })
  }, [accuracy, isCompleted, onComplete, play, startedAt, typedText])

  useEffect(
    () => () => {
      if (clearKeyStateRef.current) {
        window.clearTimeout(clearKeyStateRef.current)
      }
    },
    []
  )

  function clearKeyStateSoon() {
    if (clearKeyStateRef.current) {
      window.clearTimeout(clearKeyStateRef.current)
    }

    clearKeyStateRef.current = window.setTimeout(() => {
      setPressedKey("")
      setWrongKey("")
    }, 220)
  }

  function handleKeyDown(event) {
    if (ignoredKeys.has(event.key)) {
      return
    }

    setPressedKey(event.key)

    if (
      event.key !== "Backspace" &&
      event.key.length === 1 &&
      expectedKey &&
      event.key !== expectedKey
    ) {
      setWrongKey(event.key)
      play("wrong")
    } else {
      setWrongKey("")

      if (event.key.length === 1 && expectedKey) {
        play("correct")
      }
    }

    clearKeyStateSoon()
  }

  function handleChange(event) {
    if (!startedAt && event.target.value.length > 0) {
      const now = Date.now()

      setStartedAt(now)
      setLastInputAt(now)
    } else if (event.target.value.length > 0) {
      setLastInputAt(Date.now())
    }

    handleTyping(event.target.value)
  }

  function handleRestart() {
    resetTyping()
    setStartedAt(null)
    setLastInputAt(null)
    setCompletedAt(null)
    setPressedKey("")
    setWrongKey("")
    completeRef.current = false
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-[28px] bg-white/[0.035] p-5 sm:p-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted">{prompt}</p>

          <div className="flex items-center gap-5 text-sm text-muted">
            <span>
              <span className="font-semibold text-primary">{accuracy}%</span>{" "}
              accuracy
            </span>
            <span>
              <span className="font-semibold text-primary">{wpm}</span> wpm
            </span>
          </div>
        </div>

        <div className="min-h-32 rounded-2xl bg-background/45 p-5 text-2xl leading-relaxed text-muted sm:p-6 sm:text-3xl">
          {text.split("").map((char, index) => {
            const isTyped = index < typedText.length
            const isCurrent = index === currentIndex
            const colorClass = !isTyped
              ? "text-muted"
              : typedText[index] === char
                ? "text-primary"
                : "text-error"

            return (
              <span
                key={`${char}-${index}`}
                className={`${colorClass} ${
                  isCurrent ? "border-l-2 border-accent" : ""
                }`}
              >
                {char}
              </span>
            )
          })}
        </div>

        <input
          autoComplete="off"
          autoFocus
          disabled={isCompleted}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            tone === "assessment" ? "Type the assessment line" : "Start typing"
          }
          spellCheck="false"
          type="text"
          value={typedText}
          className={`mt-4 h-14 w-full rounded-2xl border bg-background/55 px-5 text-lg text-primary outline-none transition duration-200 placeholder:text-muted focus:border-accent/70 focus:bg-background/75 disabled:text-muted ${
            wrongKey
              ? "border-error/60 shadow-[0_0_0_1px_rgba(224,131,104,0.2)]"
              : "border-white/10"
          }`}
        />

        {isCompleted && (
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Complete - {accuracy}% accuracy - {Math.round(timeSpent)} seconds
            </p>

            <button
              type="button"
              onClick={handleRestart}
              className="h-10 rounded-full border border-white/10 px-4 font-semibold text-primary transition duration-200 hover:border-white/25"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <FingerGuide
          activeKeys={getGuidanceKeysForCharacter(expectedKey)}
          compactMode
          expectedKey={expectedKey}
          pressedKey={pressedKey}
          wrongKey={wrongKey}
        />
      </div>

      <div className="mt-5">
        <Keyboard
          activeKeys={keyboardActiveKeys}
          pressedKey={pressedKey}
          wrongKey={wrongKey}
          compactMode
        />
      </div>
    </div>
  )
}

export default LessonTypingExercise
