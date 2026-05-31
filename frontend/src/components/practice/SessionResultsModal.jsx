import { motion } from "framer-motion"
import { useEffect } from "react"

import useMotionPreferences from "../../hooks/useMotionPreferences"
import useSoundEngine from "../../hooks/useSoundEngine"
import { motionVariants } from "../../utils/motionTokens"

function ResultMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </div>
  )
}

function SessionResultsModal({ onClose, onRestart, result, streak = {} }) {
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const { play } = useSoundEngine()

  useEffect(() => {
    if (result?.xpEarned > 0) {
      play("xp", { throttleMs: 500 })
    }
  }, [play, result])

  if (!result) {
    return null
  }

  return (
    <motion.div
      animate={shouldAnimate ? "visible" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/78 px-4 py-6 backdrop-blur-sm"
      exit={shouldAnimate ? "exit" : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      transition={getTransition("modal")}
      variants={motionVariants.modalBackdrop}
    >
      <motion.section
        animate={shouldAnimate ? "visible" : undefined}
        className="max-h-[calc(100vh-48px)] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-surface p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-6"
        initial={shouldAnimate ? "hidden" : undefined}
        transition={getTransition("modal")}
        variants={motionVariants.modalPanel}
      >
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              Session results
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
              {result.modeLabel}
            </h2>
          </div>
          <span className="rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            +{result.xpEarned} XP
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ResultMetric label="WPM" value={result.wpm} />
          <ResultMetric label="Raw speed" value={result.rawWpm} />
          <ResultMetric label="Accuracy" value={`${result.accuracy}%`} />
          <ResultMetric label="Mistakes" value={result.mistakes || 0} />
          <ResultMetric label="Elapsed" value={`${result.elapsedSeconds}s`} />
          <ResultMetric label="Completion" value={`${result.progress}%`} />
          <ResultMetric label="Streak" value={`${streak.current || 0} days`} />
          <ResultMetric
            label="Consistency"
            value={
              result.typingConsistency?.score
                ? `${result.typingConsistency.score}%`
                : result.typingConsistency?.label || "Forming"
            }
          />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-2xl border border-white/10 bg-background/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
              Weak key summary
            </p>
            {result.weakKeySummary?.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.weakKeySummary.map((keyStats) => (
                  <span
                    key={keyStats.key}
                    className="rounded-full border border-error/25 bg-error/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {keyStats.key} - {keyStats.misses}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted">
                This run stayed balanced. Complete more sessions to surface recurring key patterns.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-accent-secondary/20 bg-accent-secondary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
              Coach recommendation
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {result.adaptiveRecommendations?.[0] || result.improvementInsight}
            </p>
          </section>
        </div>

        <section className="mt-3 rounded-2xl border border-white/10 bg-background/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Adaptive recommendations
          </p>
          {result.adaptiveRecommendations?.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {result.adaptiveRecommendations.map((recommendation) => (
                <p
                  key={recommendation}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted"
                >
                  {recommendation}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted">
              Complete another practice run to unlock more specific coach recommendations.
            </p>
          )}
        </section>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-white/10 px-5 text-sm font-semibold text-muted transition duration-200 hover:text-primary"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default SessionResultsModal
