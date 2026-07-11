import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Home, MessageSquare, User, Headphones } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// ⚡ Bolt: Code-split route components to prevent heavy dependencies (like Agora SDK in VoiceRoomView)
// from blocking the initial render. This optimization moves the ~1.5MB VoiceRoomView out of the main bundle,
// significantly improving TTI (Time to Interactive).
const AuthView = lazy(() => import('./components/AuthView'));
const GateView = lazy(() => import('./views/GateView').then(m => ({ default: m.GateView })));
const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const FriendChatView = lazy(() => import('./views/FriendChatView').then(m => ({ default: m.FriendChatView })));
const VoiceRoomMainView = lazy(() => import('./views/VoiceRoomView').then(m => ({ default: m.VoiceRoomMainView })));
const MyPageView = lazy(() => import('./views/MyPageView').then(m => ({ default: m.MyPageView })));

export default function App() {
  const [isNightTime, setIsNightTime] = useState(false);
  const [theme, setTheme] = useState<'default' | 'aurora' | 'deepsea' | 'dusk' | 'galaxy'>('default');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours >= 0 && hours < 6) {
        setIsNightTime(true);
      }
    };
    checkTime();
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const bubbles = useMemo(() => {
    return theme === 'deepsea' ? Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      // eslint-disable-next-line react-hooks/purity
      left: `${Math.random() * 100}%`,
      // eslint-disable-next-line react-hooks/purity
      size: `${Math.random() * 20 + 10}px`,
      // eslint-disable-next-line react-hooks/purity
      delay: `${Math.random() * 5}s`,
      // eslint-disable-next-line react-hooks/purity
      duration: `${Math.random() * 10 + 5}s`
    })) : [];
  }, [theme]);

  return (
    <>
      {theme === 'deepsea' && bubbles.map(b => (
        <div key={b.id} className="bubble" style={{
          left: b.left,
          width: b.size,
          height: b.size,
          animationDelay: b.delay,
          animationDuration: b.duration
        }} />
      ))}

      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
        {!isNightTime ? (
          <GateView onEnter={() => setIsNightTime(true)} />
        ) : !session ? (
          <AuthView onAuthSuccess={() => {}} />
        ) : (
          <MainApp theme={theme} setTheme={setTheme} session={session} />
        )}
      </Suspense>
    </>
  );
}

function MainApp({ theme, setTheme, session }: { theme: string, setTheme: (t: 'default' | 'aurora' | 'deepsea' | 'dusk' | 'galaxy') => void, session: Session | null }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isPremium, setIsPremium] = useState(false);
  const [isVoiceRoomActive, setIsVoiceRoomActive] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden pb-24">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px]" />
         <div className="absolute top-1/2 -right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
         <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
        <header className="p-4 sticky top-0 z-20 flex justify-center bg-transparent">
          <h1 className="font-bold text-indigo-300 tracking-widest text-xl drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] pb-1">NightOwl</h1>
        </header>

        <main className="p-4 space-y-4 h-full">
          <Suspense fallback={<div className="flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'chat' && <FriendChatView isPremium={isPremium} />}
            {activeTab === 'voice' && <VoiceRoomMainView onActiveChange={setIsVoiceRoomActive} />}
            {activeTab === 'profile' && <MyPageView isPremium={isPremium} setIsPremium={setIsPremium} theme={theme} setTheme={setTheme} session={session} />}
          </Suspense>
        </main>
      </div>

      {!isVoiceRoomActive && (
        <nav className="fixed bottom-0 left-0 w-full z-20 flex justify-center pb-safe">
          <div className="glass-panel w-full max-w-lg mx-auto flex justify-around p-4 rounded-none rounded-t-[3rem] border-b-0 border-x-0 bg-white/5">
            <TabButton icon={<Home />} label="ホーム" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton icon={<MessageSquare />} label="フレンド" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
            <TabButton icon={<Headphones />} label="音声ルーム" isActive={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
            <TabButton icon={<User />} label="マイページ" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </nav>
      )}
    </div>
  );
}

function TabButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-400'}`}>
      <div className={isActive ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : ''}>
        {icon}
      </div>
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
