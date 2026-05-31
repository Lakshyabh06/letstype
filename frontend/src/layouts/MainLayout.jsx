import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import useSettingsManager from "../hooks/useSettingsManager"
import { rememberLastRoute } from "../utils/workspacePersistence"

function MainLayout() {
  const location = useLocation()
  const { settings } = useSettingsManager()

  useEffect(() => {
    rememberLastRoute(location.pathname)
  }, [location.pathname])

  return (
    <div
      className="min-h-screen bg-background text-primary bg-[linear-gradient(180deg,#0B0D0E_0%,#11100F_48%,#0B0D0E_100%)]"
      style={{
        "--accent-intensity": settings.theme.colorIntensity || 0.72,
        "--workspace-max": settings.workspace.compactMode ? "1600px" : "1880px",
      }}
    >
      <div>
        <div className="mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-10">
          <Navbar />
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
