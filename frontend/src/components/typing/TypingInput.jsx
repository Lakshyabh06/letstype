function TypingInput({
  typedText,
  handleTyping,
  disabled,
}) {
  return (
    <div className="mt-10">
      <input
        type="text"
        value={typedText}
        onChange={(e) =>
          handleTyping(e.target.value)
        }
        placeholder="Start typing here..."
        disabled={disabled}
        className="w-full p-7 text-2xl rounded-[28px] bg-[#11151C] text-primary outline-none border border-white/5 focus:border-accent transition shadow-2xl placeholder:text-muted"
      />
    </div>
  )
}

export default TypingInput
