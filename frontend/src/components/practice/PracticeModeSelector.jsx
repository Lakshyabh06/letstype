import { isTimedPracticeMode, timedOptions } from "../../utils/practiceGenerator"

function PracticeModeSelector({
  activeModeId,
  categories = [],
  customText,
  duration,
  modes = [],
  onCustomTextChange,
  onDurationChange,
  onModeChange,
}) {
  const activeModeIsTimed = isTimedPracticeMode(activeModeId)

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          Practice modes
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">
          Choose the session shape
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode) => {
          const isActive = mode.id === activeModeId

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              className={`min-h-24 rounded-2xl border p-4 text-left transition duration-200 ${
                isActive
                  ? "border-accent/45 bg-accent/10"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
              }`}
            >
              <span className="text-sm font-semibold text-primary">
                {mode.label}
              </span>
              <span className="mt-2 block text-xs leading-5 text-muted">
                {mode.description}
              </span>
            </button>
          )
        })}
      </div>

      {categories.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
              Practice categories
            </p>
            <h3 className="mt-2 text-lg font-semibold text-primary">
              Choose the typing content
            </h3>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const isActive = category.id === activeModeId

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onModeChange(category.id)}
                  className={`min-h-20 rounded-2xl border p-4 text-left transition duration-200 ${
                    isActive
                      ? "border-accent/45 bg-accent/10"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                  }`}
                >
                  <span className="text-sm font-semibold text-primary">
                    {category.label}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-muted">
                    {category.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeModeIsTimed && (
        <div className="mt-4 flex flex-wrap gap-2">
          {timedOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onDurationChange(option)}
              className={`h-9 rounded-full border px-4 text-xs font-semibold transition duration-200 ${
                duration === option
                  ? "border-accent/50 bg-accent/15 text-primary"
                  : "border-white/10 bg-white/[0.025] text-muted hover:text-primary"
              }`}
            >
              {option}s
            </button>
          ))}
        </div>
      )}

      {activeModeId === "custom" && (
        <label className="mt-4 block rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span className="text-sm font-semibold text-primary">
            Custom practice text
          </span>
          <textarea
            value={customText}
            onChange={(event) => onCustomTextChange(event.target.value)}
            placeholder="Paste a sentence, paragraph, or drill line"
            className="mt-3 min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-background/55 p-4 text-sm leading-6 text-primary outline-none transition duration-200 placeholder:text-muted focus:border-accent/45"
          />
        </label>
      )}
    </section>
  )
}

export default PracticeModeSelector
