import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import AudioSettings from "./components/audio/AudioSettings"
import ErrorBoundary from "./components/system/ErrorBoundary"
import LoadingState from "./components/system/LoadingState"
import PerformanceOverlay from "./components/system/PerformanceOverlay"
import MainLayout from "./layouts/MainLayout"
import { preloadPrimaryRoutes, routePreloaders } from "./utils/routePreloader"

const Home = lazy(routePreloaders.home)
const Lessons = lazy(routePreloaders.lessons)
const Practice = lazy(routePreloaders.practice)
const Profile = lazy(routePreloaders.profile)
const NotFound = lazy(routePreloaders.notFound)

function PageSuspense({ children }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>
}

function App() {
  useEffect(() => preloadPrimaryRoutes(), [])

  return (
    <BrowserRouter>
      <AudioSettings />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PageSuspense>
                  <Home />
                </PageSuspense>
              }
            />
            <Route
              path="lessons"
              element={
                <PageSuspense>
                  <Lessons />
                </PageSuspense>
              }
            />
            <Route
              path="practice"
              element={
                <PageSuspense>
                  <Practice />
                </PageSuspense>
              }
            />
            <Route
              path="profile"
              element={
                <PageSuspense>
                  <Profile />
                </PageSuspense>
              }
            />
            <Route
              path="settings"
              element={
                <PageSuspense>
                  <Profile />
                </PageSuspense>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <PageSuspense>
                <NotFound />
              </PageSuspense>
            }
          />
        </Routes>
      </ErrorBoundary>
      <PerformanceOverlay />
    </BrowserRouter>
  )
}

export default App
