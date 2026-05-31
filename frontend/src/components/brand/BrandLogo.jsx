function BrandLogo({
  className = "",
  imageClassName = "",
  showWordmark = true,
  size = "md",
}) {
  const sizeClasses = {
    lg: "h-16 w-56 sm:h-[4.5rem] sm:w-64",
    md: "h-10 w-36 sm:h-11 sm:w-44",
    sm: "h-9 w-36",
  }

  return (
    <span
      className={`relative inline-flex shrink-0 items-center overflow-hidden rounded-sm ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <img
        src="/letstype-logo.png"
        alt=""
        className={`h-full w-full object-cover object-center ${imageClassName}`}
      />
      {!showWordmark && <span className="sr-only">LetsType</span>}
    </span>
  )
}

export default BrandLogo
