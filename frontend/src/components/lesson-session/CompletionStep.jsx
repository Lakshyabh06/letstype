import KeyboardPreview from "../lesson/KeyboardPreview"
import LessonStep from "./LessonStep"

function CompletionStep({ assessmentResult, lesson, step }) {
  return (
    <LessonStep eyebrow={step.eyebrow} title={step.title} body={step.body}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/[0.035] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Learned focus
            </p>
            <p className="mt-2 text-base font-semibold text-primary">
              {lesson.goal}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.035] p-5 text-center">
              <p className="text-sm text-muted">Accuracy</p>
              <p className="mt-2 text-3xl font-semibold text-accent">
                {assessmentResult?.accuracy ?? 100}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.035] p-5 text-center">
              <p className="text-sm text-muted">Review pool</p>
              <p className="mt-2 text-3xl font-semibold text-accent">
                {lesson.cumulativeKeys.length}
              </p>
            </div>
          </div>

          <p className="rounded-2xl bg-accent-secondary/10 p-5 text-sm leading-7 text-primary">
            The next lesson can now build on this skill while these keys stay in
            reinforcement.
          </p>
        </div>

        <KeyboardPreview activeKeys={step.focusKeys} />
      </div>
    </LessonStep>
  )
}

export default CompletionStep
