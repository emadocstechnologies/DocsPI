import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useConnection({ configRef, addLog, t }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAt, setConnectedAt] = useState(null);
  const [uptimeDisplay, setUptimeDisplay] = useState("00:00:00");
  const [pingMs, setPingMs] = useState(null);

  const uptimeIntervalRef = useRef(null);
  const pingIntervalRef = useRef(null);

  const calculateUptime = useCallback((startTime) => {
    if (!startTime) return "00:00:00";
    const diff = Date.now() - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isConnected && connectedAt) {
      uptimeIntervalRef.current = setInterval(() => {
        setUptimeDisplay(calculateUptime(connectedAt));
      }, 1000);
    } else {
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
        uptimeIntervalRef.current = null;
      }
      setUptimeDisplay("00:00:00");
    }

    return () => {
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
      }
    };
  }, [isConnected, connectedAt, calculateUptime]);

  useEffect(() => {
    if (isConnected) {
      const measure = async () => {
        try {
          const ms = await invoke("get_ping", { host: "1.1.1.1", port: 443 });
          setPingMs(ms >= 999 ? null : ms);
        } catch (e) { console.warn("get_ping failed:", e); }
      };
      measure();
      pingIntervalRef.current = setInterval(measure, 5000);
    } else {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      setPingMs(null);
    }

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [isConnected]);

  const startConnection = useCallback((timestamp = Date.now()) => {
    setIsConnected(true);
    setConnectedAt(timestamp);
    setUptimeDisplay("00:00:00");
  }, []);

  const endConnection = useCallback(() => {
    setIsConnected(false);
    setConnectedAt(null);
    setUptimeDisplay("00:00:00");
    setPingMs(null);
  }, []);

  return {
    isConnected,
    setIsConnected,
    connectedAt,
    setConnectedAt: startConnection,
    uptimeDisplay,
    pingMs,
    setPingMs,
    startConnection,
    endConnection,
  };
}



