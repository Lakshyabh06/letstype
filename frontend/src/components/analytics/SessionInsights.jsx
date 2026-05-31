import ConfidenceBadge from "./ConfidenceBadge"

function getInsightLabel(value) {
  if (!value) {
    return "Forming"
  }

  return value[0].toUpperCase() + value.slice(1)
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-primary">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>}
    </div>
  )
}

function SessionInsights({ analytics }) {
  const trends = analytics?.trends || {}
  const latestConfidence = analytics?.confidence?.[0]

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label="Session analytics"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Session analytics
          </p>
          <h3 className="mt-2 text-base font-semibold text-primary">
            Coach signal
          </h3>
        </div>
        <ConfidenceBadge
          label={latestConfidence?.confidenceLabel || "Forming"}
          score={latestConfidence?.confidenceScore}
          tone={
            latestConfidence?.confidenceLabel === "Weak Area Detected"
              ? "review"
              : latestConfidence?.confidenceLabel === "Needs Reinforcement"
                ? "reinforce"
                : "steady"
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric
          label="Accuracy"
          value={
            Number.isFinite(trends.accuracyAverage)
              ? `${trends.accuracyAverage}%`
              : "New"
          }
          detail={getInsightLabel(trends.accuracyDirection)}
        />
        <Metric
          label="Pace"
          value={Number.isFinite(trends.wpmAverage) ? `${trends.wpmAverage}` : "New"}
          detail="Average WPM"
        />
        <Metric
          label="Consistency"
          value={getInsightLabel(trends.consistency)}
          detail={trends.fatigue ? "Fatigue signal visible" : "Recent sessions"}
        />
        <Metric
          label="Retries"
          value={trends.retryAverage || 0}
          detail="Recent average"
        />
      </div>
    </section>
  )
}

export default SessionInsights
