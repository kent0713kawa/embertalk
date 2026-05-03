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

  // activeTab  → BottomNav のハイライト（即時反映）
  // displayTab → 実際に表示するコンテンツ（遷移後に切替）
  const [activeTab,  setActiveTab]  = useState<Tab>('question');
  const [displayTab, setDisplayTab] = useState<Tab>('question');
  const [tabKey,     setTabKey]     = useState(0);

  // オーバーレイフラグ
  const [veilIn,   setVeilIn]   = useState(false); // 旧画面を暗くする黒ベール
  const [warmOut,  setWarmOut]  = useState(false); // 新画面を温かく照らすアンバーグロー

  const [coachSeed, setCoachSeed] = useState<{ key: number; text: string } | null>(null);
  const seedKeyRef      = useRef(0);
  const isTransitioning = useRef(false);
  const timerSwap       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerEnd        = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    // タイマーをリセット（連打対策）
    if (timerSwap.current) clearTimeout(timerSwap.current);
    if (timerEnd.current)  clearTimeout(timerEnd.current);

    // ナビはすぐ反映
    setActiveTab(tab);

    // 遷移中の連打は即スワップ
    if (isTransitioning.current) {
      setDisplayTab(tab);
      setTabKey((k) => k + 1);
      setVeilIn(false);
      setWarmOut(false);
      isTransitioning.current = false;
      return;
    }

    isTransitioning.current = true;

    // ── Phase 1: 黒ベールがじわっとフェードイン（0〜300ms）──
    setVeilIn(true);
    setWarmOut(false);

    // ── Phase 2: コンテンツ切替 → アンバーグローとともに新画面が現れる（300ms〜）──
    timerSwap.current = setTimeout(() => {
      setDisplayTab(tab);
      setTabKey((k) => k + 1);
      setVeilIn(false);
      setWarmOut(true);
    }, 300);

    // ── Phase 3: グロー消去・完了（300 + 500ms = 800ms）──
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

          {/* 黒ベール — 旧コンテンツをゆっくり暗くする */}
          {veilIn && (
            <div
              key={`veil-${tabKey}`}
              className="absolute inset-0 z-20 pointer-events-none ember-veil-in"
              style={{ background: '#080F07' }}
            />
          )}

          {/* アンバーグロー — 新コンテンツが灯るような暖かい光 */}
          {warmOut && (
            <div
              key={`warm-${tabKey}`}
              className="absolute inset-0 z-20 pointer-events-none ember-warm-out"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 68%, rgba(212,84,26,0.2) 0%, rgba(232,120,32,0.06) 42%, transparent 68%)',
              }}
            />
          )}

          {/* コンテンツ本体 */}
          <div key={tabKey} className="ember-enter h-full overflow-y-auto scrollbar-hide">
            {displayTab === 'question'   && <QuestionCard onSendToCoach={handleSendToCoach} />}
            {displayTab === 'coach'      && <AICoach coachSeed={coachSeed} />}
            {displayTab === 'reflection' && <Reflection />}
          </div>

        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
