'use client';

import { Tab } from '@/types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; sub: string }[] = [
  { id: 'question',   label: 'Glow',    sub: '問い' },
  { id: 'coach',      label: 'EmberAI', sub: 'AI対話で深める' },
  { id: 'reflection', label: 'Reflect', sub: '内省' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#FAFAF7] border-t border-[#E8E4DC] flex h-16">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? 'text-[#D4541A]' : 'text-[#6B7B69] hover:text-[#1C2B1A]'
            }`}
          >
            <span className="text-sm font-medium tracking-wide">{tab.label}</span>
            <span
              className={`text-[9px] leading-tight tracking-wide ${
                isActive ? 'text-[#D4541A]/70' : 'text-[#6B7B69]/60'
              }`}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
