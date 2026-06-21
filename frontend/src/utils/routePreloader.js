export const routePreloaders = {
  auth: () => import("../pages/Auth"),
  home: () => import("../pages/Home"),
  lessons: () => import("../pages/Lessons"),
  practice: () => import("../pages/Practice"),
  profile: () => import("../pages/Profile"),
  notFound: () => import("../pages/NotFound"),
}

const preloadedRoutes = new Map()

export function preloadRoute(routeId) {
  const loader = routePreloaders[routeId]

  if (!loader) {
    return undefined
  }

  if (!preloadedRoutes.has(routeId)) {
    preloadedRoutes.set(routeId, loader())
  }

  return preloadedRoutes.get(routeId)
}

export function preloadPrimaryRoutes() {
  const preload = () => {
    preloadRoute("lessons")
    preloadRoute("practice")
    preloadRoute("profile")
  }

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(preload, { timeout: 1200 })

    return () => window.cancelIdleCallback(idleId)
  }

  const timerId = window.setTimeout(preload, 80)

  return () => window.clearTimeout(timerId)
}
