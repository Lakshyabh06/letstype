function StatPill({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-background/45 px-3 py-2">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
    </div>
  )
}

function LiveStats({ stats }) {
  return (
    <section
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      aria-label="Live typing stats"
    >
      <StatPill label="Accuracy" value={`${stats.accuracy}%`} />
      <StatPill label="Pace" value={stats.wpm > 0 ? `${stats.wpm} WPM` : "Ready"} />
      <StatPill label="Misses" value={stats.incorrectAttempts} />
      <StatPill label="Left" value={stats.remaining} />
    </section>
  )
}

export default LiveStats
