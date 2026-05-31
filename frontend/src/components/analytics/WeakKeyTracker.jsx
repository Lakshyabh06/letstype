function WeakKeyTracker({ weakKeys = [] }) {
  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
      aria-label="Weak key tracking"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
          Watch keys
        </p>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted">
          Live
        </span>
      </div>

      {weakKeys.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          Weak-key signals will appear after your first saved session.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {weakKeys.map((keyStats) => (
            <span
              key={keyStats.keyId}
              className="inline-flex items-center gap-2 rounded-full border border-error/25 bg-error/10 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              {keyStats.key}
              <span className="text-muted">
                {keyStats.mistakes || keyStats.hesitationCount || 0}
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

export default WeakKeyTracker
