import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"

import FocusModeOverlay from "../motion/FocusModeOverlay"
import TransitionWrapper from "../motion/TransitionWrapper"
import useFocusMode from "../../hooks/useFocusMode"
import useLessonSession from "../../hooks/useLessonSession"
import useMotionPreferences from "../../hooks/useMotionPreferences"
import useSoundEngine from "../../hooks/useSoundEngine"
import { motionVariants } from "../../utils/motionTokens"
import AssessmentStep from "./AssessmentStep"
import CompletionStep from "./CompletionStep"
import DrillStep from "./DrillStep"
import GuidanceStep from "./GuidanceStep"
import IntroStep from "./IntroStep"
import LessonNavigation from "./LessonNavigation"
import LessonProgress from "./LessonProgress"
import PracticeStep from "./PracticeStep"

function LessonSession({ lesson, onClose, onComplete }) {
  const { isFocusMode, toggleFocusMode } = useFocusMode()
  const { getTransition, shouldAnimate } = useMotionPreferences()
  const { play } = useSoundEngine()
  const {
    activeStep,
    activeStepIndex,
    assessmentResult,
    canGoBack,
    canGoNext,
    completedStepIds,
    goBack,
    goNext,
    isLastStep,
    markStepComplete,
    setAssessmentResult,
    steps,
  } = useLessonSession(lesson, {
    onComplete: (completedLesson, result) => {
      play("lessonComplete", { throttleMs: 700 })
      onComplete?.(completedLesson, result)
      onClose?.()
    },
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  if (!lesson || !activeStep) {
    return null
  }

  function renderStep() {
    if (activeStep.type === "intro") {
      return <IntroStep lesson={lesson} step={activeStep} />
    }

    if (activeStep.type === "guidance") {
      return <GuidanceStep lesson={lesson} step={activeStep} />
    }

    if (activeStep.type === "drill") {
      return (
        <DrillStep
          step={activeStep}
          onComplete={(result) => markStepComplete(activeStep.id, result)}
        />
      )
    }

    if (activeStep.type === "practice") {
      return (
        <PracticeStep
          step={activeStep}
          onComplete={(result) => markStepComplete(activeStep.id, result)}
        />
      )
    }

    if (activeStep.type === "assessment") {
      return (
        <AssessmentStep
          assessmentResult={assessmentResult}
          onAssessmentResult={setAssessmentResult}
          onComplete={(result) => markStepComplete(activeStep.id, result)}
          step={activeStep}
        />
      )
    }

    return (
      <CompletionStep
        assessmentResult={assessmentResult}
        lesson={lesson}
        step={activeStep}
      />
    )
  }

  return createPortal(
    <motion.div
      animate={shouldAnimate ? "visible" : undefined}
      className={`fixed inset-0 z-50 overflow-y-auto bg-background/92 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4 ${
        isFocusMode ? "focus-mode-active" : ""
      }`}
      exit={shouldAnimate ? "exit" : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-session-title"
      transition={getTransition("modal")}
      variants={motionVariants.modalBackdrop}
    >
      <motion.div
        animate={shouldAnimate ? "visible" : undefined}
        className="mx-auto flex min-h-full max-w-7xl flex-col rounded-[28px] bg-surface/88 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:p-5 lg:p-6"
        initial={shouldAnimate ? "hidden" : undefined}
        transition={getTransition("modal")}
        variants={motionVariants.modalPanel}
      >
        <header className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent-secondary">
              Guided lesson session
            </p>
            <h1
              id="lesson-session-title"
              className="mt-2 text-xl font-semibold text-primary sm:text-2xl"
            >
              {lesson.title}
            </h1>
          </div>

          <LessonProgress
            activeStepIndex={activeStepIndex}
            completedStepIds={completedStepIds}
            steps={steps}
          />

          <FocusModeOverlay
            isFocusMode={isFocusMode}
            onToggle={toggleFocusMode}
            size="compact"
          />
        </header>

        <TransitionWrapper
          className="focus-mode-primary flex-1"
          transitionKey={activeStep.id}
          variant="workspace"
        >
          {renderStep()}
        </TransitionWrapper>

        <div className="focus-mode-soft-dim">
          <LessonNavigation
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
            onBack={goBack}
            onClose={onClose}
            onNext={goNext}
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

export default LessonSession
