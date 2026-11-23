import type { FC, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Compass, Database, Eye } from 'lucide-react'
import type { DataMode } from '../../services/ecosystemService'

// -----------------------------------------------------------------------------
// 1. Loading Skeleton Component
// -----------------------------------------------------------------------------
interface DataLoadingSkeletonProps {
  count?: number
  variant?: 'cards' | 'rows' | 'asymmetric' | 'specimen'
}

export const DataLoadingSkeleton: FC<DataLoadingSkeletonProps> = ({
  count = 3,
  variant = 'cards'
}) => {
  if (variant === 'rows') {
    return (
      <div className="space-y-3 w-full" aria-label="Loading data">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-slate-200 animate-pulse rounded-xl flex items-center justify-between"
          >
            <div className="space-y-2 w-2/3">
              <div className="h-4 bg-slate-200 w-1/3 rounded" />
              <div className="h-3 bg-slate-100 w-1/2 rounded" />
            </div>
            <div className="h-8 bg-slate-200 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'specimen') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0B1B3D] border border-[#1E3A8A] p-6 sm:p-10 rounded-2xl animate-pulse">
        <div className="lg:col-span-6 aspect-[4/3] bg-white/5 rounded-xl" />
        <div className="lg:col-span-6 space-y-4">
          <div className="h-4 bg-white/10 w-1/4 rounded" />
          <div className="h-8 bg-white/15 w-3/4 rounded" />
          <div className="h-4 bg-white/10 w-full rounded" />
          <div className="h-4 bg-white/10 w-2/3 rounded" />
          <div className="h-32 bg-white/5 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" aria-label="Loading data">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 p-6 animate-pulse rounded-2xl space-y-4 shadow-xs"
        >
          <div className="aspect-[16/10] bg-slate-100 rounded-xl w-full" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 w-3/4 rounded" />
            <div className="h-3 bg-slate-100 w-1/2 rounded" />
          </div>
          <div className="h-10 bg-slate-100 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

// -----------------------------------------------------------------------------
// 2. Empty State Component
// -----------------------------------------------------------------------------
interface DataEmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
  secondaryAction?: ReactNode
  isDark?: boolean
}

export const DataEmptyState: FC<DataEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  secondaryAction,
  isDark = false
}) => {
  return (
    <div
      className={`w-full py-14 sm:py-20 px-6 sm:px-12 text-center border ${
        isDark
          ? 'bg-[#0B1B3D]/80 border-[#1E3A8A] text-white'
          : 'bg-white border-slate-200 text-[#0F172A]'
      } rounded-2xl flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm`}
    >
      <div
        className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 ${
          isDark
            ? 'border-sky-500/30 bg-sky-500/10 text-[#38BDF8]'
            : 'border-blue-200 bg-blue-50 text-[#2575fc]'
        }`}
      >
        {icon || <Compass className="w-5 h-5" />}
      </div>

      <div className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#2575fc] mb-2 font-semibold">
        AWAITING CLIENT ENTRIES
      </div>

      <h3
        className={`font-serif text-2xl sm:text-3xl font-normal leading-tight tracking-tight ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-2 text-xs sm:text-sm font-sans font-light max-w-md leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            type="button"
            className="btn-primary px-6 py-2.5 text-xs uppercase tracking-wider"
          >
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryAction}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// 3. Error State Component
// -----------------------------------------------------------------------------
interface DataErrorStateProps {
  message?: string
  onRetry?: () => void
  isDark?: boolean
}

export const DataErrorState: FC<DataErrorStateProps> = ({
  message = 'Unable to establish secure connection with backend database.',
  onRetry,
  isDark = false
}) => {
  return (
    <div
      className={`w-full p-6 sm:p-8 text-center border ${
        isDark
          ? 'bg-[#180A0A]/80 border-red-900/40 text-[#F8FAFC]'
          : 'bg-[#FFF8F6] border-red-200 text-[#0F172A]'
      } rounded-2xl flex flex-col items-center justify-center max-w-xl mx-auto space-y-3`}
    >
      <AlertCircle className="w-6 h-6 text-red-500" />
      <h4 className="font-serif text-xl font-normal text-red-500">Database Connection Notice</h4>
      <p className="text-xs text-slate-600 max-w-md font-sans leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="btn-primary px-5 py-2.5 mt-2 text-xs font-mono uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Query</span>
        </button>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// 4. Data Mode & Environment Control Banner
// -----------------------------------------------------------------------------
interface DataModeBannerProps {
  mode: DataMode
  onToggleMode: (newMode: DataMode) => void
  isSupabaseConnected: boolean
}

export const DataModeBanner: FC<DataModeBannerProps> = ({
  mode,
  onToggleMode,
  isSupabaseConnected
}) => {
  return (
    <div className="w-full bg-[#0B1B3D] border-b border-[#1E3A8A]/60 text-slate-200 text-[11px] font-mono py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2 h-2 rounded-full ${
            mode === 'production'
              ? isSupabaseConnected
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
              : 'bg-[#38BDF8]'
          }`}
        />
        <span className="uppercase tracking-[0.18em]">
          DATA MODE:{' '}
          <strong className="text-white">
            {mode === 'production' ? 'PRODUCTION (LIVE DATABASE)' : 'DEVELOPMENT PREVIEW'}
          </strong>
        </span>
        <span className="text-white/30">•</span>
        <span className="text-slate-400 hidden md:inline">
          {mode === 'production'
            ? isSupabaseConnected
              ? 'Supabase backend connected'
              : 'Supabase credentials awaiting configuration'
            : 'Displaying staging preview specimens for design review'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleMode(mode === 'production' ? 'preview' : 'production')}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider text-[10px] font-semibold border border-white/15 rounded-lg transition-colors cursor-pointer"
        >
          {mode === 'production' ? (
            <>
              <Eye className="w-3 h-3 text-[#38BDF8]" />
              <span>Switch to Preview Data</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3 text-[#38BDF8]" />
              <span>Switch to Live Production Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
