export function scheduleIdleTask(task, timeout = 500) {
  if (typeof window === "undefined") {
    return null
  }

  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(task, { timeout })
  }

  return window.setTimeout(task, Math.min(timeout, 120))
}

export function cancelIdleTask(taskId) {
  if (typeof window === "undefined" || taskId === null) {
    return
  }

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(taskId)
    return
  }

  window.clearTimeout(taskId)
}

export function createDebouncedIdleTask(task, delay = 180) {
  let timeoutId = null
  let idleTaskId = null

  return {
    cancel() {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }

      cancelIdleTask(idleTaskId)
      timeoutId = null
      idleTaskId = null
    },
    schedule(...args) {
      this.cancel()

      timeoutId = window.setTimeout(() => {
        idleTaskId = scheduleIdleTask(() => task(...args))
      }, delay)
    },
  }
}

export function createPerformanceSampler(onSample) {
  let animationFrame = null
  let frameCount = 0
  let lastSecond = performance.now()
  let latestInputLatency = 0
  let longTasks = 0
  let observer = null

  function sampleFrame(now) {
    frameCount += 1

    if (now - lastSecond >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastSecond))
      const memory = performance.memory
        ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        : 0

      onSample((current) => ({
        ...current,
        fps,
        inputLatency: Math.round(latestInputLatency),
        longTasks,
        memory,
        status: fps >= 50 && latestInputLatency < 32 ? "stable" : "watch",
      }))

      frameCount = 0
      lastSecond = now
    }

    animationFrame = window.requestAnimationFrame(sampleFrame)
  }

  function handleKeyDown(event) {
    const startedAt = event.timeStamp

    window.requestAnimationFrame(() => {
      latestInputLatency = performance.now() - startedAt
    })
  }

  return {
    start() {
      window.addEventListener("keydown", handleKeyDown, true)
      animationFrame = window.requestAnimationFrame(sampleFrame)

      if ("PerformanceObserver" in window) {
        try {
          observer = new PerformanceObserver((list) => {
            longTasks += list.getEntries().length
          })
          observer.observe({ entryTypes: ["longtask"] })
        } catch {
          observer = null
        }
      }
    },
    stop() {
      window.removeEventListener("keydown", handleKeyDown, true)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      observer?.disconnect()
    },
  }
}
