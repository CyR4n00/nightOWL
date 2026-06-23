import { useState, useEffect } from "react";
import { Send, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function PrivateChatView({ friend, onClose }: { friend: { id: string, name: string, status: string }, onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data.map(msg => ({
        id: msg.id,
        isMe: msg.sender_id === userId,
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let subscription: any = null;

    const initialize = async () => {
      const session = await supabase.auth.getSession();
      const authUser = session.data.session?.user;

      if (!authUser) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('supabase_auth_id', authUser.id)
        .single();

      if (userData && isSubscribed) {
        setCurrentUserId(userData.id);
        await fetchMessages(userData.id);

        // Setup realtime subscription
        subscription = supabase
          .channel(`dm:${userData.id}:${friend.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, () => {
             fetchMessages(userData.id);
          })
          .subscribe();
      }
    };

    initialize();

    return () => {
      isSubscribed = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [friend.id]);

  const handleSend = async () => {
    if (!newMsg.trim() || !currentUserId) return;

    const { error } = await supabase.from('direct_messages').insert([
      { sender_id: currentUserId, receiver_id: friend.id, content: newMsg }
    ]);

    if (!error) {
      setNewMsg("");
    } else {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full fixed inset-0 z-30 bg-black/40 backdrop-blur-md pb-safe">
      <header className="p-4 flex items-center justify-between bg-transparent border-b border-white/10 z-10 pt-safe">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-indigo-400 p-2 -ml-2">
            ← 戻る
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                 <User className="w-4 h-4" />
              </div>
              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-night-navy ${friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white/90">{friend.name}</h2>
              <p className="text-[10px] text-gray-400">{friend.status}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-1 max-w-[80%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`p-3 rounded-2xl ${msg.isMe ? 'bg-indigo-600/80 text-white rounded-tr-sm' : 'glass-panel rounded-tl-sm text-white/90'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[10px] font-numbers text-gray-500 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-transparent border-t border-white/5">
        <div className="glass-panel p-2 pl-4 flex items-center gap-2 rounded-full">
          <input
            type="text"
            value={newMsg}
            maxLength={1000}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
