import { useState, useEffect } from "react";


import { User, Lock, Settings2, Camera, Music, Play, Music4 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function MyPageView({ isPremium, setIsPremium, theme, setTheme, session }: { isPremium: boolean, setIsPremium: (v: boolean) => void, theme: string, setTheme: (t: any) => void, session: any }) {
  const [showPast, setShowPast] = useState(false);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState(session?.user?.user_metadata?.username || '');

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUserIcon(url);
    }
  };

  if (showThemeSettings) {
    const themes = [
      { id: 'default', name: '星空 (Night Sky)' },
      { id: 'aurora', name: 'オーロラ (Aurora)' },
      { id: 'deepsea', name: '深海 (Deep Sea)' },
      { id: 'dusk', name: '夕闇 (Dusk)' },
      { id: 'galaxy', name: '銀河 (Galaxy)' },
    ];

    return (
      <div className="flex flex-col h-full bg-black/40 backdrop-blur-md pb-safe">
        <header className="p-4 flex items-center justify-between border-b border-white/10 z-10 pt-safe">
          <button onClick={() => setShowThemeSettings(false)} className="text-indigo-400 p-2 -ml-2">
            ← 戻る
          </button>
          <h2 className="font-bold text-sm text-white/90">テーマ設定</h2>
          <div className="w-10"></div>
        </header>
        <div className="p-6 overflow-y-auto">
          {!isPremium && (
            <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-200 text-sm">
              テーマの変更はプレミアムプラン限定の機能です。
            </div>
          )}
          <div className="space-y-4">
            {themes.map(t => (
              <button
                key={t.id}
                disabled={!isPremium}
                onClick={() => setTheme(t.id)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                  theme === t.id
                    ? 'bg-indigo-500/20 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                } ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{t.name}</span>
                {theme === t.id && <span className="text-indigo-400 text-xs">選択中</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showPast) {
    return (
      <div className="flex flex-col h-full bg-black/40 backdrop-blur-md pb-safe">
        <header className="p-4 flex items-center justify-between border-b border-white/10 z-10 pt-safe">
          <button onClick={() => setShowPast(false)} className="text-indigo-400 p-2 -ml-2">
            ← 戻る
          </button>
          <h2 className="font-bold text-sm text-white/90">過去の記録</h2>
          <div className="w-10"></div>
        </header>
        <div className="p-4 flex flex-col gap-4 overflow-y-auto pb-24">
          <div className="glass-panel p-4 flex flex-col gap-2 opacity-70">
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-300">2023.10.15</span>
              <span className="text-sm font-numbers text-gray-500 ml-auto">02:14</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">昨日は楽しかったな。また明日から頑張ろう。</p>
          </div>
          <div className="glass-panel p-4 flex flex-col gap-2 opacity-70">
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-300">2023.10.12</span>
              <span className="text-sm font-numbers text-gray-500 ml-auto">03:45</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">全然眠れない。羊でも数えるか。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 pb-24">
      <div className="glass-panel w-full p-6 flex flex-col items-center mb-8 relative">
        <div className="relative w-24 h-24 rounded-full mb-4 border-2 border-indigo-500/30 flex items-center justify-center">
          {isPremium && (
            <div className="absolute inset-0 rounded-full animate-[aurora-wave_4s_ease-in-out_infinite] opacity-50 blur-sm mix-blend-screen"
                 style={{
                   background: 'linear-gradient(45deg, #4f46e5, #ec4899, #8b5cf6, #3b82f6)',
                   backgroundSize: '200% 200%'
                 }}
            />
          )}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center z-10">
             {userIcon ? (
               <img src={userIcon} alt="User Icon" className="w-full h-full object-cover" />
             ) : (
               <User className="w-10 h-10" />
             )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-indigo-500 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform z-10">
             <Camera className="w-4 h-4" />
             <input type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
          </label>
          {isPremium && (
            <div className="absolute -top-2 -right-2 text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
              🌙
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-white/10 border border-indigo-500/50 rounded-lg px-3 py-1 text-white outline-none w-32"
                autoFocus
              />
              <button
                onClick={async () => {
                  if(newUsername.trim()) {
                    await supabase.auth.updateUser({ data: { username: newUsername } });
                    // Also update public.users
                    const authUser = (await supabase.auth.getSession()).data.session?.user;
                    if(authUser) {
                      await supabase.from('users').update({ username: newUsername }).eq('supabase_auth_id', authUser.id);
                    }
                  }
                  setIsEditingName(false);
                }}
                className="text-xs bg-indigo-500 px-3 py-1.5 rounded-lg text-white"
              >
                保存
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h2 className="font-bold text-xl">{session?.user?.user_metadata?.username || 'My Username'}</h2>
              <Settings2 className="w-4 h-4 text-white/30 group-hover:text-white/80 transition-colors" />
            </div>
          )}
          <p className="text-xs text-indigo-300 mt-1 opacity-70 truncate max-w-[200px]">{session?.user?.email}</p>
          {isPremium ? (
             <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
               Premium Member
             </span>
          ) : (
             <button
               onClick={() => setIsPremium(true)}
               className="mt-2 text-xs px-4 py-2 glass-button border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
             >
               プレミアムにアップグレード
             </button>
          )}
        </div>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
        className="w-full mb-6 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/20 transition-all font-medium"
      >
        ログアウト
      </button>

      <div className="w-full mt-4">
        <h3 className="text-xs font-semibold text-indigo-300 mb-3 px-2">プレミアム限定機能</h3>
        <button
          onClick={() => isPremium && setShowPast(true)}
          className={`w-full glass-panel p-4 flex items-center gap-4 text-left transition-all ${isPremium ? 'cursor-pointer hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Lock className="w-5 h-5" />
          <span className="font-semibold">夜の記録を振り返る</span>
        </button>
        <button
          onClick={() => isPremium && setShowThemeSettings(true)}
          className={`w-full glass-panel p-4 flex items-center gap-4 text-left transition-all mt-3 ${isPremium ? 'cursor-pointer hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Settings2 className="w-5 h-5" />
          <span className="font-semibold">テーマ変更</span>
          <span className="ml-auto text-xs text-indigo-400/70 capitalize">{theme}</span>
        </button>
      </div>
    </div>
  );
}
