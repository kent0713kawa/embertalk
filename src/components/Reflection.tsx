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

  const textareaStyle = {
    background: '#0A1208',
    border: '1px solid rgba(212,84,26,0.2)',
    color: '#F0EBE0',
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,84,26,0.6)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,84,26,0.2)';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide" style={{ background: '#080F07' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1
          className="text-2xl font-bold tracking-widest"
          style={{ color: '#F0EBE0', letterSpacing: '0.12em' }}
        >
          Reflect
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A7A55' }}>
          今日の気づきを書き留めよう
        </p>
      </div>

      {/* Input form */}
      <div className="px-6 space-y-3">
        <div
          className="rounded-lg p-5"
          style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}
        >
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#5A7A55' }}
          >
            自分らしい瞬間
          </label>
          <textarea
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="例：みんなが困っているときに、自然と声をかけていた"
            rows={3}
            className="w-full rounded px-4 py-3 text-sm resize-none leading-relaxed focus:outline-none transition-all duration-200"
            style={textareaStyle}
          />
        </div>

        <div
          className="rounded-lg p-5"
          style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}
        >
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#5A7A55' }}
          >
            伸ばしたいこと
          </label>
          <textarea
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="例：もっと自分の意見をはっきり言えるようになりたい"
            rows={3}
            className="w-full rounded px-4 py-3 text-sm resize-none leading-relaxed focus:outline-none transition-all duration-200"
            style={textareaStyle}
          />
        </div>

        <div
          className="rounded-lg p-5"
          style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}
        >
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#5A7A55' }}
          >
            明日やること
          </label>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="例：朝、鏡の前で今日の自分に一言かけてみる"
            rows={2}
            className="w-full rounded px-4 py-3 text-sm resize-none leading-relaxed focus:outline-none transition-all duration-200"
            style={textareaStyle}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!moment.trim() && !improvement.trim() && !action.trim()}
          className="w-full py-3.5 rounded text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-25"
          style={{
            border: '1px solid rgba(212,84,26,0.55)',
            color: saved ? '#5A7A55' : '#D4541A',
            background: saved ? 'rgba(90,122,85,0.08)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.background = 'rgba(212,84,26,0.08)';
              e.currentTarget.style.borderColor = 'rgba(212,84,26,0.8)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = saved ? 'rgba(90,122,85,0.08)' : 'transparent';
            e.currentTarget.style.borderColor = 'rgba(212,84,26,0.55)';
          }}
        >
          {saved ? '保存しました ✓' : '今日の気づきを保存する'}
        </button>
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className="px-6 mt-10 pb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#38563A' }}
          >
            過去の記録
          </h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg p-5 relative"
                style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.12)' }}
              >
                <p className="text-xs mb-3" style={{ color: '#38563A' }}>
                  {entry.date}
                </p>
                {entry.moment && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>
                      自分らしい瞬間
                    </p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>
                      {entry.moment}
                    </p>
                  </div>
                )}
                {entry.improvement && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>
                      伸ばしたいこと
                    </p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>
                      {entry.improvement}
                    </p>
                  </div>
                )}
                {entry.action && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>
                      明日やること
                    </p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>
                      {entry.action}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-4 right-4 text-sm leading-none transition-colors duration-200"
                  style={{ color: '#38563A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#D4541A'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#38563A'; }}
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
