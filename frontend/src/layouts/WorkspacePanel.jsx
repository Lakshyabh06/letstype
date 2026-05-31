import AnimatedPanel from "../components/motion/AnimatedPanel"

function WorkspacePanel({ as: Component = "section", children, className = "" }) {
  return (
    <AnimatedPanel
      as={Component}
      className={`min-w-0 rounded-[28px] border border-white/10 bg-surface/72 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur ${className}`}
    >
      {children}
    </AnimatedPanel>
  )
}

export default WorkspacePanel
