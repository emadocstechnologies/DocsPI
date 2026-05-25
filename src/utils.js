// ═══════════════════════════════════════════════════════════════════
// utils.js — Paylaşılan yardımcı fonksiyonlar
//
// Tüm component'ler arasında ortak kullanılan fonksiyonlar burada.
// Tekrar eden kodu önlemek için bu dosyayı kullanın.
// ═══════════════════════════════════════════════════════════════════

/**
 * Saniyeyi okunabilir formata çevirir (HH:MM:SS)
 * @param {number} seconds - Geçen saniye
 * @returns {string} Formatlanmış süre
 */
export function formatUptime(seconds) {
  if (!seconds || seconds < 0) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Saniyeyi kısa formata çevirir (1s 2d 3sn)
 * @param {number} seconds - Geçen saniye
 * @returns {string} Kısa format
 */
export function formatUptimeShort(seconds) {
  if (!seconds || seconds < 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}s ${m}d ${s}sn`;
  if (m > 0) return `${m}d ${s}sn`;
  return `${s}sn`;
}

/**
 * Ping değerini okunabilir formata çevirir
 * @param {number|null} ms - Milisaniye
 * @returns {string}
 */
export function formatPing(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms >= 999) return '>999ms';
  return `${ms}ms`;
}

/**
 * DNS kalite skoru hesaplar (0-100)
 * @param {Object} dnsLatencies - DNS gecikme değerleri
 * @returns {number|null}
 */
export function computeQualityScore(dnsLatencies) {
  if (!dnsLatencies || Object.keys(dnsLatencies).length === 0) return null;
  const vals = Object.values(dnsLatencies).filter(v => v && v < 999);
  if (vals.length === 0) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.max(0, Math.min(100, Math.round(100 - (avg / 300) * 100)));
}

/**
 * Kalite skoruna göre etiket döndürür
 * @param {number|null} score
 * @returns {{ text: string, color: string } | string}
 */
export function getQualityLabel(score) {
  if (score === null) return 'Ölçülmedi';
  if (score >= 90) return { text: 'Mükemmel', color: '#4ade80' };
  if (score >= 70) return { text: 'İyi', color: '#22d3ee' };
  if (score >= 50) return { text: 'Normal', color: '#facc15' };
  if (score >= 30) return { text: 'Düşük', color: '#fb923c' };
  return { text: 'Kötü', color: '#f87171' };
}

/**
 * Byte değerini okunabilir formata çevirir
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Tarihi Türkçe formata çevirir
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTR(date) {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Debounce fonksiyonu
 * @param {Function} fn
 * @param {number} delay - Milisaniye
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * localStorage'dan güvenli okuma
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function safeLocalStorage(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * localStorage'a güvenli yazma
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Commit: feat: implement utils.js with helper functions [132227]
