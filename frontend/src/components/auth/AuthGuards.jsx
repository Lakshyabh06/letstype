import { Navigate, useLocation } from "react-router-dom"

import LoadingState from "../system/LoadingState"
import useAuth from "../../hooks/useAuth"

function AuthLoading() {
  return (
    <div className="min-h-screen bg-background bg-[linear-gradient(180deg,#0B0D0E_0%,#11100F_48%,#0B0D0E_100%)] text-primary">
      <LoadingState />
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.initialized || (auth.status === "loading" && !auth.isAuthenticated)) {
    return <AuthLoading />
  }

  if (!auth.isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth" />
  }

  return children
}

export function PublicOnlyRoute({ children }) {
  const auth = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  if (!auth.initialized) {
    return <AuthLoading />
  }

  if (auth.isAuthenticated) {
    return <Navigate replace to={from === "/auth" ? "/" : from} />
  }

  return children
}
