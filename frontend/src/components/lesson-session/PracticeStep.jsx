import LessonStep from "./LessonStep"
import DrillEngine from "../drills/DrillEngine"

function PracticeStep({ onComplete, step }) {
  return (
    <LessonStep
      body={step.body}
      compact
      eyebrow={step.eyebrow}
      maxWidth="max-w-7xl"
      title={step.title}
    >
      <DrillEngine
        activeKeys={step.focusKeys}
        mode="practice"
        onComplete={onComplete}
        prompt="Practice stays guided: older keys return, wrong presses are counted, and backspace remains off."
        text={step.text}
      />
    </LessonStep>
  )
}

export default PracticeStep
