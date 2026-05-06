'use client';

import { useRef, useState } from 'react';
import { CheckAnswers, DiagnosisResult, Tab } from '@/types';
import BottomNav from '@/components/BottomNav';
import SplashScreen from '@/components/SplashScreen';
import CheckScreen from '@/components/CheckScreen';
import ResultScreen from '@/components/ResultScreen';
import ReflectScreen from '@/components/ReflectScreen';

const STEP_INDEX: Record<Tab, number> = { check: 0, result: 1, reflect: 2 };

const INITIAL_ANSWERS: CheckAnswers = { q1: null, q2: null, q3: null };

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab,  setActiveTab]  = useState<Tab>('check');
  const [displayTab, setDisplayTab] = useState<Tab>('check');
  const [tabKey,     setTabKey]     = useState(0);
  const [veilIn,     setVeilIn]     = useState(false);
  const [warmOut,    setWarmOut]    = useState(false);

  const [answers,      setAnswers]      = useState<CheckAnswers>(INITIAL_ANSWERS);
  const [diagnosis,    setDiagnosis]    = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

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
    }, 280);

    timerEnd.current = setTimeout(() => {
      setWarmOut(false);
      isTransitioning.current = false;
    }, 750);
  };

  const handleAnswer = (key: keyof CheckAnswers, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiagnose = async () => {
    if (!answers.q1 || !answers.q2 || !answers.q3) return;
    setIsDiagnosing(true);
    setDiagnosis(null);
    handleTabChange('result');
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q1: answers.q1, q2: answers.q2, q3: answers.q3 }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setDiagnosis(data);
    } catch {
      setDiagnosis({
        type: 'エラータイプ',
        message: '診断結果を取得できませんでした。もう一度試してみてください。',
        action: 'Checkに戻って、もう一度「診断する」を押してみよう',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setDiagnosis(null);
    handleTabChange('check');
  };

  if (showSplash) return <SplashScreen onStart={() => setShowSplash(false)} />;

  const currentStep = STEP_INDEX[displayTab];
  const hasAnswers  = answers.q1 !== null && answers.q2 !== null && answers.q3 !== null;

  return (
    <div className="fixed inset-0 flex justify-center bg-[#080F07]">
      <div className="relative w-full max-w-[430px] bg-[#080F07] flex flex-col overflow-hidden">

        {/* Progress bar */}
        <div className="flex px-5 pt-5 gap-2 flex-shrink-0">
          {([0, 1, 2] as const).map((i) => (
            <div
              key={i}
              className="flex-1 h-0.5 rounded-full transition-all duration-500"
              style={{
                background:
                  i < currentStep  ? '#2D5C32' :
                  i === currentStep ? '#D4541A' :
                  '#131F11',
              }}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="flex items-center gap-1.5 px-5 pt-2 pb-0 flex-shrink-0">
          <span className="text-[10px] tracking-widest" style={{ color: '#1E3220' }}>
            Step {currentStep + 1} / 3
          </span>
          <span className="text-[10px]" style={{ color: '#1E3220' }}>·</span>
          <span className="text-[10px]" style={{ color: '#2D4430' }}>
            {displayTab === 'check' ? '今の仕事チェック' : displayTab === 'result' ? '一言キャリア診断' : '振り返りメモ'}
          </span>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden pb-16 relative">
          {veilIn && (
            <div
              key={`veil-${tabKey}`}
              className="absolute inset-0 z-20 pointer-events-none ember-veil-in"
              style={{ background: '#080F07' }}
            />
          )}
          {warmOut && (
            <div
              key={`warm-${tabKey}`}
              className="absolute inset-0 z-20 pointer-events-none ember-warm-out"
              style={{ background: 'radial-gradient(ellipse at 50% 65%, rgba(212,84,26,0.15) 0%, rgba(232,120,32,0.04) 45%, transparent 68%)' }}
            />
          )}

          <div key={tabKey} className="ember-enter h-full overflow-y-auto scrollbar-hide">
            {displayTab === 'check' && (
              <CheckScreen
                answers={answers}
                onAnswer={handleAnswer}
                onDiagnose={handleDiagnose}
                isDiagnosing={isDiagnosing}
              />
            )}
            {displayTab === 'result' && (
              <ResultScreen
                diagnosis={diagnosis}
                isDiagnosing={isDiagnosing}
                hasAnswers={hasAnswers}
                onGoToCheck={() => handleTabChange('check')}
                onGoToReflect={() => handleTabChange('reflect')}
                onReset={handleReset}
              />
            )}
            {displayTab === 'reflect' && <ReflectScreen />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
