import { useState, useEffect, useCallback } from 'react'
import type { FC, FormEvent } from 'react'
import {
  Users,
  Shield,
  KeyRound,
  ShieldAlert,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mail,
  UserCheck
} from 'lucide-react'
import { useAdminAuth } from '../../../context/AdminAuthContext'
import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import { BRAND_CONFIG } from '../../../config/branding'

interface AdminUserRow {
  id: string
  email: string
  role: 'superadmin' | 'admin' | 'editor' | 'moderator'
  created_at: string
}

export const UsersManager: FC = () => {
  const { profile, user } = useAdminAuth()
  const isSuperadmin = profile?.role === 'superadmin'

  const [adminList, setAdminList] = useState<AdminUserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add admin modal/form state
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'moderator'>('admin')
  const [isAdding, setIsAdding] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadAdmins = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setAdminList(data || [])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to query admin_users')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setIsAdding(true)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: newEmail.trim().toLowerCase(),
          role: newRole
        })
        .select()
        .single()

      if (error) {
        showToast(`Error: ${error.message}`)
      } else if (data) {
        setAdminList((prev) => [...prev, data])
        showToast(`Granted ${newRole} privileges to ${newEmail}`)
        setNewEmail('')
      }
    } catch {
      showToast('Failed to add administrator')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveAdmin = async (admin: AdminUserRow) => {
    if (admin.email === user?.email) {
      alert('You cannot revoke administrative privileges from your own currently authenticated session.')
      return
    }

    if (!confirm(`Are you sure you want to revoke administrative access for ${admin.email}?`)) {
      return
    }

    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', admin.id)
      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setAdminList((prev) => prev.filter((a) => a.id !== admin.id))
        showToast(`Revoked privileges for ${admin.email}`)
      }
    } catch {
      showToast('Failed to revoke privileges')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#123D2D] text-[#F8F6F0] border border-[#8FA777]/50 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8FA777]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#CBDAC4]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-[#285A40] font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-[#285A40]" />
            <span>MODULE 06 • ACCESS CONTROL & STAFF ROLES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            User Management & Administrative Roles
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Manage authenticated regional stewards, platform staff, and host permissions via the secure admin_users table.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdmins}
          disabled={isLoading}
          className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
          title="Refresh administrators"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Current Active User Profile Card */}
      <div className="bg-white border border-[#CBDAC4] p-6 rounded-sm shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#CBDAC4] pb-3">
          <KeyRound className="w-4 h-4 text-[#285A40]" />
          <h2 className="font-serif text-lg text-[#123D2D] font-medium">Currently Authenticated Staff Session</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#576159] uppercase text-[10px] block">Staff Name</span>
            <span className="text-[#123D2D] font-semibold text-sm">{profile?.fullName || `${BRAND_CONFIG.shortName} Administrator`}</span>
          </div>

          <div>
            <span className="text-[#576159] uppercase text-[10px] block">Email Account</span>
            <span className="text-[#123D2D] font-semibold text-sm truncate block">{user?.email || BRAND_CONFIG.supportEmail}</span>
          </div>

          <div>
            <span className="text-[#576159] uppercase text-[10px] block">Role Permission</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 mt-1 uppercase text-[10px] font-bold">
              <Shield className="w-3 h-3" />
              <span>{profile?.role || 'admin'}</span>
            </span>
          </div>

          <div>
            <span className="text-[#576159] uppercase text-[10px] block">Supabase User UID</span>
            <span className="text-[#576159] font-mono text-[11px] truncate block mt-1">{user?.id || '—'}</span>
          </div>
        </div>
      </div>

      {/* Grant Access Form (Superadmins Only) */}
      {isSuperadmin && (
        <div className="bg-white border border-[#CBDAC4] p-6 rounded-sm shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#CBDAC4] pb-3">
            <UserCheck className="w-4 h-4 text-[#285A40]" />
            <h2 className="font-serif text-lg text-[#123D2D] font-medium">Grant Administrative Role to Staff</h2>
          </div>

          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={`coordinator@${BRAND_CONFIG.name.toLowerCase().replace(/\s+/g, '-')}.org`}
                  className="w-full bg-[#FAF8F5] border border-[#CBDAC4] pl-9 pr-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Assigned Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'editor' | 'moderator')}
                className="w-full bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              >
                <option value="admin">Admin (Full Content CRUD)</option>
                <option value="editor">Editor (Draft & Review)</option>
                <option value="moderator">Moderator (Applications & Inquiries)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 bg-[#123D2D] hover:bg-[#285A40] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Granting...' : 'Provision Role'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Active Admin Users Table */}
      <div className="bg-white border border-[#CBDAC4] rounded-sm overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#CBDAC4] bg-[#FAF8F5] flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold">
            Authorized Platform Administrators ({adminList.length})
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-[#576159]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#285A40] mb-2" />
            <span>Loading admin_users table...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-xs font-mono text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF8F5] border-b border-[#CBDAC4] text-[#576159] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Provisioned Date</th>
                  {isSuperadmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBDAC4]/60">
                {adminList.map((adm) => {
                  const isCurrent = adm.email.toLowerCase() === user?.email?.toLowerCase()
                  return (
                    <tr key={adm.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[#123D2D] font-medium">{adm.email}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#285A40] text-white rounded-xs">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-full font-bold ${
                            adm.role === 'superadmin'
                              ? 'bg-purple-100 text-purple-800'
                              : adm.role === 'admin'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {adm.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#576159] text-[11px]">
                        {new Date(adm.created_at).toLocaleDateString()}
                      </td>

                      {isSuperadmin && (
                        <td className="py-3 px-4 text-right">
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAdmin(adm)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm"
                              title="Revoke access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff Invitation Guide */}
      <div className="bg-[#E8EFE3] border border-[#285A40]/30 p-6 rounded-sm text-xs space-y-2">
        <div className="flex items-center gap-2 text-[#123D2D] font-bold font-mono uppercase text-[11px]">
          <ShieldAlert className="w-4 h-4 text-[#285A40]" />
          <span>Security Protocol & Role Architecture</span>
        </div>
        <p className="text-[#576159] leading-relaxed font-sans">
          Accounts must first be registered in Supabase Authentication (<strong className="text-[#123D2D]">Authentication → Users → Add User</strong>) so they possess verified cryptographic credentials. Once registered, add their email above to grant role-based database privileges.
        </p>
      </div>
    </div>
  )
}
