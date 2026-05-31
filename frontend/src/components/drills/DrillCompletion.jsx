function DrillCompletion({ isCompleted, result, onRestart }) {
  if (!isCompleted) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        Complete with{" "}
        <span className="font-semibold text-primary">{result.accuracy}%</span>{" "}
        accuracy across {result.totalAttempts} attempts.
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="h-10 rounded-full border border-white/10 px-4 font-semibold text-primary transition duration-200 hover:border-white/25"
      >
        Try again
      </button>
    </div>
  )
}

export default DrillCompletion
