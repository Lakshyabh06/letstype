function formatDate(value) {
  if (!value) {
    return "New"
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(new Date(value))
}

function PracticeHistoryPanel({
  bestScores = {},
  improvementPattern,
  recentSessions = [],
  streak = {},
  totalXP = 0,
}) {
  const bestScoreList = Object.entries(bestScores).slice(0, 4)

  return (
    <aside className="space-y-4">
      <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          Practice history
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">
          Progress memory
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Streak
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {streak.current || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Practice XP
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">{totalXP}</p>
          </div>
        </div>

        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted">
          {improvementPattern}
        </p>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
          Best scores
        </p>
        {bestScoreList.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted">
            Complete your first practice session to unlock best scores.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {bestScoreList.map(([modeId, score]) => (
              <div
                key={modeId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {score.modeLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(score.completedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">
                    {score.wpm} WPM
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {score.accuracy}% accuracy
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
          Recent sessions
        </p>
        {recentSessions.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted">
            Your practice history will appear here after the first completed run.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {session.modeLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(session.completedAt)}
                  </p>
                </div>
                <div className="text-right text-xs font-semibold text-muted">
                  <p className="text-primary">{session.wpm} WPM</p>
                  <p>{session.accuracy}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}

export default PracticeHistoryPanel
