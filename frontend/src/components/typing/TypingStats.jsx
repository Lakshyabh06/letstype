function TypingStats({
  wpm,
  accuracy,
  timeLeft,
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
      <p>
        <span className="font-semibold text-primary">
          {wpm}
        </span>{" "}
        wpm
      </p>

      <p>
        <span className="font-semibold text-primary">
          {accuracy}%
        </span>{" "}
        accuracy
      </p>

      <p>
        <span className="font-semibold text-primary">
          {timeLeft}s
        </span>{" "}
        remaining
      </p>
    </div>
  )
}

export default TypingStats
