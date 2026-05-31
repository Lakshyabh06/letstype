const statusText = {
  completed: "Complete",
  locked: "Locked",
  unlocked: "Ready",
}

function LessonProgress({ activeLesson, lessons = [] }) {
  const activeIndex = lessons.findIndex((lesson) => lesson.id === activeLesson?.id)
  const previousLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null
  const nextLesson =
    activeIndex >= 0 && activeIndex < lessons.length - 1
      ? lessons[activeIndex + 1]
      : null

  return (
    <section aria-label="Lesson progression">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          Progression
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">
          Lesson position
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
        <p className="text-sm font-semibold text-primary">
          {activeLesson?.number}. {activeLesson?.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {activeLesson?.focus}
        </p>

        <div className="mt-4 grid gap-2">
          {[previousLesson, activeLesson, nextLesson].filter(Boolean).map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm ${
                lesson.id === activeLesson?.id
                  ? "border-accent/35 bg-accent/10 text-primary"
                  : "border-white/10 bg-white/[0.025] text-muted"
              }`}
            >
              <span className="min-w-0 truncate">
                {lesson.number}. {lesson.title}
              </span>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em]">
                {statusText[lesson.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LessonProgress
