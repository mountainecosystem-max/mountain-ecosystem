import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { setPageTitle } from './config/branding'
import { PublicHomePage } from './components/home/PublicHomePage'
import { AdminLoginPage } from './components/auth/AdminLoginPage'
import { AuthCallback } from './components/auth/AuthCallback'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { DestinationsManager } from './components/admin/destinations/DestinationsManager'
import { JobsManager } from './components/admin/jobs/JobsManager'
import { PropertiesManager } from './components/admin/properties/PropertiesManager'
import { ModerationManager } from './components/admin/moderation/ModerationManager'
import { BusinessesManager } from './components/admin/businesses/BusinessesManager'
import { UsersManager } from './components/admin/users/UsersManager'
import { VideoConferenceManager } from './components/admin/conference/VideoConferenceManager'

export function App() {
  useEffect(() => {
    setPageTitle()
  }, [])

  return (
    <BrowserRouter>
      <AdminAuthProvider>
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
            <Route index element={<Navigate to="/admin/destinations" replace />} />
            <Route path="properties" element={<PropertiesManager />} />
            <Route path="jobs" element={<JobsManager />} />
            <Route path="moderation" element={<ModerationManager />} />
            <Route path="conference" element={<VideoConferenceManager />} />
            <Route path="destinations" element={<DestinationsManager />} />
            <Route path="businesses" element={<BusinessesManager />} />
            <Route path="users" element={<UsersManager />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
