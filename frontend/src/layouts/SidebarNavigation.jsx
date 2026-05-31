import BrandLogo from "../components/brand/BrandLogo"
import ProgressRail from "../components/course/ProgressRail"
import WorkspacePanel from "./WorkspacePanel"

function SidebarNavigation({
  completedCount,
  gamification,
  lessonCount,
  modules,
  activeLessonId,
  onSelectLesson,
}) {
  return (
    <WorkspacePanel
      as="aside"
      className="flex h-full min-h-0 flex-col overflow-hidden p-4 sm:p-5"
    >
      <div className="border-b border-white/10 pb-4">
        <BrandLogo className="max-w-[150px] overflow-hidden" size="sm" />
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
          Course map
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Follow the guided sequence and keep earlier keys in reinforcement.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-background/45 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Complete
          </span>
          <span className="text-sm font-semibold text-primary">
            {completedCount}/{lessonCount}
          </span>
        </div>

        {gamification && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-accent/20 bg-accent/10 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                XP
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {gamification.totalXP}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/45 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Level
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-primary">
                {gamification.mastery.currentLevel.label}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <ProgressRail
          modules={modules}
          activeLessonId={activeLessonId}
          onSelectLesson={onSelectLesson}
        />
      </div>
    </WorkspacePanel>
  )
}

export default SidebarNavigation
