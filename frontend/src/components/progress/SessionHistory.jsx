function formatSessionDate(value) {
  if (!value) {
    return "No date"
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function SessionHistory({ sessions = [] }) {
  const visibleSessions = sessions.slice(0, 5)

  return (
    <section aria-label="Session history">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            History
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Recent sessions
          </h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {sessions.length} saved
        </span>
      </div>

      {visibleSessions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
          <p className="text-sm font-medium text-primary">
            Complete a guided lesson to start the record.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Accuracy, pace, and attempts will be stored locally for future sync.
          </p>
        </div>
      ) : (
        <ol className="space-y-2">
          {visibleSessions.map((session) => (
            <li
              key={session.id}
              className="rounded-2xl border border-white/10 bg-background/45 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {session.lessonNumber}. {session.lessonTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatSessionDate(session.completedAt)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-2.5 py-1 text-xs font-semibold text-accent-secondary">
                  {session.accuracy}%
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
                <span>{session.wpm || 0} WPM</span>
                <span>{session.incorrectAttempts || 0} misses</span>
                <span>{session.totalAttempts || 0} keys</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default SessionHistory
