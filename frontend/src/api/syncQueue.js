import { ApiError } from "./apiClient"
import { updateLessonProgress } from "./progressService"
import { createSession } from "./sessionService"
import { updateSettings } from "./settingsService"
import { readStorage, writeStorage } from "../utils/storageManager"

const syncQueueKey = "typelearner.api.queue.v1"
const retryableStatuses = new Set([0, 408, 429, 500, 502, 503, 504])

function readQueue() {
  const queue = readStorage(syncQueueKey, [])

  return Array.isArray(queue) ? queue : []
}

function writeQueue(queue) {
  writeStorage(syncQueueKey, queue.slice(-120))
}

function shouldQueue(error) {
  return error instanceof ApiError && retryableStatuses.has(error.status)
}

export function enqueueSync(type, payload) {
  const queue = readQueue()

  writeQueue([
    ...queue,
    {
      createdAt: new Date().toISOString(),
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      payload,
      type,
    },
  ])
}

export async function syncOrQueue(type, payload, syncTask) {
  try {
    return await syncTask()
  } catch (error) {
    if (shouldQueue(error)) {
      enqueueSync(type, payload)
      return null
    }

    throw error
  }
}

async function runQueuedItem(item) {
  if (item.type === "progress") {
    return updateLessonProgress(item.payload)
  }

  if (item.type === "session") {
    return createSession(item.payload)
  }

  if (item.type === "settings") {
    return updateSettings(item.payload)
  }

  return null
}

export async function flushSyncQueue() {
  const queue = readQueue()

  if (queue.length === 0) {
    return
  }

  const remaining = []

  for (const item of queue) {
    try {
      await runQueuedItem(item)
    } catch (error) {
      if (shouldQueue(error)) {
        remaining.push(item)
        continue
      }

      throw error
    }
  }

  writeQueue(remaining)
}

export default {
  enqueueSync,
  flushSyncQueue,
  syncOrQueue,
}
