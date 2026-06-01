import { useState, useEffect } from "react";


import { User, MessageSquare, Plus, Search, Check, Copy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { PrivateChatView } from './PrivateChatView';

export function FriendChatView({ isPremium }: { isPremium: boolean }) {
  const [activeChatTab, setActiveChatTab] = useState<'friends' | 'open'>('friends');
  const [friends, setFriends] = useState<any[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [activeFriend, setActiveFriend] = useState<any | null>(null);

  const fetchFriends = async () => {
    const session = await supabase.auth.getSession();
    const authUser = session.data.session?.user;
    if (!authUser) return;

    // Get current public user id
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('supabase_auth_id', authUser.id)
      .single();

    if (!userData) return;

    // Get friends (where status is accepted)
    const { data: friendsData } = await supabase
      .from('friends')
      .select(`
        friend_id,
        users!friends_friend_id_fkey (
          id,
          username
        )
      `)
      .eq('user_id', userData.id)
      .eq('status', 'accepted');

    if (friendsData) {
      setFriends(friendsData.map((f: any) => ({
        id: f.users.id,
        name: f.users.username,
        status: "Online", // Mock status for now
        lastMsg: "..."
      })));
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 flex gap-2 border-b border-white/5">
        <button
          onClick={() => setActiveChatTab('friends')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeChatTab === 'friends' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:bg-white/5'}`}
        >
          Friends
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-2 pb-24">
           {/* Add Friend Button */}
           <button
             onClick={() => setShowAddFriend(true)}
             className="w-full glass-panel p-4 flex items-center justify-center gap-2 mb-2 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-colors"
           >
             <Plus className="w-5 h-5" />
             <span className="font-semibold text-sm">フレンドを追加</span>
           </button>

           {friends.length === 0 && (
             <div className="text-center text-gray-500 mt-10 text-sm">フレンドがいません</div>
           )}

           {friends.map(friend => (
            <div key={friend.id} onClick={() => setActiveFriend(friend)} className="glass-panel p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-night-navy ${friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white/90">{friend.name}</h3>
                <p className="text-xs text-gray-500">{friend.lastMsg}</p>
              </div>
            </div>
           ))}
        </div>
      </div>
      {showAddFriend && <AddFriendView onClose={() => setShowAddFriend(false)} isPremium={isPremium} currentFriendCount={friends.length} />}
      {activeFriend && <PrivateChatView friend={activeFriend} onClose={() => setActiveFriend(null)} />}
    </div>
  );
}

function AddFriendView({ onClose, isPremium, currentFriendCount }: { onClose: () => void, isPremium: boolean, currentFriendCount: number }) {
  // Dummy Add friend view
  return (
    <div className="flex flex-col h-full absolute inset-0 z-30 bg-black/40 backdrop-blur-md pb-safe">
       <div className="p-6">
         <h2 className="text-xl">Add Friend (Dummy)</h2>
         <button onClick={onClose} className="mt-4 p-4 glass-button">Back</button>
       </div>
    </div>
  );
}
