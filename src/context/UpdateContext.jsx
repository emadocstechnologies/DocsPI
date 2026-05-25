import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  checkGitHubRelease,
  isNewerVersion,
  getAppVersion,
  downloadUpdate,
  verifySha256,
  saveBlobAsFile,
  backupConfig,
  addUpdateHistory,
  getUpdateChannel,
  setUpdateChannel,
  getAutoDownload,
  setAutoDownload,
  shouldCheckUpdate,
  setLastCheckTime,
  getPendingUpdate,
  setPendingUpdate,
  getSkipVersion,
  setSkipVersion,
  parseChangelog,
  runSelfDiagnostic,
} from '../lib/update';

const UpdateContext = createContext(null);

export function UpdateProvider({ children }) {
  const [updateState, setUpdateState] = useState({
    status: 'idle',          // idle | checking | available | downloading | downloaded | installing | error
    currentVersion: getAppVersion(),
    latestVersion: null,
    changelog: null,
    changelogSections: [],
    downloadProgress: null,  // { received, total, percent }
    error: null,
    isPrerelease: false,
    channel: getUpdateChannel(),
    autoDownload: getAutoDownload(),
    pendingUpdate: getPendingUpdate(),
    diagnostic: null,
    history: [],
  });

  const updateRef = useRef(updateState);
  updateRef.current = updateState;

  const setPartial = useCallback((partial) => {
    setUpdateState(prev => {
      const next = { ...prev, ...partial };
      updateRef.current = next;
      return next;
    });
  }, []);

  // Faz 2: Release kontrolu
  const checkUpdate = useCallback(async ({ silent = false } = {}) => {
    if (updateState.status === 'checking') return;

    setPartial({ status: 'checking', error: null });

    try {
      const channel = getUpdateChannel();
      const release = await checkGitHubRelease({ includePreReleases: channel === 'beta' });
      const skipVersion = getSkipVersion();

      if (!release) {
        setPartial({ status: 'idle', error: 'Henuz surum bulunamadi' });
        return null;
      }

      const hasUpdate = isNewerVersion(release.version, getAppVersion());
      const isSkipped = skipVersion === release.version;

      // Changelog parse
      const sections = parseChangelog(release.changelog);

      const newState = {
        latestVersion: release.version,
        changelog: release.changelog,
        changelogSections: sections,
        isPrerelease: release.isPrerelease,
        downloadUrl: release.downloadUrl,
        downloadName: release.downloadName,
        downloadSize: release.downloadSize,
        publishedAt: release.publishedAt,
      };

      if (hasUpdate && !isSkipped) {
        newState.status = 'available';

        // Faz 10: Otomatik indirme
        if (getAutoDownload() && release.downloadUrl) {
          downloadRelease(release.downloadUrl, release.downloadName, release.version);
        }
      } else {
        newState.status = 'idle';
      }

      setPartial(newState);
      setLastCheckTime();

      addUpdateHistory({
        version: release.version,
        status: hasUpdate ? (isSkipped ? 'skipped' : 'found') : 'latest',
        silent,
        timestamp: new Date().toISOString(),
      });

      return release;
    } catch (err) {
      if (!silent) {
        setPartial({ status: 'error', error: err.message });
      } else {
        setPartial({ status: 'idle' });
      }
      return null;
    }
  }, [updateState.status, setPartial]);

  // Faz 6: Indirme
  const downloadRelease = useCallback(async (url, filename, version) => {
    setPartial({ status: 'downloading', downloadProgress: { received: 0, total: 0, percent: 0 } });

    try {
      const blob = await downloadUpdate(url, (progress) => {
        setPartial({ downloadProgress: progress });
      });

      setPartial({ status: 'downloaded', downloadBlob: blob, downloadFilename: filename });

      addUpdateHistory({
        version: version || 'unknown',
        status: 'downloaded',
        timestamp: new Date().toISOString(),
      });

      return blob;
    } catch (err) {
      setPartial({ status: 'error', error: `Indirme basarisiz: ${err.message}` });
      return null;
    }
  }, [setPartial]);

  // Faz 7: Hash dogrulama
  const verifyDownload = useCallback(async (expectedHash) => {
    const blob = updateRef.current.downloadBlob;
    if (!blob) return { valid: false, reason: 'dosya-yok' };

    const result = await verifySha256(blob, expectedHash);
    if (!result.valid) {
      setPartial({ status: 'error', error: 'Hash dogrulamasi basarisiz. Dosya bozuk olabilir.' });
    }
    return result;
  }, [setPartial]);

  // Faz 11: Guncellemeyi uygula
  const applyUpdate = useCallback(async () => {
    const state = updateRef.current;
    if (state.status !== 'downloaded' || !state.downloadBlob) {
      setPartial({ status: 'error', error: 'Once guncellemeyi indirin' });
      return false;
    }

    // Faz 12: Config yedekle
    backupConfig();

    try {
      setPartial({ status: 'installing' });

      saveBlobAsFile(state.downloadBlob, state.downloadFilename || `DocsPI-${state.latestVersion}.exe`);

      addUpdateHistory({
        version: state.latestVersion,
        status: 'installed',
        timestamp: new Date().toISOString(),
      });

      setPendingUpdate({
        version: state.latestVersion,
        filename: state.downloadFilename,
        timestamp: new Date().toISOString(),
      });

      setPartial({
        status: 'idle',
        downloadBlob: null,
        downloadProgress: null,
      });

      return true;
    } catch (err) {
      setPartial({ status: 'error', error: `Kurulum hatasi: ${err.message}` });
      return false;
    }
  }, [setPartial]);

  // Faz 9: Kanal degistir
  const setChannel = useCallback((channel) => {
    setUpdateChannel(channel);
    setPartial({ channel });
  }, [setPartial]);

  // Faz 10: Otomatik indirme toggle
  const setAutoDownloadEnabled = useCallback((enabled) => {
    setAutoDownload(enabled);
    setPartial({ autoDownload: enabled });
  }, [setPartial]);

  // Faz 14: Kurulum sonrasi dogrulama
  const validateInstall = useCallback(() => {
    const pending = getPendingUpdate();
    if (pending) {
      setPartial({ pendingUpdate: pending });
      return pending;
    }
    return null;
  }, [setPartial]);

  // Faz 15: Gecmis logu
  const refreshHistory = useCallback(() => {
    try {
      const history = JSON.parse(localStorage.getItem('docspi_update_history') || '[]');
      setPartial({ history });
    } catch {}
  }, [setPartial]);

  // Faz 19: Versiyon atla
  const skipVersion = useCallback((version) => {
    setSkipVersion(version);
    setPartial({ status: 'idle', latestVersion: null, changelog: null });
  }, [setPartial]);

  // Faz 20: Teshis
  const runDiagnostic = useCallback(() => {
    const result = runSelfDiagnostic();
    setPartial({ diagnostic: result });
    return result;
  }, [setPartial]);

  // Baslangicta bekleyen guncellemeyi kontrol et
  useEffect(() => {
    validateInstall();
    refreshHistory();
  }, [validateInstall, refreshHistory]);

  return (
    <UpdateContext.Provider value={{
      ...updateState,
      checkUpdate,
      downloadRelease,
      verifyDownload,
      applyUpdate,
      setChannel,
      setAutoDownloadEnabled,
      validateInstall,
      refreshHistory,
      skipVersion,
      runDiagnostic,
    }}>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const ctx = useContext(UpdateContext);
  if (!ctx) throw new Error('useUpdate must be used within UpdateProvider');
  return ctx;
}

// Commit: feat: implement UpdateContext for version management [132226]
