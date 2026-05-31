const toneClasses = {
  reinforce: "border-accent/25 bg-accent/10 text-accent",
  review: "border-error/30 bg-error/10 text-error",
  steady: "border-accent-secondary/25 bg-accent-secondary/10 text-accent-secondary",
  strong: "border-accent/30 bg-accent/10 text-primary",
}

function ConfidenceBadge({ label = "Forming", score, tone = "steady" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        toneClasses[tone] || toneClasses.steady
      }`}
    >
      {label}
      {Number.isFinite(score) && (
        <span className="text-[0.68rem] font-medium text-muted">{score}</span>
      )}
    </span>
  )
}

export default ConfidenceBadge
