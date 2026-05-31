import { FINGER_IDS, HAND_IDS, fingersByHand } from "../../data/fingerMap"
import FingerHighlight from "./FingerHighlight"

const leftSlots = {
  [FINGER_IDS.LEFT_PINKY]: {
    bottom: "42%",
    height: "34%",
    left: "9%",
    transform: "rotate(-8deg)",
    width: "13%",
  },
  [FINGER_IDS.LEFT_RING]: {
    bottom: "44%",
    height: "43%",
    left: "24%",
    transform: "rotate(-3deg)",
    width: "14%",
  },
  [FINGER_IDS.LEFT_MIDDLE]: {
    bottom: "45%",
    height: "49%",
    left: "39%",
    transform: "rotate(1deg)",
    width: "14%",
  },
  [FINGER_IDS.LEFT_INDEX]: {
    bottom: "43%",
    height: "44%",
    left: "54%",
    transform: "rotate(5deg)",
    width: "14%",
  },
  [FINGER_IDS.LEFT_THUMB]: {
    borderRadius: "999px 999px 22px 999px",
    bottom: "18%",
    height: "26%",
    left: "65%",
    transform: "rotate(42deg)",
    width: "16%",
  },
}

const rightSlots = {
  [FINGER_IDS.RIGHT_THUMB]: {
    borderRadius: "999px 999px 999px 22px",
    bottom: "18%",
    height: "26%",
    left: "19%",
    transform: "rotate(-42deg)",
    width: "16%",
  },
  [FINGER_IDS.RIGHT_INDEX]: {
    bottom: "43%",
    height: "44%",
    left: "32%",
    transform: "rotate(-5deg)",
    width: "14%",
  },
  [FINGER_IDS.RIGHT_MIDDLE]: {
    bottom: "45%",
    height: "49%",
    left: "47%",
    transform: "rotate(-1deg)",
    width: "14%",
  },
  [FINGER_IDS.RIGHT_RING]: {
    bottom: "44%",
    height: "43%",
    left: "62%",
    transform: "rotate(3deg)",
    width: "14%",
  },
  [FINGER_IDS.RIGHT_PINKY]: {
    bottom: "42%",
    height: "34%",
    left: "77%",
    transform: "rotate(8deg)",
    width: "13%",
  },
}

const palmSlots = {
  [HAND_IDS.LEFT]: {
    borderRadius: "42% 48% 32% 38%",
    left: "16%",
  },
  [HAND_IDS.RIGHT]: {
    borderRadius: "48% 42% 38% 32%",
    left: "20%",
  },
}

function HandOverlay({
  activeFingerIds = [],
  compactMode = false,
  hand = HAND_IDS.LEFT,
  primaryFingerId,
  pressedFingerIds = [],
  showHomeRow = true,
  wrongFingerIds = [],
}) {
  const fingers = fingersByHand[hand] || []
  const slots = hand === HAND_IDS.LEFT ? leftSlots : rightSlots
  const isActiveHand = fingers.some((finger) => activeFingerIds.includes(finger.id))

  function getStatus(fingerId) {
    if (wrongFingerIds.includes(fingerId)) {
      return "wrong"
    }

    if (pressedFingerIds.includes(fingerId)) {
      return "pressed"
    }

    return activeFingerIds.includes(fingerId) ? "active" : "idle"
  }

  return (
    <div
      className={`relative overflow-hidden border transition duration-300 ${
        compactMode ? "min-h-44 rounded-2xl p-3" : "min-h-64 rounded-3xl p-4"
      } ${
        isActiveHand
          ? "border-white/16 bg-white/[0.052]"
          : "border-white/10 bg-white/[0.032]"
      }`}
      aria-label={`${hand} hand finger guide`}
    >
      <div className="absolute inset-x-6 top-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div
        className={`relative mx-auto aspect-[1.04/1] w-full ${
          compactMode ? "max-w-[220px]" : "max-w-[320px]"
        }`}
      >
        <div
          className="absolute bottom-[14%] h-[38%] w-[64%] border border-white/10 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          style={palmSlots[hand]}
        />
        <div
          className="absolute bottom-[26%] h-[22%] w-[48%] rounded-full border border-white/10 bg-background/35"
          style={{
            left: hand === HAND_IDS.LEFT ? "28%" : "24%",
          }}
        />

        {fingers.map((finger) => (
          <FingerHighlight
            key={finger.id}
            finger={finger}
            isActive={activeFingerIds.includes(finger.id)}
            isHome={showHomeRow && finger.label !== "Thumb"}
            isPrimary={primaryFingerId === finger.id}
            slot={slots[finger.id]}
            status={getStatus(finger.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default HandOverlay
