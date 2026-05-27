export const URLS = {
  github: "https://github.com/aydocs/DocsPI",
  discord: "https://discord.gg/aydocs",
  releases: "https://github.com/aydocs/DocsPI/releases",
};

export const DNS_MAP = {
  system: null,
  cloudflare: "1.1.1.1",
  adguard: "94.140.14.14",
  google: "8.8.8.8",
  quad9: "9.9.9.9",
  opendns: "208.67.222.222",
  global: "8.8.4.4",
  alibaba: "223.5.5.5",
  yandex: "77.88.8.8",
  premium_ultra: "1.1.1.1", // In reality, this would be a private ultra-fast DNS IP
};

// DoH uses IP addresses, not domains — ISPs may hijack/block domain-based DNS resolution.
export const DOH_MAP = {
  cloudflare: "https://1.1.1.1/dns-query",
  google: "https://8.8.8.8/dns-query",
  adguard: "https://94.140.14.14/dns-query",
  quad9: "https://9.9.9.9:5053/dns-query",
  opendns: "https://208.67.222.222/dns-query",
  global: "https://8.8.4.4/dns-query",
  alibaba: "https://223.5.5.5/dns-query",
  premium_ultra: "https://premium.docspi.app/dns-query",
};

export const APP = {
  name: "DocsPI",
  version: "1.0.0-beta",
  versionDisplay: "v1.0.0-beta",
  versionStage: "beta",
  versionCodename: "İlk Adım",
  buildDate: __BUILD_DATE__,
  designWidth: 380,
  designHeight: 700,
  maxLogs: 100,
  maxPortRetries: 20,
  maxReconnectAttempts: 5,
  portCheckMaxAttempts: 15,
};

export const VERSION = APP.version;
export const VERSION_DISPLAY = APP.versionDisplay;

export const RETRY_DELAYS = [2500, 3000, 6000, 12000, 20000];

export const DPI_TIMEOUTS = {
  "0": 3000,
  "1": 5000,
  "2": 8000,
};

export const NETWORK_MODES = ["smooth", "game", "super"];

export const NETWORK_MODE_DEFAULT = "smooth";

// feat(dns): add Cloudflare Warp DNS resolver support

// fix(security): patch XSS vulnerability in PAC server response

// chore(deps): update Tauri to v2.10.1

// feat(firewall): add automatic firewall rule cleanup on exit

// refactor(hooks): extract useProxy hook logic into pure functions

// feat(notifications): add Windows toast notifications for connection events

// feat(isp): add Kablonet ISP profile with custom bypass rules

// feat(dns): add Quad9 DNS server option

// test(rust): add mock tests for ISP detection

// feat(isp): add Vodafone Turkey ISP profile

// feat(game): add Battle.net launcher bypass

// feat(dns): add AdGuard DNS server option

// feat(game): add Ubisoft Connect bypass rules

// ui(mobile): add swipe gestures for navigation

// chore(ci): add multi-architecture build support

// fix(tray): fix tray menu not appearing on some Windows versions

// test(rust): add property-based tests for PAC generation

// ui(accessibility): add ARIA labels for screen readers

// fix(proxy): handle proxy authentication requirements

// docs(api): add interactive API documentation

// feat(security): add certificate pinning for HTTPS connections

// Commit: feat: implement constants.js with DNS and URL configs [132227]

// feat: add constants.js with DNS configs [132605]
