import { useEffect, useCallback } from 'react';
import { useUpdate } from '../context/UpdateContext';
import { shouldCheckUpdate, getPendingUpdate } from '../lib/update';

// Faz 17: Arka plan guncelleme kontrolu
// Faz 18: Cikista yukleme bildirimi
export function useUpdateChecker() {
  const {
    checkUpdate,
    status,
    latestVersion,
    pendingUpdate,
    validateInstall,
  } = useUpdate();

  // Baslangicta ve periyodik olarak kontrol et
  useEffect(() => {
    // Eger bekleyen guncelleme varsa once onu dogrula
    validateInstall();

    // Startup'ta kontrol et (gizli)
    if (shouldCheckUpdate()) {
      checkUpdate({ silent: true });
    }

    // Her 6 saatte bir tekrar kontrol et
    const interval = setInterval(() => {
      if (shouldCheckUpdate()) {
        checkUpdate({ silent: true });
      }
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkUpdate, validateInstall]);

  // Bekleyen guncelleme var mi?
  const hasPendingInstall = !!getPendingUpdate();

  // Kullaniciya gosterilecek mesaj
  const getUpdateMessage = useCallback(() => {
    if (hasPendingInstall) {
      const pending = getPendingUpdate();
      if (pending) {
        return `DocsPI ${pending.version} yuklendi. Yeniden baslatmaniz gerekebilir.`;
      }
    }
    if (status === 'available' && latestVersion) {
      return `DocsPI ${latestVersion} kullanima hazir.`;
    }
    if (status === 'downloaded') {
      return 'Guncelleme indirildi. Kurulum icin tiklayin.';
    }
    return null;
  }, [status, latestVersion, hasPendingInstall]);

  return {
    checkUpdate,
    hasPendingInstall,
    getUpdateMessage,
    shouldBackgroundCheck: shouldCheckUpdate,
  };
}

// Commit: feat: add useUpdateChecker hook [132227]
