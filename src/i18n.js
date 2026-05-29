const translations = {
  en: {
    appName: 'DOCSPI',
    statusActive: 'ACTIVE',
    statusInactive: 'OFF',
    statusReady: 'READY',

    statusConnected: 'SECURE',
    statusConnecting: 'CONNECTING...',
    statusDisconnecting: 'DISCONNECTING...',
    statusReady2: 'READY',
    descConnected: 'Your connection is encrypted and protected.',
    descConnecting: 'Processing, please wait.',
    descReady: 'Connect for DPI Bypass.',

    btnConnect: 'CONNECT',
    btnDisconnect: 'DISCONNECT',
    btnConnecting: 'CONNECTING...',
    btnApplyingSettings: 'APPLYING SETTINGS...',
    btnDisconnecting: 'DISCONNECTING...',
    btnConnectDevices: 'Connect Other Devices',

    navSettings: 'SETTINGS',
    navLogs: 'LOGS',
    navExit: 'EXIT',

    logsTitle: 'SYSTEM LOGS',
    logsClear: 'CLEAR',
    logsCopy: 'COPY',
    logsCopied: 'COPIED!',
    logsCopyError: 'ERROR!',

    modalTitle: 'Connect Device',
    modalSubtitle: 'LAN Sharing',
    modalDesc: 'Go to your device\'s Wi-Fi settings, set <strong>Proxy</strong> to <strong>Manual</strong> and enter the details below.',
    modalDescPac: 'Using <strong>Automatic (PAC)</strong> on other devices is recommended.',
    modalPacQrHint: 'Scan the QR, copy the address and paste it into your device\'s <strong>Wi-Fi → Proxy → Automatic URL</strong> settings.<br><br><span class="text-red-500 font-semibold">IMPORTANT:</span> If you experience network issues after disconnecting, turn your device\'s Wi-Fi off and on again.',
    modalPacUrl: 'PAC URL (Recommended)',
    modalManualFallback: 'Alternative: Manual proxy',
    modalTabPac: 'Automatic (PAC)',
    modalTabManual: 'Manual',
    modalPacStep1Title: '1. Open Setup Guide',
    modalPacStep1Desc: 'Scan the QR code with your camera to open the step-by-step guide.',
    modalPacStep2Title: '2. Copy PAC Address',
    modalPacStep2Desc: 'Paste this code into the "Automatic URL" field shown in the guide:',
    modalPacWarningTitle: 'ATTENTION:',
    modalPacWarningDesc: 'If apps like YouTube lose internet access after closing DocsPI (due to cached connections), simply toggle your device\'s Wi-Fi off and on.',
    modalManualWarningTitle: 'ATTENTION:',
    modalManualWarningDesc: 'When DocsPI is closed, your device will completely lose internet access. To restore connection, you must remove the Proxy setting from your Wi-Fi settings.',
    modalPacQrCaption: 'QR → Setup page (scan and copy)',
    modalHost: 'Server (Host)',
    modalPort: 'Port',
    modalTutorial: 'How To? (Guide)',

    adminTitle: 'Administrator Required',
    adminDesc: 'DocsPI needs to run as administrator to work correctly.',
    adminStep: 'Right-click the app → Select <strong>"Run as administrator"</strong>',
    adminClose: 'CLOSE',
    adminHowItWorks: 'How it Works?',

    noInternetTitle: 'No Internet Connection',
    noInternetDesc: 'Please check your internet connection.',
    noInternetRetry: 'Retry',

    logEngineStarting: (port) => `DocsPI Engine starting (Port: ${port})...`,
    logDnsUsed: (name, ip) => `DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: System Default',
    logConnected: 'Connection successful! Traffic is encrypted.',
    logDisconnected: 'Disconnected.',
    logProxySet: (port) => `System Proxy set: 127.0.0.1:${port}`,
    logProxyCleared: 'System Proxy Cleared',
    logEngineStopped: (code) => `DocsPI engine stopped unexpectedly (Code: ${code})`,
    logEngineStartError: (err) => `Engine failed to start: ${err}`,
    logAutoReconnect: 'Auto-reconnect enabled...',
    logReconnecting: (n) => `Reconnecting... (Attempt ${n}/5)`,
    logReconnectWait: (sec, n) => `Retrying in ${sec} seconds... (Attempt ${n}/5)`,
    logReconnectNow: 'Reconnecting...',
    logMaxRetries: 'Connection failed. Maximum attempts reached.',
    logPossibleReasons: 'Possible reasons:',
    logReasonInternet: 'Your internet may be disconnected',
    logReasonFirewall: 'Firewall/Antivirus may be blocking DocsPI',
    logReasonPorts: 'Ports 8080-8084 may be in use',
    logSolutions: 'Suggested solutions:',
    logSolInternet: 'Check your internet connection',
    logSolFirewall: 'Check your firewall settings',
    logSolAdmin: 'Run the application as administrator',
    logSolLogs: 'Copy and share logs for support',
    logLanRestart: 'LAN sharing changed, restarting connection...',
    logDpiRestart: 'DPI mode changed, restarting connection...',
    logEngineStoppedGrace: 'DocsPI engine stopped.',
    logServiceStopped: 'Service stopped.',
    logShutdownStarting: 'Shutdown started...',
    logProcessStopped: 'Process stopped.',
    logSpoofReady: (port) => `SpoofDPI engine started (Port: ${port})`,
    logPacStarted: 'PAC server started (for LAN devices)',
    logPacStartError: (err) => `PAC server failed to start: ${err}`,
    logEngineActive: 'DocsPI engine active',
    logPortBusy: (port) => `Port ${port} is busy, trying another one...`,
    logInitializing: 'Engine is initializing...',
    logPortRetryOpen: (port) => `Port ${port} could not be opened, retrying...`,
    logProxyClearError: (err) => `Failed to clear proxy: ${err}`,
    logProxySetError: (err) => `Failed to set proxy: ${err}`,
    logServiceStopError: (err) => `Failed to stop service: ${err}`,

    logStartingVpn: 'Starting VPN...',
    logVpnConnected: 'VPN connection active.',
    logVpnStopped: 'VPN stopped.',
    logVpnStartError: (err) => `VPN start failed: ${err}`,

    logConfigError: (err) => `Configuration error: ${err}`,
    logAdminMissing: 'Admin permission missing! App may not work correctly.',
    logInternetBack: 'Internet connection restored.',
    logInternetLost: 'Internet connection lost!',
    logPortRetry: (count) => `Port conflict, trying new port... (${count}/20)`,
    logNoPort: 'No available port found.',
    logWinHttpEnabled: 'Game Mode (WinHTTP) proxy tunnel applied.',
    sectionMethod: 'CONNECTION METHOD',
    sectionMethodWhy: 'One setting for all ISPs. Use on all devices via LAN. Proxy-based so no ping/jitter in games.',
    methodStrong: 'Strong Mode',
    methodStrongDesc: 'Strongest bypass for tough ISPs (adds latency)',
    methodTurbo: 'Turbo Mode',
    methodTurboDesc: 'Lowest latency, for light DPI',
    methodBalanced: 'Balanced Mode (Recommended)',
    methodBalancedDesc: 'Fast + strong bypass, works on most ISPs',
    chunkSizeLabel: 'Chunk size',
    chunkSizeDesc: 'Controls how many pieces HTTPS traffic is split into. Depending on your ISP, 4 or 16 may be faster; 8 is usually balanced (default). Try and pick what works best.',
    chunkSize4: '4 — Strongest (some ISPs)',
    chunkSize8: '8 — Balanced (default)',
    chunkSize16: '16 — Faster (some ISPs)',
    lanSharing: 'LAN Sharing',
    lanSharingDesc: 'Allow connections from other devices (Phone, Console)',
    sectionAutomation: 'AUTOMATION',
    autoConnect: 'Auto Connect',
    autoConnectDesc: 'Connect as soon as the app opens',
    autoReconnect: 'Auto Reconnect',
    autoReconnectDesc: 'Automatically retry if connection drops',
    autoStart: 'Start at Boot',
    autoStartDesc: 'Launch DocsPI when Windows starts',
    minimizeToTray: 'Minimize to Tray',
    minimizeToTrayDesc: 'Run in background when closed',
    alwaysOnTop: 'Always on Top',
    alwaysOnTopDesc: 'Window stays above all other windows',
    requireConfirmation: 'Action Confirmation',
    requireConfirmationDesc: 'Ask before disconnecting or exiting',
    language: 'LANGUAGE',
    languageDesc: 'Change interface language',
    sectionNotifications: 'NOTIFICATIONS',
    notifications: 'Desktop Notifications',
    notificationsDesc: 'Master notification switch (Enable/Disable All)',
    notifyOnConnect: 'On Connection Established',
    notifyOnConnectDesc: 'Notify when connection is successfully secured',
    notifyOnDisconnect: 'On Connection Dropped',
    notifyOnDisconnectDesc: 'Notify on unexpected drops or repairs',
    notifDisconnectManual: 'Connection successfully terminated.',
    dnsAutoSelect: 'Auto Select (Recommended)',
    dnsAutoSelectDesc: 'Automatically finds the fastest server',
    dnsSystemDefault: 'System Default',
    dnsSystemDefaultDesc: 'SpoofDPI Default DNS',
    dnsCfDesc: 'Fast & Private',
    dnsAdguardDesc: 'Ad Blocker',
    dnsGoogleDesc: 'Reliable',
    dnsQuad9Desc: 'Security Focused',
    dnsOpenDnsDesc: 'Powered by Cisco',
    dnsCheckSpeed: 'DNS Ping Test',
    dnsChecking: 'Measuring...',
    driverStatusInstalled: 'Advanced Filtering Active',
    driverStatusMissing: 'Unlock advanced features if bypass fails',
    driverInstallBtn: 'INSTALL DRIVER (RECOMMENDED)',
    driverIspWarning: 'If you have connection issues, you can unlock much more advanced DPI bypass features by installing the driver.',
    issOverlayTitle: 'Select Your Internet Provider',
    issOverlayDesc: 'Let us auto-apply the best settings for your ISP.',
    issOverlayApply: 'APPLY & CONNECT',
    issOverlaySkip: 'Skip',
    issProfileActive: 'Profile Active',
    issProfileSee: 'See recommended settings',
    issApplyBtn: 'Auto Apply Settings',
    issAppliedMsg: 'This setting is currently in use',
    issGuideTitle: 'ISP GUIDE',
    issLightName: 'TurkNet',
    issLightDesc: 'Light filtering. Turbo Mode ensures no ping increase or speed loss in games.',
    issMidName: 'Only Some ISS',
    issMidDesc: 'Standard blocking. Strong Mode splits packets for reliable access.',
    issHeavyName: 'Turkish Providers (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Tough and smart DPI devices are used. May require Strong Mode to bypass.',
    issChinaName: 'China (Great Firewall)',
    issChinaDesc: 'Overcoming the world\'s most advanced DPI system may require Strong Mode and custom SNI settings.',
    issRussiaName: 'Russia (Roskomnadzor)',
    issRussiaDesc: 'Strong Mode is recommended for complex blocks.',
    issIndiaName: 'India',
    issIndiaDesc: 'Balanced Mode is sufficient for standard blocks.',
    issUsaName: 'USA / Global',
    issUsaDesc: 'Turbo Mode is recommended for light restrictions.',
    issGlobalName: 'Global / Other',
    issGlobalDesc: 'General bypass settings for all countries.',
    issOtherName: 'Other / Unknown',
    issOtherDesc: 'Starts with Strong Mode. Works reliably with most providers, switch to Turbo if needed.',
    sectionBypass: 'BYPASS SETTINGS',
    modeTurboName: 'Turbo Mode',
    modeTurboDesc: 'Lowest latency. Bypasses light filters instantly.',
    modeBalancedName: 'Balanced Mode',
    modeBalancedDesc: 'Fast and stable. Bypasses standard filters.',
    modeStrongName: 'Strong Mode',
    modeStrongDesc: 'Bypasses tough DPI with fake packets.',
    sectionExtraNetwork: 'EXTRA NETWORK SETTINGS',
    ipv4ForceTitle: 'Force IPv4 (Recommended)',
    ipv4ForceDesc: 'Prevents infinite loading and timeout errors.',
    networkModeLabel: 'Network Mode',
    modeSmooth: 'Smooth Mode',
    modeSmoothDesc: 'Lowest latency. Ideal for browsers and Discord.',
    modeGame: 'Game Mode',
    modeGameDesc: 'Roblox, UDP games and all apps. Kernel-level bypass.',
    modeSuper: 'Super Mode',
    modeSuperDesc: 'Hybrid: Smooth + Game combined. Best balance.',
    modeRequiresNpcap: 'Npcap driver required',
    modeBadgeSmooth: 'Smooth',
    modeBadgeGame: 'Game',
    modeBadgeSuper: 'Super',
    sectionAdvancedNpcap: 'ADVANCED SETTINGS',
    advancedNpcapDesc: 'ISPs with heavy DPI measures (Kablonet, Superonline etc.) require advanced packet manipulation.',
    advancedNpcapInstalled: 'Npcap Installed — Advanced features active',
    advancedNpcapMissing: 'Npcap not installed — Strong mode limited',
    advancedNpcapInstallBtn: 'INSTALL NPCAP DRIVER',
    advancedNpcapWhy: 'Npcap provides low-level access to network packets. This enables advanced DPI bypass techniques like fake packet injection.',
    advancedFeaturesToggle: 'Advanced Bypass',
    advancedFeaturesToggleDesc: 'Enables fake packet injection and advanced DPI bypass techniques.',
    npcapRestartWarning: 'You need to restart your computer for Npcap to work.',
    advancedNpcapHint: 'Install Npcap driver for stronger bypass',
    sectionTroubleshoot: 'TROUBLESHOOTING',
    fixInternet: 'Fix Internet Connection',
    fixInternetDesc: 'Fixes internet if proxy gets stuck.',
    fixRepairing: 'Repairing...',
    fixRepairingDesc: 'Resetting system settings, please wait.',
    fixDone: 'Repaired!',
    fixDoneDesc: 'Proxy settings cleared, internet restored.',
    fixError: 'Error Occurred!',
    fixErrorDesc: 'Something went wrong during the process.',
    sectionDev: 'DEVELOPER',
    devRole: 'DocsPI Developer',

    devTitle: 'Developer',
    devDiscord: 'Discord',
    devSubscribe: 'Discord',
    devSupport: 'Github',
  },
};

export const getTranslations = (lang = 'en') => {
  const t = translations[lang] || translations.en;
  return new Proxy(t, {
    get(target, key) {
      if (!(key in target)) {
        console.warn(`[i18n] Missing key "${String(key)}" for "${lang}" — falling back to en`);
        return translations.en[key];
      }
      return target[key];
    }
  });
};

export const getLanguageMeta = (lang) => {
  const langDef = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  return { rtl: langDef ? langDef.dir === 'rtl' : false };
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: 'GB', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: 'TR', dir: 'ltr' },
  { code: 'zh', name: '简体中文', flag: 'CN', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', flag: 'IN', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: 'ES', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: 'FR', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: 'SA', dir: 'rtl' },
  { code: 'pt', name: 'Português', flag: 'BR', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: 'RU', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: 'JP', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: 'DE', dir: 'ltr' },
  { code: 'it', name: 'Italiano', flag: 'IT', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: 'KR', dir: 'ltr' },

  { code: 'az', name: 'Azərbaycan', flag: 'AZ', dir: 'ltr' },

];
export default translations;

















