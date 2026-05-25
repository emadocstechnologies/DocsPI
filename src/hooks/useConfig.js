import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getTranslations } from '../i18n';
import { VALID_CHUNK_SIZES, VALID_DPI_METHODS, DEFAULT_CHUNKS } from '../profiles';
import { APP } from '../constants';
import { safeLocalStorage, safeLocalStorageSet } from '../utils';

const defaultSettings = {
  language: "tr",
  autoStart: false,
  autoConnect: false,
  minimizeToTray: false,
  smartDns: true,
  dnsMode: "manual",
  selectedDns: "cloudflare",
  autoReconnect: true,
  autoEscalate: true,
  dpiMethod: "2",
  fakeSni: "www.google.com",
  httpsChunkSize: 1,
  ipv4Only: true,
  selectedIspProfile: "heavy",
  customDomains: [],
  networkMode: "smooth",
  advancedBypass: false,
  requireConfirmation: true,
  notifications: true,
  notifyOnConnect: true,
  notifyOnDisconnect: true,
};

function loadSavedConfig() {
  const saved = localStorage.getItem("docspi_config");
  if (!saved) return defaultSettings;
  
  try {
    let parsedStr = saved;
    if (!saved.startsWith("{")) {
      parsedStr = decodeURIComponent(escape(atob(saved)));
    }
    const parsed = JSON.parse(parsedStr);
    if (typeof parsed !== 'object' || parsed === null) return defaultSettings;
    
    return {
      ...defaultSettings,
      ...parsed,
      dpiMethod: VALID_DPI_METHODS.includes(String(parsed.dpiMethod)) 
        ? String(parsed.dpiMethod) 
        : defaultSettings.dpiMethod,
      httpsChunkSize: VALID_CHUNK_SIZES.includes(Number(parsed.httpsChunkSize)) 
        ? Number(parsed.httpsChunkSize) 
        : defaultSettings.httpsChunkSize,
      selectedDns: typeof parsed.selectedDns === 'string' 
        ? parsed.selectedDns 
        : defaultSettings.selectedDns,
      networkMode: ['smooth', 'game', 'super'].includes(parsed.networkMode) 
        ? parsed.networkMode 
        : defaultSettings.networkMode,
    };
  } catch (e) {
    console.error("Failed to parse config:", e);
    return defaultSettings;
  }
}

export function useConfig() {
  const [config, setConfig] = useState(loadSavedConfig);
  const configRef = useRef(config);
  
  useEffect(() => { 
    configRef.current = config; 
  }, [config]);

  const t = useMemo(
    () => getTranslations(config.language || "tr"),
    [config.language],
  );

  const updateConfig = useCallback((keyOrObj, value) => {
    setConfig((prev) => {
      let newConfig;
      if (typeof keyOrObj === 'object' && keyOrObj !== null) {
        newConfig = { ...prev, ...keyOrObj };
      } else {
        newConfig = { ...prev, [keyOrObj]: value };
      }
      safeLocalStorageSet('docspi_config', newConfig);
      return newConfig;
    });
  }, []);

  return { config, setConfig, configRef, t, updateConfig };
}
