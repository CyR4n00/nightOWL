import { useState, useEffect } from "react";
import { Mic, MicOff, X, Users, Play, Clock, Plus, Music, Music4, Volume2, Headphones } from "lucide-react";
import { voiceRoomService } from '../lib/agora/VoiceRoomService';
import { supabase } from '../lib/supabaseClient';

export function VoiceRoomMainView({ onActiveChange }: { onActiveChange: (active: boolean) => void }) {
  const [activeRoom, setActiveRoom] = useState<{ id: string, bgm: string, title: string, duration: number } | null>(null);

  useEffect(() => {
    onActiveChange(activeRoom !== null);
  }, [activeRoom, onActiveChange]);

  if (activeRoom) {
    return (
      <VoiceRoomView
        roomId={activeRoom.id}
        initialBgm={activeRoom.bgm as "none" | "lofi" | "rain" | "fire"}
        isHost={activeRoom.id.startsWith('my-room')}
        initialDurationHours={activeRoom.duration}
        onClose={() => setActiveRoom(null)}
      />
    );
  }

  return (
    <VoiceRoomLobby
      onJoin={(id, bgm, title, duration) => setActiveRoom({ id, bgm, title, duration })}
    />
  );
}

export function VoiceRoomLobby({ onJoin }: { onJoin: (roomId: string, bgm: 'none' | 'lofi' | 'rain' | 'fire', title: string, duration: number) => void }) {
  const [showSettings, setShowSettings] = useState(false);
  const [rooms] = useState([
    { id: 'room-1', title: '深夜の読書会', listeners: 12, host: 'Yuka', bgm: 'lofi', duration: 2 },
    { id: 'room-2', title: '作業通話', listeners: 5, host: 'Ken', bgm: 'rain', duration: 1 },
  ]);

  if (showSettings) {
    return <VoiceRoomSettings onClose={() => setShowSettings(false)} onStart={(bgm, title, duration) => {
      onJoin(`my-room-${Date.now()}`, bgm, title, duration);
    }} />;
  }

  return (
    <div className="flex flex-col h-full relative p-6 pt-12 pb-24">
      <h2 className="text-2xl font-stencil text-white tracking-[0.2em] mb-8 relative z-10 text-center opacity-80 top-0 left-0 right-0">NIGHTOWL</h2>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {rooms.map(room => (
          <div key={room.id} onClick={() => onJoin(room.id, room.bgm as "none" | "lofi" | "rain" | "fire", room.title, room.duration)} className="glass-panel p-4 rounded-3xl aspect-square flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors group">
             <div className="w-16 h-16 rounded-full bg-indigo-500/20 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
               <span className="text-lg font-bold text-indigo-300">{room.host.charAt(0)}</span>
             </div>
             <h3 className="font-bold text-sm text-white mb-1 line-clamp-1 font-stencil">{room.title}</h3>
             <div className="flex items-center justify-center gap-1 text-xs text-indigo-300/80 font-stencil">
               <Users className="w-3 h-3" /> {room.listeners}人
             </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 opacity-40 z-0 pointer-events-none" style={{
         backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 320 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'0.05\' d=\'M0,320L60,320C120,320,240,320,300,320L360,320L360,360L300,360C240,360,120,360,60,360L0,360Z\'%3E%3C/path%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'0.03\' d=\'M0,320L60,320C120,320,240,320,300,320L360,320L360,360L300,360C240,360,120,360,60,360L0,360Z\'%3E%3C/path%3E%3C/svg%3E")',
         backgroundSize: 'cover',
         backgroundPosition: 'bottom'
      }}></div>

      <div className="absolute bottom-24 right-6 z-20">
        <button
          onClick={() => setShowSettings(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.8)] hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function VoiceRoomSettings({ onClose, onStart }: { onClose: () => void, onStart: (bgm: 'none' | 'lofi' | 'rain' | 'fire', title: string, duration: number) => void }) {
  const [bgm, setBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('lofi');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(2); // Default 2 hours

  return (
    <div className="flex flex-col h-[100dvh] fixed inset-0 z-30 theme-default pb-safe">
      <header className="p-4 flex items-center justify-between border-b border-white/10 z-10 pt-safe">
        <button onClick={onClose} className="text-white p-2 -ml-2 font-stencil">
          ← キャンセル
        </button>
        <h2 className="font-stencil font-bold text-sm text-white">ルームを開く</h2>
        <div className="w-16"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
        <div>
           <label className="text-xs text-white font-stencil mb-2 block">ルーム名</label>
           <input type="text" placeholder="深夜の読書会..." value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500/50 text-white" />
        </div>

        <div>
          <h3 className="text-xs font-stencil text-white mb-4 px-1 flex items-center gap-2">
            <Music4 className="w-4 h-4 text-white" /> BGM選択
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'none', icon: <Volume2 className="w-5 h-5" />, label: 'なし' },
              { id: 'lofi', icon: <Music className="w-5 h-5" />, label: 'Lo-Fi Chill' },
              { id: 'rain', icon: <Headphones className="w-5 h-5" />, label: '雨の音' },
              { id: 'fire', icon: <Play className="w-5 h-5" />, label: '焚き火' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setBgm(t.id as 'none' | 'lofi' | 'rain' | 'fire')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  bgm === t.id
                    ? 'bg-indigo-500/20 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {t.icon}
                <span className="text-xs font-stencil">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-stencil text-white mb-4 px-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" /> 自動終了までの時間
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="6"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-16 text-right font-bold text-white/90 font-stencil">{duration} 時間</span>
          </div>
        </div>

        <button
          onClick={() => onStart(bgm, title, duration)}
          className="w-full p-4 rounded-xl bg-indigo-600 font-bold tracking-wider hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.4)] text-white font-stencil"
        >
          配信を開始する
        </button>
      </div>
    </div>
  );
}


export function VoiceRoomView({ onClose, initialBgm = 'lofi', isHost = true, roomId, initialDurationHours = 2 }: { onClose: () => void, initialBgm?: 'none' | 'lofi' | 'rain' | 'fire', isHost?: boolean, roomId: string, initialDurationHours?: number }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60 * initialDurationHours);
  const [isExtended, setIsExtended] = useState(false);
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (initialBgm !== 'none') {
      // Create audio element with placeholder sounds
      // In a real app, you'd host these MP3s. For prototype, we use free sounds
      const bgmUrls = {
        lofi: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        rain: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3',
        fire: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_651a4ddb65.mp3?filename=crackling-fireplace-nature-sounds-8012.mp3'
      };

      audio = new Audio(bgmUrls[initialBgm as keyof typeof bgmUrls]);
      audio.loop = true;
      audio.volume = 0.3; // Background volume
      audio.play().catch(e => console.log("Autoplay blocked:", e));
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [initialBgm]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Check if it's past 6:00 AM (but only if we were actually running at night)
      if (new Date().getHours() >= 6 && new Date().getHours() < 24) {
         clearInterval(timer);
         onClose();
         return;
      }
      setTimeLeft(prev => {
        if (prev <= 1) {
           clearInterval(timer);
           onClose();
           return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onClose]);

  useEffect(() => {
    let mounted = true;

    const setupRoom = async () => {
      // Generate Agora token via Supabase Edge Function
      const tokenResponse = await supabase.functions.invoke('agora-token', { body: { channelName: roomId } });
      const token = tokenResponse.data?.token || null;
      const joined = await voiceRoomService.joinRoom(roomId, token);

      if (joined !== undefined && mounted) {
        if (isHost) {
          await voiceRoomService.publishAudio();
        }
        setIsConnecting(false);
      }
    };

    setupRoom();

    return () => {
      mounted = false;
      voiceRoomService.leaveRoom();
    };
  }, [isHost, roomId]);

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    const success = await voiceRoomService.toggleMute(newMutedState);
    if (success) {
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] fixed inset-0 z-30 theme-default pb-safe w-full overflow-hidden">
      <div className="p-6 flex flex-col h-full relative z-10">
         <div className="flex flex-col items-center justify-center mb-8 relative pt-8">
           <h2 className="text-4xl font-stencil text-white tracking-[0.1em] mt-4 glow-text pb-1">VOICE ROOM</h2>
           <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-stencil tracking-widest flex items-center gap-2 mt-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
             <Clock className="w-4 h-4 text-white" />
             <span className="text-white font-stencil">{Math.floor(timeLeft / 3600)}:{(Math.floor(timeLeft / 60) % 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
           </div>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center">
            {isConnecting ? (
              <div className="text-white animate-pulse font-stencil">接続中...</div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                 {!isMuted ? (
                     <Mic className="w-12 h-12 text-white" />
                 ) : (
                     <MicOff className="w-12 h-12 text-gray-400" />
                 )}
              </div>
            )}
            <p className="mt-8 text-sm text-white font-stencil">
               {isHost ? "ホストとして配信中" : "リスナーとして参加中"}
            </p>

            {isHost && !isExtended && (
              <button
                onClick={() => {
                  setTimeLeft(prev => prev + 1800); // Add 30 mins
                  setIsExtended(true);
                }}
                className="mt-6 px-4 py-2 rounded-full border border-indigo-500/50 text-white text-sm hover:bg-indigo-500/20 transition-colors font-stencil"
              >
                + 30分延長する
              </button>
            )}
         </div>

         <div className="flex gap-4 mt-auto">
             {isHost && (
                 <button
                   onClick={toggleMute}
                   disabled={isConnecting}
                   className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-stencil ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white/90 border border-white/20'}`}
                 >
                     {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                     {isMuted ? "ミュート解除" : "ミュート"}
                 </button>
             )}
             <button
               onClick={onClose}
               className="flex-1 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all font-medium flex items-center justify-center gap-2 font-stencil"
             >
                <X className="w-5 h-5" /> 退室する
             </button>
         </div>
      </div>
    </div>
  );
}
