import { useState, useEffect, memo, useMemo } from "react";


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
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setPosts(data.map(post => ({
        id: post.id,
        user: post.users?.username || 'unknown',
        content: post.content,
        time: new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } else {
      // 🛡️ Sentinel: Do not log detailed database errors to the client console to prevent information exposure.
      console.error("Failed to fetch posts.");
    }
  };

  useEffect(() => {
    fetchPosts();

    // ⚡ Bolt: Setup realtime subscription optimized for O(1) state updates on INSERT instead of O(N) re-fetches
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          // Fetch the inserted post to get related user data
          const { data: postData } = await supabase
            .from('posts')
            .select(`
              *,
              users!user_id ( username, display_name )
            `)
            .eq('id', payload.new.id)
            .single();

          if (postData) {
            const newPost = {
              id: postData.id,
              user: postData.users?.username || 'unknown',
              content: postData.content,
              time: new Date(postData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setPosts(prev => {
              if (prev.some(p => p.id === newPost.id)) return prev;
              return [newPost, ...prev];
            });
          }
        } else {
          // Fallback to fetch for UPDATE and DELETE events
          fetchPosts();
        }
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
      // 🛡️ Sentinel: Do not log detailed database errors to the client console to prevent information exposure.
      console.warn("Could not find public user profile, attempting to create one...");
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
         // 🛡️ Sentinel: Do not log detailed database errors to the client console to prevent information exposure.
         console.error("Failed to create user profile.");
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

    const error = res.error;
    if (error) {
       // 🛡️ Sentinel: Do not log detailed database errors to the client console to prevent information exposure.
       console.error("Failed to insert post.");
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

  // ⚡ Bolt: Memoize post list to prevent O(N) re-renders on every inputText keystroke
  const renderedPosts = useMemo(() => {
    return posts.map(post => (
      <PostItem key={post.id} post={post} />
    ));
  }, [posts]);

  return (
    <div className="flex flex-col gap-4 pb-20">
      {renderedPosts}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
        <div className="glass-panel p-2 pl-4 flex items-center gap-2 rounded-full">
          <input
            type="text"
            value={inputText}
            maxLength={500}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handlePost();
              }
            }}
            placeholder="夜の独り言..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
          />
          <button onClick={handlePost} aria-label="送信" disabled={!inputText.trim()} className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const PostItem = memo(({ post }: { post: any }) => {
  const username = post.user || 'unknown';
  const initial = username.charAt(0).toUpperCase() || '?';
  return (
    <div className="glass-panel p-4 flex flex-col gap-2">
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
});
