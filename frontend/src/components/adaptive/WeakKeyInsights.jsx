function InsightPill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-muted">
      {label}
      <span className="text-primary">{value}</span>
    </span>
  )
}

function WeakKeyInsights({ weakKeys = [] }) {
  const visibleKeys = weakKeys.slice(0, 4)

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label="Adaptive weak key insights"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Key intelligence
          </p>
          <h3 className="mt-2 text-base font-semibold text-primary">
            Watch keys
          </h3>
        </div>
        <span className="rounded-full border border-accent-secondary/25 bg-accent-secondary/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-accent-secondary">
          Adaptive
        </span>
      </div>

      {visibleKeys.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          Complete a few guided lessons to reveal keys that need extra review.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {visibleKeys.map((keyStats) => (
              <span
                key={keyStats.keyId}
                className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 px-2 text-sm font-semibold text-primary"
              >
                {keyStats.key}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <InsightPill
              label="Misses"
              value={visibleKeys.reduce(
                (total, keyStats) => total + (keyStats.mistakes || 0),
                0
              )}
            />
            <InsightPill
              label="Hesitations"
              value={visibleKeys.reduce(
                (total, keyStats) => total + (keyStats.hesitationCount || 0),
                0
              )}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default WeakKeyInsights
