import { useState } from "react"

function useTyping(initialText) {
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const currentIndex = typedText.length

  const isCompleted =
    typedText.length === initialText.length

  function handleTyping(value) {
    if (isCompleted) return

    if (!isTyping && value.length > 0) {
      setIsTyping(true)
    }

    if (value.length <= typedText.length) {
      return
    }

    const addedCharacters = value.slice(typedText.length)
    let acceptedText = typedText

    for (const character of addedCharacters) {
      if (acceptedText.length >= initialText.length) {
        break
      }

      if (character === initialText[acceptedText.length]) {
        acceptedText += character
      }
    }

    setTypedText(acceptedText)
  }

  function resetTyping() {
    setTypedText("")
    setIsTyping(false)
  }

  return {
    typedText,
    currentIndex,
    handleTyping,
    isTyping,
    isCompleted,
    resetTyping,
  }
}

export default useTyping
