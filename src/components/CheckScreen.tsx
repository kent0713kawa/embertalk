'use client';

import { CheckAnswers } from '@/types';

const QUESTIONS = [
  { key: 'q1' as const, text: '今の仕事、楽しめてる？' },
  { key: 'q2' as const, text: '自分らしく働けてる？' },
  { key: 'q3' as const, text: '3年後のイメージ、ある？' },
];

interface Props {
  answers: CheckAnswers;
  onAnswer: (key: keyof CheckAnswers, value: number) => void;
  onDiagnose: () => void;
  isDiagnosing: boolean;
}

export default function CheckScreen({ answers, onAnswer, onDiagnose, isDiagnosing }: Props) {
  const allAnswered = answers.q1 !== null && answers.q2 !== null && answers.q3 !== null;

  return (
    <div className="flex flex-col px-5 pt-7 pb-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: '#F0EBE0', letterSpacing: '0.06em' }}>
          今の仕事チェック
        </h1>
        <p className="text-xs mt-1" style={{ color: '#3A5C36' }}>3つの質問に答えよう</p>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => (
          <div
            key={q.key}
            className="rounded-2xl p-5"
            style={{ background: '#0B1509', border: '1px solid rgba(45,59,45,0.45)' }}
          >
            <p className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: '#2D4430' }}>
              Q{idx + 1} / 3
            </p>
            <p className="text-base mb-5" style={{ color: '#F0EBE0', lineHeight: 1.5 }}>
              {q.text}
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((v) => {
                const selected = answers[q.key] === v;
                return (
                  <button
                    key={v}
                    onClick={() => onAnswer(q.key, v)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{
                      background: selected ? 'rgba(212,84,26,0.15)' : 'rgba(45,59,45,0.07)',
                      border: selected ? '1px solid rgba(232,120,32,0.55)' : '1px solid rgba(45,59,45,0.35)',
                      color: selected ? '#E87820' : '#38563A',
                    }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 px-0.5">
              <span className="text-[10px]" style={{ color: '#1E3220' }}>ぜんぜん</span>
              <span className="text-[10px]" style={{ color: '#1E3220' }}>すごく</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onDiagnose}
        disabled={!allAnswered || isDiagnosing}
        className="mt-7 w-full py-4 rounded-2xl text-sm font-medium tracking-widest transition-all duration-300 disabled:opacity-20"
        style={{
          background: allAnswered ? 'rgba(212,84,26,0.1)' : 'transparent',
          border: `1px solid ${allAnswered ? 'rgba(212,84,26,0.45)' : 'rgba(45,59,45,0.4)'}`,
          color: allAnswered ? '#C8B090' : '#38563A',
          letterSpacing: '0.14em',
        }}
      >
        {isDiagnosing ? '診断中...' : '診断する →'}
      </button>
    </div>
  );
}
