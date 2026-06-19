import { readStorage, removeStorage, writeStorage } from "../utils/storageManager"

export const authStorageKey = "typelearner.auth.v1"

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000"

let authToken = readStorage(authStorageKey, null)?.token || null
const unauthorizedListeners = new Set()

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export function getApiBaseUrl() {
  return apiBaseUrl
}

export function getAuthToken() {
  return authToken
}

export function setAuthToken(token) {
  authToken = token || null
}

export function persistAuthSession(session) {
  setAuthToken(session?.token)

  if (!session?.token) {
    removeStorage(authStorageKey)
    return
  }

  writeStorage(authStorageKey, session)
}

export function clearAuthSession() {
  setAuthToken(null)
  removeStorage(authStorageKey)
}

export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener)

  return () => unauthorizedListeners.delete(listener)
}

function emitUnauthorized() {
  unauthorizedListeners.forEach((listener) => listener())
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) {
    return null
  }

  return response.json()
}

function normalizeErrorMessage(data, fallbackMessage) {
  const message = data?.message || data?.error

  if (typeof message === "string") {
    return message
  }

  if (Array.isArray(message)) {
    return message
      .map((item) =>
        typeof item === "string" ? item : item?.message || JSON.stringify(item)
      )
      .join(" ")
  }

  if (message && typeof message === "object") {
    return message.message || JSON.stringify(message)
  }

  return fallbackMessage
}

export async function apiRequest(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      body:
        options.body && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
      headers,
    })
  } catch (error) {
    throw new ApiError("Unable to reach the backend. Changes are cached locally.", {
      data: error,
      status: 0,
    })
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    const message = normalizeErrorMessage(
      data,
      `Request failed with status ${response.status}`
    )

    if (response.status === 401) {
      clearAuthSession()
      emitUnauthorized()
    }

    throw new ApiError(message, {
      data,
      status: response.status,
    })
  }

  return data
}

export default {
  apiRequest,
  clearAuthSession,
  getApiBaseUrl,
  getAuthToken,
  onUnauthorized,
  persistAuthSession,
  setAuthToken,
}
