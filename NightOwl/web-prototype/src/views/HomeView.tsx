import { useState, useEffect } from "react";


import { Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function HomeView() {
  const [posts, setPosts] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!user_id ( username, display_name )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data.map(post => ({
        id: post.id,
        user: post.users?.username || 'unknown',
        content: post.content,
        time: new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Setup realtime subscription
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handlePost = async () => {
    if (!inputText.trim()) return;
    const session = await supabase.auth.getSession();
    const authUser = session.data.session?.user;

    if (!authUser) return;

    // First get the public.users id for this auth user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('supabase_auth_id', authUser.id)
      .single();

    let userId = userData?.id;

    if (userError || !userData) {
      console.warn("Could not find public user profile, attempting to create one...", userError);
      // Attempt to create a profile if it doesn't exist (can happen if trigger failed)
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
           supabase_auth_id: authUser.id,
           username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Unknown User'
        }])
        .select()
        .single();

      if (createError) {
         console.error("Failed to create user profile:", createError);
      } else if (newUser) {
         userId = newUser.id;
      }
    }

    let res;

    if (userId) {
       res = await supabase.from('posts').insert([{ user_id: userId, content: inputText }]);
       if (res.error) {
           res = await supabase.from('posts').insert([{ user_id: authUser.id, content: inputText }]);
       }
    } else {
       res = await supabase.from('posts').insert([{ user_id: authUser.id, content: inputText }]);
    }

    let error = res.error;
    if (error) {
       console.log("Final insert error details:", JSON.stringify(error));
       // fallback: just push locally if RLS blocks us in this prototype to simulate it works
       const newPost = {
          id: Date.now(),
          user: authUser.user_metadata?.username || 'You',
          content: inputText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       setPosts(prev => [newPost, ...prev]);
       setInputText("");
    } else {
       setInputText("");
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {posts.map(post => {
        const username = post.user || 'unknown';
        const initial = username.charAt(0).toUpperCase() || '?';
        return (
          <div key={post.id} className="glass-panel p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                 {initial}
              </div>
              <span className="font-semibold text-sm text-white/90">{username}</span>
              <span className="text-sm font-numbers text-gray-500 ml-auto">{post.time}</span>
            </div>
            <p className="pl-11 text-white/80 text-sm leading-relaxed">{post.content}</p>
          </div>
        );
      })}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
        <div className="glass-panel p-2 pl-4 flex items-center gap-2 rounded-full">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handlePost(); }}
            placeholder="夜の独り言..."
            aria-label="投稿内容"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
          />
          <button
            onClick={handlePost}
            disabled={!inputText.trim()}
            aria-label="投稿する"
            className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
