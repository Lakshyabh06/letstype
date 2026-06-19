import {
  apiRequest,
  authStorageKey,
  clearAuthSession,
  onUnauthorized,
  persistAuthSession,
} from "./apiClient"
import { readStorage } from "../utils/storageManager"

const defaultAuthState = {
  error: null,
  initialized: false,
  status: "idle",
  token: null,
  user: null,
}

let authState = {
  ...defaultAuthState,
  ...(readStorage(authStorageKey, null) || {}),
}
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

function setAuthState(nextState) {
  authState = {
    ...authState,
    ...nextState,
  }
  notify()
}

function storeSession(session) {
  persistAuthSession(session)
  setAuthState({
    error: null,
    initialized: true,
    status: "authenticated",
    token: session.token,
    user: session.user,
  })
}

export function getAuthSnapshot() {
  return authState
}

export function subscribeToAuth(listener) {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export async function initializeAuth() {
  if (authState.initialized || !authState.token) {
    setAuthState({ initialized: true })
    return authState
  }

  setAuthState({ error: null, status: "loading" })

  try {
    const user = await apiRequest("/api/auth/me")

    setAuthState({
      error: null,
      initialized: true,
      status: "authenticated",
      user,
    })
  } catch (error) {
    setAuthState({
      error: error.message,
      initialized: true,
      status: "idle",
      token: null,
      user: null,
    })
  }

  return authState
}

export async function register({ name, email, password }) {
  setAuthState({ error: null, status: "loading" })

  try {
    await apiRequest("/api/auth/register", {
      body: { email, name, password },
      method: "POST",
    })

    return login({ email, password })
  } catch (error) {
    setAuthState({ error: error.message, status: "idle" })
    throw error
  }
}

export async function login({ email, password }) {
  setAuthState({ error: null, status: "loading" })

  try {
    const session = await apiRequest("/api/auth/login", {
      body: { email, password },
      method: "POST",
    })

    storeSession(session)
    return session
  } catch (error) {
    setAuthState({ error: error.message, status: "idle" })
    throw error
  }
}

export async function loginWithGoogle(credential) {
  setAuthState({ error: null, status: "loading" })

  try {
    const session = await apiRequest("/api/auth/google", {
      body: { credential },
      method: "POST",
    })

    storeSession(session)
    return session
  } catch (error) {
    setAuthState({ error: error.message, status: "idle" })
    throw error
  }
}

export function logout() {
  clearAuthSession()
  setAuthState({
    error: null,
    initialized: true,
    status: "idle",
    token: null,
    user: null,
  })
}

onUnauthorized(() => {
  setAuthState({
    error: "Your session expired. Please sign in again.",
    initialized: true,
    status: "idle",
    token: null,
    user: null,
  })
})

export default {
  getAuthSnapshot,
  initializeAuth,
  login,
  loginWithGoogle,
  logout,
  register,
  subscribeToAuth,
}
