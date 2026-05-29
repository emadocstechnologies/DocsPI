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
    logConfigError: (err) => `Configuration error: ${err}`,
    logAdminMissing: 'Admin permission missing! App may not work correctly.',
    logInternetBack: 'Internet connection restored.',
    logInternetLost: 'Internet connection lost!',
    logPortRetry: (count) => `Port conflict, trying new port... (${count}/20)`,
    logNoPort: 'No available port found.',
    logWinHttpEnabled: 'Game Mode (WinHTTP) proxy tunnel applied.',
    logWpcapMissing: 'SpoofDPI could not find wpcap.dll. Please install Npcap or WinPcap, then restart the application.',
    logAntivirusWarning: 'Windows Defender or your antivirus software may have blocked \'docspi-proxy.exe\'. Please add the file to your antivirus exclusion list.',
    logFailsafePortClosed: 'Port timed out, retrying connection...',

    settingsTitle: 'SETTINGS',

    sectionMethod: 'CONNECTION METHOD',
    sectionMethodWhy: 'One setting for all ISPs. Use on all devices via LAN. Proxy-based so no ping/jitter in games.',
    methodStrong: 'Strong Mode',
    methodStrongDesc: 'Strongest bypass for tough ISPs (adds latency)',
    methodTurbo: 'Turbo Mode',
    methodTurboDesc: 'Lowest latency, for light DPI',
    methodBalanced: 'Balanced Mode (Recommended)',
    methodBalancedDesc: 'Fast + strong bypass, works on most ISPs',

    sectionAdvanced: 'ADVANCED',
    chunkSizeLabel: 'Chunk size',
    chunkSizeDesc: 'Controls how many pieces HTTPS traffic is split into. Depending on your ISP, 4 or 16 may be faster; 8 is usually balanced (default). Try and pick what works best.',
    chunkSize4: '4 — Strongest (some ISPs)',
    chunkSize8: '8 — Balanced (default)',
    chunkSize16: '16 — Faster (some ISPs)',

    sectionNetwork: 'NETWORK',
    lanSharing: 'LAN Sharing',
    lanSharingDesc: 'Allow connections from other devices (Phone, Console)',

    sectionAutomation: 'AUTOMATION',
    autoConnect: 'Auto Connect',
    autoConnectDesc: 'Connect as soon as the app opens',
    autoReconnect: 'Auto Reconnect',
    autoReconnectDesc: 'Automatically retry if connection drops',

    sectionGeneral: 'GENERAL',
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

    sectionDns: 'DNS LIST',
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

    // ISS Overlay (First Run)
    issOverlayTitle: 'Select Your Internet Provider',
    issOverlayDesc: 'Let us auto-apply the best settings for your ISP.',
    issOverlayApply: 'APPLY & CONNECT',
    issOverlaySkip: 'Skip',
    issProfileActive: 'Profile Active',
    issProfileSee: 'See recommended settings',
    issApplyBtn: 'Auto Apply Settings',
    issAppliedMsg: 'This setting is currently in use',

    // ISS Guide (Settings)
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

    // Bypass Settings
    sectionBypass: 'BYPASS SETTINGS',
    modeTurboName: 'Turbo Mode',
    modeTurboDesc: 'Lowest latency. Bypasses light filters instantly.',
    modeBalancedName: 'Balanced Mode',
    modeBalancedDesc: 'Fast and stable. Bypasses standard filters.',
    modeStrongName: 'Strong Mode',
    modeStrongDesc: 'Bypasses tough DPI with fake packets.',

    // Extra Network
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

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'ADVANCED SETTINGS',
    advancedNpcapDesc: 'ISPs with heavy DPI measures (Kablonet, Superonline etc.) require advanced packet manipulation.',
    advancedNpcapInstalled: 'Npcap Installed — Advanced features active',
    advancedNpcapMissing: 'Npcap not installed — Strong mode limited',
    advancedNpcapInstallBtn: 'INSTALL NPCAP DRIVER',
    advancedNpcapWhy: 'Npcap provides low-level access to network packets. This enables advanced DPI bypass techniques like fake packet injection.',
    advancedFeaturesToggle: 'Advanced Bypass',
    advancedFeaturesToggleDesc: 'Enables fake packet injection and advanced DPI bypass techniques.',
    npcapRestartWarning: 'You need to restart your computer for Npcap to work.',
    logStrongFake: 'Strong Mode: Fake Packet (3) active.',
    logStrongNoDriver: 'Strong Mode: No driver, Chunk-1 only.',
    logStrongChunkOnly: 'Strong Mode: Chunk-1 active.',
    logNpcapFallback: 'Npcap driver not responding. Disabling advanced bypass and retrying...',
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
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'IMPORTANT',
    noticeTitle: 'Security & False Positives',
    noticeDesc: 'The DocsPI engine may sometimes be flagged as a "false positive" by AI-based systems like Windows Defender. This is completely harmless. Also, antivirus software like Kaspersky or ESET may block connections with their HTTPS scanning. If you experience issues, check those settings.',

    // Dialogs
    confirmExitTitle: 'Exit',
    confirmExitDesc: 'Are you sure you want to stop the DocsPI engine and exit?',
    confirmDisconnectTitle: 'Disconnect',
    confirmDisconnectDesc: 'Are you sure you want to terminate your secure connection?',

    // Settings Tabs
    tabGeneral: 'GENERAL',
    tabNetwork: 'NETWORK',
    tabNotification: 'ALERTS',
    tabSystem: 'SYSTEM',

    // ISP Detection
    ispDetected: (name) => `${name} detected`,
    ispSuggestion: (profile) => `${profile} mode recommended`,
    ispAutoSelected: 'Your ISP was auto-selected',

    // Connection Statistics
    statsUptime: 'Uptime',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `New version available: v${ver}`,
    updateDownload: 'Download',
    updateDismiss: 'Later',

    // Custom Domain List
    sectionDomains: 'CUSTOM DOMAIN LIST',
    sectionDomainsDesc: 'These domains bypass the proxy (DIRECT connection).',
    domainAdd: 'Add',
    domainRemove: 'Remove',
    domainPlaceholder: 'e.g. *.example.com or site.com',
    domainEmpty: 'No domains added yet.',

    // Profile Saving
    sectionProfiles: 'SETTINGS PROFILES',
    sectionProfilesDesc: 'Save your current settings and load them in one click.',
    profileSave: 'Save Current Settings',
    profileSaveShort: 'Save',
    profileLoad: 'Load',
    profileDelete: 'Delete',
    profileName: 'Enter profile name...',
    profileSaved: 'Profile saved!',
    profileLoaded: 'Profile loaded!',
    profileEmpty: 'No profiles saved yet.',

    themeLabel: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeDarkDesc: 'Dark theme active',
    themeLightDesc: 'Light theme active',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Running bypass test...',
    bypassTestSuccess: 'Bypass active! Connection successful.',
    bypassTestSuccessShort: 'Active',
    bypassTestFailed: 'Bypass not working. Connection failed.',
    bypassTestFailedShort: 'Failed',
    bypassTestTimeout: 'Bypass test timed out.',

    autoEscalateLabel: 'Auto Mode Escalation',
    autoEscalateDesc: 'Switch to stronger mode if connection fails',
    logAutoEscalate: (mode) => `Connection failed, switching to ${mode} mode...`,

    statsTitle: 'Connection Statistics',
    statsTotalSessions: 'Total Sessions',
    statsTotalUptime: 'Total Uptime',
    statsMostUsedMode: 'Most Used Mode',
    statsAvgPing: 'Average Ping',
    statsReset: 'Reset Statistics',
    statsEmpty: 'No recorded sessions yet',

    welcomeTitle: 'Welcome to DocsPI',
    welcomeDesc: 'You are about to take your first step towards a free and secure internet. We have a few short steps to set the best settings for you.',
    welcomeNext: 'Let\'s Get Started',
    logTrayModeChanged: (mode) => `Mode changed from tray: ${mode}`,
    logDirtyShutdownRecovery: 'Previous shutdown was unexpected. Recovering...',
    btnNo: 'No',
    btnYes: 'Yes',
    fakeSniLabel: 'Fake SNI',
    logFilterAll: 'All',
    logFilterError: 'Errors',
    logFilterWarn: 'Warnings',
    logFilterSuccess: 'Success',
    logFilterInfo: 'Info',
    welcomePrivacy: 'Your privacy is important to us. Your data is never recorded.',
  },

  tr: {
    appName: 'DOCSPI',
    statusActive: 'AKTİF',
    statusInactive: 'KAPALI',
    statusReady: 'HAZIR',

    statusConnected: 'GÜVENLİ',
    statusConnecting: 'BAĞLANIYOR...',
    statusDisconnecting: 'KESİLİYOR...',
    statusReady2: 'HAZIR',
    descConnected: 'Bağlantınız şifrelendi ve korunuyor.',
    descConnecting: 'İşlem yapılıyor, lütfen bekleyin.',
    descReady: 'DPI Bypass için bağlanın.',

    btnConnect: 'BAĞLAN',
    btnDisconnect: 'BAĞLANTIYI KES',
    btnConnecting: 'BAĞLANIYOR...',
    btnApplyingSettings: 'AYAR UYGULANIYOR...',
    btnDisconnecting: 'KESİLİYOR...',
    btnConnectDevices: 'Diğer Cihazları Bağla',

    navSettings: 'AYARLAR',
    navLogs: 'LOGLAR',
    navExit: 'ÇIKIŞ',

    logsTitle: 'SİSTEM LOGLARI',
    logsClear: 'TEMİZLE',
    logsCopy: 'KOPYALA',
    logsCopied: 'KOPYALANDI!',
    logsCopyError: 'HATA!',

    modalTitle: 'Cihaz Bağlama',
    modalSubtitle: 'LAN Paylaşımı',
    modalDesc: 'Cihazınızın Wi-Fi ayarlarında <strong>Proxy</strong> kısmını <strong>Manuel</strong> yapın ve bilgileri girin.',
    modalDescPac: 'Diğer cihazlarda <strong>Otomatik (PAC)</strong> kullanımı önerilir.',
    modalPacQrHint: 'QR\'ı tarayıp adresi kopyalayın ve telefonunuzun <strong>Wi-Fi → Proxy → Otomatik URL</strong> kısmına yapıştırın.<br><br><span class="text-red-500 font-semibold">ÖNEMLİ:</span> Bağlantıyı sonlandırdıktan sonra internet sorunu yaşarsanız, Wi-Fi bağlantınızı kapatıp açın.',
    modalPacUrl: 'PAC Adresi (Önerilen)',
    modalManualFallback: 'Alternatif: Manuel proxy',
    modalTabPac: 'Otomatik (PAC)',
    modalTabManual: 'Manuel',
    modalPacStep1Title: '1. Kurulum Rehberini Açın',
    modalPacStep1Desc: 'Kameranızla QR kodu okutarak adım adım anlatım sayfasına gidin.',
    modalPacStep2Title: '2. PAC Adresini Kopyalayın',
    modalPacStep2Desc: 'Rehberde gösterilen "Otomatik URL" alanına bu kodu yapıştırın:',
    modalPacWarningTitle: 'DİKKAT:',
    modalPacWarningDesc: 'DocsPI kapatıldıktan sonra YouTube vb. uygulamalarda internet sorunu yaşarsanız (eski önbellek nedeniyle), Wi-Fi bağlantısını kapatıp açmanız yeterlidir.',
    modalManualWarningTitle: 'DİKKAT:',
    modalManualWarningDesc: 'DocsPI kapatıldığında internet bağlantısı tamamen kesilir. İnternete tekrar girmek için cihazınızın Wi-Fi ayarlarından Proxy\'i eski haline (Yok) getirmelisiniz.',
    modalPacQrCaption: 'QR → Kurulum sayfası (tara ve kopyala)',
    modalHost: 'Sunucu (Host)',
    modalPort: 'Port',
    modalTutorial: 'Nasıl Yapılır? (Rehber)',

    adminTitle: 'Yönetici İzni Gerekli',
    adminDesc: 'DocsPI\'ın düzgün çalışması için yönetici olarak çalıştırılması gereklidir.',
    adminStep: 'Uygulamaya sağ tıklayın → <strong>"Yönetici olarak çalıştır"</strong> seçin',
    adminClose: 'KAPAT',
    adminHowItWorks: 'Nasıl Çalışır?',

    noInternetTitle: 'İnternet Bağlantısı Yok',
    noInternetDesc: 'Lütfen internet bağlantınızı kontrol edin.',
    noInternetRetry: 'Tekrar Dene',

    logEngineStarting: (port) => `DocsPI Motoru başlatılıyor (Port: ${port})...`,
    logDnsUsed: (name, ip) => `Kullanılan DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: Sistem Varsayılanı',
    logConnected: 'Bağlantı başarılı! Trafik şifreleniyor.',
    logDisconnected: 'Bağlantı kesildi.',
    logProxySet: (port) => `Sistem Proxy ayarlandı: 127.0.0.1:${port}`,
    logProxyCleared: 'Sistem Proxy Temizlendi',
    logEngineStopped: (code) => `DocsPI motoru beklenmedik şekilde durduruldu (Kod: ${code})`,
    logEngineStartError: (err) => `Motor başlatılamadı: ${err}`,
    logAutoReconnect: 'Otomatik yeniden bağlanma aktif...',
    logReconnecting: (n) => `Yeniden bağlanılıyor... (Deneme ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec} saniye sonra yeniden denenecek... (Deneme ${n}/5)`,
    logReconnectNow: 'Yeniden bağlanılıyor...',
    logMaxRetries: 'Bağlantı kurulamadı. Maksimum deneme sayısına ulaşıldı.',
    logPossibleReasons: 'Olası sebepler:',
    logReasonInternet: 'İnternet bağlantınız kesilmiş olabilir',
    logReasonFirewall: 'Firewall/Antivirüs DocsPI\'ı engelliyor olabilir',
    logReasonPorts: '8080-8084 portları sistem tarafından kullanılıyor',
    logSolutions: 'Çözüm önerileri:',
    logSolInternet: 'İnternet bağlantınızı kontrol edin',
    logSolFirewall: 'Firewall ayarlarınızı kontrol edin',
    logSolAdmin: 'Uygulamayı yönetici olarak çalıştırın',
    logSolLogs: 'Logları kopyalayıp destek için paylaşabilirsiniz',
    logLanRestart: 'Yerel ağ paylaşımı değişti, bağlantı yeniden başlatılıyor...',
    logDpiRestart: 'DPI modu değişti, bağlantı yeniden başlatılıyor...',
    logEngineStoppedGrace: 'DocsPI motoru kapatıldı.',
    logServiceStopped: 'Servis durduruldu.',
    logShutdownStarting: 'Kapatma başlatılıyor...',
    logProcessStopped: 'İşlem sonlandırıldı.',
    logSpoofReady: (port) => `SpoofDPI Motoru başlatıldı (Port: ${port})`,
    logPacStarted: 'PAC sunucusu başlatıldı (Yerel ağ cihazları için)',
    logPacStartError: (err) => `PAC sunucusu başlatılamadı: ${err}`,
    logEngineActive: 'DocsPI motoru aktif',
    logPortBusy: (port) => `Port ${port} dolu, başka port deneniyor...`,
    logInitializing: 'Motor başlatılıyor...',
    logPortRetryOpen: (port) => `Port ${port} açılamadı, yeniden deneniyor...`,
    logProxyClearError: (err) => `Proxy temizleme hatası: ${err}`,
    logProxySetError: (err) => `Proxy ayarlanamadı: ${err}`,
    logServiceStopError: (err) => `Servis durdurma hatası: ${err}`,
    logConfigError: (err) => `Yapılandırma hatası: ${err}`,
    logAdminMissing: 'Yönetici izni eksik! Uygulama düzgün çalışmayabilir.',
    logInternetBack: 'İnternet bağlantısı tekrar sağlandı.',
    logInternetLost: 'İnternet bağlantısı kesildi!',
    logPortRetry: (count) => `Port çakışması, yeni port deneniyor... (${count}/20)`,
    logNoPort: 'Uygun port bulunamadı.',
    logWinHttpEnabled: 'Oyun Modu (WinHTTP) proxy tüneli uygulandı.',
    logWpcapMissing: 'SpoofDPI, wpcap.dll kütüphanesini bulamadı. Lütfen Npcap veya WinPcap kurun ve ardından uygulamayı yeniden başlatın.',
    logAntivirusWarning: 'Windows Defender veya antivirüs yazılımınız \'docspi-proxy.exe\' dosyasını engellemiş olabilir. Lütfen dosyayı antivirüs dışlama listesine (exclusion) ekleyin.',
    logFailsafePortClosed: 'Port zaman aşımına uğradı, bağlantı yeniden deneniyor...',

    settingsTitle: 'AYARLAR',

    sectionMethod: 'BAĞLANTI YÖNTEMİ',
    sectionMethodWhy: 'Tek ayar, tüm ISS\'ler. LAN ile tüm cihazlarda kullanın. Proxy tabanlı olduğu için oyunlarda ping/jitter yapmaz.',
    methodStrong: 'Güçlü Mod',
    methodStrongDesc: 'En güçlü bypass, zor ISP\'ler için (latency ekler)',
    methodTurbo: 'Turbo Mod',
    methodTurboDesc: 'En düşük gecikme, hafif DPI için',
    methodBalanced: 'Dengeli Mod (Önerilen)',
    methodBalancedDesc: 'Hızlı + güçlü bypass, çoğu ISP\'de çalışır',

    sectionAdvanced: 'GELİŞMİŞ',
    chunkSizeLabel: 'Parça boyutu (chunk size)',
    chunkSizeDesc: 'HTTPS trafiğini kaç parçaya böleceğini belirler. ISS\'e göre 4 veya 16 daha hızlı olabilir; 8 çoğu zaman dengeli (varsayılan). Deneyerek en iyisini seçebilirsiniz.',
    chunkSize4: '4 — En güçlü (bazı ISS\'ler)',
    chunkSize8: '8 — Dengeli (varsayılan)',
    chunkSize16: '16 — Daha hızlı (bazı ISS\'ler)',

    sectionNetwork: 'AĞ AYARLARI',
    lanSharing: 'Yerel Ağ Paylaşımı',
    lanSharingDesc: 'Diğer cihazlardan (Tel, Konsol) bağlanmaya izin ver',

    sectionAutomation: 'OTOMASYON',
    autoConnect: 'Otomatik Bağlan',
    autoConnectDesc: 'Uygulama açılır açılmaz bağlan',
    autoReconnect: 'Otomatik Yeniden Bağlan',
    autoReconnectDesc: 'Bağlantı koparsa otomatik yeniden dene',

    sectionGeneral: 'GENEL',
    autoStart: 'Başlangıçta Çalıştır',
    autoStartDesc: 'Windows açılınca DocsPI\'ı başlat',
    minimizeToTray: 'Tepsiye Küçült',
    minimizeToTrayDesc: 'Kapatıldığında arka planda çalışsın',
    alwaysOnTop: 'Her Şeyin Üzerinde Tut',
    alwaysOnTopDesc: 'Pencere her zaman diğer pencerelerin üzerinde kalır',
    requireConfirmation: 'İşlem Onayı',
    requireConfirmationDesc: 'Bağlantıyı keserken veya çıkarken sor',
    language: 'UYGULAMA DILI',
    languageDesc: 'Arayüz dilini değiştirin',

    sectionNotifications: 'BİLDİRİMLER',
    notifications: 'Masaüstü Bildirimleri',
    notificationsDesc: 'Ana bildirim anahtarı (Tümünü Aç/Kapat)',
    notifyOnConnect: 'Bağlantı Kurulduğunda',
    notifyOnConnectDesc: 'Bağlantı başarıyla sağlandığında bildir',
    notifyOnDisconnect: 'Bağlantı Koptuğunda',
    notifyOnDisconnectDesc: 'Beklenmedik kopmalarda bildir',
    notifDisconnectManual: 'Bağlantı başarıyla sonlandırıldı.',

    sectionDns: 'DNS LİSTESİ',
    dnsAutoSelect: 'Otomatik Seçim (Önerilen)',
    dnsAutoSelectDesc: 'En hızlı sunucuyu otomatik bulur',
    dnsSystemDefault: 'Sistem Varsayılanı',
    dnsSystemDefaultDesc: 'SpoofDPI Varsayılan DNS',
    dnsCfDesc: 'Hızlı ve Gizli',
    dnsAdguardDesc: 'Reklam Engelleyici',
    dnsGoogleDesc: 'Güvenilir',
    dnsQuad9Desc: 'Güvenlik Odaklı',
    dnsOpenDnsDesc: 'Cisco Güvencesi',
    dnsCheckSpeed: 'DNS Ping Test',
    dnsChecking: 'Ölçülüyor...',

    driverStatusInstalled: 'Gelişmiş Filtreleme Aktif',
    driverStatusMissing: 'Bypass çalışmazsa gelişmiş özellikleri açın',
    driverInstallBtn: 'SÜRÜCÜYÜ KUR (ÖNERİLEN)',
    driverIspWarning: 'Eğer bağlantı sorunu yaşıyorsanız, sürücü yükleyerek çok daha gelişmiş DPI aşma özelliklerini açabilirsiniz.',

    // ISS Overlay (İlk Giriş)
    issOverlayTitle: 'İnternet Sağlayıcınızı Seçin',
    issOverlayDesc: 'En iyi performans için sağlayıcınıza özel ayarları otomatik uygulayalım.',
    issOverlayApply: 'UYGULA VE BAĞLAN',
    issOverlaySkip: 'Atla',
    issProfileActive: 'Profil Aktif',
    issProfileSee: 'Tavsiye edilen ayarı gör',
    issApplyBtn: 'Ayarları Otomatik Uygula',
    issAppliedMsg: 'Bu ayar şu an kullanılıyor',

    // ISS Rehberi (Settings)
    issGuideTitle: 'İNTERNET SAĞLAYICI REHBERİ',
    issLightName: 'TurkNet',
    issLightDesc: 'Hafif filtreleme yaparlar. Turbo Mod sayesinde oyunlarda ping artışı veya hız kaybı yaşamazsız.',
    issMidName: 'Sadece Bazı ISSler',
    issMidDesc: 'Standart engellemeler yaparlar. Güçlü Mod ile paketleri bölerek sorunsuz erişim sağlar.',
    issHeavyName: 'Türk Telekom / Vodafone / Kablonet / Superonline / Milenicom',
    issHeavyDesc: 'Zorlu ve akıllı DPI cihazları kullanırlar. Sisteme sahte paketler göndererek kandıran Güçlü Mod gerektirebilir.',
    issChinaName: 'Çin (Great Firewall)',
    issChinaDesc: 'Dünyanın en gelişmiş DPI sistemini aşmak için Güçlü Mod ve özel SNI ayarları gerekebilir.',
    issRussiaName: 'Rusya (Roskomnadzor)',
    issRussiaDesc: 'Karmaşık engellemeler için Güçlü Mod önerilir.',
    issIndiaName: 'Hindistan',
    issIndiaDesc: 'Standart engellemeler için Dengeli Mod yeterlidir.',
    issUsaName: 'ABD / Global',
    issUsaDesc: 'Hafif kısıtlamalar için Turbo Mod önerilir.',
    issGlobalName: 'Küresel / Diğer',
    issGlobalDesc: 'Tüm ülkeler için genel bypass ayarları.',
    issOtherName: 'Diğer / Bilmiyorum',
    issOtherDesc: 'Güçlü Mod ile başlar. Çoğu sağlayıcıda sorunsuz çalışır, gerekirse Turbo Mod\'a geçebilirsiniz.',

    // Bypass Ayarları
    sectionBypass: 'DETAYLI BYPASS AYARLARI',
    modeTurboName: 'Turbo Mod',
    modeTurboDesc: 'En düşük gecikme. Hafif filtreleri anında aşar.',
    modeBalancedName: 'Dengeli Mod',
    modeBalancedDesc: 'Hızlı ve stabil. Standart filtreleri aşar.',
    modeStrongName: 'Güçlü Mod',
    modeStrongDesc: 'Zorlu DPI\'ları sahte paketlerle kandırır.',

    // Ekstra Ağ
    sectionExtraNetwork: 'EKSTRA AĞ AYARLARI',
    ipv4ForceTitle: 'IPv4\'e Zorla (Önerilen)',
    ipv4ForceDesc: 'Sonsuz yükleme ve Zaman Aşımı (Timeout) hatalarını engeller.',
    networkModeLabel: 'Ağ Modu',
    modeSmooth: 'Akıcı Mod',
    modeSmoothDesc: 'En düşük gecikme. Tarayıcılar ve Discord için ideal.',
    modeGame: 'Oyun Modu',
    modeGameDesc: 'Roblox, UDP oyunlar ve tüm uygulamalar. Kernel-level bypass.',
    modeSuper: 'Süper Mod',
    modeSuperDesc: 'Hibrit: Akıcı + Oyun birlikte. En iyi denge.',
    modeRequiresNpcap: 'Npcap sürücüsü gereklidir',
    modeBadgeSmooth: 'Akıcı',
    modeBadgeGame: 'Oyun',
    modeBadgeSuper: 'Süper',

    // Gelişmiş (Npcap)
    sectionAdvancedNpcap: 'GELİŞMİŞ AYARLAR',
    advancedNpcapDesc: 'Ağır DPI önlemleri olan sağlayıcılar için (Kablonet, Superonline vb.) gelişmiş paket manipülasyonu gerektirir.',
    advancedNpcapInstalled: 'Npcap Kurulu — Gelişmiş özellikler aktif',
    advancedNpcapMissing: 'Npcap kurulu değil — Güçlü mod kısıtlı çalışır',
    advancedNpcapInstallBtn: 'NPCAP SÜRÜCÜSÜNÜ KUR',
    advancedNpcapWhy: 'Npcap, ağ paketlerine düşük seviyede erişim sağlar. Bu sayede sahte paket (fake packet) gönderme gibi gelişmiş DPI aşma teknikleri kullanılabilir.',
    advancedFeaturesToggle: 'Gelişmiş Bypass',
    advancedFeaturesToggleDesc: 'Sahte paket gönderme ve gelişmiş DPI aşma tekniklerini aktif eder.',
    npcapRestartWarning: 'Npcap\'in çalışabilmesi için bilgisayarınızı yeniden başlatmanız gerekiyor.',
    logStrongFake: 'Güçlü Mod: Fake Paket (3) aktif.',
    logStrongNoDriver: 'Güçlü Mod: Sürücü yok, sadece Chunk-1 aktif.',
    logStrongChunkOnly: 'Güçlü Mod: Chunk-1 aktif.',
    logNpcapFallback: 'Npcap sürücüsü yanıt vermiyor. Gelişmiş bypass kapatılıp tekrar deneniyor...',
    advancedNpcapHint: 'Daha güçlü bypass için Npcap sürücüsünü kurun',


    sectionTroubleshoot: 'SORUN GİDERME',
    fixInternet: 'İnternet Bağlantısını Onar',
    fixInternetDesc: 'Proxy takılı kalırsa interneti otomatik düzeltir.',
    fixRepairing: 'Onarılıyor...',
    fixRepairingDesc: 'Sistem ayarları sıfırlanıyor, lütfen bekleyin.',
    fixDone: 'Onarıldı!',
    fixDoneDesc: 'Proxy ayarları temizlendi ve internet onarıldı.',
    fixError: 'Hata Oluştu!',
    fixErrorDesc: 'İşlem sırasında bir sorun meydana geldi.',

    sectionDev: 'GELİŞTİRİCİ',
    devRole: 'DocsPI Geliştiricisi',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'ÖNEMLİ BİLGİ',
    noticeTitle: 'Güvenlik ve Yanlış Pozitif',
    noticeDesc: 'DocsPI motoru, Windows Defender AI gibi yapay zeka tabanlı sistemler tarafından bazen "yanlış pozitif" olarak algılanabilir. Bu durum tamamen zararsızdır. Ayrıca Kaspersky, ESET gibi yazılımlar HTTPS tarama özelliğiyle bağlantıyı engelleyebilir. Erişim sorunu yaşarsanız bu ayarları kontrol edin.',

    // Dialogs
    confirmExitTitle: 'Çıkış',
    confirmExitDesc: 'DocsPI motorunu durdurup çıkmak istediğinize emin misiniz?',
    confirmDisconnectTitle: 'Bağlantıyı Kes',
    confirmDisconnectDesc: 'Güvenli bağlantınızı sonlandırmak istediğinize emin misiniz?',

    // Settings Tabs
    tabGeneral: 'GENEL',
    tabNetwork: 'AĞ',
    tabNotification: 'BİLDİRİM',
    tabSystem: 'SİSTEM',

    // ISP Tespiti
    ispDetected: (name) => `${name} tespit edildi`,
    ispSuggestion: (profile) => `${profile} modu önerilir`,
    ispAutoSelected: 'Sağlayıcınız otomatik seçildi',

    // Bağlantı İstatistikleri
    statsUptime: 'Süre',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Güncelleme
    updateAvailable: (ver) => `Yeni sürüm mevcut: v${ver}`,
    updateDownload: 'İndir',
    updateDismiss: 'Sonra',

    // Özel Domain Listesi
    sectionDomains: 'ÖZEL DOMAIN LİSTESİ',
    sectionDomainsDesc: 'Bu domainler proxy\'den muaf tutulur (DIRECT bağlantı).',
    domainAdd: 'Ekle',
    domainRemove: 'Kaldır',
    domainPlaceholder: 'örn: *.example.com veya site.com',
    domainEmpty: 'Henüz domain eklenmedi.',

    // Profil Kaydetme
    sectionProfiles: 'AYAR PROFİLLERİ',
    sectionProfilesDesc: 'Mevcut ayarlarınızı kaydedip tek tıkla yükleyin.',
    profileSave: 'Mevcut Ayarları Kaydet',
    profileSaveShort: 'Kaydet',
    profileLoad: 'Yükle',
    profileDelete: 'Sil',
    profileName: 'Profil adı girin...',
    profileSaved: 'Profil kaydedildi!',
    profileLoaded: 'Profil yüklendi!',
    profileEmpty: 'Henüz profil kaydedilmedi.',

    themeLabel: 'Tema',
    themeDark: 'Koyu',
    themeLight: 'Açık',
    themeDarkDesc: 'Koyu tema aktif',
    themeLightDesc: 'Açık tema aktif',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Bypass testi yapılıyor...',
    bypassTestSuccess: 'Bypass aktif! Bağlantı başarılı.',
    bypassTestSuccessShort: 'Aktif',
    bypassTestFailed: 'Bypass çalışmıyor. Bağlantı başarısız.',
    bypassTestFailedShort: 'Başarısız',
    bypassTestTimeout: 'Bypass testi zaman aşımına uğradı.',

    autoEscalateLabel: 'Otomatik Mod Yükseltme',
    autoEscalateDesc: 'Bağlantı başarısız olursa daha güçlü moda geç',
    logAutoEscalate: (mode) => `Bağlantı kurulamadı, ${mode} moda geçiliyor...`,
    logTrayModeChanged: (mode) => `Mod tepsiden değiştirildi: ${mode}`,

    statsTitle: 'Bağlantı İstatistikleri',
    statsTotalSessions: 'Toplam Oturum',
    statsTotalUptime: 'Toplam Süre',
    statsMostUsedMode: 'En Çok Kullanılan Mod',
    statsAvgPing: 'Ortalama Ping',
    statsReset: 'İstatistikleri Sıvırla',
    statsEmpty: 'Henüz kayıtlı oturum yok',

    welcomeTitle: 'DocsPI\'a Hoş Geldiniz',
    welcomeDesc: 'Özgür ve güvenli internete ilk adımınızı atmak üzeresiniz. Sizin için en iyi ayarları yapabilmemiz için birkaç kısa adımımız var.',
    welcomeNext: 'Hadi Başlayalım',
    logDirtyShutdownRecovery: 'Önceki kapatma beklenmedikti. Kurtarılıyor...',
    btnNo: 'İptal',
    btnYes: 'Evet',
    fakeSniLabel: 'Sahte SNI',
    logFilterAll: 'Tümü',
    logFilterError: 'Hatalar',
    logFilterWarn: 'Uyarılar',
    logFilterSuccess: 'Başarılı',
    logFilterInfo: 'Bilgi',
    welcomePrivacy: 'Gizliliğiniz bizim için önemlidir. Verileriniz asla kaydedilmez.',
  },

  ru: {
    appName: 'DOCSPI',
    statusActive: 'АКТИВЕН',
    statusInactive: 'ВЫКЛЮЧЕН',
    statusReady: 'ГОТОВ',

    statusConnected: 'ЗАЩИЩЕНО',
    statusConnecting: 'ПОДКЛЮЧЕНИЕ...',
    statusDisconnecting: 'ОТКЛЮЧЕНИЕ...',
    statusReady2: 'ГОТОВ',
    descConnected: 'Ваше соединение зашифровано и защищено.',
    descConnecting: 'Обработка, пожалуйста, подождите.',
    descReady: 'Подключитесь для обхода DPI.',

    btnConnect: 'ПОДКЛЮЧИТЬ',
    btnDisconnect: 'ОТКЛЮЧИТЬ',
    btnConnecting: 'ПОДКЛЮЧЕНИЕ...',
    btnApplyingSettings: 'ПРИМЕНЕНИЕ...',
    btnDisconnecting: 'ОТКЛЮЧЕНИЕ...',
    btnConnectDevices: 'Другие устройства',

    navSettings: 'НАСТРОЙКИ',
    navLogs: 'ЛОГИ',
    navExit: 'ВЫХОД',

    logsTitle: 'СИСТЕМНЫЕ ЛОГИ',
    logsClear: 'ОЧИСТИТЬ',
    logsCopy: 'КОПИРОВАТЬ',
    logsCopied: 'СКОПИРОВАНО!',
    logsCopyError: 'ОШИБКА!',

    modalTitle: 'Подключить устройство',
    modalSubtitle: 'LAN Общий доступ',
    modalDesc: 'Перейдите в настройки Wi-Fi вашего устройства, установите <strong>Прокси</strong> на <strong>Вручную</strong> и введите данные ниже.',
    modalDescPac: 'Рекомендуется использовать <strong>Автоматический (PAC)</strong> на других устройствах.',
    modalPacQrHint: 'Отсканируйте QR, скопируйте адрес и вставьте его в настройки <strong>Wi-Fi → Прокси → Автоматический URL</strong> вашего устройства.<br><br><span class="text-red-500 font-semibold">ВАЖНО:</span> Если после отключения возникнут проблемы с сетью, выключите и включите Wi-Fi на устройстве.',
    modalPacUrl: 'PAC URL (Рекомендуется)',
    modalManualFallback: 'Альтернатива: Ручной прокси',
    modalTabPac: 'Автоматический (PAC)',
    modalTabManual: 'Вручную',
    modalPacStep1Title: '1. Откройте руководство',
    modalPacStep1Desc: 'Отсканируйте QR-код камерой, чтобы открыть пошаговое руководство.',
    modalPacStep2Title: '2. Скопируйте адрес PAC',
    modalPacStep2Desc: 'Вставьте этот код в поле «Автоматический URL», показанное в руководстве:',
    modalPacWarningTitle: 'ВНИМАНИЕ:',
    modalPacWarningDesc: 'Если приложения типа YouTube потеряют доступ к интернету после закрытия DocsPI (из-за кэшированных соединений), просто перезагрузите Wi-Fi на устройстве.',
    modalManualWarningTitle: 'ВНИМАНИЕ:',
    modalManualWarningDesc: 'При закрытии DocsPI ваше устройство полностью потеряет доступ к интернету. Чтобы восстановить соединение, необходимо удалить настройки прокси из настроек Wi-Fi.',
    modalPacQrCaption: 'QR → Страница настройки (сканируй и копируй)',
    modalHost: 'Сервер (Host)',
    modalPort: 'Порт',
    modalTutorial: 'Как сделать? (Гайд)',

    adminTitle: 'Требуются права администратора',
    adminDesc: 'DocsPI должен быть запущен от имени администратора для корректной работы.',
    adminStep: 'Правой кнопкой на приложение → Выберите <strong>"Запуск от имени администратора"</strong>',
    adminClose: 'ЗАКРЫТЬ',
    adminHowItWorks: 'Как это работает?',

    noInternetTitle: 'Нет подключения к интернету',
    noInternetDesc: 'Пожалуйста, проверьте ваше интернет-соединение.',
    noInternetRetry: 'Повторить',

    logEngineStarting: (port) => `Движок DocsPI запускается (Порт: ${port})...`,
    logDnsUsed: (name, ip) => `DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: Системный по умолчанию',
    logConnected: 'Подключение успешно! Трафик шифруется.',
    logDisconnected: 'Отключено.',
    logProxySet: (port) => `Системный прокси установлен: 127.0.0.1:${port}`,
    logProxyCleared: 'Системный прокси очищен',
    logEngineStopped: (code) => `Движок DocsPI неожиданно остановился (Код: ${code})`,
    logEngineStartError: (err) => `Не удалось запустить движок: ${err}`,
    logAutoReconnect: 'Автопереподключение включено...',
    logReconnecting: (n) => `Переподключение... (Попытка ${n}/5)`,
    logReconnectWait: (sec, n) => `Повтор через ${sec} сек... (Попытка ${n}/5)`,
    logReconnectNow: 'Переподключение...',
    logMaxRetries: 'Ошибка подключения. Достигнуто макс. количество попыток.',
    logPossibleReasons: 'Возможные причины:',
    logReasonInternet: 'Возможно, ваш интернет отключен',
    logReasonFirewall: 'Брандмауэр/Антивирус может блокировать DocsPI',
    logReasonPorts: 'Порты 8080-8084 могут быть заняты',
    logSolutions: 'Предлагаемые решения:',
    logSolInternet: 'Проверьте интернет-соединение',
    logSolFirewall: 'Проверьте настройки брандмауэра',
    logSolAdmin: 'Запустите приложение от имени администратора',
    logSolLogs: 'Скопируйте логи для техподдержки',
    logLanRestart: 'Общий доступ по локальной сети изменен, перезапуск...',
    logDpiRestart: 'Режим DPI изменен, перезапуск подключения...',
    logEngineStoppedGrace: 'Движок DocsPI остановлен.',
    logServiceStopped: 'Сервис остановлен.',
    logShutdownStarting: 'Начало завершения работы...',
    logProcessStopped: 'Процесс остановлен.',
    logSpoofReady: (port) => `Движок SpoofDPI запущен (Порт: ${port})`,
    logPacStarted: 'PAC-сервер запущен (для устройств в локальной сети)',
    logPacStartError: (err) => `Не удалось запустить PAC-сервер: ${err}`,
    logEngineActive: 'Движок DocsPI активен',
    logPortBusy: (port) => `Порт ${port} занят, пробуем другой...`,
    logInitializing: 'Инициализация движка...',
    logPortRetryOpen: (port) => `Не удалось открыть порт ${port}, повтор...`,
    logProxyClearError: (err) => `Ошибка очистки прокси: ${err}`,
    logProxySetError: (err) => `Ошибка установки прокси: ${err}`,
    logServiceStopError: (err) => `Ошибка остановки сервиса: ${err}`,
    logConfigError: (err) => `Ошибка конфигурации: ${err}`,
    logAdminMissing: 'Отсутствуют права администратора! Приложение может работать некорректно.',
    logInternetBack: 'Интернет-соединение восстановлено.',
    logInternetLost: 'Интернет-соединение потеряно!',
    logPortRetry: (count) => `Конфликт портов, пробуем новый... (${count}/20)`,
    logNoPort: 'Свободных портов не найдено.',
    logWinHttpEnabled: 'Применен прокси-туннель для игрового режима (WinHTTP).',
    logWpcapMissing: 'SpoofDPI не нашел wpcap.dll. Установите Npcap или WinPcap, затем перезапустите приложение.',
    logAntivirusWarning: 'Защитник Windows или ваш антивирус могли заблокировать «docspi-proxy.exe». Добавьте файл в список исключений антивируса.',
    logFailsafePortClosed: 'Время ожидания порта истекло, повтор подключения...',

    settingsTitle: 'НАСТРОЙКИ',

    sectionMethod: 'МЕТОД ПОДКЛЮЧЕНИЯ',
    sectionMethodWhy: 'Одна настройка для всех провайдеров. Используйте на всех устройствах через LAN. На базе прокси, без пинга/джиттера в играх.',
    methodStrong: 'Сильный режим',
    methodStrongDesc: 'Самый мощный обход для сложных провайдеров (добавляет задержку)',
    methodTurbo: 'Турбо режим',
    methodTurboDesc: 'Минимальная задержка, для легкого DPI',
    methodBalanced: 'Сбалансированный (Рекомендуется)',
    methodBalancedDesc: 'Быстрый + мощный обход, работает у большинства',

    sectionAdvanced: 'ДОПОЛНИТЕЛЬНО',
    chunkSizeLabel: 'Размер фрагмента (chunk size)',
    chunkSizeDesc: 'Определяет, на сколько частей делится HTTPS-трафик. Для некоторых провайдеров 4 или 16 может быть быстрее; 8 — сбалансированный вариант (по умолчанию).',
    chunkSize4: '4 — Самый мощный (некоторые провайдеры)',
    chunkSize8: '8 — Сбалансированный (по умолчанию)',
    chunkSize16: '16 — Быстрее (некоторые провайдеры)',

    sectionNetwork: 'СЕТЬ',
    lanSharing: 'Общий доступ по локальной сети',
    lanSharingDesc: 'Разрешить подключения с других устройств (телефон, консоль)',

    sectionAutomation: 'АВТОМАТИЗАЦИЯ',
    autoConnect: 'Автоподключение',
    autoConnectDesc: 'Подключаться сразу при запуске приложения',
    autoReconnect: 'Автопереподключение',
    autoReconnectDesc: 'Автоматически повторять при обрыве соединения',

    sectionGeneral: 'ОБЩИЕ',
    autoStart: 'Запуск при загрузке',
    autoStartDesc: 'Запускать DocsPI при старте Windows',
    minimizeToTray: 'Сворачивать в трей',
    minimizeToTrayDesc: 'Работать в фоне при закрытии',
    alwaysOnTop: 'Поверх всех окон',
    alwaysOnTopDesc: 'Окно всегда остается поверх других окон',
    requireConfirmation: 'Подтверждение действия',
    requireConfirmationDesc: 'Спрашивать перед отключением или выходом',
    language: 'ЯЗЫК',
    languageDesc: 'Изменить язык интерфейса',

    sectionNotifications: 'УВЕДОМЛЕНИЯ',
    notifications: 'Уведомления на рабочем столе',
    notificationsDesc: 'Главный выключатель уведомлений (Вкл/Выкл все)',
    notifyOnConnect: 'При установке соединения',
    notifyOnConnectDesc: 'Уведомлять при успешном подключении',
    notifyOnDisconnect: 'При обрыве соединения',
    notifyOnDisconnectDesc: 'Уведомлять при неожиданных обрывах',
    notifDisconnectManual: 'Соединение успешно завершено.',

    sectionDns: 'СПИСОК DNS',
    dnsAutoSelect: 'Автовыбор (Рекомендуется)',
    dnsAutoSelectDesc: 'Автоматически находит самый быстрый сервер',
    dnsSystemDefault: 'Системный по умолчанию',
    dnsSystemDefaultDesc: 'DNS по умолчанию SpoofDPI',
    dnsCfDesc: 'Быстрый и приватный',
    dnsAdguardDesc: 'Блокировщик рекламы',
    dnsGoogleDesc: 'Надежный',
    dnsQuad9Desc: 'Ориентирован на безопасность',
    dnsOpenDnsDesc: 'На базе Cisco',
    dnsCheckSpeed: 'Тест пинга DNS',
    dnsChecking: 'Измерение...',

    driverStatusInstalled: 'Расширенная фильтрация активна',
    driverStatusMissing: 'Разблокируйте расширенные функции, если обход не работает',
    driverInstallBtn: 'УСТАНОВИТЬ ДРАЙВЕР (РЕКОМЕНДУЕТСЯ)',
    driverIspWarning: 'Если у вас проблемы с подключением, вы можете разблокировать более продвинутые функции обхода DPI, установив драйвер.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Выберите вашего провайдера',
    issOverlayDesc: 'Позвольте нам автоматически применить лучшие настройки для вашего провайдера.',
    issOverlayApply: 'ПРИМЕНИТЬ И ПОДКЛЮЧИТЬ',
    issOverlaySkip: 'Пропустить',
    issProfileActive: 'Профиль активен',
    issProfileSee: 'Посмотреть рекомендуемые настройки',
    issApplyBtn: 'Применить настройки автоматически',
    issAppliedMsg: 'Эта настройка используется в данный момент',

    // ISS Guide (Settings)
    issGuideTitle: 'ГИД ПО ПРОВАЙДЕРАМ',
    issLightName: 'TurkNet',
    issLightDesc: 'Легкая фильтрация. Турбо-режим гарантирует отсутствие роста пинга или потери скорости.',
    issMidName: 'Только некоторые провайдеры',
    issMidDesc: 'Стандартная блокировка. Сильный режим делит пакеты для надежного доступа.',
    issHeavyName: 'Турецкие провайдеры (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Используются мощные и умные DPI-устройства. Может потребоваться сильный режим.',
    issChinaName: 'Китай (Великий файервол)',
    issChinaDesc: 'Для преодоления самой продвинутой в мире системы DPI может потребоваться сильный режим и кастомный SNI.',
    issRussiaName: 'Россия (Роскомнадзор)',
    issRussiaDesc: 'Рекомендуется сильный режим для сложных блокировок.',
    issIndiaName: 'Индия',
    issIndiaDesc: 'Сбалансированного режима достаточно для стандартных блокировок.',
    issUsaName: 'США / Глобал',
    issUsaDesc: 'Турбо-режим рекомендуется для легких ограничений.',
    issGlobalName: 'Глобал / Другие',
    issGlobalDesc: 'Общие настройки обхода для всех стран.',
    issOtherName: 'Другой / Неизвестно',
    issOtherDesc: 'Начинается с сильного режима. Работает надежно с большинством провайдеров.',

    // Bypass Settings
    sectionBypass: 'НАСТРОЙКИ ОБХОДА',
    modeTurboName: 'Турбо режим',
    modeTurboDesc: 'Минимальная задержка. Мгновенно обходит легкие фильтры.',
    modeBalancedName: 'Сбалансированный',
    modeBalancedDesc: 'Быстрый и стабильный. Обходит стандартные фильтры.',
    modeStrongName: 'Сильный режим',
    modeStrongDesc: 'Обходит сложный DPI с помощью фейковых пакетов.',

    // Extra Network
    sectionExtraNetwork: 'ДОП. НАСТРОЙКИ СЕТИ',
    ipv4ForceTitle: 'Принудительно IPv4 (Рекомендуется)',
    ipv4ForceDesc: 'Предотвращает бесконечную загрузку и ошибки тайм-аута.',
    networkModeLabel: 'Сетевой режим',
    modeSmooth: 'Плавный режим',
    modeSmoothDesc: 'Минимальная задержка. Идеально для браузеров и Discord.',
    modeGame: 'Игровой режим',
    modeGameDesc: 'Roblox, UDP-игры и все приложения. Обход на уровне ядра.',
    modeSuper: 'Супер режим',
    modeSuperDesc: 'Гибрид: Плавный + Игровой вместе. Лучший баланс.',
    modeRequiresNpcap: 'Требуется драйвер Npcap',
    modeBadgeSmooth: 'Плавный',
    modeBadgeGame: 'Игровой',
    modeBadgeSuper: 'Супер',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'РАСШИРЕННЫЕ НАСТРОЙКИ',
    advancedNpcapDesc: 'Провайдеры с тяжелыми мерами DPI требуют продвинутых манипуляций с пакетами.',
    advancedNpcapInstalled: 'Npcap установлен — расширенные функции активны',
    advancedNpcapMissing: 'Npcap не установлен — сильный режим ограничен',
    advancedNpcapInstallBtn: 'УСТАНОВИТЬ ДРАЙВЕР NPCAP',
    advancedNpcapWhy: 'Npcap обеспечивает низкоуровневый доступ к сетевым пакетам. Это позволяет использовать продвинутые техники обхода DPI.',
    advancedFeaturesToggle: 'Расширенный обход',
    advancedFeaturesToggleDesc: 'Включает инъекцию фейковых пакетов и продвинутые техники обхода DPI.',
    npcapRestartWarning: 'Необходимо перезагрузить компьютер для работы Npcap.',
    logStrongFake: 'Сильный режим: Фейк-пакет (3) активен.',
    logStrongNoDriver: 'Сильный режим: Нет драйвера, только Chunk-1.',
    logStrongChunkOnly: 'Сильный режим: Chunk-1 активен.',
    logNpcapFallback: 'Драйвер Npcap не отвечает. Отключение расширенного обхода и повтор...',
    advancedNpcapHint: 'Установите драйвер Npcap для более мощного обхода',


    sectionTroubleshoot: 'УСТРАНЕНИЕ НЕПОЛАДОК',
    fixInternet: 'Исправить интернет-соединение',
    fixInternetDesc: 'Исправляет интернет, если прокси «завис».',
    fixRepairing: 'Восстановление...',
    fixRepairingDesc: 'Сброс системных настроек, пожалуйста, подождите.',
    fixDone: 'Восстановлено!',
    fixDoneDesc: 'Настройки прокси очищены, интернет восстановлен.',
    fixError: 'Произошла ошибка!',
    fixErrorDesc: 'Что-то пошло не так во время процесса.',

    sectionDev: 'РАЗРАБОТЧИК',
    devRole: 'Разработчик DocsPI',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'ВАЖНО',
    noticeTitle: 'Безопасность и ложные срабатывания',
    noticeDesc: 'Движок DocsPI может иногда помечаться как «ложное срабатывание» системами на базе ИИ. Это совершенно безвредно. Также антивирусы типа Kaspersky или ESET могут блокировать соединения.',

    // Dialogs
    confirmExitTitle: 'Выход',
    confirmExitDesc: 'Вы уверены, что хотите остановить движок DocsPI и выйти?',
    confirmDisconnectTitle: 'Отключить',
    confirmDisconnectDesc: 'Вы уверены, что хотите завершить защищенное соединение?',

    // Settings Tabs
    tabGeneral: 'ОБЩИЕ',
    tabNetwork: 'СЕТЬ',
    tabNotification: 'УВЕДОМЛЕНИЯ',
    tabSystem: 'СИСТЕМА',

    // ISP Detection
    ispDetected: (name) => `Обнаружен ${name}`,
    ispSuggestion: (profile) => `Рекомендуется режим ${profile}`,
    ispAutoSelected: 'Ваш провайдер был выбран автоматически',

    // Connection Statistics
    statsUptime: 'Аптайм',
    statsPing: 'Пинг',
    statsMs: 'мс',

    // Update
    updateAvailable: (ver) => `Доступна новая версия: v${ver}`,
    updateDownload: 'Скачать',
    updateDismiss: 'Позже',

    // Custom Domain List
    sectionDomains: 'СПИСОК КАСТОМНЫХ ДОМЕНОВ',
    sectionDomainsDesc: 'Эти домены обходят прокси (ПРЯМОЕ соединение).',
    domainAdd: 'Добавить',
    domainRemove: 'Удалить',
    domainPlaceholder: 'напр. *.example.com или site.com',
    domainEmpty: 'Домены пока не добавлены.',

    // Profile Saving
    sectionProfiles: 'ПРОФИЛИ НАСТРОЕК',
    sectionProfilesDesc: 'Сохраняйте текущие настройки и загружайте их одним кликом.',
    profileSave: 'Сохранить текущие настройки',
    profileSaveShort: 'Сохр.',
    profileLoad: 'Загр.',
    profileDelete: 'Удалить',
    profileName: 'Введите имя профиля...',
    profileSaved: 'Профиль сохранен!',
    profileLoaded: 'Профиль загружен!',
    profileEmpty: 'Профили пока не сохранены.',

    themeLabel: 'Тема',
    themeDark: 'Темная',
    themeLight: 'Светлая',
    themeDarkDesc: 'Темная тема активна',
    themeLightDesc: 'Светлая тема активна',

    bypassTestBtn: 'Тест обхода',
    bypassTestTesting: 'Выполнение теста обхода...',
    bypassTestSuccess: 'Обход активен! Соединение успешно.',
    bypassTestSuccessShort: 'Активен',
    bypassTestFailed: 'Обход не работает. Соединение не удалось.',
    bypassTestFailedShort: 'Ошибка',
    bypassTestTimeout: 'Время ожидания теста обхода истекло.',

    autoEscalateLabel: 'Автоповышение режима',
    autoEscalateDesc: 'Перейти на более мощный режим при ошибке подключения',
    logAutoEscalate: (mode) => `Ошибка подключения, переход в режим ${mode}...`,
    logTrayModeChanged: (mode) => `Режим изменен из трея: ${mode}`,

    statsTitle: 'Статистика подключений',
    statsTotalSessions: 'Всего сессий',
    statsTotalUptime: 'Общее время',
    statsMostUsedMode: 'Популярный режим',
    statsAvgPing: 'Средний пинг',
    statsReset: 'Сбросить статистику',
    statsEmpty: 'Записей пока нет',

    welcomeTitle: 'Добро пожаловать в DocsPI',
    welcomeDesc: 'Вы собираетесь сделать свой первый шаг к свободному и безопасному интернету. У нас есть несколько коротких шагов для выбора лучших настроек.',
    welcomeNext: 'Начнем',
    welcomePrivacy: 'Ваша конфиденциальность важна для нас. Ваши данные никогда не записываются.',
    fakeSniLabel: 'Fake SNI',
    btnYes: '??',
    logFilterError: '??????',
    logDirtyShutdownRecovery: '?????????? ?????????? ???? ??????????????. ??????????????...',
    logFilterSuccess: '?????',
    logFilterInfo: '????',
    btnNo: '???',
    logFilterWarn: '??????????????',
    logFilterAll: '???',
  },

  zh: {
    appName: 'DOCSPI',
    statusActive: '激活',
    statusInactive: '关闭',
    statusReady: '就绪',

    statusConnected: '安全',
    statusConnecting: '连接中...',
    statusDisconnecting: '断开中...',
    statusReady2: '就绪',
    descConnected: '您的连接已加密并受保护。',
    descConnecting: '正在处理，请稍候。',
    descReady: '连接以进行 DPI 绕过。',

    btnConnect: '连接',
    btnDisconnect: '断开连接',
    btnConnecting: '连接中...',
    btnApplyingSettings: '正在应用设置...',
    btnDisconnecting: '断开中...',
    btnConnectDevices: '连接其他设备',

    navSettings: '设置',
    navLogs: '日志',
    navExit: '退出',

    logsTitle: '系统日志',
    logsClear: '清除',
    logsCopy: '复制',
    logsCopied: '已复制！',
    logsCopyError: '错误！',

    modalTitle: '连接设备',
    modalSubtitle: '局域网共享',
    modalDesc: '转到您设备的 Wi-Fi 设置，将 <strong>代理</strong> 设置为 <strong>手动</strong> 并输入以下详细信息。',
    modalDescPac: '建议在其他设备上使用 <strong>自动 (PAC)</strong>。',
    modalPacQrHint: '扫描二维码，复制地址并将其粘贴到您设备的 <strong>Wi-Fi → 代理 → 自动 URL</strong> 设置中。<br><br><span class="text-red-500 font-semibold">重要提示：</span> 如果断开连接后出现网络问题，请关闭并重新打开设备的 Wi-Fi。',
    modalPacUrl: 'PAC 地址 (推荐)',
    modalManualFallback: '替代方案：手动代理',
    modalTabPac: '自动 (PAC)',
    modalTabManual: '手动',
    modalPacStep1Title: '1. 打开设置指南',
    modalPacStep1Desc: '用您的相机扫描二维码以打开分步指南。',
    modalPacStep2Title: '2. 复制 PAC 地址',
    modalPacStep2Desc: '将此代码粘贴到指南中显示的“自动 URL”字段中：',
    modalPacWarningTitle: '注意：',
    modalPacWarningDesc: '如果在关闭 DocsPI 后 YouTube 等应用程序失去互联网访问（由于缓存连接），只需切换您设备的 Wi-Fi 开关。',
    modalManualWarningTitle: '注意：',
    modalManualWarningDesc: '关闭 DocsPI 时，您的设备将完全失去互联网访问。要恢复连接，您必须从 Wi-Fi 设置中移除代理设置。',
    modalPacQrCaption: '二维码 → 设置页面 (扫描并复制)',
    modalHost: '主机 (Host)',
    modalPort: '端口',
    modalTutorial: '如何操作？ (指南)',

    adminTitle: '需要管理员权限',
    adminDesc: 'DocsPI 需要以管理员身份运行才能正常工作。',
    adminStep: '右键单击应用程序 → 选择 <strong>“以管理员身份运行”</strong>',
    adminClose: '关闭',
    adminHowItWorks: '它是如何工作的？',

    noInternetTitle: '无互联网连接',
    noInternetDesc: '请检查您的互联网连接。',
    noInternetRetry: '重试',

    logEngineStarting: (port) => `DocsPI 引擎正在启动 (端口: ${port})...`,
    logDnsUsed: (name, ip) => `使用的 DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: 系统默认',
    logConnected: '连接成功！流量已加密。',
    logDisconnected: '已断开连接。',
    logProxySet: (port) => `系统代理已设置: 127.0.0.1:${port}`,
    logProxyCleared: '系统代理已清除',
    logEngineStopped: (code) => `DocsPI 引擎意外停止 (代码: ${code})`,
    logEngineStartError: (err) => `引擎启动失败: ${err}`,
    logAutoReconnect: '自动重连已启用...',
    logReconnecting: (n) => `正在重新连接... (尝试 ${n}/5)`,
    logReconnectWait: (sec, n) => `在 ${sec} 秒后重试... (尝试 ${n}/5)`,
    logReconnectNow: '正在重新连接...',
    logMaxRetries: '连接失败。已达到最大尝试次数。',
    logPossibleReasons: '可能的原因：',
    logReasonInternet: '您的互联网可能已断开',
    logReasonFirewall: '防火墙/杀毒软件可能正在阻止 DocsPI',
    logReasonPorts: '端口 8080-8084 可能正在使用中',
    logSolutions: '建议的解决方案：',
    logSolInternet: '检查您的互联网连接',
    logSolFirewall: '检查您的防火墙设置',
    logSolAdmin: '以管理员身份运行应用程序',
    logSolLogs: '复制并共享日志以获取支持',
    logLanRestart: '局域网共享已更改，正在重新启动连接...',
    logDpiRestart: 'DPI 模式已更改，正在重新启动连接...',
    logEngineStoppedGrace: 'DocsPI 引擎已停止。',
    logServiceStopped: '服务已停止。',
    logShutdownStarting: '开始关机...',
    logProcessStopped: '进程已停止。',
    logSpoofReady: (port) => `SpoofDPI 引擎已启动 (端口: ${port})`,
    logPacStarted: 'PAC 服务器已启动 (用于局域网设备)',
    logPacStartError: (err) => `PAC 服务器启动失败: ${err}`,
    logEngineActive: 'DocsPI 引擎处于活动状态',
    logPortBusy: (port) => `端口 ${port} 繁忙，正在尝试另一个端口...`,
    logInitializing: '引擎正在初始化...',
    logPortRetryOpen: (port) => `无法打开端口 ${port}，正在重试...`,
    logProxyClearError: (err) => `清除代理失败: ${err}`,
    logProxySetError: (err) => `设置代理失败: ${err}`,
    logServiceStopError: (err) => `停止服务失败: ${err}`,
    logConfigError: (err) => `配置错误: ${err}`,
    logAdminMissing: '缺少管理员权限！应用程序可能无法正常工作。',
    logInternetBack: '互联网连接已恢复。',
    logInternetLost: '互联网连接丢失！',
    logPortRetry: (count) => `端口冲突，正在尝试新端口... (${count}/20)`,
    logNoPort: '未找到可用端口。',
    logWinHttpEnabled: '已应用游戏模式 (WinHTTP) 代理隧道。',
    logWpcapMissing: 'SpoofDPI 找不到 wpcap.dll。请安装 Npcap 或 WinPcap，然后重新启动应用程序。',
    logAntivirusWarning: 'Windows Defender 或您的杀毒软件可能已阻止“docspi-proxy.exe”。请将该文件添加到您的杀毒软件排除列表中。',
    logFailsafePortClosed: '端口超时，正在重新尝试连接...',

    settingsTitle: '设置',

    sectionMethod: '连接方式',
    sectionMethodWhy: '所有 ISP 的单一设置。通过局域网在所有设备上使用。基于代理，因此在游戏中不会产生延迟/抖动。',
    methodStrong: '强力模式',
    methodStrongDesc: '针对困难 ISP 的最强绕过 (会增加延迟)',
    methodTurbo: '极速模式',
    methodTurboDesc: '最低延迟，适用于轻度 DPI',
    methodBalanced: '均衡模式 (推荐)',
    methodBalancedDesc: '快速 + 强力绕过，适用于大多数 ISP',

    sectionAdvanced: '高级',
    chunkSizeLabel: '分块大小 (chunk size)',
    chunkSizeDesc: '控制将 HTTPS 流量拆分为多少块。根据您的 ISP，4 或 16 可能更快；8 通常是平衡的 (默认)。请尝试并选择最合适的。',
    chunkSize4: '4 — 最强 (某些 ISP)',
    chunkSize8: '8 — 均衡 (默认)',
    chunkSize16: '16 — 更快 (某些 ISP)',

    sectionNetwork: '网络设置',
    lanSharing: '局域网共享',
    lanSharingDesc: '允许来自其他设备 (手机、游戏机) 的连接',

    sectionAutomation: '自动化',
    autoConnect: '自动连接',
    autoConnectDesc: '应用程序打开后立即连接',
    autoReconnect: '自动重连',
    autoReconnectDesc: '连接断开时自动重试',

    sectionGeneral: '常规',
    autoStart: '开机启动',
    autoStartDesc: 'Windows 启动时启动 DocsPI',
    minimizeToTray: '最小化到托盘',
    minimizeToTrayDesc: '关闭时在后台运行',
    alwaysOnTop: '总在最前面',
    alwaysOnTopDesc: '窗口始终保持在其他窗口之上',
    requireConfirmation: '操作确认',
    requireConfirmationDesc: '在断开连接或退出前询问',
    language: '语言',
    languageDesc: '更改界面语言',

    sectionNotifications: '通知',
    notifications: '桌面通知',
    notificationsDesc: '主通知开关 (启用/禁用所有)',
    notifyOnConnect: '连接建立时',
    notifyOnConnectDesc: '连接成功建立并安全时通知',
    notifyOnDisconnect: '连接断开时',
    notifyOnDisconnectDesc: '在意外断开或修复时通知',
    notifDisconnectManual: '连接已成功终止。',

    sectionDns: 'DNS 列表',
    dnsAutoSelect: '自动选择 (推荐)',
    dnsAutoSelectDesc: '自动寻找最快的服务器',
    dnsSystemDefault: '系统默认',
    dnsSystemDefaultDesc: 'SpoofDPI 默认 DNS',
    dnsCfDesc: '快速且私密',
    dnsAdguardDesc: '广告拦截器',
    dnsGoogleDesc: '可靠',
    dnsQuad9Desc: '专注于安全',
    dnsOpenDnsDesc: '由 Cisco 提供支持',
    dnsCheckSpeed: 'DNS 延迟测试',
    dnsChecking: '正在测量...',

    driverStatusInstalled: '高级过滤已启用',
    driverStatusMissing: '如果绕过失败，请解锁高级功能',
    driverInstallBtn: '安装驱动程序 (推荐)',
    driverIspWarning: '如果您遇到连接问题，可以通过安装驱动程序来解锁更高级的 DPI 绕过功能。',

    // ISS Overlay (First Run)
    issOverlayTitle: '选择您的互联网提供商',
    issOverlayDesc: '让我们为您的 ISP 自动应用最佳设置。',
    issOverlayApply: '应用并连接',
    issOverlaySkip: '跳过',
    issProfileActive: '配置文件已激活',
    issProfileSee: '查看推荐设置',
    issApplyBtn: '自动应用设置',
    issAppliedMsg: '当前正在使用此设置',

    // ISS Guide (Settings)
    issGuideTitle: 'ISP 指南',
    issLightName: 'TurkNet',
    issLightDesc: '轻度过滤。极速模式确保游戏中不会增加延迟或损失速度。',
    issMidName: '仅部分 ISP',
    issMidDesc: '标准拦截。强力模式通过拆分数据包来实现可靠访问。',
    issHeavyName: '土耳其提供商 (TT / Vodafone / Superonline)',
    issHeavyDesc: '使用强大且智能的 DPI 设备。可能需要强力模式。',
    issChinaName: '中国 (防火长城)',
    issChinaDesc: '绕过世界上最先进的 DPI 系统可能需要强力模式和自定义 SNI 设置。',
    issRussiaName: '俄罗斯 (Roskomnadzor)',
    issRussiaDesc: '对于复杂的封锁，建议使用强力模式。',
    issIndiaName: '印度',
    issIndiaDesc: '对于标准封锁，均衡模式已足够。',
    issUsaName: '美国 / 全球',
    issUsaDesc: '对于轻度限制，建议使用极速模式。',
    issGlobalName: '全球 / 其他',
    issGlobalDesc: '适用于所有国家的通用绕过设置。',
    issOtherName: '其他 / 未知',
    issOtherDesc: '以强力模式开始。适用于大多数提供商，如有需要请切换到极速模式。',

    // Bypass Settings
    sectionBypass: '详细绕过设置',
    modeTurboName: '极速模式',
    modeTurboDesc: '最低延迟。立即绕过轻度过滤器。',
    modeBalancedName: '均衡模式',
    modeBalancedDesc: '快速且稳定。绕过标准过滤器。',
    modeStrongName: '强力模式',
    modeStrongDesc: '使用虚假数据包绕过困难的 DPI。',

    // Extra Network
    sectionExtraNetwork: '额外网络设置',
    ipv4ForceTitle: '强制 IPv4 (推荐)',
    ipv4ForceDesc: '防止无限加载和超时错误。',
    networkModeLabel: '网络模式',
    modeSmooth: '平滑模式',
    modeSmoothDesc: '最低延迟。浏览器和 Discord 的理想选择。',
    modeGame: '游戏模式',
    modeGameDesc: 'Roblox、UDP 游戏和所有应用程序。内核级绕过。',
    modeSuper: '超级模式',
    modeSuperDesc: '混合：平滑 + 游戏结合。最佳平衡。',
    modeRequiresNpcap: '需要 Npcap 驱动程序',
    modeBadgeSmooth: '平滑',
    modeBadgeGame: '游戏',
    modeBadgeSuper: '超级',

    // Advanced (Npcap)
    sectionAdvancedNpcap: '高级设置',
    advancedNpcapDesc: '具有重度 DPI 措施的 ISP (如 Kablonet、Superonline 等) 需要高级数据包操作。',
    advancedNpcapInstalled: 'Npcap 已安装 — 高级功能已启用',
    advancedNpcapMissing: '未安装 Npcap — 强力模式受限',
    advancedNpcapInstallBtn: '安装 NPCAP 驱动程序',
    advancedNpcapWhy: 'Npcap 提供对网络数据包的低级访问。这使得能够使用高级 DPI 绕过技术，如虚假数据包注入。',
    advancedFeaturesToggle: '高级绕过',
    advancedFeaturesToggleDesc: '启用虚假数据包注入和高级 DPI 绕过技术。',
    npcapRestartWarning: '您需要重新启动计算机才能使 Npcap 工作。',
    logStrongFake: '强力模式：虚假数据包 (3) 已启用。',
    logStrongNoDriver: '强力模式：无驱动程序，仅启用分块-1。',
    logStrongChunkOnly: '强力模式：分块-1 已启用。',
    logNpcapFallback: 'Npcap 驱动程序无响应。正在禁用高级绕过并重试...',
    advancedNpcapHint: '安装 Npcap 驱动程序以获得更强的绕过能力',

    sectionTroubleshoot: '故障排除',
    fixInternet: '修复互联网连接',
    fixInternetDesc: '如果代理卡住，自动修复互联网。',
    fixRepairing: '正在修复...',
    fixRepairingDesc: '正在重置系统设置，请稍候。',
    fixDone: '已修复！',
    fixDoneDesc: '代理设置已清除，互联网已恢复。',
    fixError: '发生错误！',
    fixErrorDesc: '在此过程中出现了问题。',

    sectionDev: '开发者',
    devRole: 'DocsPI 开发者',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: '重要信息',
    noticeTitle: '安全与误报',
    noticeDesc: 'DocsPI 引擎有时可能会被 Windows Defender 等基于 AI 的系统标记为“误报”。这完全是无害的。',

    // Dialogs
    confirmExitTitle: '退出',
    confirmExitDesc: '您确定要停止 DocsPI 引擎并退出吗？',
    confirmDisconnectTitle: '断开连接',
    confirmDisconnectDesc: '您确定要终止您的安全连接吗？',

    // Settings Tabs
    tabGeneral: '常规',
    tabNetwork: '网络',
    tabNotification: '通知',
    tabSystem: '系统',

    // ISP Detection
    ispDetected: (name) => `检测到 ${name}`,
    ispSuggestion: (profile) => `建议使用 ${profile} 模式`,
    ispAutoSelected: '您的 ISP 已被自动选择',

    // Connection Statistics
    statsUptime: '运行时间',
    statsPing: '延迟',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `新版本可用: v${ver}`,
    updateDownload: '下载',
    updateDismiss: '以后',

    // Custom Domain List
    sectionDomains: '自定义域名列表',
    sectionDomainsDesc: '这些域名将绕过代理 (直接连接)。',
    domainAdd: '添加',
    domainRemove: '移除',
    domainPlaceholder: '例如: *.example.com 或 site.com',
    domainEmpty: '尚未添加域名。',

    // Profile Saving
    sectionProfiles: '设置配置文件',
    sectionProfilesDesc: '保存您当前的设置并一键加载。',
    profileSave: '保存当前设置',
    profileSaveShort: '保存',
    profileLoad: '加载',
    profileDelete: '删除',
    profileName: '输入配置文件名称...',
    profileSaved: '配置文件已保存！',
    profileLoaded: '配置文件已加载！',
    profileEmpty: '尚未保存配置文件。',

    themeLabel: '主题',
    themeDark: '深色',
    themeLight: '浅色',
    themeDarkDesc: '深色主题已激活',
    themeLightDesc: '浅色主题已激活',

    bypassTestBtn: '绕过测试',
    bypassTestTesting: '正在运行绕过测试...',
    bypassTestSuccess: '绕过有效！连接成功。',
    bypassTestSuccessShort: '有效',
    bypassTestFailed: '绕过无效。连接失败。',
    bypassTestFailedShort: '失败',
    bypassTestTimeout: '绕过测试超时。',

    autoEscalateLabel: '自动模式提升',
    autoEscalateDesc: '如果连接失败，切换到更强模式',
    logAutoEscalate: (mode) => `连接失败，正在切换到 ${mode} 模式...`,
    logTrayModeChanged: (mode) => `托盘菜单已更改模式: ${mode}`,

    statsTitle: '连接统计',
    statsTotalSessions: '总会话数',
    statsTotalUptime: '总运行时间',
    statsMostUsedMode: '最常用模式',
    statsAvgPing: '平均延迟',
    statsReset: '重置统计信息',
    statsEmpty: '尚未有记录的会话',

    welcomeTitle: '欢迎使用 DocsPI',
    welcomeDesc: '您即将迈出迈向自由安全互联网的第一步。我们有一些简短的步骤来为您设置最佳设置。',
    welcomeNext: '让我们开始吧',
    welcomePrivacy: '您的隐私对我们非常重要。您的数据永远不会被记录。',
    fakeSniLabel: 'Fake SNI',
    btnYes: '?',
    logFilterError: '??',
    logDirtyShutdownRecovery: '??????,????...',
    logFilterSuccess: '??',
    logFilterInfo: '??',
    btnNo: '?',
    logFilterWarn: '??',
    logFilterAll: '??',
  },

  hi: {
    appName: 'DOCSPI',
    statusActive: 'सक्रिय',
    statusInactive: 'बंद',
    statusReady: 'तैयार',

    statusConnected: 'सुरक्षित',
    statusConnecting: 'जुड़ रहा है...',
    statusDisconnecting: 'डिस्कनेक्ट हो रहा है...',
    statusReady2: 'तैयार',
    descConnected: 'आपका कनेक्शन एन्क्रिप्टेड और सुरक्षित है।',
    descConnecting: 'प्रक्रिया जारी है, कृपया प्रतीक्षा करें।',
    descReady: 'DPI बायपास के लिए कनेक्ट करें।',

    btnConnect: 'जुड़ें',
    btnDisconnect: 'डिस्कनेक्ट करें',
    btnConnecting: 'जुड़ रहा है...',
    btnApplyingSettings: 'सेटिंग्स लागू की जा रही हैं...',
    btnDisconnecting: 'डिस्कनेक्ट हो रहा है...',
    btnConnectDevices: 'अन्य डिवाइस जोड़ें',

    navSettings: 'सेटिंग्स',
    navLogs: 'लॉग्स',
    navExit: 'बाहर निकलें',

    logsTitle: 'सिस्टम लॉग्स',
    logsClear: 'साफ़ करें',
    logsCopy: 'कॉपी करें',
    logsCopied: 'कॉपी किया गया!',
    logsCopyError: 'त्रुटि!',

    modalTitle: 'डिवाइस कनेक्ट करें',
    modalSubtitle: 'LAN शेयरिंग',
    modalDesc: 'अपने डिवाइस की Wi-Fi सेटिंग्स में जाएं, <strong>Proxy</strong> को <strong>Manual</strong> पर सेट करें और नीचे दिए गए विवरण दर्ज करें।',
    modalDescPac: 'अन्य डिवाइस पर <strong>Automatic (PAC)</strong> का उपयोग करने की सलाह दी जाती है।',
    modalPacQrHint: 'QR स्कैन करें, पता कॉपी करें और इसे अपने डिवाइस की <strong>Wi-Fi → Proxy → Automatic URL</strong> सेटिंग्स में पेस्ट करें।<br><br><span class="text-red-500 font-semibold">महत्वपूर्ण:</span> डिस्कनेक्ट करने के बाद यदि नेटवर्क समस्या आती है, तो अपने डिवाइस का Wi-Fi बंद करके फिर से चालू करें।',
    modalPacUrl: 'PAC URL (अनुशंसित)',
    modalManualFallback: 'विकल्प: मैनुअल प्रॉक्सी',
    modalTabPac: 'Automatic (PAC)',
    modalTabManual: 'मैनुअल',
    modalPacStep1Title: '1. सेटअप गाइड खोलें',
    modalPacStep1Desc: 'चरण-दर-चरण गाइड खोलने के लिए अपने कैमरे से QR कोड स्कैन करें।',
    modalPacStep2Title: '2. PAC पता कॉपी करें',
    modalPacStep2Desc: 'गाइड में दिखाए गए "Automatic URL" फ़ील्ड में यह कोड पेस्ट करें:',
    modalPacWarningTitle: 'ध्यान दें:',
    modalPacWarningDesc: 'यदि DocsPI बंद करने के बाद YouTube जैसे ऐप्स इंटरनेट एक्सेस खो देते हैं (कैश किए गए कनेक्शन के कारण), तो बस अपने डिवाइस का Wi-Fi टॉगल करें।',
    modalManualWarningTitle: 'ध्यान दें:',
    modalManualWarningDesc: 'जब DocsPI बंद होता है, तो आपका डिवाइस पूरी तरह से इंटरनेट एक्सेस खो देगा। कनेक्शन बहाल करने के लिए, आपको अपनी Wi-Fi सेटिंग्स से प्रॉक्सी सेटिंग हटानी होगी।',
    modalPacQrCaption: 'QR → सेटअप पेज (स्कैन और कॉपी)',
    modalHost: 'सर्वर (Host)',
    modalPort: 'पोर्ट',
    modalTutorial: 'कैसे करें? (गाइड)',

    adminTitle: 'प्रशासक अनुमति आवश्यक',
    adminDesc: 'DocsPI को सही ढंग से काम करने के लिए प्रशासक के रूप में चलाने की आवश्यकता है।',
    adminStep: 'ऐप पर राइट-क्लिक करें → <strong>"Run as administrator"</strong> चुनें',
    adminClose: 'बंद करें',
    adminHowItWorks: 'यह कैसे काम करता है?',

    noInternetTitle: 'इंटरनेट कनेक्शन नहीं है',
    noInternetDesc: 'कृपया अपना इंटरनेट कनेक्शन जांचें।',
    noInternetRetry: 'पुनः प्रयास करें',

    logEngineStarting: (port) => `DocsPI इंजन शुरू हो रहा है (पोर्ट: ${port})...`,
    logDnsUsed: (name, ip) => `उपयोग किया गया DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: सिस्टम डिफॉल्ट',
    logConnected: 'कनेक्शन सफल! ट्रैफिक एन्क्रिप्टेड है।',
    logDisconnected: 'डिस्कनेक्ट हो गया।',
    logProxySet: (port) => `सिस्टम प्रॉक्सी सेट: 127.0.0.1:${port}`,
    logProxyCleared: 'सिस्टम प्रॉक्सी हटा दिया गया',
    logEngineStopped: (code) => `DocsPI इंजन अचानक रुक गया (कोड: ${code})`,
    logEngineStartError: (err) => `इंजन शुरू करने में विफल: ${err}`,
    logAutoReconnect: 'ऑटो-रीकनेक्ट सक्षम...',
    logReconnecting: (n) => `पुनः कनेक्ट हो रहा है... (प्रयास ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec} सेकंड में पुनः प्रयास कर रहा है... (प्रयास ${n}/5)`,
    logReconnectNow: 'अभी पुनः कनेक्ट हो रहा है...',
    logMaxRetries: 'कनेक्शन विफल। अधिकतम प्रयास पूरे हो गए।',
    logPossibleReasons: 'संभावित कारण:',
    logReasonInternet: 'आपका इंटरनेट डिस्कनेक्ट हो सकता है',
    logReasonFirewall: 'फ़ायरवॉल/एंटीवायरस DocsPI को ब्लॉक कर सकता है',
    logReasonPorts: 'पोर्ट 8080-8084 उपयोग में हो सकते हैं',
    logSolutions: 'सुझाए गए समाधान:',
    logSolInternet: 'अपना इंटरनेट कनेक्शन जांचें',
    logSolFirewall: 'अपनी फ़ायरवॉल सेटिंग्स जांचें',
    logSolAdmin: 'एप्लिकेशन को प्रशासक के रूप में चलाएं',
    logSolLogs: 'समर्थन के लिए लॉग कॉपी करें और साझा करें',
    logLanRestart: 'LAN शेयरिंग बदल गई, कनेक्शन रीस्टार्ट हो रहा है...',
    logDpiRestart: 'DPI मोड बदल गया, कनेक्शन रीस्टार्ट हो रहा है...',
    logEngineStoppedGrace: 'DocsPI इंजन बंद हो गया।',
    logServiceStopped: 'सेवा रुक गई।',
    logShutdownStarting: 'शटडाउन शुरू हो रहा है...',
    logProcessStopped: 'प्रक्रिया रुक गई।',
    logSpoofReady: (port) => `SpoofDPI इंजन शुरू हुआ (पोर्ट: ${port})`,
    logPacStarted: 'PAC सर्वर शुरू हुआ (LAN डिवाइस के लिए)',
    logPacStartError: (err) => `PAC सर्वर शुरू करने में विफल: ${err}`,
    logEngineActive: 'DocsPI इंजन सक्रिय है',
    logPortBusy: (port) => `पोर्ट ${port} व्यस्त है, दूसरा प्रयास कर रहा है...`,
    logInitializing: 'इंजन इनिशियलाइज़ हो रहा है...',
    logPortRetryOpen: (port) => `पोर्ट ${port} नहीं खोला जा सका, पुनः प्रयास कर रहा है...`,
    logProxyClearError: (err) => `प्रॉक्सी हटाने में विफल: ${err}`,
    logProxySetError: (err) => `प्रॉक्सी सेट करने में विफल: ${err}`,
    logServiceStopError: (err) => `सेवा रोकने में विफल: ${err}`,
    logConfigError: (err) => `कॉन्फ़िगरेशन त्रुटि: ${err}`,
    logAdminMissing: 'प्रशासक अनुमति गायब है! ऐप सही ढंग से काम नहीं कर सकता है।',
    logInternetBack: 'इंटरनेट कनेक्शन बहाल हो गया।',
    logInternetLost: 'इंटरनेट कनेक्शन टूट गया!',
    logPortRetry: (count) => `पोर्ट संघर्ष, नया पोर्ट प्रयास कर रहा है... (${count}/20)`,
    logNoPort: 'कोई उपलब्ध पोर्ट नहीं मिला।',
    logWinHttpEnabled: 'गेम मोड (WinHTTP) प्रॉक्सी टनल लागू की गई।',
    logWpcapMissing: 'SpoofDPI को wpcap.dll नहीं मिला। कृपया Npcap या WinPcap इंस्टॉल करें, फिर एप्लिकेशन रीस्टार्ट करें।',
    logAntivirusWarning: 'Windows Defender या आपके एंटीवायरस सॉफ़्टवेयर ने \'docspi-proxy.exe\' को ब्लॉक कर दिया होगा। कृपया फ़ाइल को अपनी एंटीवायरस बहिष्करण सूची में जोड़ें।',
    logFailsafePortClosed: 'पोर्ट टाइम आउट हो गया, कनेक्शन पुनः प्रयास कर रहा है...',

    settingsTitle: 'सेटिंग्स',

    sectionMethod: 'कनेक्शन विधि',
    sectionMethodWhy: 'सभी ISPs के लिए एक सेटिंग। LAN के माध्यम से सभी डिवाइस पर उपयोग करें। प्रॉक्सी-आधारित है इसलिए गेम में कोई पिंग/जिटर नहीं।',
    methodStrong: 'मजबूत मोड',
    methodStrongDesc: 'कठिन ISPs के लिए सबसे मजबूत बायपास (विलंबता जोड़ता है)',
    methodTurbo: 'टर्बो मोड',
    methodTurboDesc: 'न्यूनतम विलंबता, हल्के DPI के लिए',
    methodBalanced: 'संतुलित मोड (अनुशंसित)',
    methodBalancedDesc: 'तेज़ + मजबूत बायपास, अधिकांश ISPs पर काम करता है',

    sectionAdvanced: 'उन्नत',
    chunkSizeLabel: 'चंक आकार (chunk size)',
    chunkSizeDesc: 'नियंत्रित करता है कि HTTPS ट्रैफ़िक को कितने टुकड़ों में विभाजित किया जाए। आपके ISP के आधार पर, 4 या 16 तेज़ हो सकता है; 8 आमतौर पर संतुलित है (डिफ़ॉल्ट)।',
    chunkSize4: '4 — सबसे मजबूत (कुछ ISPs)',
    chunkSize8: '8 — संतुलित (डिफ़ॉल्ट)',
    chunkSize16: '16 — तेज़ (कुछ ISPs)',

    sectionNetwork: 'नेटवर्क सेटिंग्स',
    lanSharing: 'LAN शेयरिंग',
    lanSharingDesc: 'अन्य डिवाइस (फोन, कंसोल) से कनेक्शन की अनुमति दें',

    sectionAutomation: 'स्वचालन',
    autoConnect: 'ऑटो कनेक्ट',
    autoConnectDesc: 'ऐप खुलते ही कनेक्ट करें',
    autoReconnect: 'ऑटो रीकनेक्ट',
    autoReconnectDesc: 'कनेक्शन टूटने पर स्वचालित रूप से पुनः प्रयास करें',

    sectionGeneral: 'सामान्य',
    autoStart: 'बूट पर शुरू करें',
    autoStartDesc: 'Windows शुरू होने पर DocsPI लॉन्च करें',
    minimizeToTray: 'ट्रे में छोटा करें',
    minimizeToTrayDesc: 'बंद होने पर बैकग्राउंड में चलाएं',
    alwaysOnTop: 'हमेशा ऊपर रखें',
    alwaysOnTopDesc: 'विंडो अन्य सभी विंडोज़ के ऊपर रहती है',
    requireConfirmation: 'कार्रवाई की पुष्टि',
    requireConfirmationDesc: 'डिस्कनेक्ट करने या बाहर निकलने से पहले पूछें',
    language: 'भाषा',
    languageDesc: 'इंटरफ़ेस भाषा बदलें',

    sectionNotifications: 'सूचनाएं',
    notifications: 'डेस्कटॉप सूचनाएं',
    notificationsDesc: 'मुख्य सूचना स्विच (सभी सक्षम/अक्षम करें)',
    notifyOnConnect: 'कनेक्शन स्थापित होने पर',
    notifyOnConnectDesc: 'कनेक्शन सफलतापूर्वक सुरक्षित होने पर सूचित करें',
    notifyOnDisconnect: 'कनेक्शन टूटने पर',
    notifyOnDisconnectDesc: 'अपेक्षित गिरावट या मरम्मत पर सूचित करें',
    notifDisconnectManual: 'कनेक्शन सफलतापूर्वक समाप्त हो गया।',

    sectionDns: 'DNS सूची',
    dnsAutoSelect: 'ऑटो सेलेक्ट (अनुशंसित)',
    dnsAutoSelectDesc: 'स्वचालित रूप से सबसे तेज़ सर्वर ढूँढता है',
    dnsSystemDefault: 'सिस्टम डिफॉल्ट',
    dnsSystemDefaultDesc: 'SpoofDPI डिफॉल्ट DNS',
    dnsCfDesc: 'तेज़ और निजी',
    dnsAdguardDesc: 'विज्ञापन अवरोधक',
    dnsGoogleDesc: 'विश्वसनीय',
    dnsQuad9Desc: 'सुरक्षा केंद्रित',
    dnsOpenDnsDesc: 'Cisco द्वारा संचालित',
    dnsCheckSpeed: 'DNS पिंग टेस्ट',
    dnsChecking: 'माप रहा है...',

    driverStatusInstalled: 'उन्नत फ़िल्टरिंग सक्रिय',
    driverStatusMissing: 'यदि बायपास विफल रहता है तो उन्नत सुविधाओं को अनलॉक करें',
    driverInstallBtn: 'ड्राइवर इंस्टॉल करें (अनुशंसित)',
    driverIspWarning: 'यदि आपको कनेक्शन की समस्या है, तो आप ड्राइवर इंस्टॉल करके और भी उन्नत DPI बायपास सुविधाओं को अनलॉक कर सकते हैं।',

    // ISS Overlay (First Run)
    issOverlayTitle: 'अपने इंटरनेट प्रदाता का चयन करें',
    issOverlayDesc: 'हमें आपके ISP के लिए सर्वोत्तम सेटिंग्स ऑटो-लागू करने दें।',
    issOverlayApply: 'लागू करें और कनेक्ट करें',
    issOverlaySkip: 'छोड़ें',
    issProfileActive: 'प्रोफ़ाइल सक्रिय है',
    issProfileSee: 'अनुशंसित सेटिंग्स देखें',
    issApplyBtn: 'सेटिंग्स ऑटो लागू करें',
    issAppliedMsg: 'यह सेटिंग वर्तमान में उपयोग में है',

    // ISS Guide (Settings)
    issGuideTitle: 'ISP गाइड',
    issLightName: 'TurkNet',
    issLightDesc: 'हल्की फ़िल्टरिंग। टर्बो मोड गेम में कोई पिंग वृद्धि या गति हानि सुनिश्चित नहीं करता है।',
    issMidName: 'केवल कुछ ISPs',
    issMidDesc: 'मानक अवरोधन। मजबूत मोड विश्वसनीय पहुंच के लिए पैकेट विभाजित करता है।',
    issHeavyName: 'तुर्की प्रदाता (TT / Vodafone / Superonline)',
    issHeavyDesc: 'कठिन और स्मार्ट DPI डिवाइस का उपयोग किया जाता है। मजबूत मोड की आवश्यकता हो सकती है।',
    issChinaName: 'चीन (Great Firewall)',
    issChinaDesc: 'दुनिया के सबसे उन्नत DPI सिस्टम पर काबू पाने के लिए मजबूत मोड और कस्टम SNI सेटिंग्स की आवश्यकता हो सकती है।',
    issRussiaName: 'रूस (Roskomnadzor)',
    issRussiaDesc: 'जटिल अवरोधों के लिए मजबूत मोड की सिफारिश की जाती है।',
    issIndiaName: 'भारत',
    issIndiaDesc: 'मानक अवरोधों के लिए संतुलित मोड पर्याप्त है।',
    issUsaName: 'USA / ग्लोबल',
    issUsaDesc: 'हल्के प्रतिबंधों के लिए टर्बो मोड की सिफारिश की जाती है।',
    issGlobalName: 'ग्लोबल / अन्य',
    issGlobalDesc: 'सभी देशों के लिए सामान्य बायपास सेटिंग्स।',
    issOtherName: 'अन्य / अज्ञात',
    issOtherDesc: 'मजबूत मोड के साथ शुरू होता है। अधिकांश प्रदाताओं के साथ विश्वसनीय रूप से काम करता है।',

    // Bypass Settings
    sectionBypass: 'विस्तृत बायपास सेटिंग्स',
    modeTurboName: 'टर्बो मोड',
    modeTurboDesc: 'न्यूनतम विलंबता। हल्के फिल्टर को तुरंत बायपास करता है।',
    modeBalancedName: 'संतुलित मोड',
    modeBalancedDesc: 'तेज़ और स्थिर। मानक फिल्टर को बायपास करता है।',
    modeStrongName: 'मजबूत मोड',
    modeStrongDesc: 'नकली पैकेट के साथ कठिन DPI को बायपास करता है।',

    // Extra Network
    sectionExtraNetwork: 'अतिरिक्त नेटवर्क सेटिंग्स',
    ipv4ForceTitle: 'IPv4 के लिए मजबूर करें (अनुशंसित)',
    ipv4ForceDesc: 'अनंत लोडिंग और टाइमआउट त्रुटियों को रोकता है।',
    networkModeLabel: 'नेटवर्क मोड',
    modeSmooth: 'स्मूथ मोड',
    modeSmoothDesc: 'न्यूनतम विलंबता। ब्राउज़र और डिस्कॉर्ड के लिए आदर्श।',
    modeGame: 'गेम मोड',
    modeGameDesc: 'Roblox, UDP गेम और सभी ऐप्स। कर्नेल-स्तरीय बायपास।',
    modeSuper: 'सुपर मोड',
    modeSuperDesc: 'हाइब्रिड: स्मूथ + गेम संयुक्त। सबसे अच्छा संतुलन।',
    modeRequiresNpcap: 'Npcap ड्राइवर आवश्यक है',
    modeBadgeSmooth: 'स्मूथ',
    modeBadgeGame: 'गेम',
    modeBadgeSuper: 'सुपर',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'उन्नत सेटिंग्स',
    advancedNpcapDesc: 'भारी DPI उपायों वाले ISPs (Kablonet, Superonline आदि) को उन्नत पैकेट हेरफेर की आवश्यकता होती है।',
    advancedNpcapInstalled: 'Npcap इंस्टॉल है — उन्नत सुविधाएं सक्रिय हैं',
    advancedNpcapMissing: 'Npcap इंस्टॉल नहीं है — मजबूत मोड सीमित है',
    advancedNpcapInstallBtn: 'NPCAP ड्राइवर इंस्टॉल करें',
    advancedNpcapWhy: 'Npcap नेटवर्क पैकेट तक निम्न-स्तरीय पहुंच प्रदान करता है। यह नकली पैकेट इंजेक्शन जैसी उन्नत DPI बायपास तकनीकों को सक्षम बनाता।',
    advancedFeaturesToggle: 'उन्नत बायपास',
    advancedFeaturesToggleDesc: 'नकली पैकेट इंजेक्शन और उन्नत DPI बायपास तकनीकों को सक्षम करता है।',
    npcapRestartWarning: 'Npcap के काम करने के लिए आपको अपना कंप्यूटर रीस्टार्ट करना होगा।',
    logStrongFake: 'मजबूत मोड: नकली पैकेट (3) सक्रिय।',
    logStrongNoDriver: 'मजबूत मोड: कोई ड्राइवर नहीं, केवल चंक-1 सक्रिय।',
    logStrongChunkOnly: 'मजबूत मोड: चंक-1 सक्रिय।',
    logNpcapFallback: 'Npcap ड्राइवर जवाब नहीं दे रहा है। उन्नत बायपास अक्षम कर रहा है और पुनः प्रयास कर रहा है...',
    advancedNpcapHint: 'मजबूत बायपास के लिए Npcap ड्राइवर इंस्टॉल करें',

    sectionTroubleshoot: 'समस्या निवारण',
    fixInternet: 'इंटरनेट कनेक्शन ठीक करें',
    fixInternetDesc: 'यदि प्रॉक्सी अटक जाती है तो इंटरनेट ठीक करता है।',
    fixRepairing: 'मरम्मत हो रही है...',
    fixRepairingDesc: 'सिस्टम सेटिंग्स रीसेट की जा रही हैं, कृपया प्रतीक्षा करें।',
    fixDone: 'ठीक हो गया!',
    fixDoneDesc: 'प्रॉक्सी सेटिंग्स साफ़ कर दी गईं, इंटरनेट बहाल हो गया।',
    fixError: 'त्रुटि हुई!',
    fixErrorDesc: 'प्रक्रिया के दौरान कुछ गलत हो गया।',

    sectionDev: 'डेवलपर',
    devRole: 'DocsPI डेवलपर',
    devSubscribe: 'डिस्कॉर्ड',
    devSupport: 'गिटहब',

    sectionNotice: 'महत्वपूर्ण',
    noticeTitle: 'सुरक्षा और फाल्स पॉजिटिव',
    noticeDesc: 'DocsPI इंजन को कभी-कभी AI-आधारित प्रणालियों द्वारा "फाल्स पॉजिटिव" के रूप में चिह्नित किया जा सकता है। यह पूरी तरह से हानिरहित है।',

    // Dialogs
    confirmExitTitle: 'बाहर निकलें',
    confirmExitDesc: 'क्या आप वाकई DocsPI इंजन को रोकना और बाहर निकलना चाहते हैं?',
    confirmDisconnectTitle: 'डिस्कनेक्ट करें',
    confirmDisconnectDesc: 'क्या आप वाकई अपना सुरक्षित कनेक्शन समाप्त करना चाहते हैं?',

    // Settings Tabs
    tabGeneral: 'सामान्य',
    tabNetwork: 'नेटवर्क',
    tabNotification: 'सूचनाएं',
    tabSystem: 'सिस्टम',

    // ISP Detection
    ispDetected: (name) => `${name} पाया गया`,
    ispSuggestion: (profile) => `${profile} मोड अनुशंसित`,
    ispAutoSelected: 'आपका ISP स्वतः चुना गया था',

    // Connection Statistics
    statsUptime: 'अपटाइम',
    statsPing: 'पिंग',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `नया संस्करण उपलब्ध है: v${ver}`,
    updateDownload: 'डाउनलोड',
    updateDismiss: 'बाद में',

    // Custom Domain List
    sectionDomains: 'कस्टम डोमेन सूची',
    sectionDomainsDesc: 'ये डोमेन प्रॉक्सी को बायपास करते हैं (DIRECT कनेक्शन)।',
    domainAdd: 'जोड़ें',
    domainRemove: 'हटाएं',
    domainPlaceholder: 'उदा. *.example.com या site.com',
    domainEmpty: 'अभी तक कोई डोमेन नहीं जोड़ा गया है।',

    // Profile Saving
    sectionProfiles: 'सेटिंग्स प्रोफ़ाइल',
    sectionProfilesDesc: 'अपनी वर्तमान सेटिंग्स सहेजें और उन्हें एक क्लिक में लोड करें।',
    profileSave: 'वर्तमान सेटिंग्स सहेजें',
    profileSaveShort: 'सहेजें',
    profileLoad: 'लोड करें',
    profileDelete: 'हटाएं',
    profileName: 'प्रोफ़ाइल नाम दर्ज करें...',
    profileSaved: 'प्रोफ़ाइल सहेजी गई!',
    profileLoaded: 'प्रोफ़ाइल लोड की गई!',
    profileEmpty: 'अभी तक कोई प्रोफ़ाइल सहेजी नहीं गई है।',

    themeLabel: 'थीम',
    themeDark: 'डार्क',
    themeLight: 'लाइट',
    themeDarkDesc: 'डार्क थीम सक्रिय',
    themeLightDesc: 'लाइट थीम सक्रिय',

    bypassTestBtn: 'बायपास टेस्ट',
    bypassTestTesting: 'बायपास टेस्ट चल रहा है...',
    bypassTestSuccess: 'बायपास सक्रिय! कनेक्शन सफल।',
    bypassTestSuccessShort: 'सक्रिय',
    bypassTestFailed: 'बायपास काम नहीं कर रहा है। कनेक्शन विफल।',
    bypassTestFailedShort: 'विफल',
    bypassTestTimeout: 'बायपास टेस्ट का समय समाप्त हो गया।',

    autoEscalateLabel: 'ऑटो मोड एस्केलेशन',
    autoEscalateDesc: 'यदि कनेक्शन विफल रहता है तो मजबूत मोड पर स्विच करें',
    logAutoEscalate: (mode) => `कनेक्शन विफल, ${mode} मोड पर स्विच कर रहा है...`,
    logTrayModeChanged: (mode) => `ट्रे से मोड बदला गया: ${mode}`,

    statsTitle: 'कनेक्शन आँकड़े',
    statsTotalSessions: 'कुल सत्र',
    statsTotalUptime: 'कुल अपटाइम',
    statsMostUsedMode: 'सर्वाधिक प्रयुक्त मोड',
    statsAvgPing: 'औसत पिंग',
    statsReset: 'आँकड़े रीसेट करें',
    statsEmpty: 'अभी तक कोई रिकॉर्ड किया गया सत्र नहीं है',

    welcomeTitle: 'DocsPI में आपका स्वागत है',
    welcomeDesc: 'आप एक स्वतंत्र और सुरक्षित इंटरनेट की ओर अपना पहला कदम उठाने जा रहे हैं। हमारे पास आपके लिए सर्वोत्तम सेटिंग्स सेट करने के लिए कुछ छोटे चरण हैं।',
    welcomeNext: 'आइए शुरू करें',
    welcomePrivacy: 'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। आपका डेटा कभी रिकॉर्ड नहीं किया जाता है।',
    fakeSniLabel: 'Fake SNI',
    btnYes: '???',
    logFilterError: '?????????',
    logDirtyShutdownRecovery: '????? ??? ??????????? ??? ????????????? ?? ??? ??...',
    logFilterSuccess: '???',
    logFilterInfo: '???????',
    btnNo: '????',
    logFilterWarn: '??????????',
    logFilterAll: '???',
  },

  es: {
    appName: 'DOCSPI',
    statusActive: 'ACTIVO',
    statusInactive: 'APAGADO',
    statusReady: 'LISTO',

    statusConnected: 'SEGURO',
    statusConnecting: 'CONECTANDO...',
    statusDisconnecting: 'DESCONECTANDO...',
    statusReady2: 'LISTO',
    descConnected: 'Su conexión está cifrada y protegida.',
    descConnecting: 'Procesando, por favor espere.',
    descReady: 'Conéctese para bypass de DPI.',

    btnConnect: 'CONECTAR',
    btnDisconnect: 'DESCONECTAR',
    btnConnecting: 'CONECTANDO...',
    btnApplyingSettings: 'APLICANDO AJUSTES...',
    btnDisconnecting: 'DESCONECTANDO...',
    btnConnectDevices: 'Conectar otros dispositivos',

    navSettings: 'AJUSTES',
    navLogs: 'LOGS',
    navExit: 'SALIR',

    logsTitle: 'LOGS DEL SISTEMA',
    logsClear: 'LIMPIAR',
    logsCopy: 'COPIAR',
    logsCopied: '¡COPIADO!',
    logsCopyError: '¡ERROR!',

    modalTitle: 'Conectar dispositivo',
    modalSubtitle: 'Compartir por LAN',
    modalDesc: 'Vaya a los ajustes de Wi-Fi de su dispositivo, establezca el <strong>Proxy</strong> en <strong>Manual</strong> e ingrese los detalles a continuación.',
    modalDescPac: 'Se recomienda usar <strong>Automático (PAC)</strong> en otros dispositivos.',
    modalPacQrHint: 'Escanee el QR, copie la dirección y péguela en los ajustes de <strong>Wi-Fi → Proxy → URL automática</strong> de su dispositivo.<br><br><span class="text-red-500 font-semibold">IMPORTANTE:</span> Si experimenta problemas de red después de desconectar, apague y encienda el Wi-Fi de su dispositivo.',
    modalPacUrl: 'URL de PAC (Recomendado)',
    modalManualFallback: 'Alternativa: Proxy manual',
    modalTabPac: 'Automático (PAC)',
    modalTabManual: 'Manual',
    modalPacStep1Title: '1. Abrir guía de configuración',
    modalPacStep1Desc: 'Escanee el código QR con su cámara para abrir la guía paso a paso.',
    modalPacStep2Title: '2. Copiar dirección PAC',
    modalPacStep2Desc: 'Pegue este código en el campo "URL automática" que se muestra en la guía:',
    modalPacWarningTitle: 'ATENCIÓN:',
    modalPacWarningDesc: 'Si aplicaciones como YouTube pierden el acceso a Internet después de cerrar DocsPI (debido a conexiones en caché), simplemente reinicie el Wi-Fi de su dispositivo.',
    modalManualWarningTitle: 'ATENCIÓN:',
    modalManualWarningDesc: 'Cuando DocsPI está cerrado, su dispositivo perderá completamente el acceso a Internet. Para restaurar la conexión, debe eliminar el ajuste de Proxy de sus ajustes de Wi-Fi.',
    modalPacQrCaption: 'QR → Página de configuración (escanear y copiar)',
    modalHost: 'Servidor (Host)',
    modalPort: 'Puerto',
    modalTutorial: '¿Cómo hacerlo? (Guía)',

    adminTitle: 'Se requiere administrador',
    adminDesc: 'DocsPI necesita ejecutarse como administrador para funcionar correctamente.',
    adminStep: 'Clic derecho en la app → Seleccione <strong>"Ejecutar como administrador"</strong>',
    adminClose: 'CERRAR',
    adminHowItWorks: '¿Cómo funciona?',

    noInternetTitle: 'Sin conexión a Internet',
    noInternetDesc: 'Por favor, compruebe su conexión a Internet.',
    noInternetRetry: 'Reintentar',

    logEngineStarting: (port) => `Iniciando motor DocsPI (Puerto: ${port})...`,
    logDnsUsed: (name, ip) => `DNS usado: ${name} (${ip})`,
    logDnsDefault: 'DNS: Predeterminado del sistema',
    logConnected: '¡Conexión exitosa! El tráfico está cifrado.',
    logDisconnected: 'Desconectado.',
    logProxySet: (port) => `Proxy del sistema configurado: 127.0.0.1:${port}`,
    logProxyCleared: 'Proxy del sistema limpiado',
    logEngineStopped: (code) => `El motor DocsPI se detuvo inesperadamente (Código: ${code})`,
    logEngineStartError: (err) => `Error al iniciar el motor: ${err}`,
    logAutoReconnect: 'Reconexión automática activada...',
    logReconnecting: (n) => `Reconectando... (Intento ${n}/5)`,
    logReconnectWait: (sec, n) => `Reintentando en ${sec} segundos... (Intento ${n}/5)`,
    logReconnectNow: 'Reconectando ahora...',
    logMaxRetries: 'Error de conexión. Se alcanzó el máximo de intentos.',
    logPossibleReasons: 'Posibles razones:',
    logReasonInternet: 'Su Internet podría estar desconectado',
    logReasonFirewall: 'El Firewall/Antivirus podría estar bloqueando DocsPI',
    logReasonPorts: 'Los puertos 8080-8084 podrían estar en uso',
    logSolutions: 'Soluciones sugeridas:',
    logSolInternet: 'Compruebe su conexión a Internet',
    logSolFirewall: 'Compruebe sus ajustes de firewall',
    logSolAdmin: 'Ejecute la aplicación como administrador',
    logSolLogs: 'Copie y comparta los logs para soporte',
    logLanRestart: 'Compartir LAN cambiado, reiniciando conexión...',
    logDpiRestart: 'Modo DPI cambiado, reiniciando conexión...',
    logEngineStoppedGrace: 'Motor DocsPI detenido.',
    logServiceStopped: 'Servicio detenido.',
    logShutdownStarting: 'Iniciando apagado...',
    logProcessStopped: 'Proceso detenido.',
    logSpoofReady: (port) => `Motor SpoofDPI iniciado (Puerto: ${port})`,
    logPacStarted: 'Servidor PAC iniciado (para dispositivos LAN)',
    logPacStartError: (err) => `Error al iniciar el servidor PAC: ${err}`,
    logEngineActive: 'Motor DocsPI activo',
    logPortBusy: (port) => `El puerto ${port} está ocupado, intentando otro...`,
    logInitializing: 'El motor se está inicializando...',
    logPortRetryOpen: (port) => `No se pudo abrir el puerto ${port}, reintentando...`,
    logProxyClearError: (err) => `Error al limpiar proxy: ${err}`,
    logProxySetError: (err) => `Error al configurar proxy: ${err}`,
    logServiceStopError: (err) => `Error al detener el servicio: ${err}`,
    logConfigError: (err) => `Error de configuración: ${err}`,
    logAdminMissing: '¡Falta permiso de administrador! La app podría no funcionar correctamente.',
    logInternetBack: 'Conexión a Internet restaurada.',
    logInternetLost: '¡Conexión a Internet perdida!',
    logPortRetry: (count) => `Conflicto de puerto, intentando nuevo puerto... (${count}/20)`,
    logNoPort: 'No se encontró ningún puerto disponible.',
    logWinHttpEnabled: 'Túnel proxy de Modo Juego (WinHTTP) aplicado.',
    logWpcapMissing: 'SpoofDPI no pudo encontrar wpcap.dll. Por favor, instale Npcap o WinPcap, luego reinicie la aplicación.',
    logAntivirusWarning: 'Windows Defender o su software antivirus pueden haber bloqueado \'docspi-proxy.exe\'. Por favor, añada el archivo a su lista de exclusiones.',
    logFailsafePortClosed: 'Tiempo de espera del puerto agotado, reintentando conexión...',

    settingsTitle: 'AJUSTES',

    sectionMethod: 'MÉTODO DE CONEXIÓN',
    sectionMethodWhy: 'Un solo ajuste para todos los ISP. Úselo en todos los dispositivos vía LAN. Basado en proxy, por lo que no hay ping/jitter en juegos.',
    methodStrong: 'Modo Fuerte',
    methodStrongDesc: 'El bypass más fuerte para ISP difíciles (añade latencia)',
    methodTurbo: 'Modo Turbo',
    methodTurboDesc: 'Latencia mínima, para DPI ligero',
    methodBalanced: 'Modo Equilibrado (Recomendado)',
    methodBalancedDesc: 'Bypass rápido + fuerte, funciona en la mayoría de los ISP',

    sectionAdvanced: 'AVANZADO',
    chunkSizeLabel: 'Tamaño de fragmento (chunk size)',
    chunkSizeDesc: 'Controla en cuántas piezas se divide el tráfico HTTPS. Según su ISP, 4 o 16 pueden ser más rápidos; 8 suele estar equilibrado (predeterminado).',
    chunkSize4: '4 — Más fuerte (algunos ISP)',
    chunkSize8: '8 — Equilibrado (predeterminado)',
    chunkSize16: '16 — Más rápido (algunos ISP)',

    sectionNetwork: 'AJUSTES DE RED',
    lanSharing: 'Compartir por LAN',
    lanSharingDesc: 'Permitir conexiones desde otros dispositivos (Móvil, Consola)',

    sectionAutomation: 'AUTOMATIZACIÓN',
    autoConnect: 'Conexión automática',
    autoConnectDesc: 'Conectar tan pronto como se abra la app',
    autoReconnect: 'Reconexión automática',
    autoReconnectDesc: 'Reintentar automáticamente si se cae la conexión',

    sectionGeneral: 'GENERAL',
    autoStart: 'Iniciar al arrancar',
    autoStartDesc: 'Lanzar DocsPI cuando Windows inicie',
    minimizeToTray: 'Minimizar a la bandeja',
    minimizeToTrayDesc: 'Ejecutar en segundo plano al cerrar',
    alwaysOnTop: 'Siempre encima',
    alwaysOnTopDesc: 'La ventana siempre se mantiene sobre otras ventanas',
    requireConfirmation: 'Confirmación de acción',
    requireConfirmationDesc: 'Preguntar antes de desconectar o salir',
    language: 'IDIOMA',
    languageDesc: 'Cambiar el idioma de la interfaz',

    sectionNotifications: 'NOTIFICACIONES',
    notifications: 'Notificaciones de escritorio',
    notificationsDesc: 'Interruptor principal de notificaciones (Activar/Desactivar todo)',
    notifyOnConnect: 'Al establecer la conexión',
    notifyOnConnectDesc: 'Notificar cuando la conexión se asegure con éxito',
    notifyOnDisconnect: 'Al perder la conexión',
    notifyOnDisconnectDesc: 'Notificar en caídas inesperadas o reparaciones',
    notifDisconnectManual: 'Conexión terminada con éxito.',

    sectionDns: 'LISTA DE DNS',
    dnsAutoSelect: 'Selección automática (Recomendado)',
    dnsAutoSelectDesc: 'Encuentra automáticamente el servidor más rápido',
    dnsSystemDefault: 'Predeterminado del sistema',
    dnsSystemDefaultDesc: 'DNS predeterminado de SpoofDPI',
    dnsCfDesc: 'Rápido y privado',
    dnsAdguardDesc: 'Bloqueador de anuncios',
    dnsGoogleDesc: 'Confiable',
    dnsQuad9Desc: 'Enfocado en seguridad',
    dnsOpenDnsDesc: 'Potenciado por Cisco',
    dnsCheckSpeed: 'Prueba de ping DNS',
    dnsChecking: 'Midiendo...',

    driverStatusInstalled: 'Filtrado avanzado activo',
    driverStatusMissing: 'Desbloquee funciones avanzadas si falla el bypass',
    driverInstallBtn: 'INSTALAR CONTROLADOR (RECOMENDADO)',
    driverIspWarning: 'Si tiene problemas de conexión, puede desbloquear funciones de bypass de DPI mucho más avanzadas instalando el controlador.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Seleccione su proveedor de Internet',
    issOverlayDesc: 'Permítanos aplicar automáticamente los mejores ajustes para su ISP.',
    issOverlayApply: 'APLICAR Y CONECTAR',
    issOverlaySkip: 'Omitir',
    issProfileActive: 'Perfil activo',
    issProfileSee: 'Ver ajustes recomendados',
    issApplyBtn: 'Auto aplicar ajustes',
    issAppliedMsg: 'Este ajuste está actualmente en uso',

    // ISS Guide (Settings)
    issGuideTitle: 'GUÍA DE ISP',
    issLightName: 'TurkNet',
    issLightDesc: 'Filtrado ligero. El Modo Turbo asegura que no haya aumento de ping ni pérdida de velocidad.',
    issMidName: 'Solo algunos ISP',
    issMidDesc: 'Bloqueo estándar. El Modo Fuerte divide paquetes para un acceso confiable.',
    issHeavyName: 'Proveedores turcos (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Se utilizan dispositivos DPI potentes e inteligentes. Puede requerir Modo Fuerte.',
    issChinaName: 'China (Great Firewall)',
    issChinaDesc: 'Superar el sistema DPI más avanzado del mundo puede requerir Modo Fuerte y ajustes de SNI personalizados.',
    issRussiaName: 'Rusia (Roskomnadzor)',
    issRussiaDesc: 'Se recomienda Modo Fuerte para bloqueos complejos.',
    issIndiaName: 'India',
    issIndiaDesc: 'El Modo Equilibrado es suficiente para bloqueos estándar.',
    issUsaName: 'EE. UU. / Global',
    issUsaDesc: 'Se recomienda Modo Turbo para restricciones ligeras.',
    issGlobalName: 'Global / Otros',
    issGlobalDesc: 'Ajustes generales de bypass para todos los países.',
    issOtherName: 'Otro / Desconocido',
    issOtherDesc: 'Comienza con Modo Fuerte. Funciona de forma confiable con la mayoría de los proveedores.',

    // Bypass Settings
    sectionBypass: 'AJUSTES DETALLADOS DE BYPASS',
    modeTurboName: 'Modo Turbo',
    modeTurboDesc: 'Latencia mínima. Supera filtros ligeros al instante.',
    modeBalancedName: 'Modo Equilibrado',
    modeBalancedDesc: 'Rápido y estable. Supera filtros estándar.',
    modeStrongName: 'Modo Fuerte',
    modeStrongDesc: 'Supera DPI difíciles con paquetes falsos.',

    // Extra Network
    sectionExtraNetwork: 'AJUSTES DE RED EXTRA',
    ipv4ForceTitle: 'Forzar IPv4 (Recomendado)',
    ipv4ForceDesc: 'Evita la carga infinita y los errores de tiempo de espera.',
    networkModeLabel: 'Modo de Red',
    modeSmooth: 'Modo Fluido',
    modeSmoothDesc: 'Latencia mínima. Ideal para navegadores y Discord.',
    modeGame: 'Modo Juego',
    modeGameDesc: 'Roblox, juegos UDP y todas las apps. Bypass a nivel de kernel.',
    modeSuper: 'Modo Súper',
    modeSuperDesc: 'Híbrido: Fluido + Juego combinados. El mejor equilibrio.',
    modeRequiresNpcap: 'Se requiere controlador Npcap',
    modeBadgeSmooth: 'Fluido',
    modeBadgeGame: 'Juego',
    modeBadgeSuper: 'Súper',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'AJUSTES AVANZADOS',
    advancedNpcapDesc: 'Los ISP con medidas de DPI pesadas (Kablonet, Superonline, etc.) requieren manipulación avanzada de paquetes.',
    advancedNpcapInstalled: 'Npcap instalado — Funciones avanzadas activas',
    advancedNpcapMissing: 'Npcap no instalado — Modo fuerte limitado',
    advancedNpcapInstallBtn: 'INSTALAR CONTROLADOR NPCAP',
    advancedNpcapWhy: 'Npcap proporciona acceso de bajo nivel a los paquetes de red. Esto permite técnicas avanzadas de bypass de DPI.',
    advancedFeaturesToggle: 'Bypass avanzado',
    advancedFeaturesToggleDesc: 'Permite la inyección de paquetes falsos y técnicas avanzadas de bypass de DPI.',
    npcapRestartWarning: 'Necesita reiniciar su ordenador para que Npcap funcione.',
    logStrongFake: 'Modo Fuerte: Paquete Falso (3) activo.',
    logStrongNoDriver: 'Modo Fuerte: Sin controlador, solo Chunk-1 activo.',
    logStrongChunkOnly: 'Modo Fuerte: Chunk-1 activo.',
    logNpcapFallback: 'El controlador Npcap no responde. Desactivando bypass avanzado y reintentando...',
    advancedNpcapHint: 'Instale el controlador Npcap para un bypass más fuerte',

    sectionTroubleshoot: 'SOLUCIÓN DE PROBLEMAS',
    fixInternet: 'Reparar conexión a Internet',
    fixInternetDesc: 'Repara Internet si el proxy se queda atascado.',
    fixRepairing: 'Reparando...',
    fixRepairingDesc: 'Restableciendo ajustes del sistema, por favor espere.',
    fixDone: '¡Reparado!',
    fixDoneDesc: 'Ajustes de proxy limpiados, Internet restaurado.',
    fixError: '¡Ocurrió un error!',
    fixErrorDesc: 'Algo salió mal durante el proceso.',

    sectionDev: 'DESARROLLADOR',
    devRole: 'Desarrollador de DocsPI',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'IMPORTANTE',
    noticeTitle: 'Seguridad y Falsos Positivos',
    noticeDesc: 'El motor DocsPI a veces puede ser marcado como "falso positivo" por sistemas basados en IA. Esto es completamente inofensivo.',

    // Dialogs
    confirmExitTitle: 'Salir',
    confirmExitDesc: '¿Está seguro de que desea detener el motor DocsPI y salir?',
    confirmDisconnectTitle: 'Desconectar',
    confirmDisconnectDesc: '¿Está seguro de que desea terminar su conexión segura?',

    // Settings Tabs
    tabGeneral: 'GENERAL',
    tabNetwork: 'RED',
    tabNotification: 'ALERTAS',
    tabSystem: 'SISTEMA',

    // ISP Detection
    ispDetected: (name) => `${name} detectado`,
    ispSuggestion: (profile) => `Modo ${profile} recomendado`,
    ispAutoSelected: 'Su ISP fue seleccionado automáticamente',

    // Connection Statistics
    statsUptime: 'Tiempo activo',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `Nueva versión disponible: v${ver}`,
    updateDownload: 'Descargar',
    updateDismiss: 'Después',

    // Custom Domain List
    sectionDomains: 'LISTA DE DOMINIOS PERSONALIZADA',
    sectionDomainsDesc: 'Estos dominios evitan el proxy (conexión DIRECTA).',
    domainAdd: 'Añadir',
    domainRemove: 'Eliminar',
    domainPlaceholder: 'ej. *.example.com o sitio.com',
    domainEmpty: 'Aún no se han añadido dominios.',

    // Profile Saving
    sectionProfiles: 'PERFILES DE AJUSTES',
    sectionProfilesDesc: 'Guarde sus ajustes actuales y cárguelos con un clic.',
    profileSave: 'Guardar ajustes actuales',
    profileSaveShort: 'Guardar',
    profileLoad: 'Cargar',
    profileDelete: 'Eliminar',
    profileName: 'Ingrese nombre del perfil...',
    profileSaved: '¡Perfil guardado!',
    profileLoaded: '¡Perfil cargado!',
    profileEmpty: 'Aún no hay perfiles guardados.',

    themeLabel: 'Tema',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    themeDarkDesc: 'Tema oscuro activo',
    themeLightDesc: 'Tema claro activo',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Ejecutando prueba de bypass...',
    bypassTestSuccess: '¡Bypass activo! Conexión exitosa.',
    bypassTestSuccessShort: 'Activo',
    bypassTestFailed: 'Bypass no funciona. Conexión fallida.',
    bypassTestFailedShort: 'Falló',
    bypassTestTimeout: 'La prueba de bypass agotó el tiempo de espera.',

    autoEscalateLabel: 'Escalada de modo automática',
    autoEscalateDesc: 'Cambiar a un modo más fuerte si la conexión falla',
    logAutoEscalate: (mode) => `Conexión fallida, cambiando a modo ${mode}...`,
    logTrayModeChanged: (mode) => `Modo cambiado desde la bandeja: ${mode}`,

    statsTitle: 'Estadísticas de conexión',
    statsTotalSessions: 'Sesiones totales',
    statsTotalUptime: 'Tiempo total',
    statsMostUsedMode: 'Modo más usado',
    statsAvgPing: 'Ping promedio',
    statsReset: 'Reiniciar estadísticas',
    statsEmpty: 'Aún no hay sesiones registradas',

    welcomeTitle: 'Bienvenido a DocsPI',
    welcomeDesc: 'Está a punto de dar su primer paso hacia un Internet libre y seguro. Tenemos unos breves pasos para configurar los mejores ajustes para usted.',
    welcomeNext: 'Empecemos',
    welcomePrivacy: 'Su privacidad es importante para nosotros. Sus datos nunca se registran.',
    fakeSniLabel: 'Fake SNI',
    btnYes: 'S�',
    logFilterError: 'Errores',
    logDirtyShutdownRecovery: 'El apagado anterior fue inesperado. Recuperando...',
    logFilterSuccess: '�xito',
    logFilterInfo: 'Info',
    btnNo: 'No',
    logFilterWarn: 'Advertencias',
    logFilterAll: 'Todos',
  },

  fr: {
    appName: 'DOCSPI',
    statusActive: 'ACTIF',
    statusInactive: 'DÉSACTIVÉ',
    statusReady: 'PRÊT',

    statusConnected: 'SÉCURISÉ',
    statusConnecting: 'CONNEXION...',
    statusDisconnecting: 'DÉCONNEXION...',
    statusReady2: 'PRÊT',
    descConnected: 'Votre connexion est chiffrée et protégée.',
    descConnecting: 'Traitement en cours, veuillez patienter.',
    descReady: 'Connectez-vous pour le contournement DPI.',

    btnConnect: 'CONNECTER',
    btnDisconnect: 'DÉCONNECTER',
    btnConnecting: 'CONNEXION...',
    btnApplyingSettings: 'APPLICATION DES PARAMÈTRES...',
    btnDisconnecting: 'DÉCONNEXION...',
    btnConnectDevices: 'Connecter d\'autres appareils',

    navSettings: 'PARAMÈTRES',
    navLogs: 'LOGS',
    navExit: 'QUITTER',

    logsTitle: 'LOGS DU SYSTÈME',
    logsClear: 'EFFACER',
    logsCopy: 'COPIER',
    logsCopied: 'COPIÉ !',
    logsCopyError: 'ERREUR !',

    modalTitle: 'Connecter un appareil',
    modalSubtitle: 'Partage LAN',
    modalDesc: 'Allez dans les paramètres Wi-Fi de votre appareil, réglez le <strong>Proxy</strong> sur <strong>Manuel</strong> et entrez les détails ci-dessous.',
    modalDescPac: 'L\'utilisation du <strong>PAC automatique</strong> est recommandée sur les autres appareils.',
    modalPacQrHint: 'Scannez le QR, copiez l\'adresse et collez-la dans les paramètres <strong>Wi-Fi → Proxy → URL automatique</strong> de votre appareil.<br><br><span class="text-red-500 font-semibold">IMPORTANT :</span> Si vous rencontrez des problèmes réseau après la déconnexion, éteignez et rallumez le Wi-Fi de votre appareil.',
    modalPacUrl: 'Adresse PAC (Recommandé)',
    modalManualFallback: 'Alternative : Proxy manuel',
    modalTabPac: 'Automatique (PAC)',
    modalTabManual: 'Manuel',
    modalPacStep1Title: '1. Ouvrir le guide d\'installation',
    modalPacStep1Desc: 'Scannez le code QR avec votre appareil photo pour ouvrir le guide étape par étape.',
    modalPacStep2Title: '2. Copier l\'adresse PAC',
    modalPacStep2Desc: 'Collez ce code dans le champ "URL automatique" affiché dans le guide :',
    modalPacWarningTitle: 'ATTENTION :',
    modalPacWarningDesc: 'Si des applications comme YouTube perdent l\'accès à Internet après la fermeture de DocsPI (en raison des connexions en cache), redémarrez simplement le Wi-Fi de votre appareil.',
    modalManualWarningTitle: 'ATTENTION :',
    modalManualWarningDesc: 'Lorsque DocsPI est fermé, votre appareil perdra complètement l\'accès à Internet. Pour restaurer la connexion, vous devez supprimer le paramètre Proxy de vos réglages Wi-Fi.',
    modalPacQrCaption: 'QR → Page d\'installation (scanner et copier)',
    modalHost: 'Hôte (Host)',
    modalPort: 'Port',
    modalTutorial: 'Comment faire ? (Guide)',

    adminTitle: 'Administrateur requis',
    adminDesc: 'DocsPI doit être exécuté en tant qu\'administrateur pour fonctionner correctement.',
    adminStep: 'Clic droit sur l\'application → Sélectionnez <strong>"Exécuter en tant qu\'administrateur"</strong>',
    adminClose: 'FERMER',
    adminHowItWorks: 'Comment ça marche ?',

    noInternetTitle: 'Pas de connexion Internet',
    noInternetDesc: 'Veuillez vérifier votre connexion Internet.',
    noInternetRetry: 'Réessayer',

    logEngineStarting: (port) => `Démarrage du moteur DocsPI (Port : ${port})...`,
    logDnsUsed: (name, ip) => `DNS utilisé : ${name} (${ip})`,
    logDnsDefault: 'DNS : Par défaut du système',
    logConnected: 'Connexion réussie ! Le trafic est chiffré.',
    logDisconnected: 'Déconnecté.',
    logProxySet: (port) => `Proxy système configuré : 127.0.0.1:${port}`,
    logProxyCleared: 'Proxy système effacé',
    logEngineStopped: (code) => `Le moteur DocsPI s'est arrêté de manière inattendue (Code : ${code})`,
    logEngineStartError: (err) => `Échec du démarrage du moteur : ${err}`,
    logAutoReconnect: 'Reconnexion automatique activée...',
    logReconnecting: (n) => `Reconnexion... (Tentative ${n}/5)`,
    logReconnectWait: (sec, n) => `Nouvelle tentative dans ${sec} secondes... (Tentative ${n}/5)`,
    logReconnectNow: 'Reconnexion en cours...',
    logMaxRetries: 'Échec de la connexion. Nombre maximum de tentatives atteint.',
    logPossibleReasons: 'Raisons possibles :',
    logReasonInternet: 'Votre connexion Internet est peut-être coupée',
    logReasonFirewall: 'Le pare-feu/antivirus bloque peut-être DocsPI',
    logReasonPorts: 'Les ports 8080-8084 sont peut-être utilisés',
    logSolutions: 'Solutions suggérées :',
    logSolInternet: 'Vérifiez votre connexion Internet',
    logSolFirewall: 'Vérifiez vos paramètres de pare-feu',
    logSolAdmin: 'Exécutez l\'application en tant qu\'administrateur',
    logSolLogs: 'Copiez et partagez les logs pour obtenir de l\'aide',
    logLanRestart: 'Le partage LAN a changé, redémarrage de la connexion...',
    logDpiRestart: 'Le mode DPI a changé, redémarrage de la connexion...',
    logEngineStoppedGrace: 'Moteur DocsPI arrêté.',
    logServiceStopped: 'Service arrêté.',
    logShutdownStarting: 'Arrêt en cours...',
    logProcessStopped: 'Processus arrêté.',
    logSpoofReady: (port) => `Moteur SpoofDPI démarré (Port : ${port})`,
    logPacStarted: 'Serveur PAC démarré (pour les appareils LAN)',
    logPacStartError: (err) => `Échec du démarrage du serveur PAC : ${err}`,
    logEngineActive: 'Moteur DocsPI actif',
    logPortBusy: (port) => `Le port ${port} est occupé, tentative sur un autre port...`,
    logInitializing: 'Initialisation du moteur...',
    logPortRetryOpen: (port) => `Impossible d'ouvrir le port ${port}, nouvelle tentative...`,
    logProxyClearError: (err) => `Erreur lors de l'effacement du proxy : ${err}`,
    logProxySetError: (err) => `Erreur lors de la configuration du proxy : ${err}`,
    logServiceStopError: (err) => `Erreur lors de l'arrêt du service : ${err}`,
    logConfigError: (err) => `Erreur de configuration : ${err}`,
    logAdminMissing: 'Autorisation d\'administrateur manquante ! L\'application peut ne pas fonctionner correctement.',
    logInternetBack: 'Connexion Internet rétablie.',
    logInternetLost: 'Connexion Internet perdue !',
    logPortRetry: (count) => `Conflit de port, tentative sur un nouveau port... (${count}/20)`,
    logNoPort: 'Aucun port disponible trouvé.',
    logWinHttpEnabled: 'Tunnel proxy Mode Jeu (WinHTTP) appliqué.',
    logWpcapMissing: 'SpoofDPI n\'a pas trouvé wpcap.dll. Veuillez installer Npcap ou WinPcap, puis redémarrez l\'application.',
    logAntivirusWarning: 'Windows Defender ou votre antivirus a peut-être bloqué \'docspi-proxy.exe\'. Veuillez ajouter le fichier à votre liste d\'exclusions.',
    logFailsafePortClosed: 'Le port a expiré, nouvelle tentative de connexion...',

    settingsTitle: 'PARAMÈTRES',

    sectionMethod: 'MÉTHODE DE CONNEXION',
    sectionMethodWhy: 'Un seul paramètre pour tous les FAI. Utilisez sur tous les appareils via LAN. Basé sur un proxy, donc pas de ping/jitter dans les jeux.',
    methodStrong: 'Mode Fort',
    methodStrongDesc: 'Contournement le plus fort pour les FAI difficiles (ajoute de la latence)',
    methodTurbo: 'Mode Turbo',
    methodTurboDesc: 'Latence minimale, pour un DPI léger',
    methodBalanced: 'Mode Équilibré (Recommandé)',
    methodBalancedDesc: 'Contournement rapide + fort, fonctionne sur la plupart des FAI',

    sectionAdvanced: 'AVANCÉ',
    chunkSizeLabel: 'Taille du morceau (chunk size)',
    chunkSizeDesc: 'Contrôle en combien de morceaux le trafic HTTPS est divisé. Selon votre FAI, 4 ou 16 peut être plus rapide ; 8 est généralement équilibré (par défaut).',
    chunkSize4: '4 — Plus fort (certains FAI)',
    chunkSize8: '8 — Équilibré (par défaut)',
    chunkSize16: '16 — Plus rapide (certains FAI)',

    sectionNetwork: 'RÉSEAU',
    lanSharing: 'Partage LAN',
    lanSharingDesc: 'Autoriser les connexions depuis d\'autres appareils (Téléphone, Console)',

    sectionAutomation: 'AUTOMATISATION',
    autoConnect: 'Connexion automatique',
    autoConnectDesc: 'Se connecter dès l\'ouverture de l\'application',
    autoReconnect: 'Reconnexion automatique',
    autoReconnectDesc: 'Réessayer automatiquement si la connexion est coupée',

    sectionGeneral: 'GÉNÉRAL',
    autoStart: 'Démarrer au boot',
    autoStartDesc: 'Lancer DocsPI au démarrage de Windows',
    minimizeToTray: 'Réduire dans la barre des tâches',
    minimizeToTrayDesc: 'S\'exécute en arrière-plan une fois fermé',
    alwaysOnTop: 'Toujours au-dessus',
    alwaysOnTopDesc: 'La fenêtre reste au-dessus de toutes les autres fenêtres',
    requireConfirmation: 'Confirmation d\'action',
    requireConfirmationDesc: 'Demander avant de déconnecter ou de quitter',
    language: 'LANGUE',
    languageDesc: 'Changer la langue de l\'interface',

    sectionNotifications: 'NOTIFICATIONS',
    notifications: 'Notifications de bureau',
    notificationsDesc: 'Interrupteur principal des notifications (Activer/Désactiver tout)',
    notifyOnConnect: 'Lors de l\'établissement de la connexion',
    notifyOnConnectDesc: 'Notifier lorsque la connexion est sécurisée avec succès',
    notifyOnDisconnect: 'Lors de la perte de connexion',
    notifyOnDisconnectDesc: 'Notifier en cas de coupures inattendues ou de réparations',
    notifDisconnectManual: 'Connexion terminée avec succès.',

    sectionDns: 'LISTE DNS',
    dnsAutoSelect: 'Sélection automatique (Recommandé)',
    dnsAutoSelectDesc: 'Trouve automatiquement le serveur le plus rapide',
    dnsSystemDefault: 'Par défaut du système',
    dnsSystemDefaultDesc: 'DNS par défaut de SpoofDPI',
    dnsCfDesc: 'Rapide et privé',
    dnsAdguardDesc: 'Bloqueur de publicités',
    dnsGoogleDesc: 'Fiable',
    dnsQuad9Desc: 'Axé sur la sécurité',
    dnsOpenDnsDesc: 'Propulsé par Cisco',
    dnsCheckSpeed: 'Test de ping DNS',
    dnsChecking: 'Mesure en cours...',

    driverStatusInstalled: 'Filtrage avancé actif',
    driverStatusMissing: 'Débloquez les fonctionnalités avancées si le contournement échoue',
    driverInstallBtn: 'INSTALLER LE PILOTE (RECOMMANDÉ)',
    driverIspWarning: 'Si vous avez des problèmes de connexion, vous pouvez débloquer des fonctionnalités de contournement DPI beaucoup plus avancées en installant le pilote.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Sélectionnez votre fournisseur d\'accès',
    issOverlayDesc: 'Laissez-nous appliquer automatiquement les meilleurs paramètres pour votre FAI.',
    issOverlayApply: 'APPLIQUER & CONNECTER',
    issOverlaySkip: 'Passer',
    issProfileActive: 'Profil actif',
    issProfileSee: 'Voir les paramètres recommandés',
    issApplyBtn: 'Appliquer les paramètres automatiquement',
    issAppliedMsg: 'Ce paramètre est actuellement utilisé',

    // ISS Guide (Settings)
    issGuideTitle: 'GUIDE FAI',
    issLightName: 'TurkNet',
    issLightDesc: 'Filtrage léger. Le Mode Turbo garantit qu\'il n\'y a pas d\'augmentation du ping ni de perte de vitesse.',
    issMidName: 'Certains FAI seulement',
    issMidDesc: 'Blocage standard. Le Mode Fort divise les paquets pour un accès fiable.',
    issHeavyName: 'Fournisseurs turcs (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Des dispositifs DPI puissants et intelligents sont utilisés. Peut nécessiter le Mode Fort.',
    issChinaName: 'Chine (Great Firewall)',
    issChinaDesc: 'Surmonter le système DPI le plus avancé au monde peut nécessiter le Mode Fort et des paramètres SNI personnalisés.',
    issRussiaName: 'Russie (Roskomnadzor)',
    issRussiaDesc: 'Le Mode Fort est recommandé pour les blocages complexes.',
    issIndiaName: 'Inde',
    issIndiaDesc: 'Le Mode Équilibré est suffisant pour les blocages standards.',
    issUsaName: 'USA / Global',
    issUsaDesc: 'Le Mode Turbo est recommandé pour les restrictions légères.',
    issGlobalName: 'Global / Autre',
    issGlobalDesc: 'Paramètres de contournement généraux pour tous les pays.',
    issOtherName: 'Autre / Inconnu',
    issOtherDesc: 'Commence par le Mode Fort. Fonctionne de manière fiable avec la plupart des fournisseurs.',

    // Bypass Settings
    sectionBypass: 'PARAMÈTRES DE CONTOURNEMENT',
    modeTurboName: 'Mode Turbo',
    modeTurboDesc: 'Latence minimale. Contourne les filtres légers instantanément.',
    modeBalancedName: 'Mode Équilibré',
    modeBalancedDesc: 'Rapide et stable. Contourne les filtres standards.',
    modeStrongName: 'Mode Fort',
    modeStrongDesc: 'Contourne les DPI difficiles avec de faux paquets.',

    // Extra Network
    sectionExtraNetwork: 'PARAMÈTRES RÉSEAU SUPPLÉMENTAIRES',
    ipv4ForceTitle: 'Forcer l\'IPv4 (Recommandé)',
    ipv4ForceDesc: 'Empêche les chargements infinis et les erreurs de délai d\'attente.',
    networkModeLabel: 'Mode Réseau',
    modeSmooth: 'Mode Fluide',
    modeSmoothDesc: 'Latence minimale. Idéal pour les navigateurs et Discord.',
    modeGame: 'Mode Jeu',
    modeGameDesc: 'Roblox, jeux UDP et toutes les applications. Contournement au niveau du noyau.',
    modeSuper: 'Mode Super',
    modeSuperDesc: 'Hybride : Fluide + Jeu combinés. Meilleur équilibre.',
    modeRequiresNpcap: 'Pilote Npcap requis',
    modeBadgeSmooth: 'Fluide',
    modeBadgeGame: 'Jeu',
    modeBadgeSuper: 'Super',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'PARAMÈTRES AVANCÉS',
    advancedNpcapDesc: 'Les FAI avec des mesures DPI lourdes (Kablonet, Superonline etc.) nécessitent une manipulation avancée des paquets.',
    advancedNpcapInstalled: 'Npcap installé — Fonctionnalités avancées actives',
    advancedNpcapMissing: 'Npcap non installé — Mode fort limité',
    advancedNpcapInstallBtn: 'INSTALLER LE PILOTE NPCAP',
    advancedNpcapWhy: 'Npcap offre un accès de bas niveau aux paquets réseau. Cela permet des techniques de contournement DPI avancées.',
    advancedFeaturesToggle: 'Contournement avancé',
    advancedFeaturesToggleDesc: 'Active l\'injection de faux paquets et les techniques de contournement DPI avancées.',
    npcapRestartWarning: 'Vous devez redémarrer votre ordinateur pour que Npcap fonctionne.',
    logStrongFake: 'Mode Fort : Faux paquet (3) actif.',
    logStrongNoDriver: 'Mode Fort : Pas de pilote, Chunk-1 uniquement.',
    logStrongChunkOnly: 'Mode Fort : Chunk-1 actif.',
    logNpcapFallback: 'Le pilote Npcap ne répond pas. Désactivation du contournement avancé et nouvelle tentative...',
    advancedNpcapHint: 'Installez le pilote Npcap pour un contournement plus fort',

    sectionTroubleshoot: 'DÉPANNAGE',
    fixInternet: 'Réparer la connexion Internet',
    fixInternetDesc: 'Répare Internet si le proxy reste bloqué.',
    fixRepairing: 'Réparation...',
    fixRepairingDesc: 'Réinitialisation des paramètres système, veuillez patienter.',
    fixDone: 'Réparé !',
    fixDoneDesc: 'Paramètres proxy effacés, Internet restauré.',
    fixError: 'Une erreur est survenue !',
    fixErrorDesc: 'Quelque chose s\'est mal passé pendant le processus.',

    sectionDev: 'DÉVELOPPEUR',
    devRole: 'Développeur DocsPI',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'IMPORTANT',
    noticeTitle: 'Sécurité & Faux Positifs',
    noticeDesc: 'Le moteur DocsPI peut parfois être signalé comme un "faux positif" par des systèmes basés sur l\'IA. C\'est totalement inoffensif.',

    // Dialogs
    confirmExitTitle: 'Quitter',
    confirmExitDesc: 'Êtes-vous sûr de vouloir arrêter le moteur DocsPI et quitter ?',
    confirmDisconnectTitle: 'Déconnecter',
    confirmDisconnectDesc: 'Êtes-vous sûr de vouloir mettre fin à votre connexion sécurisée ?',

    // Settings Tabs
    tabGeneral: 'GÉNÉRAL',
    tabNetwork: 'RÉSEAU',
    tabNotification: 'ALERTES',
    tabSystem: 'SYSTÈME',

    // ISP Detection
    ispDetected: (name) => `${name} détecté`,
    ispSuggestion: (profile) => `Mode ${profile} recommandé`,
    ispAutoSelected: 'Votre FAI a été sélectionné automatiquement',

    // Connection Statistics
    statsUptime: 'Uptime',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `Nouvelle version disponible : v${ver}`,
    updateDownload: 'Télécharger',
    updateDismiss: 'Plus tard',

    // Custom Domain List
    sectionDomains: 'LISTE DE DOMAINES PERSONNALISÉE',
    sectionDomainsDesc: 'Ces domaines évitent le proxy (connexion DIRECTE).',
    domainAdd: 'Ajouter',
    domainRemove: 'Supprimer',
    domainPlaceholder: 'ex : *.example.com ou site.com',
    domainEmpty: 'Aucun domaine ajouté pour le moment.',

    // Profile Saving
    sectionProfiles: 'PROFILS DE PARAMÈTRES',
    sectionProfilesDesc: 'Enregistrez vos paramètres actuels et chargez-les en un clic.',
    profileSave: 'Enregistrer les paramètres actuels',
    profileSaveShort: 'Enregistrer',
    profileLoad: 'Charger',
    profileDelete: 'Supprimer',
    profileName: 'Entrez le nom du profil...',
    profileSaved: 'Profil enregistré !',
    profileLoaded: 'Profil chargé !',
    profileEmpty: 'Aucun profil enregistré pour le moment.',

    themeLabel: 'Thème',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    themeDarkDesc: 'Thème sombre actif',
    themeLightDesc: 'Thème clair actif',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Exécution du test de contournement...',
    bypassTestSuccess: 'Contournement actif ! Connexion réussie.',
    bypassTestSuccessShort: 'Actif',
    bypassTestFailed: 'Le contournement ne fonctionne pas. Échec de la connexion.',
    bypassTestFailedShort: 'Échec',
    bypassTestTimeout: 'Le test de contournement a expiré.',

    autoEscalateLabel: 'Escalade de mode automatique',
    autoEscalateDesc: 'Passer à un mode plus fort si la connexion échoue',
    logAutoEscalate: (mode) => `Échec de la connexion, passage en mode ${mode}...`,
    logTrayModeChanged: (mode) => `Mode changé depuis la barre des tâches : ${mode}`,

    statsTitle: 'Statistiques de connexion',
    statsTotalSessions: 'Sessions totales',
    statsTotalUptime: 'Temps total',
    statsMostUsedMode: 'Mode le plus utilisé',
    statsAvgPing: 'Ping moyen',
    statsReset: 'Réinitialiser les statistiques',
    statsEmpty: 'Aucune session enregistrée pour le moment',

    welcomeTitle: 'Bienvenue sur DocsPI',
    welcomeDesc: 'Vous êtes sur le point de faire votre premier pas vers un Internet libre et sécurisé. Nous avons quelques brèves étapes pour configurer les meilleurs paramètres pour vous.',
    welcomeNext: 'C\'est parti',
    welcomePrivacy: 'Votre vie privée est importante pour nous. Vos données ne sont jamais enregistrées.',
    fakeSniLabel: 'Fake SNI',
    btnYes: 'Oui',
    logFilterError: 'Erreurs',
    logDirtyShutdownRecovery: "L'arr�t pr�c�dent �tait inattendu. R�cup�ration...",
    logFilterSuccess: 'Succ�s',
    logFilterInfo: 'Info',
    btnNo: 'Non',
    logFilterWarn: 'Avertissements',
    logFilterAll: 'Tout',
  },

  ar: {
    appName: 'DOCSPI',
    statusActive: 'نشط',
    statusInactive: 'متوقف',
    statusReady: 'جاهز',

    statusConnected: 'آمن',
    statusConnecting: 'جاري الاتصال...',
    statusDisconnecting: 'جاري الفصل...',
    statusReady2: 'جاهز',
    descConnected: 'اتصالك مشفر ومحمي.',
    descConnecting: 'جاري المعالجة، يرجى الانتظار.',
    descReady: 'اتصل لتجاوز DPI.',

    btnConnect: 'اتصال',
    btnDisconnect: 'قطع الاتصال',
    btnConnecting: 'جاري الاتصال...',
    btnApplyingSettings: 'جاري تطبيق الإعدادات...',
    btnDisconnecting: 'جاري الفصل...',
    btnConnectDevices: 'توصيل أجهزة أخرى',

    navSettings: 'الإعدادات',
    navLogs: 'السجلات',
    navExit: 'خروج',

    logsTitle: 'سجلات النظام',
    logsClear: 'مسح',
    logsCopy: 'نسخ',
    logsCopied: 'تم النسخ!',
    logsCopyError: 'خطأ!',

    modalTitle: 'توصيل جهاز',
    modalSubtitle: 'مشاركة الشبكة المحلية (LAN)',
    modalDesc: 'انتقل إلى إعدادات Wi-Fi بجهازك، واضبط <strong>الوكيل (Proxy)</strong> على <strong>يدوي</strong> وأدخل التفاصيل أدناه.',
    modalDescPac: 'يوصى باستخدام <strong>تلقائي (PAC)</strong> على الأجهزة الأخرى.',
    modalPacQrHint: 'امسح رمز QR، وانسخ العنوان والصقه في إعدادات <strong>Wi-Fi ← الوكيل ← عنوان URL تلقائي</strong> بجهازك.<br><br><span class="text-red-500 font-semibold">هام:</span> إذا واجهت مشكلات في الشبكة بعد قطع الاتصال، فقم بإيقاف تشغيل Wi-Fi بجهازك ثم أعد تشغيله.',
    modalPacUrl: 'عنوان PAC (موصى به)',
    modalManualFallback: 'بديل: وكيل يدوي',
    modalTabPac: 'تلقائي (PAC)',
    modalTabManual: 'يدوي',
    modalPacStep1Title: '1. افتح دليل الإعداد',
    modalPacStep1Desc: 'امسح رمز QR بكاميرتك لفتح دليل الإعداد خطوة بخطوة.',
    modalPacStep2Title: '2. انسخ عنوان PAC',
    modalPacStep2Desc: 'الصق هذا الكود في حقل "عنوان URL تلقائي" الموضح في الدليل:',
    modalPacWarningTitle: 'تنبيه:',
    modalPacWarningDesc: 'إذا فقدت تطبيقات مثل YouTube الوصول إلى الإنترنت بعد إغلاق DocsPI (بسبب الاتصالات المخزنة مؤقتًا)، فما عليك سوى إعادة تشغيل Wi-Fi بجهازك.',
    modalManualWarningTitle: 'تنبيه:',
    modalManualWarningDesc: 'عند إغلاق DocsPI، سيفقد جهازك الوصول إلى الإنترنت تمامًا. لاستعادة الاتصال، يجب إزالة إعداد الوكيل من إعدادات Wi-Fi.',
    modalPacQrCaption: 'QR ← صفحة الإعداد (امسح وانسخ)',
    modalHost: 'الخادم (Host)',
    modalPort: 'المنفذ (Port)',
    modalTutorial: 'كيفية القيام بذلك؟ (دليل)',

    adminTitle: 'مطلوب صلاحية المسؤول',
    adminDesc: 'يحتاج DocsPI للتشغيل كمسؤول ليعمل بشكل صحيح.',
    adminStep: 'انقر بزر الماوس الأيمن على التطبيق ← اختر <strong>"تشغيل كمسؤول"</strong>',
    adminClose: 'إغلاق',
    adminHowItWorks: 'كيف يعمل؟',

    noInternetTitle: 'لا يوجد اتصال بالإنترنت',
    noInternetDesc: 'يرجى التحقق من اتصالك بالإنترنت.',
    noInternetRetry: 'إعادة المحاولة',

    logEngineStarting: (port) => `بدء محرك DocsPI (المنفذ: ${port})...`,
    logDnsUsed: (name, ip) => `DNS المستخدم: ${name} (${ip})`,
    logDnsDefault: 'DNS: افتراضي النظام',
    logConnected: 'تم الاتصال بنجاح! يتم تشفير البيانات.',
    logDisconnected: 'تم قطع الاتصال.',
    logProxySet: (port) => `تم ضبط وكيل النظام: 127.0.0.1:${port}`,
    logProxyCleared: 'تم مسح وكيل النظام',
    logEngineStopped: (code) => `توقف محرك DocsPI بشكل غير متوقع (الكود: ${code})`,
    logEngineStartError: (err) => `فشل بدء المحرك: ${err}`,
    logAutoReconnect: 'إعادة الاتصال التلقائي مفعل...',
    logReconnecting: (n) => `جاري إعادة الاتصال... (المحاولة ${n}/5)`,
    logReconnectWait: (sec, n) => `المحاولة القادمة خلال ${sec} ثوانٍ... (المحاولة ${n}/5)`,
    logReconnectNow: 'جاري إعادة الاتصال الآن...',
    logMaxRetries: 'فشل الاتصال. تم الوصول إلى الحد الأقصى من المحاولات.',
    logPossibleReasons: 'الأسباب المحتملة:',
    logReasonInternet: 'قد يكون اتصالك بالإنترنت مقطوعًا',
    logReasonFirewall: 'قد يحظر جدار الحماية/مكافح الفيروسات DocsPI',
    logReasonPorts: 'المنافذ 8080-8084 قد تكون قيد الاستخدام',
    logSolutions: 'الحلول المقترحة:',
    logSolInternet: 'تحقق من اتصال الإنترنت الخاص بك',
    logSolFirewall: 'تحقق من إعدادات جدار الحماية الخاص بك',
    logSolAdmin: 'قم بتشغيل التطبيق كمسؤول',
    logSolLogs: 'انسخ السجلات وشاركها للحصول على الدعم',
    logLanRestart: 'تغيرت مشاركة LAN، جاري إعادة تشغيل الاتصال...',
    logDpiRestart: 'تغير وضع DPI، جاري إعادة تشغيل الاتصال...',
    logEngineStoppedGrace: 'توقف محرك DocsPI.',
    logServiceStopped: 'توقفت الخدمة.',
    logShutdownStarting: 'بدء إيقاف التشغيل...',
    logProcessStopped: 'توقف العملية.',
    logSpoofReady: (port) => `بدأ محرك SpoofDPI (المنفذ: ${port})`,
    logPacStarted: 'بدأ خادم PAC (للأجهزة المحلية)',
    logPacStartError: (err) => `فشل بدء خادم PAC: ${err}`,
    logEngineActive: 'محرك DocsPI نشط',
    logPortBusy: (port) => `المنفذ ${port} مشغول، جاري تجربة منفذ آخر...`,
    logInitializing: 'جاري تهيئة المحرك...',
    logPortRetryOpen: (port) => `تعذر فتح المنفذ ${port}، جاري إعادة المحاولة...`,
    logProxyClearError: (err) => `خطأ في مسح الوكيل: ${err}`,
    logProxySetError: (err) => `خطأ في ضبط الوكيل: ${err}`,
    logServiceStopError: (err) => `خطأ في إيقاف الخدمة: ${err}`,
    logConfigError: (err) => `خطأ في التكوين: ${err}`,
    logAdminMissing: 'صلاحية المسؤول مفقودة! قد لا يعمل التطبيق بشكل صحيح.',
    logInternetBack: 'تم استعادة الاتصال بالإنترنت.',
    logInternetLost: 'فقد الاتصال بالإنترنت!',
    logPortRetry: (count) => `تعارض في المنفذ، جاري تجربة منفذ جديد... (${count}/20)`,
    logNoPort: 'لم يتم العثور على منفذ متاح.',
    logWinHttpEnabled: 'تم تطبيق نفق وكيل وضع الألعاب (WinHTTP).',
    logWpcapMissing: 'تعذر العثور على wpcap.dll. يرجى تثبيت Npcap أو WinPcap، ثم أعد تشغيل التطبيق.',
    logAntivirusWarning: 'قد يكون Windows Defender أو برنامج مكافحة الفيروسات قد حظر "docspi-proxy.exe". يرجى إضافة الملف إلى قائمة الاستثناءات.',
    logFailsafePortClosed: 'انتهت مهلة المنفذ، جاري إعادة محاولة الاتصال...',

    settingsTitle: 'الإعدادات',

    sectionMethod: 'طريقة الاتصال',
    sectionMethodWhy: 'إعداد واحد لجميع مزودي الخدمة. استخدمه على جميع الأجهزة عبر LAN. لا يسبب تأخيرًا في الألعاب.',
    methodStrong: 'الوضع القوي',
    methodStrongDesc: 'أقوى تجاوز لمزودي الخدمة الصعبين (يضيف تأخيرًا)',
    methodTurbo: 'وضع التوربو',
    methodTurboDesc: 'أقل تأخير، لفلترة DPI الخفيفة',
    methodBalanced: 'الوضع المتوازن (موصى به)',
    methodBalancedDesc: 'تجاوز سريع وقوي، يعمل مع معظم المزودين',

    sectionAdvanced: 'متقدم',
    chunkSizeLabel: 'حجم القطعة (Chunk size)',
    chunkSizeDesc: 'يحدد عدد القطع التي سيتم تقسيم حركة مرور HTTPS إليها. 8 هو التوازن الافتراضي.',
    chunkSize4: '4 — الأقوى (لبعض المزودين)',
    chunkSize8: '8 — متوازن (افتراضي)',
    chunkSize16: '16 — أسرع (لبعض المزودين)',

    sectionNetwork: 'إعدادات الشبكة',
    lanSharing: 'مشاركة الشبكة المحلية',
    lanSharingDesc: 'السماح بالاتصال من الأجهزة الأخرى (هاتف، كونسول)',

    sectionAutomation: 'الأتمتة',
    autoConnect: 'اتصال تلقائي',
    autoConnectDesc: 'الاتصال بمجرد فتح التطبيق',
    autoReconnect: 'إعادة اتصال تلقائية',
    autoReconnectDesc: 'إعادة المحاولة تلقائيًا في حال انقطاع الاتصال',

    sectionGeneral: 'عام',
    autoStart: 'التشغيل عند البدء',
    autoStartDesc: 'بدء DocsPI عند تشغيل ويندوز',
    minimizeToTray: 'تصغير إلى صينية النظام',
    minimizeToTrayDesc: 'التشغيل في الخلفية عند الإغلاق',
    alwaysOnTop: 'دائمًا في المقدمة',
    alwaysOnTopDesc: 'تبقى النافذة دائمًا فوق النوافذ الأخرى',
    requireConfirmation: 'تأكيد الإجراء',
    requireConfirmationDesc: 'السؤال قبل قطع الاتصال أو الخروج',
    language: 'لغة التطبيق',
    languageDesc: 'تغيير لغة الواجهة',

    sectionNotifications: 'الإشعارات',
    notifications: 'إشعارات سطح المكتب',
    notificationsDesc: 'مفتاح الإشعارات الرئيسي (تشغيل/إيقاف الكل)',
    notifyOnConnect: 'عند إنشاء الاتصال',
    notifyOnConnectDesc: 'الإشعار عند نجاح الاتصال وتأمين الشبكة',
    notifyOnDisconnect: 'عند انقطاع الاتصال',
    notifyOnDisconnectDesc: 'الإشعار عند الانقطاع غير المتوقع',
    notifDisconnectManual: 'تم إنهاء الاتصال بنجاح.',

    sectionDns: 'قائمة DNS',
    dnsAutoSelect: 'اختيار تلقائي (موصى به)',
    dnsAutoSelectDesc: 'العثور على أسرع خادم تلقائيًا',
    dnsSystemDefault: 'افتراضي النظام',
    dnsSystemDefaultDesc: 'DNS الافتراضي لـ SpoofDPI',
    dnsCfDesc: 'سريع وخصوصي',
    dnsAdguardDesc: 'مانع الإعلانات',
    dnsGoogleDesc: 'موثوق',
    dnsQuad9Desc: 'مرتكز على الأمان',
    dnsOpenDnsDesc: 'مدعوم من سيسكو',
    dnsCheckSpeed: 'اختبار بينج DNS',
    dnsChecking: 'جاري القياس...',

    driverStatusInstalled: 'الفلترة المتقدمة نشطة',
    driverStatusMissing: 'افتح الميزات المتقدمة إذا فشل التجاوز',
    driverInstallBtn: 'تثبيت البرنامج المشغل (موصى به)',
    driverIspWarning: 'إذا واجهت مشكلات في الاتصال، يمكنك فتح ميزات تجاوز DPI أكثر تقدمًا بتثبيت البرنامج المشغل.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'اختر مزود خدمة الإنترنت الخاص بك',
    issOverlayDesc: 'دعنا نطبق أفضل الإعدادات لمزود الخدمة الخاص بك تلقائيًا.',
    issOverlayApply: 'تطبيق واتصال',
    issOverlaySkip: 'تخطي',
    issProfileActive: 'الملف الشخصي نشط',
    issProfileSee: 'عرض الإعدادات الموصى بها',
    issApplyBtn: 'تطبيق الإعدادات تلقائيًا',
    issAppliedMsg: 'هذا الإعداد قيد الاستخدام حاليًا',

    // ISS Guide (Settings)
    issGuideTitle: 'دليل مزودي الخدمة',
    issLightName: 'TurkNet',
    issLightDesc: 'فلترة خفيفة. وضع التوربو يضمن عدم زيادة البينج.',
    issMidName: 'بعض مزودي الخدمة فقط',
    issMidDesc: 'حظر قياسي. الوضع القوي يقسم الحزم للوصول الموثوق.',
    issHeavyName: 'المزودون الأتراك (TT / Vodafone / Superonline)',
    issHeavyDesc: 'يتم استخدام أجهزة DPI ذكية وصعبة. قد يتطلب الوضع القوي.',
    issChinaName: 'الصين (جدار الحماية العظيم)',
    issChinaDesc: 'تجاوز نظام DPI الأكثر تقدمًا في العالم قد يتطلب الوضع القوي وإعدادات SNI مخصصة.',
    issRussiaName: 'روسيا (Roskomnadzor)',
    issRussiaDesc: 'يوصى بالوضع القوي للحظر المعقد.',
    issIndiaName: 'الهند',
    issIndiaDesc: 'الوضع المتوازن كافٍ للحظر القياسي.',
    issUsaName: 'الولايات المتحدة / عالمي',
    issUsaDesc: 'يوصى بوضع التوربو للقيود الخفيفة.',
    issGlobalName: 'عالمي / آخر',
    issGlobalDesc: 'إعدادات تجاوز عامة لجميع الدول.',
    issOtherName: 'آخر / غير معروف',
    issOtherDesc: 'يبدأ بالوضع القوي. يعمل بموثوقية مع معظم المزودين.',

    // Bypass Settings
    sectionBypass: 'إعدادات التجاوز التفصيلية',
    modeTurboName: 'وضع التوربو',
    modeTurboDesc: 'أقل تأخير. يتجاوز الفلاتر الخفيفة فورًا.',
    modeBalancedName: 'الوضع المتوازن',
    modeBalancedDesc: 'سريع ومستقر. يتجاوز الفلاتر القياسية.',
    modeStrongName: 'الوضع القوي',
    modeStrongDesc: 'يتجاوز DPI الصعب باستخدام حزم وهمية.',

    // Extra Network
    sectionExtraNetwork: 'إعدادات شبكة إضافية',
    ipv4ForceTitle: 'فرض IPv4 (موصى به)',
    ipv4ForceDesc: 'يمنع التحميل اللانهائي وأخطاء انتهاء المهلة.',
    networkModeLabel: 'وضع الشبكة',
    modeSmooth: 'الوضع السلس',
    modeSmoothDesc: 'أقل تأخير. مثالي للمتصفحات وDiscord.',
    modeGame: 'وضع الألعاب',
    modeGameDesc: 'ألعاب Roblox وUDP وجميع التطبيقات. تجاوز على مستوى النواة.',
    modeSuper: 'الوضع الخارق',
    modeSuperDesc: 'هجين: يجمع بين السلس والألعاب. أفضل توازن.',
    modeRequiresNpcap: 'يتطلب مشغل Npcap',
    modeBadgeSmooth: 'سلس',
    modeBadgeGame: 'ألعاب',
    modeBadgeSuper: 'خارق',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'إعدادات متقدمة',
    advancedNpcapDesc: 'يتطلب مزودو الخدمة الذين لديهم إجراءات DPI ثقيلة معالجة متقدمة للحزم.',
    advancedNpcapInstalled: 'Npcap مثبت — الميزات المتقدمة نشطة',
    advancedNpcapMissing: 'Npcap غير مثبت — الوضع القوي محدود',
    advancedNpcapInstallBtn: 'تثبيت مشغل NPCAP',
    advancedNpcapWhy: 'يوفر Npcap وصولاً منخفض المستوى لحزم الشبكة، مما يتيح تقنيات تجاوز DPI متقدمة.',
    advancedFeaturesToggle: 'تجاوز متقدم',
    advancedFeaturesToggleDesc: 'يفعل حقن الحزم الوهمية وتقنيات تجاوز DPI المتقدمة.',
    npcapRestartWarning: 'تحتاج إلى إعادة تشغيل الكمبيوتر ليعمل Npcap.',
    logStrongFake: 'الوضع القوي: الحزمة الوهمية (3) نشطة.',
    logStrongNoDriver: 'الوضع القوي: لا يوجد مشغل، Chunk-1 فقط نشط.',
    logStrongChunkOnly: 'الوضع القوي: Chunk-1 نشط.',
    logNpcapFallback: 'مشغل Npcap لا يستجيب. يتم إيقاف التجاوز المتقدم وإعادة المحاولة...',
    advancedNpcapHint: 'ثبت مشغل Npcap لتجاوز أقوى',

    sectionTroubleshoot: 'استكشاف الأخطاء وإصلاحها',
    fixInternet: 'إصلاح اتصال الإنترنت',
    fixInternetDesc: 'يصلح الإنترنت إذا علق الوكيل.',
    fixRepairing: 'جاري الإصلاح...',
    fixRepairingDesc: 'إعادة ضبط إعدادات النظام، يرجى الانتظار.',
    fixDone: 'تم الإصلاح!',
    fixDoneDesc: 'تم مسح إعدادات الوكيل واستعادة الإنترنت.',
    fixError: 'حدث خطأ!',
    fixErrorDesc: 'حدثت مشكلة أثناء العملية.',

    sectionDev: 'المطور',
    devRole: 'مطور DocsPI',
    devSubscribe: 'ديسكورد',
    devSupport: 'جيت هاب',

    sectionNotice: 'معلومات هامة',
    noticeTitle: 'الأمان والإنذارات الخاطئة',
    noticeDesc: 'قد يتم تصنيف محرك DocsPI أحيانًا كـ "إنذار خاطئ" من قبل الأنظمة القائمة على الذكاء الاصطناعي. هذا غير ضار تمامًا.',

    // Dialogs
    confirmExitTitle: 'خروج',
    confirmExitDesc: 'هل أنت متأكد أنك تريد إيقاف المحرك والخروج؟',
    confirmDisconnectTitle: 'قطع الاتصال',
    confirmDisconnectDesc: 'هل أنت متأكد أنك تريد إنهاء اتصالك الآمن؟',

    // Settings Tabs
    tabGeneral: 'عام',
    tabNetwork: 'الشبكة',
    tabNotification: 'الإشعارات',
    tabSystem: 'النظام',

    // ISP Detection
    ispDetected: (name) => `تم اكتشاف ${name}`,
    ispSuggestion: (profile) => `يوصى بوضع ${profile}`,
    ispAutoSelected: 'تم اختيار مزود الخدمة تلقائيًا',

    // Connection Statistics
    statsUptime: 'وقت التشغيل',
    statsPing: 'بينج',
    statsMs: 'ملي ثانية',

    // Update
    updateAvailable: (ver) => `نسخة جديدة متاحة: v${ver}`,
    updateDownload: 'تحميل',
    updateDismiss: 'لاحقًا',

    // Custom Domain List
    sectionDomains: 'قائمة النطاقات المخصصة',
    sectionDomainsDesc: 'هذه النطاقات يتم استثناؤها من الوكيل (اتصال مباشر).',
    domainAdd: 'إضافة',
    domainRemove: 'إزالة',
    domainPlaceholder: 'مثال: *.example.com',
    domainEmpty: 'لم يتم إضافة نطاقات بعد.',

    // Profile Saving
    sectionProfiles: 'ملفات الإعدادات',
    sectionProfilesDesc: 'احفظ إعداداتك الحالية وحملها بنقرة واحدة.',
    profileSave: 'حفظ الإعدادات الحالية',
    profileSaveShort: 'حفظ',
    profileLoad: 'تحميل',
    profileDelete: 'حذف',
    profileName: 'أدخل اسم الملف الشخصي...',
    profileSaved: 'تم حفظ الملف الشخصي!',
    profileLoaded: 'تم تحميل الملف الشخصي!',
    profileEmpty: 'لم يتم حفظ ملفات شخصية بعد.',

    themeLabel: 'المظهر',
    themeDark: 'داكن',
    themeLight: 'فاتح',
    themeDarkDesc: 'المظهر الداكن نشط',
    themeLightDesc: 'المظهر الفاتح نشط',

    bypassTestBtn: 'اختبار التجاوز',
    bypassTestTesting: 'جاري إجراء اختبار التجاوز...',
    bypassTestSuccess: 'التجاوز نشط! الاتصال ناجح.',
    bypassTestSuccessShort: 'نشط',
    bypassTestFailed: 'التجاوز لا يعمل. فشل الاتصال.',
    bypassTestFailedShort: 'فشل',
    bypassTestTimeout: 'انتهت مهلة اختبار التجاوز.',

    autoEscalateLabel: 'ترقية الوضع التلقائية',
    autoEscalateDesc: 'التحول لوضع أقوى في حال فشل الاتصال',
    logAutoEscalate: (mode) => `فشل الاتصال، جاري التحول لوضع ${mode}...`,
    logTrayModeChanged: (mode) => `تم تغيير الوضع من صينية النظام: ${mode}`,

    statsTitle: 'إحصائيات الاتصال',
    statsTotalSessions: 'إجمالي الجلسات',
    statsTotalUptime: 'إجمالي وقت التشغيل',
    statsMostUsedMode: 'الوضع الأكثر استخدامًا',
    statsAvgPing: 'متوسط البينج',
    statsReset: 'إعادة ضبط الإحصائيات',
    statsEmpty: 'لا توجد جلسات مسجلة بعد',

    welcomeTitle: 'مرحبًا بك في DocsPI',
    welcomeDesc: 'أنت على وشك اتخاذ خطوتك الأولى نحو إنترنت حر وآمن. لدينا بعض الخطوات القصيرة لضبط أفضل الإعدادات لك.',
    welcomeNext: 'لنبدأ',
    welcomePrivacy: 'خصوصيتك تهمنا. لا يتم تسجيل بياناتك أبدًا.',
    fakeSniLabel: 'Fake SNI',
    btnYes: '???',
    logFilterError: '?????',
    logDirtyShutdownRecovery: '??? ??????? ?????? ??? ?????. ???? ?????????...',
    logFilterSuccess: '????',
    logFilterInfo: '???????',
    btnNo: '??',
    logFilterWarn: '???????',
    logFilterAll: '????',
  },

  az: {
    appName: 'DOCSPI',
    statusActive: 'AKTİV',
    statusInactive: 'QAPALI',
    statusReady: 'HAZIR',

    statusConnected: 'TƏHLÜKƏSİZ',
    statusConnecting: 'BAĞLANIR...',
    statusDisconnecting: 'KƏSİLİR...',
    statusReady2: 'HAZIR',
    descConnected: 'Bağlantınız şifrələnib və qorunur.',
    descConnecting: 'İşlənilir, xahiş edirik gözləyin.',
    descReady: 'DPI Bypass üçün bağlanın.',

    btnConnect: 'BAĞLAN',
    btnDisconnect: 'BAĞLANTINI KƏS',
    btnConnecting: 'BAĞLANIR...',
    btnApplyingSettings: 'AYARLAR TƏTBİQ EDİLİR...',
    btnDisconnecting: 'KƏSİLİR...',
    btnConnectDevices: 'Digər Cihazları Qoş',

    navSettings: 'AYARLAR',
    navLogs: 'LOGLAR',
    navExit: 'ÇIXIŞ',

    logsTitle: 'SİSTEM LOGLARI',
    logsClear: 'TƏMİZLƏ',
    logsCopy: 'KOPYALA',
    logsCopied: 'KOPYALANDI!',
    logsCopyError: 'XƏTA!',

    modalTitle: 'Cihaz Qoşma',
    modalSubtitle: 'LAN Paylaşımı',
    modalDesc: 'Cihazınızın Wi-Fi ayarlarında <strong>Proksi</strong> hissəsini <strong>Manual</strong> edin və məlumatları daxil edin.',
    modalDescPac: 'Digər cihazlarda <strong>Avtomatik (PAC)</strong> istifadəsi tövsiyə olunur.',
    modalPacQrHint: 'QR-ı skan edib ünvanı kopyalayın və telefonunuzun <strong>Wi-Fi → Proksi → Avtomatik URL</strong> hissəsinə yapışdırın.<br><br><span class="text-red-500 font-semibold">VACİB:</span> Bağlantını kəsdikdən sonra internet problemi yaşasanız, Wi-Fi bağlantınızı söndürüb yandırın.',
    modalPacUrl: 'PAC Ünvanı (Tövsiyə olunan)',
    modalManualFallback: 'Alternativ: Manual proksi',
    modalTabPac: 'Avtomatik (PAC)',
    modalTabManual: 'Manual',
    modalPacStep1Title: '1. Quraşdırma Rəhbərini Açın',
    modalPacStep1Desc: 'Kameranızla QR kodu oxudaraq addım-addım izah səhifəsinə keçin.',
    modalPacStep2Title: '2. PAC Ünvanını Kopyalayın',
    modalPacStep2Desc: 'Rəhbərdə göstərilən "Avtomatik URL" sahəsinə bu kodu yapışdırın:',
    modalPacWarningTitle: 'DİQQƏT:',
    modalPacWarningDesc: 'DocsPI bağlandıqdan sonra internet problemi yaşasanız, Wi-Fi bağlantısını söndürüb yandırmaq kifayətdir.',
    modalManualWarningTitle: 'DİQQƏT:',
    modalManualWarningDesc: 'DocsPI bağlandıqda internet bağlantısı tamamilə kəsilir. İnternetə təkrar girmək üçün cihazınızın Wi-Fi ayarlarından Proksini ləğv etməlisiniz.',
    modalPacQrCaption: 'QR → Quraşdırma səhifəsi (skan et və kopyala)',
    modalHost: 'Server (Host)',
    modalPort: 'Port',
    modalTutorial: 'Necə edilir? (Rəhbər)',

    adminTitle: 'Admin İcazəsi Lazımdır',
    adminDesc: 'DocsPI-ın düzgün işləməsi üçün admin olaraq işlədilməsi vacibdir.',
    adminStep: 'Tətbiqə sağ klikləyin → <strong>"Admin olaraq işlət"</strong> seçin',
    adminClose: 'BAĞLA',
    adminHowItWorks: 'Necə İşləyir?',

    noInternetTitle: 'İnternet Bağlantısı Yoxdur',
    noInternetDesc: 'Xahiş edirik internet bağlantınızı yoxlayın.',
    noInternetRetry: 'Təkrar Yoxla',

    logEngineStarting: (port) => `DocsPI Motoru başladılır (Port: ${port})...`,
    logDnsUsed: (name, ip) => `İstifadə olunan DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: Sistem Varsayılanı',
    logConnected: 'Bağlantı uğurludur! Trafik şifrələnir.',
    logDisconnected: 'Bağlantı kəsildi.',
    logProxySet: (port) => `Sistem Proksi tənzimləndi: 127.0.0.1:${port}`,
    logProxyCleared: 'Sistem Proksi Təmizləndi',
    logEngineStopped: (code) => `DocsPI motoru gözlənilmədən dayandı (Kod: ${code})`,
    logEngineStartError: (err) => `Motor başladılmadı: ${err}`,
    logAutoReconnect: 'Avtomatik təkrar bağlanma aktivdir...',
    logReconnecting: (n) => `Təkrar bağlanılır... (Cəhd ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec} saniyə sonra təkrar yoxlanacaq... (Cəhd ${n}/5)`,
    logReconnectNow: 'Təkrar bağlanılır...',
    logMaxRetries: 'Bağlantı qurulmadı. Maksimum cəhd sayına çatıldı.',
    logPossibleReasons: 'Mümkün səbəblər:',
    logReasonInternet: 'İnternet bağlantınız kəsilmiş ola bilər',
    logReasonFirewall: 'Firewall/Antivirus DocsPI-ı bloklayır ola bilər',
    logReasonPorts: '8080-8084 portları sistem tərəfindən istifadə olunur',
    logSolutions: 'Həll təklifləri:',
    logSolInternet: 'İnternet bağlantınızı yoxlayın',
    logSolFirewall: 'Firewall ayarlarınızı yoxlayın',
    logSolAdmin: 'Tətbiqi admin olaraq işlədin',
    logSolLogs: 'Logları kopyalayıb dəstək üçün paylaşa bilərsiniz',
    logLanRestart: 'Yerel şəbəkə paylaşımı dəyişdi, bağlantı təkrar başladılır...',
    logDpiRestart: 'DPI rejimi dəyişdi, bağlantı təkrar başladılır...',
    logEngineStoppedGrace: 'DocsPI motoru bağlandı.',
    logServiceStopped: 'Servis dayandırıldı.',
    logShutdownStarting: 'Bağlanma başladılır...',
    logProcessStopped: 'Proses sonlandırıldı.',
    logSpoofReady: (port) => `SpoofDPI Motoru başladıldı (Port: ${port})`,
    logPacStarted: 'PAC serveri başladıldı (Yerel şəbəkə cihazları üçün)',
    logPacStartError: (err) => `PAC serveri başladılmadı: ${err}`,
    logEngineActive: 'DocsPI motoru aktivdir',
    logPortBusy: (port) => `Port ${port} doludur, başqa port yoxlanılır...`,
    logInitializing: 'Motor başladılır...',
    logPortRetryOpen: (port) => `Port ${port} açılmadı, təkrar yoxlanılır...`,
    logProxyClearError: (err) => `Proksi təmizləmə xətası: ${err}`,
    logProxySetError: (err) => `Proksi tənzimlənmə xətası: ${err}`,
    logServiceStopError: (err) => `Servis dayandırma xətası: ${err}`,
    logConfigError: (err) => `Konfiqurasiya xətası: ${err}`,
    logAdminMissing: 'Admin icazəsi yoxdur! Tətbiq düzgün işləməyə bilər.',
    logInternetBack: 'İnternet bağlantısı təkrar bərpa olundu.',
    logInternetLost: 'İnternet bağlantısı kəsildi!',
    logPortRetry: (count) => `Port toqquşması, yeni port yoxlanılır... (${count}/20)`,
    logNoPort: 'Uyğun port tapılmadı.',
    logWinHttpEnabled: 'Oyun Rejimi (WinHTTP) proksi tuneli tətbiq olundu.',
    logWpcapMissing: 'SpoofDPI, wpcap.dll kitabxanasını tapmadı. Npcap və ya WinPcap quraşdırın.',
    logAntivirusWarning: 'Antivirus yazılımınız DocsPI-ı bloklamış ola bilər.',
    logFailsafePortClosed: 'Port zaman aşımına uğradı, təkrar yoxlanılır...',

    settingsTitle: 'AYARLAR',

    sectionMethod: 'BAĞLANTI METODU',
    sectionMethodWhy: 'Tək ayar, bütün İSS-lər. LAN ilə bütün cihazlarda istifadə edin.',
    methodStrong: 'Güclü Rejim',
    methodStrongDesc: 'Ən güclü bypass, çətin ISP-lər üçün (gecikmə əlavə edir)',
    methodTurbo: 'Turbo Rejim',
    methodTurboDesc: 'Ən aşağı gecikmə, yüngül DPI üçün',
    methodBalanced: 'Balanslı Rejim (Tövsiyə olunan)',
    methodBalancedDesc: 'Sürətli + güclü bypass, çox ISP-də işləyir',

    sectionAdvanced: 'TƏKMİLLƏŞDİRİLMİŞ',
    chunkSizeLabel: 'Parça ölçüsü (chunk size)',
    chunkSizeDesc: 'HTTPS trafikini neçə parçaya böləcəyini təyin edir. 8 balanslıdır.',
    chunkSize4: '4 — Ən güclü (bəzi İSS-lər)',
    chunkSize8: '8 — Balanslı (varsayılan)',
    chunkSize16: '16 — Daha sürətli (bəzi İSS-lər)',

    sectionNetwork: 'ŞƏBƏKƏ AYARLARI',
    lanSharing: 'Yerel Şəbəkə Paylaşımı',
    lanSharingDesc: 'Digər cihazlardan (Tel, Konsol) qoşulmağa icazə ver',

    sectionAutomation: 'AVTOMATLAŞDIRMA',
    autoConnect: 'Avtomatik Qoşul',
    autoConnectDesc: 'Tətbiq açılan kimi qoşul',
    autoReconnect: 'Avtomatik Təkrar Qoşul',
    autoReconnectDesc: 'Bağlantı kəsilsə avtomatik təkrar yoxla',

    sectionGeneral: 'ÜMUMİ',
    autoStart: 'Başlanğıcda İşlət',
    autoStartDesc: 'Windows açılanda DocsPI-ı başlat',
    minimizeToTray: 'Sistem tepsisinə kiçilt',
    minimizeToTrayDesc: 'Bağlananda arxa planda işləsin',
    alwaysOnTop: 'Hər Şeyin Üstündə Saxla',
    alwaysOnTopDesc: 'Pəncərə hər zaman digər pəncərələrin üstündə qalar',
    requireConfirmation: 'Əməliyyat Təsdiqi',
    requireConfirmationDesc: 'Bağlantını kəsərkən və ya çıxarkən soruş',
    language: 'TƏTBİQ DİLİ',
    languageDesc: 'İnterfeys dilini dəyişin',

    sectionNotifications: 'BİLDİRİŞLƏR',
    notifications: 'Masaüstü Bildirişləri',
    notificationsDesc: 'Əsas bildiriş açarı (Hamısını Aç/Bağla)',
    notifyOnConnect: 'Bağlantı Qurulanda',
    notifyOnConnectDesc: 'Bağlantı uğurla təmin edildikdə bildir',
    notifyOnDisconnect: 'Bağlantı Kəsiləndə',
    notifyOnDisconnectDesc: 'Gözlənilməz kəsilmələrdə bildir',
    notifDisconnectManual: 'Bağlantı uğurla sonlandırıldı.',

    sectionDns: 'DNS SİYAHISI',
    dnsAutoSelect: 'Avtomatik Seçim (Tövsiyə olunan)',
    dnsAutoSelectDesc: 'Ən sürətli serveri avtomatik tapır',
    dnsSystemDefault: 'Sistem Varsayılanı',
    dnsSystemDefaultDesc: 'SpoofDPI Varsayılan DNS',
    dnsCfDesc: 'Sürətli və Gizli',
    dnsAdguardDesc: 'Reklam Engelleyici',
    dnsGoogleDesc: 'Etibarlı',
    dnsQuad9Desc: 'Təhlükəsizlik Odaklı',
    dnsOpenDnsDesc: 'Cisco Güvənliyi',
    dnsCheckSpeed: 'DNS Ping Testi',
    dnsChecking: 'Ölçülür...',

    driverStatusInstalled: 'Təkmilləşdirilmiş Filtrləmə Aktivdir',
    driverStatusMissing: 'Bypass işləməsə təkmilləşdirilmiş xüsusiyyətləri açın',
    driverInstallBtn: 'SÜRÜCÜNÜ QUR (TÖVSİYƏ OLUNAN)',
    driverIspWarning: 'Əgər bağlantı problemi yaşayırsınızsa, sürücü yükləyərək daha güclü DPI bypass xüsusiyyətlərini aça bilərsiniz.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'İnternet Provayderinizi Seçin',
    issOverlayDesc: 'Ən yaxşı performans üçün provayderinizə uyğun ayarları avtomatik tətbiq edək.',
    issOverlayApply: 'TƏTBİQ ET VƏ BAĞLAN',
    issOverlaySkip: 'Keç',
    issProfileActive: 'Profil Aktivdir',
    issProfileSee: 'Tövsiyə olunan ayarı gör',
    issApplyBtn: 'Ayarları Avtomatik Tətbiq Et',
    issAppliedMsg: 'Bu ayar hazırda istifadə olunur',

    // ISS Guide (Settings)
    issGuideTitle: 'PROVAYDER RƏHBƏRİ',
    issLightName: 'TurkNet',
    issLightDesc: 'Yüngül filtrləmə edirlər. Turbo Rejim sürət itkisinin qarşısını alır.',
    issMidName: 'Yalnız Bəzi İSS-lər',
    issMidDesc: 'Standart bloklamalar edirlər. Güclü Rejim paketləri bölərək giriş təmin edir.',
    issHeavyName: 'Türk Provayderləri (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Güclü və ağıllı DPI cihazları istifadə edirlər. Güclü Rejim tələb oluna bilər.',
    issChinaName: 'Çin (Great Firewall)',
    issChinaDesc: 'Dünyanın ən təkmil DPI sistemini aşmaq üçün Güclü Rejim və xüsusi SNI lazımdır.',
    issRussiaName: 'Rusiya (Roskomnadzor)',
    issRussiaDesc: 'Mürəkkəb bloklamalar üçün Güclü Rejim tövsiyə olunur.',
    issIndiaName: 'Hindistan',
    issIndiaDesc: 'Standart bloklamalar üçün Balanslı Rejim kifayətdir.',
    issUsaName: 'ABŞ / Qlobal',
    issUsaDesc: 'Yüngül məhdudiyyətlər üçün Turbo Rejim tövsiyə olunur.',
    issGlobalName: 'Qlobal / Digər',
    issGlobalDesc: 'Bütün ölkələr üçün ümumi bypass ayarları.',
    issOtherName: 'Digər / Bilmirəm',
    issOtherDesc: 'Güclü Rejim ilə başlayır. Çox provayderdə problemsiz işləyir.',

    // Bypass Settings
    sectionBypass: 'DETALLI BYPASS AYARLARI',
    modeTurboName: 'Turbo Rejim',
    modeTurboDesc: 'Ən aşağı gecikmə. Yüngül filtrləri dərhal aşır.',
    modeBalancedName: 'Balanslı Rejim',
    modeBalancedDesc: 'Sürətli və stabil. Standart filtrləri aşır.',
    modeStrongName: 'Güclü Rejim',
    modeStrongDesc: 'Zorlu DPI-ları saxta paketlərlə aldadır.',

    // Extra Network
    sectionExtraNetwork: 'ƏLAVƏ ŞƏBƏKƏ AYARLARI',
    ipv4ForceTitle: 'IPv4-ə Məcbur Et (Tövsiyə olunan)',
    ipv4ForceDesc: 'Sonsuz yükləmə və Zaman Aşımı (Timeout) xətalarının qarşısını alır.',
    networkModeLabel: 'Şəbəkə Rejimi',
    modeSmooth: 'Axıcı Rejim',
    modeSmoothDesc: 'Ən aşağı gecikmə. Brauzerlər və Discord üçün ideal.',
    modeGame: 'Oyun Rejimi',
    modeGameDesc: 'Roblox, UDP oyunlar və bütün tətbiqlər. Kernel-level bypass.',
    modeSuper: 'Super Rejim',
    modeSuperDesc: 'Hibrid: Axıcı + Oyun birlikdə. Ən yaxşı balans.',
    modeRequiresNpcap: 'Npcap sürücüsü lazımdır',
    modeBadgeSmooth: 'Axıcı',
    modeBadgeGame: 'Oyun',
    modeBadgeSuper: 'Super',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'TƏKMİLLƏŞDİRİLMİŞ AYARLAR',
    advancedNpcapDesc: 'Ağır DPI tədbirləri olan provayderlər üçün təkmil paket manipulyasiyası lazımdır.',
    advancedNpcapInstalled: 'Npcap Quraşdırılıb — Təkmil xüsusiyyətlər aktivdir',
    advancedNpcapMissing: 'Npcap quraşdırılmayıb — Güclü rejim məhdud işləyir',
    advancedNpcapInstallBtn: 'NPCAP SÜRÜCÜSÜNÜ QUR',
    advancedNpcapWhy: 'Npcap şəbəkə paketlərinə aşağı səviyyəli giriş təmin edir. Bu sayədə saxta paket göndərmə texnikaları istifadə edilə bilər.',
    advancedFeaturesToggle: 'Təkmil Bypass',
    advancedFeaturesToggleDesc: 'Saxta paket göndərmə və təkmil DPI bypass texnikalarını aktiv edir.',
    npcapRestartWarning: 'Npcap-ın işləməsi üçün kompüterinizi yenidən başlatmalısınız.',
    logStrongFake: 'Güclü Rejim: Saxta Paket (3) aktivdir.',
    logStrongNoDriver: 'Güclü Rejim: Sürücü yoxdur, yalnız Chunk-1 aktivdir.',
    logStrongChunkOnly: 'Güclü Rejim: Chunk-1 aktivdir.',
    logNpcapFallback: 'Npcap sürücüsü cavab vermir. Təkmil bypass söndürülüb təkrar yoxlanılır...',
    advancedNpcapHint: 'Daha güclü bypass üçün Npcap sürücüsünü qurun',

    sectionTroubleshoot: 'PROBLEMLƏRİN HƏLLİ',
    fixInternet: 'İnternet Bağlantısını Bərpa Et',
    fixInternetDesc: 'Proksi ilişib qalsa interneti avtomatik düzəldir.',
    fixRepairing: 'Bərpa edilir...',
    fixRepairingDesc: 'Sistem ayarları sıfırlanır, xahiş edirik gözləyin.',
    fixDone: 'Bərpa edildi!',
    fixDoneDesc: 'Proksi ayarları təmizləndi və internet bərpa olundu.',
    fixError: 'Xəta Baş Verdi!',
    fixErrorDesc: 'Əməliyyat zamanı bir problem yarandı.',

    sectionDev: 'HAZIRLAYAN',
    devRole: 'DocsPI Hazırlayanı',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'VACİB MƏLUMAT',
    noticeTitle: 'Təhlükəsizlik və Yanlış Pozitiv',
    noticeDesc: 'DocsPI motoru bəzən antiviruslar tərəfindən "yanlış pozitiv" kimi qəbul edilə bilər. Bu tamamilə zərərsizdir.',

    // Dialogs
    confirmExitTitle: 'Çıxış',
    confirmExitDesc: 'DocsPI motorunu dayandırıb çıxmaq istədiyinizə əminsiniz?',
    confirmDisconnectTitle: 'Bağlantını Kəs',
    confirmDisconnectDesc: 'Təhlükəsiz bağlantınızı sonlandırmaq istədiyinizə əminsiniz?',

    // Settings Tabs
    tabGeneral: 'ÜMUMİ',
    tabNetwork: 'ŞƏBƏKƏ',
    tabNotification: 'BİLDİRİŞ',
    tabSystem: 'SİSTEM',

    // ISP Tespiti
    ispDetected: (name) => `${name} aşkar edildi`,
    ispSuggestion: (profile) => `${profile} rejimi tövsiyə olunur`,
    ispAutoSelected: 'Provayderiniz avtomatik seçildi',

    // Bağlantı İstatistikleri
    statsUptime: 'Müddət',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Güncelleme
    updateAvailable: (ver) => `Yeni versiya mövcuddur: v${ver}`,
    updateDownload: 'Yüklə',
    updateDismiss: 'Sonra',

    // Özel Domain Listesi
    sectionDomains: 'XÜSUSİ DOMAİN SİYAHISI',
    sectionDomainsDesc: 'Bu domainlər proksidən azad tutulur (DİRECT bağlantı).',
    domainAdd: 'Əlavə et',
    domainRemove: 'Sil',
    domainPlaceholder: 'məs: *.example.com',
    domainEmpty: 'Hələ domain əlavə edilməyib.',

    // Profil Kaydetme
    sectionProfiles: 'AYAR PROFİLLƏRİ',
    sectionProfilesDesc: 'Mövcud ayarlarınızı yadda saxlayın və bir kliklə yükləyin.',
    profileSave: 'Mövcud Ayarları Saxla',
    profileSaveShort: 'Saxla',
    profileLoad: 'Yüklə',
    profileDelete: 'Sil',
    profileName: 'Profil adı daxil edin...',
    profileSaved: 'Profil yadda saxlanıldı!',
    profileLoaded: 'Profil yükləndi!',
    profileEmpty: 'Hələ profil saxlanılmayıb.',

    themeLabel: 'Mövzu',
    themeDark: 'Qara',
    themeLight: 'Açıq',
    themeDarkDesc: 'Qara mövzu aktivdir',
    themeLightDesc: 'Açıq mövzu aktivdir',

    bypassTestBtn: 'Bypass Testi',
    bypassTestTesting: 'Bypass testi aparılır...',
    bypassTestSuccess: 'Bypass aktivdir! Bağlantı uğurludur.',
    bypassTestSuccessShort: 'Aktiv',
    bypassTestFailed: 'Bypass işləmir. Bağlantı uğursuzdur.',
    bypassTestFailedShort: 'Uğursuz',
    bypassTestTimeout: 'Bypass testi zaman aşımına uğradı.',

    autoEscalateLabel: 'Avtomatik Rejim Yüksəltmə',
    autoEscalateDesc: 'Bağlantı xətası olsa daha güclü rejimə keç',
    logAutoEscalate: (mode) => `Bağlantı xətası, ${mode} rejiminə keçilir...`,
    logTrayModeChanged: (mode) => `Rejim tepsidən dəyişdirildi: ${mode}`,

    statsTitle: 'Bağlantı Statistikası',
    statsTotalSessions: 'Cəmi Oturum',
    statsTotalUptime: 'Cəmi Müddət',
    statsMostUsedMode: 'Ən Çox İstifadə Olunan Rejim',
    statsAvgPing: 'Ortalama Ping',
    statsReset: 'Statistikanı Sıfırla',
    statsEmpty: 'Hələ qeydə alınmış oturum yoxdur',

    welcomeTitle: 'DocsPI-a Xoş Gəlmisiniz',
    welcomeDesc: 'Azad və təhlükəsiz internetə ilk addımınızı atmaq üzrəsiniz. Sizin üçün ən yaxşı ayarları edə bilməmiz üçün bir neçə qısa addımımız var.',
    welcomeNext: 'Gəlin Başlayaq',
    welcomePrivacy: 'Məxfiliyiniz bizim üçün vacibdir. Məlumatlarınız heç vaxt qeyd olunmur.',
  },

  pt: {
    appName: 'DOCSPI',
    statusActive: 'ATIVO',
    statusInactive: 'DESATIVADO',
    statusReady: 'PRONTO',

    statusConnected: 'SEGURO',
    statusConnecting: 'CONECTANDO...',
    statusDisconnecting: 'DESCONECTANDO...',
    statusReady2: 'PRONTO',
    descConnected: 'Sua conexão está criptografada e protegida.',
    descConnecting: 'Processando, por favor aguarde.',
    descReady: 'Conecte-se para bypass de DPI.',

    btnConnect: 'CONECTAR',
    btnDisconnect: 'DESCONECTAR',
    btnConnecting: 'CONECTANDO...',
    btnApplyingSettings: 'APLICANDO CONFIGURAÇÕES...',
    btnDisconnecting: 'DESCONECTANDO...',
    btnConnectDevices: 'Conectar outros dispositivos',

    navSettings: 'CONFIGURAÇÕES',
    navLogs: 'LOGS',
    navExit: 'SAIR',

    logsTitle: 'LOGS DO SISTEMA',
    logsClear: 'LIMPAR',
    logsCopy: 'COPIAR',
    logsCopied: 'COPIADO!',
    logsCopyError: 'ERRO!',

    modalTitle: 'Conectar dispositivo',
    modalSubtitle: 'Compartilhamento LAN',
    modalDesc: 'Vá para as configurações de Wi-Fi do seu dispositivo, defina o <strong>Proxy</strong> como <strong>Manual</strong> e insira os detalhes abaixo.',
    modalDescPac: 'Recomenda-se o uso de <strong>Automático (PAC)</strong> em outros dispositivos.',
    modalPacQrHint: 'Escaneie o QR, copie o endereço e cole nas configurações de <strong>Wi-Fi → Proxy → URL automática</strong> do seu dispositivo.<br><br><span class="text-red-500 font-semibold">IMPORTANTE:</span> Se você tiver problemas de rede após desconectar, desligue e ligue o Wi-Fi do seu dispositivo.',
    modalPacUrl: 'Endereço PAC (Recomendado)',
    modalManualFallback: 'Alternativa: Proxy manual',
    modalTabPac: 'Automático (PAC)',
    modalTabManual: 'Manual',
    modalPacStep1Title: '1. Abrir guia de configuração',
    modalPacStep1Desc: 'Escaneie o código QR com sua câmera para abrir o guia passo a passo.',
    modalPacStep2Title: '2. Copiar endereço PAC',
    modalPacStep2Desc: 'Cole este código no campo "URL automática" mostrado no guia:',
    modalPacWarningTitle: 'ATENÇÃO:',
    modalPacWarningDesc: 'Se aplicativos como o YouTube perderem o acesso à Internet após fechar o DocsPI (devido a conexões em cache), basta reiniciar o Wi-Fi do seu dispositivo.',
    modalManualWarningTitle: 'ATENÇÃO:',
    modalManualWarningDesc: 'Quando o DocsPI é fechado, seu dispositivo perderá completamente o acesso à Internet. Para restaurar a conexão, você deve remover a configuração de Proxy das suas configurações de Wi-Fi.',
    modalPacQrCaption: 'QR → Página de configuração (escanear e copiar)',
    modalHost: 'Servidor (Host)',
    modalPort: 'Porta',
    modalTutorial: 'Como fazer? (Guia)',

    adminTitle: 'Administrador necessário',
    adminDesc: 'O DocsPI precisa ser executado como administrador para funcionar corretamente.',
    adminStep: 'Clique com o botão direito no aplicativo → Selecione <strong>"Executar como administrador"</strong>',
    adminClose: 'FECHAR',
    adminHowItWorks: 'Como funciona?',

    noInternetTitle: 'Sem conexão com a Internet',
    noInternetDesc: 'Por favor, verifique sua conexão com a Internet.',
    noInternetRetry: 'Repetir',

    logEngineStarting: (port) => `Iniciando motor DocsPI (Porta: ${port})...`,
    logDnsUsed: (name, ip) => `DNS usado: ${name} (${ip})`,
    logDnsDefault: 'DNS: Padrão do sistema',
    logConnected: 'Conexão bem-sucedida! O tráfego está criptografado.',
    logDisconnected: 'Desconectado.',
    logProxySet: (port) => `Proxy do sistema configurado: 127.0.0.1:${port}`,
    logProxyCleared: 'Proxy do sistema limpo',
    logEngineStopped: (code) => `O motor DocsPI parou inesperadamente (Código: ${code})`,
    logEngineStartError: (err) => `Falha ao iniciar o motor: ${err}`,
    logAutoReconnect: 'Reconexão automática ativada...',
    logReconnecting: (n) => `Reconectando... (Tentativa ${n}/5)`,
    logReconnectWait: (sec, n) => `Tentando novamente em ${sec} segundos... (Tentativa ${n}/5)`,
    logReconnectNow: 'Reconectando agora...',
    logMaxRetries: 'Falha na conexão. Número máximo de tentativas atingido.',
    logPossibleReasons: 'Possíveis razões:',
    logReasonInternet: 'Sua Internet pode estar desconectada',
    logReasonFirewall: 'O Firewall/Antivírus pode estar bloqueando o DocsPI',
    logReasonPorts: 'As portas 8080-8084 podem estar em uso',
    logSolutions: 'Soluções sugeridas:',
    logSolInternet: 'Verifique sua conexão com a Internet',
    logSolFirewall: 'Verifique suas configurações de firewall',
    logSolAdmin: 'Execute o aplicativo como administrador',
    logSolLogs: 'Copie e compartilhe os logs para suporte',
    logLanRestart: 'Compartilhamento LAN alterado, reiniciando conexão...',
    logDpiRestart: 'Modo DPI alterado, reiniciando conexão...',
    logEngineStoppedGrace: 'Motor DocsPI parado.',
    logServiceStopped: 'Serviço parado.',
    logShutdownStarting: 'Iniciando desligamento...',
    logProcessStopped: 'Processo parado.',
    logSpoofReady: (port) => `Motor SpoofDPI iniciado (Porta: ${port})`,
    logPacStarted: 'Servidor PAC iniciado (para dispositivos LAN)',
    logPacStartError: (err) => `Falha ao iniciar o servidor PAC: ${err}`,
    logEngineActive: 'Motor DocsPI ativo',
    logPortBusy: (port) => `A porta ${port} está ocupada, tentando outra...`,
    logInitializing: 'O motor está sendo inicializado...',
    logPortRetryOpen: (port) => `Não foi possível abrir a porta ${port}, tentando novamente...`,
    logProxyClearError: (err) => `Erro ao limpar proxy: ${err}`,
    logProxySetError: (err) => `Erro ao configurar proxy: ${err}`,
    logServiceStopError: (err) => `Erro ao parar serviço: ${err}`,
    logConfigError: (err) => `Erro de configuração: ${err}`,
    logAdminMissing: 'Falta permissão de administrador! O aplicativo pode não funcionar corretamente.',
    logInternetBack: 'Conexão com a Internet restaurada.',
    logInternetLost: 'Conexão com a Internet perdida!',
    logPortRetry: (count) => `Conflito de porta, tentando nova porta... (${count}/20)`,
    logNoPort: 'Nenhuma porta disponível encontrada.',
    logWinHttpEnabled: 'Túnel proxy de Modo Jogo (WinHTTP) aplicado.',
    logWpcapMissing: 'O SpoofDPI não encontrou o wpcap.dll. Por favor, instale o Npcap ou WinPcap e reinicie o aplicativo.',
    logAntivirusWarning: 'O Windows Defender ou seu antivírus pode ter bloqueado o \'docspi-proxy.exe\'. Por favor, adicione o arquivo à lista de exclusões.',
    logFailsafePortClosed: 'Tempo limite da porta esgotado, tentando conexão novamente...',

    settingsTitle: 'CONFIGURAÇÕES',

    sectionMethod: 'MÉTODO DE CONEXÃO',
    sectionMethodWhy: 'Uma única configuração para todos os ISPs. Use em todos os dispositivos via LAN. Baseado em proxy, sem ping/jitter em jogos.',
    methodStrong: 'Modo Forte',
    methodStrongDesc: 'O bypass mais forte para ISPs difíceis (adiciona latência)',
    methodTurbo: 'Modo Turbo',
    methodTurboDesc: 'Latência mínima, para DPI leve',
    methodBalanced: 'Modo Equilibrado (Recomendado)',
    methodBalancedDesc: 'Bypass rápido + forte, funciona na maioria dos ISPs',

    sectionAdvanced: 'AVANÇADO',
    chunkSizeLabel: 'Tamanho do pedaço (chunk size)',
    chunkSizeDesc: 'Controla em quantos pedaços o tráfego HTTPS é dividido. Dependendo do seu ISP, 4 ou 16 pode ser mais rápido; 8 costuma ser equilibrado (padrão).',
    chunkSize4: '4 — Mais forte (alguns ISPs)',
    chunkSize8: '8 — Equilibrado (padrão)',
    chunkSize16: '16 — Mais rápido (alguns ISPs)',

    sectionNetwork: 'CONFIGURAÇÕES DE REDE',
    lanSharing: 'Compartilhamento LAN',
    lanSharingDesc: 'Permitir conexões de outros dispositivos (Celular, Console)',

    sectionAutomation: 'AUTOMAÇÃO',
    autoConnect: 'Conexão automática',
    autoConnectDesc: 'Conectar assim que o aplicativo abrir',
    autoReconnect: 'Reconexão automática',
    autoReconnectDesc: 'Tentar novamente automaticamente se a conexão cair',

    sectionGeneral: 'GERAL',
    autoStart: 'Iniciar com o sistema',
    autoStartDesc: 'Lançar o DocsPI quando o Windows iniciar',
    minimizeToTray: 'Minimizar para a bandeja',
    minimizeToTrayDesc: 'Executar em segundo plano quando fechado',
    alwaysOnTop: 'Sempre no topo',
    alwaysOnTopDesc: 'A janela sempre fica sobre as outras janelas',
    requireConfirmation: 'Confirmação de ação',
    requireConfirmationDesc: 'Perguntar antes de desconectar ou sair',
    language: 'IDIOMA',
    languageDesc: 'Alterar o idioma da interface',

    sectionNotifications: 'NOTIFICAÇÕES',
    notifications: 'Notificações de área de trabalho',
    notificationsDesc: 'Interruptor mestre de notificações (Ativar/Desativar tudo)',
    notifyOnConnect: 'Ao estabelecer conexão',
    notifyOnConnectDesc: 'Notificar quando a conexão for protegida com sucesso',
    notifyOnDisconnect: 'Ao perder conexão',
    notifyOnDisconnectDesc: 'Notificar em quedas inesperadas ou reparos',
    notifDisconnectManual: 'Conexão encerrada com sucesso.',

    sectionDns: 'LISTA DE DNS',
    dnsAutoSelect: 'Seleção automática (Recomendado)',
    dnsAutoSelectDesc: 'Encontra automaticamente o servidor mais rápido',
    dnsSystemDefault: 'Padrão do sistema',
    dnsSystemDefaultDesc: 'DNS padrão do SpoofDPI',
    dnsCfDesc: 'Rápido e Privado',
    dnsAdguardDesc: 'Bloqueador de Anúncios',
    dnsGoogleDesc: 'Confiável',
    dnsQuad9Desc: 'Focado em Segurança',
    dnsOpenDnsDesc: 'Distribuído pela Cisco',
    dnsCheckSpeed: 'Teste de ping DNS',
    dnsChecking: 'Medindo...',

    driverStatusInstalled: 'Filtragem avançada ativa',
    driverStatusMissing: 'Desbloqueie recursos avançados se o bypass falhar',
    driverInstallBtn: 'INSTALAR DRIVER (RECOMENDADO)',
    driverIspWarning: 'Se você tiver problemas de conexão, pode desbloquear recursos de bypass de DPI muito mais avançados instalando o driver.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Selecione seu provedor de Internet',
    issOverlayDesc: 'Deixe-nos aplicar automaticamente as melhores configurações para seu ISP.',
    issOverlayApply: 'APLICAR E CONECTAR',
    issOverlaySkip: 'Pular',
    issProfileActive: 'Perfil ativo',
    issProfileSee: 'Ver configurações recomendadas',
    issApplyBtn: 'Auto aplicar configurações',
    issAppliedMsg: 'Esta configuração está em uso no momento',

    // ISS Guide (Settings)
    issGuideTitle: 'GUIA DE ISP',
    issLightName: 'TurkNet',
    issLightDesc: 'Filtragem leve. O Modo Turbo garante que não haja aumento de ping nem perda de velocidade.',
    issMidName: 'Apenas alguns ISPs',
    issMidDesc: 'Bloqueio padrão. O Modo Forte divide pacotes para acesso confiável.',
    issHeavyName: 'Provedores turcos (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Dispositivos DPI potentes e inteligentes são usados. Pode exigir Modo Forte.',
    issChinaName: 'China (Great Firewall)',
    issChinaDesc: 'Superar o sistema DPI mais avançado do mundo pode exigir Modo Forte e configurações de SNI personalizadas.',
    issRussiaName: 'Rússia (Roskomnadzor)',
    issRussiaDesc: 'O Modo Forte é recomendado para bloqueios complexos.',
    issIndiaName: 'Índia',
    issIndiaDesc: 'O Modo Equilibrado é suficiente para bloqueios padrão.',
    issUsaName: 'EUA / Global',
    issUsaDesc: 'O Modo Turbo é recomendado para restrições leves.',
    issGlobalName: 'Global / Outro',
    issGlobalDesc: 'Configurações gerais de bypass para todos os países.',
    issOtherName: 'Outro / Desconhecido',
    issOtherDesc: 'Começa com o Modo Forte. Funciona de forma confiável com a maioria dos provedores.',

    // Bypass Settings
    sectionBypass: 'CONFIGURAÇÕES DETALHADAS DE BYPASS',
    modeTurboName: 'Modo Turbo',
    modeTurboDesc: 'Latência mínima. Supera filtros leves instantaneamente.',
    modeBalancedName: 'Modo Equilibrado',
    modeBalancedDesc: 'Rápido e estável. Supera filtros padrão.',
    modeStrongName: 'Modo Forte',
    modeStrongDesc: 'Supera DPI difícil com pacotes falsos.',

    // Extra Network
    sectionExtraNetwork: 'CONFIGURAÇÕES DE REDE EXTRA',
    ipv4ForceTitle: 'Forçar IPv4 (Recomendado)',
    ipv4ForceDesc: 'Evita carregamento infinito e erros de tempo limite.',
    networkModeLabel: 'Modo de Rede',
    modeSmooth: 'Modo Fluido',
    modeSmoothDesc: 'Latência mínima. Ideal para navegadores e Discord.',
    modeGame: 'Modo Jogo',
    modeGameDesc: 'Roblox, jogos UDP e todos os apps. Bypass em nível de kernel.',
    modeSuper: 'Modo Super',
    modeSuperDesc: 'Híbrido: Fluido + Jogo combinados. Melhor equilíbrio.',
    modeRequiresNpcap: 'Driver Npcap necessário',
    modeBadgeSmooth: 'Fluido',
    modeBadgeGame: 'Jogo',
    modeBadgeSuper: 'Super',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'CONFIGURAÇÕES AVANÇADAS',
    advancedNpcapDesc: 'ISPs com medidas pesadas de DPI (Kablonet, Superonline etc.) exigem manipulação avançada de pacotes.',
    advancedNpcapInstalled: 'Npcap instalado — Recursos avançados ativos',
    advancedNpcapMissing: 'Npcap não instalado — Modo forte limitado',
    advancedNpcapInstallBtn: 'INSTALAR DRIVER NPCAP',
    advancedNpcapWhy: 'O Npcap fornece acesso de baixo nível aos pacotes de rede. Isso permite técnicas avançadas de bypass de DPI.',
    advancedFeaturesToggle: 'Bypass avançado',
    advancedFeaturesToggleDesc: 'Habilita injeção de pacotes falsos e técnicas avançadas de bypass de DPI.',
    npcapRestartWarning: 'Você precisa reiniciar seu computador para o Npcap funcionar.',
    logStrongFake: 'Modo Forte: Pacote Falso (3) ativo.',
    logStrongNoDriver: 'Modo Forte: Sem driver, apenas Chunk-1 ativo.',
    logStrongChunkOnly: 'Modo Forte: Chunk-1 ativo.',
    logNpcapFallback: 'O driver Npcap não está respondendo. Desativando bypass avançado e tentando novamente...',
    advancedNpcapHint: 'Instale o driver Npcap para um bypass mais forte',

    sectionTroubleshoot: 'SOLUÇÃO DE PROBLEMAS',
    fixInternet: 'Reparar conexão com a Internet',
    fixInternetDesc: 'Repara a Internet se o proxy ficar travado.',
    fixRepairing: 'Reparando...',
    fixRepairingDesc: 'Redefinindo configurações do sistema, por favor aguarde.',
    fixDone: 'Reparado!',
    fixDoneDesc: 'Configurações de proxy limpas, Internet restaurada.',
    fixError: 'Ocorreu um erro!',
    fixErrorDesc: 'Algo deu errado durante o processo.',

    sectionDev: 'DESENVOLVEDOR',
    devRole: 'Desenvolvedor DocsPI',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'IMPORTANTE',
    noticeTitle: 'Segurança e Falsos Positivos',
    noticeDesc: 'O motor DocsPI pode às vezes ser marcado como "falso positivo" por sistemas baseados em IA. Isso é completamente inofensivo.',

    // Dialogs
    confirmExitTitle: 'Sair',
    confirmExitDesc: 'Tem certeza de que deseja parar o motor DocsPI e sair?',
    confirmDisconnectTitle: 'Desconectar',
    confirmDisconnectDesc: 'Tem certeza de que deseja encerrar sua conexão segura?',

    // Settings Tabs
    tabGeneral: 'GERAL',
    tabNetwork: 'REDE',
    tabNotification: 'ALERTAS',
    tabSystem: 'SISTEMA',

    // ISP Detection
    ispDetected: (name) => `${name} detectado`,
    ispSuggestion: (profile) => `Modo ${profile} recomendado`,
    ispAutoSelected: 'Seu ISP foi selecionado automaticamente',

    // Connection Statistics
    statsUptime: 'Tempo ativo',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `Nova versão disponível: v${ver}`,
    updateDownload: 'Baixar',
    updateDismiss: 'Depois',

    // Custom Domain List
    sectionDomains: 'LISTA DE DOMÍNIOS PERSONALIZADA',
    sectionDomainsDesc: 'Estes domínios evitam o proxy (conexão DIRETA).',
    domainAdd: 'Adicionar',
    domainRemove: 'Remover',
    domainPlaceholder: 'ex: *.example.com ou site.com',
    domainEmpty: 'Nenhum domínio adicionado ainda.',

    // Profile Saving
    sectionProfiles: 'PERFIS DE CONFIGURAÇÕES',
    sectionProfilesDesc: 'Salve suas configurações atuais e carregue-as com um clique.',
    profileSave: 'Salvar configurações atuais',
    profileSaveShort: 'Salvar',
    profileLoad: 'Carregar',
    profileDelete: 'Excluir',
    profileName: 'Digite o nome do perfil...',
    profileSaved: 'Perfil salvo!',
    profileLoaded: 'Perfil carregado!',
    profileEmpty: 'Nenhum perfil salvo ainda.',

    themeLabel: 'Tema',
    themeDark: 'Escuro',
    themeLight: 'Claro',
    themeDarkDesc: 'Tema escuro ativo',
    themeLightDesc: 'Tema claro ativo',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Executando teste de bypass...',
    bypassTestSuccess: 'Bypass ativo! Conexão bem-sucedida.',
    bypassTestSuccessShort: 'Ativo',
    bypassTestFailed: 'Bypass não está funcionando. Falha na conexão.',
    bypassTestFailedShort: 'Falhou',
    bypassTestTimeout: 'O teste de bypass expirou.',

    autoEscalateLabel: 'Escalonamento automático de modo',
    autoEscalateDesc: 'Mudar para um modo mais forte se a conexão falhar',
    logAutoEscalate: (mode) => `Falha na conexão, mudando para o modo ${mode}...`,
    logTrayModeChanged: (mode) => `Modo alterado pela bandeja: ${mode}`,

    statsTitle: 'Estatísticas de conexão',
    statsTotalSessions: 'Sessões totais',
    statsTotalUptime: 'Tempo total',
    statsMostUsedMode: 'Modo mais usado',
    statsAvgPing: 'Ping médio',
    statsReset: 'Redefinir estatísticas',
    statsEmpty: 'Ainda não há sessões gravadas',

    welcomeTitle: 'Bem-vindo ao DocsPI',
    welcomeDesc: 'Você está prestes a dar seu primeiro passo em direção a uma Internet livre e segura. Temos alguns passos curtos para definir as melhores configurações para você.',
    welcomeNext: 'Vamos começar',
    welcomePrivacy: 'Sua privacidade é importante para nós. Seus dados nunca são gravados.',
    fakeSniLabel: 'Fake SNI',
    btnYes: 'Sim',
    logFilterError: 'Erros',
    logDirtyShutdownRecovery: 'O desligamento anterior foi inesperado. Recuperando...',
    logFilterSuccess: 'Sucesso',
    logFilterInfo: 'Info',
    btnNo: 'N�o',
    logFilterWarn: 'Avisos',
    logFilterAll: 'Todos',
  },

  ja: {
    appName: 'DOCSPI',
    statusActive: 'アクティブ',
    statusInactive: 'オフ',
    statusReady: '準備完了',

    statusConnected: '安全',
    statusConnecting: '接続中...',
    statusDisconnecting: '切断中...',
    statusReady2: '準備完了',
    descConnected: '接続は暗号化され、保護されています。',
    descConnecting: '処理中です。しばらくお待ちください。',
    descReady: 'DPIバイパスのために接続してください。',

    btnConnect: '接続',
    btnDisconnect: '切断',
    btnConnecting: '接続中...',
    btnApplyingSettings: '設定を適用中...',
    btnDisconnecting: '切断中...',
    btnConnectDevices: '他のデバイスを接続',

    navSettings: '設定',
    navLogs: 'ログ',
    navExit: '終了',

    logsTitle: 'システムログ',
    logsClear: 'クリア',
    logsCopy: 'コピー',
    logsCopied: 'コピーしました！',
    logsCopyError: 'エラー！',

    modalTitle: 'デバイスを接続',
    modalSubtitle: 'LAN共有',
    modalDesc: 'デバイスのWi-Fi設定に移動し、<strong>プロキシ</strong>を<strong>手動</strong>に設定して、以下の詳細を入力してください。',
    modalDescPac: '他のデバイスでは<strong>自動 (PAC)</strong>を使用することをお勧めします。',
    modalPacQrHint: 'QRをスキャンしてアドレスをコピーし、デバイスの<strong>Wi-Fi → プロキシ → 自動URL</strong>設定に貼り付けてください。<br><br><span class="text-red-500 font-semibold">重要：</span> 切断後にネットワークの問題が発生した場合は、デバイスのWi-Fiを一度オフにしてから再度オンにしてください。',
    modalPacUrl: 'PACアドレス (推奨)',
    modalManualFallback: '代替案：手動プロキシ',
    modalTabPac: '自動 (PAC)',
    modalTabManual: '手動',
    modalPacStep1Title: '1. セットアップガイドを開く',
    modalPacStep1Desc: 'カメラでQRコードをスキャンして、ステップバイステップガイドを開きます。',
    modalPacStep2Title: '2. PACアドレスをコピー',
    modalPacStep2Desc: 'ガイドに表示されている「自動URL」フィールドにこのコードを貼り付けてください：',
    modalPacWarningTitle: '注意：',
    modalPacWarningDesc: 'DocsPIを閉じた後にYouTubeなどのアプリがインターネットにアクセスできなくなった場合（キャッシュされた接続のため）、デバイスのWi-Fiを切り替えてください。',
    modalManualWarningTitle: '注意：',
    modalManualWarningDesc: 'DocsPIを閉じると、デバイスはインターネットアクセスを完全に失います。接続を復元するには、Wi-Fi設定からプロキシ設定を削除する必要があります。',
    modalPacQrCaption: 'QR → セットアップページ (スキャンしてコピー)',
    modalHost: 'ホスト (Host)',
    modalPort: 'ポート',
    modalTutorial: '使い方は？ (ガイド)',

    adminTitle: '管理者権限が必要',
    adminDesc: 'DocsPIを正しく動作させるには、管理者として実行する必要があります。',
    adminStep: 'アプリを右クリック → <strong>「管理者として実行」</strong>を選択',
    adminClose: '閉じる',
    adminHowItWorks: '仕組みは？',

    noInternetTitle: 'インターネット接続なし',
    noInternetDesc: 'インターネット接続を確認してください。',
    noInternetRetry: '再試行',

    logEngineStarting: (port) => `DocsPIエンジンを起動中 (ポート: ${port})...`,
    logDnsUsed: (name, ip) => `使用中のDNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: システムデフォルト',
    logConnected: '接続成功！トラフィックは暗号化されています。',
    logDisconnected: '切断されました。',
    logProxySet: (port) => `システムプロキシを設定しました: 127.0.0.1:${port}`,
    logProxyCleared: 'システムプロキシを解除しました',
    logEngineStopped: (code) => `DocsPIエンジンが予期せず停止しました (コード: ${code})`,
    logEngineStartError: (err) => `エンジンの起動に失敗しました: ${err}`,
    logAutoReconnect: '自動再接続が有効です...',
    logReconnecting: (n) => `再接続中... (試行 ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec}秒後に再試行します... (試行 ${n}/5)`,
    logReconnectNow: '今すぐ再接続中...',
    logMaxRetries: '接続失敗。最大試行回数に達しました。',
    logPossibleReasons: '考えられる理由：',
    logReasonInternet: 'インターネットが切断されている可能性があります',
    logReasonFirewall: 'ファイアウォール/ウイルス対策ソフトがDocsPIをブロックしている可能性があります',
    logReasonPorts: 'ポート8080-8084が使用中である可能性があります',
    logSolutions: '推奨される解決策：',
    logSolInternet: 'インターネット接続を確認してください',
    logSolFirewall: 'ファイアウォールの設定を確認してください',
    logSolAdmin: 'アプリを管理者として実行してください',
    logSolLogs: 'ログをコピーしてサポートに共有してください',
    logLanRestart: 'LAN共有が変更されました。接続を再起動しています...',
    logDpiRestart: 'DPIモードが変更されました。接続を再起動しています...',
    logEngineStoppedGrace: 'DocsPIエンジンが停止しました。',
    logServiceStopped: 'サービスが停止しました。',
    logShutdownStarting: 'シャットダウンを開始しています...',
    logProcessStopped: 'プロセスが停止しました。',
    logSpoofReady: (port) => `SpoofDPIエンジンが起動しました (ポート: ${port})`,
    logPacStarted: 'PACサーバーが起動しました (LANデバイス用)',
    logPacStartError: (err) => `PACサーバーの起動に失敗しました: ${err}`,
    logEngineActive: 'DocsPIエンジンがアクティブです',
    logPortBusy: (port) => `ポート ${port} は使用中です。別のポートを試しています...`,
    logInitializing: 'エンジンを初期化中...',
    logPortRetryOpen: (port) => `ポート ${port} を開けませんでした。再試行中...`,
    logProxyClearError: (err) => `プロキシの解除に失敗しました: ${err}`,
    logProxySetError: (err) => `プロキシの設定に失敗しました: ${err}`,
    logServiceStopError: (err) => `サービスの停止に失敗しました: ${err}`,
    logConfigError: (err) => `設定エラー: ${err}`,
    logAdminMissing: '管理者権限がありません！アプリが正しく動作しない可能性があります。',
    logInternetBack: 'インターネット接続が復旧しました。',
    logInternetLost: 'インターネット接続が失われました！',
    logPortRetry: (count) => `ポート競合。新しいポートを試しています... (${count}/20)`,
    logNoPort: '利用可能なポートが見つかりませんでした。',
    logWinHttpEnabled: 'ゲームモード (WinHTTP) プロキシトンネルが適用されました。',
    logWpcapMissing: 'SpoofDPIがwpcap.dllを見つけられませんでした。NpcapまたはWinPcapをインストールしてから、アプリを再起動してください。',
    logAntivirusWarning: 'Windows Defenderまたはウイルス対策ソフトが「docspi-proxy.exe」をブロックしている可能性があります。除外リストに追加してください。',
    logFailsafePortClosed: 'ポートがタイムアウトしました。接続を再試行中...',

    settingsTitle: '設定',

    sectionMethod: '接続方法',
    sectionMethodWhy: 'すべてのISPに対応する単一の設定。LAN経由ですべてのデバイスで使用可能。プロキシベースのため、ゲームでの遅延/ジッターはありません。',
    methodStrong: '強力モード',
    methodStrongDesc: '困難なISP向け。最強のバイパス (遅延が追加されます)',
    methodTurbo: 'ターボモード',
    methodTurboDesc: '最低遅延、軽度のDPI向け',
    methodBalanced: 'バランスモード (推奨)',
    methodBalancedDesc: '高速 + 強力なバイパス、ほとんどのISPで動作します',

    sectionAdvanced: '詳細設定',
    chunkSizeLabel: 'チャンクサイズ (chunk size)',
    chunkSizeDesc: 'HTTPSトラフィックをいくつの断片に分割するかを制御します。ISPによっては、4または16の方が速い場合があります。通常は8がバランスが良いです（デフォルト）。',
    chunkSize4: '4 — 最強 (一部のISP)',
    chunkSize8: '8 — バランス (デフォルト)',
    chunkSize16: '16 — 高速 (一部のISP)',

    sectionNetwork: 'ネットワーク設定',
    lanSharing: 'LAN共有',
    lanSharingDesc: '他のデバイス (スマホ、ゲーム機) からの接続を許可する',

    sectionAutomation: '自動化',
    autoConnect: '自動接続',
    autoConnectDesc: 'アプリを開くとすぐに接続する',
    autoReconnect: '自動再接続',
    autoReconnectDesc: '接続が切れた場合に自動的に再試行する',

    sectionGeneral: '全般',
    autoStart: '起動時に実行',
    autoStartDesc: 'Windows起動時にDocsPIを開始する',
    minimizeToTray: 'トレイに最小化',
    minimizeToTrayDesc: '閉じたときにバックグラウンドで実行する',
    alwaysOnTop: '常に最前面に表示',
    alwaysOnTopDesc: 'ウィンドウを常に他のウィンドウの上に表示する',
    requireConfirmation: '操作の確認',
    requireConfirmationDesc: '切断や終了の前に確認する',
    language: '言語',
    languageDesc: 'インターフェースの言語を変更する',

    sectionNotifications: '通知',
    notifications: 'デスクトップ通知',
    notificationsDesc: '通知のメインスイッチ (すべて有効/無効)',
    notifyOnConnect: '接続確立時',
    notifyOnConnectDesc: '接続が正常に保護されたときに通知する',
    notifyOnDisconnect: '接続切断時',
    notifyOnDisconnectDesc: '予期しない切断や修復時に通知する',
    notifDisconnectManual: '接続は正常に終了しました。',

    sectionDns: 'DNSリスト',
    dnsAutoSelect: '自動選択 (推奨)',
    dnsAutoSelectDesc: '最も速いサーバーを自動的に見つける',
    dnsSystemDefault: 'システムデフォルト',
    dnsSystemDefaultDesc: 'SpoofDPIデフォルトDNS',
    dnsCfDesc: '高速かつプライベート',
    dnsAdguardDesc: '広告ブロッカー',
    dnsGoogleDesc: '信頼性',
    dnsQuad9Desc: 'セキュリティ重視',
    dnsOpenDnsDesc: 'Cisco提供',
    dnsCheckSpeed: 'DNSピングテスト',
    dnsChecking: '測定中...',

    driverStatusInstalled: '高度なフィルタリングが有効',
    driverStatusMissing: 'バイパスが失敗する場合は高度な機能を解除してください',
    driverInstallBtn: 'ドライバーをインストール (推奨)',
    driverIspWarning: '接続に問題がある場合は、ドライバーをインストールすることで、より高度なDPIバイパス機能を解除できます。',

    // ISS Overlay (First Run)
    issOverlayTitle: 'インターネットプロバイダーを選択',
    issOverlayDesc: 'お使いのISPに最適な設定を自動的に適用します。',
    issOverlayApply: '適用して接続',
    issOverlaySkip: 'スキップ',
    issProfileActive: 'プロファイルがアクティブです',
    issProfileSee: '推奨設定を表示',
    issApplyBtn: '設定を自動適用',
    issAppliedMsg: 'この設定は現在使用されています',

    // ISS Guide (Settings)
    issGuideTitle: 'ISPガイド',
    issLightName: 'TurkNet',
    issLightDesc: '軽度のフィルタリング。ターボモードにより、ゲームでの遅延増加や速度低下はありません。',
    issMidName: '一部のISPのみ',
    issMidDesc: '標準的なブロック。強力モードはパケットを分割して確実なアクセスを実現します。',
    issHeavyName: 'トルコのプロバイダー (TT / Vodafone / Superonline)',
    issHeavyDesc: '強力でスマートなDPIデバイスが使用されています。強力モードが必要な場合があります。',
    issChinaName: '中国 (グレート・ファイアウォール)',
    issChinaDesc: '世界で最も高度なDPIシステムを克服するには、強力モードとカスタムSNI設定が必要な場合があります。',
    issRussiaName: 'ロシア (Roskomnadzor)',
    issRussiaDesc: '複雑なブロックには強力モードが推奨されます。',
    issIndiaName: 'インド',
    issIndiaDesc: '標準的なブロックにはバランスモードで十分です。',
    issUsaName: 'アメリカ / グローバル',
    issUsaDesc: '軽度の制限にはターボモードが推奨されます。',
    issGlobalName: 'グローバル / その他',
    issGlobalDesc: 'すべての国向けの一般的なバイパス設定。',
    issOtherName: 'その他 / 不明',
    issOtherDesc: '強力モードから開始します。ほとんどのプロバイダーで確実に動作します。',

    // Bypass Settings
    sectionBypass: '詳細なバイパス設定',
    modeTurboName: 'ターボモード',
    modeTurboDesc: '最低遅延。軽度のフィルターを即座にバイパスします。',
    modeBalancedName: 'バランスモード',
    modeBalancedDesc: '高速で安定。標準的なフィルターをバイパスします。',
    modeStrongName: '強力モード',
    modeStrongDesc: '偽のパケットを使用して困難なDPIをバイパスします。',

    // Extra Network
    sectionExtraNetwork: '追加のネットワーク設定',
    ipv4ForceTitle: 'IPv4を強制 (推奨)',
    ipv4ForceDesc: '無限ロードやタイムアウトエラーを防ぎます。',
    networkModeLabel: 'ネットワークモード',
    modeSmooth: 'スムーズモード',
    modeSmoothDesc: '最低遅延。ブラウザやDiscordに最適。',
    modeGame: 'ゲームモード',
    modeGameDesc: 'Roblox、UDPゲーム、すべてのアプリ。カーネルレベルのバイパス。',
    modeSuper: 'スーパーモード',
    modeSuperDesc: 'ハイブリッド：スムーズとゲームを統合。最高のバランス。',
    modeRequiresNpcap: 'Npcapドライバーが必要です',
    modeBadgeSmooth: 'スムーズ',
    modeBadgeGame: 'ゲーム',
    modeBadgeSuper: 'スーパー',

    // Advanced (Npcap)
    sectionAdvancedNpcap: '詳細設定',
    advancedNpcapDesc: '強力なDPI対策を行っているISP (Kablonet、Superonlineなど) では、高度なパケット操作が必要です。',
    advancedNpcapInstalled: 'Npcapがインストールされています — 高度な機能が有効',
    advancedNpcapMissing: 'Npcapがインストールされていません — 強力モードが制限されます',
    advancedNpcapInstallBtn: 'NPCAPドライバーをインストール',
    advancedNpcapWhy: 'Npcapはネットワークパケットへの低レベルアクセスを提供します。これにより、偽パケット注入などの高度なDPIバイパス技術が可能になります。',
    advancedFeaturesToggle: '高度なバイパス',
    advancedFeaturesToggleDesc: '偽パケット注入と高度なDPIバイパス技術を有効にします。',
    npcapRestartWarning: 'Npcapを動作させるには、コンピュータを再起動する必要があります。',
    logStrongFake: '強力モード：偽パケット (3) がアクティブ。',
    logStrongNoDriver: '強力モード：ドライバーなし、チャンク-1のみアクティブ。',
    logStrongChunkOnly: '強力モード：チャンク-1 がアクティブ。',
    logNpcapFallback: 'Npcapドライバーが応答しません。高度なバイパスを無効にして再試行中...',
    advancedNpcapHint: 'より強力なバイパスのためにNpcapドライバーをインストールしてください',

    sectionTroubleshoot: 'トラブルシューティング',
    fixInternet: 'インターネット接続を修復',
    fixInternetDesc: 'プロキシが停止した場合、インターネットを自動的に修復します。',
    fixRepairing: '修復中...',
    fixRepairingDesc: 'システム設定をリセットしています。しばらくお待ちください。',
    fixDone: '修復完了！',
    fixDoneDesc: 'プロキシ設定がクリアされ、インターネットが復旧しました。',
    fixError: 'エラーが発生しました！',
    fixErrorDesc: '処理中に問題が発生しました。',

    sectionDev: '開発者',
    devRole: 'DocsPI 開発者',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: '重要事項',
    noticeTitle: 'セキュリティと誤検知',
    noticeDesc: 'DocsPIエンジンは、AIベースのシステムによって「誤検知」としてフラグが立てられることがありますが、完全に無害です。',

    // Dialogs
    confirmExitTitle: '終了',
    confirmExitDesc: 'DocsPIエンジンを停止して終了しますか？',
    confirmDisconnectTitle: '切断',
    confirmDisconnectDesc: '安全な接続を終了しますか？',

    // Settings Tabs
    tabGeneral: '全般',
    tabNetwork: 'ネットワーク',
    tabNotification: '通知',
    tabSystem: 'システム',

    // ISP Detection
    ispDetected: (name) => `${name} を検出しました`,
    ispSuggestion: (profile) => `${profile} モードを推奨します`,
    ispAutoSelected: 'プロバイダーが自動的に選択されました',

    // Connection Statistics
    statsUptime: '稼働時間',
    statsPing: 'ピング',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `新しいバージョンが利用可能です: v${ver}`,
    updateDownload: 'ダウンロード',
    updateDismiss: '後で',

    // Custom Domain List
    sectionDomains: 'カスタムドメインリスト',
    sectionDomainsDesc: 'これらのドメインはプロキシをバイパスします (直接接続)。',
    domainAdd: '追加',
    domainRemove: '削除',
    domainPlaceholder: '例: *.example.com または site.com',
    domainEmpty: 'ドメインはまだ追加されていません。',

    // Profile Saving
    sectionProfiles: '設定プロファイル',
    sectionProfilesDesc: '現在の設定を保存し、ワンクリックでロードします。',
    profileSave: '現在の設定を保存',
    profileSaveShort: '保存',
    profileLoad: 'ロード',
    profileDelete: '削除',
    profileName: 'プロファイル名を入力...',
    profileSaved: 'プロファイルを保存しました！',
    profileLoaded: 'プロファイルをロードしました！',
    profileEmpty: 'プロファイルはまだ保存されていません。',

    themeLabel: 'テーマ',
    themeDark: 'ダーク',
    themeLight: 'ライト',
    themeDarkDesc: 'ダークテーマがアクティブ',
    themeLightDesc: 'ライトテーマがアクティブ',

    bypassTestBtn: 'バイパステスト',
    bypassTestTesting: 'バイパステストを実行中...',
    bypassTestSuccess: 'バイパス有効！接続成功。',
    bypassTestSuccessShort: '有効',
    bypassTestFailed: 'バイパスが機能していません。接続失敗。',
    bypassTestFailedShort: '失敗',
    bypassTestTimeout: 'バイパステストがタイムアウトしました。',

    autoEscalateLabel: '自動モードエスカレーション',
    autoEscalateDesc: '接続が失敗した場合、より強力なモードに切り替える',
    logAutoEscalate: (mode) => `接続失敗、${mode} モードに切り替えています...`,
    logTrayModeChanged: (mode) => `トレイからモードが変更されました: ${mode}`,

    statsTitle: '接続統計',
    statsTotalSessions: '合計セッション',
    statsTotalUptime: '合計稼働時間',
    statsMostUsedMode: '最も使用されたモード',
    statsAvgPing: '平均ピング',
    statsReset: '統計をリセット',
    statsEmpty: '記録されたセッションはまだありません',

    welcomeTitle: 'DocsPIへようこそ',
    welcomeDesc: '自由で安全なインターネットへの第一歩を踏み出そうとしています。最適な設定を行うための簡単なステップがあります。',
    welcomeNext: '始めましょう',
    welcomePrivacy: 'あなたのプライバシーは重要です。データが記録されることはありません。',
    fakeSniLabel: 'Fake SNI',
    btnYes: '??',
    logFilterError: '??�',
    logDirtyShutdownRecovery: '?????????????????????????...',
    logFilterSuccess: '??',
    logFilterInfo: '??',
    btnNo: '???',
    logFilterWarn: '??',
    logFilterAll: '???',
  },

  de: {
    appName: 'DOCSPI',
    statusActive: 'AKTIV',
    statusInactive: 'AUS',
    statusReady: 'BEREIT',

    statusConnected: 'SICHER',
    statusConnecting: 'VERBINDET...',
    statusDisconnecting: 'TRENNT...',
    statusReady2: 'BEREIT',
    descConnected: 'Ihre Verbindung ist verschlüsselt und geschützt.',
    descConnecting: 'Wird verarbeitet, bitte warten.',
    descReady: 'Verbinden für DPI-Bypass.',

    btnConnect: 'VERBINDEN',
    btnDisconnect: 'TRENNEN',
    btnConnecting: 'VERBINDET...',
    btnApplyingSettings: 'EINSTELLUNGEN ÜBERNEHMEN...',
    btnDisconnecting: 'TRENNT...',
    btnConnectDevices: 'Andere Geräte verbinden',

    navSettings: 'EINSTELLUNGEN',
    navLogs: 'PROTOKOLLE',
    navExit: 'BEENDEN',

    logsTitle: 'SYSTEMPROTOKOLLE',
    logsClear: 'LÖSCHEN',
    logsCopy: 'KOPIEREN',
    logsCopied: 'KOPIERT!',
    logsCopyError: 'FEHLER!',

    modalTitle: 'Gerät verbinden',
    modalSubtitle: 'LAN-Freigabe',
    modalDesc: 'Gehen Sie zu den Wi-Fi-Einstellungen Ihres Geräts, stellen Sie <strong>Proxy</strong> auf <strong>Manuell</strong> und geben Sie die folgenden Details ein.',
    modalDescPac: 'Die Verwendung von <strong>Automatisch (PAC)</strong> wird auf anderen Geräten empfohlen.',
    modalPacQrHint: 'Scannen Sie den QR, kopieren Sie die Adresse und fügen Sie sie in die Einstellungen für <strong>Wi-Fi → Proxy → Automatische URL</strong> Ihres Geräts ein.<br><br><span class="text-red-500 font-semibold">WICHTIG:</span> Wenn nach dem Trennen Netzwerkprobleme auftreten, schalten Sie das Wi-Fi Ihres Geräts aus und wieder ein.',
    modalPacUrl: 'PAC-Adresse (Empfohlen)',
    modalManualFallback: 'Alternative: Manueller Proxy',
    modalTabPac: 'Automatisch (PAC)',
    modalTabManual: 'Manuell',
    modalPacStep1Title: '1. Setup-Anleitung öffnen',
    modalPacStep1Desc: 'Scannen Sie den QR-Code mit Ihrer Kamera, um die Schritt-für-Schritt-Anleitung zu öffnen.',
    modalPacStep2Title: '2. PAC-Adresse kopieren',
    modalPacStep2Desc: 'Fügen Sie diesen Code in das in der Anleitung gezeigte Feld "Automatische URL" ein:',
    modalPacWarningTitle: 'ACHTUNG:',
    modalPacWarningDesc: 'Wenn Apps wie YouTube nach dem Schließen von DocsPI den Internetzugriff verlieren (aufgrund von zwischengespeicherten Verbindungen), schalten Sie einfach das Wi-Fi Ihres Geräts aus und wieder ein.',
    modalManualWarningTitle: 'ACHTUNG:',
    modalManualWarningDesc: 'Wenn DocsPI geschlossen wird, verliert Ihr Gerät den Internetzugriff vollständig. Um die Verbindung wiederherzustellen, müssen Sie die Proxy-Einstellung aus Ihren Wi-Fi-Einstellungen entfernen.',
    modalPacQrCaption: 'QR → Setup-Seite (scannen und kopieren)',
    modalHost: 'Host (Server)',
    modalPort: 'Port',
    modalTutorial: 'Wie geht das? (Anleitung)',

    adminTitle: 'Administratorrechte erforderlich',
    adminDesc: 'DocsPI muss als Administrator ausgeführt werden, um korrekt zu funktionieren.',
    adminStep: 'Rechtsklick auf die App → Wählen Sie <strong>"Als Administrator ausführen"</strong>',
    adminClose: 'SCHLIESSEN',
    adminHowItWorks: 'Wie funktioniert es?',

    noInternetTitle: 'Keine Internetverbindung',
    noInternetDesc: 'Bitte überprüfen Sie Ihre Internetverbindung.',
    noInternetRetry: 'Wiederholen',

    logEngineStarting: (port) => `DocsPI-Engine wird gestartet (Port: ${port})...`,
    logDnsUsed: (name, ip) => `Verwendeter DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: Systemstandard',
    logConnected: 'Verbindung erfolgreich! Der Datenverkehr wird verschlüsselt.',
    logDisconnected: 'Getrennt.',
    logProxySet: (port) => `System-Proxy konfiguriert: 127.0.0.1:${port}`,
    logProxyCleared: 'System-Proxy gelöscht',
    logEngineStopped: (code) => `Die DocsPI-Engine wurde unerwartet gestoppt (Code: ${code})`,
    logEngineStartError: (err) => `Engine konnte nicht gestartet werden: ${err}`,
    logAutoReconnect: 'Automatisches Wiederverbinden aktiviert...',
    logReconnecting: (n) => `Wiederverbinden... (Versuch ${n}/5)`,
    logReconnectWait: (sec, n) => `Wiederholung in ${sec} Sekunden... (Versuch ${n}/5)`,
    logReconnectNow: 'Wird jetzt wiederverbunden...',
    logMaxRetries: 'Verbindung fehlgeschlagen. Maximale Versuche erreicht.',
    logPossibleReasons: 'Mögliche Gründe:',
    logReasonInternet: 'Ihr Internet könnte getrennt sein',
    logReasonFirewall: 'Firewall/Antivirus blockiert möglicherweise DocsPI',
    logReasonPorts: 'Die Ports 8080-8084 könnten belegt sein',
    logSolutions: 'Empfohlene Lösungen:',
    logSolInternet: 'Überprüfen Sie Ihre Internetverbindung',
    logSolFirewall: 'Überprüfen Sie Ihre Firewall-Einstellungen',
    logSolAdmin: 'Führen Sie die Anwendung als Administrator aus',
    logSolLogs: 'Kopieren und teilen Sie die Protokolle für Support',
    logLanRestart: 'LAN-Freigabe geändert, Verbindung wird neu gestartet...',
    logDpiRestart: 'DPI-Modus geändert, Verbindung wird neu gestartet...',
    logEngineStoppedGrace: 'DocsPI-Engine gestoppt.',
    logServiceStopped: 'Dienst gestoppt.',
    logShutdownStarting: 'Herunterfahren wird gestartet...',
    logProcessStopped: 'Prozess gestoppt.',
    logSpoofReady: (port) => `SpoofDPI-Engine gestartet (Port: ${port})`,
    logPacStarted: 'PAC-Server gestartet (für LAN-Geräte)',
    logPacStartError: (err) => `PAC-Server konnte nicht gestartet werden: ${err}`,
    logEngineActive: 'DocsPI-Engine aktiv',
    logPortBusy: (port) => `Port ${port} ist belegt, ein anderer wird versucht...`,
    logInitializing: 'Engine wird initialisiert...',
    logPortRetryOpen: (port) => `Port ${port} konnte nicht geöffnet werden, Wiederholung...`,
    logProxyClearError: (err) => `Fehler beim Löschen des Proxys: ${err}`,
    logProxySetError: (err) => `Fehler beim Konfigurieren des Proxys: ${err}`,
    logServiceStopError: (err) => `Fehler beim Stoppen des Dienstes: ${err}`,
    logConfigError: (err) => `Konfigurationsfehler: ${err}`,
    logAdminMissing: 'Administratorrechte fehlen! Die App funktioniert möglicherweise nicht korrekt.',
    logInternetBack: 'Internetverbindung wiederhergestellt.',
    logInternetLost: 'Internetverbindung verloren!',
    logPortRetry: (count) => `Portkonflikt, neuer Port wird versucht... (${count}/20)`,
    logNoPort: 'Kein verfügbarer Port gefunden.',
    logWinHttpEnabled: 'Gaming-Modus (WinHTTP) Proxy-Tunnel angewendet.',
    logWpcapMissing: 'SpoofDPI konnte wpcap.dll nicht finden. Bitte installieren Sie Npcap oder WinPcap und starten Sie die Anwendung neu.',
    logAntivirusWarning: 'Windows Defender oder Ihre Antivirensoftware hat möglicherweise \'docspi-proxy.exe\' blockiert. Bitte fügen Sie die Datei zur Ausnahmeliste hinzu.',
    logFailsafePortClosed: 'Port-Zeitüberschreitung, Verbindung wird neu versucht...',

    settingsTitle: 'EINSTELLUNGEN',

    sectionMethod: 'VERBINDUNGSMETHODE',
    sectionMethodWhy: 'Eine einzige Einstellung für alle ISPs. Über LAN auf allen Geräten nutzbar. Proxy-basiert, daher kein Ping/Jitter in Spielen.',
    methodStrong: 'Starker Modus',
    methodStrongDesc: 'Stärkster Bypass für schwierige ISPs (erhöht die Latenz)',
    methodTurbo: 'Turbo-Modus',
    methodTurboDesc: 'Niedrigste Latenz, für leichtes DPI',
    methodBalanced: 'Ausbalanciert (Empfohlen)',
    methodBalancedDesc: 'Schneller + starker Bypass, funktioniert bei den meisten ISPs',

    sectionAdvanced: 'ERWEITERT',
    chunkSizeLabel: 'Fragmentgröße (chunk size)',
    chunkSizeDesc: 'Steuert, in wie viele Teile der HTTPS-Datenverkehr aufgeteilt wird. Je nach ISP können 4 oder 16 schneller sein; 8 ist meist ausbalanciert (Standard).',
    chunkSize4: '4 — Am stärksten (einige ISPs)',
    chunkSize8: '8 — Ausbalanciert (Standard)',
    chunkSize16: '16 — Schneller (einige ISPs)',

    sectionNetwork: 'NETZWERK',
    lanSharing: 'LAN-Freigabe',
    lanSharingDesc: 'Verbindungen von anderen Geräten (Smartphone, Konsole) zulassen',

    sectionAutomation: 'AUTOMATISIERUNG',
    autoConnect: 'Automatisch verbinden',
    autoConnectDesc: 'Verbinden, sobald die App geöffnet wird',
    autoReconnect: 'Automatisch wiederverbinden',
    autoReconnectDesc: 'Automatisch neu versuchen, wenn die Verbindung abbricht',

    sectionGeneral: 'ALLGEMEIN',
    autoStart: 'Mit System starten',
    autoStartDesc: 'DocsPI beim Start von Windows ausführen',
    minimizeToTray: 'Im System-Tray minimieren',
    minimizeToTrayDesc: 'Läuft im Hintergrund weiter, wenn geschlossen',
    alwaysOnTop: 'Immer im Vordergrund',
    alwaysOnTopDesc: 'Das Fenster bleibt immer über allen anderen Fenstern',
    requireConfirmation: 'Aktion bestätigen',
    requireConfirmationDesc: 'Vor dem Trennen oder Beenden nachfragen',
    language: 'SPRACHE',
    languageDesc: 'Sprache der Benutzeroberfläche ändern',

    sectionNotifications: 'BENACHRICHTIGUNGEN',
    notifications: 'Desktop-Benachrichtigungen',
    notificationsDesc: 'Hauptschalter für Benachrichtigungen (Alle Ein/Aus)',
    notifyOnConnect: 'Bei Verbindungsaufbau',
    notifyOnConnectDesc: 'Benachrichtigen, wenn die Verbindung erfolgreich gesichert wurde',
    notifyOnDisconnect: 'Bei Verbindungsabbruch',
    notifyOnDisconnectDesc: 'Bei unerwarteten Abbrüchen oder Reparaturen benachrichtigen',
    notifDisconnectManual: 'Verbindung erfolgreich beendet.',

    sectionDns: 'DNS-LISTE',
    dnsAutoSelect: 'Automatische Auswahl (Empfohlen)',
    dnsAutoSelectDesc: 'Findet automatisch den schnellsten Server',
    dnsSystemDefault: 'Systemstandard',
    dnsSystemDefaultDesc: 'SpoofDPI Standard-DNS',
    dnsCfDesc: 'Schnell und Privat',
    dnsAdguardDesc: 'Werbeblocker',
    dnsGoogleDesc: 'Zuverlässig',
    dnsQuad9Desc: 'Sicherheitsorientiert',
    dnsOpenDnsDesc: 'Unterstützt von Cisco',
    dnsCheckSpeed: 'DNS-Ping-Test',
    dnsChecking: 'Wird gemessen...',

    driverStatusInstalled: 'Erweiterte Filterung aktiv',
    driverStatusMissing: 'Erweiterte Funktionen freischalten, wenn Bypass fehlschlägt',
    driverInstallBtn: 'TREIBER INSTALLIEREN (EMPFOHLEN)',
    driverIspWarning: 'Wenn Sie Verbindungsprobleme haben, können Sie durch die Installation des Treibers viel fortschrittlichere DPI-Bypass-Funktionen freischalten.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Wählen Sie Ihren Internetanbieter',
    issOverlayDesc: 'Wir wenden automatisch die besten Einstellungen für Ihren Anbieter an.',
    issOverlayApply: 'ÜBERNEHMEN & VERBINDEN',
    issOverlaySkip: 'Überspringen',
    issProfileActive: 'Profil aktiv',
    issProfileSee: 'Empfohlene Einstellungen ansehen',
    issApplyBtn: 'Einstellungen automatisch übernehmen',
    issAppliedMsg: 'Diese Einstellung wird derzeit verwendet',

    // ISS Guide (Settings)
    issGuideTitle: 'ISP-LEITFADEN',
    issLightName: 'TurkNet',
    issLightDesc: 'Leichte Filterung. Der Turbo-Modus sorgt dafür, dass kein Ping-Anstieg oder Geschwindigkeitsverlust auftritt.',
    issMidName: 'Nur einige ISPs',
    issMidDesc: 'Standardmäßige Blockierung. Der starke Modus teilt Pakete für zuverlässigen Zugriff auf.',
    issHeavyName: 'Türkische Anbieter (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Es werden leistungsstarke und intelligente DPI-Geräte verwendet. Starker Modus kann erforderlich sein.',
    issChinaName: 'China (Great Firewall)',
    issChinaDesc: 'Die Überwindung des fortschrittlichsten DPI-Systems der Welt kann den starken Modus und benutzerdefinierte SNI-Einstellungen erfordern.',
    issRussiaName: 'Russland (Roskomnadzor)',
    issRussiaDesc: 'Der starke Modus wird für komplexe Blockierungen empfohlen.',
    issIndiaName: 'Indien',
    issIndiaDesc: 'Der ausbalancierte Modus reicht für Standard-Blockierungen aus.',
    issUsaName: 'USA / Global',
    issUsaDesc: 'Der Turbo-Modus wird für leichte Einschränkungen empfohlen.',
    issGlobalName: 'Global / Andere',
    issGlobalDesc: 'Allgemeine Bypass-Einstellungen für alle Länder.',
    issOtherName: 'Andere / Unbekannt',
    issOtherDesc: 'Startet mit dem starken Modus. Funktioniert zuverlässig bei den meisten Anbietern.',

    // Bypass Settings
    sectionBypass: 'DETAILLIERTE BYPASS-EINSTELLUNGEN',
    modeTurboName: 'Turbo-Modus',
    modeTurboDesc: 'Niedrigste Latenz. Überwindet leichte Filter sofort.',
    modeBalancedName: 'Ausbalancierter Modus',
    modeBalancedDesc: 'Schnell und stabil. Überwindet Standard-Filter.',
    modeStrongName: 'Starker Modus',
    modeStrongDesc: 'Überwindet schwieriges DPI mit gefälschten Paketen.',

    // Extra Network
    sectionExtraNetwork: 'ZUSÄTZLICHE NETZWERKEINSTELLUNGEN',
    ipv4ForceTitle: 'IPv4 erzwingen (Empfohlen)',
    ipv4ForceDesc: 'Verhindert unendliches Laden und Zeitüberschreitungsfehler.',
    networkModeLabel: 'Netzwerkmodus',
    modeSmooth: 'Flüssiger Modus',
    modeSmoothDesc: 'Niedrigste Latenz. Ideal für Browser und Discord.',
    modeGame: 'Gaming-Modus',
    modeGameDesc: 'Roblox, UDP-Spiele und alle Apps. Bypass auf Kernel-Ebene.',
    modeSuper: 'Super-Modus',
    modeSuperDesc: 'Hybrid: Flüssig + Gaming kombiniert. Beste Balance.',
    modeRequiresNpcap: 'Npcap-Treiber erforderlich',
    modeBadgeSmooth: 'Flüssig',
    modeBadgeGame: 'Gaming',
    modeBadgeSuper: 'Super',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'ERWEITERTE EINSTELLUNGEN',
    advancedNpcapDesc: 'Anbieter mit starken DPI-Maßnahmen (Kablonet, Superonline etc.) erfordern eine fortschrittliche Paketmanipulation.',
    advancedNpcapInstalled: 'Npcap installiert — Erweiterte Funktionen aktiv',
    advancedNpcapMissing: 'Npcap nicht installiert — Starker Modus eingeschränkt',
    advancedNpcapInstallBtn: 'NPCAP-TREIBER INSTALLIEREN',
    advancedNpcapWhy: 'Npcap bietet Low-Level-Zugriff auf Netzwerkpakete. Dies ermöglicht fortschrittliche DPI-Bypass-Techniken wie Fake-Packet-Injection.',
    advancedFeaturesToggle: 'Erweiterter Bypass',
    advancedFeaturesToggleDesc: 'Aktiviert Fake-Packet-Injection und fortschrittliche DPI-Bypass-Techniken.',
    npcapRestartWarning: 'Sie müssen Ihren Computer neu starten, damit Npcap funktioniert.',
    logStrongFake: 'Starker Modus: Fake-Paket (3) aktiv.',
    logStrongNoDriver: 'Starker Modus: Kein Treiber, nur Chunk-1 aktiv.',
    logStrongChunkOnly: 'Starker Modus: Chunk-1 aktiv.',
    logNpcapFallback: 'Npcap-Treiber antwortet nicht. Erweiterter Bypass wird deaktiviert und neu versucht...',
    advancedNpcapHint: 'Installieren Sie den Npcap-Treiber für stärkeren Bypass',

    sectionTroubleshoot: 'FEHLERBEHEBUNG',
    fixInternet: 'Internetverbindung reparieren',
    fixInternetDesc: 'Repariert das Internet, wenn der Proxy hängen bleibt.',
    fixRepairing: 'Wird repariert...',
    fixRepairingDesc: 'Systemeinstellungen werden zurückgesetzt, bitte warten.',
    fixDone: 'Repariert!',
    fixDoneDesc: 'Proxy-Einstellungen gelöscht, Internet wiederhergestellt.',
    fixError: 'Fehler aufgetreten!',
    fixErrorDesc: 'Etwas ist während des Vorgangs schiefgelaufen.',

    sectionDev: 'ENTWICKLER',
    devRole: 'DocsPI Entwickler',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'WICHTIG',
    noticeTitle: 'Sicherheit & Fehlalarme',
    noticeDesc: 'Die DocsPI-Engine kann manchmal von KI-basierten Systemen wie Windows Defender als "fehlalarm" eingestuft werden. Dies ist völlig harmlos.',

    // Dialogs
    confirmExitTitle: 'Beenden',
    confirmExitDesc: 'Sind Sie sicher, dass Sie die DocsPI-Engine stoppen und beenden möchten?',
    confirmDisconnectTitle: 'Trennen',
    confirmDisconnectDesc: 'Sind Sie sicher, dass Sie Ihre sichere Verbindung beenden möchten?',

    // Settings Tabs
    tabGeneral: 'ALLGEMEIN',
    tabNetwork: 'NETZWERK',
    tabNotification: 'ALERTE',
    tabSystem: 'SYSTEM',

    // ISP Detection
    ispDetected: (name) => `${name} erkannt`,
    ispSuggestion: (profile) => `${profile}-Modus empfohlen`,
    ispAutoSelected: 'Ihr Anbieter wurde automatisch ausgewählt',

    // Connection Statistics
    statsUptime: 'Laufzeit',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `Neue Version verfügbar: v${ver}`,
    updateDownload: 'Download',
    updateDismiss: 'Später',

    // Custom Domain List
    sectionDomains: 'BENUTZERDEFINIERTE DOMAIN-LISTE',
    sectionDomainsDesc: 'Diese Domains umgehen den Proxy (DIREKTE Verbindung).',
    domainAdd: 'Hinzufügen',
    domainRemove: 'Entfernen',
    domainPlaceholder: 'z.B. *.example.com oder seite.com',
    domainEmpty: 'Noch keine Domains hinzugefügt.',

    // Profile Saving
    sectionProfiles: 'EINSTELLUNGSPROFILE',
    sectionProfilesDesc: 'Speichern Sie Ihre aktuellen Einstellungen und laden Sie sie mit einem Klick.',
    profileSave: 'Aktuelle Einstellungen speichern',
    profileSaveShort: 'Speichern',
    profileLoad: 'Laden',
    profileDelete: 'Löschen',
    profileName: 'Profilnamen eingeben...',
    profileSaved: 'Profil gespeichert!',
    profileLoaded: 'Profil geladen!',
    profileEmpty: 'Noch keine Profile gespeichert.',

    themeLabel: 'Design',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    themeDarkDesc: 'Dunkles Design aktiv',
    themeLightDesc: 'Helles Design aktiv',

    bypassTestBtn: 'Bypass-Test',
    bypassTestTesting: 'Bypass-Test wird ausgeführt...',
    bypassTestSuccess: 'Bypass aktiv! Verbindung erfolgreich.',
    bypassTestSuccessShort: 'Aktiv',
    bypassTestFailed: 'Bypass funktioniert nicht. Verbindung fehlgeschlagen.',
    bypassTestFailedShort: 'Fehlgeschlagen',
    bypassTestTimeout: 'Bypass-Test Zeitüberschreitung.',

    autoEscalateLabel: 'Automatische Modus-Eskalation',
    autoEscalateDesc: 'Zu stärkerem Modus wechseln, wenn die Verbindung fehlschlägt',
    logAutoEscalate: (mode) => `Verbindung fehlgeschlagen, Wechsel zu ${mode}-Modus...`,
    logTrayModeChanged: (mode) => `Modus über Tray geändert: ${mode}`,

    statsTitle: 'Verbindungsstatistiken',
    statsTotalSessions: 'Gesamte Sitzungen',
    statsTotalUptime: 'Gesamte Laufzeit',
    statsMostUsedMode: 'Meistgenutzter Modus',
    statsAvgPing: 'Durchschnittlicher Ping',
    statsReset: 'Statistiken zurücksetzen',
    statsEmpty: 'Noch keine aufgezeichneten Sitzungen',

    welcomeTitle: 'Willkommen bei DocsPI',
    welcomeDesc: 'Sie sind dabei, Ihren ersten Schritt in ein freies und sicheres Internet zu machen. Wir haben ein paar kurze Schritte, um die besten Einstellungen für Sie vorzunehmen.',
    welcomeNext: 'Lass uns anfangen',
    welcomePrivacy: 'Ihre Privatsphäre ist uns wichtig. Ihre Daten werden niemals aufgezeichnet.',
    fakeSniLabel: 'Fake SNI',
    btnYes: 'Ja',
    logFilterError: 'Fehler',
    logDirtyShutdownRecovery: 'Vorheriges Herunterfahren war unerwartet. Wiederherstellung...',
    logFilterSuccess: 'Erfolg',
    logFilterInfo: 'Info',
    btnNo: 'Nein',
    logFilterWarn: 'Warnungen',
    logFilterAll: 'Alle',
  },

  it: {
    appName: 'DOCSPI',
    statusActive: 'ATTIVO',
    statusInactive: 'DISATTIVATO',
    statusReady: 'PRONTO',

    statusConnected: 'SICURO',
    statusConnecting: 'CONNESSIONE...',
    statusDisconnecting: 'DISCONNESSIONE...',
    statusReady2: 'PRONTO',
    descConnected: 'La tua connessione è crittografata e protetta.',
    descConnecting: 'In corso, attendere prego.',
    descReady: 'Connettiti per il bypass DPI.',

    btnConnect: 'CONNETTI',
    btnDisconnect: 'DISCONNETTI',
    btnConnecting: 'CONNESSIONE...',
    btnApplyingSettings: 'APPLICAZIONE IMPOSTAZIONI...',
    btnDisconnecting: 'DISCONNESSIONE...',
    btnConnectDevices: 'Connetti altri dispositivi',

    navSettings: 'IMPOSTAZIONI',
    navLogs: 'LOG',
    navExit: 'ESCI',

    logsTitle: 'LOG DI SISTEMA',
    logsClear: 'PULISCI',
    logsCopy: 'COPIA',
    logsCopied: 'COPIATO!',
    logsCopyError: 'ERRORE!',

    modalTitle: 'Connetti dispositivo',
    modalSubtitle: 'Condivisione LAN',
    modalDesc: 'Vai alle impostazioni Wi-Fi del tuo dispositivo, imposta il <strong>Proxy</strong> su <strong>Manuale</strong> e inserisci i dettagli di seguito.',
    modalDescPac: 'Si consiglia l\'uso di <strong>Automatico (PAC)</strong> sugli altri dispositivi.',
    modalPacQrHint: 'Scansiona il QR, copia l\'indirizzo e incollalo nelle impostazioni <strong>Wi-Fi → Proxy → URL automatico</strong> del tuo dispositivo.<br><br><span class="text-red-500 font-semibold">IMPORTANTE:</span> Se riscontri problemi di rete dopo la disconnessione, spegni e riaccendi il Wi-Fi del tuo dispositivo.',
    modalPacUrl: 'Indirizzo PAC (Consigliato)',
    modalManualFallback: 'Alternativa: Proxy manuale',
    modalTabPac: 'Automatico (PAC)',
    modalTabManual: 'Manuale',
    modalPacStep1Title: '1. Apri la guida all\'installazione',
    modalPacStep1Desc: 'Scansiona il codice QR con la tua fotocamera per aprire la guida passo-passo.',
    modalPacStep2Title: '2. Copia l\'indirizzo PAC',
    modalPacStep2Desc: 'Incolla questo codice nel campo "URL automatico" mostrato nella guida:',
    modalPacWarningTitle: 'ATTENZIONE:',
    modalPacWarningDesc: 'Se app come YouTube perdono l\'accesso a Internet dopo la chiusura di DocsPI (a causa delle connessioni memorizzate nella cache), riavvia semplicemente il Wi-Fi del tuo dispositivo.',
    modalManualWarningTitle: 'ATTENZIONE:',
    modalManualWarningDesc: 'Quando DocsPI è chiuso, il tuo dispositivo perderà completamente l\'accesso a Internet. Per ripristinare la connessione, devi rimuovere l\'impostazione Proxy dalle impostazioni Wi-Fi.',
    modalPacQrCaption: 'QR → Pagina di installazione (scansiona e copia)',
    modalHost: 'Host (Server)',
    modalPort: 'Porta',
    modalTutorial: 'Come fare? (Guida)',

    adminTitle: 'Richiesta autorizzazione amministratore',
    adminDesc: 'DocsPI deve essere eseguito come amministratore per funzionare correttamente.',
    adminStep: 'Tasto destro sull\'app → Seleziona <strong>"Esegui come amministratore"</strong>',
    adminClose: 'CHIUDI',
    adminHowItWorks: 'Come funziona?',

    noInternetTitle: 'Nessuna connessione Internet',
    noInternetDesc: 'Controlla la tua connessione Internet.',
    noInternetRetry: 'Riprova',

    logEngineStarting: (port) => `Avvio motore DocsPI (Porta: ${port})...`,
    logDnsUsed: (name, ip) => `DNS utilizzato: ${name} (${ip})`,
    logDnsDefault: 'DNS: Predefinito di sistema',
    logConnected: 'Connessione riuscita! Il traffico è crittografato.',
    logDisconnected: 'Disconnesso.',
    logProxySet: (port) => `Proxy di sistema impostato: 127.0.0.1:${port}`,
    logProxyCleared: 'Proxy di sistema rimosso',
    logEngineStopped: (code) => `Il motore DocsPI si è arrestato inaspettatamente (Codice: ${code})`,
    logEngineStartError: (err) => `Impossibile avviare il motore: ${err}`,
    logAutoReconnect: 'Riconnessione automatica attiva...',
    logReconnecting: (n) => `Riconnessione in corso... (Tentativo ${n}/5)`,
    logReconnectWait: (sec, n) => `Nuovo tentativo tra ${sec} secondi... (Tentativo ${n}/5)`,
    logReconnectNow: 'Riconnessione ora...',
    logMaxRetries: 'Connessione fallita. Raggiunto il numero massimo di tentativi.',
    logPossibleReasons: 'Possibili cause:',
    logReasonInternet: 'La tua connessione Internet potrebbe essere interrotta',
    logReasonFirewall: 'Il firewall o l\'antivirus potrebbero bloccare DocsPI',
    logReasonPorts: 'Le porte 8080-8084 potrebbero essere occupate',
    logSolutions: 'Soluzioni consigliate:',
    logSolInternet: 'Controlla la tua connessione Internet',
    logSolFirewall: 'Controlla le impostazioni del firewall',
    logSolAdmin: 'Esegui l\'applicazione come amministratore',
    logSolLogs: 'Copia e condividi i log per assistenza',
    logLanRestart: 'Condivisione LAN modificata, riavvio della connessione...',
    logDpiRestart: 'Modalità DPI modificata, riavvio della connessione...',
    logEngineStoppedGrace: 'Motore DocsPI arrestato.',
    logServiceStopped: 'Servizio interrotto.',
    logShutdownStarting: 'Avvio chiusura...',
    logProcessStopped: 'Processo terminato.',
    logSpoofReady: (port) => `Motore SpoofDPI avviato (Porta: ${port})`,
    logPacStarted: 'Server PAC avviato (per dispositivi LAN)',
    logPacStartError: (err) => `Impossibile avviare il server PAC: ${err}`,
    logEngineActive: 'Motore DocsPI attivo',
    logPortBusy: (port) => `Porta ${port} occupata, provo un'altra...`,
    logInitializing: 'Inizializzazione motore...',
    logPortRetryOpen: (port) => `Impossibile aprire la porta ${port}, riprovo...`,
    logProxyClearError: (err) => `Errore durante la rimozione del proxy: ${err}`,
    logProxySetError: (err) => `Errore durante l'impostazione del proxy: ${err}`,
    logServiceStopError: (err) => `Errore durante l'arresto del servizio: ${err}`,
    logConfigError: (err) => `Errore di configurazione: ${err}`,
    logAdminMissing: 'Autorizzazione amministratore mancante! L\'app potrebbe non funzionare correttamente.',
    logInternetBack: 'Connessione Internet ripristinata.',
    logInternetLost: 'Connessione Internet persa!',
    logPortRetry: (count) => `Conflitto di porta, provo una nuova porta... (${count}/20)`,
    logNoPort: 'Nessuna porta disponibile trovata.',
    logWinHttpEnabled: 'Tunnel proxy Modalità Gioco (WinHTTP) applicato.',
    logWpcapMissing: 'SpoofDPI non ha trovato wpcap.dll. Installa Npcap o WinPcap, quindi riavvia l\'applicazione.',
    logAntivirusWarning: 'Windows Defender o il tuo software antivirus potrebbero aver bloccato \'docspi-proxy.exe\'. Aggiungi il file alla lista delle esclusioni.',
    logFailsafePortClosed: 'Timeout della porta, riprovo la connessione...',

    settingsTitle: 'IMPOSTAZIONI',

    sectionMethod: 'METODO DI CONNESSIONE',
    sectionMethodWhy: 'Un\'unica impostazione per tutti gli ISP. Utilizzabile su tutti i dispositivi via LAN. Basato su proxy, quindi nessun ping/jitter nei giochi.',
    methodStrong: 'Modalità Forte',
    methodStrongDesc: 'Il bypass più potente per ISP difficili (aggiunge latenza)',
    methodTurbo: 'Modalità Turbo',
    methodTurboDesc: 'Latenza minima, per DPI leggero',
    methodBalanced: 'Modalità Bilanciata (Consigliata)',
    methodBalancedDesc: 'Bypass rapido + potente, funziona con la maggior parte degli ISP',

    sectionAdvanced: 'AVANZATE',
    chunkSizeLabel: 'Dimensione frammento (chunk size)',
    chunkSizeDesc: 'Controlla in quanti pezzi viene diviso il traffico HTTPS. A seconda del tuo ISP, 4 o 16 potrebbero essere più veloci; 8 è solitamente bilanciato (predefinito).',
    chunkSize4: '4 — Più forte (alcuni ISP)',
    chunkSize8: '8 — Bilanciato (predefinito)',
    chunkSize16: '16 — Più veloce (alcuni ISP)',

    sectionNetwork: 'IMPOSTAZIONI DI RETE',
    lanSharing: 'Condivisione LAN',
    lanSharingDesc: 'Consenti connessioni da altri dispositivi (Smartphone, Console)',

    sectionAutomation: 'AUTOMAZIONE',
    autoConnect: 'Connessione automatica',
    autoConnectDesc: 'Connetti non appena l\'app viene aperta',
    autoReconnect: 'Riconnessione automatica',
    autoReconnectDesc: 'Riprova automaticamente se la connessione cade',

    sectionGeneral: 'GENERALE',
    autoStart: 'Avvio automatico',
    autoStartDesc: 'Avvia DocsPI all\'avvio di Windows',
    minimizeToTray: 'Riduci nella barra delle applicazioni',
    minimizeToTrayDesc: 'Esegui in background quando chiuso',
    alwaysOnTop: 'Sempre in primo piano',
    alwaysOnTopDesc: 'La finestra rimane sempre sopra le altre finestre',
    requireConfirmation: 'Conferma azione',
    requireConfirmationDesc: 'Chiedi prima di disconnettere o uscire',
    language: 'LINGUA',
    languageDesc: 'Cambia la lingua dell\'interfaccia',

    sectionNotifications: 'NOTIFICHE',
    notifications: 'Notifiche desktop',
    notificationsDesc: 'Interruttore principale notifiche (Attiva/Disattiva tutto)',
    notifyOnConnect: 'Alla connessione',
    notifyOnConnectDesc: 'Notifica quando la connessione viene stabilita con successo',
    notifyOnDisconnect: 'Alla disconnessione',
    notifyOnDisconnectDesc: 'Notifica in caso di cadute impreviste o riparazioni',
    notifDisconnectManual: 'Connessione terminata con successo.',

    sectionDns: 'LISTA DNS',
    dnsAutoSelect: 'Selezione automatica (Consigliata)',
    dnsAutoSelectDesc: 'Trova automaticamente il server più veloce',
    dnsSystemDefault: 'Predefinito di sistema',
    dnsSystemDefaultDesc: 'DNS predefinito di SpoofDPI',
    dnsCfDesc: 'Veloce e privato',
    dnsAdguardDesc: 'Blocco annunci',
    dnsGoogleDesc: 'Affidabile',
    dnsQuad9Desc: 'Orientato alla sicurezza',
    dnsOpenDnsDesc: 'Offerto da Cisco',
    dnsCheckSpeed: 'Test ping DNS',
    dnsChecking: 'Misurazione...',

    driverStatusInstalled: 'Filtraggio avanzato attivo',
    driverStatusMissing: 'Sblocca funzioni avanzate se il bypass fallisce',
    driverInstallBtn: 'INSTALLA DRIVER (CONSIGLIATO)',
    driverIspWarning: 'In caso di problemi di connessione, puoi sbloccare funzioni di bypass DPI molto più avanzate installando il driver.',

    // ISS Overlay (First Run)
    issOverlayTitle: 'Seleziona il tuo fornitore Internet',
    issOverlayDesc: 'Applicheremo automaticamente le migliori impostazioni per il tuo ISP.',
    issOverlayApply: 'APPLICA E CONNETTI',
    issOverlaySkip: 'Salta',
    issProfileActive: 'Profilo attivo',
    issProfileSee: 'Vedi impostazioni consigliate',
    issApplyBtn: 'Applica impostazioni automaticamente',
    issAppliedMsg: 'Questa impostazione è attualmente in uso',

    // ISS Guide (Settings)
    issGuideTitle: 'GUIDA ISP',
    issLightName: 'TurkNet',
    issLightDesc: 'Filtraggio leggero. La modalità Turbo garantisce che non ci siano aumenti di ping o perdite di velocità.',
    issMidName: 'Solo alcuni ISP',
    issMidDesc: 'Blocco standard. La modalità Forte divide i pacchetti per un accesso affidabile.',
    issHeavyName: 'Fornitori turchi (TT / Vodafone / Superonline)',
    issHeavyDesc: 'Vengono utilizzati dispositivi DPI potenti e intelligenti. Potrebbe essere necessaria la modalità Forte.',
    issChinaName: 'Cina (Great Firewall)',
    issChinaDesc: 'Superare il sistema DPI più avanzato al mondo potrebbe richiedere la modalità Forte e impostazioni SNI personalizzate.',
    issRussiaName: 'Russia (Roskomnadzor)',
    issRussiaDesc: 'La modalità Forte è consigliata per i blocchi complessi.',
    issIndiaName: 'India',
    issIndiaDesc: 'La modalità Bilanciata è sufficiente per i blocchi standard.',
    issUsaName: 'USA / Global',
    issUsaDesc: 'La modalità Turbo è consigliata per restrizioni leggere.',
    issGlobalName: 'Globale / Altro',
    issGlobalDesc: 'Impostazioni di bypass generali per tutti i paesi.',
    issOtherName: 'Altro / Sconosciuto',
    issOtherDesc: 'Inizia con la modalità Forte. Funziona in modo affidabile con la maggior parte dei fornitori.',

    // Bypass Settings
    sectionBypass: 'IMPOSTAZIONI DETTAGLIATE BYPASS',
    modeTurboName: 'Modalità Turbo',
    modeTurboDesc: 'Latenza minima. Supera istantaneamente i filtri leggeri.',
    modeBalancedName: 'Modalità Bilanciata',
    modeBalancedDesc: 'Rapida e stabile. Supera i filtri standard.',
    modeStrongName: 'Modalità Forte',
    modeStrongDesc: 'Supera DPI difficili con pacchetti falsi.',

    // Extra Network
    sectionExtraNetwork: 'IMPOSTAZIONI DI RETE AGGIUNTIVE',
    ipv4ForceTitle: 'Forza IPv4 (Consigliato)',
    ipv4ForceDesc: 'Previene caricamenti infiniti ed errori di timeout.',
    networkModeLabel: 'Modalità di rete',
    modeSmooth: 'Modalità Fluida',
    modeSmoothDesc: 'Latenza minima. Ideale per browser e Discord.',
    modeGame: 'Modalità Gioco',
    modeGameDesc: 'Roblox, giochi UDP e tutte le app. Bypass a livello kernel.',
    modeSuper: 'Modalità Super',
    modeSuperDesc: 'Ibrida: Fluida + Gioco combinate. Miglior bilanciamento.',
    modeRequiresNpcap: 'Richiesto driver Npcap',
    modeBadgeSmooth: 'Fluida',
    modeBadgeGame: 'Gioco',
    modeBadgeSuper: 'Super',

    // Advanced (Npcap)
    sectionAdvancedNpcap: 'IMPOSTAZIONI AVANZATE',
    advancedNpcapDesc: 'Gli ISP con pesanti misure DPI (Kablonet, Superonline ecc.) richiedono una manipolazione avanzata dei pacchetti.',
    advancedNpcapInstalled: 'Npcap installato — Funzioni avanzate attive',
    advancedNpcapMissing: 'Npcap non installato — Modalità forte limitata',
    advancedNpcapInstallBtn: 'INSTALLA DRIVER NPCAP',
    advancedNpcapWhy: 'Npcap fornisce l\'accesso a basso livello ai pacchetti di rete. Ciò consente tecniche avanzate di bypass DPI come l\'iniezione di pacchetti falsi.',
    advancedFeaturesToggle: 'Bypass avanzato',
    advancedFeaturesToggleDesc: 'Abilita l\'iniezione di pacchetti falsi e tecniche avanzate di bypass DPI.',
    npcapRestartWarning: 'È necessario riavviare il computer affinché Npcap funzioni.',
    logStrongFake: 'Modalità Forte: Pacchetto Falso (3) attivo.',
    logStrongNoDriver: 'Modalità Forte: Nessun driver, solo Chunk-1 attivo.',
    logStrongChunkOnly: 'Modalità Forte: Chunk-1 attivo.',
    logNpcapFallback: 'Il driver Npcap non risponde. Disattivazione del bypass avanzato e nuovo tentativo...',
    advancedNpcapHint: 'Installa il driver Npcap per un bypass più forte',

    sectionTroubleshoot: 'RISOLUZIONE DEI PROBLEMI',
    fixInternet: 'Ripara connessione Internet',
    fixInternetDesc: 'Ripara Internet se il proxy si blocca.',
    fixRepairing: 'Riparazione...',
    fixRepairingDesc: 'Ripristino delle impostazioni di sistema, attendere prego.',
    fixDone: 'Riparato!',
    fixDoneDesc: 'Impostazioni proxy rimosse, Internet ripristinato.',
    fixError: 'Si è verificato un errore!',
    fixErrorDesc: 'Qualcosa è andato storto durante il processo.',

    sectionDev: 'SVILUPPATORE',
    devRole: 'Sviluppatore DocsPI',
    devSubscribe: 'Discord',
    devSupport: 'Github',

    sectionNotice: 'IMPORTANTE',
    noticeTitle: 'Sicurezza e falsi positivi',
    noticeDesc: 'Il motore DocsPI può talvolta essere segnalato come "falso positivo" dai sistemi basati sull\'IA. Questo è del tutto innocuo.',

    // Dialogs
    confirmExitTitle: 'Esci',
    confirmExitDesc: 'Sei sicuro di voler fermare il motore DocsPI e uscire?',
    confirmDisconnectTitle: 'Disconnetti',
    confirmDisconnectDesc: 'Sei sicuro di voler terminare la tua connessione sicura?',

    // Settings Tabs
    tabGeneral: 'GENERALE',
    tabNetwork: 'RETE',
    tabNotification: 'AVVISI',
    tabSystem: 'SISTEMA',

    // ISP Detection
    ispDetected: (name) => `${name} rilevato`,
    ispSuggestion: (profile) => `Consigliata modalità ${profile}`,
    ispAutoSelected: 'Il tuo ISP è stato selezionato automaticamente',

    // Connection Statistics
    statsUptime: 'Uptime',
    statsPing: 'Ping',
    statsMs: 'ms',

    // Update
    updateAvailable: (ver) => `Nuova versione disponibile: v${ver}`,
    updateDownload: 'Scarica',
    updateDismiss: 'Più tardi',

    // Custom Domain List
    sectionDomains: 'LISTA DOMINI PERSONALIZZATA',
    sectionDomainsDesc: 'Questi domini evitano il proxy (connessione DIRETTA).',
    domainAdd: 'Aggiungi',
    domainRemove: 'Rimuovi',
    domainPlaceholder: 'es: *.example.com o sito.com',
    domainEmpty: 'Nessun dominio ancora aggiunto.',

    // Profile Saving
    sectionProfiles: 'PROFILI IMPOSTAZIONI',
    sectionProfilesDesc: 'Salva le tue impostazioni attuali e caricale con un clic.',
    profileSave: 'Salva impostazioni attuali',
    profileSaveShort: 'Salva',
    profileLoad: 'Carica',
    profileDelete: 'Elimina',
    profileName: 'Inserisci nome profilo...',
    profileSaved: 'Profilo salvato!',
    profileLoaded: 'Profilo caricato!',
    profileEmpty: 'Nessun profilo ancora salvato.',

    themeLabel: 'Tema',
    themeDark: 'Scuro',
    themeLight: 'Chiaro',
    themeDarkDesc: 'Tema scuro attivo',
    themeLightDesc: 'Tema chiaro attivo',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Esecuzione test di bypass...',
    bypassTestSuccess: 'Bypass attivo! Connessione riuscita.',
    bypassTestSuccessShort: 'Attivo',
    bypassTestFailed: 'Il bypass non funziona. Connessione fallita.',
    bypassTestFailedShort: 'Fallito',
    bypassTestTimeout: 'Il test di bypass è andato in timeout.',

    autoEscalateLabel: 'Escalation automatica modalità',
    autoEscalateDesc: 'Passa a una modalità più forte se la connessione fallisce',
    logAutoEscalate: (mode) => `Connessione fallita, passaggio alla modalità ${mode}...`,
    logTrayModeChanged: (mode) => `Modalità modificata dalla barra di sistema: ${mode}`,

    statsTitle: 'Statistiche di connessione',
    statsTotalSessions: 'Sessioni totali',
    statsTotalUptime: 'Tempo totale',
    statsMostUsedMode: 'Modalità più usata',
    statsAvgPing: 'Ping medio',
    statsReset: 'Azzera statistiche',
    statsEmpty: 'Nessuna sessione ancora registrata',

    welcomeTitle: 'Benvenuto su DocsPI',
    welcomeDesc: 'Stai per fare il tuo primo passo verso un Internet libero e sicuro. Abbiamo alcuni brevi passaggi per impostare le migliori impostazioni per te.',
    welcomeNext: 'Iniziamo',
    welcomePrivacy: 'La tua privacy è importante per noi. I tuoi dati non vengono mai registrati.',
    fakeSniLabel: 'Fake SNI',
    btnYes: 'S�',
    logFilterError: 'Errori',
    logDirtyShutdownRecovery: "L'arresto precedente � stato imprevisto. Ripristino...",
    logFilterSuccess: 'Successo',
    logFilterInfo: 'Info',
    btnNo: 'No',
    logFilterWarn: 'Avvisi',
    logFilterAll: 'Tutto',
  },

  ko: {
    appName: 'DOCSPI',
    statusActive: '??',
    statusInactive: '???',
    statusReady: '???',
    statusConnected: '???',
    statusConnecting: '?? ?...',
    statusDisconnecting: '?? ?? ?...',
    statusReady2: '???',
    descConnected: '??? ????? ???? ????.',
    descConnecting: '?? ????. ??? ??????.',
    descReady: 'DPI Bypass? ?? ?????.',

    btnConnect: '??',
    btnDisconnect: '?? ??',
    btnConnecting: '?? ?...',
    btnApplyingSettings: '?? ?? ?...',
    btnDisconnecting: '?? ?? ?...',
    btnConnectDevices: '?? ?? ??',

    navSettings: '??',
    navLogs: '??',
    navExit: '??',

    logsTitle: '??? ??',
    logsClear: '???',
    logsCopy: '??',
    logsCopied: '???!',
    logsCopyError: '??!',
    logFilterAll: '??',
    logFilterError: '??',
    logFilterWarn: '??',
    logFilterSuccess: '??',
    logFilterInfo: '??',

    modalTitle: '?? ??',
    modalSubtitle: 'LAN ??',
    modalDesc: '??? Wi-Fi ???? ???? <strong>???</strong>? <strong>??</strong>?? ???? ?? ?? ??? ?????.',
    modalDescPac: '?? ????? <strong>?? (PAC)</strong> ??? ?????.',
    modalPacQrHint: 'QR ??? ???? ??? ??? ? ??? <strong>Wi-Fi � ??? � ?? URL</strong> ??? ??????.',
    modalPacUrl: 'PAC URL (??)',
    modalManualFallback: '??: ?? ???',
    modalTabPac: '?? (PAC)',
    modalTabManual: '??',
    modalHost: '?? (???)',
    modalPort: '??',
    modalTutorial: '?? ??? (???)',

    adminTitle: '??? ?? ??',
    adminDesc: 'DocsPI? ???? ???? ?? ??? ???? ???? ???.',
    adminStep: '?? ??? ??? ???? ?? � <strong>"??? ???? ??"</strong> ??',
    adminClose: '??',
    adminHowItWorks: '?? ???',

    noInternetTitle: '??? ?? ??',
    noInternetDesc: '??? ??? ??? ???.',
    noInternetRetry: '???',

    logEngineStarting: (port) => `DocsPI ?? ?? (??: ${port})...`,
    logDnsUsed: (name, ip) => `DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: ??? ???',
    logConnected: '?? ??! ???? ??????.',
    logDisconnected: '?? ???.',
    logProxySet: (port) => `??? ??? ??: 127.0.0.1:${port}`,
    logProxyCleared: '??? ??? ???',
    logEngineStopped: (code) => `DocsPI ??? ??? ?? ??? (??: ${code})`,
    logEngineStartError: (err) => `?? ?? ??: ${err}`,
    logAutoReconnect: '?? ??? ???...',
    logReconnecting: (n) => `??? ?... (?? ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec}? ? ???... (?? ${n}/5)`,
    logReconnectNow: '??? ?...',
    logMaxRetries: '?? ??. ?? ?? ??? ??????.',
    logPossibleReasons: '??? ??:',
    logReasonInternet: '???? ???? ??? ? ????',
    logReasonFirewall: '???/??? DocsPI? ???? ?? ? ????',
    logReasonPorts: '?? 8080-8084? ?? ?? ? ????',
    logSolutions: '?? ??:',
    logSolInternet: '??? ??? ?????',
    logSolFirewall: '??? ??? ?????',
    logSolAdmin: '?? ??? ???? ?????',
    logSolLogs: '??? ???? ???? ?????',
    logLanRestart: 'LAN ??? ???????. ??? ??????...',
    logDpiRestart: 'DPI ??? ???????. ??? ??????...',
    logEngineStoppedGrace: 'DocsPI ??? ???????.',
    logServiceStopped: '???? ???????.',
    logShutdownStarting: '?? ??...',
    logProcessStopped: '????? ???????.',
    logSpoofReady: (port) => `SpoofDPI ?? ?? (??: ${port})`,
    logPacStarted: 'PAC ?? ??? (LAN ???)',
    logPacStartError: (err) => `PAC ?? ?? ??: ${err}`,
    logEngineActive: 'DocsPI ?? ??',
    logPortBusy: (port) => `?? ${port}? ?? ????. ?? ??? ?????...`,
    logInitializing: '?? ??? ?...',
    logPortRetryOpen: (port) => `?? ${port}? ? ? ????. ??????...`,
    logProxyClearError: (err) => `??? ?? ??: ${err}`,
    logFailsafePortClosed: '??? ?? ??: ???? ??? ? ????',
    logAntivirusWarning: 'Windows Defender ?? ?? ?????? docspi-proxy.exe? ???? ? ????. ??? ?? ?? ??? ??? ???.',
    logWpcapMissing: 'wpcap.dll? ?? ? ????. Npcap ????? ??? ???.',
    logStrongFake: '?? ??: ?? ?? (3) ????.',
    logStrongNoDriver: '?? ??: ???? ??, Chunk-1? ????.',
    logStrongChunkOnly: '?? ??: Chunk-1 ????.',
    logNpcapFallback: 'Npcap ????? ???? ????. ?? bypass? ?????? ?? ?????...',
    logDnsPrimaryFail: (dns) => `${dns} ?? ??, ?? DNS ?? ?...`,
    logDnsFallback: (dns, ms) => `?? DNS: ${dns} (${ms}ms)`,
    logDnsAllFail: '?? ?? DNS ??? ???? ????. ??? DNS? ?????.',
    logDirtyShutdownRecovery: '?? ??? ??? ?????. ?? ?...',
    logTrayModeChanged: (mode) => `??? ????? ?? ???: ${mode}`,

    settingsTitle: '??',
    settingsDesc: 'Customize your DocsPI settings',

    sectionGeneral: 'General',
    sectionDpi: 'DPI BYPASS',
    sectionDpiDesc: 'Select DPI bypass mode and chunk size',
    sectionDns: 'DNS',
    sectionDnsDesc: 'DNS server selection',
    sectionAdvanced: 'ADVANCED',
    sectionAdvancedDesc: 'Advanced bypass options',
    sectionNetwork: 'Network',
    sectionNetworkDesc: 'Network mode and sharing settings',
    sectionNotification: 'NOTIFICATIONS',
    sectionNotificationDesc: 'Notification preferences',
    sectionSystem: 'SYSTEM',
    sectionSystemDesc: 'System settings',
    sectionAbout: 'ABOUT',
    sectionAboutDesc: 'Application information',

    sectionNotice: 'IMPORTANT',
    noticeTitle: 'Security & False Positives',
    noticeDesc: 'The DocsPI engine may sometimes be flagged as a "false positive" by AI-based systems. This is completely harmless.',

    confirmExitTitle: 'Exit',
    confirmExitDesc: 'Are you sure you want to stop the DocsPI engine and exit?',
    confirmDisconnectTitle: 'Disconnect',
    confirmDisconnectDesc: 'Are you sure you want to terminate your secure connection?',

    tabGeneral: 'GENERAL',
    tabNetwork: 'Network',
    tabNotification: 'NOTIFICATIONS',
    tabSystem: 'SYSTEM',

    ispDetected: (name) => `${name} detected`,
    ispSuggestion: (profile) => `${profile} mode recommended`,
    ispAutoSelected: 'Your ISP was auto-selected',

    statsUptime: 'Uptime',
    statsPing: 'Ping',
    statsMs: 'ms',

    updateAvailable: (ver) => `New version available: v${ver}`,
    updateDownload: 'Download',
    updateDismiss: 'Later',

    sectionDomains: 'CUSTOM DOMAIN LIST',
    sectionDomainsDesc: 'These domains bypass the proxy (DIRECT connection).',
    domainAdd: 'Add',
    domainRemove: 'Remove',
    domainPlaceholder: 'e.g. *.example.com or site.com',
    domainEmpty: 'No domains added yet.',

    sectionProfiles: 'SETTINGS PROFILES',
    sectionProfilesDesc: 'Save your current settings and load them in one click.',
    profileSave: 'Save Current Settings',
    profileSaveShort: 'Save',
    profileLoad: 'Load',
    profileDelete: 'Delete',
    profileName: 'Enter profile name...',
    profileSaved: 'Profile saved!',
    profileLoaded: 'Profile loaded!',
    profileEmpty: 'No profiles saved yet.',

    themeLabel: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeDarkDesc: 'Dark theme active',
    themeLightDesc: 'Light theme active',

    bypassTestBtn: 'Bypass Test',
    bypassTestTesting: 'Running bypass test...',
    bypassTestSuccess: 'Bypass active! Connection successful.',
    bypassTestSuccessShort: 'Active',
    bypassTestFailed: 'Bypass not working. Connection failed.',
    bypassTestFailedShort: 'Failed',
    bypassTestTimeout: 'Bypass test timed out.',

    autoEscalateLabel: 'Auto Mode Escalation',
    autoEscalateDesc: 'Switch to stronger mode if connection fails',
    logAutoEscalate: (mode) => `Connection failed, switching to ${mode} mode...`,

    statsTitle: 'Connection Statistics',
    statsTotalSessions: 'Total Sessions',
    statsTotalUptime: 'Total Uptime',
    statsMostUsedMode: 'Most Used Mode',
    statsAvgPing: 'Average Ping',
    statsReset: 'Reset Statistics',
    statsEmpty: 'No recorded sessions yet',

    welcomeTitle: 'Welcome to DocsPI',
    welcomeDesc: 'You are about to take your first step towards a free and secure internet.',
    welcomeNext: "Let's Get Started",
    welcomePrivacy: 'Your privacy is important to us. Your data is never recorded.',

    fakeSniLabel: 'Fake SNI',
    btnNo: 'No',
    btnYes: 'Yes',

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

















