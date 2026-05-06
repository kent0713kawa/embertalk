'use client';

import { Tab } from '@/types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; sub: string }[] = [
  { id: 'check',   label: 'Check',   sub: '仕事チェック' },
  { id: 'result',  label: 'Result',  sub: '診断結果' },
  { id: 'reflect', label: 'Reflect', sub: '振り返り' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 flex h-16"
      style={{ background: '#080F07', borderTop: '1px solid rgba(45,59,45,0.45)' }}
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
              style={{ color: isActive ? '#C8B090' : '#2D3D2D' }}
            >
              {tab.label}
            </span>
            <span
              className="text-[9px] leading-tight tracking-wide"
              style={{ color: isActive ? 'rgba(200,176,144,0.5)' : 'rgba(45,61,45,0.55)' }}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
