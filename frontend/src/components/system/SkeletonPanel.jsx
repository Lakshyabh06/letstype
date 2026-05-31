function SkeletonPanel({ className = "" }) {
  return (
    <div
      className={`skeleton-panel rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
      aria-hidden="true"
    />
  )
}

export default SkeletonPanel
