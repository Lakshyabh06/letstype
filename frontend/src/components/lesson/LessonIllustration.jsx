import FingerGuide from "../finger-guide/FingerGuide"
import KeyboardPreview from "./KeyboardPreview"

function PostureIllustration() {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-3">
      {[
        ["Screen", "Eyes forward"],
        ["Shoulders", "Relaxed"],
        ["Wrists", "Light and level"],
      ].map(([title, value]) => (
        <div
          key={title}
          className="rounded-[22px] border border-white/10 bg-background/50 p-5 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent-secondary/30 bg-accent-secondary/10">
            <span className="h-7 w-7 rounded-full border border-accent-secondary/70" />
          </div>
          <p className="text-sm font-semibold text-primary">{title}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{value}</p>
        </div>
      ))}
    </div>
  )
}

function LessonKeyFocus({ keys = [], label }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-background/50 p-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-secondary">
        {label}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {keys.map((key) => (
          <span
            key={key}
            className="flex h-16 min-w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent text-2xl font-semibold text-background shadow-[0_16px_42px_rgba(216,199,163,0.18)]"
          >
            {key}
          </span>
        ))}
      </div>
    </div>
  )
}

function ReadyIllustration({ keys = [], label }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-background/50 p-5">
      <KeyboardPreview activeKeys={keys} compact />

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
        <p className="text-sm font-semibold text-primary">{label}</p>
        <p className="mt-2 text-xs leading-5 text-muted">
          Accuracy creates the rhythm. Speed can arrive later.
        </p>
      </div>
    </div>
  )
}

function LessonIllustration({ illustration }) {
  if (!illustration) {
    return null
  }

  if (illustration.type === "posture") {
    return <PostureIllustration />
  }

  if (illustration.type === "fingers") {
    return <FingerGuide activeKeys={illustration.keys} />
  }

  if (illustration.type === "keyboard") {
    return <KeyboardPreview activeKeys={illustration.keys} />
  }

  if (illustration.type === "ready") {
    return (
      <ReadyIllustration keys={illustration.keys} label={illustration.label} />
    )
  }

  return <LessonKeyFocus keys={illustration.keys} label={illustration.label} />
}

export default LessonIllustration
