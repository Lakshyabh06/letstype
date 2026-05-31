import usePerformanceMetrics from "../../hooks/usePerformanceMetrics"

function PerformanceOverlay() {
  const metrics = usePerformanceMetrics()

  if (!metrics.enabled) {
    return null
  }

  return (
    <aside className="fixed bottom-3 right-3 z-[80] w-64 rounded-2xl border border-white/10 bg-background/88 p-3 text-xs shadow-[0_20px_80px_rgba(0,0,0,0.38)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold uppercase tracking-[0.16em] text-accent-secondary">
          Performance
        </p>
        <span className="text-muted">{metrics.status}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/[0.035] p-2">
          <dt className="text-muted">FPS</dt>
          <dd className="mt-1 text-lg font-semibold text-primary">
            {metrics.fps}
          </dd>
        </div>
        <div className="rounded-xl bg-white/[0.035] p-2">
          <dt className="text-muted">Input</dt>
          <dd className="mt-1 text-lg font-semibold text-primary">
            {metrics.inputLatency}ms
          </dd>
        </div>
        <div className="rounded-xl bg-white/[0.035] p-2">
          <dt className="text-muted">Long tasks</dt>
          <dd className="mt-1 text-lg font-semibold text-primary">
            {metrics.longTasks}
          </dd>
        </div>
        <div className="rounded-xl bg-white/[0.035] p-2">
          <dt className="text-muted">Memory</dt>
          <dd className="mt-1 text-lg font-semibold text-primary">
            {metrics.memory}MB
          </dd>
        </div>
      </dl>
    </aside>
  )
}

export default PerformanceOverlay
