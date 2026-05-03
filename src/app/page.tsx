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
  const [mood, setMood] = useState<string | null>(null); // null = 未入力（MoodInput表示）

  const [activeTab,  setActiveTab]  = useState<Tab>('question');
  const [displayTab, setDisplayTab] = useState<Tab>('question');
  const [tabKey,     setTabKey]     = useState(0);
  const [veilIn,     setVeilIn]     = useState(false);
  const [warmOut,    setWarmOut]    = useState(false);

  const [coachSeed, setCoachSeed] = useState<{ key: number; text: string } | null>(null);
  const seedKeyRef      = useRef(0);
  const isTransitioning = useRef(false);
  const timerSwap       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerEnd        = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    if (timerSwap.current) clearTimeout(timerSwap.current);
    if (timerEnd.current)  clearTimeout(timerEnd.current);

    setActiveTab(tab);

    if (isTransitioning.current) {
      setDisplayTab(tab);
      setTabKey((k) => k + 1);
      setVeilIn(false);
      setWarmOut(false);
      isTransitioning.current = false;
      return;
    }

    isTransitioning.current = true;
    setVeilIn(true);
    setWarmOut(false);

    timerSwap.current = setTimeout(() => {
      setDisplayTab(tab);
      setTabKey((k) => k + 1);
      setVeilIn(false);
      setWarmOut(true);
    }, 300);

    timerEnd.current = setTimeout(() => {
      setWarmOut(false);
      isTransitioning.current = false;
    }, 800);
  };

  const handleSendToCoach = (question: string, answer: string) => {
    seedKeyRef.current += 1;
    setCoachSeed({
      key: seedKeyRef.current,
      text: `「${question}」という問いについて考えてみました。\n\n${answer}`,
    });
    handleTabChange('coach');
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="fixed inset-0 flex justify-center bg-[#080F07]">
      <div className="relative w-full max-w-[430px] bg-[#080F07] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16 relative">
          {veilIn && (
            <div key={`veil-${tabKey}`} className="absolute inset-0 z-20 pointer-events-none ember-veil-in" style={{ background: '#080F07' }} />
          )}
          {warmOut && (
            <div key={`warm-${tabKey}`} className="absolute inset-0 z-20 pointer-events-none ember-warm-out"
              style={{ background: 'radial-gradient(ellipse at 50% 68%, rgba(212,84,26,0.2) 0%, rgba(232,120,32,0.06) 42%, transparent 68%)' }}
            />
          )}

          <div key={tabKey} className="ember-enter h-full overflow-y-auto scrollbar-hide">
            {displayTab === 'question'   && (
              <QuestionCard
                mood={mood}
                onMoodSet={setMood}
                onSendToCoach={handleSendToCoach}
              />
            )}
            {displayTab === 'coach'      && <AICoach mood={mood} coachSeed={coachSeed} />}
            {displayTab === 'reflection' && <Reflection mood={mood} />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
