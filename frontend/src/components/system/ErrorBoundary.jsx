import { Component } from "react"

class ErrorBoundary extends Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("LetsType boundary caught an error", error, info)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-[70svh] items-center justify-center px-4">
          <section
            className="w-full max-w-xl rounded-[28px] border border-error/25 bg-surface/86 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)]"
            role="alert"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-error">
              Recovery state
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-primary">
              This workspace panel could not render.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Refresh the app to rebuild the current session. Local progress and
              preferences remain stored on this device.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-background transition duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Reload workspace
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
