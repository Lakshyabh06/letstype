import { useEffect, useRef } from "react"

import useTypingAnalytics from "../../hooks/useTypingAnalytics"
import useDrillEngine from "../../hooks/useDrillEngine"
import useSoundEngine from "../../hooks/useSoundEngine"
import FingerPerformance from "../analytics/FingerPerformance"
import LiveStats from "../analytics/LiveStats"
import PerformanceSummary from "../analytics/PerformanceSummary"
import WeakKeyTracker from "../analytics/WeakKeyTracker"
import FingerGuide from "../finger-guide/FingerGuide"
import Keyboard from "../keyboard/Keyboard"
import DrillCompletion from "./DrillCompletion"
import DrillFeedback from "./DrillFeedback"
import DrillProgress from "./DrillProgress"
import DrillPrompt from "./DrillPrompt"

function DrillText({ currentIndex, text, typedText }) {
  return (
    <div className="min-h-24 rounded-2xl bg-background/45 p-4 text-2xl leading-relaxed text-muted sm:p-5 sm:text-3xl">
      {text.split("").map((char, index) => {
        const typedChar = typedText[index]
        const isTyped = index < typedText.length
        const isCurrent = index === currentIndex
        const colorClass = !isTyped
          ? "text-muted"
          : typedChar === char
            ? "text-primary"
            : "text-error"

        return (
          <span
            key={`${char}-${index}`}
            className={`${colorClass} rounded-sm transition duration-150 ${
              isCurrent
                ? "border-l-2 border-accent bg-accent/10 pl-1"
                : ""
            } ${char === " " ? "mx-0.5" : ""}`}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}

function DrillEngine({
  activeKeys = [],
  mode = "strict",
  onComplete,
  prompt,
  text,
}) {
  const { play } = useSoundEngine()
  const drill = useDrillEngine({ mode, text })
  const analytics = useTypingAnalytics(drill)
  const hasReportedCompletionRef = useRef(false)
  const keyboardActiveKeys = [
    ...activeKeys,
    ...drill.activeTargetKeys,
  ].filter(Boolean)

  useEffect(() => {
    if (!drill.isCompleted || hasReportedCompletionRef.current) {
      return
    }

    hasReportedCompletionRef.current = true
    play("complete", { throttleMs: 600 })
    onComplete?.(drill.result)
  }, [drill.isCompleted, drill.result, onComplete, play])

  function handleRestart() {
    hasReportedCompletionRef.current = false
    drill.resetDrill()
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.46fr)] xl:items-stretch">
          <div className="space-y-4">
            <DrillPrompt
              expectedKey={drill.expectedKey}
              mode={mode}
              prompt={prompt}
            />

            <DrillText
              currentIndex={drill.currentIndex}
              text={text}
              typedText={drill.typedText}
            />
          </div>

          <div className="space-y-3">
            <DrillProgress
              accuracy={drill.accuracy}
              currentIndex={drill.currentIndex}
              progress={drill.progress}
              textLength={text.length}
            />

            <LiveStats stats={analytics.liveStats} />

            <DrillFeedback
              feedback={drill.feedback}
              isCompleted={drill.isCompleted}
              isStrict={drill.isStrict}
            />

            <DrillCompletion
              isCompleted={drill.isCompleted}
              onRestart={handleRestart}
              result={drill.result}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] xl:grid-cols-[0.62fr_1.38fr]">
        <FingerGuide
          activeKeys={drill.activeTargetKeys}
          compactMode
          expectedKey={drill.expectedKey}
          pressedKeys={drill.pressedKeys}
          showLegend={false}
          workspaceMode
          wrongKeys={drill.wrongKeys}
        />

        <Keyboard
          activeKeys={keyboardActiveKeys}
          compactMode
          pressedKeys={drill.pressedKeys}
          showLegend={false}
          wrongKeys={drill.wrongKeys}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <PerformanceSummary
          indicators={analytics.indicators}
          summary={analytics.summary}
        />
        <WeakKeyTracker weakKeys={analytics.weakKeys} />
        <FingerPerformance weakFingers={analytics.weakFingers} />
      </div>
    </div>
  )
}

export default DrillEngine
