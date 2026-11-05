import type { FC } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import type { AdminJob } from '../../../types'

interface JobDeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  job: AdminJob | null
  isDeleting: boolean
}

export const JobDeleteConfirmModal: FC<JobDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  job,
  isDeleting
}) => {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border border-red-300 text-[#123D2D] w-full max-w-md rounded-sm shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#CBDAC4]">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-serif text-lg font-normal">Confirm Deletion</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-[#576159] hover:text-[#123D2D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-[#576159] leading-relaxed">
            Are you sure you want to permanently delete the residency listing{' '}
            <strong className="text-[#123D2D] font-semibold font-mono">
              "{job.title}"
            </strong>{' '}
            posted by <span className="font-semibold">{job.employer}</span>?
          </p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-[11px] font-mono text-red-800">
            ⚠️ This operation will remove the listing from PostgreSQL immediately. Any pending applicant records linked to this job will have their reference set to null.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#CBDAC4]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#CBDAC4] text-xs font-mono text-[#576159] hover:bg-white rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
