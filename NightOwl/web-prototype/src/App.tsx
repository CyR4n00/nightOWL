import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthView from './components/AuthView';
import { GateView } from './views/GateView';
import { MainApp } from './components/MainApp';

export default function App() {
  const [isNightTime, setIsNightTime] = useState(false);
  const [theme, setTheme] = useState<'default' | 'aurora' | 'deepsea' | 'dusk' | 'galaxy'>('default');
  const [session, setSession] = useState<import("@supabase/supabase-js").Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours >= 0 && hours < 6) {
        setIsNightTime(true);
      }
    };
    checkTime();
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Generate deterministic bubbles only for deepsea theme
  const bubbles = theme === 'deepsea' ? Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${(i * 13) % 100}%`,
    size: `${(i * 7) % 20 + 10}px`,
    delay: `${(i * 3) % 5}s`,
    duration: `${(i * 5) % 10 + 5}s`
  })) : [];

  return (
    <>
      {theme === 'deepsea' && bubbles.map(b => (
        <div key={b.id} className="bubble" style={{
          left: b.left,
          width: b.size,
          height: b.size,
          animationDelay: b.delay,
          animationDuration: b.duration
        }} />
      ))}

      {!isNightTime ? (
        <GateView onEnter={() => setIsNightTime(true)} />
      ) : !session ? (
        <AuthView onAuthSuccess={() => {}} />
      ) : (
        <MainApp theme={theme} setTheme={setTheme} session={session} />
      )}
    </>
  );
}
