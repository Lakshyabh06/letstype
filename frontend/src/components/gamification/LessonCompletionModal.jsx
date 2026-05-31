import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"

import useMotionPreferences from "../../hooks/useMotionPreferences"
import useSoundEngine from "../../hooks/useSoundEngine"
import { motionVariants } from "../../utils/motionTokens"
import AchievementToast from "./AchievementToast"

function DetailCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-primary">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>}
    </div>
  )
}

function WeakKeySummary({ weakKeys = [] }) {
  if (weakKeys.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-background/45 p-4 text-sm leading-6 text-muted">
        This lesson stayed balanced. Keep the next pass just as measured.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {weakKeys.slice(0, 5).map((keyStat) => (
        <span
          key={keyStat.keyId}
          className="rounded-xl border border-white/10 bg-background/55 px-3 py-2 text-sm font-semibold text-primary"
        >
          {keyStat.key}
          <span className="ml-2 text-xs font-medium text-muted">
            {keyStat.mistakes} miss
          </span>
        </span>
      ))}
    </div>
  )
}

function LessonCompletionModal({
  completion,
  nextLesson,
  onClose,
  recommendation,
}) {
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const { play } = useSoundEngine()

  useEffect(() => {
    if (!completion) {
      return undefined
    }

    play("xp", { throttleMs: 500 })

    const achievementTimer =
      completion.reward?.achievements?.length > 0
        ? window.setTimeout(() => play("achievement", { throttleMs: 500 }), 160)
        : null

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      if (achievementTimer) {
        window.clearTimeout(achievementTimer)
      }

      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [completion, onClose, play])

  if (!completion) {
    return null
  }

  const { lesson, result, reward } = completion
  const xp = reward?.xp || { breakdown: [], total: 0 }
  const achievements = reward?.achievements || []
  const confidence = result?.confidence
  const weakKeys = result?.weakKeys || []
  const practiceStreak = reward?.practiceStreak || {}

  return createPortal(
    <motion.div
      animate={shouldAnimate ? "visible" : undefined}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-background/82 px-4 py-6 backdrop-blur-xl"
      exit={shouldAnimate ? "exit" : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-completion-title"
      transition={getTransition("modal")}
      variants={motionVariants.modalBackdrop}
    >
      <motion.div
        animate={shouldAnimate ? "visible" : undefined}
        className="w-full max-w-5xl rounded-[28px] border border-white/10 bg-surface/95 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.42)] sm:p-6"
        initial={shouldAnimate ? "hidden" : undefined}
        transition={getTransition("modal")}
        variants={motionVariants.modalPanel}
      >
        <header className="grid gap-5 border-b border-white/10 pb-5 lg:grid-cols-[1fr_220px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              Lesson complete
            </p>
            <h2
              id="lesson-completion-title"
              className="mt-2 text-2xl font-semibold leading-tight text-primary sm:text-3xl"
            >
              {lesson.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              A clean record has been added to your learning path.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-right shadow-[0_0_45px_rgba(216,199,163,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Earned
            </p>
            <p className="mt-1 text-4xl font-semibold text-primary">
              +{xp.total}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              XP
            </p>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <DetailCard
                label="Confidence"
                value={confidence?.label || "Recorded"}
                detail={
                  confidence?.score === null || confidence?.score === undefined
                    ? "Lesson result saved"
                    : `${confidence.score}/100 learning confidence`
                }
              />
              <DetailCard
                label="Streak"
                value={
                  practiceStreak.current
                    ? `${practiceStreak.current} day${practiceStreak.current === 1 ? "" : "s"}`
                    : "Ready"
                }
                detail="Daily practice rhythm"
              />
            </div>

            <section className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                XP sources
              </p>
              <div className="mt-3 space-y-2">
                {xp.breakdown.map((item) => (
                  <div
                    key={item.reason}
                    className="flex items-center justify-between gap-3 rounded-xl bg-background/45 px-3 py-2"
                  >
                    <span className="text-sm text-primary">{item.reason}</span>
                    <span className="text-sm font-semibold text-accent">
                      +{item.xp}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <AchievementToast achievements={achievements} />
          </div>

          <div className="space-y-4">
            <section className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Weak key summary
              </p>
              <div className="mt-3">
                <WeakKeySummary weakKeys={weakKeys} />
              </div>
            </section>

            <section className="rounded-[24px] border border-accent-secondary/20 bg-accent-secondary/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                Next recommended lesson
              </p>
              <p className="mt-2 text-lg font-semibold text-primary">
                {recommendation?.action || nextLesson?.title || "Review pool"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {nextLesson
                  ? `Continue with ${nextLesson.title} when you are ready.`
                  : "The full path is complete. Use review drills to keep precision fresh."}
              </p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-background transition duration-200 hover:-translate-y-0.5 hover:bg-accent"
          >
            Continue path
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default LessonCompletionModal
