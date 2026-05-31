function LessonNavigation({
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onClose,
  onNext,
}) {
  return (
    <nav className="mx-auto mt-5 flex w-full max-w-5xl flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-full border border-white/10 px-5 text-sm font-semibold text-muted transition duration-200 hover:border-white/20 hover:text-primary"
      >
        Exit
      </button>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className={`h-11 rounded-full border px-5 text-sm font-semibold transition duration-200 ${
            canGoBack
              ? "border-white/15 text-primary hover:border-white/30 hover:bg-white/[0.04]"
              : "cursor-not-allowed border-white/10 text-muted/45"
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`h-11 min-w-36 rounded-full px-6 text-sm font-semibold transition duration-200 ${
            canGoNext
              ? "bg-accent text-background hover:-translate-y-0.5 hover:bg-primary"
              : "cursor-not-allowed bg-white/[0.06] text-muted"
          }`}
        >
          {isLastStep ? "Finish lesson" : "Continue"}
        </button>
      </div>
    </nav>
  )
}

export default LessonNavigation
