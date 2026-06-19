import settingsStore from "../store/settingsStore"
import { getAuthToken } from "../api/apiClient"
import {
  buildBackendSettingsPatch,
  updateSettings,
} from "../api/settingsService"
import { syncOrQueue } from "../api/syncQueue"
import audioMixer from "./audioMixer"

const defaultCategoryVolumes = {
  feedback: 0.34,
  rewards: 0.42,
  typing: 0.38,
  ui: 0,
}

export const soundCategories = {
  feedback: {
    description: "Wrong-key and corrective feedback.",
    label: "Feedback",
    preview: "wrong",
  },
  rewards: {
    description: "Completion, achievement, XP, and streak moments.",
    label: "Rewards",
    preview: "achievement",
  },
  typing: {
    description: "Correct keys and combo typing cadence.",
    label: "Typing",
    preview: "correct",
  },
  ui: {
    description: "Reserved for explicit sound tests only. UI clicks stay silent.",
    label: "Interface muted",
    preview: "ui",
  },
}

const soundNames = [
  "achievement",
  "combo",
  "complete",
  "correct",
  "lessonComplete",
  "ui",
  "wrong",
  "xp",
]

function createKeySound({
  body = 0.22,
  click = 0.42,
  gain = 0.9,
  low = 170,
  lowGain = 0.08,
  resonance = 360,
  resonanceGain = 0.08,
  targetPeak = 0.9,
} = {}) {
  const bodyLowpass = Math.max(760, low * 7.2)
  const capHighpass = Math.max(950, resonance * 2.4)
  const capLowpass = Math.max(5200, resonance * 12)

  return {
    category: "typing",
    gain,
    output: { targetPeak },
    variation: { gain: 0.055, rate: 0.018 },
    layers: [
      {
        attack: 0.0006,
        curve: "decay",
        decay: 6.6,
        duration: 0.008,
        gain: click * 0.72,
        highpass: capHighpass,
        lowpass: capLowpass,
        noiseColor: "soft",
        type: "noise",
      },
      {
        attack: 0.0008,
        curve: "decay",
        decay: 5.2,
        delay: 0.003,
        duration: 0.018,
        gain: click * 0.22,
        highpass: 580,
        lowpass: capLowpass * 0.72,
        noiseColor: "soft",
        type: "noise",
      },
      {
        attack: 0.0012,
        curve: "decay",
        decay: 3.4,
        delay: 0.005,
        duration: 0.052,
        gain: body,
        highpass: 80,
        lowpass: bodyLowpass,
        noiseColor: "brown",
        type: "noise",
      },
      {
        attack: 0.001,
        curve: "decay",
        decay: 4.4,
        delay: 0.023,
        duration: 0.028,
        gain: lowGain + resonanceGain * 0.35,
        highpass: 260,
        lowpass: bodyLowpass * 1.15,
        noiseColor: "soft",
        type: "noise",
      },
    ],
  }
}

function createErrorSound({
  body = 0.18,
  click = 0.28,
  gain = 0.8,
  low = 140,
  resonance = 220,
} = {}) {
  const bodyLowpass = Math.max(760, low * 6.8)
  const tapHighpass = Math.max(720, resonance * 2.6)

  return {
    category: "feedback",
    gain,
    output: { targetPeak: 0.82 },
    variation: { gain: 0.03, rate: 0.008 },
    layers: [
      {
        attack: 0.0008,
        curve: "decay",
        decay: 5.8,
        duration: 0.011,
        gain: click,
        highpass: tapHighpass,
        lowpass: 6200,
        noiseColor: "soft",
        type: "noise",
      },
      {
        attack: 0.0012,
        curve: "decay",
        decay: 3.8,
        delay: 0.005,
        duration: 0.048,
        gain: body,
        highpass: 90,
        lowpass: bodyLowpass,
        noiseColor: "brown",
        type: "noise",
      },
      {
        attack: 0.0008,
        curve: "decay",
        decay: 5.1,
        delay: 0.034,
        duration: 0.014,
        gain: click * 0.34,
        highpass: 900,
        lowpass: 5200,
        noiseColor: "soft",
        type: "noise",
      },
    ],
  }
}

function createRewardTap(delay = 0) {
  return [
    {
      attack: 0.0008,
      curve: "decay",
      decay: 5.4,
      delay,
      duration: 0.01,
      gain: 0.28,
      highpass: 1200,
      lowpass: 8200,
      noiseColor: "soft",
      type: "noise",
    },
    {
      attack: 0.001,
      curve: "decay",
      decay: 3.4,
      delay: delay + 0.005,
      duration: 0.034,
      gain: 0.08,
      highpass: 280,
      lowpass: 1500,
      noiseColor: "brown",
      type: "noise",
    },
  ]
}

function createRewardSound(taps = [0, 0.095], gain = 0.58) {
  return {
    category: "rewards",
    gain,
    output: { targetPeak: 0.82 },
    variation: { gain: 0.025, rate: 0.006 },
    layers: taps.flatMap(createRewardTap),
  }
}

function createProfile({ combo, complete, correct, wrong }) {
  return {
    achievement: createRewardSound([0, 0.08, 0.165], 0.54),
    combo,
    complete,
    correct,
    lessonComplete: createRewardSound([0, 0.085, 0.17], 0.58),
    ui: createKeySound({ body: 0.16, click: 0.2, gain: 0, resonanceGain: 0.03 }),
    wrong,
    xp: createRewardSound([0, 0.07], 0.45),
  }
}

function createSilentProfile() {
  return Object.fromEntries(
    soundNames.map((soundName) => [
      soundName,
      {
        category:
          soundName === "wrong"
            ? "feedback"
            : ["achievement", "complete", "lessonComplete", "xp"].includes(
                  soundName
                )
              ? "rewards"
              : "typing",
        gain: 0,
        layers: [],
      },
    ])
  )
}

export const soundThemes = {
  mechanical: {
    id: "mechanical",
    label: "Mechanical",
    sounds: createProfile({
      combo: createKeySound({ body: 0.16, click: 0.22, gain: 0.44, low: 135 }),
      complete: createRewardSound([0, 0.09], 0.32),
      correct: createKeySound({
        body: 0.2,
        click: 0.3,
        gain: 0.48,
        low: 128,
        lowGain: 0.075,
        resonance: 360,
        resonanceGain: 0.07,
      }),
      wrong: createErrorSound({ body: 0.12, click: 0.18, gain: 0.36, low: 118 }),
    }),
  },
  precision: {
    id: "precision",
    label: "Precision",
    sounds: createProfile({
      combo: createKeySound({ body: 0.1, click: 0.16, gain: 0.36, low: 205 }),
      complete: createRewardSound([0, 0.075], 0.28),
      correct: createKeySound({
        body: 0.12,
        click: 0.2,
        gain: 0.42,
        low: 190,
        lowGain: 0.035,
        resonance: 540,
        resonanceGain: 0.04,
      }),
      wrong: createErrorSound({ body: 0.09, click: 0.16, gain: 0.34, low: 145 }),
    }),
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    sounds: createProfile({
      combo: createKeySound({ body: 0.045, click: 0.08, gain: 0.22, lowGain: 0.012 }),
      complete: createRewardSound([0, 0.065], 0.2),
      correct: createKeySound({
        body: 0.06,
        click: 0.11,
        gain: 0.24,
        low: 245,
        lowGain: 0.012,
        resonance: 680,
        resonanceGain: 0.018,
      }),
      wrong: createErrorSound({ body: 0.05, click: 0.11, gain: 0.24, low: 165 }),
    }),
  },
  touch: {
    id: "touch",
    label: "Touch",
    sounds: createProfile({
      combo: createKeySound({ body: 0.04, click: 0.1, gain: 0.24, lowGain: 0.012 }),
      complete: createRewardSound([0, 0.065], 0.2),
      correct: createKeySound({
        body: 0.045,
        click: 0.13,
        gain: 0.28,
        low: 340,
        lowGain: 0.01,
        resonance: 820,
        resonanceGain: 0.014,
      }),
      wrong: createErrorSound({
        body: 0.045,
        click: 0.11,
        gain: 0.24,
        low: 190,
        resonance: 280,
      }),
    }),
  },
  silent: {
    id: "silent",
    label: "Silent",
    sounds: createSilentProfile(),
  },
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min))
}

function getMasterVolume(settings) {
  return clamp(settings.masterVolume ?? settings.volume ?? 1)
}

function syncBackendAudioSettings(audioSettings) {
  if (!getAuthToken()) {
    return
  }

  const patch = buildBackendSettingsPatch("audio", audioSettings)

  if (Object.keys(patch).length === 0) {
    return
  }

  syncOrQueue("settings", patch, () => updateSettings(patch)).catch(() => {
    // Audio preferences remain cached locally; retryable failures are queued.
  })
}

class SoundManager {
  bufferCache = new Map()
  lastPlayedAt = new Map()
  pendingResume = null

  getSettings() {
    return settingsStore.getSnapshot().audio
  }

  getSnapshot = () => this.getSettings()

  subscribe = (listener) => {
    return settingsStore.subscribe(listener)
  }

  setEnabled(enabled) {
    settingsStore.updateSection("audio", { enabled, muted: !enabled })
    this.applySettings()
  }

  setMuted(muted) {
    settingsStore.updateSection("audio", { enabled: !muted, muted })
    this.applySettings()
  }

  setTheme(themeId) {
    if (!soundThemes[themeId]) {
      return
    }

    settingsStore.updateSection("audio", { themeId })
    syncBackendAudioSettings({ themeId })
    this.preload(true)
  }

  setVolume(volume) {
    this.setMasterVolume(volume)
  }

  setMasterVolume(masterVolume) {
    const nextVolume = clamp(masterVolume)

    settingsStore.updateSection("audio", {
      masterVolume: nextVolume,
      volume: nextVolume,
    })
    syncBackendAudioSettings({
      masterVolume: nextVolume,
      volume: nextVolume,
    })
    this.applySettings()
  }

  setCategoryVolume(category, volume) {
    if (!soundCategories[category]) {
      return
    }

    const settings = this.getSettings()

    settingsStore.updateSection("audio", {
      categories: {
        ...defaultCategoryVolumes,
        ...settings.categories,
        [category]: clamp(volume),
      },
    })
    this.applySettings()
  }

  toggle() {
    this.setMuted(!this.getSettings().muted && this.getSettings().enabled)
  }

  getTheme() {
    return soundThemes[this.getSettings().themeId] || soundThemes.mechanical
  }

  applySettings() {
    const settings = this.getSettings()
    const categories = {
      ...defaultCategoryVolumes,
      ...settings.categories,
    }

    audioMixer.setMasterVolume(
      getMasterVolume(settings),
      settings.muted || !settings.enabled
    )

    Object.entries(categories).forEach(([category, volume]) => {
      audioMixer.setCategoryVolume(category, volume)
    })
  }

  async unlock() {
    if (!this.pendingResume) {
      this.pendingResume = audioMixer.resume().finally(() => {
        this.pendingResume = null
      })
    }

    const context = await this.pendingResume

    if (context) {
      this.preload()
      this.applySettings()
    }

    return context
  }

  preload(force = false) {
    const theme = this.getTheme()

    if (!force && this.bufferCache.has(theme.id)) {
      return
    }

    const themeBuffers = new Map()

    Object.entries(theme.sounds).forEach(([soundName, sound]) => {
      const buffer = audioMixer.createBuffer(sound)

      if (buffer) {
        themeBuffers.set(soundName, buffer)
      }
    })

    this.bufferCache.set(theme.id, themeBuffers)
  }

  getSound(soundName) {
    const theme = this.getTheme()

    return theme.sounds[soundName] || theme.sounds.complete
  }

  getBuffer(soundName) {
    const theme = this.getTheme()

    this.preload()

    return this.bufferCache.get(theme.id)?.get(soundName) || null
  }

  play(soundName, options = {}) {
    const settings = this.getSettings()

    if (!settings.enabled || settings.muted || typeof window === "undefined") {
      return
    }

    const sound = this.getSound(soundName)

    if (!sound) {
      return
    }

    const now = performance.now()
    const throttleMs =
      options.throttleMs ??
      (sound.category === "typing" ? 24 : sound.category === "ui" ? 60 : 120)
    const lastPlayedAt = this.lastPlayedAt.get(soundName) || 0

    if (now - lastPlayedAt < throttleMs) {
      return
    }

    this.lastPlayedAt.set(soundName, now)

    this.unlock().then((context) => {
      if (!context) {
        return
      }

      const variation = sound.variation || {}
      const gainJitter = variation.gain
        ? 1 + (Math.random() * 2 - 1) * variation.gain
        : 1
      const rateJitter = variation.rate
        ? 1 + (Math.random() * 2 - 1) * variation.rate
        : 1
      const playbackRate = (options.rate || 1) * rateJitter

      audioMixer.playBuffer(this.getBuffer(soundName), {
        category: sound.category,
        gain: clamp((options.gain ?? sound.gain ?? 0.8) * gainJitter * 0.62),
        rate: playbackRate,
      })
    })
  }
}

const soundManager = new SoundManager()

export function playSound(soundName, options) {
  soundManager.play(soundName, options)
}

export function emitSound(soundName, options) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent("typelearner:sound", {
      detail: { soundName, options },
    })
  )
}

export default soundManager
