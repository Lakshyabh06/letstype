import { createAdaptiveReviewDraft } from "../../utils/adaptiveRecommendations"

const toneClasses = {
  ready: "border-white/10 bg-background/45",
  review: "border-accent/25 bg-accent/10",
  steady: "border-accent-secondary/25 bg-accent-secondary/10",
  strong: "border-accent-secondary/25 bg-accent-secondary/10",
}

function AdaptiveReviewCard({ adaptive }) {
  const recommendation = adaptive?.recommendations?.[0]
  const reviewDraft = createAdaptiveReviewDraft(recommendation, adaptive)
  const summary = adaptive?.summary

  return (
    <section
      className={`rounded-2xl border p-4 ${
        toneClasses[summary?.tone] || toneClasses.ready
      }`}
      aria-label="Adaptive review foundation"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Adaptive review
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            {summary?.title || "Ready to personalize"}
          </h2>
        </div>
        {adaptive?.performanceTrend?.confidenceLabel && (
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {adaptive.performanceTrend.confidenceLabel}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">
        {summary?.detail ||
          "The system is preparing personalized review from lesson evidence."}
      </p>

      {reviewDraft && (
        <div className="mt-4 rounded-xl border border-white/10 bg-background/35 p-3">
          <p className="text-sm font-semibold text-primary">
            {reviewDraft.title}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {reviewDraft.description}
          </p>
          {reviewDraft.focusKeys.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {reviewDraft.focusKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-accent"
                >
                  {key}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default AdaptiveReviewCard
