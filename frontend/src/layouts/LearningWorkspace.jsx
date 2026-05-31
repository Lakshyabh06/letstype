import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard"
import LessonIntroPanel from "../components/course/LessonIntroPanel"
import KeyboardPreview from "../components/lesson/KeyboardPreview"
import FingerGuide from "../components/finger-guide/FingerGuide"
import TransitionWrapper from "../components/motion/TransitionWrapper"
import QuickPracticeCard from "../components/practice/QuickPracticeCard"
import WorkspacePanel from "./WorkspacePanel"

function KeyList({ keys = [] }) {
  if (keys.length === 0) {
    return <span className="text-sm text-muted">Review rhythm</span>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keys.slice(0, 12).map((key) => (
        <span
          key={key}
          className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-accent/20 bg-background/50 px-2 text-xs font-semibold text-accent"
        >
          {key}
        </span>
      ))}
    </div>
  )
}

function ModuleLessonStrip({ activeLesson, module, onSelectLesson }) {
  if (!module) {
    return null
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
            Current module
          </p>
          <h2 className="mt-1 text-lg font-semibold text-primary">
            {module.title}
          </h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {module.lessons.length} steps
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
        {module.lessons.map((lesson) => {
          const isActive = lesson.id === activeLesson.id
          const isLocked = lesson.status === "locked"

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelectLesson(lesson)}
              disabled={isLocked}
              className={`min-h-20 rounded-2xl border p-3 text-left transition duration-200 ${
                isActive
                  ? "border-accent/45 bg-accent/10"
                  : isLocked
                    ? "cursor-not-allowed border-white/10 bg-white/[0.02] opacity-55"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {lesson.number}
                </span>
                <span className="text-xs font-medium text-accent-secondary">
                  {lesson.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-primary">
                {lesson.title}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function LearningWorkspace({
  activeLesson,
  activeModule,
  adaptive,
  analytics,
  gamification,
  lessons,
  onLessonComplete,
  onSelectLesson,
  practicePlan,
}) {
  const nextLesson =
    lessons[lessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1]
  const nextRecommendation =
    analytics?.recommendations?.[0] || adaptive?.recommendations?.[0]

  return (
    <WorkspacePanel className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              LetsType course workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-primary sm:text-3xl">
              {activeLesson.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              {activeLesson.goal}
            </p>

            {gamification && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {gamification.totalXP} XP
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-semibold text-muted">
                  {gamification.mastery.currentLevel.label}
                </span>
                <span className="rounded-full border border-accent-secondary/20 bg-accent-secondary/10 px-3 py-1 text-xs font-semibold text-accent-secondary">
                  {gamification.lessonStreak.current || 0} lesson streak
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {nextRecommendation ? "Smart focus" : "Next focus"}
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
            {nextRecommendation
                ? nextRecommendation.action
                : nextLesson
                  ? nextLesson.title
                  : "Course reinforcement"}
            </p>
            {nextRecommendation && (
              <p className="mt-2 text-xs leading-5 text-muted">
                {nextLesson ? `Then continue to ${nextLesson.title}.` : "Prepared for course reinforcement."}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-5 xl:p-6">
        <TransitionWrapper
          className="min-w-0"
          transitionKey={activeLesson.id}
          variant="workspace"
        >
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="min-w-0 space-y-5">
            {adaptive?.summary && (
              <section className="rounded-[24px] border border-accent-secondary/20 bg-accent-secondary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                  Learning signal
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {adaptive.summary.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {adaptive.summary.detail}
                </p>
              </section>
            )}

            <QuickPracticeCard compact practicePlan={practicePlan} />

            <LessonIntroPanel
              lesson={activeLesson}
              onLessonComplete={onLessonComplete}
            />

            <ModuleLessonStrip
              activeLesson={activeLesson}
              module={activeModule}
              onSelectLesson={onSelectLesson}
            />

            <AnalyticsDashboard
              analytics={analytics}
              practicePlan={practicePlan}
            />
          </div>

          <div className="min-w-0 space-y-5 xl:hidden 2xl:block">
            <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                  Key focus
                </p>
                <h2 className="mt-1 text-lg font-semibold text-primary">
                  Movement preview
                </h2>
              </div>

              <KeyboardPreview activeKeys={activeLesson.newKeys} compact />
              <div className="mt-4">
                <KeyList keys={activeLesson.newKeys} />
              </div>
            </section>

            <FingerGuide
              activeKeys={activeLesson.newKeys}
              compactMode
              workspaceMode
            />
          </div>
        </div>
        </TransitionWrapper>
      </div>
    </WorkspacePanel>
  )
}

export default LearningWorkspace
