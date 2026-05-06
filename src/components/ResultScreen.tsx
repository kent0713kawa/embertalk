'use client';

import { DiagnosisResult } from '@/types';

interface Props {
  diagnosis: DiagnosisResult | null;
  isDiagnosing: boolean;
  hasAnswers: boolean;
  onGoToCheck: () => void;
  onGoToReflect: () => void;
  onReset: () => void;
}

export default function ResultScreen({ diagnosis, isDiagnosing, hasAnswers, onGoToCheck, onGoToReflect, onReset }: Props) {
  if (isDiagnosing) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex gap-2.5 mb-1">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ background: '#D4541A', animationDelay: `${d}ms` }}
            />
          ))}
        </div>
        <p className="text-xs tracking-wide" style={{ color: '#38563A', letterSpacing: '0.08em' }}>
          キャリアを診断中...
        </p>
      </div>
    );
  }

  if (!hasAnswers || !diagnosis) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-10 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(45,59,45,0.12)', border: '1px solid rgba(45,59,45,0.35)' }}
        >
          <span style={{ color: '#2D4430', fontSize: 20 }}>↑</span>
        </div>
        <div>
          <p className="text-sm mb-1" style={{ color: '#38563A' }}>まずはCheckで回答しよう</p>
          <p className="text-xs" style={{ color: '#2D4430' }}>3問に答えると診断結果が表示されます</p>
        </div>
        <button
          onClick={onGoToCheck}
          className="text-xs py-2.5 px-7 rounded-xl transition-all duration-200"
          style={{ border: '1px solid rgba(45,59,45,0.55)', color: '#5A7A55', background: 'transparent' }}
        >
          Checkへ →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5 pt-7 pb-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: '#F0EBE0', letterSpacing: '0.06em' }}>
          診断結果
        </h1>
        <p className="text-xs mt-1" style={{ color: '#3A5C36' }}>あなたの今のキャリア</p>
      </div>

      {/* Type */}
      <div
        className="rounded-2xl p-7 text-center"
        style={{ background: 'rgba(212,84,26,0.05)', border: '1px solid rgba(212,84,26,0.2)' }}
      >
        <p className="text-[10px] tracking-widest mb-3" style={{ color: '#5A7A55', letterSpacing: '0.12em' }}>
          あなたのキャリアは
        </p>
        <p
          className="text-2xl font-bold type-glow"
          style={{ color: '#E87820', letterSpacing: '0.04em' }}
        >
          {diagnosis.type}
        </p>
      </div>

      {/* Message */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{ background: '#0B1509', border: '1px solid rgba(45,59,45,0.45)' }}
      >
        <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#2D4430', letterSpacing: '0.1em' }}>
          今のあなたへ
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#F0EBE0', lineHeight: 1.95 }}>
          {diagnosis.message}
        </p>
      </div>

      {/* Action */}
      <div
        className="mt-3 rounded-2xl p-5"
        style={{ background: 'rgba(45,59,45,0.06)', border: '1px solid rgba(45,59,45,0.4)' }}
      >
        <p className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: '#2D4430', letterSpacing: '0.1em' }}>
          明日やってみること
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#C8B090', lineHeight: 1.7 }}>
          {diagnosis.action}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-7 flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200"
          style={{ border: '1px solid rgba(45,59,45,0.45)', color: '#38563A', background: 'transparent' }}
        >
          もう一度チェック
        </button>
        <button
          onClick={onGoToReflect}
          className="flex-1 py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200"
          style={{ border: '1px solid rgba(45,59,45,0.7)', color: '#C8B090', background: 'transparent' }}
        >
          気づきをメモ →
        </button>
      </div>
    </div>
  );
}
