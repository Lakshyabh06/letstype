export function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

export function readStorage(key, fallbackValue) {
  if (!canUseStorage()) {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

export function writeStorage(key, value) {
  if (!canUseStorage()) {
    return false
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  if (!canUseStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function mergeObjects(baseValue, storedValue) {
  if (!storedValue || typeof storedValue !== "object") {
    return baseValue
  }

  return Object.entries(baseValue).reduce(
    (merged, [key, value]) => ({
      ...merged,
      [key]:
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        storedValue[key] &&
        typeof storedValue[key] === "object" &&
        !Array.isArray(storedValue[key])
          ? mergeObjects(value, storedValue[key])
          : storedValue[key] ?? value,
    }),
    { ...baseValue, ...storedValue }
  )
}

export default {
  canUseStorage,
  mergeObjects,
  readStorage,
  removeStorage,
  writeStorage,
}
