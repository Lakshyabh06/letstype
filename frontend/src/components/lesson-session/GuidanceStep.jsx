import FingerGuide from "../finger-guide/FingerGuide"
import KeyboardPreview from "../lesson/KeyboardPreview"
import LessonStep from "./LessonStep"

function GuidanceStep({ lesson, step }) {
  const guidanceItems = [
    {
      title: "Find home first",
      body: "Let the anchors orient both hands before every pattern begins.",
    },
    {
      title: "Move one finger",
      body: "Reach only for the key you need, then return to a quiet home position.",
    },
    {
      title: "Protect accuracy",
      body: "Slow typing with clean resets teaches more than rushed corrections.",
    },
  ]

  return (
    <LessonStep eyebrow={step.eyebrow} title={step.title} body={step.body}>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          {guidanceItems.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white/[0.035] p-5">
              <p className="text-base font-semibold text-primary">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <KeyboardPreview activeKeys={step.focusKeys} compact />
          <FingerGuide activeKeys={step.focusKeys} />
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-7 text-muted">
        {lesson.practiceSequences?.warmup?.[0] ||
          "Begin with a small pattern, then let review keys appear naturally."}
      </p>
    </LessonStep>
  )
}

export default GuidanceStep
