function TypingText({ text, typedText, currentIndex }) {
  return (
    <div className="min-h-[220px] rounded-[28px] border border-white/10 bg-surface/80 p-7 text-3xl leading-relaxed shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur sm:p-10 sm:text-4xl sm:leading-loose">
      {text.split("").map((char, index) => {
        let textColor = "text-muted"

        if (index < typedText.length) {
          textColor =
            typedText[index] === char
              ? "text-primary"
              : "text-error"
        }

        const isCurrent = index === currentIndex

        return (
          <span
            key={index}
            className={`${textColor} ${
              isCurrent
                ? "border-l-2 border-accent animate-pulse"
                : ""
            }`}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}

export default TypingText
