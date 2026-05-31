import LessonStep from "./LessonStep"
import DrillEngine from "../drills/DrillEngine"

function DrillStep({ onComplete, step }) {
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
        mode="strict"
        onComplete={onComplete}
        prompt="This is strict guided learning. The cursor only moves when the highlighted key is pressed correctly."
        text={step.text}
      />
    </LessonStep>
  )
}

export default DrillStep
