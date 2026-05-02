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
    <nav
      className="absolute bottom-0 left-0 right-0 flex h-16"
      style={{ background: '#080F07', borderTop: '1px solid rgba(212,84,26,0.15)' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200"
          >
            <span
              className="text-sm font-medium tracking-wide"
              style={{ color: isActive ? '#D4541A' : '#38563A' }}
            >
              {tab.label}
            </span>
            <span
              className="text-[9px] leading-tight tracking-wide"
              style={{ color: isActive ? 'rgba(212,84,26,0.55)' : 'rgba(56,86,58,0.6)' }}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
