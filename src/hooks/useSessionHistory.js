import { useState, useEffect } from 'react';

export const useSessionHistory = () => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('session_history');
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      totalUptime: 0,
      mostUsedMode: 'balanced',
      avgPing: 0,
      sessions: []
    };
  });

  const saveSession = (session) => {
    setHistory((prev) => {
      const sessionUptime = session.uptime ?? session.duration ?? 0;
      const newSessions = [session, ...prev.sessions].slice(0, 50); // Keep last 50 sessions
      const totalSessions = prev.totalSessions + 1;
      const totalUptime = prev.totalUptime + sessionUptime;
      
      // Calculate most used mode
      const modes = newSessions.map(s => s.mode);
      const mostUsedMode = modes.sort((a,b) =>
        modes.filter(v => v===a).length - modes.filter(v => v===b).length
      ).pop();

      // Calculate avg ping
      const avgPing = Math.round(newSessions.reduce((acc, s) => acc + (s.ping || s.avgPing || 0), 0) / newSessions.length);

      const newHistory = {
        totalSessions,
        totalUptime,
        mostUsedMode,
        avgPing,
        sessions: newSessions.map(s => ({
          ...s,
          uptime: s.uptime ?? s.duration ?? 0,
          ping: s.ping ?? s.avgPing ?? null,
          date: s.date || new Date().toLocaleDateString(),
          id: s.id || crypto.randomUUID(),
        }))
      };
      
      localStorage.setItem('session_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const resetHistory = () => {
    const emptyHistory = {
      totalSessions: 0,
      totalUptime: 0,
      mostUsedMode: 'balanced',
      avgPing: 0,
      sessions: []
    };
    localStorage.setItem('session_history', JSON.stringify(emptyHistory));
    setHistory(emptyHistory);
  };

  return { history, saveSession, resetHistory };
};

// Commit: feat: implement useSessionHistory hook [132227]
