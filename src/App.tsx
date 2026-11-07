import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { setPageTitle } from './config/branding'
import { PublicHomePage } from './components/home/PublicHomePage'
import { AdminLoginPage } from './components/auth/AdminLoginPage'
import { AuthCallback } from './components/auth/AuthCallback'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { PropertiesManager } from './components/admin/properties/PropertiesManager'
import { JobsManager } from './components/admin/jobs/JobsManager'
import { ModerationManager } from './components/admin/moderation/ModerationManager'
import { VideoConferenceManager } from './components/admin/conference/VideoConferenceManager'
import { UsersManager } from './components/admin/users/UsersManager'

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
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
