import { Link } from "react-router-dom"

const quickActions = [
  {
    description: "Start a balanced session.",
    id: "quick",
    label: "Quick Practice",
    modeId: "focus",
  },
  {
    description: "Use current weak-key signals.",
    id: "weak",
    label: "Resume Weak Keys",
    modeId: "review",
  },
  {
    description: "One focused run for today.",
    id: "daily",
    label: "Daily Challenge",
    modeId: "review",
  },
  {
    description: "Short rhythm reset.",
    duration: 30,
    id: "warmup",
    label: "Warmup Session",
    modeId: "accuracy",
  },
]

const challengeActions = [
  {
    description: "Thirty seconds of clean acceleration.",
    duration: 30,
    id: "sprint",
    label: "Sprint Trial",
    modeId: "sprint",
  },
  {
    description: "Strict weak-key control from the coach.",
    id: "adaptive",
    label: "Adaptive Review",
    modeId: "review",
  },
  {
    description: "Longer rhythm work with fatigue signals.",
    duration: 120,
    id: "endurance",
    label: "Endurance Run",
    modeId: "endurance",
  },
  {
    description: "Slow down and protect accuracy.",
    id: "precision",
    label: "Precision Lock",
    modeId: "precision",
  },
]

function QuickPracticeCard({
  compact = false,
  onAction,
  practicePlan,
}) {
  const actions = compact ? quickActions : [...quickActions, ...challengeActions]

  return (
    <section className="rounded-[24px] border border-accent-secondary/20 bg-accent-secondary/10 p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            Quick practice
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Daily training shortcuts
          </h2>
        </div>
        {practicePlan?.focusKeys?.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1.5">
            {practicePlan.focusKeys.slice(0, 5).map((key) => (
              <span
                key={key}
                className="flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-background/45 px-2 text-xs font-semibold text-primary"
              >
                {key}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "md:grid-cols-4"}`}>
        {actions.map((action) =>
          onAction ? (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action)}
              className="min-h-20 rounded-2xl border border-white/10 bg-background/35 p-3 text-left transition duration-200 hover:border-accent-secondary/35 hover:bg-background/55"
            >
              <span className="text-sm font-semibold text-primary">
                {action.label}
              </span>
              {!compact && (
                <span className="mt-1 block text-xs leading-5 text-muted">
                  {action.description}
                </span>
              )}
            </button>
          ) : (
            <Link
              key={action.id}
              to="/practice"
              className="min-h-20 rounded-2xl border border-white/10 bg-background/35 p-3 text-left transition duration-200 hover:border-accent-secondary/35 hover:bg-background/55"
            >
              <span className="text-sm font-semibold text-primary">
                {action.label}
              </span>
              {!compact && (
                <span className="mt-1 block text-xs leading-5 text-muted">
                  {action.description}
                </span>
              )}
            </Link>
          )
        )}
      </div>
    </section>
  )
}

export default QuickPracticeCard
