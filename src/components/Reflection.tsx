'use client';

import { useEffect, useState } from 'react';
import { EmberReport, GlowAnswer, ReflectionEntry } from '@/types';

const STORAGE_KEY = 'embertalk_reflections';
const GLOW_STORAGE_KEY = 'embertalk_glow_answers';
const REPORT_STORAGE_KEY = 'embertalk_ember_reports';

export default function Reflection() {
  const [moment, setMoment] = useState('');
  const [improvement, setImprovement] = useState('');
  const [action, setAction] = useState('');
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [saved, setSaved] = useState(false);

  // Ember Report state
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSaved, setReportSaved] = useState(false);
  const [savedReports, setSavedReports] = useState<EmberReport[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
      const rawReports = localStorage.getItem(REPORT_STORAGE_KEY);
      if (rawReports) setSavedReports(JSON.parse(rawReports));
    } catch { /* ignore */ }
  }, []);

  const handleSave = () => {
    if (!moment.trim() && !improvement.trim() && !action.trim()) return;
    const entry: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
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

  const handleDeleteReport = (id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleEmberReport = async () => {
    setShowModal(true);
    setReportText('');
    setReportSaved(false);
    setIsGenerating(true);

    try {
      const glowAnswers: GlowAnswer[] = JSON.parse(localStorage.getItem(GLOW_STORAGE_KEY) || '[]');
      const response = await fetch('/api/ember-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glowAnswers, reflections: entries }),
      });

      if (!response.ok || !response.body) throw new Error('Network error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setReportText(accumulated);
      }
    } catch {
      setReportText('少し繋がりにくいみたい。もう一度試してみてください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = () => {
    if (!reportText.trim()) return;
    const report: EmberReport = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: reportText.trim(),
    };
    const updated = [report, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(updated));
    setReportSaved(true);
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
    <>
      <div className="flex flex-col h-full overflow-y-auto scrollbar-hide" style={{ background: '#080F07' }}>
        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold tracking-widest" style={{ color: '#F0EBE0', letterSpacing: '0.12em' }}>
            Reflect
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A7A55' }}>
            今日の気づきを書き留めよう
          </p>
        </div>

        {/* Input form */}
        <div className="px-6 space-y-3">
          <div className="rounded-lg p-5" style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#5A7A55' }}>
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

          <div className="rounded-lg p-5" style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#5A7A55' }}>
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

          <div className="rounded-lg p-5" style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.15)' }}>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#5A7A55' }}>
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
            style={{ border: '1px solid rgba(212,84,26,0.45)', color: saved ? '#5A7A55' : '#D4541A', background: 'transparent' }}
          >
            {saved ? '保存しました ✓' : '今日の気づきを保存する'}
          </button>
        </div>

        {/* Ember Report */}
        <div className="px-6 mt-8 mb-2">
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(to right, transparent, rgba(212,84,26,0.3), transparent)' }}
          />
        </div>
        <div className="px-6 pb-2">
          <button
            onClick={handleEmberReport}
            disabled={isGenerating}
            className="w-full rounded-xl py-5 flex flex-col items-center gap-1.5 transition-all duration-300 disabled:opacity-50"
            style={{
              background: 'rgba(212,84,26,0.07)',
              border: '1px solid rgba(212,84,26,0.35)',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'rgba(212,84,26,0.12)';
                e.currentTarget.style.borderColor = 'rgba(212,84,26,0.6)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,84,26,0.07)';
              e.currentTarget.style.borderColor = 'rgba(212,84,26,0.35)';
            }}
          >
            <span
              className="text-base font-semibold tracking-widest"
              style={{ color: '#E87820', letterSpacing: '0.12em' }}
            >
              Ember Report
            </span>
            <span
              className="text-xs tracking-wide"
              style={{ color: '#5A7A55' }}
            >
              あなたのらしさを言語化する
            </span>
          </button>
        </div>

        {/* Saved Ember Reports */}
        {savedReports.length > 0 && (
          <div className="px-6 mt-6 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#38563A' }}>
              Ember Reports
            </h2>
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg p-5 relative"
                  style={{ background: 'rgba(232,120,32,0.05)', border: '1px solid rgba(212,84,26,0.18)' }}
                >
                  <p className="text-xs mb-3" style={{ color: '#38563A' }}>{report.date}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#C8B090', lineHeight: 1.9 }}>
                    {report.content}
                  </p>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
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

        {/* Past reflection entries */}
        {entries.length > 0 && (
          <div className="px-6 mt-8 pb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#38563A' }}>
              過去の記録
            </h2>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg p-5 relative"
                  style={{ background: '#111A0F', border: '1px solid rgba(212,84,26,0.12)' }}
                >
                  <p className="text-xs mb-3" style={{ color: '#38563A' }}>{entry.date}</p>
                  {entry.moment && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>自分らしい瞬間</p>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>{entry.moment}</p>
                    </div>
                  )}
                  {entry.improvement && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>伸ばしたいこと</p>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>{entry.improvement}</p>
                    </div>
                  )}
                  {entry.action && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38563A' }}>明日やること</p>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: '#C8B090' }}>{entry.action}</p>
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

      {/* Ember Report Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-end justify-center z-50 ember-modal-backdrop"
          style={{ background: 'rgba(0,0,0,0.72)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isGenerating) setShowModal(false);
          }}
        >
          <div
            className="w-full max-w-[430px] rounded-t-2xl flex flex-col ember-modal-enter"
            style={{
              background: '#0E170C',
              border: '1px solid rgba(212,84,26,0.25)',
              borderBottom: 'none',
              maxHeight: '80vh',
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(212,84,26,0.12)' }}
            >
              <div>
                <p
                  className="text-base font-semibold tracking-widest"
                  style={{ color: '#E87820', letterSpacing: '0.12em' }}
                >
                  Ember Report
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#38563A' }}>あなたのらしさ</p>
              </div>
              <button
                onClick={() => { if (!isGenerating) setShowModal(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 text-lg leading-none"
                style={{ color: '#5A7A55', background: 'rgba(212,84,26,0.06)' }}
              >
                ×
              </button>
            </div>

            {/* Modal content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
              {isGenerating && !reportText && (
                <div className="flex items-center gap-2 py-8 justify-center">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4541A', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4541A', animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4541A', animationDelay: '300ms' }} />
                </div>
              )}
              {reportText && (
                <p
                  className="text-base leading-loose"
                  style={{ color: '#F0EBE0', letterSpacing: '0.03em', lineHeight: 2 }}
                >
                  {reportText}
                </p>
              )}
            </div>

            {/* Modal footer */}
            {reportText && !isGenerating && (
              <div
                className="px-6 py-5 flex-shrink-0 flex gap-3"
                style={{ borderTop: '1px solid rgba(212,84,26,0.12)' }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded text-sm tracking-wide transition-all duration-200"
                  style={{
                    border: '1px solid rgba(212,84,26,0.2)',
                    color: '#5A7A55',
                    background: 'transparent',
                  }}
                >
                  閉じる
                </button>
                <button
                  onClick={handleSaveReport}
                  disabled={reportSaved}
                  className="flex-1 py-3 rounded text-sm tracking-wide font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    border: '1px solid rgba(212,84,26,0.55)',
                    color: reportSaved ? '#5A7A55' : '#D4541A',
                    background: reportSaved ? 'rgba(90,122,85,0.06)' : 'transparent',
                  }}
                >
                  {reportSaved ? '保存しました ✓' : '保存する'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
