import useSoundEngine from "../../hooks/useSoundEngine"

function AudioSettings() {
  useSoundEngine({ globalInteractions: true })

  return null
}

export default AudioSettings
