const statusLabel = {
  completed: "Completed",
  unlocked: "Ready",
  locked: "Locked",
}

const statusClass = {
  completed: "border-accent-secondary/40 text-accent-secondary",
  unlocked: "border-accent/40 text-accent",
  locked: "border-white/10 text-muted",
}

function KeyPills({ keys, limit = 12, muted = false }) {
  const visibleKeys = keys.slice(0, limit)
  const remainingCount = Math.max(keys.length - visibleKeys.length, 0)

  if (keys.length === 0) {
    return <p className="text-sm text-muted">No previous keys yet</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleKeys.map((key) => (
        <span
          key={key}
          className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-2.5 text-sm font-semibold ${
            muted
              ? "border-white/10 bg-background/45 text-muted"
              : "border-accent/20 bg-background/60 text-primary"
          }`}
        >
          {key}
        </span>
      ))}

      {remainingCount > 0 && (
        <span className="flex h-9 items-center rounded-xl border border-white/10 bg-background/45 px-3 text-xs font-semibold text-muted">
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

function LessonCard({ lesson, isActive, onSelectLesson }) {
  const isLocked = lesson.status === "locked"

  return (
    <article
      className={`rounded-[24px] border bg-white/[0.025] p-5 transition duration-200 ${
        isActive
          ? "border-accent/40 bg-white/[0.045]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass[lesson.status]}`}
            >
              {statusLabel[lesson.status]}
            </span>

            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {lesson.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold leading-snug text-primary">
            {lesson.number}. {lesson.title}
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {lesson.focus}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectLesson(lesson)}
          className={`h-10 min-w-24 shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition duration-200 ${
            isLocked
              ? "cursor-not-allowed border border-white/10 text-muted"
              : "bg-primary text-background hover:-translate-y-0.5 hover:bg-accent"
          }`}
          disabled={isLocked}
        >
          {isLocked ? "Locked" : "Open"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            New keys
          </p>
          {lesson.newKeys.length > 0 ? (
            <KeyPills keys={lesson.newKeys} />
          ) : (
            <p className="text-sm text-muted">Review and rhythm lesson</p>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Cumulative review
          </p>
          <KeyPills keys={lesson.reviewKeys} limit={10} muted />
        </div>
      </div>
    </article>
  )
}

export default LessonCard
