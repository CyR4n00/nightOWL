import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, User, Lock, Send, MicOff, Volume2, X, Globe, Users, Link as LinkIcon, Settings2, Plus, Headphones } from 'lucide-react';

export default function App() {
  const [isNightTime, setIsNightTime] = useState(false);

  // For demo purposes, we allow toggling
  if (!isNightTime) {
    return <GateView onEnter={() => setIsNightTime(true)} />;
  }

  return <MainApp />;
}

function GateView({ onEnter }: { onEnter: () => void }) {
  const [time, setTime] = useState("23:59:59");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ja-JP', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="glass-panel p-10 flex flex-col items-center gap-8 relative z-10 w-full max-w-md text-center">
        <Lock className="w-16 h-16 text-indigo-400 opacity-80" />
        <div>
          <h1 className="text-3xl font-bold tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">NightOwl</h1>
          <p className="text-gray-400 text-sm">夜が来るまで、あと少し。</p>
        </div>
        <div className="text-5xl font-light tracking-widest font-mono text-white/90">
          {time}
        </div>
        <button
          onClick={onEnter}
          className="glass-button px-6 py-3 mt-8 text-sm text-indigo-200 w-full"
        >
          【Debug】夜にする
        </button>
      </div>
    </div>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden pb-24">
      {/* Background Orbs for Glassmorphism transparency effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px]" />
         <div className="absolute top-1/2 -right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
         <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
        <header className="glass-panel rounded-none rounded-b-3xl p-4 sticky top-0 z-20 flex justify-center border-t-0 border-x-0">
          <h1 className="font-bold text-indigo-300 tracking-widest">NightOwl</h1>
        </header>

        <main className="p-4 space-y-4 h-full">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'chat' && <FriendChatView />}
          {activeTab === 'voice' && <VoiceRoomMainView />}
          {activeTab === 'profile' && <MyPageView />}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-20 flex justify-center pb-safe">
        <div className="glass-panel w-full max-w-lg mx-auto flex justify-around p-4 rounded-none rounded-t-3xl border-b-0 border-x-0">
          <TabButton icon={<Home />} label="ホーム" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <TabButton icon={<MessageSquare />} label="チャット" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <TabButton icon={<Headphones />} label="音声ルーム" isActive={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
          <TabButton icon={<User />} label="マイページ" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
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

// --- Views ---

function HomeView() {
  const [posts, setPosts] = useState([
    { id: 1, user: "yuki", content: "眠れない。コーヒー飲みすぎた。", time: "01:23" },
    { id: 2, user: "anonymous_owl", content: "明日のプレゼン嫌だなぁ...", time: "01:45" },
    { id: 3, user: "kenta", content: "夜の散歩中。風が気持ちいい。", time: "02:10" }
  ]);
  const [inputText, setInputText] = useState("");

  const handlePost = () => {
    if (!inputText.trim()) return;
    setPosts([{ id: Date.now(), user: "me", content: inputText, time: "Now" }, ...posts]);
    setInputText("");
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {posts.map(post => (
        <div key={post.id} className="glass-panel p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <span className="font-semibold text-sm text-white/90">{post.user}</span>
            <span className="text-xs text-gray-500 ml-auto">{post.time}</span>
          </div>
          <p className="pl-11 text-white/80 text-sm leading-relaxed">{post.content}</p>
        </div>
      ))}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
        <div className="glass-panel p-2 pl-4 flex items-center gap-2 rounded-full">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="夜の独り言..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
          />
          <button onClick={handlePost} className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FriendChatView() {
  const friends = [
    { id: 1, name: "yuki", status: "Online" },
    { id: 2, name: "kenta", status: "Online" },
    { id: 3, name: "anonymous_owl", status: "Offline" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {friends.map(friend => (
        <button key={friend.id} className="glass-button p-4 flex items-center gap-4 text-left w-full">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-night-navy ${friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-500'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white/90">{friend.name}</h3>
            <p className="text-xs text-gray-400">{friend.status}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function VoiceRoomMainView() {
  const [activeRoom, setActiveRoom] = useState<boolean>(false);
  const [showRoomSettings, setShowRoomSettings] = useState<boolean>(false);

  if (activeRoom) {
    return <VoiceRoomView onClose={() => setActiveRoom(false)} />;
  }

  if (showRoomSettings) {
    return <VoiceRoomSettings onClose={() => setShowRoomSettings(false)} onStart={() => { setShowRoomSettings(false); setActiveRoom(true); }} />;
  }

  return (
    <div className="flex flex-col gap-6 pt-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h2 className="font-bold text-lg">現在開かれているルーム</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Mock active room */}
        <button
          onClick={() => setActiveRoom(true)}
          className="glass-panel p-5 flex flex-col gap-4 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400">開催中</span>
            </div>
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-night-navy" />
               ))}
               <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-night-navy flex items-center justify-center text-[10px]">+12</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white/90">深夜の読書会 📚</h3>
            <p className="text-xs text-gray-400 mt-1">Host: yuki</p>
          </div>
        </button>

        {/* Empty state or more rooms */}
        <div className="text-center text-sm text-gray-500 py-8">
          他の公開ルームはまだありません。
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={() => setShowRoomSettings(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function VoiceRoomSettings({ onClose, onStart }: { onClose: () => void, onStart: () => void }) {
  const [privacy, setPrivacy] = useState<'open' | 'private' | 'link'>('open');

  return (
    <div className="flex flex-col gap-6 pt-4 h-full">
      <div className="flex items-center justify-between px-2">
        <button onClick={onClose} className="text-sm text-indigo-400">キャンセル</button>
        <h2 className="font-bold text-lg">ルーム作成</h2>
        <div className="w-14" /> {/* Spacer for centering */}
      </div>

      <div className="glass-panel p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
           <label className="text-xs text-gray-400 font-semibold">ルームのタイトル（任意）</label>
           <input type="text" placeholder="例：眠れない人おいで" className="bg-transparent border-b border-white/20 pb-2 outline-none text-white/90 placeholder:text-gray-600" />
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mt-2">
          <Settings2 className="text-indigo-400 w-5 h-5" />
          <h3 className="font-semibold text-white/90">公開範囲</h3>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setPrivacy('open')}
            className={`glass-button p-4 flex items-center gap-4 text-left transition-all ${privacy === 'open' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''}`}
          >
            <div className={`p-2 rounded-full ${privacy === 'open' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white/90">オープン（誰でも）</div>
              <div className="text-xs text-gray-400 mt-1">一覧に表示され、誰でも参加できます</div>
            </div>
          </button>

          <button
            onClick={() => setPrivacy('private')}
            className={`glass-button p-4 flex items-center gap-4 text-left transition-all ${privacy === 'private' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''}`}
          >
            <div className={`p-2 rounded-full ${privacy === 'private' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white/90">プライベート（フレンドのみ）</div>
              <div className="text-xs text-gray-400 mt-1">フレンド一覧にいる人だけが参加できます</div>
            </div>
          </button>

          <button
            onClick={() => setPrivacy('link')}
            className={`glass-button p-4 flex items-center gap-4 text-left transition-all ${privacy === 'link' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''}`}
          >
            <div className={`p-2 rounded-full ${privacy === 'link' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'}`}>
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white/90">リンク共有（一部の人）</div>
              <div className="text-xs text-gray-400 mt-1">URLを知っている人だけが参加できます</div>
            </div>
          </button>
        </div>

        <button
          onClick={onStart}
          className="mt-4 glass-button w-full py-4 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 border-none shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          ルームを開始する
        </button>
      </div>
    </div>
  );
}

function VoiceRoomView({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-night-navy/95 backdrop-blur-xl flex flex-col">
      <header className="p-4 flex justify-between items-center glass-panel rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-400">Live</span>
        </div>
        <button onClick={onClose} className="p-2 glass-button rounded-full text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {/* Speaker Area */}
        <div className="mb-10 text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-indigo-900 mx-auto animate-[pulse_2s_ease-in-out_infinite] opacity-50 absolute inset-0 scale-125" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 mx-auto relative z-10 border-4 border-night-navy" />
          </div>
          <h2 className="font-bold text-lg">yuki (Host)</h2>
          <p className="text-xs text-indigo-300">Speaking...</p>
        </div>

        {/* Listeners Area */}
        <div className="w-full">
          <h3 className="text-xs font-semibold text-gray-400 mb-3 px-2">Listeners (15)</h3>
          <div className="flex flex-wrap gap-3">
            {[1,2,3,4,5].map(i => (
               <div key={i} className="w-10 h-10 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Controls & Chat */}
      <div className="glass-panel rounded-none rounded-t-3xl border-b-0 border-x-0 p-4 pb-safe flex flex-col gap-4">
        <div className="flex justify-center gap-6 pb-4 border-b border-white/10">
          <button className="glass-button w-14 h-14 rounded-full flex items-center justify-center text-white/80">
            <MicOff className="w-6 h-6" />
          </button>
          <button className="glass-button w-14 h-14 rounded-full flex items-center justify-center text-white/80">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-2">
           <input type="text" placeholder="コメントを送信..." className="flex-1 glass-panel rounded-full px-4 py-2 text-sm outline-none" />
           <button className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-indigo-300">
             <Send className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}

function MyPageView() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPast, setShowPast] = useState(false);

  if (showPast) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <button onClick={() => setShowPast(false)} className="text-sm text-indigo-400 flex items-center gap-1">
          ← 戻る
        </button>
        <div className="glass-panel p-6 border-indigo-500/30">
          <p className="text-sm text-gray-300 text-center leading-relaxed">
            ここはあなただけの秘密の場所です。<br/>
            過去の夜に書き込んだ記録が残っています。
          </p>
        </div>
        <div className="space-y-3 mt-4">
           <div className="glass-panel p-4 text-sm text-white/80">
             <span className="text-xs text-indigo-300 block mb-1">3日前の夜</span>
             明日も仕事か...休みたい。
           </div>
           <div className="glass-panel p-4 text-sm text-white/80">
             <span className="text-xs text-indigo-300 block mb-1">1週間前の夜</span>
             映画観てたらこんな時間。最高。
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center pt-8">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center text-gray-500">
           <User className="w-10 h-10" />
        </div>
        <div>
          <h2 className="font-bold text-xl">My Username</h2>
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

      <div className="w-full mt-4">
        <h3 className="text-xs font-semibold text-indigo-300 mb-3 px-2">プレミアム限定機能</h3>
        <button
          onClick={() => isPremium && setShowPast(true)}
          className={`w-full glass-panel p-4 flex items-center gap-4 text-left transition-all ${isPremium ? 'cursor-pointer hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Lock className="w-5 h-5" />
          <span className="font-semibold">夜の記録を振り返る</span>
        </button>
      </div>
    </div>
  );
}
