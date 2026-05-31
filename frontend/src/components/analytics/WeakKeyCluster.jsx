function WeakKeyCluster({ clusters = [] }) {
  const visibleClusters = clusters.slice(0, 3)

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label="Weak key clusters"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
        Weak clusters
      </p>
      <h3 className="mt-2 text-base font-semibold text-primary">
        Review zones
      </h3>

      {visibleClusters.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          Complete more practice to group recurring misses into review zones.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {visibleClusters.map((cluster) => (
            <div key={cluster.title} className="rounded-xl bg-white/[0.035] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-primary">
                  {cluster.title}
                </p>
                <span className="text-xs font-semibold text-muted">
                  {cluster.accuracy || 0}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cluster.keys.slice(0, 5).map((keyStats) => (
                  <span
                    key={keyStats.keyId}
                    className="flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-background/45 px-2 text-xs font-semibold text-primary"
                  >
                    {keyStats.key}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">
                {cluster.mistakeCount} misses, {cluster.hesitationCount} hesitations
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default WeakKeyCluster
