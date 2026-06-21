import { useEffect, useRef, useState } from "react"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const scriptId = "google-identity-services"

function GoogleAuthButton({ disabled = false, onCredential }) {
  const buttonRef = useRef(null)
  const [status, setStatus] = useState(
    googleClientId ? "idle" : "not-configured"
  )

  useEffect(() => {
    if (!googleClientId || disabled || !buttonRef.current) {
      return undefined
    }

    let cancelled = false

    function handleScriptError() {
      setStatus("error")
    }

    function renderGoogleButton() {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
        return
      }

      window.google.accounts.id.initialize({
        callback: (response) => {
          if (response?.credential) {
            onCredential(response.credential)
          }
        },
        client_id: googleClientId,
      })

      buttonRef.current.innerHTML = ""
      window.google.accounts.id.renderButton(buttonRef.current, {
        shape: "pill",
        size: "large",
        text: "continue_with",
        theme: "outline",
        width: Math.min(buttonRef.current.offsetWidth || 360, 400),
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
    script.addEventListener("error", handleScriptError)

    return () => {
      cancelled = true
      script.removeEventListener("load", renderGoogleButton)
      script.removeEventListener("error", handleScriptError)
    }
  }, [disabled, onCredential])

  if (!googleClientId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-muted">
        Google sign-in needs VITE_GOOGLE_CLIENT_ID before it can be shown.
      </div>
    )
  }

  return (
    <div className="min-h-11">
      <div
        aria-hidden={disabled}
        className={`flex min-h-11 justify-center rounded-full transition duration-200 ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
        ref={buttonRef}
      />
      {status === "error" && (
        <p className="mt-2 text-center text-sm leading-6 text-error">
          Google sign-in could not be loaded.
        </p>
      )}
    </div>
  )
}

export default GoogleAuthButton
