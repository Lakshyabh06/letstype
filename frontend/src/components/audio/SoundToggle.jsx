import useSoundEngine from "../../hooks/useSoundEngine"

function SoundToggle({ className = "" }) {
  const { enabled, muted, toggle } = useSoundEngine()
  const isAudible = enabled && !muted

  return (
    <button
      type="button"
      aria-label={isAudible ? "Mute sound" : "Turn sound on"}
      aria-pressed={isAudible}
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-accent/35 ${
        isAudible
          ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
          : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-primary"
      } ${className}`}
    >
      <span className="sr-only">{isAudible ? "Sound on" : "Muted"}</span>
      <span
        aria-hidden="true"
        className={`relative h-3 w-4 rounded-full border ${
          isAudible ? "border-accent" : "border-muted"
        }`}
      >
        <span
          className={`absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition duration-200 ${
            isAudible ? "translate-x-1.5 bg-accent" : "bg-muted"
          }`}
        />
      </span>
    </button>
  )
}

export default SoundToggle
