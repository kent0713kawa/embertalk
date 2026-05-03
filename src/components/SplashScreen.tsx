'use client';

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <>
      <style>{`
        @keyframes flicker-outer {
          0%, 100% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(-1deg); }
          20%  { transform: translateX(-50%) scaleX(0.92) scaleY(1.09) rotate(2deg); }
          40%  { transform: translateX(-50%) scaleX(1.07) scaleY(0.93) rotate(-2deg); }
          60%  { transform: translateX(-50%) scaleX(0.96) scaleY(1.05) rotate(1deg); }
          80%  { transform: translateX(-50%) scaleX(1.04) scaleY(0.96) rotate(-1deg); }
        }
        @keyframes flicker-mid {
          0%, 100% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(1deg); opacity: 0.9; }
          25%  { transform: translateX(-50%) scaleX(1.08) scaleY(0.94) rotate(-2deg); opacity: 1; }
          50%  { transform: translateX(-50%) scaleX(0.93) scaleY(1.08) rotate(3deg); opacity: 0.85; }
          75%  { transform: translateX(-50%) scaleX(1.05) scaleY(0.97) rotate(-1deg); opacity: 1; }
        }
        @keyframes flicker-tip {
          0%, 100% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(-2deg); opacity: 0.75; }
          33%  { transform: translateX(-50%) scaleX(0.88) scaleY(1.12) rotate(4deg); opacity: 1; }
          66%  { transform: translateX(-50%) scaleX(1.12) scaleY(0.91) rotate(-4deg); opacity: 0.65; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.45; transform: translateX(-50%) scaleX(1) scaleY(1); }
          50%       { opacity: 0.75; transform: translateX(-50%) scaleX(1.15) scaleY(1.25); }
        }
        @keyframes spark-a {
          0%   { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-56px) translateX(-10px); opacity: 0; }
        }
        @keyframes spark-b {
          0%   { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-64px) translateX(12px); opacity: 0; }
        }
        @keyframes spark-c {
          0%   { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-48px) translateX(-6px); opacity: 0; }
        }
        @keyframes ember-glow {
          0%, 100% { text-shadow: 0 0 24px rgba(212,84,26,0.25); }
          50%       { text-shadow: 0 0 48px rgba(212,84,26,0.55); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ backgroundColor: '#080F07' }}
      >
        {/* Campfire */}
        <div
          className="relative flex items-end justify-center"
          style={{ width: 128, height: 168, animation: 'fade-in-up 1s ease-out 0.2s both' }}
        >
          {/* Ground glow */}
          <div
            className="absolute"
            style={{
              bottom: 6,
              left: '50%',
              width: 108,
              height: 44,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse, rgba(212,84,26,0.55) 0%, rgba(212,84,26,0.12) 55%, transparent 72%)',
              animation: 'glow-pulse 2.2s ease-in-out infinite',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Outer flame — orange */}
          <div
            className="absolute"
            style={{
              bottom: 20,
              left: '50%',
              width: 46,
              height: 88,
              background:
                'linear-gradient(to top, #B83A0A 0%, #D4541A 30%, #E87820 65%, rgba(232,120,32,0) 100%)',
              borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
              transformOrigin: 'bottom center',
              animation: 'flicker-outer 1.9s ease-in-out infinite',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Mid flame — amber */}
          <div
            className="absolute"
            style={{
              bottom: 20,
              left: '50%',
              width: 30,
              height: 68,
              background:
                'linear-gradient(to top, #E87820 0%, #F5A030 40%, #FFD060 78%, rgba(255,208,96,0) 100%)',
              borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
              transformOrigin: 'bottom center',
              animation: 'flicker-mid 1.25s ease-in-out infinite',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Tip flame — yellow */}
          <div
            className="absolute"
            style={{
              bottom: 24,
              left: '50%',
              width: 16,
              height: 46,
              background:
                'linear-gradient(to top, #FFD060 0%, #FFEE99 60%, rgba(255,238,153,0) 100%)',
              borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
              transformOrigin: 'bottom center',
              animation: 'flicker-tip 0.85s ease-in-out infinite',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Log left */}
          <div
            className="absolute"
            style={{
              bottom: 10,
              left: '50%',
              width: 68,
              height: 10,
              background: 'linear-gradient(to right, #5C3410, #3D2208)',
              borderRadius: 8,
              transform: 'translateX(-68%) rotate(-22deg)',
            }}
          />
          {/* Log right */}
          <div
            className="absolute"
            style={{
              bottom: 10,
              left: '50%',
              width: 68,
              height: 10,
              background: 'linear-gradient(to left, #5C3410, #3D2208)',
              borderRadius: 8,
              transform: 'translateX(-32%) rotate(22deg)',
            }}
          />

          {/* Sparks */}
          <div
            className="absolute"
            style={{
              bottom: 64,
              left: '44%',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#FFD060',
              animation: 'spark-a 1.9s ease-out 0s infinite',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: 64,
              left: '56%',
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: '#FFA040',
              animation: 'spark-b 2.15s ease-out 0.7s infinite',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: 64,
              left: '50%',
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: '#FFE090',
              animation: 'spark-c 1.65s ease-out 1.3s infinite',
            }}
          />
        </div>

        {/* Logo */}
        <h1
          className="font-bold tracking-widest"
          style={{
            marginTop: 32,
            fontSize: 36,
            color: '#F0EBE0',
            letterSpacing: '0.22em',
            animation: 'ember-glow 3s ease-in-out infinite, fade-in-up 1s ease-out 0.5s both',
          }}
        >
          embertalk
        </h1>

        <p
          className="text-xs tracking-widest"
          style={{
            marginTop: 8,
            color: '#3A5C36',
            letterSpacing: '0.12em',
            animation: 'fade-in-up 1s ease-out 0.7s both',
          }}
        >
          あなたらしさに、火をつけよう
        </p>
        <p
          className="text-[10px] tracking-widest"
          style={{
            marginTop: 4,
            color: '#3A5C36',
            letterSpacing: '0.1em',
            opacity: 0.55,
            animation: 'fade-in-up 1s ease-out 0.8s both',
          }}
        >
          Ignite what makes you, you.
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          className="text-sm font-medium tracking-widest transition-all duration-300"
          style={{
            marginTop: 48,
            padding: '12px 40px',
            color: '#C8C0B0',
            border: '1px solid rgba(200,192,176,0.25)',
            borderRadius: 4,
            background: 'transparent',
            letterSpacing: '0.18em',
            animation: 'fade-in-up 1s ease-out 0.9s both',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,84,26,0.7)';
            e.currentTarget.style.color = '#D4541A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200,192,176,0.25)';
            e.currentTarget.style.color = '#C8C0B0';
          }}
        >
          Start
        </button>
      </div>
    </>
  );
}
