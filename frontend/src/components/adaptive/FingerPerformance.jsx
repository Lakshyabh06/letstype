function FingerPerformance({ weakFingers = [] }) {
  const visibleFingers = weakFingers.slice(0, 3)

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label="Adaptive finger performance"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
        Finger balance
      </p>
      <h3 className="mt-2 text-base font-semibold text-primary">
        Reach consistency
      </h3>

      {visibleFingers.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          Finger control is balanced across recent lessons.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {visibleFingers.map((finger) => (
            <div key={finger.fingerId}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold">
                <span className="text-primary">
                  {finger.hand} {finger.label}
                </span>
                <span className="text-muted">{finger.accuracy}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: finger.color,
                    width: `${Math.max(finger.accuracy, 8)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-muted">
                {finger.reachZone}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FingerPerformance
