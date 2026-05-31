import ProgressRail from "./ProgressRail"

function CourseSidebar({
  modules,
  activeLessonId,
  completedCount,
  lessonCount,
  onSelectLesson,
}) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-[28px] border border-white/10 bg-surface/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur">
        <div className="mb-6 border-b border-white/10 pb-5">
          <p className="text-sm font-medium text-primary">Course map</p>

          <p className="mt-2 text-sm leading-6 text-muted">
            Each step adds a small skill while previous keys stay in review.
          </p>

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-accent-secondary">
            {completedCount}/{lessonCount} complete
          </p>
        </div>

        <ProgressRail
          modules={modules}
          activeLessonId={activeLessonId}
          onSelectLesson={onSelectLesson}
        />
      </div>
    </aside>
  )
}

export default CourseSidebar
