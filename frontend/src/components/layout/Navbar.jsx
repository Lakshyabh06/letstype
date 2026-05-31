import { Link, NavLink } from "react-router-dom"

import BrandLogo from "../brand/BrandLogo"
import { preloadRoute } from "../../utils/routePreloader"

const navItems = [
  { label: "Home", preloadId: "home", to: "/" },
  { label: "Lessons", preloadId: "lessons", to: "/lessons" },
  { label: "Practice", preloadId: "practice", to: "/practice" },
  { label: "Settings", preloadId: "profile", to: "/settings" },
]

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-primary shadow-[0_10px_30px_rgba(216,199,163,0.08)]"
      : "rounded-full border border-transparent px-3 py-2 text-muted transition duration-200 hover:border-white/10 hover:bg-white/[0.035] hover:text-primary"

  return (
    <nav className="flex min-w-0 items-center justify-between gap-3 py-6 sm:py-8">
      <Link
        to="/"
        className="flex min-w-0 shrink-0 items-center rounded-full transition duration-300 hover:opacity-90"
        aria-label="LetsType home"
      >
        <BrandLogo
          className="max-w-[84px] overflow-hidden sm:max-w-[190px]"
          imageClassName="max-w-full"
          size="md"
        />
      </Link>

      <div className="flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-[0.72rem] font-medium sm:gap-2 sm:text-sm lg:text-base">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navLinkClass}
            onFocus={() => preloadRoute(item.preloadId)}
            onPointerEnter={() => preloadRoute(item.preloadId)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
