'use client';

import { useRef, useState } from 'react';
import { Tab } from '@/types';
import BottomNav from '@/components/BottomNav';
import QuestionCard from '@/components/QuestionCard';
import AICoach from '@/components/AICoach';
import Reflection from '@/components/Reflection';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('question');
  const [tabKey, setTabKey] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [coachSeed, setCoachSeed] = useState<{ key: number; text: string } | null>(null);
  const seedKeyRef = useRef(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSendToCoach = (question: string, answer: string) => {
    seedKeyRef.current += 1;
    setCoachSeed({
      key: seedKeyRef.current,
      text: `「${question}」という問いについて考えてみました。\n\n${answer}`,
    });
    handleTabChange('coach');
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    // Clear any pending flash timer
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    // Flash the ember glow, then swap content
    setShowFlash(true);
    setFlashKey((k) => k + 1);

    flashTimerRef.current = setTimeout(() => {
      setActiveTab(tab);
      setTabKey((k) => k + 1);
      setShowFlash(false);
    }, 180);
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="fixed inset-0 flex justify-center bg-[#080F07]">
      <div className="relative w-full max-w-[430px] bg-[#080F07] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16 relative">
          {/* Ember glow flash overlay on tab change */}
          {showFlash && <div key={flashKey} className="ember-flash" />}

          {/* Tab content with enter animation */}
          <div key={tabKey} className="ember-enter h-full overflow-y-auto scrollbar-hide">
            {activeTab === 'question' && (
              <QuestionCard onSendToCoach={handleSendToCoach} />
            )}
            {activeTab === 'coach' && (
              <AICoach coachSeed={coachSeed} />
            )}
            {activeTab === 'reflection' && <Reflection />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
