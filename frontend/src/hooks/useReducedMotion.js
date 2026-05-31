import { useEffect, useState } from "react"

function getSystemReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getSystemReducedMotion
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener?.("change", handleChange)

    return () => mediaQuery.removeEventListener?.("change", handleChange)
  }, [])

  return prefersReducedMotion
}

export default useReducedMotion
