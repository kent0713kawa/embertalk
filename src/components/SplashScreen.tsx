'use client';

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#080F07' }}
    >
      {/* Campfire */}
      <div
        className="relative flex items-end justify-center"
        style={{ width: 120, height: 156, animation: 'fade-in-up 1s ease-out 0.2s both' }}
      >
        <div
          className="absolute"
          style={{
            bottom: 6, left: '50%', width: 100, height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,84,26,0.5) 0%, rgba(212,84,26,0.1) 55%, transparent 72%)',
            animation: 'glow-pulse 2.2s ease-in-out infinite',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 18, left: '50%', width: 42, height: 82,
            background: 'linear-gradient(to top, #B83A0A 0%, #D4541A 30%, #E87820 65%, rgba(232,120,32,0) 100%)',
            borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
            transformOrigin: 'bottom center',
            animation: 'flicker-outer 1.9s ease-in-out infinite',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 18, left: '50%', width: 27, height: 62,
            background: 'linear-gradient(to top, #E87820 0%, #F5A030 40%, #FFD060 78%, rgba(255,208,96,0) 100%)',
            borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
            transformOrigin: 'bottom center',
            animation: 'flicker-mid 1.25s ease-in-out infinite',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: 22, left: '50%', width: 14, height: 42,
            background: 'linear-gradient(to top, #FFD060 0%, #FFEE99 60%, rgba(255,238,153,0) 100%)',
            borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
            transformOrigin: 'bottom center',
            animation: 'flicker-tip 0.85s ease-in-out infinite',
            transform: 'translateX(-50%)',
          }}
        />
        <div className="absolute" style={{ bottom: 8, left: '50%', width: 64, height: 9, background: 'linear-gradient(to right, #5C3410, #3D2208)', borderRadius: 8, transform: 'translateX(-68%) rotate(-22deg)' }} />
        <div className="absolute" style={{ bottom: 8, left: '50%', width: 64, height: 9, background: 'linear-gradient(to left, #5C3410, #3D2208)', borderRadius: 8, transform: 'translateX(-32%) rotate(22deg)' }} />
        <div className="absolute" style={{ bottom: 58, left: '44%', width: 3, height: 3, borderRadius: '50%', background: '#FFD060', animation: 'spark-a 1.9s ease-out 0s infinite' }} />
        <div className="absolute" style={{ bottom: 58, left: '56%', width: 2, height: 2, borderRadius: '50%', background: '#FFA040', animation: 'spark-b 2.15s ease-out 0.7s infinite' }} />
        <div className="absolute" style={{ bottom: 58, left: '50%', width: 2, height: 2, borderRadius: '50%', background: '#FFE090', animation: 'spark-c 1.65s ease-out 1.3s infinite' }} />
      </div>

      {/* Logo */}
      <div style={{ marginTop: 28, animation: 'fade-in-up 1s ease-out 0.5s both' }}>
        <h1
          className="font-bold tracking-widest text-center"
          style={{ fontSize: 32, color: '#F0EBE0', letterSpacing: '0.22em', animation: 'ember-glow 3s ease-in-out infinite' }}
        >
          embertalk
        </h1>
        <p
          className="text-center tracking-[0.55em] font-light"
          style={{ fontSize: 11, color: '#5A7A55', marginTop: 3, letterSpacing: '0.55em' }}
        >
          L I T E
        </p>
      </div>

      <p
        className="text-sm tracking-wide text-center"
        style={{ marginTop: 20, color: '#3A5C36', letterSpacing: '0.08em', animation: 'fade-in-up 1s ease-out 0.7s both' }}
      >
        5分で、キャリアを言語化しよう
      </p>
      <p
        className="text-[10px] tracking-widest text-center"
        style={{ marginTop: 4, color: '#3A5C36', opacity: 0.5, letterSpacing: '0.1em', animation: 'fade-in-up 1s ease-out 0.8s both' }}
      >
        Clarify your career in 5 minutes.
      </p>

      <button
        onClick={onStart}
        className="text-sm font-medium tracking-widest transition-all duration-300"
        style={{
          marginTop: 48,
          padding: '12px 40px',
          color: '#C8C0B0',
          border: '1px solid rgba(200,192,176,0.22)',
          borderRadius: 4,
          background: 'transparent',
          letterSpacing: '0.18em',
          animation: 'fade-in-up 1s ease-out 0.9s both',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,84,26,0.4)'; e.currentTarget.style.color = '#C8B090'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,192,176,0.22)'; e.currentTarget.style.color = '#C8C0B0'; }}
      >
        Start
      </button>
    </div>
  );
}
