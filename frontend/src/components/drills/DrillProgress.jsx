function DrillProgress({ accuracy, currentIndex, progress, textLength }) {
  return (
    <div className="space-y-3" aria-label="Drill progress">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="premium-progress h-full rounded-full bg-accent transition-all duration-300"
          data-active={progress > 0 && progress < 100 ? "true" : "false"}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-muted">
        <span>
          {currentIndex} / {textLength}
        </span>
        <span>{accuracy}% accuracy</span>
      </div>
    </div>
  )
}

export default DrillProgress
