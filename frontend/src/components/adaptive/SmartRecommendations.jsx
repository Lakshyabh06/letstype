const toneClasses = {
  review: "border-accent/25 bg-accent/10",
  steady: "border-accent-secondary/25 bg-accent-secondary/10",
  strong: "border-accent-secondary/25 bg-accent-secondary/10",
}

function SmartRecommendations({ recommendations = [] }) {
  return (
    <section aria-label="Smart recommendations">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          Smart practice
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">
          Next reinforcement
        </h2>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
          <p className="text-sm font-medium text-primary">
            Keep building the record.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Suggestions will become more personal after a few guided lessons.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.id}
              className={`rounded-2xl border p-3 ${
                toneClasses[recommendation.tone] || toneClasses.steady
              }`}
            >
              <p className="text-sm font-semibold text-primary">
                {recommendation.action}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {recommendation.detail}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SmartRecommendations
