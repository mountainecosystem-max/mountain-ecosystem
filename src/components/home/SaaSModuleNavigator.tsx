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
    <div className="w-full py-3 sm:py-3.5 px-3 sm:px-6 sticky top-[76px] sm:top-[80px] z-30 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#CBDAC4] shadow-xs transition-all">
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
                  ? 'bg-gradient-to-r from-[#0A2316] via-[#123E24] to-[#164E2D] text-white shadow-md shadow-emerald-950/25 border border-emerald-500/40 font-semibold ring-1 ring-emerald-400/20'
                  : 'bg-white/80 hover:bg-white text-stone-700 hover:text-[#0A2316] font-medium border border-[#CBDAC4] hover:border-emerald-700/40 shadow-xs hover:shadow-sm'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#34D399]' : 'text-[#164E2D]'
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
