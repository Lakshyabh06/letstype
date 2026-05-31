import Keyboard from "../keyboard/Keyboard"
import { learningKeyboardLayout } from "../../data/keyboardLayout"

function KeyboardPreview({ activeKeys = [], compact = false }) {
  return (
    <Keyboard
      activeKeys={activeKeys}
      compactMode={compact}
      layout={learningKeyboardLayout}
      showFingerHints={!compact}
      className="mx-auto max-w-xl"
    />
  )
}

export default KeyboardPreview
