import useSettingsManager from "../../hooks/useSettingsManager"

function WorkspaceSettings() {
  const { settings, updateKeyboard, updatePractice, updateTheme, updateWorkspace } =
    useSettingsManager()

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
        Workspace
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary">
        Software preferences
      </h2>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <button
          type="button"
          aria-pressed={settings.workspace.focusMode}
          onClick={() =>
            updateWorkspace({ focusMode: !settings.workspace.focusMode })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.workspace.focusMode
              ? "border-accent/35 bg-accent/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Remember focus mode
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Restore the calmer practice workspace between visits.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.workspace.compactMode}
          onClick={() =>
            updateWorkspace({ compactMode: !settings.workspace.compactMode })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.workspace.compactMode
              ? "border-accent/35 bg-accent/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Compact workspace
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Tighten panels and reduce empty space on larger displays.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.keyboard.compactMode}
          onClick={() =>
            updateKeyboard({ compactMode: !settings.keyboard.compactMode })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.keyboard.compactMode
              ? "border-white/20 bg-white/[0.045]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Compact keyboard
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Scale visual keyboards down for dense lesson work.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.practice.restoreSession}
          onClick={() =>
            updatePractice({
              restoreSession: !settings.practice.restoreSession,
            })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.practice.restoreSession
              ? "border-accent-secondary/35 bg-accent-secondary/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Restore practice drafts
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Keep unfinished practice sessions ready to continue.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.keyboard.showFingerHints}
          onClick={() =>
            updateKeyboard({
              showFingerHints: !settings.keyboard.showFingerHints,
            })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.keyboard.showFingerHints
              ? "border-white/20 bg-white/[0.045]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Finger guidance
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Keep keyboard visualization ready for future preference wiring.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.keyboard.showKeyboardGlow}
          onClick={() =>
            updateKeyboard({
              showKeyboardGlow: !settings.keyboard.showKeyboardGlow,
            })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.keyboard.showKeyboardGlow
              ? "border-white/20 bg-white/[0.045]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Keyboard glow
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Keep active key feedback polished without changing lesson logic.
          </span>
        </button>

        <button
          type="button"
          aria-pressed={settings.theme.futureLightTheme}
          onClick={() =>
            updateTheme({ futureLightTheme: !settings.theme.futureLightTheme })
          }
          className={`rounded-2xl border p-4 text-left transition duration-200 ${
            settings.theme.futureLightTheme
              ? "border-accent/35 bg-accent/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-sm font-semibold text-primary">
            Light theme foundation
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Store the preference now while the dark theme remains active.
          </span>
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span className="text-sm font-semibold text-primary">
            Keyboard size
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Adjust visual keyboard scale without changing key mapping.
          </span>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min="0.86"
              max="1.12"
              step="0.01"
              value={settings.keyboard.sizeScale}
              onChange={(event) =>
                updateKeyboard({ sizeScale: Number(event.target.value) })
              }
              className="min-w-0 flex-1 accent-[var(--color-accent)]"
            />
            <span className="w-12 text-right text-sm font-semibold text-primary">
              {Math.round(settings.keyboard.sizeScale * 100)}%
            </span>
          </div>
        </label>

        <label className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span className="text-sm font-semibold text-primary">
            Color intensity
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Tune accent strength while keeping the dark theme intact.
          </span>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min="0.45"
              max="1"
              step="0.01"
              value={settings.theme.colorIntensity}
              onChange={(event) =>
                updateTheme({ colorIntensity: Number(event.target.value) })
              }
              className="min-w-0 flex-1 accent-[var(--color-accent)]"
            />
            <span className="w-12 text-right text-sm font-semibold text-primary">
              {Math.round(settings.theme.colorIntensity * 100)}%
            </span>
          </div>
        </label>
      </div>
    </section>
  )
}

export default WorkspaceSettings
