const toneClasses = {
  ready: "border-white/10 bg-background/45",
  review: "border-accent-secondary/25 bg-accent-secondary/10",
  steady: "border-accent/25 bg-accent/10",
  strong: "border-accent-secondary/30 bg-accent-secondary/10",
}

function PerformanceSummary({ indicators = [], summary }) {
  return (
    <section
      className={`rounded-2xl border p-3 ${
        toneClasses[summary?.tone] || toneClasses.ready
      }`}
      aria-label="Lesson insight summary"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{summary?.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{summary?.message}</p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {indicators.map((indicator) => (
            <span
              key={indicator.label}
              className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted"
            >
              {indicator.label}:{" "}
              <span className="text-primary">{indicator.value}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PerformanceSummary
