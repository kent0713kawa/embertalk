'use client';

import { useState } from 'react';
import { Category } from '@/types';

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

const CATEGORY_STYLES: Record<Category, string> = {
  らしさ: 'from-violet-500 to-purple-600',
  強み: 'from-teal-500 to-emerald-600',
  挑戦: 'from-orange-400 to-red-500',
  関係性: 'from-pink-400 to-rose-500',
  未来: 'from-sky-400 to-blue-600',
};

export default function QuestionCard() {
  const [activeCategory, setActiveCategory] = useState<Category>('らしさ');
  const [questionIndex, setQuestionIndex] = useState(0);

  const categories: Category[] = ['らしさ', '強み', '挑戦', '関係性', '未来'];

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setQuestionIndex(0);
  };

  const handleNext = () => {
    const questions = QUESTIONS[activeCategory];
    setQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const currentQuestion = QUESTIONS[activeCategory][questionIndex];

  return (
    <div className="flex flex-col h-full px-4 py-6 gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">問いカード</h1>
        <p className="text-sm text-gray-500">テーマを選んで、焚き火を囲みながら話そう</p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className={`flex-1 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${CATEGORY_STYLES[activeCategory]} p-8 shadow-xl`}>
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium mb-4 tracking-wide"># {activeCategory}</p>
          <p className="text-white text-xl font-bold leading-relaxed">
            {currentQuestion}
          </p>
          <p className="text-white/60 text-xs mt-6">
            {questionIndex + 1} / {QUESTIONS[activeCategory].length}
          </p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="w-full py-4 bg-white border-2 border-violet-200 text-violet-700 rounded-2xl font-bold text-base hover:bg-violet-50 active:bg-violet-100 transition-all shadow-sm"
      >
        次の問い →
      </button>
    </div>
  );
}
