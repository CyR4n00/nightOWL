import { useState, useEffect } from "react";


import { Volume2, MicOff, Settings2, Hand, X, Users, Globe, Link as LinkIcon, Music, Play, Music4, Mic, Headphones, Clock8, Clock, Plus } from 'lucide-react';
import { voiceRoomService } from '../lib/agora/VoiceRoomService';

// Keep all voice room related views here for brevity (VoiceRoomMainView, VoiceRoomSettings, VoiceRoomView inside)
import { supabase } from '../lib/supabaseClient';

export function VoiceRoomMainView({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [bgm, setBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('lofi');
  const [rooms, setRooms] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from('voice_rooms')
      .select('*, users!host_id (username)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCloseRoom = () => {
    setActiveRoomId(null);
    setIsHost(false);
    onActiveChange?.(false);
  };

  const handleJoinRoom = (roomId: string) => {
    setIsHost(false);
    setActiveRoomId(roomId);
    onActiveChange?.(true);
  };

  const handleStartRoom = async (selectedBgm: 'none' | 'lofi' | 'rain' | 'fire', title: string) => {
    const session = await supabase.auth.getSession();
    const authUser = session.data.session?.user;
    if (!authUser) return;

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('supabase_auth_id', authUser.id)
      .single();

    if (!userData) return;

    const { data: newRoom } = await supabase
      .from('voice_rooms')
      .insert([{
        host_id: userData.id,
        title: title || '深夜の語り場',
        bgm_track: selectedBgm
      }])
      .select()
      .single();

    if (newRoom) {
      setBgm(selectedBgm);
      setIsHost(true);
      setActiveRoomId(newRoom.id);
      setShowSettings(false);
      onActiveChange?.(true);
    }
  };

  if (activeRoomId) {
    return <VoiceRoomView onClose={handleCloseRoom} initialBgm={bgm} isHost={isHost} roomId={activeRoomId} />;
  }

  if (showSettings) {
    return <VoiceRoomSettings onClose={() => setShowSettings(false)} onStart={handleStartRoom} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pt-8 text-center border-b border-white/5">
        <h2 className="font-serif text-2xl glow-text">Voice Rooms</h2>
        <p className="text-xs text-indigo-300/60 mt-2">夜の語り場</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-24">
        {rooms.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">開催中のルームはありません</div>
        )}

        {rooms.map(room => (
          <div key={room.id} onClick={() => handleJoinRoom(room.id)} className="glass-panel p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-green-400 mb-1 block">🔴 LIVE</span>
                <h3 className="font-bold text-white/90">{room.title}</h3>
                <p className="text-xs text-indigo-200/60 mt-1">Host: {room.users?.username}</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> ?</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Open</span>
              <span className="flex items-center gap-1 ml-auto text-indigo-300">参加する</span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-24 right-6">
        <button
          onClick={() => setShowSettings(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

function VoiceRoomSettings({ onClose, onStart }: { onClose: () => void, onStart: (bgm: 'none' | 'lofi' | 'rain' | 'fire', title: string) => void }) {
  const [bgm, setBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('lofi');
  const [title, setTitle] = useState('');

  return (
    <div className="flex flex-col h-full absolute inset-0 z-30 bg-black/40 backdrop-blur-md pb-safe">
      <header className="p-4 flex items-center justify-between border-b border-white/10 z-10 pt-safe">
        <button onClick={onClose} className="text-indigo-400 p-2 -ml-2">
          ← キャンセル
        </button>
        <h2 className="font-bold text-sm text-white/90">ルームを開く</h2>
        <div className="w-16"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
           <label className="text-xs text-indigo-300 font-semibold mb-2 block">ルーム名</label>
           <input type="text" placeholder="深夜の読書会..." value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500/50" />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-indigo-300 mb-4 px-1 flex items-center gap-2">
            <Music4 className="w-4 h-4" /> BGM選択
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
                onClick={() => setBgm(t.id as any)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  bgm === t.id
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t.icon}
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(bgm, title)}
          className="w-full p-4 rounded-xl bg-indigo-600 font-bold tracking-wider hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.4)]"
        >
          配信を開始する
        </button>
      </div>
    </div>
  );
}


function VoiceRoomView({ onClose, initialBgm = 'lofi', isHost = true, roomId }: { onClose: () => void, initialBgm?: 'none' | 'lofi' | 'rain' | 'fire', isHost?: boolean, roomId: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const setupRoom = async () => {
      const appId = import.meta.env.VITE_AGORA_APP_ID;
      if (!appId) {
        console.error("Agora App ID is missing.");
        setIsConnecting(false);
        return;
      }

      const joined = await voiceRoomService.joinRoom({
        appId: appId,
        token: null, // For prototyping, token is null. In prod, generate a token on your server.
        channel: roomId, // Use the DB room ID as the Agora channel name
        uid: null
      });

      if (joined && mounted) {
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
  }, [isHost]);

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    const success = await voiceRoomService.toggleMute(newMutedState);
    if (success) {
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md pb-safe">
      <div className="p-6 flex flex-col h-full">
         <h2 className="text-xl font-serif glow-text mb-8">Voice Room</h2>

         <div className="flex-1 flex flex-col items-center justify-center">
            {isConnecting ? (
              <div className="text-indigo-300 animate-pulse">接続中...</div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                 {!isMuted ? (
                     <Mic className="w-12 h-12 text-indigo-300" />
                 ) : (
                     <MicOff className="w-12 h-12 text-gray-500" />
                 )}
              </div>
            )}
            <p className="mt-8 text-sm text-gray-400">
               {isHost ? "ホストとして配信中" : "リスナーとして参加中"}
            </p>
         </div>

         <div className="flex gap-4 mt-auto">
             {isHost && (
                 <button
                   onClick={toggleMute}
                   disabled={isConnecting}
                   className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white/90 border border-white/20'}`}
                 >
                     {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                     {isMuted ? "ミュート解除" : "ミュート"}
                 </button>
             )}
             <button
               onClick={onClose}
               className="flex-1 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all font-medium flex items-center justify-center gap-2"
             >
                <X className="w-5 h-5" /> 退室する
             </button>
         </div>
      </div>
    </div>
  );
}
