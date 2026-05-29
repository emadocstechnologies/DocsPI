/// ============================================================
/// DocsPI 20-Fazli Guncelleme Sistemi
/// ============================================================
/// Faz 1  - Versiyon bilgisi
/// Faz 2  - GitHub release kontrolu
/// Faz 3  - Changelog getirme
/// Faz 4  - Update state yonetimi (UpdateContext ile)
/// Faz 5  - Update Panel UI
/// Faz 6  - Indirme yoneticisi
/// Faz 7  - SHA256 hash dogrulama
/// Faz 8  - Indirme ilerlemesi
/// Faz 9  - Kanal secici (stable/beta)
/// Faz 10 - Otomatik indirme
/// Faz 11 - Guncellemeyi uygula
/// Faz 12 - Config yedekleme
/// Faz 13 - Config geri yukleme
/// Faz 14 - Kurulum sonrasi dogrulama
/// Faz 15 - Gecmis logu
/// Faz 16 - Akilli bildirim
/// Faz 17 - Arka plan kontrolu
/// Faz 18 - Cikista yukleme
/// Faz 19 - Rozet gostergesi
/// Faz 20 - Kendi kendine teshis
/// ============================================================

const APP = { name: "DocsPI", version: "1.0.0-beta" };
const GITHUB_REPO = "aydocs/DocsPI";
const GITHUB_API = "https://api.github.com/repos/aydocs/DocsPI/releases";
const LS_KEYS = {
  updateHistory: 'docspi_update_history',
  updateChannel: 'docspi_update_channel',
  autoDownload: 'docspi_auto_download',
  lastCheck: 'docspi_last_update_check',
  pendingUpdate: 'docspi_pending_update',
  configBackup: 'docspi_config_backup',
  skipVersion: 'docspi_skip_version',
};

// -------------------------------------------------------
// Faz 1: Versiyon Bilgisi
// -------------------------------------------------------
export function getAppVersion() {
  return APP.version;
}

export function getAppName() {
  return APP.name;
}

export function getPlatformInfo() {
  const platform = navigator.platform || '';
  const arch = navigator.userAgent.includes('x64') ? 'x64' : 'x86';
  const os = platform.includes('Win') ? 'windows' : platform.includes('Mac') ? 'macos' : 'linux';
  return { os, arch, platform };
}

// -------------------------------------------------------
// Faz 2: GitHub Release Kontrolu
// -------------------------------------------------------
export async function checkGitHubRelease({ includePreReleases = false } = {}) {
  const url = includePreReleases
    ? `${GITHUB_API}?per_page=5`
    : `${GITHUB_API}/latest`;

  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    if (res.status === 403) throw new Error('GitHub API limit doldu, daha sonra tekrar dene');
    if (res.status === 404) throw new Error('Henuz release yayinlanmam?s');
    throw new Error(`GitHub API hatasi: ${res.status}`);
  }

  const data = includePreReleases ? await res.json() : [await res.json()];
  const releases = (Array.isArray(data) ? data : [data])
    .filter(r => includePreReleases || !r.prerelease)
    .map(r => parseRelease(r));

  return releases[0] || null;
}

function parseRelease(data) {
  const tag = data.tag_name.replace(/^v/, '');
  const asset = (data.assets || []).find(a =>
    a.name.endsWith('.exe') || a.name.includes('Setup') || a.name.includes('.msi')
  );

  return {
    version: tag,
    publishedAt: data.published_at,
    isPrerelease: data.prerelease,
    changelog: data.body || '',
    downloadUrl: asset?.browser_download_url || null,
    downloadName: asset?.name || null,
    downloadSize: asset?.size || 0,
    assetCount: data.assets?.length || 0,
  };
}

export function isNewerVersion(remoteVersion, currentVersion) {
  if (!remoteVersion) return false;

  // Semversiyon karsilastirmasi (pre-release destekli)
  // "1.0.0-beta" -> base="1.0.0", pre="beta"
  const parseSemver = (ver) => {
    const match = ver.match(/^(\d+)\.(\d+)\.(\d+)-?(.+)?$/);
    if (!match) return { major: 0, minor: 0, patch: 0, pre: '' };
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      pre: match[4] || '',
    };
  };

  const r = parseSemver(remoteVersion);
  const c = parseSemver(currentVersion);

  // Base versiyon karsilastirmasi
  if (r.major !== c.major) return r.major > c.major;
  if (r.minor !== c.minor) return r.minor > c.minor;
  if (r.patch !== c.patch) return r.patch > c.patch;

  // Base versiyon ayniysa pre-release kontrolu
  // Pre-release'suz surum > pre-release'li surum (1.0.0 > 1.0.0-beta)
  if (!r.pre && c.pre) return true;
  if (r.pre && !c.pre) return false;
  if (!r.pre && !c.pre) return false; // Ayni versiyon

  // Her ikisi de pre-release: build numarasi karsilastirmasi
  const rBuild = parseInt(r.pre.split('.').pop(), 10) || 0;
  const cBuild = parseInt(c.pre.split('.').pop(), 10) || 0;
  return rBuild > cBuild;
}

// -------------------------------------------------------
// Faz 3: Changelog
// -------------------------------------------------------
export function parseChangelog(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const headerMatch = line.match(/^###?\s+(.+)/);
    const bulletMatch = line.match(/^[\s]*[-*]\s+(.+)/);

    if (headerMatch) {
      currentSection = { title: headerMatch[1].trim(), items: [] };
      sections.push(currentSection);
    } else if (bulletMatch && currentSection) {
      currentSection.items.push(bulletMatch[1].trim());
    }
  }

  return sections.length > 0 ? sections : [{ title: 'Degisiklikler', items: [markdown.trim()] }];
}

export function truncateChangelog(sections, maxItems = 5) {
  if (!sections || sections.length === 0) return [];
  return sections.map(s => ({
    ...s,
    items: s.items.slice(0, maxItems),
    hasMore: s.items.length > maxItems,
  }));
}

// -------------------------------------------------------
// Faz 6: Indirme Yoneticisi
// -------------------------------------------------------
export async function downloadUpdate(url, onProgress) {
  if (!url) throw new Error('Indirme adresi yok');

  const res = await fetch(url, {
    signal: AbortSignal.timeout(300000),
  });

  if (!res.ok) throw new Error(`Indirme hatasi: ${res.status}`);

  const contentLength = res.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const reader = res.body.getReader();

  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress && total > 0) {
      onProgress({ received, total, percent: Math.round((received / total) * 100) });
    }
  }

  const blob = new Blob(chunks, { type: 'application/octet-stream' });
  return blob;
}

export function saveBlobAsFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------
// Faz 7: SHA256 Hash Dogrulama
// -------------------------------------------------------
export async function verifySha256(blob, expectedHash) {
  if (!expectedHash) return { valid: true, computed: null, reason: 'hash-yok' };

  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const valid = computedHash.toLowerCase() === expectedHash.toLowerCase();
  return { valid, computed: computedHash, expected: expectedHash };
}

// -------------------------------------------------------
// Faz 9: Kanal Secici
// -------------------------------------------------------
export function getUpdateChannel() {
  return localStorage.getItem(LS_KEYS.updateChannel) || 'stable';
}

export function setUpdateChannel(channel) {
  localStorage.setItem(LS_KEYS.updateChannel, channel);
}

// -------------------------------------------------------
// Faz 10: Otomatik Indirme
// -------------------------------------------------------
export function getAutoDownload() {
  const val = localStorage.getItem(LS_KEYS.autoDownload);
  return val === null ? true : val === 'true';
}

export function setAutoDownload(enabled) {
  localStorage.setItem(LS_KEYS.autoDownload, String(enabled));
}

// -------------------------------------------------------
// Faz 12: Config Yedekleme
// -------------------------------------------------------
export function backupConfig() {
  try {
    const config = localStorage.getItem('docspi_config');
    if (config) {
      localStorage.setItem(LS_KEYS.configBackup, config);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Config yedekleme hatasi:', e);
    return false;
  }
}

// -------------------------------------------------------
// Faz 13: Config Geri Yukleme
// -------------------------------------------------------
export function restoreConfig() {
  try {
    const backup = localStorage.getItem(LS_KEYS.configBackup);
    if (backup) {
      localStorage.setItem('docspi_config', backup);
      localStorage.removeItem(LS_KEYS.configBackup);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Config geri yukleme hatasi:', e);
    return false;
  }
}

// -------------------------------------------------------
// Faz 15: Gecmis Logu
// -------------------------------------------------------
export function getUpdateHistory() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.updateHistory) || '[]');
  } catch { return []; }
}

export function addUpdateHistory(entry) {
  const history = getUpdateHistory();
  history.unshift({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
  // Son 20 kaydi tut
  localStorage.setItem(LS_KEYS.updateHistory, JSON.stringify(history.slice(0, 20)));
}

export function clearUpdateHistory() {
  localStorage.setItem(LS_KEYS.updateHistory, '[]');
}

// -------------------------------------------------------
// Faz 17: Arka Plan Kontrolu
// -------------------------------------------------------
export function getLastCheckTime() {
  const val = localStorage.getItem(LS_KEYS.lastCheck);
  return val ? parseInt(val, 10) : 0;
}

export function setLastCheckTime() {
  localStorage.setItem(LS_KEYS.lastCheck, String(Date.now()));
}

export function shouldCheckUpdate() {
  const lastCheck = getLastCheckTime();
  const now = Date.now();
  const hoursSinceLastCheck = (now - lastCheck) / (1000 * 60 * 60);
  // En az 6 saatte bir kontrol et
  return hoursSinceLastCheck >= 6;
}

// -------------------------------------------------------
// Faz 18: Cikista Yukleme
// -------------------------------------------------------
export function getPendingUpdate() {
  try {
    const data = localStorage.getItem(LS_KEYS.pendingUpdate);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setPendingUpdate(updateData) {
  if (updateData) {
    localStorage.setItem(LS_KEYS.pendingUpdate, JSON.stringify(updateData));
  } else {
    localStorage.removeItem(LS_KEYS.pendingUpdate);
  }
}

// -------------------------------------------------------
// Faz 19: Skip versiyon
// -------------------------------------------------------
export function getSkipVersion() {
  return localStorage.getItem(LS_KEYS.skipVersion) || null;
}

export function setSkipVersion(version) {
  if (version) {
    localStorage.setItem(LS_KEYS.skipVersion, version);
  } else {
    localStorage.removeItem(LS_KEYS.skipVersion);
  }
}

// -------------------------------------------------------
// Faz 20: Kendi Kendine Teshis
// -------------------------------------------------------
export function runSelfDiagnostic() {
  const issues = [];

  // localStorage erisimi
  try {
    localStorage.getItem('test');
  } catch {
    issues.push({ severity: 'critical', message: 'localStorage erisilemiyor' });
  }

  // Config kontrolu
  const config = localStorage.getItem('docspi_config');
  if (!config) {
    issues.push({ severity: 'warning', message: 'Config bulunamadi, yeni baslatilacak' });
  } else {
    try {
      const parsed = JSON.parse(config);
      if (!parsed.language) issues.push({ severity: 'info', message: 'Config eksik alanlar iceriyor' });
    } catch {
      issues.push({ severity: 'critical', message: 'Config bozuk, duzeltilmeli' });
    }
  }

  // Profil kontrolu
  const profiles = localStorage.getItem('docspi_saved_profiles');
  if (profiles) {
    try {
      const parsed = JSON.parse(profiles);
      if (!Array.isArray(parsed)) issues.push({ severity: 'warning', message: 'Profil verisi bozuk' });
    } catch {
      issues.push({ severity: 'warning', message: 'Profil verisi okunamiyor' });
    }
  }

  // Guncelleme gecmisi kontrolu
  const history = getUpdateHistory();
  const lastUpdate = history.find(h => h.status === 'installed');

  return {
    version: APP.version,
    platform: getPlatformInfo(),
    lastUpdateCheck: new Date(getLastCheckTime()).toLocaleString(),
    lastInstalledVersion: lastUpdate?.version || null,
    updateCount: history.length,
    configExists: !!config,
    profilesCount: profiles ? (() => { try { return JSON.parse(profiles).length; } catch { return 0; } })() : 0,
    issues,
    healthy: issues.filter(i => i.severity === 'critical').length === 0,
  };
}

