import { useState } from "react"

import LessonStep from "./LessonStep"
import DrillEngine from "../drills/DrillEngine"

function AssessmentStep({
  assessmentResult,
  onAssessmentResult,
  onComplete,
  step,
}) {
  const [attempt, setAttempt] = useState(1)
  const hasResult = Boolean(assessmentResult)
  const hasPassed =
    hasResult && assessmentResult.accuracy >= (step.minAccuracy || 90)

  function handleComplete(result) {
    const resultWithRetries = {
      ...result,
      retryCount: attempt - 1,
      stepType: "assessment",
    }

    onAssessmentResult(resultWithRetries)

    if (resultWithRetries.accuracy >= (step.minAccuracy || 90)) {
      onComplete(resultWithRetries)
    }
  }

  function handleRetry() {
    onAssessmentResult(null)
    setAttempt((currentAttempt) => currentAttempt + 1)
  }

  return (
    <LessonStep
      body={step.body}
      compact
      eyebrow={step.eyebrow}
      maxWidth="max-w-7xl"
      title={step.title}
    >
      <DrillEngine
        key={attempt}
        activeKeys={step.focusKeys}
        mode="assessment"
        onComplete={handleComplete}
        prompt={`Target: ${step.minAccuracy}% accuracy. This is not timed; make the movement deliberate.`}
        text={step.text}
      />

      {hasResult && (
        <div className="mx-auto mt-5 max-w-2xl rounded-2xl bg-white/[0.035] p-5 text-center">
          <p className="text-base font-semibold text-primary">
            {hasPassed ? "Assessment passed" : "One more calm pass"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {hasPassed
              ? "You can continue to the lesson finish."
              : `You reached ${assessmentResult.accuracy}% accuracy. Reset your hands and try the line once more.`}
          </p>

          {!hasPassed && (
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 h-10 rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:-translate-y-0.5 hover:bg-accent"
            >
              Retry assessment
            </button>
          )}
        </div>
      )}
    </LessonStep>
  )
}

export default AssessmentStep
