import React, { useState } from 'react';
import { Home, MessageSquare, User, Headphones } from 'lucide-react';
import { HomeView } from '../views/HomeView';
import { FriendChatView } from '../views/FriendChatView';
import { VoiceRoomMainView } from '../views/VoiceRoomView';
import { MyPageView } from '../views/MyPageView';

export function MainApp({ theme, setTheme, session }: { theme: string, setTheme: (t: 'default' | 'aurora' | 'deepsea' | 'dusk' | 'galaxy') => void, session: import("@supabase/supabase-js").Session | null }) {
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
