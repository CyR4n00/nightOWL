import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, User, Lock, Send, MicOff, Volume2, X, Globe, Users, Link as LinkIcon, Settings2, Plus, Headphones, Mic, Hand, Clock, Clock8, Camera, Music, Play, Music4, Search } from 'lucide-react';

export default function App() {
  const [isNightTime, setIsNightTime] = useState(false);
  const [theme, setTheme] = useState<'default' | 'aurora' | 'deepsea' | 'dusk' | 'galaxy'>('default');

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // For demo purposes, we allow toggling
  if (!isNightTime) {
    return <GateView onEnter={() => setIsNightTime(true)} />;
  }

  return <MainApp theme={theme} setTheme={setTheme} />;
}

function GateView({ onEnter }: { onEnter: () => void }) {
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // 次の24:00までのカウントダウンを計算
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("00:00:00");
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
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
        <div className="text-6xl font-light tracking-widest font-numbers text-white/90">
          {countdown}
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

function MainApp({ theme, setTheme }: { theme: string, setTheme: (t: any) => void }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isPremium, setIsPremium] = useState(false);
  const [isVoiceRoomActive, setIsVoiceRoomActive] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden pb-24">
      {/* Background Orbs for Glassmorphism transparency effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px]" />
         <div className="absolute top-1/2 -right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
         <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 relative z-10 w-full max-w-lg mx-auto">
        <header className="p-4 sticky top-0 z-20 flex justify-center bg-transparent">
          <h1 className="font-bold text-indigo-300 tracking-widest text-xl drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">NightOwl</h1>
        </header>

        <main className="p-4 space-y-4 h-full">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'chat' && <FriendChatView isPremium={isPremium} />}
          {activeTab === 'voice' && <VoiceRoomMainView onActiveChange={setIsVoiceRoomActive} />}
          {activeTab === 'profile' && <MyPageView isPremium={isPremium} setIsPremium={setIsPremium} theme={theme} setTheme={setTheme} />}
        </main>
      </div>

      {!isVoiceRoomActive && (
        <nav className="fixed bottom-0 left-0 w-full z-20 flex justify-center pb-safe">
          <div className="glass-panel w-full max-w-lg mx-auto flex justify-around p-4 rounded-none rounded-t-[3rem] border-b-0 border-x-0 bg-white/5">
            <TabButton icon={<Home />} label="ホーム" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton icon={<MessageSquare />} label="チャット" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
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
            <span className="text-sm font-numbers text-gray-500 ml-auto">{post.time}</span>
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

function FriendChatView({ isPremium }: { isPremium: boolean }) {
  const [chatTab, setChatTab] = useState<'friends' | 'open'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<{ id: number, name: string, status: string } | null>(null);
  const [openChatMessages, setOpenChatMessages] = useState([
    { id: 1, user: "unknown_owl", text: "誰か起きてる？", time: "01:20", isPremiumUser: false },
    { id: 2, user: "sleepy", text: "起きてるよー", time: "01:21", isPremiumUser: false },
    { id: 3, user: "night_king", text: "映画みてる🎬", time: "01:25", isPremiumUser: true },
  ]);
  const [newChat, setNewChat] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: 1, name: "yuki", status: "Online" },
    { id: 2, name: "kenta", status: "Online" },
    { id: 3, name: "anonymous_owl", status: "Offline" },
  ];

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSendOpenChat = () => {
    if (!newChat.trim()) return;
    setOpenChatMessages([...openChatMessages, { id: Date.now(), user: "me", text: newChat, time: "Now", isPremiumUser: isPremium }]);
    setNewChat("");
  };

  if (selectedFriend) {
    return <PrivateChatView friend={selectedFriend} onClose={() => setSelectedFriend(null)} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full pb-20">
      <div className="flex gap-2 p-1 bg-black/20 rounded-full">
        <button
          onClick={() => setChatTab('friends')}
          className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${chatTab === 'friends' ? 'bg-indigo-500/30 text-white' : 'text-gray-400'}`}
        >
          フレンド
        </button>
        <button
          onClick={() => setChatTab('open')}
          className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${chatTab === 'open' ? 'bg-indigo-500/30 text-white' : 'text-gray-400'}`}
        >
          オープン
        </button>
      </div>

      {chatTab === 'friends' && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="ユーザーを検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full glass-panel pl-10 pr-4 py-3 text-sm outline-none bg-black/10 placeholder:text-gray-500"
            />
          </div>

          <div className="flex justify-between items-center px-2 py-1 mt-2">
            <span className="text-xs text-gray-400 font-semibold">フレンド枠</span>
            <span className="text-xs text-indigo-300 font-numbers">
              {friends.length} / {isPremium ? '∞' : '5'} 人
            </span>
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">
              ユーザーが見つかりません
            </div>
          )}

          {filteredFriends.map(friend => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className="glass-button p-4 flex items-center gap-4 text-left w-full hover:bg-white/10"
            >
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
          {!isPremium && (
            <button
              onClick={() => alert("プレミアムプランに登録するとフレンド枠が無限になります！")}
              className="mt-2 glass-button py-3 flex items-center justify-center gap-2 text-indigo-300 text-sm border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              フレンド枠を拡張する
            </button>
          )}
        </div>
      )}

      {chatTab === 'open' && (
        <div className="flex flex-col h-[60vh] glass-panel p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
            {openChatMessages.map(msg => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`font-semibold text-xs ${msg.isPremiumUser ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-indigo-300'}`}>
                    {msg.user} {msg.isPremiumUser && '🌙'}
                  </span>
                  <span className="text-xs font-numbers text-gray-500">{msg.time}</span>
                </div>
                <p className={`text-sm p-3 rounded-2xl rounded-tl-none mt-1 inline-block w-fit max-w-[80%] ${msg.isPremiumUser ? 'text-amber-100 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]' : 'text-white/90 bg-white/5'}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newChat}
              onChange={e => setNewChat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendOpenChat()}
              placeholder="誰でも見れるオープンチャット..."
              className="flex-1 glass-panel rounded-full px-4 py-2 text-sm outline-none bg-black/20"
            />
            <button
              onClick={handleSendOpenChat}
              className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PrivateChatView({ friend, onClose }: { friend: { name: string, status: string }, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, isMe: false, text: "起きてる？", time: "01:10" },
    { id: 2, isMe: true, text: "起きてるよー。眠れない。", time: "01:12" },
    { id: 3, isMe: false, text: "同じく。明日早いのに最悪。", time: "01:15" }
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), isMe: true, text: newMsg, time: "Now" }]);
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 z-30 bg-black/40 backdrop-blur-md pb-safe">
      <header className="p-4 flex items-center justify-between bg-transparent border-b border-white/10 z-10 pt-safe">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-indigo-400 p-2 -ml-2">
            ← 戻る
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-night-navy ${friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white/90">{friend.name}</h2>
              <p className="text-[10px] text-gray-400">{friend.status}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-baseline gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <p className={`text-sm p-3 rounded-2xl max-w-[80%] ${
                msg.isMe
                  ? 'bg-indigo-500/30 text-white rounded-tr-none border border-indigo-500/20'
                  : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </p>
              <span className="text-[10px] font-numbers text-gray-500">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-transparent border-t border-white/5 mb-16">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="メッセージを入力..."
            className="flex-1 glass-panel rounded-full px-4 py-2 text-sm outline-none bg-black/20"
          />
          <button
            onClick={handleSend}
            className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VoiceRoomMainView({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [activeRoom, setActiveRoom] = useState<boolean>(false);
  const [showRoomSettings, setShowRoomSettings] = useState<boolean>(false);
  const [selectedBgm, setSelectedBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('lofi');

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(activeRoom);
    }
  }, [activeRoom, onActiveChange]);

  if (activeRoom) {
    return <VoiceRoomView onClose={() => setActiveRoom(false)} initialBgm={selectedBgm} />;
  }

  if (showRoomSettings) {
    return <VoiceRoomSettings onClose={() => setShowRoomSettings(false)} onStart={(bgm) => { setSelectedBgm(bgm); setShowRoomSettings(false); setActiveRoom(true); }} />;
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

function VoiceRoomSettings({ onClose, onStart }: { onClose: () => void, onStart: (bgm: 'none' | 'lofi' | 'rain' | 'fire') => void }) {
  const [privacy, setPrivacy] = useState<'open' | 'private'>('open');
  const [speakerRule, setSpeakerRule] = useState<'request' | 'invite_only'>('request');
  const [autoCloseTimer, setAutoCloseTimer] = useState<'none' | '1h' | '2h'>('none');
  const [bgm, setBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('none');

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
            className={`glass-button p-4 flex items-center gap-4 text-left ${privacy === 'open' ? 'active' : ''}`}
          >
            <div className={`p-2 rounded-full ${privacy === 'open' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-gray-400'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white/90">オープン（誰でも）</div>
              <div className="text-xs text-gray-400 mt-1">一覧に表示され、誰でも参加できます</div>
            </div>
          </button>

          <button
            onClick={() => setPrivacy('private')}
            className={`glass-button p-4 flex items-center gap-4 text-left ${privacy === 'private' ? 'active' : ''}`}
          >
            <div className={`p-2 rounded-full ${privacy === 'private' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-gray-400'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white/90">プライベート（フレンドのみ）</div>
              <div className="text-xs text-gray-400 mt-1">フレンド一覧にいる人だけが参加できます</div>
            </div>
          </button>
        </div>

        {privacy === 'open' && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-3">
              <Mic className="text-indigo-400 w-5 h-5" />
              <h3 className="font-semibold text-white/90">スピーカー権限</h3>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSpeakerRule('request')}
                className={`glass-button p-4 flex items-center gap-4 text-left ${speakerRule === 'request' ? 'active' : ''}`}
              >
                <div className={`p-2 rounded-full ${speakerRule === 'request' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-gray-400'}`}>
                  <Hand className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white/90">リスナーの挙手を許可</div>
                  <div className="text-xs text-gray-400 mt-1">誰でも話すリクエストを送れます</div>
                </div>
              </button>

              <button
                onClick={() => setSpeakerRule('invite_only')}
                className={`glass-button p-4 flex items-center gap-4 text-left ${speakerRule === 'invite_only' ? 'active' : ''}`}
              >
                <div className={`p-2 rounded-full ${speakerRule === 'invite_only' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-gray-400'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white/90">招待のみ</div>
                  <div className="text-xs text-gray-400 mt-1">オーナーが選択した人のみが話せます</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="mt-2">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-3">
            <Music className="text-indigo-400 w-5 h-5" />
            <h3 className="font-semibold text-white/90">ルームBGM</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBgm('none')}
              className={`glass-button py-3 text-sm text-center ${bgm === 'none' ? 'active' : ''}`}
            >
              無音
            </button>
            <button
              onClick={() => setBgm('lofi')}
              className={`glass-button py-3 text-sm text-center flex items-center justify-center gap-2 ${bgm === 'lofi' ? 'active' : ''}`}
            >
              <Play className="w-3 h-3" /> 深夜のLo-Fi
            </button>
            <button
              onClick={() => setBgm('rain')}
              className={`glass-button py-3 text-sm text-center flex items-center justify-center gap-2 ${bgm === 'rain' ? 'active' : ''}`}
            >
              <Play className="w-3 h-3" /> 静かな雨音
            </button>
            <button
              onClick={() => setBgm('fire')}
              className={`glass-button py-3 text-sm text-center flex items-center justify-center gap-2 ${bgm === 'fire' ? 'active' : ''}`}
            >
              <Play className="w-3 h-3" /> 焚き火
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-3">
            <Clock className="text-indigo-400 w-5 h-5" />
            <h3 className="font-semibold text-white/90">自動終了タイマー</h3>
            <span className="text-[10px] text-gray-400 ml-auto bg-white/5 px-2 py-1 rounded">朝6時までは任意延長可</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setAutoCloseTimer('none')}
              className={`flex-1 glass-button py-3 text-sm text-center ${autoCloseTimer === 'none' ? 'active' : ''}`}
            >
              設定しない
            </button>
            <button
              onClick={() => setAutoCloseTimer('1h')}
              className={`flex-1 glass-button py-3 text-sm text-center ${autoCloseTimer === '1h' ? 'active' : ''}`}
            >
              1時間
            </button>
            <button
              onClick={() => setAutoCloseTimer('2h')}
              className={`flex-1 glass-button py-3 text-sm text-center ${autoCloseTimer === '2h' ? 'active' : ''}`}
            >
              2時間
            </button>
          </div>
        </div>

        <button
          onClick={() => onStart(bgm)}
          className="mt-4 glass-button w-full py-4 font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 border-none shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          ルームを開始する
        </button>
      </div>
    </div>
  );
}

function VoiceRoomView({ onClose, initialBgm = 'lofi', isHost = true }: { onClose: () => void, initialBgm?: 'none' | 'lofi' | 'rain' | 'fire', isHost?: boolean }) {
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120 minutes = 2 hours mock
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "kenta", text: "こんばんは！", time: "01:05" },
    { id: 2, user: "sleepy", text: "BGMいい感じですね", time: "01:08" },
  ]);
  const [newChat, setNewChat] = useState("");
  const [currentBgm, setCurrentBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>(initialBgm);
  const [showBgmMenu, setShowBgmMenu] = useState(false);

  const bgmLabels = {
    none: "無音",
    lofi: "深夜のLo-Fi",
    rain: "静かな雨音",
    fire: "焚き火"
  };

  const handleShare = () => {
    // リンクをコピーした風のトーストを表示
    setShowInviteToast(true);
    setTimeout(() => setShowInviteToast(false), 3000);
  };

  const handleSendChat = () => {
    if (!newChat.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), user: "me", text: newChat, time: "Now" }]);
    setNewChat("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-md">
      {/* 枠なしの透過ヘッダー */}
      <header className="p-4 flex justify-between items-start bg-transparent relative z-10 pt-safe">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              <span className="text-sm font-semibold text-red-400 text-neon">Live</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-full text-xs text-indigo-200 border border-indigo-500/20 backdrop-blur-sm">
              <Clock8 className="w-3 h-3" />
              <span>残り <span className="font-numbers text-sm">{Math.floor(timeLeft / 60)}</span>時間<span className="font-numbers text-sm">{timeLeft % 60}</span>分</span>
            </div>
          </div>

          {/* BGM Playing Indicator */}
          <div className="relative">
            {isHost ? (
              <button
                onClick={() => setShowBgmMenu(!showBgmMenu)}
                className="flex items-center gap-1 text-[10px] text-indigo-300 opacity-80 hover:opacity-100 transition-opacity bg-white/5 px-2 py-1 rounded-full border border-indigo-500/20"
              >
                {currentBgm !== 'none' ? <Music4 className="w-3 h-3 animate-bounce" /> : <Music className="w-3 h-3" />}
                <span>{bgmLabels[currentBgm]} {currentBgm !== 'none' && '演奏中...'} ▾</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-indigo-300 opacity-80 bg-white/5 px-2 py-1 rounded-full border border-indigo-500/20 w-fit">
                {currentBgm !== 'none' ? <Music4 className="w-3 h-3 animate-bounce" /> : <Music className="w-3 h-3" />}
                <span>{bgmLabels[currentBgm]} {currentBgm !== 'none' && '演奏中...'}</span>
              </div>
            )}

            {showBgmMenu && isHost && (
              <div className="absolute top-full left-0 mt-1 glass-panel p-2 flex flex-col gap-1 w-32 z-50 animate-in fade-in slide-in-from-top-2">
                {(Object.keys(bgmLabels) as Array<keyof typeof bgmLabels>).map(key => (
                  <button
                    key={key}
                    onClick={() => { setCurrentBgm(key); setShowBgmMenu(false); }}
                    className={`text-xs text-left px-2 py-1.5 rounded transition-colors ${currentBgm === key ? 'bg-indigo-500/30 text-indigo-200' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {bgmLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {isHost && (
              <button onClick={() => setTimeLeft(timeLeft + 30)} className="text-xs font-semibold text-indigo-300 border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500/30 transition-colors backdrop-blur-sm whitespace-nowrap">
                +30分延長
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full bg-black/20 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
          {isHost && (
            <button onClick={handleShare} className="p-2 rounded-full bg-black/20 border border-white/10 text-indigo-300 relative group hover:bg-white/10 transition-colors backdrop-blur-sm">
              <LinkIcon className="w-5 h-5" />
              <div className="absolute -bottom-8 right-0 text-[10px] whitespace-nowrap bg-indigo-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                リンクをコピー
              </div>
            </button>
          )}
        </div>
      </header>

      {showInviteToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-in fade-in slide-in-from-top-4">
          ルームのリンクをコピーしました
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {/* Speaker Area */}
        <div className="mb-8 text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-indigo-900 mx-auto animate-[pulse_2s_ease-in-out_infinite] opacity-50 absolute inset-0 scale-125" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 mx-auto relative z-10 border-4 border-night-navy" />
          </div>
          <h2 className="font-bold text-lg">yuki (Host)</h2>
          <p className="text-xs text-indigo-300">Speaking...</p>
        </div>

        {/* Listeners Area */}
        <div className="w-full">
          <h3 className="text-xs font-semibold text-gray-400 mb-3 px-2">Listeners (<span className="font-numbers text-sm">15</span>)</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { id: 1, name: "kenta", canInvite: true },
              { id: 2, name: "anonymous_owl", canInvite: true },
              { id: 3, name: "user123", canInvite: true },
              { id: 4, name: "sleepy", canInvite: true },
              { id: 5, name: "nightowl", canInvite: true }
            ].map(listener => (
               <div key={listener.id} className="flex flex-col items-center gap-1 group">
                 <div className="relative cursor-pointer">
                   <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 border border-white/5 group-hover:border-indigo-400/50 transition-colors">
                     {listener.name.substring(0,2)}
                   </div>

                   {/* Invite to Speak Button (Visible to Host) */}
                   <button
                     className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 border-2 border-night-navy flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                     title="スピーカーに招待"
                     onClick={() => alert(`${listener.name} をスピーカーに招待しました`)}
                   >
                     <Mic className="w-3 h-3" />
                   </button>
                 </div>
                 <span className="text-[10px] text-gray-400 max-w-[48px] truncate">{listener.name}</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls & Chat */}
      <div className="glass-panel rounded-none rounded-t-3xl border-b-0 border-x-0 p-4 pb-safe flex flex-col gap-4 max-h-[40vh]">
        {/* Chat Timeline */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-2 px-2 scrollbar-hide">
          {chatMessages.map(msg => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-xs text-white/80">{msg.user}</span>
                <span className="text-xs font-numbers text-gray-500">{msg.time}</span>
              </div>
              <p className="text-sm text-white/90">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 pb-4 border-b border-white/10">
          <button className="glass-button w-14 h-14 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10">
            <MicOff className="w-6 h-6" />
          </button>
          <button className="glass-button w-14 h-14 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-2">
           <input
             type="text"
             value={newChat}
             onChange={e => setNewChat(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSendChat()}
             placeholder="コメントを送信..."
             className="flex-1 glass-panel rounded-full px-4 py-2 text-sm outline-none bg-black/20"
           />
           <button
             onClick={handleSendChat}
             className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20"
           >
             <Send className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}

function MyPageView({ isPremium, setIsPremium, theme, setTheme }: { isPremium: boolean, setIsPremium: (v: boolean) => void, theme: string, setTheme: (t: any) => void }) {
  const [showPast, setShowPast] = useState(false);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [showThemeSettings, setShowThemeSettings] = useState(false);

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
      <div className="flex flex-col gap-4 h-full">
        <button onClick={() => setShowThemeSettings(false)} className="text-sm text-indigo-400 flex items-center gap-1 w-fit">
          ← 戻る
        </button>
        <h2 className="font-bold text-lg mb-2">テーマの変更</h2>
        <div className="flex flex-col gap-3">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`glass-button p-4 flex items-center justify-between text-left ${theme === t.id ? 'ring-2 ring-indigo-500 bg-white/10' : ''}`}
            >
              <span className="font-semibold text-white/90">{t.name}</span>
              {theme === t.id && <span className="text-indigo-400 text-sm">選択中</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

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
        <div className="relative">
          <div className={`w-24 h-24 rounded-full glass-panel flex items-center justify-center text-gray-500 overflow-hidden ${isPremium ? 'premium-glow' : ''}`}>
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

        <button
          onClick={() => isPremium && setShowThemeSettings(true)}
          className={`w-full glass-panel p-4 flex items-center gap-4 text-left transition-all mt-3 ${isPremium ? 'cursor-pointer hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Globe className="w-5 h-5" />
          <span className="font-semibold">テーマ（背景）の着せ替え</span>
        </button>
      </div>
    </div>
  );
}
