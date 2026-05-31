function LessonProgress({ steps, activeStepIndex, completedStepIds }) {
  return (
    <div className="mx-auto w-full max-w-3xl" aria-label="Lesson progress">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isComplete = completedStepIds.has(step.id) || index < activeStepIndex

          return (
            <div key={step.id} className="flex min-w-0 items-center gap-2">
              <span
                data-active={isActive ? "true" : "false"}
                className={`premium-progress h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-12 bg-accent"
                    : isComplete
                      ? "w-7 bg-accent-secondary"
                      : "w-7 bg-white/14"
                }`}
              />
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {steps[activeStepIndex]?.label} - Step {activeStepIndex + 1} of{" "}
        {steps.length}
      </p>
    </div>
  )
}

export default LessonProgress
