import { useState, useEffect } from "react";


import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, LogIn, UserPlus, Apple, Computer, Eye, EyeOff } from 'lucide-react';

export default function AuthView({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp && password.length < 8) {
        setError("パスワードは8文字以上で入力してください。");
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        });
        if (error) throw error;

        // If auto-confirm is OFF in Supabase, session will be null
        if (data.session === null) {
            setMessage("確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。");
        } else {
            onAuthSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err: any) {
      // 🛡️ Sentinel: Do not expose detailed authentication error messages to prevent username enumeration or leaking internal details.
      console.error("Authentication operation failed.");
      setError("認証に失敗しました。入力内容をご確認ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-200 font-sans p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-serif text-center mb-8 glow-text tracking-wider">
          {isSignUp ? 'Join the Night' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignUp && (
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50" />
                <input
                  type="text"
                  placeholder="ユーザー名 (Username)"
                  value={username}
                  maxLength={20}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50" />
              <input
                type="email"
                placeholder="メールアドレス (Email)"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="パスワード (Password)"
                value={password}
                maxLength={128}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-slate-200 placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/50 hover:text-indigo-300/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-full"
                aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 rounded-2xl py-3.5 font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <><UserPlus className="w-5 h-5" /> メールで新規登録</>
            ) : (
              <><LogIn className="w-5 h-5" /> メールでログイン</>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-indigo-200/50 font-medium">または</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 font-medium transition-all flex items-center justify-center gap-3 text-sm text-white/90"
          >
            <Computer className="w-5 h-5 text-gray-300" />
            Googleで続ける
          </button>

          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'apple' })}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 font-medium transition-all flex items-center justify-center gap-3 text-sm text-white/90"
          >
            <Apple className="w-5 h-5 text-gray-300" />
            Appleで続ける
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-indigo-200/60">
          {isSignUp ? 'すでにアカウントをお持ちですか？' : 'アカウントをお持ちでないですか？'}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-medium"
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </div>
      </div>
    </div>
  );
}
