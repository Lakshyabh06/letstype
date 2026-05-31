import LessonCard from "./LessonCard"

function LessonSection({ module, activeLessonId, onSelectLesson }) {
  return (
    <section className="border-b border-white/10 pb-9 last:border-b-0 last:pb-0">
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-accent-secondary">
          {module.eyebrow}
        </p>

        <h2 className="text-2xl font-semibold text-primary">
          {module.title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {module.description}
        </p>
      </div>

      <div className="space-y-3">
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isActive={lesson.id === activeLessonId}
            onSelectLesson={onSelectLesson}
          />
        ))}
      </div>
    </section>
  )
}

export default LessonSection
