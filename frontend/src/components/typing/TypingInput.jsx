function TypingInput({
  typedText,
  handleTyping,
  disabled,
}) {
  return (
    <div className="mt-5">
      <input
        type="text"
        value={typedText}
        onChange={(e) =>
          handleTyping(e.target.value)
        }
        placeholder="Start typing here..."
        disabled={disabled}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-lg text-primary outline-none transition duration-300 placeholder:text-muted focus:border-accent/70 focus:bg-white/[0.05] sm:text-xl"
      />
    </div>
  )
}

export default TypingInput
