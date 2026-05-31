const renderCounts = new Map()

export function trackRender(name) {
  if (!import.meta.env.DEV) {
    return
  }

  const nextCount = (renderCounts.get(name) || 0) + 1

  renderCounts.set(name, nextCount)

  if (nextCount % 50 === 0) {
    console.debug(`[render] ${name}: ${nextCount}`)
  }
}

export function getRenderCounts() {
  return Object.fromEntries(renderCounts)
}

export function resetRenderCounts() {
  renderCounts.clear()
}
