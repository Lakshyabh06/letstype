import useSettingsManager from "../../hooks/useSettingsManager"

function MotionSettings() {
  const { settings, updateMotion } = useSettingsManager()
  const motion = settings.motion
  const intensityOptions = ["minimal", "subtle", "expressive"]

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
        Motion
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary">
        Interface movement
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={motion.transitionsEnabled}
          onClick={() =>
            updateMotion({ transitionsEnabled: !motion.transitionsEnabled })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            motion.transitionsEnabled
              ? "border-accent/35 bg-accent/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Premium transitions
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Panel, modal, keyboard, and reward motion.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={motion.respectSystemReducedMotion}
          onClick={() =>
            updateMotion({
              respectSystemReducedMotion:
                !motion.respectSystemReducedMotion,
            })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            motion.respectSystemReducedMotion
              ? "border-accent-secondary/35 bg-accent-secondary/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Respect system preference
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Reduce motion when the operating system asks for it.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={motion.reducedMotion}
          onClick={() =>
            updateMotion({
              reducedMotion: !motion.reducedMotion,
            })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            motion.reducedMotion
              ? "border-accent-secondary/35 bg-accent-secondary/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Reduced motion
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Prefer fades and short transitions across the workspace.
          </span>
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <p className="text-sm font-semibold text-primary">Motion intensity</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {intensityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateMotion({ intensity: option })}
              className={`h-10 rounded-full border px-4 text-xs font-semibold capitalize transition duration-200 ${
                motion.intensity === option
                  ? "border-accent/45 bg-accent/10 text-primary"
                  : "border-white/10 bg-white/[0.025] text-muted hover:text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MotionSettings
