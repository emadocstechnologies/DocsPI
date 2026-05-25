# Changelog

Tüm önemli değişiklikler bu dosyada belgelenmiştir.

Format: [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/)

---

## [1.0.0-beta.9] - 2026-05-28

### Added
- ErrorBoundary bileşeni — React crash koruması, uygulama çöktüğünde reload butonu
- AlertTriangle import fix — lucide-react eksik import düzeltildi
- 4 eksik fonksiyon: formatUptime, saveProfile, loadProfile, deleteProfile
- `src/utils.js` — Paylaşılan yardımcı fonksiyonlar (formatUptime, computeQualityScore, vb.)
- `src/hooks/useConfig.js` — Config state yönetimi hook'u
- Unit test dosyaları: update.test.js, i18n.test.js, constants.test.js

### Fixed
- InternetSetOptionW unchecked return — hata kontrolü eklendi
- Token handle leak in check_admin() — CloseHandle düzeltildi
- .expect() calls replaced with graceful fallbacks (app icon, context build)
- PAC listener spin loop — exponential backoff eklendi (50ms→500ms)
- Silent catch blocks — tüm sessiz `catch (_) {}` blokları `console.warn` ile değiştirildi
- LogViewer duplicate FILTERS sabiti kaldırıldı
- TrafficCounter duplicate fonksiyonlar kaldırıldı, utils'den import edildi

### Changed
- i18n restructure — English primary language, Turkish secondary
- 8 eksik çeviri anahtarı eklendi (logDirtyShutdownRecovery, btnNo, vb.)
- `getLanguageMeta()` fonksiyonu eklendi (RTL desteği)
- `getTranslations()` Proxy ile eksik anahtar uyarıları

### Security
- Rust backend: Unsafe code review ve hardening
- Error handling iyileştirmeleri

---

## [1.0.0-beta.8] - 2026-05-28

### Changed
- Purple theme consistency — tüm mavi remnant'lar temizlendi
- accent-blue renkleri #7c3aed ile değiştirildi
- BypassTest ve bileşenleri purple tema ile güncellendi

---

## [1.0.0-beta.7] - 2026-05-28

### Added
- v1.0.0-beta badge eklendi
- version-badge CSS
- update.js semver comparison desteği

---

## [1.0.0-beta.6] - 2026-05-28

### Added
- v1.0.0-beta release workflow
- Cargo.toml version sync
- tauri.conf version sync

---

## [1.0.0-beta.5] - 2026-05-28

### Added
- v1.0.0-beta version sistemi
- constants.js versiyon tanımları
- package.json version bump
- Semver comparison desteği

---

## [1.0.0-beta.4] - 2026-05-28

### Changed
- darknes referansları kaldırıldı
- .omo/ ve package-lock repo'dan çıkarıldı

---

## [1.0.0-beta.3] - 2026-05-28

### Added
- DocsPI ilk versiyon
- Rust backend (Tauri v2)
- React frontend
- DPI bypass motoru
- 13 dil desteği
- Oyun modu
- Auto-escalation
- Sentinel recovery
- Proxy backup/restore

// Commit: feat: add CHANGELOG.md documentation [132231]
