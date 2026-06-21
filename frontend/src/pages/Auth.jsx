import { useCallback, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import GoogleAuthButton from "../components/auth/GoogleAuthButton"
import BrandLogo from "../components/brand/BrandLogo"
import useAuth from "../hooks/useAuth"

const authModes = [
  { id: "login", label: "Sign In" },
  { id: "register", label: "Create Account" },
]

const proofPoints = [
  ["Lessons", "Guided paths for calm accuracy."],
  ["Practice", "Focused sessions that reinforce weak keys."],
  ["Analytics", "Progress, consistency, and achievement signals."],
]

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-primary outline-none transition duration-200 placeholder:text-muted focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
      />
    </label>
  )
}

function KeyboardPreview() {
  return (
    <div className="rounded-[24px] border border-white/10 bg-background/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
      <div className="mx-auto flex max-w-xl flex-col gap-2">
        {keyboardRows.map((row, rowIndex) => (
          <div
            key={row.join("")}
            className="flex justify-center gap-1.5"
            style={{ paddingLeft: `${rowIndex * 4}%` }}
          >
            {row.map((key) => (
              <span
                key={key}
                className={`flex h-8 min-w-7 items-center justify-center rounded-xl border px-2 text-[0.68rem] font-semibold transition duration-300 sm:h-9 sm:min-w-8 sm:text-xs ${
                  key === "F" || key === "J"
                    ? "border-accent/60 bg-accent/15 text-primary shadow-[0_14px_36px_rgba(216,199,163,0.14)]"
                    : "border-white/10 bg-white/[0.04] text-muted"
                }`}
              >
                {key}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function getRedirectPath(location) {
  const from = location.state?.from

  if (!from || from.pathname === "/auth") {
    return "/"
  }

  return `${from.pathname || "/"}${from.search || ""}${from.hash || ""}`
}

function Auth() {
  const auth = useAuth()
  const { signIn, signInWithGoogle, signUp } = auth
  const location = useLocation()
  const navigate = useNavigate()
  const redirectPath = useMemo(() => getRedirectPath(location), [location])
  const [mode, setMode] = useState("login")
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  })

  const isLoading = auth.status === "loading"
  const headline = mode === "register" ? "Create your training profile." : "Master typing with precision."

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    try {
      if (mode === "register") {
        await signUp(form)
      } else {
        await signIn({
          email: form.email,
          password: form.password,
        })
      }

      setForm({ email: "", name: "", password: "" })
      navigate(redirectPath, { replace: true })
    } catch (nextError) {
      setError(nextError.message)
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential) => {
      setError(null)

      try {
        await signInWithGoogle(credential)
        navigate(redirectPath, { replace: true })
      } catch (nextError) {
        setError(nextError.message)
      }
    },
    [navigate, redirectPath, signInWithGoogle]
  )

  return (
    <div className="min-h-screen overflow-hidden bg-background bg-[linear-gradient(180deg,#0B0D0E_0%,#11100F_48%,#0B0D0E_100%)] text-primary">
      <main className="mx-auto grid min-h-screen max-w-[1500px] gap-7 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:items-center lg:px-10">
        <motion.section
          className="min-w-0 py-6 lg:py-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <BrandLogo className="mb-8 max-w-[230px] overflow-hidden" size="lg" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-secondary">
            Premium typing intelligence
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-primary sm:text-6xl lg:text-7xl">
            Train. Improve. Perform.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Lessons, practice, analytics, progress tracking, and achievements
            stay connected to your profile so every session builds on the last.
          </p>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {proofPoints.map(([title, description]) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]"
              >
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-8 max-w-3xl rounded-[28px] border border-white/10 bg-surface/70 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
                  Session preview
                </p>
                <p className="mt-2 text-lg font-semibold text-primary">
                  calm hands build accurate rhythm
                </p>
              </div>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                97%
              </span>
            </div>
            <KeyboardPreview />
          </motion.div>
        </motion.section>

        <motion.section
          aria-labelledby="auth-heading"
          className="min-w-0 rounded-[28px] border border-white/10 bg-surface/72 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur sm:p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
            LetsType access
          </p>
          <h2
            id="auth-heading"
            className="mt-3 text-3xl font-semibold leading-tight text-primary sm:text-4xl"
          >
            {headline}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to enter your dashboard and keep your progress, settings,
            analytics, and achievements in sync.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-background/45 p-1">
            {authModes.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setMode(option.id)
                  setError(null)
                }}
                className={`h-11 rounded-full px-4 text-sm font-semibold transition duration-200 ${
                  mode === option.id
                    ? "bg-primary text-background shadow-[0_12px_34px_rgba(245,242,234,0.12)]"
                    : "text-muted hover:bg-white/[0.035] hover:text-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <Field
                autoComplete="name"
                label="Name"
                onChange={(event) => updateField("name", event.target.value)}
                required
                type="text"
                value={form.name}
              />
            )}
            <Field
              autoComplete="email"
              label="Email"
              onChange={(event) => updateField("email", event.target.value)}
              required
              type="email"
              value={form.email}
            />
            <Field
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              label="Password"
              minLength={mode === "register" ? 8 : 1}
              onChange={(event) => updateField("password", event.target.value)}
              required
              type="password"
              value={form.password}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:-translate-y-0.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Connecting..."
                : mode === "register"
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Or
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <GoogleAuthButton
            disabled={isLoading}
            onCredential={handleGoogleCredential}
          />

          {(error || auth.error) && (
            <p className="mt-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm leading-6 text-error">
              {error || auth.error}
            </p>
          )}
        </motion.section>
      </main>
    </div>
  )
}

export default Auth
