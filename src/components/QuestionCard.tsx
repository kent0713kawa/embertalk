'use client';

import { useState } from 'react';
import { Category, GlowAnswer } from '@/types';

const GLOW_STORAGE_KEY = 'embertalk_glow_answers';

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

const QUESTIONS_EN: Record<Category, string[]> = {
  らしさ: [
    'When did you last feel most like yourself?',
    'What part of you has stayed the same over the years?',
    "When do friends say \"that's so you\"?",
    'When do you feel most natural and at ease?',
  ],
  強み: [
    'What have you been thanked for recently?',
    'Describe a moment you felt truly helpful to someone.',
    'What do you do effortlessly, almost without thinking?',
    'What do people often ask you for help with?',
  ],
  挑戦: [
    'What recent challenge was worth the leap?',
    'What did you discover about yourself through that challenge?',
    'If success were guaranteed, what would you try?',
    'What would you do with just a little more courage?',
  ],
  関係性: [
    'Is there someone who brings out an unexpected side of you?',
    'Who makes you feel most like yourself?',
    'Who have you been meaning to thank lately?',
    'Share a moment in a relationship that made you happy.',
  ],
  未来: [
    'What message would you send to yourself three years from now?',
    'What kind of person do you want to become?',
    'What values do you want to carry forward?',
    'What is one thing you can start tomorrow?',
  ],
};

const CATEGORY_EN: Record<Category, string> = {
  らしさ: 'Identity',
  強み: 'Strengths',
  挑戦: 'Challenge',
  関係性: 'Relations',
  未来: 'Future',
};

export default function QuestionCard({ onSendToCoach }: QuestionCardProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('らしさ');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  const categories: Category[] = ['らしさ', '強み', '挑戦', '関係性', '未来'];

  const saveToReflect = (question: string, answer: string, category: Category) => {
    if (!answer.trim()) return;
    try {
      const existing: GlowAnswer[] = JSON.parse(localStorage.getItem(GLOW_STORAGE_KEY) || '[]');
      // 同じ問いの直近の回答と重複していたらスキップ
      if (existing[0]?.question === question && existing[0]?.answer === answer.trim()) return;
      const entry: GlowAnswer = {
        id: Date.now().toString(),
        question,
        answer: answer.trim(),
        category,
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
      localStorage.setItem(GLOW_STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 30)));
    } catch { /* ignore */ }
  };

  const handleCategoryChange = (cat: Category) => {
    // カテゴリ切替時に書きかけの回答を自動保存
    saveToReflect(currentQuestion, userAnswer, activeCategory);
    setActiveCategory(cat);
    setQuestionIndex(0);
    setUserAnswer('');
    setSaved(false);
  };

  const handleNext = () => {
    // 次の問いへ進む際に回答を自動保存
    saveToReflect(currentQuestion, userAnswer, activeCategory);
    const questions = QUESTIONS[activeCategory];
    setQuestionIndex((prev) => (prev + 1) % questions.length);
    setUserAnswer('');
    setSaved(false);
  };

  const handleSave = () => {
    if (!userAnswer.trim()) return;
    saveToReflect(currentQuestion, userAnswer, activeCategory);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendToCoach = () => {
    if (!userAnswer.trim()) return;
    saveToReflect(currentQuestion, userAnswer, activeCategory);
    onSendToCoach(currentQuestion, userAnswer.trim());
    setUserAnswer('');
    setSaved(false);
  };

  const currentQuestion = QUESTIONS[activeCategory][questionIndex];
  const currentQuestionEN = QUESTIONS_EN[activeCategory][questionIndex];

  return (
    <div className="flex flex-col bg-[#080F07]">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1
          className="text-2xl font-bold tracking-widest"
          style={{ color: '#F0EBE0', letterSpacing: '0.15em' }}
        >
          Embertalk
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A7A55' }}>
          テーマを選んで、じっくり考えよう
        </p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-6 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className="flex-shrink-0 px-4 py-2 rounded text-center transition-all duration-200"
            style={
              activeCategory === cat
                ? {
                    background: '#1A2A18',
                    border: '1px solid rgba(212,84,26,0.55)',
                    color: '#F0EBE0',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid rgba(212,84,26,0.18)',
                    color: '#5A7A55',
                  }
            }
          >
            <span className="block text-sm font-medium leading-tight">{cat}</span>
            <span
              className="block text-[10px] leading-tight mt-0.5"
              style={{ color: activeCategory === cat ? 'rgba(240,235,224,0.5)' : 'rgba(90,122,85,0.6)' }}
            >
              {CATEGORY_EN[cat]}
            </span>
          </button>
        ))}
      </div>

      <div className="px-6 pb-10 flex flex-col gap-4">
        {/* Question card */}
        <div
          className="rounded-lg p-7 flex flex-col gap-5"
          style={{
            background: '#111A0F',
            border: '1px solid rgba(212,84,26,0.15)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#5A7A55' }}
          >
            {activeCategory} · {CATEGORY_EN[activeCategory]}
          </p>
          <div className="flex flex-col gap-3">
            <p
              className="text-lg font-medium leading-relaxed"
              style={{ color: '#F0EBE0' }}
            >
              {currentQuestion}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(240,235,224,0.3)' }}
            >
              {currentQuestionEN}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'rgba(240,235,224,0.18)' }}>
            {questionIndex + 1} / {QUESTIONS[activeCategory].length}
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-3 rounded text-sm font-medium tracking-wide transition-all duration-200"
          style={{
            border: '1px solid rgba(212,84,26,0.22)',
            color: '#5A7A55',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,84,26,0.5)';
            e.currentTarget.style.color = '#C8B090';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,84,26,0.22)';
            e.currentTarget.style.color = '#5A7A55';
          }}
        >
          次の問いへ
        </button>

        {/* Answer section */}
        <div
          className="rounded-lg p-5 flex flex-col gap-4"
          style={{
            background: '#111A0F',
            border: '1px solid rgba(212,84,26,0.15)',
          }}
        >
          <label
            className="block text-sm font-medium"
            style={{ color: '#C8B090' }}
          >
            あなたの答えを書いてみよう
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => { setUserAnswer(e.target.value); setSaved(false); }}
            placeholder="思ったこと、感じたこと、なんでも…"
            rows={4}
            className="w-full rounded px-4 py-3 text-sm resize-none leading-relaxed focus:outline-none transition-all duration-200"
            style={{
              background: '#0A1208',
              border: '1px solid rgba(212,84,26,0.2)',
              color: '#F0EBE0',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,84,26,0.6)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,84,26,0.2)'; }}
          />

          {/* Reflectに記録 */}
          <button
            onClick={handleSave}
            disabled={!userAnswer.trim()}
            className="w-full py-2.5 rounded text-sm tracking-wide transition-all duration-200 disabled:opacity-25"
            style={{
              border: '1px solid rgba(212,84,26,0.28)',
              color: saved ? '#5A7A55' : '#8AAA85',
              background: saved ? 'rgba(90,122,85,0.08)' : 'transparent',
            }}
          >
            {saved ? 'Reflectに記録しました ✓' : 'Reflectに記録する'}
          </button>

          {/* AIコーチに相談 */}
          <button
            onClick={handleSendToCoach}
            disabled={!userAnswer.trim()}
            className="w-full py-3 rounded text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-25"
            style={{
              border: '1px solid rgba(212,84,26,0.6)',
              color: '#D4541A',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background = 'rgba(212,84,26,0.1)';
                e.currentTarget.style.borderColor = 'rgba(212,84,26,0.85)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(212,84,26,0.6)';
            }}
          >
            AIコーチに相談する
          </button>
        </div>
      </div>
    </div>
  );
}
