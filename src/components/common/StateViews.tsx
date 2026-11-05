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
            className="p-5 bg-[#F8F6F0] border border-[#CBDAC4] animate-pulse rounded-sm flex items-center justify-between"
          >
            <div className="space-y-2 w-2/3">
              <div className="h-4 bg-[#CBDAC4] w-1/3 rounded" />
              <div className="h-3 bg-[#CBDAC4]/60 w-1/2 rounded" />
            </div>
            <div className="h-8 bg-[#CBDAC4]/50 w-24 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'specimen') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0B2516] border border-[#1F4E34] p-6 sm:p-10 animate-pulse">
        <div className="lg:col-span-6 aspect-[4/3] bg-white/5 rounded-none" />
        <div className="lg:col-span-6 space-y-4">
          <div className="h-4 bg-white/10 w-1/4 rounded" />
          <div className="h-8 bg-white/15 w-3/4 rounded" />
          <div className="h-4 bg-white/10 w-full rounded" />
          <div className="h-4 bg-white/10 w-2/3 rounded" />
          <div className="h-32 bg-white/5 w-full rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" aria-label="Loading data">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#F8F6F0] border border-[#CBDAC4] p-6 animate-pulse rounded-sm space-y-4"
        >
          <div className="aspect-[16/10] bg-[#CBDAC4]/60 rounded-none w-full" />
          <div className="space-y-2">
            <div className="h-5 bg-[#CBDAC4] w-3/4 rounded" />
            <div className="h-3 bg-[#CBDAC4]/60 w-1/2 rounded" />
          </div>
          <div className="h-10 bg-[#CBDAC4]/40 w-full rounded-sm" />
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
          ? 'bg-[#0B2516]/60 border-white/10 text-[#F8F6F0]'
          : 'bg-[#F8F6F0] border-[#CBDAC4] text-[#202622]'
      } rounded-sm flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm`}
    >
      <div
        className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 ${
          isDark
            ? 'border-white/20 bg-white/5 text-[#8FA777]'
            : 'border-[#285A40]/30 bg-[#E8EFE3] text-[#285A40]'
        }`}
      >
        {icon || <Compass className="w-5 h-5" />}
      </div>

      <div className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#8FA777] mb-2 font-semibold">
        AWAITING CLIENT ENTRIES
      </div>

      <h3
        className={`font-serif text-2xl sm:text-3xl font-normal leading-tight ${
          isDark ? 'text-white' : 'text-[#123D2D]'
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-2 text-xs sm:text-sm font-sans font-light max-w-md leading-relaxed ${
          isDark ? 'text-[#E7EFE3]/80' : 'text-[#576159]'
        }`}
      >
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            type="button"
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold rounded-none transition-all shadow-sm active:scale-[0.98] ${
              isDark
                ? 'bg-[#FDFBF7] text-[#0B2516] hover:bg-white'
                : 'bg-[#123D2D] text-[#F8F6F0] hover:bg-[#06180E]'
            }`}
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
          ? 'bg-[#180A0A]/80 border-red-900/40 text-[#F8F6F0]'
          : 'bg-[#FFF8F6] border-red-200 text-[#202622]'
      } rounded-sm flex flex-col items-center justify-center max-w-xl mx-auto space-y-3`}
    >
      <AlertCircle className="w-6 h-6 text-red-500" />
      <h4 className="font-serif text-xl font-normal text-red-400">Database Connection Notice</h4>
      <p className="text-xs text-[#576159] max-w-md font-sans leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-[#123D2D] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#06180E] transition-colors"
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
    <div className="w-full bg-[#06180E] border-b border-white/10 text-[#E7EFE3] text-[11px] font-mono py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2 h-2 rounded-full ${
            mode === 'production'
              ? isSupabaseConnected
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
              : 'bg-[#8FA777]'
          }`}
        />
        <span className="uppercase tracking-[0.18em]">
          DATA MODE:{' '}
          <strong className="text-white">
            {mode === 'production' ? 'PRODUCTION (LIVE DATABASE)' : 'DEVELOPMENT PREVIEW'}
          </strong>
        </span>
        <span className="text-white/30">•</span>
        <span className="text-white/60 hidden md:inline">
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
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-[#FDFBF7] uppercase tracking-wider text-[10px] font-semibold border border-white/15 rounded-sm transition-colors"
        >
          {mode === 'production' ? (
            <>
              <Eye className="w-3 h-3 text-[#8FA777]" />
              <span>Switch to Preview Data</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3 text-[#8FA777]" />
              <span>Switch to Live Production Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
