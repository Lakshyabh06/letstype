import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

import { getLessonIntroSlides } from "../../data/lessonIntroSlides"
import LessonNavigation from "./LessonNavigation"
import LessonSlide from "./LessonSlide"
import LessonStepper from "./LessonStepper"

function LessonViewer({ lesson, onClose }) {
  const slides = useMemo(() => getLessonIntroSlides(lesson), [lesson])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  if (!lesson || slides.length === 0) {
    return null
  }

  const goPrevious = () => {
    setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
  }

  const goNext = () => {
    if (activeIndex === slides.length - 1) {
      onClose()
      return
    }

    setActiveIndex((currentIndex) =>
      Math.min(currentIndex + 1, slides.length - 1)
    )
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-background/88 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-viewer-title"
    >
      <div className="mx-auto flex h-full max-w-6xl items-start justify-center">
        <div className="max-h-full w-full overflow-y-auto rounded-[32px] border border-white/10 bg-surface/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent-secondary">
                Interactive intro
              </p>
              <h1
                id="lesson-viewer-title"
                className="mt-2 text-xl font-semibold text-primary sm:text-2xl"
              >
                {lesson.title}
              </h1>
            </div>

            <LessonStepper slides={slides} activeIndex={activeIndex} />
          </div>

          <div
            key={slides[activeIndex].id}
            className="animate-[lessonFade_260ms_ease-out]"
          >
            <LessonSlide slide={slides[activeIndex]} />
          </div>

          <LessonNavigation
            activeIndex={activeIndex}
            slideCount={slides.length}
            onPrevious={goPrevious}
            onNext={goNext}
            onClose={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default LessonViewer
