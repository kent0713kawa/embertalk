'use client';

import { useRef, useState } from 'react';
import { Tab } from '@/types';
import BottomNav from '@/components/BottomNav';
import QuestionCard from '@/components/QuestionCard';
import AICoach from '@/components/AICoach';
import Reflection from '@/components/Reflection';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('question');
  const [coachSeed, setCoachSeed] = useState<{ key: number; text: string } | null>(null);
  const seedKeyRef = useRef(0);

  const handleSendToCoach = (question: string, answer: string) => {
    seedKeyRef.current += 1;
    setCoachSeed({
      key: seedKeyRef.current,
      text: `「${question}」という問いについて考えてみました。\n\n${answer}`,
    });
    setActiveTab('coach');
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-stone-300">
      <div className="relative w-full max-w-[430px] bg-amber-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16">
          <div className="h-full overflow-hidden">
            {activeTab === 'question' && (
              <QuestionCard onSendToCoach={handleSendToCoach} />
            )}
            {activeTab === 'coach' && (
              <AICoach coachSeed={coachSeed} />
            )}
            {activeTab === 'reflection' && <Reflection />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
