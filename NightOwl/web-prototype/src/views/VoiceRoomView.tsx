import { useState, useEffect } from "react";


import { Volume2, MicOff, Settings2, Hand, X, Users, Globe, Link as LinkIcon, Music, Play, Music4, Mic, Headphones, Clock8, Clock, Plus } from 'lucide-react';

// Keep all voice room related views here for brevity (VoiceRoomMainView, VoiceRoomSettings, VoiceRoomView inside)
export function VoiceRoomMainView({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [showRoom, setShowRoom] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bgm, setBgm] = useState<'none' | 'lofi' | 'rain' | 'fire'>('lofi');

  const handleCloseRoom = () => {
    setShowRoom(false);
    onActiveChange?.(false);
  };

  if (showRoom) {
    return <VoiceRoomView onClose={handleCloseRoom} initialBgm={bgm} />;
  }

  if (showSettings) {
    return <VoiceRoomSettings onClose={() => setShowSettings(false)} onStart={(selectedBgm) => {
      setBgm(selectedBgm);
      setShowSettings(false);
      setShowRoom(true);
      onActiveChange?.(true);
    }} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pt-8 text-center border-b border-white/5">
        <h2 className="font-serif text-2xl glow-text">Voice Rooms</h2>
        <p className="text-xs text-indigo-300/60 mt-2">夜の語り場</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-24">
        {/* Active Rooms Map */}
        <div className="glass-panel p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-green-400 mb-1 block">🔴 LIVE</span>
              <h3 className="font-bold text-white/90">深夜の読書会</h3>
              <p className="text-xs text-indigo-200/60 mt-1">作業通話・無言OK</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-white/10" />
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-white/10" />
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-white/10" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 12</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Open</span>
            <span className="flex items-center gap-1 ml-auto text-indigo-300">参加する</span>
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-green-400 mb-1 block">🔴 LIVE</span>
              <h3 className="font-bold text-white/90">悩み相談・雑談</h3>
              <p className="text-xs text-indigo-200/60 mt-1">誰でもどうぞ</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-white/10" />
              <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-white/10" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 4</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Open</span>
            <span className="flex items-center gap-1 ml-auto text-indigo-300">参加する</span>
          </div>
        </div>
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

// Dummy definitions for the nested views
function VoiceRoomSettings({ onClose, onStart }: { onClose: () => void, onStart: (bgm: 'none' | 'lofi' | 'rain' | 'fire') => void }) {
  // Simplified version of the settings modal
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md pb-safe">
      <div className="p-6">
         <h2 className="text-xl">Settings (Dummy)</h2>
         <button onClick={() => onStart('lofi')} className="mt-4 p-4 glass-button">Start Room</button>
      </div>
    </div>
  );
}

function VoiceRoomView({ onClose, initialBgm = 'lofi', isHost = true }: { onClose: () => void, initialBgm?: 'none' | 'lofi' | 'rain' | 'fire', isHost?: boolean }) {
  // Simplified version of the active voice room
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md pb-safe">
      <div className="p-6">
         <h2 className="text-xl">Voice Room (Dummy)</h2>
         <button onClick={onClose} className="mt-4 p-4 glass-button text-red-400">Close Room</button>
      </div>
    </div>
  );
}
