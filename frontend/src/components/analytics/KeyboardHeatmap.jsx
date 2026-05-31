import fullKeyboardLayout, { getKeyTokens } from "../../data/keyboardLayout"

function getHeatStyle(keyStats) {
  const weakness = keyStats?.weakness || 0
  const mastery = keyStats?.mastery || 0
  const opacity = Math.min(0.34, 0.06 + weakness / 280)

  if (!keyStats?.attempts) {
    return {
      background: "rgba(255,255,255,0.035)",
      borderColor: "rgba(255,255,255,0.10)",
      color: "var(--color-muted)",
    }
  }

  if (weakness > 0) {
    return {
      background: `rgba(224,131,104,${opacity})`,
      borderColor: `rgba(224,131,104,${Math.min(0.55, opacity + 0.16)})`,
      color: "var(--color-primary)",
    }
  }

  return {
    background: `rgba(143,184,170,${Math.min(0.24, 0.08 + mastery / 420)})`,
    borderColor: "rgba(143,184,170,0.24)",
    color: "var(--color-primary)",
  }
}

function KeyboardHeatmap({ keyboardStats = [], layout = fullKeyboardLayout }) {
  const statsByToken = new Map(
    keyboardStats.flatMap((keyStats) =>
      getKeyTokens(keyStats).map((token) => [token, keyStats])
    )
  )

  return (
    <section
      className="rounded-2xl border border-white/10 bg-background/45 p-4"
      aria-label="Keyboard heatmap"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Keyboard heatmap
          </p>
          <h3 className="mt-2 text-base font-semibold text-primary">
            Mastery and weak keys
          </h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
          Calm view
        </span>
      </div>

      <div className="mt-4 min-w-0 overflow-x-auto pb-1">
        <div className="mx-auto flex w-full min-w-[560px] max-w-4xl flex-col gap-1.5 sm:min-w-[640px]">
          {layout.map((row) => (
            <div key={row.id} className="flex gap-1.5" aria-label={row.label}>
              {row.keys.map((keyData) => {
                const tokens = getKeyTokens(keyData)
                const keyStats = tokens
                  .map((token) => statsByToken.get(token))
                  .find(Boolean)

                return (
                  <div
                    key={keyData.id}
                    className="relative flex h-8 shrink-0 items-center justify-center rounded-lg border px-1 text-[0.62rem] font-semibold transition duration-200"
                    style={{
                      ...getHeatStyle(keyStats),
                      flex: `${keyData.size} ${keyData.size} 0`,
                    }}
                    title={
                      keyStats?.attempts
                        ? `${keyData.label}: ${keyStats.mastery}% mastery, ${keyStats.weakness}% review signal`
                        : `${keyData.label}: waiting for data`
                    }
                  >
                    {keyData.label}
                    {keyStats?.weakness > 0 && (
                      <span
                        className="absolute bottom-1 h-0.5 rounded-full bg-error/70"
                        style={{
                          width: `${Math.max(18, Math.min(72, keyStats.weakness))}%`,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default KeyboardHeatmap
