function getBarTone(value, type) {
  if (type === "wpm") {
    return value > 0 ? "bg-accent-secondary" : "bg-white/10"
  }

  if (value >= 96) {
    return "bg-accent"
  }

  if (value >= 88) {
    return "bg-accent-secondary"
  }

  return "bg-error/80"
}

function AccuracyTrendChart({ sessions = [], type = "accuracy" }) {
  const visibleSessions = sessions.slice(0, 8).reverse()
  const hasSessions = visibleSessions.length > 0
  const maxWpm = Math.max(...visibleSessions.map((session) => session.wpm || 0), 1)

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label={`${type} trend chart`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            {type === "wpm" ? "Pace" : "Accuracy"}
          </p>
          <h3 className="mt-2 text-base font-semibold text-primary">
            {type === "wpm" ? "WPM trend" : "Control trend"}
          </h3>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {visibleSessions.length || 0} pts
        </span>
      </div>

      {hasSessions ? (
        <div className="mt-4 flex h-24 items-end gap-2">
          {visibleSessions.map((session) => {
            const value = type === "wpm" ? session.wpm || 0 : session.accuracy || 0
            const height =
              type === "wpm"
                ? Math.max((value / maxWpm) * 100, 8)
                : Math.max(value, 8)

            return (
              <div
                key={`${type}-${session.id}`}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-16 w-full items-end overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className={`w-full rounded-full transition-all duration-300 ${getBarTone(
                      value,
                      type
                    )}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[0.62rem] font-semibold text-muted">
                  {value}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">
          Complete guided lessons to build this signal.
        </p>
      )}
    </section>
  )
}

export default AccuracyTrendChart
