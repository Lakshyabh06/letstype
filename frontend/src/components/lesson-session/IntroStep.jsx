import LessonIllustration from "../lesson/LessonIllustration"
import LessonStep from "./LessonStep"

function IntroStep({ lesson, step }) {
  return (
    <LessonStep eyebrow={step.eyebrow} title={step.title} body={step.body}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3 text-left">
          {[
            ["Focus", lesson.focus],
            ["Finger focus", lesson.fingers],
            [
              "New keys",
              lesson.newKeys.length > 0
                ? lesson.newKeys.join(" ")
                : "Review and rhythm",
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/[0.035] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-primary">{value}</p>
            </div>
          ))}
        </div>

        <LessonIllustration
          illustration={{
            type: "lesson",
            keys: step.focusKeys,
            label: lesson.category,
          }}
        />
      </div>
    </LessonStep>
  )
}

export default IntroStep
