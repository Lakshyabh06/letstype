function getSampleValue(type, phase) {
  if (type === "triangle") {
    return 2 * Math.abs(2 * (phase - Math.floor(phase + 0.5))) - 1
  }

  return Math.sin(phase * Math.PI * 2)
}

export function getAudioContext() {
  if (typeof window === "undefined") {
    return null
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  return new AudioContextConstructor()
}

export async function resumeAudioContext(context) {
  if (!context) {
    return null
  }

  if (context.state === "suspended") {
    try {
      await context.resume()
    } catch {
      return null
    }
  }

  return context.state === "running" ? context : null
}

export function createSoundBuffer(context, tones = [], themeVolume = 1) {
  if (!context || tones.length === 0) {
    return null
  }

  const sampleRate = context.sampleRate
  const totalSeconds = tones.reduce(
    (duration, tone) =>
      Math.max(duration, (tone.delay || 0) + (tone.duration || 0.06) + 0.04),
    0.08
  )
  const frameCount = Math.ceil(totalSeconds * sampleRate)
  const buffer = context.createBuffer(1, frameCount, sampleRate)
  const channel = buffer.getChannelData(0)

  tones.forEach((tone) => {
    const startFrame = Math.floor((tone.delay || 0) * sampleRate)
    const durationFrames = Math.max(
      1,
      Math.floor((tone.duration || 0.06) * sampleRate)
    )
    const gain = (tone.gain || 0.02) * themeVolume

    for (let frame = 0; frame < durationFrames; frame += 1) {
      const progress = frame / durationFrames
      const phase = (frame / sampleRate) * tone.frequency
      const attack = Math.min(progress / 0.18, 1)
      const release = Math.min((1 - progress) / 0.38, 1)
      const envelope = Math.max(0, Math.min(attack, release))
      const value =
        getSampleValue(tone.type, phase) * gain * envelope
      const targetFrame = startFrame + frame

      if (targetFrame < channel.length) {
        channel[targetFrame] += value
      }
    }
  })

  return buffer
}

export function preloadSoundTheme(context, theme) {
  const buffers = new Map()

  if (!context || !theme?.sounds) {
    return buffers
  }

  Object.entries(theme.sounds).forEach(([soundName, tones]) => {
    const buffer = createSoundBuffer(context, tones, theme.volume)

    if (buffer) {
      buffers.set(soundName, buffer)
    }
  })

  return buffers
}

export function playAudioBuffer(context, buffer, volume = 1) {
  if (!context || !buffer) {
    return false
  }

  const source = context.createBufferSource()
  const gain = context.createGain()

  gain.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), context.currentTime)
  source.buffer = buffer
  source.connect(gain)
  gain.connect(context.destination)
  source.start()

  return true
}
