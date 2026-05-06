'use client';

import { useEffect, useRef, useState } from 'react';
import { Category, GlowAnswer } from '@/types';

const GLOW_STORAGE_KEY = 'embertalk_glow_answers';
const EMBER_COUNT_KEY  = 'embertalk_ember_count';

interface QuestionCardProps {
  mood: string | null;
  onMoodSet: (mood: string) => void;
  onSendToCoach: (question: string, answer: string) => void;
}

interface DynamicQuestion {
  question: string;
  questionEn: string;
  category: string;
}

type Phase = 'empathy' | 'empathy-fire' | 'theme' | 'loading-questions' | 'glow';

/* ── Static questions ── */

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
  強み:   'Strengths',
  挑戦:   'Challenge',
  関係性: 'Relations',
  未来:   'Future',
};

const CATEGORIES: Category[] = ['らしさ', '強み', '挑戦', '関係性', '未来'];

/* ── MoodInputView ── */

function MoodInputView({ onNext }: { onNext: (mood: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col bg-[#080F07]" style={{ minHeight: '100%' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 gap-10">
        <div className="text-center">
          <h2 className="font-bold tracking-wide" style={{ color: '#F0EBE0', fontSize: 22, letterSpacing: '0.08em' }}>
            いま、どんな気持ちですか？
          </h2>
          <p className="text-xs mt-2" style={{ color: '#3A5C36', letterSpacing: '0.1em', opacity: 0.8 }}>
            How are you feeling right now?
          </p>
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="なんかモヤモヤしてる、ワクワクしてる、疲れてる..."
          rows={3}
          autoFocus
          className="w-full rounded-lg px-4 py-4 text-sm resize-none focus:outline-none transition-all duration-200"
          style={{
            background: '#111A0F',
            border: '1px solid rgba(45,59,45,0.65)',
            color: '#F0EBE0',
            lineHeight: 1.9,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)'; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.65)'; }}
        />
        <div className="w-full flex flex-col items-center gap-3">
          <button
            onClick={() => onNext(value.trim())}
            className="w-full py-3.5 rounded text-sm font-medium transition-all duration-300"
            style={{
              border: '1px solid rgba(45,59,45,0.65)',
              color: '#C8B090',
              background: 'transparent',
              letterSpacing: '0.2em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45,59,45,0.15)';
              e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(45,59,45,0.65)';
            }}
          >
            次へ
          </button>
          <button
            onClick={() => onNext('')}
            className="text-xs transition-opacity duration-200"
            style={{ color: '#38563A', letterSpacing: '0.12em', opacity: 0.7 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Campfire ── */

function Campfire() {
  return (
    <div style={{ position: 'relative', width: 90, height: 90 }}>
      <div style={{
        position: 'absolute', left: '50%', bottom: 14,
        width: 52, height: 66,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(212,84,26,0.85) 0%, rgba(232,120,32,0.45) 55%, transparent 80%)',
        borderRadius: '48% 48% 22% 22%',
        animation: 'flame-outer 2.2s ease-in-out infinite alternate',
        filter: 'blur(2px)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 14,
        width: 36, height: 54,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(232,120,32,0.95) 0%, rgba(255,175,35,0.6) 55%, transparent 80%)',
        borderRadius: '48% 48% 22% 22%',
        animation: 'flame-mid 1.8s ease-in-out infinite alternate',
        filter: 'blur(1px)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 24,
        width: 18, height: 38,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 50% 75%, rgba(255,215,60,1) 0%, rgba(255,165,25,0.8) 50%, transparent 80%)',
        borderRadius: '50% 50% 28% 28%',
        animation: 'flame-tip 1.4s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 0,
        width: 64, height: 14,
        transform: 'translateX(-50%) rotate(-14deg)',
        transformOrigin: 'center center',
        background: 'linear-gradient(to right, #2A1505, #3D2210)',
        borderRadius: 3,
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 0,
        width: 64, height: 14,
        transform: 'translateX(-50%) rotate(14deg)',
        transformOrigin: 'center center',
        background: 'linear-gradient(to left, #2A1505, #3D2210)',
        borderRadius: 3,
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 0,
        width: 72, height: 20,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(212,84,26,0.4) 0%, transparent 70%)',
        filter: 'blur(4px)',
      }} />
    </div>
  );
}

/* ── LoadingCampfire ── */

function LoadingCampfire() {
  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: 128, height: 168 }}
    >
      <div className="absolute" style={{
        bottom: 6, left: '50%',
        width: 108, height: 44, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(212,84,26,0.55) 0%, rgba(212,84,26,0.12) 55%, transparent 72%)',
        animation: 'glow-pulse 2.2s ease-in-out infinite',
        transform: 'translateX(-50%)',
      }} />
      <div className="absolute" style={{
        bottom: 64, left: '44%', width: 3, height: 3, borderRadius: '50%',
        background: '#FFD060', animation: 'spark-a 1.9s ease-out 0s infinite',
      }} />
      <div className="absolute" style={{
        bottom: 64, left: '56%', width: 2, height: 2, borderRadius: '50%',
        background: '#FFA040', animation: 'spark-b 2.15s ease-out 0.7s infinite',
      }} />
      <div className="absolute" style={{
        bottom: 64, left: '50%', width: 2, height: 2, borderRadius: '50%',
        background: '#FFE090', animation: 'spark-c 1.65s ease-out 1.3s infinite',
      }} />
      <div className="absolute" style={{
        bottom: 20, left: '50%', width: 46, height: 88,
        background: 'linear-gradient(to top, #B83A0A 0%, #D4541A 30%, #E87820 65%, rgba(232,120,32,0) 100%)',
        borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
        transformOrigin: 'bottom center',
        animation: 'flicker-outer 1.9s ease-in-out infinite',
        transform: 'translateX(-50%)',
      }} />
      <div className="absolute" style={{
        bottom: 20, left: '50%', width: 30, height: 68,
        background: 'linear-gradient(to top, #E87820 0%, #F5A030 40%, #FFD060 78%, rgba(255,208,96,0) 100%)',
        borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
        transformOrigin: 'bottom center',
        animation: 'flicker-mid 1.25s ease-in-out infinite',
        transform: 'translateX(-50%)',
      }} />
      <div className="absolute" style={{
        bottom: 24, left: '50%', width: 16, height: 46,
        background: 'linear-gradient(to top, #FFD060 0%, #FFEE99 60%, rgba(255,238,153,0) 100%)',
        borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
        transformOrigin: 'bottom center',
        animation: 'flicker-tip 0.85s ease-in-out infinite',
        transform: 'translateX(-50%)',
      }} />
      <div className="absolute" style={{
        bottom: 10, left: '50%', width: 68, height: 10,
        background: 'linear-gradient(to right, #5C3410, #3D2208)',
        borderRadius: 8,
        transform: 'translateX(-68%) rotate(-22deg)',
      }} />
      <div className="absolute" style={{
        bottom: 10, left: '50%', width: 68, height: 10,
        background: 'linear-gradient(to left, #5C3410, #3D2208)',
        borderRadius: 8,
        transform: 'translateX(-32%) rotate(22deg)',
      }} />
    </div>
  );
}

/* ── Main component ── */

export default function QuestionCard({ mood, onMoodSet, onSendToCoach }: QuestionCardProps) {
  const [phase, setPhase] = useState<Phase>(() => mood !== null ? 'glow' : 'empathy');

  const [empathyText, setEmpathyText] = useState('');
  const [empathyDone, setEmpathyDone] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedThemes, setSelectedThemes] = useState<Category[]>([]);
  const [customContext,   setCustomContext]  = useState('');

  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [dynamicIndex,     setDynamicIndex]     = useState(0);

  const [activeCategory, setActiveCategory] = useState<Category>('らしさ');
  const [questionIndex,  setQuestionIndex]  = useState(0);

  const [userAnswer, setUserAnswer] = useState('');
  const [saved,      setSaved]      = useState(false);

  const [emberCount,     setEmberCount]     = useState<number>(() => {
    try { return parseInt(localStorage.getItem(EMBER_COUNT_KEY) || '0', 10); } catch { return 0; }
  });
  const [showEmberNotif, setShowEmberNotif] = useState(false);
  const [notifKey,       setNotifKey]       = useState(0);

  /* ── Fetch empathy text ── */
  useEffect(() => {
    if (phase !== 'empathy') return;
    if (mood === null) return;
    if (!mood?.trim()) {
      setPhase('theme');
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/mood-empathy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood }),
        });
        if (!res.ok || !res.body) throw new Error('fetch failed');
        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          if (!cancelled) setEmpathyText(text);
        }
      } catch {
        if (!cancelled) setEmpathyText('焚き火のそばへようこそ。');
      }
      if (!cancelled) {
        setEmpathyDone(true);
        advanceTimer.current = setTimeout(() => {
          if (!cancelled) setPhase('empathy-fire');
        }, 2500);
      }
    })();

    return () => {
      cancelled = true;
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [phase, mood]);

  /* ── Campfire transition after empathy ── */
  useEffect(() => {
    if (phase !== 'empathy-fire') return;
    const timer = setTimeout(() => setPhase('theme'), 900);
    return () => clearTimeout(timer);
  }, [phase]);

  /* ── Helpers ── */

  const saveToReflect = (question: string, answer: string, category: string): boolean => {
    if (!answer.trim()) return false;
    try {
      const existing: GlowAnswer[] = JSON.parse(localStorage.getItem(GLOW_STORAGE_KEY) || '[]');
      if (existing[0]?.question === question && existing[0]?.answer === answer.trim()) return false;
      const entry: GlowAnswer = {
        id: Date.now().toString(),
        question,
        answer: answer.trim(),
        category,
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
      localStorage.setItem(GLOW_STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 30)));
      return true;
    } catch { return false; }
  };

  const incrementEmber = () => {
    const next = emberCount + 1;
    setEmberCount(next);
    try { localStorage.setItem(EMBER_COUNT_KEY, String(next)); } catch { /* ignore */ }
    setNotifKey((k) => k + 1);
    setShowEmberNotif(true);
    setTimeout(() => setShowEmberNotif(false), 1600);
  };

  /* ── Theme handlers ── */

  const toggleTheme = (cat: Category) => {
    setSelectedThemes((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerateQuestions = async () => {
    setPhase('loading-questions');
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, themes: selectedThemes, customContext }),
      });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      if (data.questions?.length > 0) {
        setDynamicQuestions(data.questions);
        setDynamicIndex(0);
      }
    } catch {
      /* fallback: proceed with static questions */
    } finally {
      setPhase('glow');
      setUserAnswer('');
    }
  };

  /* ── Glow helpers ── */

  const isDynamic = dynamicQuestions.length > 0;

  const currentQuestion   = isDynamic
    ? dynamicQuestions[dynamicIndex].question
    : QUESTIONS[activeCategory][questionIndex];
  const currentQuestionEN = isDynamic
    ? dynamicQuestions[dynamicIndex].questionEn
    : QUESTIONS_EN[activeCategory][questionIndex];
  const currentCategory   = isDynamic
    ? dynamicQuestions[dynamicIndex].category
    : activeCategory;
  const currentCategoryEN = isDynamic
    ? (CATEGORY_EN[currentCategory as Category] ?? currentCategory)
    : CATEGORY_EN[activeCategory];
  const totalQuestions = isDynamic ? dynamicQuestions.length : QUESTIONS[activeCategory].length;
  const currentIdx     = isDynamic ? dynamicIndex : questionIndex;

  const handleNext = () => {
    saveToReflect(currentQuestion, userAnswer, currentCategory);
    if (isDynamic) {
      setDynamicIndex((p) => (p + 1) % dynamicQuestions.length);
    } else {
      setQuestionIndex((p) => (p + 1) % QUESTIONS[activeCategory].length);
    }
    setUserAnswer('');
    setSaved(false);
  };

  const handlePrev = () => {
    saveToReflect(currentQuestion, userAnswer, currentCategory);
    if (isDynamic) {
      setDynamicIndex((p) => (p - 1 + dynamicQuestions.length) % dynamicQuestions.length);
    } else {
      setQuestionIndex((p) => (p - 1 + QUESTIONS[activeCategory].length) % QUESTIONS[activeCategory].length);
    }
    setUserAnswer('');
    setSaved(false);
  };

  const handleCategoryChange = (cat: Category) => {
    saveToReflect(currentQuestion, userAnswer, currentCategory);
    setActiveCategory(cat);
    setQuestionIndex(0);
    setUserAnswer('');
    setSaved(false);
  };

  const handleSave = () => {
    if (!userAnswer.trim()) return;
    const didSave = saveToReflect(currentQuestion, userAnswer, currentCategory);
    if (didSave) incrementEmber();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendToCoach = () => {
    if (!userAnswer.trim()) return;
    const didSave = saveToReflect(currentQuestion, userAnswer, currentCategory);
    if (didSave) incrementEmber();
    onSendToCoach(currentQuestion, userAnswer.trim());
    setUserAnswer('');
    setSaved(false);
  };

  /* ════════════════════════
     RENDER
  ════════════════════════ */

  if (mood === null) return <MoodInputView onNext={onMoodSet} />;

  /* ── Empathy ── */
  if (phase === 'empathy') {
    return (
      <div
        className="ember-enter flex flex-col items-center justify-center px-10"
        style={{ background: '#080F07', minHeight: '100%' }}
      >
        <div className="text-center" style={{ maxWidth: 320, minHeight: 100 }}>
          {empathyText ? (
            <p
              className="leading-loose"
              style={{
                color: '#D4B896',
                fontSize: 17,
                letterSpacing: '0.055em',
                lineHeight: 2.1,
                textShadow: '0 0 24px rgba(212,84,26,0.18)',
              }}
            >
              {empathyText}
            </p>
          ) : (
            <div className="flex gap-2 justify-center items-center" style={{ height: 100 }}>
              {[0, 160, 320].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: '#C87040', animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {empathyDone && (
          <button
            onClick={() => {
              if (advanceTimer.current) clearTimeout(advanceTimer.current);
              setPhase('empathy-fire');
            }}
            className="mt-14 text-sm tracking-widest transition-opacity duration-300"
            style={{ color: '#4A6A45', letterSpacing: '0.22em', opacity: 0.65 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; }}
          >
            次へ ›
          </button>
        )}
      </div>
    );
  }

  /* ── Empathy → fire transition ── */
  if (phase === 'empathy-fire') {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ background: '#080F07', minHeight: '100%' }}
      >
        <LoadingCampfire />
      </div>
    );
  }

  /* ── Theme selection ── */
  if (phase === 'theme') {
    return (
      <div
        className="ember-enter flex flex-col px-6 gap-8"
        style={{ background: '#080F07', minHeight: '100%', paddingTop: 60, paddingBottom: 40 }}
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#F0EBE0', letterSpacing: '0.06em' }}>
            今日は何を探りたい？
          </h2>
          <p className="text-xs mt-2" style={{ color: '#38563A', letterSpacing: '0.08em' }}>
            What would you like to explore today?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const selected = selectedThemes.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleTheme(cat)}
                className="py-4 px-3 rounded-lg text-left transition-all duration-200"
                style={
                  selected
                    ? { background: 'rgba(45,59,45,0.3)', border: '1px solid rgba(45,59,45,0.85)', color: '#C8B090' }
                    : { background: '#111A0F',            border: '1px solid rgba(45,59,45,0.5)',  color: '#5A7A55' }
                }
              >
                <span className="block text-sm font-medium">{cat}</span>
                <span className="block text-[10px] mt-0.5" style={{ opacity: 0.6 }}>{CATEGORY_EN[cat]}</span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#38563A' }}>
            気になっていること（任意）
          </label>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="最近モヤモヤしていること、仕事のことなど..."
            rows={3}
            className="w-full rounded-lg px-4 py-3 text-sm resize-none focus:outline-none transition-all duration-200"
            style={{
              background: '#111A0F',
              border: '1px solid rgba(45,59,45,0.55)',
              color: '#F0EBE0',
              lineHeight: 1.9,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)'; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.55)'; }}
          />
        </div>

        <button
          onClick={handleGenerateQuestions}
          className="w-full py-4 rounded text-sm font-medium tracking-widest transition-all duration-300"
          style={{
            border: '1px solid rgba(45,59,45,0.65)',
            color: '#C8B090',
            background: 'transparent',
            letterSpacing: '0.18em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(45,59,45,0.15)';
            e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(45,59,45,0.65)';
          }}
        >
          この内容で始める
        </button>
      </div>
    );
  }

  /* ── Loading questions ── */
  if (phase === 'loading-questions') {
    return (
      <div className="flex flex-col items-center justify-center gap-8" style={{ background: '#080F07', minHeight: '100%' }}>
        <LoadingCampfire />
        <p className="text-xs tracking-widest" style={{ color: '#38563A', letterSpacing: '0.15em' }}>問いを準備しています...</p>
      </div>
    );
  }

  /* ── Glow ── */
  return (
    <div className="flex flex-col bg-[#080F07]">

      <div className="px-6 pt-10 pb-6 relative">
        <h1 className="text-2xl font-bold tracking-widest" style={{ color: '#F0EBE0', letterSpacing: '0.15em' }}>
          Embertalk
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A7A55' }}>
          {isDynamic ? 'あなたへの問い' : 'テーマを選んで、じっくり考えよう'}
        </p>

        {emberCount > 0 && (
          <span className="absolute top-10 right-6 text-xs font-medium" style={{ color: '#E87820' }}>
            🔥 {emberCount} {emberCount === 1 ? 'Ember' : 'Embers'}
          </span>
        )}

        {showEmberNotif && (
          <span key={notifKey} className="ember-notif-rise text-sm font-bold" style={{ color: '#E87820', right: 20, top: 28 }}>
            +1 Ember 🔥
          </span>
        )}
      </div>

      {!isDynamic && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-6 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="flex-shrink-0 px-4 py-2 rounded text-center transition-all duration-200"
              style={
                activeCategory === cat
                  ? { background: '#1A2A18', border: '1px solid rgba(45,59,45,0.85)', color: '#F0EBE0' }
                  : { background: 'transparent', border: '1px solid rgba(45,59,45,0.45)', color: '#5A7A55' }
              }
            >
              <span className="block text-sm font-medium leading-tight">{cat}</span>
              <span className="block text-[10px] leading-tight mt-0.5"
                style={{ color: activeCategory === cat ? 'rgba(240,235,224,0.5)' : 'rgba(90,122,85,0.6)' }}>
                {CATEGORY_EN[cat]}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-10 flex flex-col gap-4">

        <div className="rounded-lg p-7 flex flex-col gap-5"
          style={{ background: '#111A0F', border: '1px solid rgba(45,59,45,0.6)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#5A7A55' }}>
            {currentCategory} · {currentCategoryEN}
          </p>
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium leading-relaxed" style={{ color: '#F0EBE0' }}>
              {currentQuestion}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,235,224,0.3)' }}>
              {currentQuestionEN}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'rgba(240,235,224,0.18)' }}>
            {currentIdx + 1} / {totalQuestions}
          </p>
        </div>

        {isDynamic ? (
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded text-sm tracking-wide transition-all duration-200"
              style={{ border: '1px solid rgba(45,59,45,0.45)', color: '#5A7A55', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.8)'; e.currentTarget.style.color = '#C8B090'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.45)'; e.currentTarget.style.color = '#5A7A55'; }}
            >‹ 前の問い</button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded text-sm tracking-wide transition-all duration-200"
              style={{ border: '1px solid rgba(45,59,45,0.45)', color: '#5A7A55', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.8)'; e.currentTarget.style.color = '#C8B090'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.45)'; e.currentTarget.style.color = '#5A7A55'; }}
            >次の問い ›</button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded text-sm font-medium tracking-wide transition-all duration-200"
            style={{ border: '1px solid rgba(45,59,45,0.45)', color: '#5A7A55', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.8)'; e.currentTarget.style.color = '#C8B090'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.45)'; e.currentTarget.style.color = '#5A7A55'; }}
          >次の問いへ</button>
        )}

        <div className="rounded-lg p-5 flex flex-col gap-4"
          style={{ background: '#111A0F', border: '1px solid rgba(45,59,45,0.6)' }}>
          <label className="block text-sm font-medium" style={{ color: '#C8B090' }}>
            あなたの答えを書いてみよう
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => { setUserAnswer(e.target.value); setSaved(false); }}
            placeholder="思ったこと、感じたこと、なんでも…"
            rows={4}
            className="w-full rounded px-4 py-3 text-sm resize-none leading-relaxed focus:outline-none transition-all duration-200"
            style={{ background: '#0A1208', border: '1px solid rgba(45,59,45,0.55)', color: '#F0EBE0' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)'; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(45,59,45,0.55)'; }}
          />

          <button
            onClick={handleSave}
            disabled={!userAnswer.trim()}
            className="w-full py-2.5 rounded text-sm tracking-wide transition-all duration-200 disabled:opacity-25"
            style={{
              border: '1px solid rgba(45,59,45,0.6)',
              color: saved ? '#5A7A55' : '#8AAA85',
              background: saved ? 'rgba(45,59,45,0.15)' : 'transparent',
            }}
          >
            {saved ? 'Reflectに記録しました ✓' : 'Reflectに記録する'}
          </button>

          <button
            onClick={handleSendToCoach}
            disabled={!userAnswer.trim()}
            className="w-full py-3 rounded text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-25"
            style={{ border: '1px solid rgba(45,59,45,0.65)', color: '#C8B090', background: 'transparent' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = 'rgba(45,59,45,0.15)'; e.currentTarget.style.borderColor = 'rgba(45,59,45,0.9)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(45,59,45,0.65)'; }}
          >
            AIコーチに相談する
          </button>
        </div>

      </div>
    </div>
  );
}
