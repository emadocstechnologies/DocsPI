import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { DNS_MAP } from '../constants';

export function useProxy({ configRef, addLog, t }) {
  const clearProxy = useCallback(async (silent = false) => {
    try {
      await invoke("clear_system_proxy");
      if (!silent) {
        addLog(t.logProxyCleared, "success", { i18nKey: "logProxyCleared" });
      }
    } catch (e) {
      addLog(t.logProxyClearError(e), "warn", {
        i18nKey: "logProxyClearError",
        i18nParams: [e],
      });
      console.error(e);
    }
    try {
      await invoke("stop_divert_engine");
    } catch (e) { console.warn("stop_divert_engine failed:", e); }
  }, [addLog, t]);

  const buildDivertConfig = useCallback((mode, proxyPort = 0) => ({
    mode,
    auto_ttl: true,
    block_quic: true,
    wrong_chksum: configRef.current.dpiMethod === '2',
    wrong_seq: true,
    dns_redirect: configRef.current.selectedDns !== 'system',
    dns_addr: DNS_MAP[configRef.current.selectedDns] || '1.1.1.1',
    proxy_port: proxyPort,
    fake_sni: configRef.current.fakeSni || "www.google.com",
  }), [configRef]);

  return { clearProxy, buildDivertConfig };
}
// Commit: feat: add useProxy hook for proxy operations [132226]

// feat: implement useProxy hook [132604]
