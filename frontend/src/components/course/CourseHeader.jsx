function CourseHeader({ completedCount, lessonCount }) {
  return (
    <header className="grid gap-8 border-b border-white/10 pb-9 lg:grid-cols-[1fr_280px] lg:items-end">
      <div>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-accent-secondary">
          Beginner course
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-primary sm:text-5xl">
          Learn touch typing through a guided progression.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Follow short lessons that introduce lowercase first, reinforce old
          keys continuously, then add Shift, capitals, punctuation, numbers,
          symbols, and advanced mixed drills.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm text-muted">Course progress</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-secondary"
            style={{ width: `${(completedCount / lessonCount) * 100}%` }}
          />
        </div>

        <p className="mt-4 text-sm font-medium text-primary">
          {completedCount} of {lessonCount} lessons complete
        </p>
      </div>
    </header>
  )
}

export default CourseHeader
