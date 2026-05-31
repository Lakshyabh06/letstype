import AccuracyTrendChart from "./AccuracyTrendChart"
import AnimatedPanel from "../motion/AnimatedPanel"
import KeyboardHeatmap from "./KeyboardHeatmap"
import RecommendationCard from "./RecommendationCard"
import SessionInsights from "./SessionInsights"
import WeakKeyCluster from "./WeakKeyCluster"

function FingerStressPanel({ fingers = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-background/45 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
        Finger stress
      </p>
      {fingers.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          Finger load looks balanced from the current evidence.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {fingers.map((finger) => {
            const stress = Math.min(
              100,
              (finger.mistakeRate || 0) * 1.2 +
                (finger.problematicReaches || 0) * 4
            )

            return (
              <div key={finger.fingerId}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-semibold">
                  <span className="text-primary">{finger.label}</span>
                  <span className="text-muted">{Math.round(stress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-error/70 transition-all duration-300"
                    style={{ width: `${Math.max(8, stress)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function AccuracyDistribution({ sessions = [] }) {
  const buckets = [
    { id: "stable", label: "96+", count: 0 },
    { id: "good", label: "90-95", count: 0 },
    { id: "review", label: "<90", count: 0 },
  ]

  sessions.slice(0, 16).forEach((session) => {
    if ((session.accuracy || 0) >= 96) {
      buckets[0].count += 1
    } else if ((session.accuracy || 0) >= 90) {
      buckets[1].count += 1
    } else {
      buckets[2].count += 1
    }
  })

  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1)

  return (
    <section className="rounded-2xl border border-white/10 bg-background/45 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
        Accuracy distribution
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {buckets.map((bucket) => (
          <div
            key={bucket.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex h-16 items-end rounded-full bg-white/[0.04]">
              <div
                className={`w-full rounded-full transition-all duration-300 ${
                  bucket.id === "review"
                    ? "bg-error/70"
                    : bucket.id === "good"
                      ? "bg-accent-secondary"
                      : "bg-accent"
                }`}
                style={{
                  height: `${Math.max(10, (bucket.count / maxCount) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-primary">
              {bucket.label}
            </p>
            <p className="text-xs text-muted">{bucket.count} runs</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function AnalyticsDashboard({ analytics, practicePlan }) {
  const recommendations = analytics?.recommendations || []
  const strongestZones = analytics?.mastery?.strongestZones || []
  const weakFingerZones = analytics?.mastery?.weakFingerZones || []

  return (
    <AnimatedPanel
      className="rounded-[24px] border border-white/10 bg-background/35 p-4"
      aria-label="Intelligent analytics dashboard"
      variant="reveal"
    >
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            Intelligent coach
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Personalized training system
          </h2>
        </div>
        {Number.isFinite(analytics?.mastery?.keyboardAverage) && (
          <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {analytics.mastery.keyboardAverage}% keyboard mastery
          </span>
        )}
      </div>

      <div className="grid min-w-0 gap-3 min-[1700px]:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <div className="min-w-0 space-y-3">
          <KeyboardHeatmap keyboardStats={analytics?.keyboardStats} />
          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
            <AccuracyTrendChart sessions={analytics?.sessions} />
            <AccuracyTrendChart sessions={analytics?.sessions} type="wpm" />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <SessionInsights analytics={analytics} />
          <FingerStressPanel fingers={weakFingerZones} />
          <AccuracyDistribution sessions={analytics?.sessions} />
          <WeakKeyCluster clusters={analytics?.mastery?.weakKeyClusters} />

          <section className="rounded-2xl border border-white/10 bg-background/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
              Strongest zones
            </p>
            {strongestZones.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-muted">
                Strength zones will appear after more guided practice.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {strongestZones.map((zone) => (
                  <span
                    key={zone.fingerId}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {zone.title} {zone.accuracy}%
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-accent-secondary/20 bg-accent-secondary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
              Smart practice mode
            </p>
            <h3 className="mt-2 text-base font-semibold text-primary">
              {practicePlan?.title || "Adaptive review"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {practicePlan?.description ||
                "A targeted drill will appear once the coach has enough evidence."}
            </p>
            {practicePlan?.focusKeys?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {practicePlan.focusKeys.slice(0, 8).map((key) => (
                  <span
                    key={key}
                    className="flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-background/45 px-2 text-xs font-semibold text-primary"
                  >
                    {key}
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="space-y-2">
            {recommendations.length === 0 ? (
              <RecommendationCard
                recommendation={{
                  action: "Keep building the learning record",
                  detail:
                    "Personal recommendations will sharpen after a few completed lessons.",
                  tone: "steady",
                }}
              />
            ) : (
              recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </AnimatedPanel>
  )
}

export default AnalyticsDashboard
