import LessonIllustration from "./LessonIllustration"

function LessonSlide({ slide }) {
  return (
    <section className="grid min-h-[360px] items-center gap-7 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="mx-auto max-w-xl text-center lg:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-secondary">
          {slide.eyebrow}
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          {slide.title}
        </h2>

        <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
          {slide.body}
        </p>

        <div className="mt-7 space-y-3">
          {slide.details.map((detail) => (
            <div
              key={detail}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-primary"
            >
              {detail}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <LessonIllustration illustration={slide.illustration} />
      </div>
    </section>
  )
}

export default LessonSlide
