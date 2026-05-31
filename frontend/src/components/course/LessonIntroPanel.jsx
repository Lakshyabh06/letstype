import { useState } from "react"

import LessonSession from "../lesson-session/LessonSession"

function KeyList({ keys, emptyLabel = "Review only" }) {
  if (!keys || keys.length === 0) {
    return <p className="mt-3 text-sm font-medium text-muted">{emptyLabel}</p>
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {keys.map((key) => (
        <span
          key={key}
          className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-white/[0.06] px-2 text-xs font-semibold text-accent"
        >
          {key}
        </span>
      ))}
    </div>
  )
}

function LessonIntroPanel({ lesson, onLessonComplete }) {
  const [isSessionOpen, setIsSessionOpen] = useState(false)

  if (!lesson) {
    return null
  }

  const isLocked = lesson.status === "locked"

  return (
    <section className="rounded-[28px] border border-white/10 bg-surface/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-accent-secondary">
            Current step
          </p>

          <h2 className="text-3xl font-semibold leading-tight text-primary">
            {lesson.title}
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {lesson.goal}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSessionOpen(true)}
          disabled={isLocked}
          className={`h-12 min-w-40 whitespace-nowrap rounded-full px-6 text-sm font-semibold transition duration-200 ${
            isLocked
              ? "cursor-not-allowed border border-white/10 text-muted"
              : "bg-accent text-background hover:-translate-y-0.5 hover:bg-primary"
          }`}
        >
          {isLocked ? "Complete previous lesson" : "Begin lesson"}
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Finger focus
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {lesson.fingers}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Lesson length
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {lesson.duration}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            New keys
          </p>
          <KeyList keys={lesson.newKeys} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Review pool
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {lesson.reviewKeys.length} keys reinforced
          </p>
        </div>
      </div>

      {isSessionOpen && (
        <LessonSession
          key={lesson.id}
          lesson={lesson}
          onClose={() => setIsSessionOpen(false)}
          onComplete={(completedLesson, result) =>
            onLessonComplete?.(completedLesson, result)
          }
        />
      )}
    </section>
  )
}

export default LessonIntroPanel
