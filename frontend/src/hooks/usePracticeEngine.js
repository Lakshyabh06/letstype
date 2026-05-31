import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { getFingerIdsForKey } from "../data/fingerMap"
import {
  generatePracticePrompt,
  isTimedPracticeMode,
} from "../utils/practiceGenerator"
import { analyzePracticeSession } from "../utils/sessionAnalyzer"
import {
  calculateTypingSnapshot,
  getActiveWordIndex,
  getWordRanges,
} from "../utils/typingMetrics"

function usePracticeEngine({
  analytics,
  customText = "",
  duration = 60,
  initialSession = null,
  modeId = "focus",
  onComplete,
  practicePlan,
} = {}) {
  const canRestore =
    initialSession?.modeId === modeId &&
    initialSession?.duration === duration &&
    initialSession?.typedText
  const [promptSeed, setPromptSeed] = useState(() =>
    canRestore ? initialSession.promptSeed || 0 : 0
  )
  const [typedText, setTypedText] = useState(() =>
    canRestore ? initialSession.typedText || "" : ""
  )
  const [status, setStatus] = useState(() =>
    canRestore ? initialSession.status || "idle" : "idle"
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    canRestore ? initialSession.elapsedSeconds || 0 : 0
  )
  const [attemptHistory, setAttemptHistory] = useState(() =>
    canRestore && Array.isArray(initialSession.attemptHistory)
      ? initialSession.attemptHistory
      : []
  )
  const [keyEvents, setKeyEvents] = useState(() =>
    canRestore && Array.isArray(initialSession.keyEvents)
      ? initialSession.keyEvents
      : []
  )
  const startedAtRef = useRef(null)
  const completedRef = useRef(false)
  const hasRestoredRef = useRef(false)
  const prompt = useMemo(
    () =>
      generatePracticePrompt({
        analytics,
        customText,
        duration,
        modeId,
        practicePlan,
        seed: promptSeed,
      }),
    [analytics, customText, duration, modeId, practicePlan, promptSeed]
  )
  const wordRanges = useMemo(() => getWordRanges(prompt.text), [prompt.text])
  const metrics = useMemo(
    () =>
      calculateTypingSnapshot({
        elapsedSeconds,
        attemptHistory,
        keyEvents,
        targetText: prompt.text,
        typedText,
      }),
    [attemptHistory, elapsedSeconds, keyEvents, prompt.text, typedText]
  )
  const activeWordIndex = useMemo(
    () => getActiveWordIndex(wordRanges, typedText.length),
    [typedText.length, wordRanges]
  )
  const isTimedMode = isTimedPracticeMode(modeId)
  const timeLeft = Math.max(0, duration - elapsedSeconds)

  const completeSession = useCallback(
    (
      finalElapsedSeconds = elapsedSeconds,
      finalTypedText = typedText,
      finalAttemptHistory = attemptHistory,
      finalKeyEvents = keyEvents
    ) => {
      if (completedRef.current) {
        return null
      }

      completedRef.current = true
      setStatus("complete")

      const summary = analyzePracticeSession({
        analytics,
        attemptHistory: finalAttemptHistory,
        duration,
        elapsedSeconds: Math.max(1, finalElapsedSeconds),
        keyEvents: finalKeyEvents,
        mode: prompt.mode,
        targetText: prompt.text,
        typedText: finalTypedText,
      })

      onComplete?.(summary)

      return summary
    },
    [
      analytics,
      attemptHistory,
      duration,
      elapsedSeconds,
      keyEvents,
      onComplete,
      prompt.mode,
      prompt.text,
      typedText,
    ]
  )

  const resetPractice = useCallback(() => {
    completedRef.current = false
    startedAtRef.current = null
    setAttemptHistory([])
    setElapsedSeconds(0)
    setKeyEvents([])
    setPromptSeed((currentSeed) => currentSeed + 1)
    setStatus("idle")
    setTypedText("")
  }, [])

  useEffect(() => {
    if (!canRestore || hasRestoredRef.current) {
      return
    }

    hasRestoredRef.current = true

    if (initialSession.status === "active") {
      startedAtRef.current =
        Date.now() - (initialSession.elapsedSeconds || 0) * 1000
    }
  }, [canRestore, initialSession])

  useEffect(() => {
    if (status !== "active") {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const nextElapsedSeconds = Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      )

      setElapsedSeconds(nextElapsedSeconds)

      if (isTimedMode && nextElapsedSeconds >= duration) {
        completeSession(duration)
      }
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [completeSession, duration, isTimedMode, status])

  const handleTyping = useCallback((nextValue) => {
    if (status === "complete") {
      return
    }

    if (nextValue.length <= typedText.length) {
      return
    }

    const attemptedCharacters = nextValue
      .slice(typedText.length)
      .slice(0, prompt.text.length - typedText.length)
    const now = Date.now()

    if (status === "idle" && attemptedCharacters.length > 0) {
      startedAtRef.current = now
      setStatus("active")
    }

    let nextAttemptHistory = attemptHistory
    let nextKeyEvents = keyEvents
    let nextText = typedText

    if (attemptedCharacters.length > 0) {
      const newAttempts = []
      const newEvents = []

      for (const actualKey of attemptedCharacters) {
        const index = nextText.length
        const expectedKey = prompt.text[index]
        const isCorrect = actualKey === expectedKey

        newAttempts.push({
          actualKey,
          correct: isCorrect,
          expectedKey,
          expectedFingerIds: getFingerIdsForKey(expectedKey),
          index,
          timestamp: now,
        })
        newEvents.push({
          key: actualKey,
          timestamp: now,
        })

        if (isCorrect) {
          nextText += actualKey
        }
      }

      nextAttemptHistory = [...attemptHistory, ...newAttempts]
      nextKeyEvents = [...keyEvents, ...newEvents]

      setAttemptHistory(nextAttemptHistory)
      setKeyEvents(nextKeyEvents)
    }

    if (nextText !== typedText) {
      setTypedText(nextText)
    }

    if (nextText.length >= prompt.text.length) {
      const finalElapsedSeconds =
        status === "idle"
          ? 1
          : Math.max(1, Math.floor((now - startedAtRef.current) / 1000))

      completeSession(
        finalElapsedSeconds,
        nextText,
        nextAttemptHistory,
        nextKeyEvents
      )
    }
  }, [
    attemptHistory,
    completeSession,
    keyEvents,
    prompt.text,
    status,
    typedText,
  ])

  return {
    activeWordIndex,
    attemptHistory,
    elapsedSeconds,
    handleTyping,
    keyEvents,
    metrics,
    prompt,
    promptSeed,
    resetPractice,
    status,
    timeLeft,
    typedText,
    wordRanges,
  }
}

export default usePracticeEngine
