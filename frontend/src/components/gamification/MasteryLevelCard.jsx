function MasteryLevelCard({ mastery, totalXP = 0 }) {
  if (!mastery?.currentLevel) {
    return null
  }

  const { currentLevel, nextLevel, percent, xpRemaining } = mastery

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/45 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Mastery level
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            {currentLevel.label}
          </h2>
        </div>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {totalXP} XP
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">
        {currentLevel.description}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-muted">
        {nextLevel
          ? `${xpRemaining} XP to ${nextLevel.label}`
          : "Highest mastery level reached"}
      </p>
    </section>
  )
}

export default MasteryLevelCard
