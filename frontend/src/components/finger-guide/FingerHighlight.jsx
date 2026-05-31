function FingerHighlight({
  finger,
  isActive = false,
  isHome = false,
  isPrimary = false,
  slot,
  status = "idle",
}) {
  const isError = status === "wrong"
  const isPressed = status === "pressed"
  const glow = isError
    ? "rgba(224, 131, 104, 0.34)"
    : finger?.glowColor || "rgba(216, 199, 163, 0.22)"
  const fill = isError
    ? "rgba(224, 131, 104, 0.2)"
    : isActive || isPressed
      ? finger?.softColor || "rgba(216, 199, 163, 0.14)"
      : "rgba(255, 255, 255, 0.052)"
  const border = isError
    ? "rgba(224, 131, 104, 0.72)"
    : isActive || isPressed
      ? finger?.color || "rgba(216, 199, 163, 0.72)"
      : "rgba(255, 255, 255, 0.11)"

  return (
    <div
      aria-label={finger ? `${finger.hand} ${finger.label}` : undefined}
      className={`absolute flex items-end justify-center rounded-t-full border transition duration-300 ${
        isPrimary ? "z-20" : "z-10"
      }`}
      style={{
        ...slot,
        background: fill,
        borderColor: border,
        boxShadow:
          isActive || isPressed || isError
            ? `0 0 0 1px ${glow}, 0 18px 42px ${glow}`
            : "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <span
        className={`mb-2 rounded-full transition duration-300 ${
          isActive || isPressed || isError
            ? "h-2.5 w-2.5 opacity-100"
            : "h-1.5 w-1.5 opacity-45"
        }`}
        style={{
          backgroundColor: isError ? "var(--color-error)" : finger?.color,
        }}
      />

      {isHome && (
        <span
          className="absolute -bottom-7 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/10 bg-background/70 px-2 text-[0.62rem] font-semibold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          style={{
            color: isActive ? finger?.color : undefined,
          }}
        >
          {finger?.homeKey}
        </span>
      )}
    </div>
  )
}

export default FingerHighlight
