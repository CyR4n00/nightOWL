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
      <div className="p-4 pt-8 text-center border-b border-white/5 relative">
        <h2 className="font-serif text-2xl glow-text">Friends</h2>
        <button
          onClick={() => setShowAddFriend(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-full transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-3 pb-24">
           {friends.length === 0 && (
             <div className="text-center text-indigo-300/50 mt-20 text-sm flex flex-col items-center gap-4">
               <User className="w-12 h-12 opacity-20" />
               <p>まだフレンドがいません<br/>右上の＋ボタンから追加しましょう</p>
             </div>
           )}

           {friends.map(friend => (
            <div key={friend.id} onClick={() => setActiveFriend(friend)} className="glass-panel p-4 flex items-center gap-4 cursor-pointer hover:border-indigo-500/30 transition-all shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-white/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-200">{friend.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 shadow-sm ${friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white/90 text-lg">{friend.name}</h3>
                <p className="text-sm text-indigo-200/50 flex items-center gap-1 mt-0.5"><MessageSquare className="w-3 h-3" />タップしてチャットを開く</p>
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
  const [searchId, setSearchId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [myUsername, setMyUsername] = useState("loading...");

  useEffect(() => {
    const fetchMyInfo = async () => {
      const session = await supabase.auth.getSession();
      const authUser = session.data.session?.user;
      if (authUser) {
        setMyUsername(authUser.user_metadata?.username || "unknown");
      }
    };
    fetchMyInfo();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://nightowl.app/invite/${myUsername}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    // Search for user
    const { data: targetUser, error: searchError } = await supabase
      .from('users')
      .select('id')
      .eq('username', searchId)
      .single();

    if (searchError || !targetUser) {
      alert("ユーザーが見つかりませんでした。");
      return;
    }

    // Get my public ID
    const session = await supabase.auth.getSession();
    const authUser = session.data.session?.user;
    if (!authUser) return;

    const { data: myData } = await supabase
      .from('users')
      .select('id')
      .eq('supabase_auth_id', authUser.id)
      .single();

    if (!myData) return;

    if (myData.id === targetUser.id) {
      alert("自分自身は追加できません。");
      return;
    }

    // Insert friend request securely using the rpc function
    const { error: insertError } = await supabase
      .rpc('add_friend', { target_user_id: targetUser.id });

    if (insertError) {
      console.error(insertError);
      alert("フレンド追加に失敗しました。既にフレンドかもしれません。");
    } else {
      alert(`${searchId} をフレンドに追加しました！`);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 z-30 bg-black/40 backdrop-blur-md pb-safe">
      <header className="p-4 flex items-center justify-between border-b border-white/10 z-10 pt-safe bg-transparent">
        <button onClick={onClose} className="text-indigo-400 p-2 -ml-2">
          ← キャンセル
        </button>
        <h2 className="font-bold text-sm text-white/90">フレンド追加</h2>
        <div className="w-16"></div>
      </header>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Limit Warning */}
        {!isPremium && currentFriendCount >= 5 && (
           <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
             無料プランのフレンド枠（最大5人）に達しています。これ以上追加するにはプレミアムプランへのアップグレードが必要です。
           </div>
        )}

        {/* ID Search */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300">ID検索</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50" />
            <input
              type="text"
              placeholder="NightOwl IDを入力"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-indigo-300/30 outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!isPremium && currentFriendCount >= 5}
            className="w-full p-4 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            検索して追加
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 font-bold">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Invite Link */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300">招待リンク</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            このリンクを教えることで、相手からフレンド追加してもらうことができます。
          </p>
          <div className="glass-panel p-4 flex items-center justify-between gap-4">
            <span className="text-sm text-white/80 truncate flex-1 font-numbers">
              nightowl.app/invite/{myUsername}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-indigo-300"
            >
              {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
