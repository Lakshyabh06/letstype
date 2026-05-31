function LessonStepper({ slides, activeIndex }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          const isComplete = index < activeIndex

          return (
            <span
              key={slide.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-10 bg-accent"
                  : isComplete
                    ? "w-5 bg-accent-secondary"
                    : "w-5 bg-white/15"
              }`}
            />
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Step {activeIndex + 1} of {slides.length}
      </p>
    </div>
  )
}

export default LessonStepper
