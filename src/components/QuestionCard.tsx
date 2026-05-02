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

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-[#FAFAF7]">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-[#1C2B1A] tracking-tight">問いカード</h1>
        <p className="text-sm text-[#6B7B69] mt-1">テーマを選んで、じっくり考えよう</p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-6 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[#1C2B1A] text-white'
                : 'text-[#6B7B69] border border-[#E8E4DC] hover:border-[#1C2B1A] hover:text-[#1C2B1A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-6 pb-10 flex flex-col gap-4">
        {/* Question card */}
        <div className="bg-[#1C2B1A] rounded-lg p-8 min-h-[200px] flex flex-col justify-between">
          <div>
            <p className="text-[#6B7B69] text-xs font-semibold uppercase tracking-widest mb-5">
              {activeCategory}
            </p>
            <p className="text-white text-lg font-medium leading-relaxed">
              {currentQuestion}
            </p>
          </div>
          <p className="text-[#4A3000] text-xs mt-6 opacity-60">
            {questionIndex + 1} / {QUESTIONS[activeCategory].length}
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-3 border border-[#E8E4DC] text-[#6B7B69] rounded text-sm font-medium hover:border-[#1C2B1A] hover:text-[#1C2B1A] transition-colors"
        >
          次の問いへ
        </button>

        {/* Answer section */}
        <div className="border border-[#E8E4DC] rounded-lg p-5 mt-2">
          <label className="block text-sm font-semibold text-[#1C2B1A] mb-3">
            あなたの答えを書いてみよう
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="思ったこと、感じたこと、なんでも…"
            rows={4}
            className="w-full border border-[#E8E4DC] rounded bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C2B1A] placeholder-[#6B7B69] focus:outline-none focus:border-[#D4541A] resize-none leading-relaxed transition-colors"
          />
          <button
            onClick={handleSendToCoach}
            disabled={!userAnswer.trim()}
            className="mt-4 w-full py-3 bg-[#D4541A] text-white rounded text-sm font-semibold disabled:opacity-30 transition-opacity hover:opacity-90 active:opacity-80"
          >
            AIコーチに相談する
          </button>
        </div>
      </div>
    </div>
  );
}
