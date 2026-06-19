import { useCallback, useEffect, useSyncExternalStore } from "react"

import {
  getAuthSnapshot,
  initializeAuth,
  login,
  loginWithGoogle,
  logout,
  register,
  subscribeToAuth,
} from "../api/authService"

function useAuth() {
  const auth = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthSnapshot
  )

  useEffect(() => {
    initializeAuth()
  }, [])

  const signIn = useCallback((credentials) => login(credentials), [])
  const signInWithGoogle = useCallback(
    (credential) => loginWithGoogle(credential),
    []
  )
  const signOut = useCallback(() => logout(), [])
  const signUp = useCallback((details) => register(details), [])

  return {
    ...auth,
    isAuthenticated: auth.status === "authenticated" && Boolean(auth.user),
    signIn,
    signInWithGoogle,
    signOut,
    signUp,
  }
}

export default useAuth
