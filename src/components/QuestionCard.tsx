'use client';

import { useState } from 'react';
import { Category } from '@/types';

interface QuestionCardProps {
  onSendToCoach: (question: string, answer: string) => void;
}

const QUESTIONS: Record<Category, string[]> = {
  らしさ: [
    '最近、いちばん「自分らしい」と感じた瞬間はどんな時？',
    '何年経っても変わらない、自分の一面はどんなところ？',
    '友達から「らしいね」と言われるのはどんな時？',
    'どんな状況のとき、いちばん自然体でいられる？',
  ],
  強み: [
    '最近、周りの人から感謝されたことは何？',
    '誰かの役に立てたと感じた場面を教えて。',
    '特に意識しなくても、自然とできてしまうことは？',
    '困ったとき、頼まれることが多い場面ってある？',
  ],
  挑戦: [
    '勇気を出してやってみてよかった、最近の挑戦は？',
    'あの挑戦をしてみて、どんな自分を発見した？',
    '成功が確定しているなら、何に挑戦してみたい？',
    'もう少しだけ踏み出せたら、何をやってみたい？',
  ],
  関係性: [
    '一緒にいると、意外な自分が出てくる人はいる？',
    'そばにいると、いちばん自分らしくいられる人は誰？',
    '最近「ありがとう」を伝えたいと思っている人は？',
    '誰かとの関係で、嬉しかった出来事を教えて。',
  ],
  未来: [
    '3年後の自分に一言メッセージを送るとしたら？',
    'こんな大人でいたい、という姿はある？',
    'これからも大切にしていきたい価値観は何？',
    '明日からひとつだけやってみたいことは？',
  ],
};

const CATEGORY_STYLES: Record<Category, { gradient: string; badge: string }> = {
  らしさ: { gradient: 'from-rose-400 to-pink-600', badge: 'bg-rose-100 text-rose-700' },
  強み: { gradient: 'from-emerald-600 to-green-800', badge: 'bg-emerald-100 text-emerald-800' },
  挑戦: { gradient: 'from-amber-400 to-orange-600', badge: 'bg-amber-100 text-amber-800' },
  関係性: { gradient: 'from-orange-300 to-red-500', badge: 'bg-orange-100 text-orange-700' },
  未来: { gradient: 'from-teal-500 to-emerald-700', badge: 'bg-teal-100 text-teal-800' },
};

export default function QuestionCard({ onSendToCoach }: QuestionCardProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('らしさ');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const categories: Category[] = ['らしさ', '強み', '挑戦', '関係性', '未来'];

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setQuestionIndex(0);
    setUserAnswer('');
  };

  const handleNext = () => {
    const questions = QUESTIONS[activeCategory];
    setQuestionIndex((prev) => (prev + 1) % questions.length);
    setUserAnswer('');
  };

  const handleSendToCoach = () => {
    if (!userAnswer.trim()) return;
    onSendToCoach(currentQuestion, userAnswer.trim());
    setUserAnswer('');
  };

  const currentQuestion = QUESTIONS[activeCategory][questionIndex];
  const style = CATEGORY_STYLES[activeCategory];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold text-stone-800">問いカード</h1>
        <p className="text-sm text-stone-500">テーマを選んで、森の中でじっくり考えよう</p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-amber-100 text-stone-600 border border-amber-200 hover:bg-amber-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Question card */}
        <div
          className={`flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${style.gradient} p-8 shadow-lg min-h-[180px]`}
        >
          <div className="text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${style.badge} opacity-90`}>
              {activeCategory}
            </span>
            <p className="text-white text-lg font-bold leading-relaxed">
              {currentQuestion}
            </p>
            <p className="text-white/60 text-xs mt-5">
              {questionIndex + 1} / {QUESTIONS[activeCategory].length}
            </p>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-3 bg-amber-50 border-2 border-amber-200 text-amber-800 rounded-2xl font-bold text-sm hover:bg-amber-100 active:bg-amber-200 transition-all"
        >
          次の問いへ →
        </button>

        {/* Answer section */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-4">
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            🌿 あなたの答えを書いてみよう
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="思ったこと、感じたこと、なんでも…"
            rows={4}
            className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none leading-relaxed"
          />

          <button
            onClick={handleSendToCoach}
            disabled={!userAnswer.trim()}
            className="mt-3 w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold text-sm disabled:opacity-40 transition-all hover:opacity-90 active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            AIコーチに相談する
          </button>
        </div>
      </div>
    </div>
  );
}
