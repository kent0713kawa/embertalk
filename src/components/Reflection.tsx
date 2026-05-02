'use client';

import { useEffect, useState } from 'react';
import { ReflectionEntry } from '@/types';

const STORAGE_KEY = 'embertalk_reflections';

export default function Reflection() {
  const [moment, setMoment] = useState('');
  const [improvement, setImprovement] = useState('');
  const [action, setAction] = useState('');
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const handleSave = () => {
    if (!moment.trim() && !improvement.trim() && !action.trim()) return;

    const entry: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      moment: moment.trim(),
      improvement: improvement.trim(),
      action: action.trim(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMoment('');
    setImprovement('');
    setAction('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const textareaClass =
    'w-full border border-[#E8E4DC] rounded bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C2B1A] placeholder-[#6B7B69] focus:outline-none focus:border-[#D4541A] resize-none leading-relaxed transition-colors';

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-[#FAFAF7]">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-[#1C2B1A] tracking-tight">内省</h1>
        <p className="text-sm text-[#6B7B69] mt-1">今日の気づきを書き留めよう</p>
      </div>

      {/* Input form */}
      <div className="px-6 space-y-4">
        <div className="border border-[#E8E4DC] rounded-lg p-5">
          <label className="block text-xs font-semibold text-[#6B7B69] uppercase tracking-wider mb-3">
            自分らしい瞬間
          </label>
          <textarea
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
            placeholder="例：みんなが困っているときに、自然と声をかけていた"
            rows={3}
            className={textareaClass}
          />
        </div>

        <div className="border border-[#E8E4DC] rounded-lg p-5">
          <label className="block text-xs font-semibold text-[#6B7B69] uppercase tracking-wider mb-3">
            伸ばしたいこと
          </label>
          <textarea
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            placeholder="例：もっと自分の意見をはっきり言えるようになりたい"
            rows={3}
            className={textareaClass}
          />
        </div>

        <div className="border border-[#E8E4DC] rounded-lg p-5">
          <label className="block text-xs font-semibold text-[#6B7B69] uppercase tracking-wider mb-3">
            明日やること
          </label>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="例：朝、鏡の前で今日の自分に一言かけてみる"
            rows={2}
            className={textareaClass}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!moment.trim() && !improvement.trim() && !action.trim()}
          className="w-full py-3.5 bg-[#1C2B1A] text-white rounded text-sm font-semibold disabled:opacity-30 transition-opacity hover:opacity-90 active:opacity-80"
        >
          {saved ? '保存しました' : '今日の気づきを保存する'}
        </button>
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className="px-6 mt-12 pb-8">
          <h2 className="text-xs font-semibold text-[#6B7B69] uppercase tracking-wider mb-4">過去の記録</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border border-[#E8E4DC] rounded-lg p-5 relative"
              >
                <p className="text-xs text-[#6B7B69] mb-3">{entry.date}</p>
                {entry.moment && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#6B7B69] uppercase tracking-wider">自分らしい瞬間</p>
                    <p className="text-sm text-[#1C2B1A] mt-1 leading-relaxed">{entry.moment}</p>
                  </div>
                )}
                {entry.improvement && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#6B7B69] uppercase tracking-wider">伸ばしたいこと</p>
                    <p className="text-sm text-[#1C2B1A] mt-1 leading-relaxed">{entry.improvement}</p>
                  </div>
                )}
                {entry.action && (
                  <div>
                    <p className="text-xs font-semibold text-[#6B7B69] uppercase tracking-wider">明日やること</p>
                    <p className="text-sm text-[#1C2B1A] mt-1 leading-relaxed">{entry.action}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-4 right-4 text-[#6B7B69] hover:text-[#8B2500] transition-colors text-sm leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
