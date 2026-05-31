import { readStorage, writeStorage } from "../utils/storageManager"

export const progressStorageKey = "typelearner.progress.v1"
export const practiceStorageKey = "typelearner.practice.v1"

export function readProgressSnapshot(fallbackValue) {
  return readStorage(progressStorageKey, fallbackValue)
}

export function writeProgressSnapshot(progress) {
  return writeStorage(progressStorageKey, progress)
}

export function readPracticeSnapshot(fallbackValue) {
  return readStorage(practiceStorageKey, fallbackValue)
}

export function writePracticeSnapshot(practiceProgress) {
  return writeStorage(practiceStorageKey, practiceProgress)
}

export default {
  practiceStorageKey,
  progressStorageKey,
  readPracticeSnapshot,
  readProgressSnapshot,
  writePracticeSnapshot,
  writeProgressSnapshot,
}
