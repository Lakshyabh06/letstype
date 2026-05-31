function DrillFeedback({ feedback, isCompleted, isStrict }) {
  const message = isCompleted
    ? "Clean pass complete. You can continue when you are ready."
    : feedback?.message ||
      (isStrict
        ? "Type the highlighted key. Incorrect keys will not move the cursor."
        : "Keep the rhythm controlled and correct mistakes deliberately.")

  return (
    <div
      aria-live="polite"
      className={`min-h-12 rounded-2xl border px-4 py-3 text-center text-sm leading-6 transition duration-200 ${
        feedback?.tone === "error"
          ? "border-error/35 bg-error/10 text-primary"
          : isCompleted
            ? "border-accent-secondary/35 bg-accent-secondary/10 text-primary"
            : "border-white/10 bg-background/45 text-muted"
      }`}
    >
      {message}
    </div>
  )
}

export default DrillFeedback
