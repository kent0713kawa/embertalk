'use client';

import { useEffect, useRef, useState } from 'react';
import { ReflectEntry } from '@/types';

const STORAGE_KEY = 'embertalk_lite_reflections';

export default function ReflectScreen() {
  const [memo, setMemo]       = useState('');
  const [entries, setEntries] = useState<ReflectEntry[]>([]);
  const [saved, setSaved]     = useState(false);
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const handleSave = () => {
    if (!memo.trim()) return;
    const entry: ReflectEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      memo: memo.trim(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMemo('');
    setSaved(true);
    textareaRef.current?.blur();
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col px-5 pt-7 pb-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: '#F0EBE0', letterSpacing: '0.06em' }}>
          Reflect
        </h1>
        <p className="text-xs mt-1" style={{ color: '#3A5C36' }}>今日気づいたことを一言で</p>
      </div>

      {/* Input */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#0B1509', border: '1px solid rgba(45,59,45,0.45)' }}
      >
        <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#2D4430', letterSpacing: '0.1em' }}>
          今日の気づき
        </p>
        <textarea
          ref={textareaRef}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例：楽しい仕事には「人を巻き込む」要素がある気がした"
          rows={3}
          className="w-full text-sm resize-none leading-relaxed focus:outline-none"
          style={{
            background: 'transparent',
            color: '#F0EBE0',
            border: 'none',
            lineHeight: 1.85,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave();
          }}
        />
        <p className="text-[10px] text-right mt-1" style={{ color: '#1E3220' }}>⌘ + Enter で保存</p>
      </div>

      <button
        onClick={handleSave}
        disabled={!memo.trim()}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-medium tracking-widest transition-all duration-200 disabled:opacity-20"
        style={{
          border: '1px solid rgba(45,59,45,0.7)',
          color: saved ? '#5A7A55' : '#C8B090',
          background: 'transparent',
          letterSpacing: '0.12em',
        }}
      >
        {saved ? '保存しました ✓' : 'メモを保存する'}
      </button>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className="mt-9">
          <p className="text-[10px] font-semibold tracking-widest mb-4" style={{ color: '#2D4430', letterSpacing: '0.1em' }}>
            これまでの気づき
          </p>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl p-4 relative"
                style={{ background: '#0B1509', border: '1px solid rgba(45,59,45,0.4)' }}
              >
                <p className="text-[10px] mb-2" style={{ color: '#2D4430' }}>{entry.date}</p>
                <p className="text-sm leading-relaxed pr-6" style={{ color: '#C8B090', lineHeight: 1.8 }}>
                  {entry.memo}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-3.5 right-3.5 text-sm leading-none transition-colors duration-200"
                  style={{ color: '#2D4430' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#D4541A'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#2D4430'; }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ color: '#1E3220' }}>まだメモがありません</p>
          <p className="text-[10px] mt-1" style={{ color: '#1E3220', opacity: 0.6 }}>
            診断後の気づきを書き留めよう
          </p>
        </div>
      )}
    </div>
  );
}
