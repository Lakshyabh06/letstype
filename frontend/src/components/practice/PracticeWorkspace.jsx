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
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
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
    return expected === " " ? "text-transparent" : "text-muted"
  }

  if (typed === expected) {
    return expected === " " ? "text-transparent" : "text-primary"
  }

  return "rounded bg-error/18 px-0.5 text-error"
}

function getDisplayCharacter(expected, typed) {
  if (typed === undefined || typed === expected) {
    return expected === " " ? "\u00a0" : expected
  }

  if (typed === " ") {
    return "\u00b7"
  }

  return typed
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
    <div className="text-[1.72rem] leading-[2.6rem] text-muted sm:text-4xl sm:leading-[3.35rem]">
      {wordRanges.map((range) => {
        const isActive = range.index === activeWordIndex
        const isComplete = currentIndex >= range.end
        const nextRange = wordRanges[range.index + 1]
        const trailingText = text.slice(range.end, nextRange?.start ?? text.length)

        return (
          <span key={`${range.value}-${range.start}`}>
            <span
              ref={isActive ? activeWordRef : null}
              className={`inline-block rounded-lg px-1 transition duration-200 ${
                isActive
                  ? "bg-white/[0.065] text-primary"
                  : isComplete
                    ? "text-primary/78"
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
                    {getDisplayCharacter(character, typed)}
                  </span>
                )
              })}
            </span>
            {trailingText.split("").map((character, offset) => {
              const index = range.end + offset
              const typed = typedText[index]

              return (
                <span
                  key={`${range.end}-${offset}`}
                  className={getCharacterClass({
                    expected: character,
                    typed,
                  })}
                >
                  {index === currentIndex && <TypingCaret />}
                  {getDisplayCharacter(character, typed)}
                </span>
              )
            })}
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
    const nextText = event.target.value.slice(0, engine.prompt.text.length)

    if (nextText.length > engine.typedText.length) {
      const addedCharacters = nextText.slice(engine.typedText.length)

      addedCharacters.split("").forEach((character, offset) => {
        const index = engine.typedText.length + offset
        const expectedCharacter = engine.prompt.text[index]
        const isCorrect = character === expectedCharacter

        play(isCorrect ? "correct" : "wrong")
      })

      if (nextText.length > 0 && nextText.length % 28 === 0) {
        play("combo", { throttleMs: 500, gain: 0.62 })
      }
    }

    engine.handleTyping(nextText)
  }

  const combinedXP = (gamification?.totalXP || 0) + totalXP
  const practiceStreak = streak.current || streaks?.practiceStreak?.current || 0
  const activeModeIsTimed = isTimedPracticeMode(modeId)
  const heading = engine.prompt.title
  const subtitle =
    "Learn -> Practice -> Improve -> Review results"

  return (
    <div className={`min-w-0 px-3 pb-8 sm:px-5 lg:px-6 ${isFocusMode ? "focus-mode-active" : ""}`}>
      <div className="mx-auto grid min-w-0 max-w-[var(--workspace-max,1800px)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]">
        <main className="min-w-0 space-y-4">
          <AnimatedPanel className="focus-mode-primary min-w-0 rounded-[28px] border border-accent/18 bg-surface/78 shadow-[0_30px_110px_rgba(0,0,0,0.32)] backdrop-blur">
            <header className="border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
                    Practice
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                    {heading}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
                    {subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="h-10 rounded-full border border-accent/35 bg-accent/10 px-4 text-sm font-semibold text-primary transition duration-200 hover:bg-accent/18"
                  >
                    Restart
                  </button>
                  <FocusModeOverlay
                    isFocusMode={isFocusMode}
                    onToggle={toggleFocusMode}
                    size="compact"
                  />
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
                className="max-h-[min(50vh,560px)] min-h-[330px] scroll-py-24 overflow-y-auto rounded-[24px] border border-accent/20 bg-background/58 p-5 outline-none transition duration-200 focus-within:border-accent/45 focus-within:shadow-[0_0_0_1px_rgba(216,199,163,0.12),0_24px_90px_rgba(0,0,0,0.28)] sm:min-h-[360px] sm:p-8"
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

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Typing feedback
                    </p>
                    <p className="mt-1 text-sm text-primary">
                      {engine.metrics.mistakes > 0
                        ? `${engine.metrics.mistakes} historical mistake${engine.metrics.mistakes === 1 ? "" : "s"} recorded. Backspace can fix the line, not erase the attempt.`
                        : "Clean so far. Keep the rhythm relaxed."}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-background/45 px-3 py-1.5 text-sm font-semibold text-accent">
                    {engine.metrics.progress}%
                  </span>
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

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
                <MetricPill label="Raw speed" value={`${engine.metrics.rawWpm} WPM`} />
                <MetricPill label="Mistakes" value={engine.metrics.mistakes} />
                <MetricPill label="Elapsed" value={`${engine.elapsedSeconds}s`} />
                <MetricPill
                  label="Consistency"
                  value={engine.metrics.typingConsistency.label}
                />
                <MetricPill label="XP" value={combinedXP} />
              </div>
            </div>
          </AnimatedPanel>

          <details className="focus-mode-dim rounded-[24px] border border-white/10 bg-background/28 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Session options
            </summary>
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
          </details>

          <details className="focus-mode-dim rounded-[24px] border border-white/10 bg-background/28 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Training shortcuts
            </summary>
            <div className="mt-4">
              <QuickPracticeCard
                compact
                onAction={handleShortcut}
                practicePlan={activePracticePlan || practicePlan}
              />
            </div>
          </details>

          <details className="focus-mode-dim rounded-[24px] border border-white/10 bg-background/28 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Analytics and recommendations
            </summary>
            <div className="mt-4">
            <AnalyticsDashboard
              analytics={enhancedAnalytics}
              practicePlan={activePracticePlan || practicePlan}
            />
            </div>
          </details>
        </main>

        <div className="focus-mode-dim min-w-0 space-y-4">
          <details className="rounded-[24px] border border-white/10 bg-background/28 p-4" open>
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Improve
            </summary>
            <div className="mt-4">
              <CoachingPanel
                analytics={enhancedAnalytics}
                practicePlan={activePracticePlan || practicePlan}
              />
            </div>
          </details>
          <details className="rounded-[24px] border border-white/10 bg-background/28 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Review results
            </summary>
            <div className="mt-4">
              <PracticeHistoryPanel
                bestScores={bestScores}
                improvementPattern={improvementPattern}
                recentSessions={recentSessions}
                streak={streak}
                totalXP={totalXP}
              />
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Streak
                </p>
                <p className="mt-2 text-lg font-semibold text-primary">
                  {practiceStreak} days
                </p>
              </div>
            </div>
          </details>
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
