import type { FC } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import type { AdminDestination } from '../../../types'

interface DeleteConfirmModalProps {
  destination: AdminDestination | null
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  destination,
  isOpen,
  isDeleting,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !destination) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#576159] hover:text-[#123D2D] rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-serif text-xl text-[#123D2D] font-medium">
          Delete Destination Record?
        </h3>

        <p className="mt-2 text-xs text-[#576159] leading-relaxed font-sans">
          You are about to permanently delete{' '}
          <strong className="text-[#123D2D]">"{destination.name}"</strong> ({destination.region}) from your Supabase database. This action cannot be undone.
        </p>

        <div className="mt-6 pt-4 border-t border-[#CBDAC4] flex items-center justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#CBDAC4] text-[#576159] hover:text-[#123D2D] hover:bg-white rounded-sm transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-sm transition-colors uppercase tracking-wider font-semibold disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
