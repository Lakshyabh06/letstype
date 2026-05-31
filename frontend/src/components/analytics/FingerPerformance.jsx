function FingerPerformance({ weakFingers = [] }) {
  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
      aria-label="Finger performance"
    >
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
        Finger focus
      </p>

      {weakFingers.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">Finger control is clean.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {weakFingers.map((finger) => (
            <div key={finger.fingerId}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold text-primary">
                <span>
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
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FingerPerformance
