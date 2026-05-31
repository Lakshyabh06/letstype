import AudioSettings from "./AudioSettings"
import MotionSettings from "./MotionSettings"
import WorkspaceSettings from "./WorkspaceSettings"
import useSettingsManager from "../../hooks/useSettingsManager"

function SettingsPanel() {
  const { resetSettings, settings } = useSettingsManager()

  return (
    <div className="px-3 pb-8 sm:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[var(--workspace-max,1400px)] gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 rounded-[28px] border border-white/10 bg-surface/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:p-6">
          <header className="border-b border-white/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary">
              LetsType preferences
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Local settings for typing audio, motion, keyboard scale,
              focus, compact layouts, and workspace memory.
            </p>
          </header>

          <div className="mt-5 space-y-4">
            <AudioSettings />
            <MotionSettings />
            <WorkspaceSettings />
          </div>
        </main>

        <aside className="min-w-0 space-y-4">
          <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
              Persistence
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <p>
                Sound, focus mode, motion, practice defaults, lesson position,
                and session restoration are saved on this device.
              </p>
              <p>
                Current theme:{" "}
                <span className="font-semibold text-primary">
                  {settings.theme.id}
                </span>
              </p>
            </div>
          </section>

          <button
            type="button"
            onClick={resetSettings}
            className="h-11 w-full rounded-full border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-muted transition duration-200 hover:border-white/20 hover:text-primary"
          >
            Reset preferences
          </button>
        </aside>
      </div>
    </div>
  )
}

export default SettingsPanel
