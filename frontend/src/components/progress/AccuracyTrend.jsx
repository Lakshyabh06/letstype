function AccuracyTrend({ history = [] }) {
  const visibleHistory = history.slice(0, 8).reverse()
  const hasHistory = visibleHistory.length > 0

  return (
    <section aria-label="Accuracy trend">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          Accuracy
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">
          Trend foundation
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
        {hasHistory ? (
          <div className="flex h-24 items-end gap-2">
            {visibleHistory.map((entry) => (
              <div
                key={`${entry.lessonId}-${entry.completedAt}`}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-16 w-full items-end rounded-full bg-white/[0.04]">
                  <div
                    className="w-full rounded-full bg-accent"
                    style={{ height: `${Math.max(entry.accuracy, 8)}%` }}
                  />
                </div>
                <span className="text-[0.62rem] font-semibold text-muted">
                  {entry.accuracy}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted">
            Accuracy points will appear here as guided lessons are completed.
          </p>
        )}
      </div>
    </section>
  )
}

export default AccuracyTrend
