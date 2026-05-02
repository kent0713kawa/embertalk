'use client';

import { Tab } from '@/types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'question', label: 'Glow' },
  { id: 'coach', label: 'EmberAI' },
  { id: 'reflection', label: 'Reflect' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#FAFAF7] border-t border-[#E8E4DC] flex h-14">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center text-sm font-medium tracking-wide transition-colors ${
              isActive ? 'text-[#D4541A]' : 'text-[#6B7B69] hover:text-[#1C2B1A]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
