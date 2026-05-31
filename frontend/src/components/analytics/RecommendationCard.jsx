const toneClasses = {
  reinforce: "border-accent/25 bg-accent/10",
  review: "border-error/25 bg-error/10",
  steady: "border-accent-secondary/25 bg-accent-secondary/10",
  strong: "border-accent-secondary/25 bg-accent-secondary/10",
}

function RecommendationCard({ recommendation }) {
  if (!recommendation) {
    return null
  }

  return (
    <article
      className={`rounded-2xl border p-4 ${
        toneClasses[recommendation.tone] || toneClasses.steady
      }`}
    >
      <p className="text-sm font-semibold text-primary">
        {recommendation.action}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        {recommendation.detail}
      </p>
    </article>
  )
}

export default RecommendationCard
