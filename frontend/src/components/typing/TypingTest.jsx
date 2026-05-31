import TypingStats from "./TypingStats"
import TypingText from "./TypingText"
import TypingInput from "./TypingInput"
import CompletionCard from "./CompletionCard"

import typingWords from "../../data/typingWords"

import useTyping from "../../hooks/useTyping"
import useTimer from "../../hooks/useTimer"
import useSoundEngine from "../../hooks/useSoundEngine"

import {
  calculateAccuracy,
  calculateWPM,
} from "../../utils/calculateStats"

function TypingTest() {
  const text = typingWords[0]
  const { play } = useSoundEngine()

  const {
    typedText,
    currentIndex,
    handleTyping,
    isTyping,
    isCompleted,
    resetTyping,
  } = useTyping(text)

  const {
    timeLeft,
    resetTimer,
  } = useTimer(
    isTyping,
    isCompleted
  )

  const timeSpent = 60 - timeLeft

  const accuracy = calculateAccuracy(
    text,
    typedText
  )

  const wpm = calculateWPM(
    typedText,
    timeSpent
  )

  const sessionEnded =
    timeLeft === 0 || isCompleted

  function handleRestart() {
    resetTyping()
    resetTimer()
  }

  function handleTypingWithSound(nextValue) {
    if (nextValue.length > typedText.length) {
      const addedCharacters = nextValue.slice(typedText.length)

      addedCharacters.split("").forEach((character, offset) => {
        const expectedCharacter = text[typedText.length + offset]

        play(character === expectedCharacter ? "correct" : "wrong")
      })
    }

    handleTyping(nextValue)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {!sessionEnded ? (
          <>
            <TypingStats
              wpm={wpm}
              accuracy={accuracy}
              timeLeft={timeLeft}
            />

            <TypingText
              text={text}
              typedText={typedText}
              currentIndex={currentIndex}
            />

            <TypingInput
              typedText={typedText}
              handleTyping={handleTypingWithSound}
              disabled={sessionEnded}
            />
          </>
        ) : (
          <CompletionCard
            wpm={wpm}
            accuracy={accuracy}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  )
}

export default TypingTest
