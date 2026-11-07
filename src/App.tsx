import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { setPageTitle } from './config/branding'
import { PublicHomePage } from './components/home/PublicHomePage'

// Lazy-loaded Admin and Auth modules for optimal initial bundle size
const AdminLoginPage = lazy(() =>
  import('./components/auth/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
)
const AuthCallback = lazy(() =>
  import('./components/auth/AuthCallback').then((m) => ({ default: m.AuthCallback }))
)
const ProtectedRoute = lazy(() =>
  import('./components/admin/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute }))
)
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
const PropertiesManager = lazy(() =>
  import('./components/admin/properties/PropertiesManager').then((m) => ({
    default: m.PropertiesManager
  }))
)
const JobsManager = lazy(() =>
  import('./components/admin/jobs/JobsManager').then((m) => ({ default: m.JobsManager }))
)
const ModerationManager = lazy(() =>
  import('./components/admin/moderation/ModerationManager').then((m) => ({
    default: m.ModerationManager
  }))
)
const VideoConferenceManager = lazy(() =>
  import('./components/admin/conference/VideoConferenceManager').then((m) => ({
    default: m.VideoConferenceManager
  }))
)
const UsersManager = lazy(() =>
  import('./components/admin/users/UsersManager').then((m) => ({ default: m.UsersManager }))
)

const RouteSuspenseFallback = () => (
  <div className="min-h-screen bg-[#06180E] text-[#F8F6F0] flex flex-col items-center justify-center p-6">
    <div className="w-10 h-10 rounded-full border-2 border-[#164E2D] border-t-[#34D399] animate-spin mb-4" />
    <p className="font-mono text-xs uppercase tracking-widest text-[#8FA777]">
      Loading Mountain Console...
    </p>
  </div>
)

export function App() {
  useEffect(() => {
    setPageTitle()
  }, [])

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Suspense fallback={<RouteSuspenseFallback />}>
          <Routes>
            {/* Public Homepage Route */}
            <Route path="/" element={<PublicHomePage />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* OAuth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Admin Console Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/properties" replace />} />
              <Route path="properties" element={<PropertiesManager />} />
              <Route path="jobs" element={<JobsManager />} />
              <Route path="moderation" element={<ModerationManager />} />
              <Route path="conference" element={<VideoConferenceManager />} />
              <Route path="users" element={<UsersManager />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
