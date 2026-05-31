import settingsStore from "./settingsStore"

export function getWorkspaceSnapshot() {
  return settingsStore.getSnapshot().workspace
}

export function updateWorkspaceSnapshot(workspaceSettings) {
  settingsStore.updateSection("workspace", workspaceSettings)
}

export default {
  getWorkspaceSnapshot,
  updateWorkspaceSnapshot,
}
