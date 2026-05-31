function Metric({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>}
    </div>
  )
}

function ProgressOverview({
  averageAccuracy,
  completedCount,
  lessonCount,
  progressPercent,
  streak,
}) {
  return (
    <section aria-label="Progress overview">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            Progress
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Learning record
          </h2>
        </div>
        <p className="text-sm font-semibold text-accent">{progressPercent}%</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent-secondary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric
          label="Lessons"
          value={`${completedCount}/${lessonCount}`}
          detail="Completion path"
        />
        <Metric
          label="Accuracy"
          value={averageAccuracy === null ? "--" : `${averageAccuracy}%`}
          detail="Session average"
        />
        <Metric
          label="Streak"
          value={streak?.current ? `${streak.current}` : "Ready"}
          detail="Prepared for daily goals"
        />
        <Metric
          label="Sync"
          value="Local"
          detail="Cloud-ready model"
        />
      </div>
    </section>
  )
}

export default ProgressOverview
