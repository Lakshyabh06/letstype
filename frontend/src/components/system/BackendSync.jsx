import { useEffect } from "react"

import { flushSyncQueue } from "../../api/syncQueue"
import useAuth from "../../hooks/useAuth"

function BackendSync() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return undefined
    }

    function flush() {
      flushSyncQueue().catch(() => {
        // The queue is intentionally quiet; visible screens keep their local state.
      })
    }

    flush()
    window.addEventListener("online", flush)

    return () => window.removeEventListener("online", flush)
  }, [auth.isAuthenticated])

  return null
}

export default BackendSync
