const railStyles = {
  completed: "border-accent-secondary bg-accent-secondary text-background",
  unlocked: "border-accent bg-accent text-background",
  locked: "border-white/15 bg-background text-muted",
}

function ProgressRail({ modules, activeLessonId, onSelectLesson }) {
  return (
    <ol className="space-y-1">
      {modules.map((module) => (
        <li key={module.id} className="pb-5 last:pb-0">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            {module.title}
          </p>

          <div className="space-y-2 border-l border-white/10 pl-4">
            {module.lessons.map((lesson) => {
              const isActive = lesson.id === activeLessonId
              const isLocked = lesson.status === "locked"

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onSelectLesson(lesson)}
                  disabled={isLocked}
                  className={`grid w-full grid-cols-[28px_1fr] items-center gap-3 rounded-xl px-2 py-2 text-left transition duration-200 ${
                    isActive
                      ? "bg-white/[0.06] text-primary"
                      : isLocked
                        ? "cursor-not-allowed text-muted/60"
                        : "text-muted hover:bg-white/[0.04] hover:text-primary"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${railStyles[lesson.status]}`}
                  >
                    {lesson.status === "completed" ? "OK" : lesson.number}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {lesson.title}
                    </span>

                    <span className="mt-0.5 block text-xs text-muted">
                      {lesson.status === "locked" ? "Locked" : lesson.duration}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default ProgressRail
