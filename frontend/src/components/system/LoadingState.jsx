import BrandLogo from "../brand/BrandLogo"
import SkeletonPanel from "./SkeletonPanel"

function LoadingState({ label = "Preparing LetsType" }) {
  return (
    <main className="px-3 pb-8 sm:px-5 lg:px-6" aria-busy="true">
      <div className="mx-auto grid max-w-[1800px] gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[28px] border border-white/10 bg-surface/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6">
          <BrandLogo className="mb-5 max-w-[180px] overflow-hidden" size="md" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            {label}
          </p>
          <div className="mt-5 space-y-4">
            <SkeletonPanel className="h-20" />
            <SkeletonPanel className="h-72" />
            <div className="grid gap-3 md:grid-cols-3">
              <SkeletonPanel className="h-24" />
              <SkeletonPanel className="h-24" />
              <SkeletonPanel className="h-24" />
            </div>
          </div>
        </section>
        <aside className="hidden min-w-0 space-y-4 xl:block">
          <SkeletonPanel className="h-44" />
          <SkeletonPanel className="h-64" />
        </aside>
      </div>
    </main>
  )
}

export default LoadingState
