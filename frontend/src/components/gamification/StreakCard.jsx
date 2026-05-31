function StreakMetric({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/45 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-primary">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>}
    </div>
  )
}

function StreakCard({ lessonStreak = {}, practiceStreak = {}, compact = false }) {
  const dailyValue = practiceStreak.current
    ? `${practiceStreak.current} day${practiceStreak.current === 1 ? "" : "s"}`
    : "Ready"
  const lessonValue = lessonStreak.current
    ? `${lessonStreak.current}`
    : "Start"

  return (
    <section
      className={`rounded-[24px] border border-accent-secondary/20 bg-accent-secondary/10 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Consistency
          </p>
          <h2 className="mt-2 text-lg font-semibold text-primary">
            Practice rhythm
          </h2>
        </div>
        {practiceStreak.best > 0 && (
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-muted">
            Best {practiceStreak.best}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StreakMetric
          label="Daily"
          value={dailyValue}
          detail="Consecutive practice days"
        />
        <StreakMetric
          label="Lessons"
          value={lessonValue}
          detail="Completed path momentum"
        />
      </div>
    </section>
  )
}

export default StreakCard
