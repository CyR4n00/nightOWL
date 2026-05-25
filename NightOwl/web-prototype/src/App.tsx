import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, User, Lock, Send, Phone, MicOff, Volume2, X } from 'lucide-react';

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
      {/* Decorative blurred circles for glassmorphism background effect */}
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
    <div className="flex flex-col min-h-screen relative overflow-hidden pb-20">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
        <header className="glass-panel rounded-none rounded-b-3xl p-4 sticky top-0 z-20 flex justify-center border-t-0 border-x-0">
          <h1 className="font-bold text-indigo-300 tracking-widest">NightOwl</h1>
        </header>

        <main className="p-4 space-y-4">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'chat' && <FriendChatView />}
          {activeTab === 'profile' && <MyPageView />}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-20 flex justify-center pb-safe">
        <div className="glass-panel w-full max-w-lg mx-auto flex justify-around p-4 rounded-none rounded-t-3xl border-b-0 border-x-0">
          <TabButton icon={<Home />} label="ホーム" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <TabButton icon={<MessageSquare />} label="チャット" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
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
  const [activeRoom, setActiveRoom] = useState<boolean>(false);

  if (activeRoom) {
    return <VoiceRoomView onClose={() => setActiveRoom(false)} />;
  }

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

      <button
        onClick={() => setActiveRoom(true)}
        className="mt-6 glass-panel p-6 flex flex-col items-center gap-3 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
          <Phone className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-indigo-300">音声ルームを作成（Space風）</h3>
          <p className="text-xs text-indigo-300/60 mt-1">誰でも参加できるラジオを始める</p>
        </div>
      </button>
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
          <h3 className="text-xs font-semibold text-gray-400 mb-3 px-2">Listeners (12)</h3>
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
