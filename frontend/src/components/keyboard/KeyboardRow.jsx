import { memo } from "react"

import fingerMap from "../../data/fingerMap"
import KeyButton from "./KeyButton"

function KeyboardRow({
  canGlow,
  row,
  activeKeys,
  pressedKeys,
  wrongKeys,
  showFingerHints,
  shouldAnimate,
  compactMode,
  onKeySelect,
}) {
  return (
    <div
      className={`flex w-full ${
        compactMode ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2"
      }`}
      aria-label={row.label}
    >
      {row.keys.map((keyData) => (
        <KeyButton
          key={keyData.id}
          canGlow={canGlow}
          keyData={keyData}
          finger={fingerMap[keyData.finger]}
          activeKeys={activeKeys}
          pressedKeys={pressedKeys}
          wrongKeys={wrongKeys}
          showFingerHints={showFingerHints}
          shouldAnimate={shouldAnimate}
          compactMode={compactMode}
          onKeySelect={onKeySelect}
        />
      ))}
    </div>
  )
}

export default memo(KeyboardRow)
