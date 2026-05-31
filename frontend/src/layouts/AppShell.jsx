import AnimatedPanel from "../components/motion/AnimatedPanel"

function AppShell({ sidebar, children, secondary }) {
  return (
    <div className="min-w-0 px-3 pb-4 sm:px-5 lg:px-6">
      <div className="mx-auto grid min-w-0 max-w-[var(--workspace-max,1800px)] gap-4 lg:h-[calc(100svh-104px)] lg:min-h-[680px] lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)_minmax(330px,360px)] 2xl:grid-cols-[minmax(300px,340px)_minmax(0,1fr)_minmax(360px,390px)]">
        <AnimatedPanel as="div" className="min-h-0 min-w-0 lg:h-full lg:overflow-hidden" variant="reveal">
          {sidebar}
        </AnimatedPanel>

        <AnimatedPanel as="main" className="min-h-0 min-w-0 lg:h-full" variant="workspace">
          {children}
        </AnimatedPanel>

        {secondary && (
          <AnimatedPanel as="aside" className="hidden min-h-0 min-w-0 xl:block xl:h-full" variant="reveal">
            {secondary}
          </AnimatedPanel>
        )}
      </div>
    </div>
  )
}

export default AppShell
