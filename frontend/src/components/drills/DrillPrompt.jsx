function getTargetLabel(expectedKey) {
  if (expectedKey === " ") {
    return "Space"
  }

  return expectedKey || "Complete"
}

function DrillPrompt({ expectedKey, mode, prompt }) {
  const modeLabel = {
    assessment: "Assessment mode",
    freeTyping: "Free typing",
    practice: "Guided practice",
    strict: "Strict learning",
  }[mode]

  return (
    <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-secondary">
          {modeLabel}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {prompt}
        </p>
      </div>

      <div className="mx-auto flex h-16 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 sm:mx-0">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
          Next key
        </span>
        <span className="mt-1 text-xl font-semibold text-primary">
          {getTargetLabel(expectedKey)}
        </span>
      </div>
    </div>
  )
}

export default DrillPrompt
