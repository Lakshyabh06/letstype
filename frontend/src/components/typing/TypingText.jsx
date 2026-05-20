function TypingText({ text, typedText, currentIndex }) {
  return (
    <div className="bg-surface min-h-[220px] p-14 rounded-[32px] text-5xl leading-loose tracking-wide border border-white/5 shadow-2xl">
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
