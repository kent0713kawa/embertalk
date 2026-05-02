'use client';

import { useState } from 'react';
import { Tab } from '@/types';
import BottomNav from '@/components/BottomNav';
import QuestionCard from '@/components/QuestionCard';
import AICoach from '@/components/AICoach';
import Reflection from '@/components/Reflection';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('question');

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="relative w-full max-w-[430px] bg-amber-50 flex flex-col overflow-hidden">
        {/* Content area — leaves room for bottom nav */}
        <div className="flex-1 overflow-hidden pb-16">
          <div className="h-full overflow-hidden">
            {activeTab === 'question' && <QuestionCard />}
            {activeTab === 'coach' && <AICoach />}
            {activeTab === 'reflection' && <Reflection />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
