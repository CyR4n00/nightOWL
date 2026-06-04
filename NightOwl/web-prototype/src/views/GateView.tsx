import { useState, useEffect } from "react";



export function GateView({ onEnter }: { onEnter: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();

      // If time hits 24:00 (00:00) to 06:00 naturally, transition
      if (hours >= 0 && hours < 6) {
        onEnter();
        return;
      }

      const target = new Date(now);
      target.setHours(24, 0, 0, 0); // Next midnight

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }, 1000);
    return () => clearInterval(timer);
  }, [onEnter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] text-center p-6 bg-slate-950 font-sans absolute inset-0 z-50">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-full h-full rounded-full border-2 border-indigo-500/30 flex items-center justify-center glass-panel shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <span className="text-4xl">🌙</span>
          </div>
        </div>

        <h1 className="text-4xl font-serif glow-text tracking-widest mb-4">NightOwl</h1>
        <p className="text-indigo-200/60 mb-12 tracking-wider text-sm font-light">
          夜の静寂が訪れるまで<br/>あと少し
        </p>

        <div className="flex items-center justify-center gap-4 text-5xl font-numbers font-light text-slate-200 w-full mb-8">
          <div className="flex flex-col items-center flex-1">
            <span className="tabular-nums tracking-wider text-shadow-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] text-indigo-400/50 mt-2 font-sans tracking-widest uppercase">Hours</span>
          </div>
          <span className="text-indigo-500/50 -mt-6">:</span>
          <div className="flex flex-col items-center flex-1">
            <span className="tabular-nums tracking-wider text-shadow-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] text-indigo-400/50 mt-2 font-sans tracking-widest uppercase">Mins</span>
          </div>
          <span className="text-indigo-500/50 -mt-6">:</span>
          <div className="flex flex-col items-center flex-1">
            <span className="tabular-nums tracking-wider text-shadow-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] text-indigo-400/50 mt-2 font-sans tracking-widest uppercase">Secs</span>
          </div>
        </div>

        {/* Debug bypass button for testing - Made prominent for the user */}
        <button
          onClick={onEnter}
          className="mt-12 px-8 py-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 rounded-2xl text-indigo-200 font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95"
        >
          🔧 デバッグ用：強制的にアプリを開く
        </button>
      </div>
    </div>
  );
}
