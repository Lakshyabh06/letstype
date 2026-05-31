import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import usePracticeEngine from "../../hooks/usePracticeEngine"
import useFocusMode from "../../hooks/useFocusMode"
import useSettingsManager from "../../hooks/useSettingsManager"
import useSoundEngine from "../../hooks/useSoundEngine"
import AnalyticsDashboard from "../analytics/AnalyticsDashboard"
import AnimatedPanel from "../motion/AnimatedPanel"
import FocusModeOverlay from "../motion/FocusModeOverlay"
import useTypingSession from "../../hooks/useTypingSession"
import { buildPracticeAnalytics } from "../../utils/practiceAnalytics"
import { generateAdaptivePractice } from "../../utils/adaptivePracticeGenerator"
import {
  clearPracticeDraft,
  readPracticeDraft,
  writePracticeDraft,
} from "../../utils/workspacePersistence"
import { createDebouncedIdleTask } from "../../utils/performanceOptimizer"
import PracticeHistoryPanel from "./PracticeHistoryPanel"
import PracticeModeSelector from "./PracticeModeSelector"
import QuickPracticeCard from "./QuickPracticeCard"
import SessionResultsModal from "./SessionResultsModal"
import TypingCaret from "./TypingCaret"
import {
  getPracticeCategories,
  getPracticeMode,
  getPracticeModes,
  isTimedPracticeMode,
} from "../../utils/practiceGenerator"

function MetricPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-white/[0.045]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-primary">{value}</p>
    </div>
  )
}

function CoachingPanel({ analytics, practicePlan }) {
  const topRecommendation = analytics?.recommendations?.[0]
  const weakCluster = analytics?.mastery?.weakKeyClusters?.[0]
  const weakFinger = analytics?.mastery?.weakFingerZones?.[0]
  const focusKeys =
    practicePlan?.focusKeys ||
    weakCluster?.keys?.slice(0, 6).map((keyStats) => keyStats.key) ||
    []

  return (
    <section className="rounded-[24px] border border-accent-secondary/20 bg-accent-secondary/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
        Live coaching
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary">
        {practicePlan?.title || topRecommendation?.action || "Build the baseline"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        {practicePlan?.description ||
          topRecommendation?.detail ||
          "Complete a few runs and the coach will turn your mistakes into targeted practice."}
      </p>

      {focusKeys.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {focusKeys.slice(0, 8).map((key) => (
            <span
              key={key}
              className="flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-background/45 px-2 text-xs font-semibold text-primary"
            >
              {key}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-2xl border border-white/10 bg-background/35 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Watch next
          </p>
          <p className="mt-2 text-sm leading-6 text-primary">
            {weakCluster?.title || "Accuracy stability"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-background/35 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Finger load
          </p>
          <p className="mt-2 text-sm leading-6 text-primary">
            {weakFinger?.label || "Balanced so far"}
          </p>
        </div>
      </div>
    </section>
  )
}

function getCharacterClass({ expected, typed }) {
  if (typed === undefined) {
    return "text-muted"
  }

  if (typed === expected) {
    return "text-primary"
  }

  return "rounded bg-error/15 text-error"
}

const practiceScrollAnchor = {
  ratio: 0.46,
  minBand: 72,
}

const PracticeText = memo(function PracticeText({
  activeWordIndex,
  text,
  typedText,
  wordRanges,
}) {
  const currentIndex = typedText.length
  const activeWordRef = useRef(null)

  useLayoutEffect(() => {
    const activeWord = activeWordRef.current
    const scrollPanel = activeWord?.closest("[data-practice-text-panel]")

    if (!activeWord || !scrollPanel) {
      return
    }

    const panelRect = scrollPanel.getBoundingClientRect()
    const wordRect = activeWord.getBoundingClientRect()
    const anchorY = panelRect.top + panelRect.height * practiceScrollAnchor.ratio
    const comfortBand = Math.max(
      practiceScrollAnchor.minBand,
      Math.min(panelRect.height * 0.22, wordRect.height * 2.25)
    )
    const wordCenter = wordRect.top + wordRect.height / 2

    if (
      wordCenter >= anchorY - comfortBand &&
      wordCenter <= anchorY + comfortBand
    ) {
      return
    }

    const maxScrollTop = Math.max(
      0,
      scrollPanel.scrollHeight - scrollPanel.clientHeight
    )
    const scrollDelta = wordCenter - anchorY
    const nextTop = Math.max(
      0,
      Math.min(maxScrollTop, scrollPanel.scrollTop + scrollDelta)
    )

    if (Math.abs(scrollPanel.scrollTop - nextTop) < 1) {
      return
    }

    const windowX = window.scrollX
    const windowY = window.scrollY

    scrollPanel.scrollTop = nextTop

    if (window.scrollX !== windowX || window.scrollY !== windowY) {
      window.scrollTo(windowX, windowY)
    }
  }, [activeWordIndex])

  return (
    <div className="text-[1.65rem] leading-[2.45rem] text-muted sm:text-4xl sm:leading-[3.3rem]">
      {wordRanges.map((range) => {
        const isActive = range.index === activeWordIndex
        const isComplete = currentIndex >= range.end

        return (
          <span
            key={`${range.value}-${range.start}`}
            ref={isActive ? activeWordRef : null}
            className={`mr-3 inline-block rounded-xl px-1.5 transition duration-200 ${
              isActive
                ? "bg-white/[0.055] text-primary"
                : isComplete
                  ? "text-primary/75"
                  : "text-muted"
            }`}
          >
            {range.value.split("").map((character, offset) => {
              const index = range.start + offset
              const typed = typedText[index]

              return (
                <span
                  key={`${range.start}-${offset}`}
                  className={getCharacterClass({
                    expected: character,
                    typed,
                  })}
                >
                  {index === currentIndex && <TypingCaret />}
                  {character}
                </span>
              )
            })}
            {currentIndex === range.end && <TypingCaret />}
          </span>
        )
      })}
      {currentIndex >= text.length && <TypingCaret />}
    </div>
  )
})

function PracticeWorkspace({
  analytics,
  gamification,
  practicePlan,
  progress,
  streaks,
}) {
  const { settings, updatePractice } = useSettingsManager()
  const [initialDraft] = useState(readPracticeDraft)
  const modeOptions = useMemo(() => getPracticeModes(), [])
  const categoryOptions = useMemo(() => getPracticeCategories(), [])
  const practiceOptions = useMemo(
    () => [...modeOptions, ...categoryOptions],
    [categoryOptions, modeOptions]
  )
  const defaultModeId = "focus"
  const initialModeId = initialDraft?.modeId || settings.practice.modeId
  const [modeId, setModeId] = useState(
    practiceOptions.some((mode) => mode.id === initialModeId)
      ? initialModeId
      : defaultModeId
  )
  const [duration, setDuration] = useState(
    initialDraft?.duration || settings.practice.duration
  )
  const [customText, setCustomText] = useState(
    initialDraft?.customText || settings.practice.customText || ""
  )
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)
  const draftWriter = useMemo(
    () => createDebouncedIdleTask((draft) => writePracticeDraft(draft), 220),
    []
  )
  const { isFocusMode, toggleFocusMode } = useFocusMode({ persist: true })
  const { play } = useSoundEngine()
  const {
    bestScores,
    improvementPattern,
    practiceProgress,
    recentSessions,
    recordSession,
    streak,
    totalXP,
  } = useTypingSession()
  const enhancedAnalytics = useMemo(
    () =>
      progress
        ? buildPracticeAnalytics(progress, practiceProgress)
        : analytics,
    [analytics, practiceProgress, progress]
  )
  const activePracticePlan = useMemo(
    () => generateAdaptivePractice(enhancedAnalytics),
    [enhancedAnalytics]
  )
  const engine = usePracticeEngine({
    analytics: enhancedAnalytics,
    customText,
    duration,
    initialSession: settings.practice.restoreSession
      ? initialDraft
      : null,
    modeId,
    onComplete: (summary) => {
      const recordedResult = recordSession(summary)

      setResult(recordedResult)
      clearPracticeDraft()
      play("complete", { throttleMs: 600 })
    },
    practicePlan: activePracticePlan || practicePlan,
  })

  useEffect(() => {
    updatePractice({ customText, duration, modeId })
  }, [customText, duration, modeId, updatePractice])

  useEffect(() => {
    if (!settings.practice.restoreSession || engine.status === "complete") {
      draftWriter.cancel()
      return
    }

    draftWriter.schedule({
      attemptHistory: engine.attemptHistory,
      duration,
      elapsedSeconds: engine.elapsedSeconds,
      keyEvents: engine.keyEvents,
      modeId,
      customText,
      promptSeed: engine.promptSeed,
      status: engine.status,
      typedText: engine.typedText,
    })
  }, [
    draftWriter,
    customText,
    duration,
    engine.attemptHistory,
    engine.elapsedSeconds,
    engine.keyEvents,
    engine.promptSeed,
    engine.status,
    engine.typedText,
    modeId,
    settings.practice.restoreSession,
  ])

  useEffect(() => () => draftWriter.cancel(), [draftWriter])

  function handleShortcut(action) {
    const nextMode = getPracticeMode(action.modeId)

    setModeId(action.modeId)

    if (action.duration || nextMode.defaultDuration) {
      setDuration(action.duration || nextMode.defaultDuration)
    }

    window.requestAnimationFrame(() => {
      clearPracticeDraft()
      engine.resetPractice()
      inputRef.current?.focus({ preventScroll: true })
    })
  }

  function handleModeChange(nextModeId) {
    const nextMode = getPracticeMode(nextModeId)

    setModeId(nextModeId)

    if (nextMode.defaultDuration) {
      setDuration(nextMode.defaultDuration)
    }

    clearPracticeDraft()
    engine.resetPractice()
    window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
  }

  function handleCustomTextChange(nextCustomText) {
    setCustomText(nextCustomText)
    clearPracticeDraft()
    engine.resetPractice()
    window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
  }

  function handleDurationChange(nextDuration) {
    setDuration(nextDuration)
    clearPracticeDraft()
    engine.resetPractice()
    window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
  }

  function handleRestart() {
    setResult(null)
    clearPracticeDraft()
    engine.resetPractice()
    window.requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true })
    )
  }

  function handlePracticeChange(event) {
    const nextText = event.target.value

    if (nextText.length <= engine.typedText.length) {
      return
    }

    if (nextText.length > engine.typedText.length) {
      const addedCharacters = nextText.slice(engine.typedText.length)
      let acceptedIndex = engine.typedText.length

      addedCharacters.split("").forEach((character) => {
        const expectedCharacter = engine.prompt.text[acceptedIndex]
        const isCorrect = character === expectedCharacter

        play(isCorrect ? "correct" : "wrong")

        if (isCorrect) {
          acceptedIndex += 1
        }
      })

      if (acceptedIndex > 0 && acceptedIndex % 24 === 0) {
        play("combo", { throttleMs: 400 })
      }
    }

    engine.handleTyping(nextText)
  }

  const combinedXP = (gamification?.totalXP || 0) + totalXP
  const practiceStreak = streak.current || streaks?.practiceStreak?.current || 0
  const activeModeIsTimed = isTimedPracticeMode(modeId)
  const heading = engine.prompt.title
  const subtitle =
    "A focused typing workspace connected to your lessons, analytics, recommendations, XP, and daily consistency."

  return (
    <div className={`min-w-0 px-3 pb-8 sm:px-5 lg:px-6 ${isFocusMode ? "focus-mode-active" : ""}`}>
      <div className="mx-auto grid min-w-0 max-w-[var(--workspace-max,1800px)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(330px,360px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,390px)]">
        <main className="min-w-0 space-y-4">
          <AnimatedPanel className="focus-mode-primary min-w-0 rounded-[28px] border border-white/10 bg-surface/72 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur">
            <header className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
                    Premium practice workspace
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                    {heading}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                    {subtitle}
                  </p>
                  <div className="mt-4">
                    <FocusModeOverlay
                      isFocusMode={isFocusMode}
                      onToggle={toggleFocusMode}
                      size="compact"
                    />
                  </div>
                </div>

                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                  <MetricPill label="WPM" value={engine.metrics.wpm} />
                  <MetricPill
                    label="Accuracy"
                    value={`${engine.metrics.accuracy}%`}
                  />
                  <MetricPill
                    label={activeModeIsTimed ? "Time" : "Progress"}
                    value={
                      activeModeIsTimed
                        ? `${engine.timeLeft}s`
                        : `${engine.metrics.progress}%`
                    }
                  />
                  <MetricPill label="XP" value={combinedXP} />
                </div>
              </div>
            </header>

            <div className="p-4 sm:p-5 xl:p-6">
              <div
                role="button"
                tabIndex={0}
                data-practice-text-panel
                onClick={() => inputRef.current?.focus({ preventScroll: true })}
                onKeyDown={() => inputRef.current?.focus({ preventScroll: true })}
                className="max-h-[min(54vh,540px)] min-h-[340px] scroll-py-24 overflow-y-auto rounded-[24px] border border-white/10 bg-background/45 p-5 outline-none transition duration-200 focus-within:border-accent/35 focus-within:shadow-[0_0_0_1px_rgba(216,199,163,0.08),0_20px_80px_rgba(0,0,0,0.22)] sm:p-8"
              >
                <PracticeText
                  activeWordIndex={engine.activeWordIndex}
                  text={engine.prompt.text}
                  typedText={engine.typedText}
                  wordRanges={engine.wordRanges}
                />
                <textarea
                  ref={inputRef}
                  aria-label="Practice typing input"
                  value={engine.typedText}
                  onChange={handlePracticeChange}
                  disabled={engine.status === "complete"}
                  className="sr-only"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  <span>Session progress</span>
                  <span className="text-accent">{engine.metrics.progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.055]">
                  <div
                    className="premium-progress h-full rounded-full bg-accent transition-all duration-300"
                    data-active={
                      engine.metrics.progress > 0 && engine.metrics.progress < 100
                        ? "true"
                        : "false"
                    }
                    style={{ width: `${engine.metrics.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Raw speed
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {engine.metrics.rawWpm} WPM
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Mistakes
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {engine.metrics.mistakes}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Elapsed
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {engine.elapsedSeconds}s
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Consistency
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {engine.metrics.typingConsistency.label}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Streak
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {practiceStreak} days
                  </p>
                </div>
              </div>
            </div>
          </AnimatedPanel>

          <div className="focus-mode-dim">
            <QuickPracticeCard
              onAction={handleShortcut}
              practicePlan={activePracticePlan || practicePlan}
            />
          </div>

          <div className="focus-mode-dim">
            <PracticeModeSelector
              activeModeId={modeId}
              categories={categoryOptions}
              customText={customText}
              duration={duration}
              modes={modeOptions}
              onCustomTextChange={handleCustomTextChange}
              onDurationChange={handleDurationChange}
              onModeChange={handleModeChange}
            />
          </div>

          <div className="focus-mode-dim">
            <AnalyticsDashboard
              analytics={enhancedAnalytics}
              practicePlan={activePracticePlan || practicePlan}
            />
          </div>
        </main>

        <div className="focus-mode-dim min-w-0 space-y-4">
          <CoachingPanel
            analytics={enhancedAnalytics}
            practicePlan={activePracticePlan || practicePlan}
          />
          <PracticeHistoryPanel
            bestScores={bestScores}
            improvementPattern={improvementPattern}
            recentSessions={recentSessions}
            streak={streak}
            totalXP={totalXP}
          />
        </div>
      </div>

      <SessionResultsModal
        onClose={() => setResult(null)}
        onRestart={handleRestart}
        result={result}
        streak={streak}
      />
    </div>
  )
}

export default PracticeWorkspace
