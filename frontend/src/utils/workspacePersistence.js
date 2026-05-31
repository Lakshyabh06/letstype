import settingsStore from "../store/settingsStore"
import { readStorage, removeStorage, writeStorage } from "./storageManager"

export const practiceDraftStorageKey = "typelearner.practice.draft.v1"

export function rememberLastRoute(pathname) {
  settingsStore.updateSection("workspace", {
    lastRoute: pathname || "/",
  })
}

export function rememberLastLesson(lessonId) {
  if (!lessonId) {
    return
  }

  settingsStore.updateSection("workspace", {
    lastLessonId: lessonId,
  })
}

export function readPracticeDraft() {
  return readStorage(practiceDraftStorageKey, null)
}

export function writePracticeDraft(draft) {
  if (!draft?.typedText) {
    removeStorage(practiceDraftStorageKey)
    return
  }

  writeStorage(practiceDraftStorageKey, {
    ...draft,
    savedAt: new Date().toISOString(),
    version: 1,
  })
}

export function clearPracticeDraft() {
  removeStorage(practiceDraftStorageKey)
}
