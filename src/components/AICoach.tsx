'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EmberAIEntry, Message } from '@/types';

const EMBERAI_STORAGE_KEY = 'embertalk_emberai_conversations';

interface AICoachProps {
  mood?: string | null;
  coachSeed?: { key: number; text: string } | null;
}

const buildInitialMessage = (mood?: string | null): Message => ({
  role: 'assistant',
  content: mood
    ? `やあ、焚き火の近くに来てくれてありがとう。\n「${mood}」という気持ちを持ってきてくれたんだね。\nその感覚、もう少し聞かせてもらえる？`
    : 'やあ、焚き火の近くに来てくれてありがとう。\n今夜、どんなことを話してみたい？',
});

export default function AICoach({ mood, coachSeed }: AICoachProps) {
  const initialMsg = buildInitialMessage(mood);
  const [messages, setMessages] = useState<Message[]>([initialMsg]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([initialMsg]);
  const lastSeedKey = useRef(0);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoadingRef.current) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);
    isLoadingRef.current = true;
    setIsLoading(true);

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) throw new Error('Network error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
      if (accumulated.trim()) {
        try {
          const entry: EmberAIEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
            userMessage: text,
            aiResponse: accumulated.trim(),
          };
          const existing: EmberAIEntry[] = JSON.parse(localStorage.getItem(EMBERAI_STORAGE_KEY) || '[]');
          localStorage.setItem(EMBERAI_STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 50)));
        } catch { /* ignore */ }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'ごめん、少し繋がりにくいみたい。もう一度話しかけてみて。',
        };
        return updated;
      });
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coachSeed && coachSeed.key !== lastSeedKey.current) {
      lastSeedKey.current = coachSeed.key;
      sendMessage(coachSeed.text);
    }
  }, [coachSeed?.key, sendMessage]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#080F07' }}>
      {/* Header */}
      <div
        className="px-6 pt-10 pb-5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(45,59,45,0.5)' }}
      >
        <h1
          className="text-2xl font-bold tracking-widest"
          style={{ color: '#F0EBE0', letterSpacing: '0.12em' }}
        >
          EmberAI
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A7A55' }}>
          焚き火のそばで、じっくり話そう
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[78%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === 'user'
                  ? {
                      background: '#1A2A18',
                      color: '#F0EBE0',
                      border: '1px solid rgba(45,59,45,0.55)',
                    }
                  : {
                      background: '#111A0F',
                      color: '#C8B090',
                      border: '1px solid rgba(45,59,45,0.5)',
                    }
              }
            >
              {msg.content === '' && msg.role === 'assistant' ? (
                <span className="flex gap-1 items-center h-4">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#D4541A', animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#D4541A', animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#D4541A', animationDelay: '300ms' }}
                  />
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(45,59,45,0.5)' }}
      >
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="今、何を感じてる？"
            rows={1}
            className="flex-1 resize-none rounded px-4 py-3 text-sm max-h-32 overflow-y-auto focus:outline-none transition-all duration-200"
            style={{
              background: '#0A1208',
              border: '1px solid rgba(45,59,45,0.55)',
              color: '#F0EBE0',
              minHeight: '44px',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.85)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.55)'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 flex-shrink-0 rounded flex items-center justify-center transition-all duration-200 disabled:opacity-25"
            style={{
              background: 'transparent',
              border: '1px solid rgba(45,59,45,0.8)',
              color: '#C8B090',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'rgba(45,59,45,0.15)';
                e.currentTarget.style.borderColor = 'rgba(45,59,45,0.95)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(45,59,45,0.8)';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
