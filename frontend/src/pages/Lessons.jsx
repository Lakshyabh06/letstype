import { memo, useEffect, useMemo, useState } from "react"

import AdaptiveReviewCard from "../components/adaptive/AdaptiveReviewCard"
import AdaptiveFingerPerformance from "../components/adaptive/FingerPerformance"
import SmartRecommendations from "../components/adaptive/SmartRecommendations"
import WeakKeyInsights from "../components/adaptive/WeakKeyInsights"
import LessonCompletionModal from "../components/gamification/LessonCompletionModal"
import MasteryLevelCard from "../components/gamification/MasteryLevelCard"
import StreakCard from "../components/gamification/StreakCard"
import XPBadge from "../components/gamification/XPBadge"
import AccuracyTrend from "../components/progress/AccuracyTrend"
import LessonProgress from "../components/progress/LessonProgress"
import ProgressOverview from "../components/progress/ProgressOverview"
import SessionHistory from "../components/progress/SessionHistory"
import FingerGuide from "../components/finger-guide/FingerGuide"
import KeyboardPreview from "../components/lesson/KeyboardPreview"
import AppShell from "../layouts/AppShell"
import LearningWorkspace from "../layouts/LearningWorkspace"
import SidebarNavigation from "../layouts/SidebarNavigation"
import WorkspacePanel from "../layouts/WorkspacePanel"
import courseModules, { getCourseLessons } from "../data/course"
import useAdaptiveLearning from "../hooks/useAdaptiveLearning"
import useAdaptiveTraining from "../hooks/useAdaptiveTraining"
import useAnalyticsEngine from "../hooks/useAnalyticsEngine"
import useGamification from "../hooks/useGamification"
import useProgressTracking from "../hooks/useProgressTracking"
import useSettingsManager from "../hooks/useSettingsManager"
import useStreakTracking from "../hooks/useStreakTracking"
import { rememberLastLesson } from "../utils/workspacePersistence"

function getInitialLessonId() {
  const lessons = getCourseLessons()
  const firstUnlockedLesson = lessons.find(
    (lesson) => lesson.status === "unlocked"
  )

  return firstUnlockedLesson?.id || lessons[0]?.id
}

const SecondaryLearningPanel = memo(function SecondaryLearningPanel({
  adaptive,
  activeLesson,
  averageAccuracy,
  completedCount,
  gamification,
  lessonCount,
  lessons,
  progress,
  progressPercent,
  streaks,
}) {
  return (
    <WorkspacePanel
      as="aside"
      className="flex h-full min-h-0 flex-col overflow-hidden p-4 sm:p-5"
    >
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <ProgressOverview
          averageAccuracy={averageAccuracy}
          completedCount={completedCount}
          lessonCount={lessonCount}
          progressPercent={progressPercent}
          streak={progress.streak}
        />

        <XPBadge
          recentXP={gamification.recentXP}
          totalXP={gamification.totalXP}
        />
        <MasteryLevelCard
          mastery={gamification.mastery}
          totalXP={gamification.totalXP}
        />
        <StreakCard
          compact
          lessonStreak={streaks.lessonStreak}
          practiceStreak={streaks.practiceStreak}
        />

        <AdaptiveReviewCard adaptive={adaptive} />
        <SmartRecommendations recommendations={adaptive.recommendations} />

        <LessonProgress activeLesson={activeLesson} lessons={lessons} />

        <section aria-label="Workspace guidance">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
              Guidance
            </p>
            <h2 className="mt-2 text-xl font-semibold text-primary">
              Hands and keys
            </h2>
          </div>

          <div className="space-y-3">
            <KeyboardPreview activeKeys={activeLesson.newKeys} compact />
            <FingerGuide
              activeKeys={activeLesson.newKeys}
              compactMode
              showLegend={false}
              workspaceMode
            />
          </div>
        </section>

        <div className="grid gap-3">
          <WeakKeyInsights weakKeys={adaptive.weakKeys} />
          <AdaptiveFingerPerformance weakFingers={adaptive.weakFingers} />
        </div>

        <AccuracyTrend history={progress.accuracyHistory} />
        <SessionHistory sessions={progress.sessions} />
      </div>
    </WorkspacePanel>
  )
})

function Lessons() {
  const {
    averageAccuracy,
    completedCount,
    lessonCount,
    lessons,
    modules,
    progress,
    progressPercent,
    recordLessonCompletion,
  } = useProgressTracking(courseModules)
  const adaptive = useAdaptiveLearning(progress)
  const analytics = useAnalyticsEngine(progress)
  const { practicePlan } = useAdaptiveTraining(analytics)
  const gamification = useGamification(progress)
  const streaks = useStreakTracking(progress)
  const { settings } = useSettingsManager()
  const [activeLessonId, setActiveLessonId] = useState(
    settings.workspace.lastLessonId || getInitialLessonId
  )
  const [completion, setCompletion] = useState(null)
  const activeLesson = useMemo(() => {
    const selectedLesson = lessons.find((lesson) => lesson.id === activeLessonId)
    const firstAvailableLesson =
      lessons.find((lesson) => lesson.status === "unlocked") || lessons[0]

    return selectedLesson && selectedLesson.status !== "locked"
      ? selectedLesson
      : firstAvailableLesson
  }, [activeLessonId, lessons])
  const activeModule = useMemo(
    () =>
      modules.find((module) =>
        module.lessons.some((lesson) => lesson.id === activeLesson?.id)
      ),
    [activeLesson?.id, modules]
  )

  useEffect(() => {
    if (activeLesson?.id) {
      rememberLastLesson(activeLesson.id)
    }
  }, [activeLesson?.id])

  function handleSelectLesson(lesson) {
    if (lesson.status === "locked") {
      return
    }

    setActiveLessonId(lesson.id)
  }

  function handleLessonComplete(lesson, result) {
    const lessonIndex = lessons.findIndex(
      (courseLesson) => courseLesson.id === lesson.id
    )
    const nextLesson = lessons[lessonIndex + 1]
    const completionSummary = recordLessonCompletion(lesson, result)

    setCompletion({
      lesson,
      nextLesson,
      result,
      reward: completionSummary?.reward,
      sessionRecord: completionSummary?.sessionRecord,
    })

    if (nextLesson) {
      setActiveLessonId(nextLesson.id)
    }
  }

  if (!activeLesson) {
    return null
  }

  return (
    <AppShell
      sidebar={
        <SidebarNavigation
          activeLessonId={activeLesson.id}
          completedCount={completedCount}
          gamification={gamification}
          lessonCount={lessonCount}
          modules={modules}
          onSelectLesson={handleSelectLesson}
        />
      }
      secondary={
        <SecondaryLearningPanel
          adaptive={adaptive}
          activeLesson={activeLesson}
          averageAccuracy={averageAccuracy}
          completedCount={completedCount}
          gamification={gamification}
          lessonCount={lessonCount}
          lessons={lessons}
          progress={progress}
          progressPercent={progressPercent}
          streaks={streaks}
        />
      }
    >
      <LearningWorkspace
        activeLesson={activeLesson}
        activeModule={activeModule}
        adaptive={adaptive}
        analytics={analytics}
        gamification={gamification}
        lessons={lessons}
        onLessonComplete={handleLessonComplete}
        onSelectLesson={handleSelectLesson}
        practicePlan={practicePlan}
      />

      <LessonCompletionModal
        completion={completion}
        nextLesson={completion?.nextLesson}
        onClose={() => setCompletion(null)}
        recommendation={adaptive.recommendations?.[0]}
      />
    </AppShell>
  )
}

export default Lessons
