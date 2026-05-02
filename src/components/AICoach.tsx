'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '@/types';

interface AICoachProps {
  coachSeed?: { key: number; text: string } | null;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'やあ、焚き火の近くに来てくれてありがとう。\n今夜、どんなことを話してみたい？',
};

export default function AICoach({ coachSeed }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([INITIAL_MESSAGE]);
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
    <div className="flex flex-col h-full bg-[#FAFAF7]">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 border-b border-[#E8E4DC]">
        <h1 className="text-2xl font-bold text-[#1C2B1A] tracking-tight">AIコーチ</h1>
        <p className="text-sm text-[#6B7B69] mt-1">焚き火のそばで、じっくり話そう</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1C2B1A] text-white'
                  : 'bg-white text-[#1C2B1A] border border-[#E8E4DC]'
              }`}
            >
              {msg.content === '' && msg.role === 'assistant' ? (
                <span className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-[#D4541A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#D4541A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#D4541A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
      <div className="px-6 py-4 border-t border-[#E8E4DC]">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="今、何を感じてる？"
            rows={1}
            className="flex-1 resize-none border border-[#E8E4DC] rounded bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C2B1A] placeholder-[#6B7B69] focus:outline-none focus:border-[#D4541A] max-h-32 overflow-y-auto transition-colors"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 flex-shrink-0 rounded bg-[#D4541A] text-white flex items-center justify-center disabled:opacity-30 transition-opacity hover:opacity-90 active:opacity-80"
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
