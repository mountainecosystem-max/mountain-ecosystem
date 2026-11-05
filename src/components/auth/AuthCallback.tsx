import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { verifyAdminAuthorization } from '../../context/AdminAuthContext'
import { BRAND_CONFIG, setPageTitle } from '../../config/branding'
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'

export const AuthCallback: FC = () => {
  const navigate = useNavigate()
  const isHandledRef = useRef(false)

  useEffect(() => {
    setPageTitle('Authenticating Session')

    if (isHandledRef.current) return
    isHandledRef.current = true

    const processAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get('code')
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code)
          } catch {
            // Ignore if already exchanged
          }
        }

        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await verifyAdminAuthorization(session.user)
          if (profile) {
            navigate('/admin/destinations', { replace: true })
            return
          }
        }
        navigate('/', { replace: true })
      } catch {
        navigate('/', { replace: true })
      }
    }

    processAuth()
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#06180E] text-[#F8F6F0] flex flex-col justify-between">
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#8FA777]" />
          <span>RETURN TO HOMEPAGE</span>
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#8FA777]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SESSION AUTHENTICATION</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0B2516] border border-[#1F4E34] p-8 sm:p-10 shadow-2xl rounded-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-[#8FA777]/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#8FA777] animate-spin" />
          </div>
          <h2 className="font-serif text-xl text-white font-medium">
            Verifying Session
          </h2>
          <p className="text-xs font-mono text-white/60 leading-relaxed">
            Connecting to Mountain Ecosystem...
          </p>
        </div>
      </main>

      <footer className="p-6 text-center text-[10px] font-mono text-white/40 border-t border-white/10 uppercase tracking-wider">
        {BRAND_CONFIG.name} PLATFORM • {BRAND_CONFIG.region}
      </footer>
    </div>
  )
}
