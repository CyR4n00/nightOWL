import { useState, useEffect } from "react";
import { Lock } from "lucide-react";



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
    <div className="flex flex-col items-center justify-center min-h-[100dvh] text-center p-6 bg-slate-950 font-sans absolute inset-0 z-50 theme-default pb-safe">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mt-12">
        <h1 className="text-2xl font-stencil text-white tracking-[0.2em] mb-12 opacity-80 mt-[-10vh] absolute top-12 left-1/2 -translate-x-1/2">NIGHTOWL</h1>

        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 bg-yellow-200/20 blur-3xl rounded-full" />
          <div className="w-full h-full rounded-full shadow-[0_0_50px_rgba(255,255,200,0.4)] overflow-hidden">
             {/* Moon image or CSS approximation */}
             <div className="w-full h-full bg-yellow-100 rounded-full mix-blend-screen opacity-90 shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.3)]"></div>
          </div>
        </div>

        <p className="text-white/80 mb-6 tracking-[0.2em] text-sm font-light mt-4">
          夜が来るまで、あとすこし
        </p>


        <div className="flex flex-col items-center justify-center w-full mb-12">
          <div className="flex items-center justify-center text-7xl font-numbers font-light text-white tracking-widest glow-text w-full">
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-white/80 mx-1 pb-1 font-sans">:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center justify-center w-64 mt-4">
             <div className="px-4 py-1.5 rounded-full bg-white/10 flex items-center gap-2 border border-white/20">
                <Lock className="w-3 h-3 text-white/70" />
                <span className="text-[11px] text-white/80 font-numbers tracking-[0.1em]">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
                </span>
             </div>
          </div>
        </div>



        {/* Debug bypass button for testing - Made prominent for the user */}
        <button
          onClick={onEnter}
          className="mt-8 px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 rounded-2xl text-indigo-200 font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 text-xs opacity-50 hover:opacity-100"
        >
          🔧 デバッグ用強制起動
        </button>
      </div>
    </div>
  );
}
