const TARGET_PEAK = 0.98
const SILENCE_FLOOR = 0.000001

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min))
}

function getSampleValue(layer, phase, randomValue = 0) {
  if (layer.type === "triangle") {
    return 2 * Math.abs(2 * (phase - Math.floor(phase + 0.5))) - 1
  }

  if (layer.type === "square") {
    return Math.sin(phase * Math.PI * 2) >= 0 ? 1 : -1
  }

  if (layer.type === "noise") {
    return randomValue * 2 - 1
  }

  return Math.sin(phase * Math.PI * 2)
}

function getEnvelope(progress, layer) {
  const attack = layer.attack ?? 0.12
  const release = layer.release ?? 0.36

  if (layer.curve === "decay") {
    return (
      Math.min(progress / attack, 1) *
      Math.max(0, (1 - progress) ** (layer.decay ?? 2.7))
    )
  }

  return Math.max(
    0,
    Math.min(progress / attack, (1 - progress) / release, 1)
  )
}

function shapeNoise(rawValue, layer, previousValue) {
  if (layer.noiseColor === "brown") {
    return previousValue * 0.92 + rawValue * 0.08
  }

  if (layer.noiseColor === "soft") {
    return previousValue * 0.68 + rawValue * 0.32
  }

  return rawValue
}

function getLowpassAlpha(frequency, sampleRate) {
  return 1 - Math.exp((-2 * Math.PI * frequency) / sampleRate)
}

function getHighpassAlpha(frequency, sampleRate) {
  const rc = 1 / (2 * Math.PI * frequency)
  const dt = 1 / sampleRate

  return rc / (rc + dt)
}

function normalizeBuffer(buffer, targetPeak = TARGET_PEAK) {
  if (!buffer) {
    return buffer
  }

  const channel = buffer.getChannelData(0)
  let peak = 0

  for (let index = 0; index < channel.length; index += 1) {
    peak = Math.max(peak, Math.abs(channel[index]))
  }

  if (peak <= SILENCE_FLOOR) {
    return buffer
  }

  const normalizer = Math.min(targetPeak / peak, 8)

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] *= normalizer
  }

  return buffer
}

function createToneBuffer(context, layers = [], output = {}) {
  if (!context || layers.length === 0) {
    return null
  }

  const sampleRate = context.sampleRate
  const totalSeconds = layers.reduce(
    (duration, layer) =>
      Math.max(duration, (layer.delay || 0) + (layer.duration || 0.06) + 0.05),
    0.08
  )
  const frameCount = Math.ceil(totalSeconds * sampleRate)
  const buffer = context.createBuffer(1, frameCount, sampleRate)
  const channel = buffer.getChannelData(0)

  layers.forEach((layer) => {
    const startFrame = Math.floor((layer.delay || 0) * sampleRate)
    const durationFrames = Math.max(
      1,
      Math.floor((layer.duration || 0.06) * sampleRate)
    )
    const gain = layer.gain ?? 0.2
    const pitchBend = layer.pitchBend ?? 0
    const lowpassAlpha = layer.lowpass
      ? getLowpassAlpha(layer.lowpass, sampleRate)
      : null
    const highpassAlpha = layer.highpass
      ? getHighpassAlpha(layer.highpass, sampleRate)
      : null
    let highpassInput = 0
    let highpassOutput = 0
    let lowpassOutput = 0
    let noiseMemory = 0

    for (let frame = 0; frame < durationFrames; frame += 1) {
      const progress = frame / durationFrames
      const frequency = layer.frequency
        ? layer.frequency * (1 + pitchBend * (1 - progress) * 0.01)
        : 0
      const phase = frequency ? (frame / sampleRate) * frequency : 0
      const randomValue = Math.random()
      const rawBody = getSampleValue(layer, phase, randomValue)
      let body =
        layer.type === "noise"
          ? shapeNoise(rawBody, layer, noiseMemory)
          : rawBody
      const envelope = getEnvelope(progress, layer)
      const targetFrame = startFrame + frame

      if (layer.type === "noise") {
        noiseMemory = body
      }

      if (lowpassAlpha) {
        lowpassOutput += lowpassAlpha * (body - lowpassOutput)
        body = lowpassOutput
      }

      if (highpassAlpha) {
        highpassOutput = highpassAlpha * (highpassOutput + body - highpassInput)
        highpassInput = body
        body = highpassOutput
      }

      if (targetFrame < channel.length) {
        channel[targetFrame] += body * gain * envelope
      }
    }
  })

  return normalizeBuffer(buffer, output.targetPeak ?? TARGET_PEAK)
}

export function createAudioContext() {
  if (typeof window === "undefined") {
    return null
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  try {
    return new AudioContextConstructor({
      latencyHint: "interactive",
      sampleRate: 48000,
    })
  } catch {
    return new AudioContextConstructor({ latencyHint: "interactive" })
  }
}

export class AudioMixer {
  buses = new Map()
  context = null
  limiter = null
  masterGain = null

  ensureContext() {
    if (this.context) {
      return this.context
    }

    this.context = createAudioContext()

    if (!this.context) {
      return null
    }

    this.masterGain = this.context.createGain()
    this.limiter = this.context.createDynamicsCompressor()

    this.limiter.threshold.setValueAtTime(-9, this.context.currentTime)
    this.limiter.knee.setValueAtTime(16, this.context.currentTime)
    this.limiter.ratio.setValueAtTime(10, this.context.currentTime)
    this.limiter.attack.setValueAtTime(0.002, this.context.currentTime)
    this.limiter.release.setValueAtTime(0.08, this.context.currentTime)

    this.masterGain.gain.setValueAtTime(0.96, this.context.currentTime)
    this.masterGain.connect(this.limiter)
    this.limiter.connect(this.context.destination)

    return this.context
  }

  async resume() {
    const context = this.ensureContext()

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

  createBuffer(sound) {
    const context = this.ensureContext()

    return createToneBuffer(context, sound?.layers, sound?.output)
  }

  getBus(category = "ui") {
    const context = this.ensureContext()

    if (!context) {
      return null
    }

    if (!this.buses.has(category)) {
      const gain = context.createGain()

      gain.gain.setValueAtTime(1, context.currentTime)
      gain.connect(this.masterGain)
      this.buses.set(category, gain)
    }

    return this.buses.get(category)
  }

  setMasterVolume(volume = 1, muted = false) {
    const context = this.ensureContext()

    if (!context || !this.masterGain) {
      return
    }

    const target = muted ? 0 : clamp(volume)

    this.masterGain.gain.cancelScheduledValues(context.currentTime)
    this.masterGain.gain.setTargetAtTime(target, context.currentTime, 0.012)
  }

  setCategoryVolume(category, volume = 1) {
    const context = this.ensureContext()
    const bus = this.getBus(category)

    if (!context || !bus) {
      return
    }

    bus.gain.cancelScheduledValues(context.currentTime)
    bus.gain.setTargetAtTime(clamp(volume), context.currentTime, 0.012)
  }

  playBuffer(buffer, { category = "ui", gain = 1, rate = 1 } = {}) {
    const context = this.ensureContext()
    const bus = this.getBus(category)

    if (!context || !buffer || !bus) {
      return false
    }

    const source = context.createBufferSource()
    const output = context.createGain()

    source.buffer = buffer
    source.playbackRate.setValueAtTime(rate, context.currentTime)
    output.gain.setValueAtTime(clamp(gain), context.currentTime)
    source.connect(output)
    output.connect(bus)
    source.start(context.currentTime + 0.001)

    return true
  }
}

const audioMixer = new AudioMixer()

export default audioMixer
