import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import BrandLogo from "../components/brand/BrandLogo"
import courseModules from "../data/course"

const showcaseText = "calm hands build accurate rhythm"
const showcaseKeys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

const features = [
  ["Guided lessons", "Follow a deliberate path from home row to symbols."],
  ["Strict learning mode", "Wrong keys give feedback without advancing."],
  ["Finger tracking", "Active-key guidance keeps muscle memory visible."],
  ["Smart review", "Weak keys return automatically in reinforcement drills."],
  ["Progress analytics", "See WPM, accuracy, streaks, XP, and consistency."],
  ["Sound feedback", "Tactile typing cues stay limited to training moments."],
  ["Typing games", "Practice modes add variety without breaking strict accuracy."],
  ["Adaptive drills", "Sessions respond to the patterns in your practice."],
]

const keyBenefits = [
  ["Guided path", "Lessons introduce one skill at a time, then bring it back until it sticks."],
  ["Real-time coach", "Mistakes, weak keys, and rhythm shifts turn into practical next steps."],
  ["Strict accuracy", "Incorrect keys are noticed immediately, so speed grows from control."],
]

const growthStats = [
  ["Accuracy", "+18%", "from steadier first-pass control"],
  ["Muscle memory", "4x", "more review touches per key family"],
  ["Speed growth", "+22 WPM", "through rhythm before raw pace"],
  ["Session tracking", "100%", "local progress continuity"],
]

const journeySteps = [
  ["01", "Anchor", "Start with home-row control and clear finger positions."],
  ["02", "Expand", "Add reaches, punctuation, numbers, and realistic passages."],
  ["03", "Review", "Use weak-key signals and practice sessions to close gaps."],
  ["04", "Grow", "Track XP, streaks, accuracy, WPM, and consistency over time."],
]

function AnimatedMetric({ label, value }) {
  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </motion.div>
  )
}

function KeyboardShowcase({ activeCharacter }) {
  const activeKey = activeCharacter?.toUpperCase()

  return (
    <div className="rounded-[24px] border border-white/10 bg-background/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        {showcaseKeys.map((row, rowIndex) => (
          <div
            key={row.join("")}
            className="flex justify-center gap-1.5 sm:gap-2"
            style={{ paddingLeft: `${rowIndex * 4}%` }}
          >
            {row.map((key) => {
              const isActive = key === activeKey

              return (
                <span
                  key={key}
                  className={`flex h-9 min-w-8 items-center justify-center rounded-xl border px-2 text-xs font-semibold transition duration-300 sm:h-11 sm:min-w-10 sm:text-sm ${
                    isActive
                      ? "border-accent/70 bg-accent/15 text-primary shadow-[0_0_0_1px_rgba(216,199,163,0.16),0_14px_36px_rgba(216,199,163,0.2)]"
                      : "border-white/10 bg-white/[0.04] text-muted"
                  }`}
                >
                  {key}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function TypingShowcase() {
  const [index, setIndex] = useState(0)
  const activeCharacter = showcaseText[index] || ""
  const typedText = showcaseText.slice(0, index)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) =>
        current >= showcaseText.length ? 0 : current + 1
      )
    }, 115)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="showcase" className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)] xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
            Live training surface
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-primary sm:text-5xl">
            Watch rhythm, accuracy, and key guidance move together.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            LetsType keeps the active key, typed line, and feedback close, so
            practice feels focused instead of scattered.
          </p>
        </div>

        <motion.div
          className="rounded-[28px] border border-white/10 bg-surface/72 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-5"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <AnimatedMetric label="WPM" value="42" />
            <AnimatedMetric label="Accuracy" value="97%" />
            <AnimatedMetric label="Rhythm" value="Steady" />
          </div>

          <div className="mt-4 min-h-36 rounded-[24px] border border-white/10 bg-background/50 p-5 text-2xl leading-relaxed text-primary sm:text-3xl">
            <span className="text-primary">{typedText}</span>
            <span className="text-accent">{showcaseText[index]}</span>
            <span className="ml-1 inline-block h-8 w-0.5 translate-y-1 bg-accent motion-safe:animate-[caretBlink_900ms_steps(2,end)_infinite]" />
            <span className="text-muted">
              {showcaseText.slice(index + 1)}
            </span>
          </div>

          <div className="mt-4">
            <KeyboardShowcase activeCharacter={activeCharacter} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Home() {
  const roadmap = useMemo(
    () =>
      courseModules.slice(0, 6).map((module) => ({
        description: module.description,
        id: module.id,
        lessons: module.lessons.length,
        title: module.title,
      })),
    []
  )

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[calc(100svh-92px)] max-w-[1500px] gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(470px,0.88fr)] lg:items-center lg:px-10">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <BrandLogo className="mb-8 max-w-[230px] overflow-hidden" size="lg" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-secondary">
              Guided touch typing for focused people
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.02] text-primary sm:text-6xl lg:text-7xl">
              Learn touch typing faster.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Guided lessons, real-time coaching, strict accuracy training, and
              structured progression help you build calm speed without guessing
              what to practice next.
            </p>
          </motion.div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/practice"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-background transition duration-300 hover:-translate-y-0.5 hover:bg-accent"
            >
              Start practice
            </Link>
            <Link
              to="/lessons"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-sm font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:border-accent/40"
            >
              Explore lessons
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            <AnimatedMetric label="Mode" value="Strict" />
            <AnimatedMetric label="Lessons" value="Guided" />
            <AnimatedMetric label="Review" value="Adaptive" />
          </div>
        </div>

        <motion.div
          className="min-w-0 rounded-[28px] border border-white/10 bg-surface/70 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur sm:p-5"
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="rounded-[24px] border border-white/10 bg-background/45 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                  Lesson preview
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-primary">
                  Home Row Anchor Rhythm
                </h2>
              </div>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                8 min
              </span>
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.035] p-4 text-2xl leading-relaxed text-primary">
              fjfj jfjf <span className="text-accent">ffjj</span> jjff
            </div>
            <div className="mt-5">
              <KeyboardShowcase activeCharacter="f" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-3 md:grid-cols-3">
          {keyBenefits.map(([title, description]) => (
            <motion.article
              key={title}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_14px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:bg-white/[0.045]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-lg font-semibold text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <TypingShowcase />

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
            Why LetsType
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-primary sm:text-5xl">
            Built like a productivity tool, taught like a patient coach.
          </h2>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, description]) => (
            <motion.article
              key={title}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:bg-white/[0.045]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-base font-semibold text-primary">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-surface/68 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
                Guided curriculum
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-primary sm:text-5xl">
                A roadmap that adds pressure slowly.
              </h2>
            </div>
            <Link
              to="/lessons"
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-primary transition duration-300 hover:border-accent/35"
            >
              View full course
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {roadmap.map((module, index) => (
              <article
                key={module.id}
                className="rounded-[22px] border border-white/10 bg-background/40 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Stage {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-primary">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {module.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {module.lessons} lessons
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              Learning journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-primary sm:text-5xl">
              The next step is always visible.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              LetsType keeps lessons, practice, review, and progress connected
              so every session has a clear job.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {journeySteps.map(([step, title, description]) => (
              <article
                key={step}
                className="rounded-[24px] border border-white/10 bg-background/35 p-5 transition duration-300 hover:border-accent-secondary/30 hover:bg-white/[0.035]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                  {step}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {growthStats.map(([label, value, detail]) => (
            <div
              key={label}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {label}
              </p>
              <p className="mt-3 text-4xl font-semibold text-primary">
                {value}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-10">
        <div className="rounded-[28px] border border-accent/18 bg-[linear-gradient(135deg,rgba(216,199,163,0.12),rgba(143,184,170,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
            Ready when your hands are
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-primary sm:text-5xl">
                Start with one calm session. Let the system handle the path.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Lessons, practice modes, review, XP, and analytics all keep the
                same goal: accurate hands first, speed second.
              </p>
            </div>
            <Link
              to="/practice"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-background transition duration-300 hover:-translate-y-0.5 hover:bg-accent"
            >
              Begin training
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-muted sm:px-8 lg:px-10">
        LetsType keeps practice calm, focused, and repeatable.
      </footer>
    </div>
  )
}

export default Home
