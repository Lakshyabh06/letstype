function CompletionCard({
  wpm,
  accuracy,
  onRestart,
}) {
  return (
    <div className="bg-surface rounded-[32px] p-14 text-center border border-white/5 shadow-2xl">
      <h2 className="text-5xl font-bold text-accent mb-8">
        Session Complete
      </h2>

      <div className="flex justify-center gap-20 mb-10">
        <div>
          <p className="text-muted mb-2">
            WPM
          </p>

          <h3 className="text-4xl font-bold text-primary">
            {wpm}
          </h3>
        </div>

        <div>
          <p className="text-muted mb-2">
            Accuracy
          </p>

          <h3 className="text-4xl font-bold text-primary">
            {accuracy}%
          </h3>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-8 py-4 rounded-2xl bg-accent text-black text-xl font-semibold hover:scale-105 transition"
      >
        Restart Test
      </button>
    </div>
  )
}

export default CompletionCard
