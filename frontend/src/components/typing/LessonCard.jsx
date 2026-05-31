function LessonCard({ lesson }) {
  return (
    <div className="group bg-surface rounded-[32px] p-8 border border-white/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-accent mb-3">
            {lesson.difficulty}
          </p>

          <h2 className="text-3xl font-bold text-primary leading-snug">
            {lesson.title}
          </h2>
        </div>

        <div className="bg-[#11151C] px-4 py-2 rounded-2xl text-muted text-sm">
          {lesson.duration}s
        </div>
      </div>

      <p className="text-muted text-lg leading-relaxed mb-8">
        {lesson.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        {lesson.keys.map((key) => (
          <div
            key={key}
            className="w-12 h-12 rounded-2xl bg-[#11151C] border border-white/5 flex items-center justify-center text-accent text-lg font-bold shadow-lg"
          >
            {key}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-sm mb-1">
            Lesson Status
          </p>

          <p
            className={`font-semibold ${
              lesson.unlocked
                ? "text-green-400"
                : "text-gray-500"
            }`}
          >
            {lesson.unlocked
              ? "Ready to Start"
              : "Locked"}
          </p>
        </div>

        <button
          disabled={!lesson.unlocked}
          className={`px-7 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
            lesson.unlocked
              ? "bg-accent text-black hover:scale-105 hover:shadow-xl"
              : "bg-[#222834] text-gray-500 cursor-not-allowed"
          }`}
        >
          {lesson.unlocked
            ? "Start Lesson"
            : "Locked"}
        </button>
      </div>
    </div>
  )
}

export default LessonCard
