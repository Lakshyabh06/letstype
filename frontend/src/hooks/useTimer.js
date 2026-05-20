import { useEffect, useState } from "react"

function useTimer(isTyping, isCompleted) {
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    if (!isTyping) return

    if (timeLeft <= 0) return

    if (isCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isTyping, timeLeft, isCompleted])

  function resetTimer() {
    setTimeLeft(60)
  }

  return {
    timeLeft,
    resetTimer,
  }
}

export default useTimer
