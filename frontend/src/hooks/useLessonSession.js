import { useMemo, useState } from "react"

import { summarizeLessonResults } from "../utils/typingAnalysis"

function firstAvailableSequence(lesson, names) {
  const practiceSequences = lesson?.practiceSequences || {}

  return (
    names
      .flatMap((name) => practiceSequences[name] || [])
      .find(Boolean) || lesson?.lessonText || ""
  )
}

function getFocusKeys(lesson) {
  if (!lesson) {
    return []
  }

  if (lesson.newKeys?.length > 0) {
    return lesson.newKeys
  }

  if (lesson.reinforcementKeys?.length > 0) {
    return lesson.reinforcementKeys.slice(-10)
  }

  return lesson.cumulativeKeys?.slice(-10) || []
}

export function buildLessonSessionSteps(lesson) {
  const focusKeys = getFocusKeys(lesson)
  const warmupText = firstAvailableSequence(lesson, ["warmup", "focus"])
  const practiceText = firstAvailableSequence(lesson, [
    "focus",
    "reinforcement",
    "challenge",
  ])
  const assessmentText = firstAvailableSequence(lesson, [
    "assessment",
    "challenge",
    "focus",
  ])

  return [
    {
      id: "intro",
      type: "intro",
      eyebrow: lesson?.number ? `Lesson ${lesson.number}` : "Lesson",
      label: "Intro",
      title: lesson?.title || "Lesson",
      body: lesson?.goal || "Start with a calm setup and a clear focus.",
      focusKeys,
    },
    {
      id: "guidance",
      type: "guidance",
      eyebrow: "Guidance",
      label: "Guidance",
      title: "Understand the movement before speed",
      body:
        lesson?.focus ||
        "Use the right finger, return home, and keep the hands quiet.",
      focusKeys,
    },
    {
      id: "drill",
      type: "drill",
      eyebrow: "Interactive drill",
      label: "Drill",
      title: "Trace the pattern slowly",
      body: "Follow the highlighted keys and let accuracy set the pace.",
      focusKeys,
      text: warmupText,
      requiresCompletion: true,
    },
    {
      id: "practice",
      type: "practice",
      eyebrow: "Practice",
      label: "Practice",
      title: "Blend the lesson into rhythm",
      body: "Keep the motion light as review keys return around the new work.",
      focusKeys,
      text: practiceText,
      requiresCompletion: true,
    },
    {
      id: "assessment",
      type: "assessment",
      eyebrow: "Mini assessment",
      label: "Check",
      title: "Show one clean pass",
      body: "Type the line with control. A steady accurate pass unlocks the finish.",
      focusKeys,
      text: assessmentText,
      minAccuracy: 90,
      requiresCompletion: true,
    },
    {
      id: "completion",
      type: "completion",
      eyebrow: "Complete",
      label: "Done",
      title: "Lesson complete",
      body: "The skill is now part of your review pool.",
      focusKeys,
    },
  ]
}

function useLessonSession(lesson, { onComplete } = {}) {
  const steps = useMemo(() => buildLessonSessionSteps(lesson), [lesson])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [completedStepIds, setCompletedStepIds] = useState(() => new Set())
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [isLessonCompleted, setIsLessonCompleted] = useState(false)
  const [stepResults, setStepResults] = useState({})

  const activeStep = steps[activeStepIndex]
  const isFirstStep = activeStepIndex === 0
  const isLastStep = activeStepIndex === steps.length - 1
  const isCurrentStepComplete = completedStepIds.has(activeStep?.id)
  const canGoNext = !activeStep?.requiresCompletion || isCurrentStepComplete

  function markStepComplete(stepId = activeStep?.id, result = null) {
    if (!stepId) {
      return
    }

    if (result) {
      setStepResults((currentResults) => ({
        ...currentResults,
        [stepId]: result,
      }))
    }

    setCompletedStepIds((currentStepIds) => {
      const nextStepIds = new Set(currentStepIds)
      nextStepIds.add(stepId)
      return nextStepIds
    })
  }

  function goBack() {
    setActiveStepIndex((currentIndex) => Math.max(currentIndex - 1, 0))
  }

  function completeLesson() {
    if (isLessonCompleted) {
      return
    }

    setIsLessonCompleted(true)
    onComplete?.(lesson, summarizeLessonResults(stepResults, assessmentResult))
  }

  function goNext() {
    if (!canGoNext) {
      return
    }

    if (isLastStep) {
      completeLesson()
      return
    }

    setActiveStepIndex((currentIndex) =>
      Math.min(currentIndex + 1, steps.length - 1)
    )
  }

  function resetLessonSession() {
    setActiveStepIndex(0)
    setCompletedStepIds(new Set())
    setAssessmentResult(null)
    setIsLessonCompleted(false)
    setStepResults({})
  }

  return {
    steps,
    activeStep,
    activeStepIndex,
    assessmentResult,
    canGoBack: !isFirstStep,
    canGoNext,
    completedStepIds,
    goBack,
    goNext,
    isLessonCompleted,
    isLastStep,
    markStepComplete,
    resetLessonSession,
    setAssessmentResult,
    stepResults,
  }
}

export default useLessonSession
