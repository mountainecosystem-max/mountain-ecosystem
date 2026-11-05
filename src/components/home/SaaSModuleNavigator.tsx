import type { FC } from 'react'
import { Sparkles, Home, Briefcase, FileText, ShieldCheck } from 'lucide-react'

export type SaaSModuleTab = 'all' | 'stays' | 'jobs' | 'community' | 'ethics'

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
      label: 'Stays & Leases',
      icon: Home
    },
    {
      id: 'jobs' as SaaSModuleTab,
      label: 'Mountain Jobs',
      icon: Briefcase
    },
    {
      id: 'community' as SaaSModuleTab,
      label: 'Community Ledger',
      icon: FileText
    },
    {
      id: 'ethics' as SaaSModuleTab,
      label: 'Ecology & Ethics',
      icon: ShieldCheck
    }
  ]

  return (
    <div className="w-full py-3.5 px-4 sm:px-6 sticky top-[68px] z-30 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#CBDAC4] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 whitespace-nowrap active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#0B2516] text-[#FAF7EE] shadow-sm border border-[#0B2516]'
                  : 'bg-white/90 hover:bg-white text-[#123D26] hover:text-[#0B2516] border border-[#CBDAC4] hover:border-[#164E2D]/50 shadow-xs'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#A5C896]' : 'text-[#164E2D]'
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
