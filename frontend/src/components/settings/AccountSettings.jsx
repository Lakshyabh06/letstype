import { useEffect, useRef, useState } from "react"

import { getProfile, updateProfile } from "../../api/profileService"
import useAuth from "../../hooks/useAuth"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-primary outline-none transition duration-200 placeholder:text-muted focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
      />
    </label>
  )
}

function AccountSettings() {
  const auth = useAuth()
  const { signInWithGoogle } = auth
  const googleButtonRef = useRef(null)
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  })
  const [profile, setProfile] = useState(null)
  const [profileName, setProfileName] = useState("")
  const [status, setStatus] = useState({
    error: null,
    message: null,
    profile: "idle",
  })
  const secondaryAuthError =
    auth.error && auth.error !== status.error ? auth.error : null

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setProfile(null)
      setProfileName("")
      return
    }

    let isCurrent = true

    setStatus((current) => ({ ...current, error: null, profile: "loading" }))

    getProfile()
      .then((nextProfile) => {
        if (!isCurrent) {
          return
        }

        setProfile(nextProfile)
        setProfileName(nextProfile.name || "")
        setStatus((current) => ({ ...current, profile: "ready" }))
      })
      .catch((error) => {
        if (!isCurrent) {
          return
        }

        setStatus((current) => ({
          ...current,
          error: error.message,
          profile: "error",
        }))
      })

    return () => {
      isCurrent = false
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    if (!googleClientId || auth.isAuthenticated || !googleButtonRef.current) {
      return undefined
    }

    let cancelled = false
    const scriptId = "google-identity-services"

    function renderGoogleButton() {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
        return
      }

      window.google.accounts.id.initialize({
        callback: (response) => {
          if (response?.credential) {
            signInWithGoogle(response.credential).catch(() => {})
          }
        },
        client_id: googleClientId,
      })
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        shape: "pill",
        size: "large",
        text: "continue_with",
        theme: "outline",
      })
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton()
      return () => {
        cancelled = true
      }
    }

    let script = document.getElementById(scriptId)

    if (!script) {
      script = document.createElement("script")
      script.async = true
      script.defer = true
      script.id = scriptId
      script.src = "https://accounts.google.com/gsi/client"
      document.head.appendChild(script)
    }

    script.addEventListener("load", renderGoogleButton)

    return () => {
      cancelled = true
      script.removeEventListener("load", renderGoogleButton)
    }
  }, [auth.isAuthenticated, signInWithGoogle])

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setStatus((current) => ({ ...current, error: null, message: null }))

    try {
      if (mode === "register") {
        await auth.signUp(form)
      } else {
        await auth.signIn({
          email: form.email,
          password: form.password,
        })
      }

      setForm({ email: "", name: "", password: "" })
      setStatus((current) => ({
        ...current,
        message: "Signed in successfully.",
      }))
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }))
    }
  }

  async function handleProfileSave(event) {
    event.preventDefault()
    setStatus((current) => ({ ...current, error: null, message: null }))

    try {
      const nextProfile = await updateProfile({ name: profileName })

      setProfile(nextProfile)
      setStatus((current) => ({
        ...current,
        message: "Profile updated.",
        profile: "ready",
      }))
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }))
    }
  }

  if (auth.isAuthenticated) {
    return (
      <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
              Account
            </p>
            <h2 className="mt-2 text-xl font-semibold text-primary">
              Profile sync
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Signed in as {profile?.email || auth.user?.email}.
            </p>
          </div>

          <button
            type="button"
            onClick={auth.signOut}
            className="h-10 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-muted transition duration-200 hover:border-white/20 hover:text-primary"
          >
            Log out
          </button>
        </div>

        <form className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleProfileSave}>
          <Field
            label="Display name"
            onChange={(event) => setProfileName(event.target.value)}
            required
            type="text"
            value={profileName}
          />
          <button
            type="submit"
            disabled={status.profile === "loading"}
            className="h-11 self-end rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save profile
          </button>
        </form>

        {status.profile === "loading" && (
          <p className="mt-3 text-sm leading-6 text-muted">Loading profile...</p>
        )}
        {status.error && (
          <p className="mt-3 text-sm leading-6 text-error">{status.error}</p>
        )}
        {status.message && (
          <p className="mt-3 text-sm leading-6 text-accent">{status.message}</p>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-background/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
        Account
      </p>
      <h2 className="mt-2 text-xl font-semibold text-primary">
        Sign in to sync
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Keep lessons, sessions, settings, analytics, and achievements connected across devices.
      </p>

      <div className="mt-5 flex gap-2">
        {["login", "register"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={`h-10 rounded-full border px-4 text-sm font-semibold transition duration-200 ${
              mode === option
                ? "border-accent/35 bg-accent/10 text-accent"
                : "border-white/10 bg-white/[0.03] text-muted hover:text-primary"
            }`}
          >
            {option === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleAuthSubmit}>
        {mode === "register" && (
          <Field
            label="Name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            type="text"
            value={form.name}
          />
        )}
        <Field
          label="Email"
          onChange={(event) => updateField("email", event.target.value)}
          required
          type="email"
          value={form.email}
        />
        <Field
          label="Password"
          minLength={mode === "register" ? 8 : 1}
          onChange={(event) => updateField("password", event.target.value)}
          required
          type="password"
          value={form.password}
        />

        <button
          type="submit"
          disabled={auth.status === "loading"}
          className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {auth.status === "loading"
            ? "Connecting..."
            : mode === "register"
              ? "Create account"
              : "Login"}
        </button>
      </form>

      {googleClientId && (
        <div className="mt-4 min-h-10" ref={googleButtonRef} />
      )}

      {status.error && (
        <p className="mt-3 text-sm leading-6 text-error">{status.error}</p>
      )}
      {secondaryAuthError && (
        <p className="mt-3 text-sm leading-6 text-error">
          {secondaryAuthError}
        </p>
      )}
      {status.message && (
        <p className="mt-3 text-sm leading-6 text-accent">{status.message}</p>
      )}
    </section>
  )
}

export default AccountSettings
