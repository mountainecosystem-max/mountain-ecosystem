import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { AdminSidebar } from './AdminSidebar'
import { setPageTitle } from '../../config/branding'

export const AdminLayout: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setPageTitle('Admin Console')
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#202622] flex flex-col font-sans selection:bg-[#8FA777]/30 selection:text-[#0B2516]">
      {/* Top Admin Navbar */}
      <AdminNavbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
