'use client';

import { useState, useEffect } from 'react';
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

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold text-gray-800">内省</h1>
        <p className="text-sm text-gray-500">今日の気づきを残しておこう</p>
      </div>

      {/* Input form */}
      <div className="px-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-violet-700 mb-1">
            🌟 いちばん「自分らしい」と感じた瞬間
          </label>
          <textarea
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
            placeholder="例：みんなが困っているときに、自然と声をかけていた"
            rows={3}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-600 mb-1">
            💡 もっと伸ばしたいこと・気になったこと
          </label>
          <textarea
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            placeholder="例：もっと自分の意見をはっきり言えるようになりたい"
            rows={3}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-500 mb-1">
            🔥 明日からひとつやること
          </label>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="例：朝、鏡の前で今日の自分に一言かけてみる"
            rows={2}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!moment.trim() && !improvement.trim() && !action.trim()}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-teal-500 text-white rounded-2xl font-bold text-base disabled:opacity-40 transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
        >
          {saved ? '✓ 保存しました！' : '今日の気づきを保存する'}
        </button>
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className="px-4 mt-8 pb-4">
          <h2 className="text-sm font-bold text-gray-600 mb-3">過去の記録</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative"
              >
                <p className="text-xs text-gray-400 mb-2">{entry.date}</p>
                {entry.moment && (
                  <div className="mb-2">
                    <p className="text-xs text-violet-600 font-semibold">🌟 らしい瞬間</p>
                    <p className="text-sm text-gray-700 mt-0.5">{entry.moment}</p>
                  </div>
                )}
                {entry.improvement && (
                  <div className="mb-2">
                    <p className="text-xs text-teal-600 font-semibold">💡 伸ばしたいこと</p>
                    <p className="text-sm text-gray-700 mt-0.5">{entry.improvement}</p>
                  </div>
                )}
                {entry.action && (
                  <div>
                    <p className="text-xs text-orange-500 font-semibold">🔥 やること</p>
                    <p className="text-sm text-gray-700 mt-0.5">{entry.action}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
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
