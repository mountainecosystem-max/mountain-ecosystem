import type { FC } from 'react'
import { Sparkles, Home, Briefcase, MessageSquare } from 'lucide-react'

export type SaaSModuleTab = 'all' | 'stays' | 'jobs' | 'community'

interface SaaSModuleNavigatorProps {
  activeTab: SaaSModuleTab
  onSelectTab: (tab: SaaSModuleTab) => void
}

export const SaaSModuleNavigator: FC<SaaSModuleNavigatorProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs = [
    {
      id: 'all' as SaaSModuleTab,
      label: 'All Inquiries',
      icon: Sparkles
    },
    {
      id: 'stays' as SaaSModuleTab,
      label: 'Property Lease & Sale',
      icon: Home
    },
    {
      id: 'jobs' as SaaSModuleTab,
      label: 'Mountain Jobs',
      icon: Briefcase
    },
    {
      id: 'community' as SaaSModuleTab,
      label: 'Community Experiences',
      icon: MessageSquare
    }
  ]

  return (
    <div className="w-full py-3 sm:py-3.5 px-3 sm:px-6 sticky top-[76px] sm:top-[80px] z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none py-1 px-1 touch-momentum overscroll-x-contain">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-[42px] rounded-full text-xs sm:text-sm font-sans transition-all duration-200 whitespace-nowrap active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#0B1B3D] text-white shadow-sm border border-[#2575fc]/50 font-semibold ring-2 ring-[#2575fc]/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0B1B3D] font-medium border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-[0.98]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#38BDF8]' : 'text-[#2575fc]'
                }`}
              />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
