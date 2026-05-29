import { useState, useRef, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

// Detect Android platform (runs once at module init)
let isAndroid = false;
try {
  if (typeof window !== 'undefined' && '__TAURI__' in window) {
    // Will throw on non-Android: VPN command not registered
    invoke('vpn_status').catch(() => {}).then(() => { isAndroid = true; });
  }
} catch { /* not tauri or not android */ }

export function useAndroidVpn({ addLog, setIsConnected, setConnectedAt, updateTrayTooltip, notifyUser, t }) {
  const [vpnActive, setVpnActive] = useState(false);
  const [vpnBytesRx, setVpnBytesRx] = useState(0);
  const [vpnBytesTx, setVpnBytesTx] = useState(0);
  const statusInterval = useRef(null);

  // Poll VPN status while active
  useEffect(() => {
    if (vpnActive) {
      statusInterval.current = setInterval(async () => {
        try {
          const status = await invoke('vpn_status');
          if (status) {
            setVpnBytesRx(status.bytes_rx || 0);
            setVpnBytesTx(status.bytes_tx || 0);
            if (!status.running) {
              // VPN stopped externally
              handleVpnStopped();
            }
          }
        } catch (e) {
          console.warn('vpn_status poll error:', e);
        }
      }, 2000);
    } else {
      if (statusInterval.current) {
        clearInterval(statusInterval.current);
        statusInterval.current = null;
      }
    }
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, [vpnActive]);

  const handleVpnStopped = useCallback(() => {
    setVpnActive(false);
    setVpnBytesRx(0);
    setVpnBytesTx(0);
    setIsConnected(false);
    setConnectedAt(null);
    updateTrayTooltip('disconnected');
    notifyUser('DocsPI', 'VPN bağlantısı kesildi', 'disconnect');
    if (addLog) addLog(t?.logDisconnected || 'VPN bağlantısı kesildi', 'warn');
  }, [setIsConnected, setConnectedAt, updateTrayTooltip, notifyUser, addLog, t]);

  const startAndroidVpn = useCallback(async (config) => {
    try {
      if (addLog) addLog(t?.logStartingVpn || 'VPN başlatılıyor...', 'info');
      updateTrayTooltip('connecting');

      const vpnConfig = {
        dns: config.selectedDns || '1.1.1.1',
        proxy_port: 0,
        bypass_mode: config.networkMode || 'game',
      };

      await invoke('start_vpn', { config: vpnConfig });
      setVpnActive(true);
      setIsConnected(true);
      setConnectedAt(Date.now());
      updateTrayTooltip('connected');
      notifyUser('DocsPI', t?.logVpnConnected || 'VPN bağlantısı aktif', 'connect');
      if (addLog) addLog(t?.logVpnConnected || 'VPN başarıyla başlatıldı', 'success');
      return true;
    } catch (e) {
      setVpnActive(false);
      setIsConnected(false);
      updateTrayTooltip('disconnected');
      if (addLog) addLog(t?.logVpnStartError?.(e) || `VPN başlatılamadı: ${e}`, 'error');
      return false;
    }
  }, [addLog, setIsConnected, setConnectedAt, updateTrayTooltip, notifyUser, t]);

  const stopAndroidVpn = useCallback(async () => {
    try {
      await invoke('stop_vpn');
    } catch (e) {
      console.warn('stop_vpn error:', e);
    }
    handleVpnStopped();
    if (addLog) addLog(t?.logVpnStopped || 'VPN durduruldu', 'info');
  }, [handleVpnStopped, addLog, t]);

  return {
    isAndroid,
    vpnActive,
    vpnBytesRx,
    vpnBytesTx,
    startAndroidVpn,
    stopAndroidVpn,
  };
}
