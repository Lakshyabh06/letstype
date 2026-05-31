function CompletionCard({
  wpm,
  accuracy,
  onRestart,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-surface/80 p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur sm:p-12">
      <h2 className="text-3xl sm:text-4xl font-semibold text-primary mb-8">
        Session Complete
      </h2>

      <div className="flex justify-center gap-12 sm:gap-16 mb-10">
        <div>
          <p className="text-sm text-muted mb-2">
            WPM
          </p>

          <h3 className="text-3xl font-semibold text-accent">
            {wpm}
          </h3>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">
            Accuracy
          </p>

          <h3 className="text-3xl font-semibold text-accent">
            {accuracy}%
          </h3>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-background transition duration-300 hover:-translate-y-0.5 hover:bg-accent"
      >
        Restart Test
      </button>
    </div>
  )
}

export default CompletionCard
