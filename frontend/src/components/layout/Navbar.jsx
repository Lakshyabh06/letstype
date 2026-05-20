import { NavLink } from "react-router-dom"

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-accent"
      : "text-muted hover:text-primary transition"

  return (
    <nav className="flex items-center justify-between py-10">
      <h1 className="text-5xl font-bold text-accent tracking-tight">
        TypeLearner
      </h1>

      <div className="flex gap-12 text-xl font-medium">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>

        <NavLink to="/lessons" className={navLinkClass}>
          Lessons
        </NavLink>

        <NavLink to="/profile" className={navLinkClass}>
          Profile
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
