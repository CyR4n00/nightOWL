import React, { useState, useEffect, useMemo } from 'react';
import { Home, MessageSquare, User, Headphones } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import AuthView from './components/AuthView';
import { GateView } from './views/GateView';
import { HomeView } from './views/HomeView';
import { FriendChatView } from './views/FriendChatView';
import { VoiceRoomMainView } from './views/VoiceRoomView';
import { MyPageView } from './views/MyPageView';

export default function AppWrapper() {
  const hasEnvVars = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-project-url') &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://dummy.supabase.co'
  );

  if (!hasEnvVars) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">環境変数エラー</h2>
          <p className="text-gray-300">
            Supabaseの接続情報が見つかりません。
          </p>
          <div className="text-left bg-gray-900 p-4 rounded text-sm text-gray-400">
            <code>.env</code> ファイルに以下を設定してください：
            <br />
            <br />
            <code>VITE_SUPABASE_URL=...</code>
            <br />
            <code>VITE_SUPABASE_ANON_KEY=...</code>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            自動生成スクリプト <code>node setup_env.cjs</code> を実行するか、<code>.env.example</code> をコピーして作成してください。
          </p>
        </div>
      </div>
    );
  }

  return <App />;
}

function App() {
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

      {!isNightTime ? (
        <GateView onEnter={() => setIsNightTime(true)} />
      ) : !session ? (
        <AuthView onAuthSuccess={() => {}} />
      ) : (
        <MainApp theme={theme} setTheme={setTheme} session={session} />
      )}
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
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'chat' && <FriendChatView isPremium={isPremium} />}
          {activeTab === 'voice' && <VoiceRoomMainView onActiveChange={setIsVoiceRoomActive} />}
          {activeTab === 'profile' && <MyPageView isPremium={isPremium} setIsPremium={setIsPremium} theme={theme} setTheme={setTheme} session={session} />}
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
