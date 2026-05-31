import useSoundEngine from "../../hooks/useSoundEngine"

function VolumeSlider({ value, onChange }) {
  const displayValue = Math.round(value * 100)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Volume</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            0-100 output with normalized, low-latency playback.
          </p>
        </div>
        <span className="w-12 text-right text-sm font-semibold text-primary">
          {displayValue}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={displayValue}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
        className="mt-4 w-full accent-[var(--color-accent)]"
        aria-label="Volume"
      />
    </div>
  )
}

function AudioSettings() {
  const {
    enabled,
    masterVolume,
    muted,
    play,
    setMasterVolume,
    setMuted,
    setTheme,
    soundThemes,
    themeId,
    volume,
  } = useSoundEngine()
  const themes = Object.values(soundThemes)
  const resolvedMasterVolume = masterVolume ?? volume ?? 1
  const activeThemeId = soundThemes[themeId] ? themeId : "mechanical"
  const isMuted = muted || !enabled

  function testSound() {
    play("correct", { throttleMs: 0 })
    window.setTimeout(() => play("wrong", { throttleMs: 0 }), 140)
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            Audio
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Premium sound feedback
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Realistic key sounds, normalized output, and distinct incorrect-key
            feedback for focused typing.
          </p>
        </div>

        <button
          type="button"
          aria-pressed={!isMuted}
          onClick={() => setMuted(!isMuted)}
          className={`h-10 rounded-full border px-4 text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-accent/35 ${
            !isMuted
              ? "border-accent/35 bg-accent/10 text-accent"
              : "border-white/10 bg-white/[0.03] text-muted"
          }`}
        >
          {!isMuted ? "Sound on" : "Muted"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <p className="text-sm font-semibold text-primary">Sound Profile</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                className={`min-h-11 rounded-2xl border px-4 text-left text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-accent/35 ${
                  activeThemeId === theme.id
                    ? "border-accent/45 bg-accent/10 text-primary"
                    : "border-white/10 bg-white/[0.025] text-muted hover:text-primary"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <VolumeSlider
            value={resolvedMasterVolume}
            onChange={setMasterVolume}
          />

          <button
            type="button"
            onClick={testSound}
            className="h-11 w-full rounded-full border border-accent/30 bg-accent/10 px-4 text-sm font-semibold text-accent outline-none transition duration-200 hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-accent/35"
          >
            Test Sound
          </button>
        </div>
      </div>
    </section>
  )
}

export default AudioSettings
