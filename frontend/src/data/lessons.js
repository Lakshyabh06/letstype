import { getCourseLessons } from "./course"

const lessons = getCourseLessons().map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.focus,
  keys: lesson.newKeys.length > 0 ? lesson.newKeys : lesson.reinforcementKeys,
  difficulty: lesson.difficulty,
  duration: lesson.durationSeconds,
  lessonText: lesson.lessonText,
  unlocked: lesson.status !== "locked",
  newKeys: lesson.newKeys,
  reviewKeys: lesson.reviewKeys,
  cumulativeKeys: lesson.cumulativeKeys,
  practiceSequences: lesson.practiceSequences,
}))

export default lessons
