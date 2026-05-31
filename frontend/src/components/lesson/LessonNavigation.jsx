function LessonNavigation({
  activeIndex,
  slideCount,
  onPrevious,
  onNext,
  onClose,
}) {
  const isFirst = activeIndex === 0
  const isLast = activeIndex === slideCount - 1

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-full border border-white/10 px-5 text-sm font-semibold text-muted transition duration-200 hover:border-white/20 hover:text-primary"
      >
        Exit
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className={`h-11 rounded-full border px-5 text-sm font-semibold transition duration-200 ${
            isFirst
              ? "cursor-not-allowed border-white/10 text-muted/50"
              : "border-white/15 text-primary hover:border-white/30 hover:bg-white/[0.04]"
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="h-11 min-w-32 rounded-full bg-accent px-6 text-sm font-semibold text-background transition duration-200 hover:-translate-y-0.5 hover:bg-primary"
        >
          {isLast ? "Start drill" : "Next"}
        </button>
      </div>
    </div>
  )
}

export default LessonNavigation
