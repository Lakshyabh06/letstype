function LessonStep({
  eyebrow,
  title,
  body,
  children,
  compact = false,
  maxWidth = "max-w-4xl",
}) {
  return (
    <section className={`mx-auto w-full ${maxWidth}`}>
      <div
        className={
          compact
            ? "mx-auto grid max-w-5xl gap-3 text-left lg:grid-cols-[0.42fr_0.58fr] lg:items-end"
            : "mx-auto max-w-2xl text-center"
        }
      >
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent-secondary">
          {eyebrow}
        </p>

        <h2
          className={`font-semibold leading-tight text-primary ${
            compact ? "text-2xl sm:text-3xl lg:mt-0" : "mt-4 text-3xl sm:text-4xl"
          }`}
        >
          {title}
        </h2>

        {body && (
          <p
            className={`text-muted ${
              compact
                ? "text-sm leading-6 lg:col-span-2"
                : "mt-5 text-base leading-8 sm:text-lg"
            }`}
          >
            {body}
          </p>
        )}
      </div>

      {children && <div className={compact ? "mt-5" : "mt-9"}>{children}</div>}
    </section>
  )
}

export default LessonStep
