mod platform;
mod mobile;

use local_ip_address::list_afinet_netifas;

use std::io::{Read, Write};

use std::net::{IpAddr, TcpListener, TcpStream};

use std::sync::atomic::{AtomicBool, Ordering};

use std::sync::Arc;

use std::sync::Mutex;

use std::sync::OnceLock;

use std::thread;

use std::time::Duration;

use tauri::Emitter;

use tauri::Manager;

#[cfg(target_os = "windows")]
fn guard_exe_path() -> Option<std::path::PathBuf> {

    let exe = std::env::current_exe().ok()?;

    let dir = exe.parent()?;

    let candidates = [

        dir.join("binaries").join("docspi-guard.exe"),

        dir.join("docspi-guard.exe"),

    ];

    candidates.into_iter().find(|p| p.exists())

}

#[cfg(not(target_os = "windows"))]
fn guard_exe_path() -> Option<std::path::PathBuf> {

    None

}

fn guard_process() -> &'static Mutex<Option<std::process::Child>> {

    static PROC: OnceLock<Mutex<Option<std::process::Child>>> = OnceLock::new();

    PROC.get_or_init(|| Mutex::new(None))

}

#[cfg(target_os = "windows")]
fn launch_guard() {

    use std::os::windows::process::CommandExt;

    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let exe = match guard_exe_path() {

        Some(p) => p,

        None => return,

    };

    let dir = match exe.parent() {

        Some(d) => d.to_path_buf(),

        None => return,

    };

    let mut g = match guard_process().lock() {

        Ok(g) => g,

        Err(e) => e.into_inner(),

    };

    if g.is_some() {

        return;

    }

    if let Ok(child) = std::process::Command::new(&exe)

        .args([

            "-p", "-r", "-s", "-q",

            "-e", "2",

            "--dns-addr", "77.88.8.8",

            "--dns-port", "1253",

        ])

        .current_dir(&dir)

        .creation_flags(CREATE_NO_WINDOW)

        .stdout(std::process::Stdio::null())

        .stderr(std::process::Stdio::null())

        .spawn()

    {

        *g = Some(child);

    }

}

#[cfg(not(target_os = "windows"))]
fn launch_guard() {}

#[cfg(target_os = "windows")]
fn stop_guard() {

    let mut g = match guard_process().lock() {

        Ok(g) => g,

        Err(e) => e.into_inner(),

    };

    if let Some(ref mut child) = *g {

        let _ = child.kill();

    }

    *g = None;

}

#[cfg(not(target_os = "windows"))]
fn stop_guard() {}

fn divert_process() -> &'static Mutex<Option<std::process::Child>> {

    static PROC: OnceLock<Mutex<Option<std::process::Child>>> = OnceLock::new();

    PROC.get_or_init(|| Mutex::new(None))

}

#[cfg(target_os = "windows")]
fn divert_exe_path() -> Option<std::path::PathBuf> {

    let exe = std::env::current_exe().ok()?;

    let dir = exe.parent()?;

    let candidates = [

        dir.join("docspi-divert-x86_64-pc-windows-msvc.exe"),

        dir.join("docspi-divert.exe"),

        dir.join("binaries").join("docspi-divert.exe"),

    ];

    candidates.into_iter().find(|p| p.exists())

}

#[cfg(not(target_os = "windows"))]
fn divert_exe_path() -> Option<std::path::PathBuf> {

    platform::get().divert.find_engine("docspi-divert")

}

#[derive(serde::Deserialize)]
struct DivertConfig {

    mode: String,

    auto_ttl: bool,

    block_quic: bool,

    wrong_chksum: bool,

    wrong_seq: bool,

    dns_redirect: bool,

    dns_addr: String,

    proxy_port: u16,

    fake_sni: String,

}

fn launch_divert_process(config: &DivertConfig) -> Result<(), String> {

    #[cfg(target_os = "windows")]
    {

        use std::os::windows::process::CommandExt;

        const CREATE_NO_WINDOW: u32 = 0x08000000;

        let exe = match divert_exe_path() {

            Some(p) => p,

            None => return Err("docspi-divert.exe bulunamadı. Oyun Modu için bu dosya gereklidir.".to_string()),

        };

        let mut args: Vec<String> = vec![];

        args.push("--mode".to_string());

        args.push(config.mode.clone());

        if config.auto_ttl {

            args.push("--auto-ttl".to_string());

        }

        if config.block_quic {

            args.push("--block-quic".to_string());

        }

        if config.wrong_chksum {

            args.push("--wrong-chksum".to_string());

        }

        if config.wrong_seq {

            args.push("--wrong-seq".to_string());

        }

        if config.dns_redirect && !config.dns_addr.is_empty() {

            args.push("--dns-redirect".to_string());

            args.push("--dns-addr".to_string());

            args.push(config.dns_addr.clone());

        }

        if config.proxy_port > 0 {

            args.push("--proxy-port".to_string());

            args.push(config.proxy_port.to_string());

        }

        if !config.fake_sni.is_empty() {

            args.push("--fake-sni".to_string());

            args.push(config.fake_sni.clone());

        }

        let pid_file = std::env::temp_dir().join("docspi_divert.pid");

        args.push("--pid-file".to_string());

        args.push(pid_file.to_string_lossy().to_string());

        let dir = exe.parent()

            .ok_or_else(|| "Divert exe dizini alınamadı".to_string())?

            .to_path_buf();

        let mut guard = match divert_process().lock() {

            Ok(g) => g,

            Err(e) => e.into_inner(),

        };

        if guard.is_some() {

            return Ok(());

        }

        let log_file = std::env::temp_dir().join("docspi_divert.log");

        let header = format!("[LAUNCH] exe={}\n[LAUNCH] args={:?}\n", exe.display(), args);

        let _ = std::fs::write(&log_file, header);

        let stdout_f = std::fs::OpenOptions::new().append(true).open(&log_file).ok();

        let stderr_f = stdout_f.as_ref().and_then(|f| f.try_clone().ok());

        let stdout_stdio = stdout_f.map(std::process::Stdio::from).unwrap_or_else(std::process::Stdio::null);

        let stderr_stdio = stderr_f.map(std::process::Stdio::from).unwrap_or_else(std::process::Stdio::null);

        match std::process::Command::new(&exe)

            .args(&args)

            .current_dir(&dir)

            .creation_flags(CREATE_NO_WINDOW)

            .stdout(stdout_stdio)

            .stderr(stderr_stdio)

            .spawn()

        {

            Ok(child) => {

                let pid = child.id();

                *guard = Some(child);

                let _ = std::fs::write(&pid_file, pid.to_string());

                Ok(())

            }

            Err(e) => Err(format!("docspi-divert.exe başlatılamadı: {}", e)),

        }

    }

    #[cfg(target_os = "linux")]
    {
        let exe = match divert_exe_path() {
            Some(p) => p,
            None => return Err("docspi-divert bulunamadı. AF_PACKET modu için bu dosya gereklidir.".to_string()),
        };

        let mut args: Vec<String> = vec![];

        args.push("--mode".to_string());
        args.push(config.mode.clone());

        if config.auto_ttl {
            args.push("--auto-ttl".to_string());
        }
        if config.block_quic {
            args.push("--block-quic".to_string());
        }
        if config.wrong_chksum {
            args.push("--wrong-chksum".to_string());
        }
        if config.wrong_seq {
            args.push("--wrong-seq".to_string());
        }
        if config.dns_redirect && !config.dns_addr.is_empty() {
            args.push("--dns-redirect".to_string());
            args.push("--dns-addr".to_string());
            args.push(config.dns_addr.clone());
        }
        if config.proxy_port > 0 {
            args.push("--proxy-port".to_string());
            args.push(config.proxy_port.to_string());
        }
        if !config.fake_sni.is_empty() {
            args.push("--fake-sni".to_string());
            args.push(config.fake_sni.clone());
        }

        let pid_file = std::env::temp_dir().join("docspi_divert.pid");
        args.push("--pid-file".to_string());
        args.push(pid_file.to_string_lossy().to_string());

        let dir = exe.parent()
            .ok_or_else(|| "Divert exe dizini alınamadı".to_string())?
            .to_path_buf();

        let mut guard = match divert_process().lock() {
            Ok(g) => g,
            Err(e) => e.into_inner(),
        };

        if guard.is_some() {
            return Ok(());
        }

        let log_file = std::env::temp_dir().join("docspi_divert.log");
        let header = format!("[LAUNCH] exe={}\n[LAUNCH] args={:?}\n", exe.display(), args);
        let _ = std::fs::write(&log_file, header);

        let stdout_f = std::fs::OpenOptions::new().append(true).open(&log_file).ok();
        let stderr_f = stdout_f.as_ref().and_then(|f| f.try_clone().ok());
        let stdout_stdio = stdout_f.map(std::process::Stdio::from).unwrap_or_else(std::process::Stdio::null);
        let stderr_stdio = stderr_f.map(std::process::Stdio::from).unwrap_or_else(std::process::Stdio::null);

        match std::process::Command::new(&exe)
            .args(&args)
            .current_dir(&dir)
            .stdout(stdout_stdio)
            .stderr(stderr_stdio)
            .spawn()
        {
            Ok(child) => {
                let pid = child.id();
                *guard = Some(child);
                let _ = std::fs::write(&pid_file, pid.to_string());
                Ok(())
            }
            Err(e) => Err(format!("docspi-divert başlatılamadı: {}", e)),
        }
    }

    #[cfg(target_os = "android")]
    {
        let _ = config;
        Ok(())
    }

}

fn stop_divert_process() {

    let mut g = match divert_process().lock() {

        Ok(g) => g,

        Err(e) => e.into_inner(),

    };

    if let Some(ref mut child) = *g {

        // Graceful shutdown: SIGTERM first, then SIGKILL after timeout
        #[cfg(any(target_os = "linux", target_os = "android"))]
        {
            use std::os::unix::process::ExitStatusExt;
            unsafe { libc::kill(child.id() as i32, libc::SIGTERM); }
            std::thread::sleep(std::time::Duration::from_millis(1500));
            match child.try_wait() {
                Ok(Some(_)) => {}, // already exited
                _ => { let _ = child.kill(); }
            }
        }

        #[cfg(not(any(target_os = "linux", target_os = "android")))]
        let _ = child.kill();

    }

    *g = None;

    let _ = std::fs::remove_file(std::env::temp_dir().join("docspi_divert.pid"));

}

fn sentinel_path() -> std::path::PathBuf {

    std::env::temp_dir().join("docspi_proxy_active.lock")

}

/// Sanal ağ adaptörlerini filtreleyen akıllı LAN IP bulucu.
/// VirtualBox, VMware, Hamachi, VPN gibi sanal adaptörleri atlar.
fn get_safe_lan_ip() -> String {

    // Filtrelenecek sanal adaptör anahtar kelimeleri (küçük harf)

    const VIRTUAL_KEYWORDS: &[&str] = &[

        "virtual",

        "vmware",

        "vmnet",

        "vbox",

        "virtualbox",

        "pseudo",

        "hamachi",

        "vpn",

        "vethernet",

        "loopback",

        "docker",

        "wsl",

        "hyper-v",

        "bluetooth",

        "teredo",

        "isatap",

        "6to4",

        "tap-",

        "tun",

        "warp",

        "tailscale",

        "zerotier",

        "nordlynx",

        "wireguard",

        "proton",

        "mullvad",

        "windscribe",

        "surfshark",

        "host-only",

        "hostonly",

        "vEthernet",

        "npcap",

        "miniport",

    ];

    /// Bilinen sanal ağ IP aralıklarını kontrol eder.
    /// Adaptör adı filtreleri yakalayamadığında (Windows generic isimlendirme) bu devreye girer.
    fn is_virtual_ip_range(ip: &std::net::Ipv4Addr) -> bool {

        let octets = ip.octets();

        match (octets[0], octets[1]) {

            // VirtualBox Host-Only: 192.168.56.x (varsayılan)

            (192, 168) if octets[2] == 56 => true,

            // VMware NAT: 192.168.19x.x

            (192, 168) if octets[2] >= 190 => true,

            // Docker default bridge: 172.17.x.x

            (172, 17) => true,

            // WSL: 172.x.x.x (genellikle 172.16-31 arası ama 172.17+ sanal olma ihtimali yüksek)

            // Hamachi: 25.x.x.x

            (25, _) => true,

            // APIPA (otomatik atanmış, ağ bağlantısı yok): 169.254.x.x

            (169, 254) => true,

            _ => false,

        }

    }

    if let Ok(netifs) = list_afinet_netifas() {

        for (name, ip) in &netifs {

            eprintln!("[NET-DEBUG] Interface: '{}' → {}", name, ip);

        }

        for (name, ip) in &netifs {

            if let IpAddr::V4(v4) = ip {

                if v4.is_loopback() || v4.is_link_local() {

                    continue;

                }

                let name_lower = name.to_lowercase();

                let is_virtual_name = VIRTUAL_KEYWORDS.iter().any(|kw| name_lower.contains(kw));

                let is_virtual_range = is_virtual_ip_range(v4);

                if !is_virtual_name && !is_virtual_range {

                    eprintln!(

                        "[NET-SELECT] ✅ Gerçek adaptör seçildi: '{}' → {}",

                        name, v4

                    );

                    return v4.to_string();

                }

            }

        }

        for (name, ip) in &netifs {

            if let IpAddr::V4(v4) = ip {

                if !v4.is_loopback() && !v4.is_link_local() && !is_virtual_ip_range(v4) {

                    eprintln!("[NET-SELECT] Fallback adaptör: '{}' → {}", name, v4);

                    return v4.to_string();

                }

            }

        }

        for (_, ip) in &netifs {

            if let IpAddr::V4(v4) = ip {

                if !v4.is_loopback() {

                    return v4.to_string();

                }

            }

        }

    }

    "127.0.0.1".to_string()

}

/// Basit string hash — PAC body değişti mi kontrolü için
fn simple_hash(s: &str) -> u64 {

    let mut h: u64 = 5381;

    for b in s.bytes() {

        h = h.wrapping_mul(33).wrapping_add(b as u64);

    }

    h

}

/// Ön-derlenmiş PAC HTTP yanıtı — her istekte format! çağırmaz
pub struct PacCache {

    pub pac_response: Vec<u8>,

    pub body_hash: u64,

}

/// PAC sunucusu durumu: thread handle + shutdown flag + dinamik body
pub struct PacServerState {

    pub join_handle: Mutex<Option<thread::JoinHandle<()>>>,

    pub shutdown: Arc<AtomicBool>,

    pub pac_body: Arc<Mutex<String>>,

    pub pac_cache: Arc<Mutex<PacCache>>,

    pub pac_port: Mutex<u16>,

    pub pac_url: Mutex<String>,

}

impl Default for PacServerState {

    fn default() -> Self {

        Self {

            join_handle: Mutex::new(None),

            shutdown: Arc::new(AtomicBool::new(false)),

            pac_body: Arc::new(Mutex::new(make_pac_direct_body())),

            pac_cache: Arc::new(Mutex::new(PacCache {

                pac_response: Vec::new(),

                body_hash: 0,

            })),

            pac_port: Mutex::new(0),

            pac_url: Mutex::new(String::new()),

        }

    }

}

const PAC_PORT_START: u16 = 8787;

const PAC_PORT_END: u16 = 8887;

const SUPPORT_URL: &str = "https://discord.gg/aydocs";

/// Bağlantı kesildiğinde kullanılan fallback PAC: tüm trafiği DIRECT yönlendirir
/// Bu sayede cihazlar internet erişimini kaybetmez
fn make_pac_direct_body() -> String {

    r#"function FindProxyForURL(url, host) {

    // DocsPI proxy devre dışı — tüm trafik doğrudan çıkış

    // Bu PAC dosyası otomatik olarak sunulur; ayar değişikliği gerekmez

    return "DIRECT";

}

"#

    .to_string()

}

/// Production PAC: yerel ağ DIRECT, diğerleri PROXY ip:port; DIRECT (fail-safe)
/// dnsResolve çağrıları try-catch ile korunuyor — DNS timeout olursa PAC script çökmez
fn make_pac_body(lan_ip: &str, proxy_port: u16, bypass_domains: &[String]) -> String {

    let proxy = format!("{}:{}", lan_ip, proxy_port);

    let custom_block = if bypass_domains.is_empty() {

        String::new()

    } else {

        let conditions: Vec<String> = bypass_domains.iter().map(|d| {

            let d = d.trim();

            if d.starts_with("*.") {

                format!("        shExpMatch(host, \"{}\")", d)

            } else {

                format!("        host === \"{}\"", d)

            }

        }).collect();

        format!("\n    if ({})\n        return \"DIRECT\";\n", conditions.join(" ||\n"))

    };

    format!(

        r#"function FindProxyForURL(url, host) {{

    if (isPlainHostName(host) ||

        host === "localhost" ||

        shExpMatch(host, "127.*") ||

        shExpMatch(host, "10.*") ||

        shExpMatch(host, "192.168.*") ||

        shExpMatch(host, "172.16.*") || shExpMatch(host, "172.17.*") ||

        shExpMatch(host, "172.18.*") || shExpMatch(host, "172.19.*") ||

        shExpMatch(host, "172.2?.*") || shExpMatch(host, "172.30.*") ||

        shExpMatch(host, "172.31.*") ||

        shExpMatch(host, "*.local") ||

        shExpMatch(host, "*.localhost") ||

        shExpMatch(host, "*.internal"))

        return "DIRECT";

    //    Bu olmazsa Windows/Android "internet yok" simgesi gösterir

    if (shExpMatch(host, "*.msftconnecttest.com") ||

        shExpMatch(host, "*.msftncsi.com") ||

        host === "dns.msn.com" ||

        host === "ipv6.msftconnecttest.com" ||

        host === "connectivitycheck.gstatic.com" ||

        host === "connectivitycheck.android.com" ||

        host === "clients3.google.com" ||

        host === "play.googleapis.com" ||

        host === "captive.apple.com" ||

        host === "gsp1.apple.com" ||

        host === "connectivitycheck.samsung.com" ||

        shExpMatch(host, "*.windowsupdate.com") ||

        shExpMatch(host, "*.delivery.mp.microsoft.com"))

        return "DIRECT";

{}

    // NOT: Oyun/uygulama launcher bypass'ı burada YOK!

    // PAC server telefon/LAN cihazlarına hizmet eder — bu cihazlarda DPI engeli aktif,

    // bu yüzden oyun trafiği proxy üzerinden geçmeli.

    // Windows masaüstünde ise Registry ProxyOverride + WinHTTP bypass ile çözülür.

    return "PROXY {}; DIRECT";

}}"#,

        custom_block,

        proxy

    )

}

fn make_setup_html(pac_url: &str) -> String {

    format!(

        r#"<!DOCTYPE html>

<html lang="tr">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

<title>DocsPI – Kurulum</title>

<style>

:root {{

    --bg-color: #09090b;

    --card-bg: #18181b;

    --primary: #3b82f6;

    --primary-hover: #2563eb;

    --success: #22c55e;

    --text-main: #f8fafc;

    --text-muted: #94a3b8;

    --border: rgba(255,255,255,0.08);

}}

* {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-tap-highlight-color: transparent; }}

body {{ background-color: var(--bg-color); color: var(--text-main); line-height: 1.5; padding: 20px 16px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }}

.container {{ width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 20px; }}

/* Header */

.header {{ text-align: center; margin-bottom: 10px; animation: fadeDown 0.6s ease; }}

.title {{ font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }}

.subtitle {{ font-size: 0.9rem; color: var(--text-muted); }}

/* Card */

.card {{ background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: fadeUp 0.6s ease; }}

.card-title {{ font-size: 1.05rem; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }}

/* Input Group */

.input-group {{ position: relative; margin-bottom: 16px; }}

.url-input {{ width: 100%; background: #27272a; border: 1px solid #3f3f46; color: var(--text-main); font-size: 0.9rem; padding: 14px 16px; border-radius: 12px; outline: none; transition: border-color 0.2s; -webkit-user-select: all; user-select: all; }}

.url-input:focus {{ border-color: var(--primary); }}

/* Copy Button */

.btn-copy {{ width: 100%; height: 50px; background: var(--primary); color: #fff; font-size: 1.05rem; font-weight: 600; padding: 0 20px; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }}

.btn-copy:active {{ transform: scale(0.98); }}

.btn-copy.success {{ background: var(--success); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }}

/* Guide Button */

.btn-guide {{ display: inline-flex; align-items: center; justify-content: center; background: var(--success); color: #fff; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; border: none; width: 100%; margin-top: 12px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(34,197,94,0.3); }}

.btn-guide:active {{ transform: scale(0.98); opacity: 0.9; }}

/* Steps */

.step-list {{ list-style: none; counter-reset: custom-counter; margin-top: 10px; display: flex; flex-direction: column; gap: 12px; }}

.step-item {{ position: relative; padding-left: 36px; font-size: 0.9rem; color: #a1a1aa; }}

.step-item::before {{ content: counter(custom-counter); counter-increment: custom-counter; position: absolute; left: 0; top: -1px; width: 24px; height: 24px; background: rgba(255,255,255,0.1); color: #fff; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; border-radius: 50%; }}

.step-item strong {{ color: #e2e8f0; font-weight: 600; display: block; margin-bottom: 2px; }}

/* Language Switcher */

.lang-switcher {{ display: flex; justify-content: center; gap: 12px; margin-bottom: 8px; animation: fadeDown 0.6s ease; }}

.lang-btn {{ background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; padding: 6px 16px; border-radius: 10px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }}

.lang-btn.active {{ background: var(--primary); border-color: var(--primary); font-weight: 700; box-shadow: 0 0 15px rgba(59,130,246,0.3); }}

/* Divider */

.divider {{ height: 1px; background: var(--border); margin: 24px 0; }}

/* Animations */

@keyframes fadeUp {{ from {{ opacity: 0; transform: translateY(15px); }} to {{ opacity: 1; transform: translateY(0); }} }}

@keyframes fadeDown {{ from {{ opacity: 0; transform: translateY(-15px); }} to {{ opacity: 1; transform: translateY(0); }} }}

/* Notice */

.notice {{ background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 12px; border-radius: 12px; margin-top: 20px; font-size: 0.85rem; color: #fca5a5; display: flex; align-items: flex-start; gap: 10px; }}

.notice-icon {{ font-size: 1.2rem; }}

</style>

</head>

<body>

<div class="container">

    <div class="lang-switcher">

        <button class="lang-btn active" id="btn-tr">TÜRKÇE</button>

        <button class="lang-btn" id="btn-en">ENGLISH</button>

    </div>

    <header class="header">

        <h1 class="title" data-tr="DocsPI'a Bağlan" data-en="Connect to DocsPI">DocsPI'a Bağlan</h1>

        <p class="subtitle" data-tr="İnternet trafiğinizi şifreleyin ve engelleri aşın" data-en="Bypass Internet Restrictions">İnternet Engellerini Aşın</p>

    </header>

    <div class="notice" style="margin-top: 0; margin-bottom: 20px;">

        <div>

            <strong data-tr="DİKKAT:" data-en="ATTENTION:">DİKKAT:</strong>

            <span data-tr="DocsPI kapatıldıktan sonra YouTube vb. uygulamalarda internet sorunu yaşarsanız (eski önbellek nedeniyle), Wi-Fi bağlantısını kapatıp açmanız yeterlidir." data-en="If apps like YouTube lose internet access after closing DocsPI (due to cached connections), simply toggle your Wi-Fi off and on.">DocsPI kapatıldıktan sonra YouTube vb. uygulamalarda internet sorunu yaşarsanız (eski önbellek nedeniyle), Wi-Fi bağlantısını kapatıp açmanız yeterlidir.</span>

        </div>

    </div>

    <div class="card">

        <div class="card-title">

            <span data-tr="Android & iPhone Kurulumu" data-en="Android & iPhone Setup">Android & iPhone Kurulumu</span>

        </div>

        <div class="input-group">

            <input type="text" class="url-input" id="pacurl" value="{}" readonly onclick="this.select();">

        </div>

        <button class="btn-copy" id="copybtn" data-tr="Adresi Kopyala" data-en="Copy Address">

            Adresi Kopyala

        </button>

        <a href="https://docspi.vercel.app/proxy" target="_blank" class="btn-guide" data-tr="Görsel Kurulum Rehberi" data-en="Visual Setup Guide">

            Görsel Kurulum Rehberi

        </a>

        <div class="divider"></div>

        <div class="card-title" style="font-size:0.95rem; margin-bottom:12px;" data-tr="Nasıl yapılır kısaca?" data-en="Quick Guide">Nasıl yapılır kısaca?</div>

        <ul class="step-list">

            <li class="step-item">

                <strong data-tr="Yeşil butona basarak adresi kopyalayın." data-en="Copy the address using the green button.">Yeşil butona basarak adresi kopyalayın.</strong>

                <span data-tr="Kopyalanmazsa kutuya uzun basıp elle kopyalayın." data-en="If copy fails, long press the box to copy manually.">Kopyalanmazsa kutuya uzun basıp elle kopyalayın.</span>

            </li>

            <li class="step-item">

                <strong data-tr="Wi-Fi ayarlarınıza gidin." data-en="Go to Wi-Fi settings.">Wi-Fi ayarlarınıza gidin.</strong>

                <span data-tr="Bağlı olduğunuz ağın yanındaki (Ayarlar / i) ikonuna dokunun." data-en="Tap the (Settings / i) icon next to your network.">Bağlı olduğunuz ağın yanındaki (Ayarlar / i) ikonuna dokunun.</span>

            </li>

            <li class="step-item">

                <strong data-tr="Proxy ayarını 'Otomatik / PAC' olarak değiştirin." data-en="Change Proxy to 'Automatic / PAC'.">Proxy ayarını "Otomatik / PAC" olarak değiştirin.</strong>

                <span data-tr="Gelişmiş ayarlar menüsünün altında bulunabilir." data-en="Can be found under advanced settings.">Gelişmiş ayarlar menüsünün altında bulunabilir.</span>

            </li>

            <li class="step-item">

                <strong data-tr="Kopyaladığınız adresi yapıştırın ve kaydedin." data-en="Paste the copied address and save.">Kopyaladığınız adresi yapıştırın ve kaydedin.</strong>

                <span data-tr="Artık bağlantınız güvende!" data-en="Your connection is now secure!">Artık bağlantınız güvende!</span>

            </li>

        </ul>

    </div>

</div>

<script>

(function() {{

    var url = document.getElementById('pacurl').value;

    var btn = document.getElementById('copybtn');

    var currentLang = 'tr';

    function setLanguage(lang) {{

        currentLang = lang;

        document.querySelectorAll('[data-tr]').forEach(function(el) {{

            el.innerHTML = el.getAttribute('data-' + lang);

        }});

        document.getElementById('btn-tr').classList.toggle('active', lang === 'tr');

        document.getElementById('btn-en').classList.toggle('active', lang === 'en');

        // Kopyalanmış buton metnini koruyalım eğer o andaysa

        if (btn.classList.contains('success')) {{

             btn.innerHTML = (lang === 'tr' ? 'Kopyalandı!' : 'Copied!');

        }}

    }}

    document.getElementById('btn-tr').onclick = function() {{ setLanguage('tr'); }};

    document.getElementById('btn-en').onclick = function() {{ setLanguage('en'); }};

    function tryCopy() {{

        if (navigator.clipboard && navigator.clipboard.writeText) {{

            navigator.clipboard.writeText(url).then(function() {{

                showSuccess();

            }}).catch(fallbackCopyTextToClipboard);

        }} else {{

            fallbackCopyTextToClipboard();

        }}

    }}

    function showSuccess() {{

        var originalText = btn.getAttribute('data-' + currentLang);

        btn.innerHTML = (currentLang === 'tr' ? 'Kopyalandı!' : 'Copied!');

        btn.classList.add('success');

        setTimeout(function() {{

            btn.innerHTML = originalText;

            btn.classList.remove('success');

        }}, 2500);

    }}

    function fallbackCopyTextToClipboard() {{

        var textArea = document.createElement("textarea");

        textArea.value = url;

        textArea.style.top = "0";

        textArea.style.left = "0";

        textArea.style.position = "fixed";

        document.body.appendChild(textArea);

        textArea.focus();

        textArea.select();

        try {{

            var successful = document.execCommand('copy');

            if (successful) showSuccess();

        }} catch (err) {{ }}

        document.body.removeChild(textArea);

    }}

    btn.onclick = tryCopy;

}})();

</script>

</body>

</html>"#,

        html_escape(pac_url)

    )

}

fn html_escape(s: &str) -> String {

    s.replace('&', "&amp;")

        .replace('<', "&lt;")

        .replace('>', "&gt;")

        .replace('"', "&quot;")

}

/// Absolute URL'den path kısmını çıkarır.
/// "http://192.168.1.5:8787/proxy.pac" → "/proxy.pac"
/// "http://192.168.1.5:8787/"          → "/"
/// "/proxy.pac"                         → "/proxy.pac"  (zaten relative)
fn normalize_path(raw: &str) -> &str {

    if let Some(pos) = raw.find("://") {

        let after_scheme = &raw[pos + 3..];

        if let Some(slash_pos) = after_scheme.find('/') {

            return &after_scheme[slash_pos..];

        }

        return "/";

    }

    raw

}

fn handle_pac_request(

    stream: TcpStream,

    pac_body: &Arc<Mutex<String>>,

    pac_cache: &Arc<Mutex<PacCache>>,

    pac_url: &str,

) {

    let _ = stream.set_read_timeout(Some(Duration::from_secs(2)));

    let _ = stream.set_write_timeout(Some(Duration::from_secs(2)));

    let mut reader = std::io::BufReader::new(stream);

    let mut first_line = String::new();

    if std::io::BufRead::read_line(&mut reader, &mut first_line).is_err() || first_line.is_empty() {

        return;

    }

    // TCP RST önleme — request header'ları tamamen tüketilmeli

    let mut discard = String::new();

    while let Ok(n) = std::io::BufRead::read_line(&mut reader, &mut discard) {

        if n <= 2 {

            break;

        }

        discard.clear();

    }

    let mut stream = reader.into_inner();

    let raw_path = first_line

        .split_whitespace()

        .nth(1)

        .unwrap_or("/")

        .split('?')

        .next()

        .unwrap_or("/");

    let path = normalize_path(raw_path);

    let is_get = first_line.to_uppercase().starts_with("GET ");

    if is_get && path == "/logo" {

        let img = include_bytes!("../icons/128x128.png");

        let hdr = format!(

            "HTTP/1.1 200 OK\r\nContent-Type: image/png\r\nConnection: close\r\nContent-Length: {}\r\n\r\n",

            img.len()

        );

        let _ = stream.write_all(hdr.as_bytes());

        let _ = stream.write_all(img);

        let _ = stream.flush();

        return;

    }

    // Bazı senaryolarda tarayıcılar absolute URL (http://ip:port/proxy.pac) olarak gönderebilir.

    if is_get && (path.ends_with("/proxy.pac") || path.ends_with("/wpad.dat")) {

        let current_body = pac_body

            .lock()

            .map(|b| b.clone())

            .unwrap_or_else(|_| make_pac_direct_body());

        let current_hash = simple_hash(&current_body);

        // Dinamik Cache-Control: PROXY aktifken 60s, DIRECT modda 0

        let is_direct_mode = !current_body.contains("PROXY");

        let cache_header = if is_direct_mode {

            "Cache-Control: no-cache, no-store, must-revalidate, max-age=0"

        } else {

            "Cache-Control: max-age=60"

        };

        let mode_bit: u64 = if is_direct_mode { 1 } else { 0 };

        let cache_key = current_hash.wrapping_add(mode_bit);

        if let Ok(mut cache) = pac_cache.lock() {

            if cache.body_hash != cache_key || cache.pac_response.is_empty() {

                let response = format!(

                    "HTTP/1.1 200 OK\r\nContent-Type: application/x-ns-proxy-autoconfig\r\nConnection: close\r\nAccess-Control-Allow-Origin: *\r\n{}\r\nContent-Length: {}\r\n\r\n{}",

                    cache_header,

                    current_body.len(),

                    current_body

                );

                cache.pac_response = response.into_bytes();

                cache.body_hash = cache_key;

            }

            let _ = stream.write_all(&cache.pac_response);

        } else {

            let response = format!(

                "HTTP/1.1 200 OK\r\nContent-Type: application/x-ns-proxy-autoconfig\r\nConnection: close\r\nAccess-Control-Allow-Origin: *\r\n{}\r\nContent-Length: {}\r\n\r\n{}",

                cache_header,

                current_body.len(),

                current_body

            );

            let _ = stream.write_all(response.as_bytes());

        }

        let _ = stream.flush();

        return; // ← ÖNEMLİ: Burada fonksiyondan çık

    }

    if !is_get {

        let _ = stream

            .write_all(b"HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n");

        let _ = stream.flush();

        return;

    }

    let (status, content_type, body) = if path == "/" || path.is_empty() {

        (

            "200 OK",

            "text/html; charset=utf-8",

            make_setup_html(pac_url),

        )

    } else {

        ("404 Not Found", "text/plain", String::new())

    };

    let response = format!(

        "HTTP/1.1 {}\r\nContent-Type: {}\r\nConnection: close\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\nContent-Length: {}\r\n\r\n{}",

        status,

        content_type,

        body.len(),

        body

    );

    let _ = stream.write_all(response.as_bytes());

    let _ = stream.flush();

}

#[derive(serde::Serialize)]
struct PacResponse {

    pac_port: u16,

}

/// P1-FIX: PAC sunucusu eşzamanlı bağlantı limiti
const MAX_PAC_CONNECTIONS: u32 = 50;

fn manage_firewall_rules(enable: bool, proxy_port: u16, pac_port: u16) {

    std::thread::spawn(move || {

        let fw = &platform::get().firewall;

        let _ = fw.remove_rule("DocsDPI_Proxy");

        let _ = fw.remove_rule("DocsDPI_PAC");

        if enable {

            let _ = fw.open_port(proxy_port, "DocsDPI_Proxy");

            let _ = fw.open_port(pac_port, "DocsDPI_PAC");

        }

    });

}

#[tauri::command]
fn start_pac_server(

    proxy_port: u16,

    bypass_domains: Vec<String>,

    state: tauri::State<'_, PacServerState>,

) -> Result<PacResponse, String> {

    let lan_ip = get_safe_lan_ip();

    // PAC body'yi güncelle — proxy moduna geç

    let new_pac_body = make_pac_body(&lan_ip, proxy_port, &bypass_domains);

    if let Ok(mut body) = state.pac_body.lock() {

        *body = new_pac_body;

    }

    // Sunucu zaten çalışıyorsa, sadece body güncellendi — port bilgisini döndür

    let guard = state.join_handle.lock().map_err(|e| e.to_string())?;

    if guard.is_some() {

        let current_port = *state.pac_port.lock().map_err(|e| e.to_string())?;

        // PAC URL'yi de güncelle (port aynı kalsa bile proxy_port değişmiş olabilir)

        if let Ok(mut url) = state.pac_url.lock() {

            *url = format!("http://{}:{}/proxy.pac", lan_ip, current_port);

        }

        return Ok(PacResponse {

            pac_port: current_port,

        });

    }

    drop(guard); // Lock'u serbest bırak

    // Ama yerel cihazların güvenliği için bind adresi sabitlenir

    let bind_addr = "0.0.0.0";

    // Dinamik PAC port: 8787-8887 arasında müsait olanı bul

    let mut found_port: u16 = 0;

    let mut listener_result = None;

    for port in PAC_PORT_START..=PAC_PORT_END {

        match TcpListener::bind((bind_addr, port)) {

            Ok(l) => {

                found_port = port;

                listener_result = Some(l);

                break;

            }

            Err(_) => continue,

        }

    }

    if listener_result.is_none() {

        match TcpListener::bind((bind_addr, 0u16)) {

            Ok(l) => {

                if let Ok(addr) = l.local_addr() {

                    found_port = addr.port();

                }

                listener_result = Some(l);

            }

            Err(e) => return Err(format!("PAC için uygun port bulunamadı: {}", e)),

        }

    }

    let listener = listener_result.ok_or_else(|| "PAC için uygun port bulunamadı".to_string())?;

    listener.set_nonblocking(true).map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    manage_firewall_rules(true, proxy_port, found_port);

    let pac_url = format!("http://{}:{}/proxy.pac", lan_ip, found_port);

    if let Ok(mut p) = state.pac_port.lock() {

        *p = found_port;

    }

    if let Ok(mut u) = state.pac_url.lock() {

        *u = pac_url.clone();

    }

    let shutdown = Arc::clone(&state.shutdown);

    shutdown.store(false, Ordering::Relaxed);

    let pac_body_arc = Arc::clone(&state.pac_body);

    let pac_cache_arc = Arc::clone(&state.pac_cache);

    let pac_url_for_thread = pac_url.clone();

    let active_connections = Arc::new(std::sync::atomic::AtomicU32::new(0));

    let join_handle = thread::spawn(move || {

        let mut backoff_ms: u64 = 50;

        const BACKOFF_MAX: u64 = 500;

        while !shutdown.load(Ordering::Relaxed) {

            match listener.accept() {

                Ok((stream, _)) => {

                    backoff_ms = 50;

                    let current = active_connections.load(Ordering::Relaxed);

                    if current >= MAX_PAC_CONNECTIONS {

                        drop(stream);

                        continue;

                    }

                    active_connections.fetch_add(1, Ordering::Relaxed);

                    let body = Arc::clone(&pac_body_arc);

                    let cache = Arc::clone(&pac_cache_arc);

                    let url = pac_url_for_thread.clone();

                    let conn_counter = Arc::clone(&active_connections);

                    thread::spawn(move || {

                        let _ = stream.set_nonblocking(false);

                        let _ = stream.set_nodelay(true);

                        let _ = stream.set_read_timeout(Some(Duration::from_secs(2)));

                        let _ = stream.set_write_timeout(Some(Duration::from_secs(2)));

                        handle_pac_request(stream, &body, &cache, &url);

                        conn_counter.fetch_sub(1, Ordering::Relaxed);

                    });

                }

                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {

                    thread::sleep(Duration::from_millis(backoff_ms));

                    backoff_ms = (backoff_ms * 2).min(BACKOFF_MAX);

                }

                Err(_) => {}

            }

        }

    });

    let mut guard = state.join_handle.lock().map_err(|e| e.to_string())?;

    *guard = Some(join_handle);

    Ok(PacResponse {

        pac_port: found_port,

    })

}

/// Bağlantı kesildiğinde PAC body'yi DIRECT moduna geçir.
/// Sunucu çalışmaya devam eder — cihazlar internet erişimini kaybetmez.
#[tauri::command]
fn stop_pac_server(state: tauri::State<'_, PacServerState>) -> Result<(), String> {

    // Sunucuyu kapatmak yerine PAC body'yi DIRECT moduna geçir

    if let Ok(mut body) = state.pac_body.lock() {

        *body = make_pac_direct_body();

    }

    if let Ok(mut cache) = state.pac_cache.lock() {

        cache.body_hash = 0;

        cache.pac_response.clear();

    }

    #[cfg(target_os = "windows")]
    manage_firewall_rules(false, 0, 0);

    Ok(())

}

#[derive(serde::Serialize)]
struct ConfigResponse {

    port: u16,

    lan_ip: String,

    bind_address: String,

}

#[tauri::command]
fn get_sidecar_config(

    allow_lan_sharing: bool,

    enable_game_mode: bool,

) -> Result<ConfigResponse, String> {

    // Game Mode (WinHTTP) açıkken 0.0.0.0'a bind et — UWP uygulamaları (Roblox vb.)

    // AppContainer sandbox yüzünden 127.0.0.1'e erişemez, LAN IP üzerinden bağlanır

    let bind_addr = if allow_lan_sharing || enable_game_mode {

        "0.0.0.0"

    } else {

        "127.0.0.1"

    };

    // Öncelikli Portlar: 8080 - 8090 arası kontrol et

    let mut selected_port = 0;

    for port in 8080..=8090 {

        if TcpListener::bind((bind_addr, port)).is_ok() {

            selected_port = port;

            break;

        }

    }

    if selected_port == 0 {

        if let Ok(listener) = TcpListener::bind((bind_addr, 0)) {

            if let Ok(addr) = listener.local_addr() {

                selected_port = addr.port();

            }

        }

    }

    if selected_port == 0 {

        return Err("Uygun port bulunamadı.".to_string());

    }

    // Yerel IP Adresini Bul (LAN Paylaşımı için) — Sanal adaptörleri filtreler

    let lan_ip = get_safe_lan_ip();

    Ok(ConfigResponse {

        port: selected_port,

        lan_ip,

        bind_address: bind_addr.to_string(),

    })

}

/// Registry proxy işlemlerini serialize eden global lock
/// set_system_proxy ve clear_system_proxy eş zamanlı çağrılabilir (reconnect sırasında)
fn proxy_lock() -> &'static Mutex<()> {

    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();

    LOCK.get_or_init(|| Mutex::new(()))

}

/// P0-FIX-3: Poisoned mutex recovery — panic sonrası bile proxy temizleme çalışsın
fn acquire_proxy_lock() -> std::sync::MutexGuard<'static, ()> {

    match proxy_lock().lock() {

        Ok(guard) => guard,

        Err(poisoned) => {

            eprintln!("[WARN] Proxy lock was poisoned (previous panic?), recovering");

            poisoned.into_inner()

        }

    }

}

#[tauri::command]
fn clear_system_proxy() -> Result<(), String> {

    let _guard = acquire_proxy_lock();

    platform::get().proxy.clear_proxy()?;

    if check_admin() {

        #[cfg(target_os = "windows")]
        {

            use std::os::windows::process::CommandExt;

            const CREATE_NO_WINDOW: u32 = 0x08000000;

            let _ = std::process::Command::new("netsh")

                .args(["winhttp", "reset", "proxy"])

                .creation_flags(CREATE_NO_WINDOW)

                .stdout(std::process::Stdio::null())

                .stderr(std::process::Stdio::null())

                .status();

        }

        manage_firewall_rules(false, 0, 0);

        stop_guard();

    }

    stop_divert_process();

    let _ = std::fs::remove_file(sentinel_path());

    Ok(())

}

/// Notify Windows that internet settings have changed
/// This forces browsers to immediately pick up the new proxy settings
fn notify_proxy_change() {

    platform::get().proxy.notify_change();

}

/// P1-FIX: UWP AppContainer'ları arka planda otomatik olarak Loopback Proxy için yetkilendirir.
/// Bu sayede Roblox, Speedtest ve diğer Windows Mağaza uygulamaları 127.0.0.1 proxy sunucusuna başarılı şekilde bağlanabilir.
fn exempt_all_uwp_apps() {

    platform::get().uwp.exempt_loopback();

}

#[tauri::command]
fn set_system_proxy(port: u16, enable_winhttp: bool, custom_bypass_domains: Vec<String>) -> Result<(), String> {

    let _guard = acquire_proxy_lock();

    if port < 1024 {

        return Err("Geçersiz port numarası (1024-65535 arası olmalı)".to_string());

    }

    let lan_ip = get_safe_lan_ip();

    platform::get().proxy.set_proxy(&lan_ip, port, &custom_bypass_domains)?;

    if check_admin() {

        exempt_all_uwp_apps();

        #[cfg(target_os = "windows")]
        {

            use std::os::windows::process::CommandExt;

            const CREATE_NO_WINDOW: u32 = 0x08000000;

            if enable_winhttp {

                let proxy_addr = "127.0.0.1".to_string();

                let mut winhttp_domains = vec![

                    "<local>".to_string(), proxy_addr.clone(),

                    "*.steamcontent.com".to_string(), "*.steamstatic.com".to_string(), "*.cm.steampowered.com".to_string(),

                    "*.epicgames.com".to_string(), "*.unrealengine.com".to_string(),

                    "*.riotgames.com".to_string(), "*.leagueoflegends.com".to_string(),

                    "discord.com".to_string(), "*.discord.com".to_string(), "*.discordapp.net".to_string(),

                    "*.discord.media".to_string(), "gateway.discord.gg".to_string(),

                    "*.ea.com".to_string(), "*.origin.com".to_string(),

                    "*.blizzard.com".to_string(), "*.battle.net".to_string(),

                    "*.ubisoft.com".to_string(), "*.ubi.com".to_string(),

                    "*.xboxlive.com".to_string(), "*.xbox.com".to_string(), "*.microsoft.com".to_string(),

                    "*.cachefly.net".to_string(),

                    "*.msftconnecttest.com".to_string(), "*.windowsupdate.com".to_string(),

                ];

                winhttp_domains.extend(custom_bypass_domains.iter().cloned());

                let winhttp_bypass = format!("bypass-list=\"{}\"", winhttp_domains.join(";"));

                let _ = std::process::Command::new("netsh")

                    .args(["winhttp", "set", "proxy", &format!("{}:{}", proxy_addr, port), &winhttp_bypass])

                    .creation_flags(CREATE_NO_WINDOW)

                    .stdout(std::process::Stdio::null())

                    .stderr(std::process::Stdio::null())

                    .status();

            }

        }

        launch_guard();

    }

    let _ = std::fs::write(sentinel_path(), format!("port={}", port));

    Ok(())

}

/// P1-FIX: Tooltip uzunluk sınırı — Windows tooltip limiti 128 karakter
#[tauri::command]
fn update_tray_tooltip(app: tauri::AppHandle, tooltip: String) -> Result<(), String> {

    #[cfg(desktop)]
    {
        let sanitized: String = tooltip.chars().take(128).collect();

        if let Some(tray) = app.tray_by_id("tray") {

            tray.set_tooltip(Some(sanitized))

                .map_err(|e| e.to_string())?;

        }
    }

    Ok(())

}

/// P1-FIX: Port aralığı kısıtlama — XSS ile localhost port taraması engellenir
#[tauri::command]
fn check_port_open(port: u16) -> bool {

    if port < 1024 {

        return false;

    }

    TcpStream::connect_timeout(

        &std::net::SocketAddr::from(([127, 0, 0, 1], port)),

        Duration::from_millis(500),

    )

    .is_ok()

}

#[tauri::command]
async fn test_bypass_connection(proxy_port: u16) -> Result<bool, String> {

    let target = "google.com:443";

    let proxy_addr = format!("127.0.0.1:{}", proxy_port);

    match TcpStream::connect_timeout(

        &proxy_addr.parse().map_err(|e| format!("Invalid proxy address: {}", e))?,

        Duration::from_secs(3),

    ) {

        Ok(mut stream) => {

            let _ = stream.set_write_timeout(Some(Duration::from_secs(2)));

            let _ = stream.set_read_timeout(Some(Duration::from_secs(2)));

            let connect_req = format!("CONNECT {} HTTP/1.1\r\nHost: {}\r\n\r\n", target, target);

            if stream.write_all(connect_req.as_bytes()).is_err() {

                return Ok(false);

            }

            let mut response = [0u8; 1024];

            match stream.read(&mut response) {

                Ok(n) if n > 0 => {

                    let res_str = String::from_utf8_lossy(&response[..n]);

                    if res_str.contains("200 Connection established") || res_str.contains("200 OK") {

                        Ok(true)

                    } else {

                        Ok(false)

                    }

                }

                _ => Ok(false),

            }

        }

        Err(_) => Ok(false),

    }

}

#[tauri::command]
fn check_admin() -> bool {

    platform::get().network.is_admin()

}

fn perform_app_exit(app: &tauri::AppHandle) {

    // clear_system_proxy zaten RunEvent::ExitRequested'da çağrılacak

    // Burada tekrar çağırma — app.exit() ExitRequested tetikler

    app.exit(0);

}

/// Uygulama açıldığında eski docspi-proxy süreçlerini temizle (Zombi süreç önleme)
#[tauri::command]
fn save_sidecar_pid(pid: u32) {

    let pid_file = std::env::temp_dir().join("docspi_sidecar.pid");

    let _ = std::fs::write(&pid_file, pid.to_string());

}

#[tauri::command]
fn kill_zombie_sidecar() -> Result<String, String> {

    let pid_file = std::env::temp_dir().join("docspi_sidecar.pid");

    if let Ok(pid_str) = std::fs::read_to_string(&pid_file) {

        if let Ok(pid) = pid_str.trim().parse::<u32>() {

            platform::get().process.kill_by_pid(pid)?;

            let _ = std::fs::remove_file(&pid_file);

            return Ok(format!("Zombi süreç (PID {}) durduruldu.", pid));

        }

    }

    Ok("Zombi PID dosyası bulunamadı.".to_string())

}

#[tauri::command]
fn start_divert_engine(config: DivertConfig) -> Result<(), String> {

    if !check_admin() {

        return Err("Güçlü Mod (Kernel Driver) yönetici izinleri gerektirir. Lütfen uygulamayı yönetici olarak çalıştırın.".to_string());

    }

    launch_divert_process(&config)

}

#[tauri::command]
fn stop_divert_engine() -> Result<(), String> {

    stop_divert_process();

    Ok(())

}

#[tauri::command]
fn check_divert_running() -> bool {

    let mut g = match divert_process().lock() {

        Ok(g) => g,

        Err(e) => e.into_inner(),

    };

    if let Some(ref mut child) = *g {

        match child.try_wait() {

            Ok(None) => true,

            _ => {

                *g = None;

                false

            }

        }

    } else {

        false

    }

}

#[tauri::command]
fn get_divert_log() -> String {

    let log_file = std::env::temp_dir().join("docspi_divert.log");

    std::fs::read_to_string(&log_file).unwrap_or_default()

}

#[tauri::command]
fn kill_zombie_divert() -> Result<String, String> {

    let pid_file = std::env::temp_dir().join("docspi_divert.pid");

    if let Ok(pid_str) = std::fs::read_to_string(&pid_file) {

        if let Ok(pid) = pid_str.trim().parse::<u32>() {

            platform::get().process.kill_by_pid(pid)?;

            let _ = std::fs::remove_file(&pid_file);

            return Ok(format!("Divert süreç (PID {}) durduruldu.", pid));

        }

    }

    Ok("Divert PID dosyası bulunamadı.".to_string())

}

#[tauri::command]
async fn check_dns_latency(dns_ip: String) -> Result<u32, String> {

    // Sadece bilinen DNS IP'lerini kabul et (Arbitrary internal network scan'i önler)

    let allowed_ips = [

        "1.1.1.1",        // Cloudflare

        "8.8.8.8",        // Google

        "9.9.9.9",        // Quad9

        "94.140.14.14",   // AdGuard

        "208.67.222.222", // OpenDNS

    ];

    if !allowed_ips.contains(&dns_ip.as_str()) {

        return Err("Bilinmeyen DNS adresi".to_string());

    }

    let start = std::time::Instant::now();

    let addr = format!("{}:53", dns_ip)

        .parse()

        .map_err(|e: std::net::AddrParseError| e.to_string())?;

    match std::net::TcpStream::connect_timeout(&addr, std::time::Duration::from_millis(1500)) {

        Ok(_) => Ok(start.elapsed().as_millis() as u32),

        Err(_) => Ok(999),

    }

}

#[derive(serde::Serialize)]
struct DnsBenchmarkEntry {

    provider: String,

    ip: String,

    latency_ms: u32,

    reachable: bool,

}

#[derive(serde::Serialize)]
struct DnsBenchmarkOutput {

    results: Vec<DnsBenchmarkEntry>,

    fastest_provider: String,

    fastest_ip: String,

    fastest_latency: u32,

}

#[tauri::command]
async fn dns_benchmark() -> DnsBenchmarkOutput {

    let dns_servers = [

        ("cloudflare", "1.1.1.1"),

        ("google", "8.8.8.8"),

        ("quad9", "9.9.9.9"),

        ("adguard", "94.140.14.14"),

        ("opendns", "208.67.222.222"),

    ];

    let mut handles = Vec::new();

    for (provider, ip) in &dns_servers {

        let provider = provider.to_string();

        let ip = ip.to_string();

        handles.push(std::thread::spawn(move || {

            let start = std::time::Instant::now();

            let addr_str = format!("{}:53", ip);

            let reachable = addr_str.parse::<std::net::SocketAddr>()

                .ok()

                .map(|addr| std::net::TcpStream::connect_timeout(&addr, std::time::Duration::from_millis(1500)).is_ok())

                .unwrap_or(false);

            let latency = if reachable { start.elapsed().as_millis() as u32 } else { 999 };

            DnsBenchmarkEntry {

                provider,

                ip,

                latency_ms: latency,

                reachable,

            }

        }));

    }

    let mut results: Vec<DnsBenchmarkEntry> = Vec::new();

    for handle in handles {

        if let Ok(entry) = handle.join() {

            results.push(entry);

        }

    }

    results.sort_by_key(|e| e.latency_ms);

    let fastest = results.iter().find(|e| e.reachable).unwrap_or(&results[0]);

    DnsBenchmarkOutput {

        fastest_provider: fastest.provider.clone(),

        fastest_ip: fastest.ip.clone(),

        fastest_latency: fastest.latency_ms,

        results,

    }

}

/// Windows Task Scheduler üzerinden yönetici haklarıyla otomatik başlatma kaydeder
/// tauri-plugin-autostart registry Run key kullanır — admin uygulamalar için UAC engeli var
/// Task Scheduler "Run with highest privileges" bu sorunu çözer
#[tauri::command]
fn set_autostart_admin(enable: bool) -> Result<(), String> {

    #[cfg(target_os = "windows")]
    {

        use std::os::windows::process::CommandExt;

        const CREATE_NO_WINDOW: u32 = 0x08000000;

        let exe_path = std::env::current_exe()

            .map_err(|e| format!("Exe yolu alınamadı: {}", e))?;

        let exe_str = exe_path.to_string_lossy();

        if enable {

            let xml = format!(

                r#"<?xml version="1.0" encoding="UTF-16"?>

<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">

  <Triggers><LogonTrigger><Enabled>true</Enabled></LogonTrigger></Triggers>

  <Principals><Principal id="Author"><LogonType>InteractiveToken</LogonType><RunLevel>HighestAvailable</RunLevel></Principal></Principals>

  <Settings><MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy><DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>

    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries><ExecutionTimeLimit>PT0S</ExecutionTimeLimit><Priority>7</Priority></Settings>

  <Actions><Exec><Command>{}</Command></Exec></Actions>

</Task>"#, exe_str);

            let tmp = std::env::temp_dir().join("docspi_task.xml");

            let utf16_bytes: Vec<u8> = xml.encode_utf16().flat_map(|c| c.to_le_bytes()).collect();

            let mut with_bom: Vec<u8> = vec![0xFF, 0xFE];

            with_bom.extend(utf16_bytes);

            std::fs::write(&tmp, with_bom).map_err(|e| format!("XML yazılamadı: {}", e))?;

            let out = std::process::Command::new("schtasks")

                .args(["/Create", "/TN", "DocsPI", "/XML", &tmp.to_string_lossy(), "/F"])

                .creation_flags(CREATE_NO_WINDOW)

                .output()

                .map_err(|e| format!("schtasks: {}", e))?;

            let _ = std::fs::remove_file(&tmp);

            if !out.status.success() {

                return Err(format!("Görev oluşturulamadı: {}", String::from_utf8_lossy(&out.stderr)));

            }

        } else {

            let _ = std::process::Command::new("schtasks")

                .args(["/Delete", "/TN", "DocsPI", "/F"])

                .creation_flags(CREATE_NO_WINDOW)

                .output();

        }

        Ok(())

    }

    #[cfg(not(target_os = "windows"))]
    {

        let exe_path = std::env::current_exe()

            .map_err(|e| format!("Exe yolu: {}", e))?;

        if enable {

            platform::get().autostart.enable_autostart(&exe_path.to_string_lossy())?;

        } else {

            platform::get().autostart.disable_autostart()?;

        }

        Ok(())

    }

}

#[tauri::command]
fn check_autostart_admin() -> bool {

    #[cfg(target_os = "windows")]
    {

        use std::os::windows::process::CommandExt;

        const CREATE_NO_WINDOW: u32 = 0x08000000;

        if let Ok(out) = std::process::Command::new("schtasks")

            .args(["/Query", "/TN", "DocsPI"])

            .creation_flags(CREATE_NO_WINDOW)

            .output()

        {

            return out.status.success();

        }

        false

    }

    #[cfg(not(target_os = "windows"))]
    {

        platform::get().autostart.is_autostart_enabled("DocsPI")

    }

}

#[tauri::command]
fn get_isp_info() -> platform::IspInfo {

    #[cfg(target_os = "windows")]
    {

        let mut name = "unknown".to_string();

        let mut connection_type = "unknown".to_string();

        let mut region = "unknown".to_string();

        let mut dns_servers: Vec<String> = Vec::new();

        use std::os::windows::process::CommandExt;

        const CREATE_NO_WINDOW: u32 = 0x08000000;

        if let Ok(output) = std::process::Command::new("ipconfig")

            .arg("/all")

            .creation_flags(CREATE_NO_WINDOW)

            .output()

        {

            let text = String::from_utf8_lossy(&output.stdout);

            let lower = text.to_lowercase();

            if lower.contains("turk telekom") || lower.contains("ttnet") || lower.contains("türk telekom") {

                name = "turktelekom".to_string();

            } else if lower.contains("vodafone") {

                name = "vodafone".to_string();

            } else if lower.contains("kablonet") {

                name = "kablonet".to_string();

            } else if lower.contains("superonline") {

                name = "superonline".to_string();

            } else if lower.contains("milenicom") {

                name = "milenicom".to_string();

            } else if lower.contains("turknet") || lower.contains("türknet") {

                name = "turknet".to_string();

            }

            for line in text.lines() {

                let trimmed = line.trim();

                let lc = trimmed.to_lowercase();

                if lc.starts_with("dns sunucular") || lc.starts_with("dns servers") {

                    if let Some(val) = trimmed.split(':').nth(1) {

                        let ip = val.trim().trim_matches(|c| c == ' ' || c == '(' || c == ')');

                        if !ip.is_empty() && !ip.contains(' ') && ip.contains('.') {

                            dns_servers.push(ip.to_string());

                        }

                    }

                }

            }

        }

        if let Ok(ps_out) = std::process::Command::new("powershell")

            .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command",

                "(Get-NetAdapter -Physical | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1).Name"])

            .creation_flags(CREATE_NO_WINDOW)

            .output()

        {

            let adapter_name = String::from_utf8_lossy(&ps_out.stdout).trim().to_lowercase();

            if adapter_name.contains("wi-fi") || adapter_name.contains("wireless") || adapter_name.contains("wlan") {

                connection_type = "wifi".to_string();

            } else if adapter_name.contains("ethernet") || adapter_name.contains("lan") {

                connection_type = "ethernet".to_string();

            } else if adapter_name.contains("wwan") || adapter_name.contains("mobile") || adapter_name.contains("lte") {

                connection_type = "mobile".to_string();

            }

        }

        if let Ok(ip_out) = std::process::Command::new("powershell")

            .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command",

                "(Invoke-WebRequest -Uri 'http://ip-api.com/json/?fields=country,regionName,city,isp' -UseBasicParsing -TimeoutSec 3).Content"])

            .creation_flags(CREATE_NO_WINDOW)

            .output()

        {

            let geo_txt = String::from_utf8_lossy(&ip_out.stdout);

            if let Ok(geo) = serde_json::from_str::<serde_json::Value>(&geo_txt) {

                if let Some(isp_str) = geo.get("isp").and_then(|v| v.as_str()) {

                    let isp_lower = isp_str.to_lowercase();

                    if !isp_lower.contains("not available") && !isp_str.is_empty() {

                        name = isp_lower.replace([' ', '.', ','], "");

                        if name.contains("turktelekom") { name = "turktelekom".into(); }

                        else if name.contains("superonline") { name = "superonline".into(); }

                        else if name.contains("vodafone") { name = "vodafone".into(); }

                        else if name.contains("turknet") { name = "turknet".into(); }

                        else if name.contains("kablonet") { name = "kablonet".into(); }

                        else if name.contains("milenicom") { name = "milenicom".into(); }

                    }

                }

                if let Some(city) = geo.get("city").and_then(|v| v.as_str()) {

                    region = city.to_string();

                } else if let Some(rn) = geo.get("regionName").and_then(|v| v.as_str()) {

                    region = rn.to_string();

                }

            }

        }

        let display_name = match name.as_str() {

            "turktelekom" => "Türk Telekom",

            "superonline" => "Superonline",

            "vodafone" => "Vodafone",

            "turknet" => "Türknet",

            "kablonet" => "Kablonet",

            "milenicom" => "Milenicom",

            _ => "Bilinmeyen ISS",

        };

        platform::IspInfo { name, display_name: display_name.to_string(), connection_type, region, dns_servers }

    }

    #[cfg(not(target_os = "windows"))]
    {

        platform::get().network.get_isp_info()

    }

}

#[derive(serde::Serialize)]
struct DpiProbe {

    dns: String,

    label: String,

    latency_ms: u32,

    reachable: bool,

}

#[derive(serde::Serialize)]
struct DpiDetectionResult {

    probes: Vec<DpiProbe>,

    recommended_strategy: String,

    severity: String,

    reason: String,

}

#[tauri::command]
fn detect_dpi() -> DpiDetectionResult {

    let probes = [

        ("1.1.1.1", "Cloudflare"),

        ("8.8.8.8", "Google"),

        ("9.9.9.9", "Quad9"),

        ("94.140.14.14", "AdGuard"),

        ("208.67.222.222", "OpenDNS"),

    ];

    let mut results: Vec<DpiProbe> = Vec::new();

    let mut reachable_count = 0;

    for (ip, label) in &probes {

        let addr_str = format!("{}:53", ip);

        let start = std::time::Instant::now();

        let reachable = if let Ok(addr) = addr_str.parse::<std::net::SocketAddr>() {

            std::net::TcpStream::connect_timeout(&addr, std::time::Duration::from_millis(1500)).is_ok()

        } else {

            false

        };

        let latency = if reachable { start.elapsed().as_millis() as u32 } else { 999 };

        if reachable && latency < 999 {

            reachable_count += 1;

        }

        results.push(DpiProbe {

            dns: ip.to_string(),

            label: label.to_string(),

            latency_ms: latency,

            reachable,

        });

    }

    let (recommended_strategy, severity, reason) = match reachable_count {

        5 => ("0".to_string(), "mild".to_string(), "Tüm DNS sunucularına erişilebiliyor. Hafif DPI — Turbo mod yeterli.".to_string()),

        3..=4 => ("1".to_string(), "moderate".to_string(), "Bazı DNS sunucuları engellenmiş. Orta DPI — Dengeli mod önerilir.".to_string()),

        _ => ("2".to_string(), "aggressive".to_string(), "Çoğu DNS sunucu engellenmiş. Ağır DPI — Güçlü Mod gerekli.".to_string()),

    };

    DpiDetectionResult {

        probes: results,

        recommended_strategy,

        severity,

        reason,

    }

}

#[derive(serde::Serialize)]
struct AutoConnectConfig {

    strategy: String,

    dns: String,

    fallback_dns_chain: Vec<String>,

    network_mode: String,

    isp: platform::IspInfo,

    dpi: DpiDetectionResult,

}

#[tauri::command]
fn auto_connect_config() -> AutoConnectConfig {

    let isp = get_isp_info();

    let dpi = detect_dpi();

    let (dns, fallback_dns_chain) = match isp.name.as_str() {

        "turktelekom" => ("cloudflare", vec!["cloudflare".into(), "quad9".into(), "google".into()]),

        "superonline" => ("google", vec!["google".into(), "cloudflare".into(), "quad9".into()]),

        "vodafone" => ("cloudflare", vec!["cloudflare".into(), "quad9".into(), "google".into()]),

        "turknet" => ("cloudflare", vec!["cloudflare".into(), "quad9".into(), "google".into()]),

        "kablonet" => ("cloudflare", vec!["cloudflare".into(), "google".into(), "quad9".into()]),

        "milenicom" => ("cloudflare", vec!["cloudflare".into(), "quad9".into(), "google".into()]),

        _ => ("cloudflare", vec!["cloudflare".into(), "quad9".into(), "google".into()]),

    };

    let network_mode = "smooth";

    AutoConnectConfig {

        strategy: dpi.recommended_strategy.clone(),

        dns: dns.to_string(),

        fallback_dns_chain,

        network_mode: network_mode.to_string(),

        isp,

        dpi,

    }

}

#[tauri::command]
fn get_isp_name() -> String {

    platform::get().network.get_isp_info().name

}

/// Proxy port'una TCP bağlantı süresi ölçer (ms cinsinden ping)
#[tauri::command]
fn get_ping(host: String, port: u16) -> u32 {

    const ALLOWED: &[&str] = &["1.1.1.1", "8.8.8.8", "9.9.9.9", "94.140.14.14", "208.67.222.222"];

    if host.is_empty() || !ALLOWED.contains(&host.as_str()) {

        return 999;

    }

    let addr_str = format!("{}:{}", host, port);

    let Ok(addr) = addr_str.parse::<std::net::SocketAddr>() else {

        return 999;

    };

    let start = std::time::Instant::now();

    match std::net::TcpStream::connect_timeout(&addr, Duration::from_millis(2000)) {

        Ok(_) => start.elapsed().as_millis() as u32,

        Err(_) => 999,

    }

}

#[tauri::command]
fn startup_proxy_cleanup() -> Result<bool, String> {

    let sentinel = sentinel_path();

    if sentinel.exists() {

        eprintln!("[STARTUP] Dirty shutdown detected — sentinel file found");

        platform::get().proxy.clear_proxy()?;

        notify_proxy_change();

        manage_firewall_rules(false, 0, 0);

        let _ = std::fs::remove_file(&sentinel);

        let _ = kill_zombie_divert();

        return Ok(true);

    }

    let _ = kill_zombie_divert();

    Ok(false)

}

#[tauri::command]
fn check_driver() -> bool {

    platform::get().divert.find_engine("docspi-divert").is_some()

}

#[tauri::command]
fn get_driver_info() -> serde_json::Value {

    let installed = check_driver();

    let version = if installed { "2.2.2" } else { "N/A" };

    let driver_type = if cfg!(target_os = "windows") {
        "WinDivert"
    } else if cfg!(target_os = "linux") {
        "nfqueue/raw socket"
    } else {
        "VpnService"
    };

    serde_json::json!({

        "installed": installed,

        "version": version,

        "minimum_required": "2.2.0",

        "type": driver_type

    })

}

#[tauri::command]
fn install_driver(app: tauri::AppHandle) -> Result<(), String> {

    #[cfg(target_os = "windows")]
    {

        let resource_path = app

            .path()

            .resource_dir()

            .map_err(|e| e.to_string())?

            .join("binaries/npcap-installer.exe");

        if !resource_path.exists() {

            return Err("Sürücü dosyası bulunamadı. Lütfen uygulamayı yeniden yükleyin.".into());

        }

        let status = std::process::Command::new(resource_path)

            .status()

            .map_err(|e| e.to_string())?;

        if status.success() {

            Ok(())

        } else {

            Err("Kurulum kullanıcı tarafından iptal edildi veya başarısız oldu.".into())

        }

    }

    #[cfg(not(target_os = "windows"))]
    {

        let _ = app;

        Err("WinDivert/Npcap sadece Windows'ta desteklenir.".into())

    }

}

#[derive(serde::Serialize)]
struct SpeedTestResult {

    download_speed_mbps: f64,

    latency_ms: u32,

    target: String,

}

#[tauri::command]
async fn speed_test() -> SpeedTestResult {

    let target = "1.1.1.1";

    let port = 443;

    let start = std::time::Instant::now();

    let addr_str = format!("{}:{}", target, port);

    let mut latency_ms = 999u32;

    if let Ok(addr) = addr_str.parse::<std::net::SocketAddr>() {
        if let Ok(mut stream) = std::net::TcpStream::connect_timeout(&addr, std::time::Duration::from_secs(3)) {
            latency_ms = start.elapsed().as_millis() as u32;

            let _ = stream.set_read_timeout(Some(std::time::Duration::from_secs(2)));
            let _ = stream.set_write_timeout(Some(std::time::Duration::from_secs(2)));

            let _ = stream.write_all(b"GET / HTTP/1.0\r\nHost: 1.1.1.1\r\nConnection: close\r\n\r\n");

            let mut buf = vec![0u8; 65536];

            let download_start = std::time::Instant::now();

            let mut total_bytes = 0u64;

            loop {

                match stream.read(&mut buf) {

                    Ok(0) => break,

                    Ok(n) => total_bytes += n as u64,

                    Err(_) => break,

                }

                if download_start.elapsed().as_secs() > 2 {

                    break;

                }

            }

            let elapsed_s = download_start.elapsed().as_secs_f64().max(0.1);

            let speed_mbps = (total_bytes as f64 * 8.0) / (elapsed_s * 1_000_000.0);

            return SpeedTestResult {

                download_speed_mbps: (speed_mbps * 10.0).round() / 10.0,

                latency_ms,

                target: format!("{}:{}", target, port),

            };

        }

    }

    SpeedTestResult {
        download_speed_mbps: 0.0,
        latency_ms,
        target: format!("{}:{}", target, port),
    }

}

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {

    perform_app_exit(&app);

}

// ---------------------------------------------------------------------------
// Mobile VPN commands (Android VpnService)
// ---------------------------------------------------------------------------

#[tauri::command]
fn start_vpn(config: mobile::VpnConfig) -> Result<(), String> {
    mobile::start_vpn_impl(config)
}

#[tauri::command]
fn stop_vpn() -> Result<(), String> {
    mobile::stop_vpn_impl()
}

#[tauri::command]
fn vpn_status() -> mobile::VpnStatus {
    mobile::vpn_status_impl()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    platform::init();

    platform::get().instance.ensure_single_instance("DocsPI");

    let builder = tauri::Builder::default()

        .manage(PacServerState::default())

        .plugin(tauri_plugin_dialog::init())

        .plugin(tauri_plugin_notification::init())

        .setup(|app| {

            #[cfg(desktop)]
            {

                use tauri::menu::{Menu, MenuItem};

                use tauri::tray::TrayIconBuilder;

                use tauri::Manager;

                let show_i = MenuItem::with_id(app, "show", "Uygulamayı Aç", true, None::<&str>)?;

                use tauri::menu::Submenu;

                let turbo_i = MenuItem::with_id(app, "mode_turbo", "Turbo Mod", true, None::<&str>)?;

                let balanced_i = MenuItem::with_id(app, "mode_balanced", "Dengeli Mod", true, None::<&str>)?;

                let strong_i = MenuItem::with_id(app, "mode_strong", "Güçlü Mod", true, None::<&str>)?;

                let mode_submenu = Submenu::with_items(app, "Mod Değiştir", true, &[&turbo_i, &balanced_i, &strong_i])?;

                let support_i =

                    MenuItem::with_id(app, "support", "Destekle", true, None::<&str>)?;

                let quit_i = MenuItem::with_id(app, "quit", "Çıkış", true, None::<&str>)?;

                use tauri::menu::PredefinedMenuItem;

                let s1 = PredefinedMenuItem::separator(app)?;

                let s2 = PredefinedMenuItem::separator(app)?;

                let menu = Menu::with_items(app, &[&show_i, &s1, &mode_submenu, &support_i, &s2, &quit_i])?;

                let is_showing = Arc::new(AtomicBool::new(false));

                let _tray = TrayIconBuilder::with_id("tray")

                    .menu(&menu)

                    .show_menu_on_left_click(false) // ✅ Sol tıkta menü açılmasın, sadece sağ tıkta

                    .icon(app.default_window_icon().cloned().unwrap_or_else(|| {

                        eprintln!("[WARN] app icon missing, using default");

                        tauri::image::Image::new(&[], 1, 1)

                    }))

                    .tooltip("DocsPI - Kapalı")

                    .on_menu_event(|app, event| match event.id.as_ref() {

                        "quit" => {

                            if let Some(window) = app.get_webview_window("main") {

                                let _ = window.unminimize();

                                let _ = window.show();

                                let _ = window.set_focus(); // ✅ Pencereyi kapatmadan önce onay kutusu için öne getir!

                                let _ = window.emit("tray_quit", ());

                                let _ = window.close();

                            } else {

                                perform_app_exit(app);

                            }

                        }

                        "show" => {

                            if let Some(window) = app.get_webview_window("main") {

                                let _ = window.unminimize();

                                let _ = window.show();

                                let _ = window.set_focus();

                            }

                        }

                        "support" => {

                            use tauri_plugin_opener::OpenerExt;

                            app.opener()

                                .open_url(SUPPORT_URL, None::<&str>)

                                .unwrap_or(());

                        }

                        "mode_turbo" => {

                            let _ = app.emit("change_mode", "0");

                        }

                        "mode_balanced" => {

                            let _ = app.emit("change_mode", "1");

                        }

                        "mode_strong" => {

                            let _ = app.emit("change_mode", "2");

                        }

                        _ => {}

                    })

                    .on_tray_icon_event({

                        let is_showing = Arc::clone(&is_showing);

                        move |tray, event| {

                            use tauri::tray::{MouseButton, TrayIconEvent};

                            match event {

                                TrayIconEvent::Click {

                                    button: MouseButton::Left,

                                    ..

                                } => {

                                    if is_showing.load(Ordering::Relaxed) {

                                        return;

                                    }

                                    is_showing.store(true, Ordering::Relaxed);

                                    let app = tray.app_handle();

                                    if let Some(window) = app.get_webview_window("main") {

                                        let _ = window.unminimize();

                                        let _ = window.show();

                                        let _ = window.set_focus();

                                    }

                                    let is_showing_clone = Arc::clone(&is_showing);

                                    std::thread::spawn(move || {

                                        std::thread::sleep(std::time::Duration::from_millis(300));

                                        is_showing_clone.store(false, Ordering::Relaxed);

                                    });

                                }

                                TrayIconEvent::DoubleClick { .. } => {

                                    let app = tray.app_handle();

                                    if let Some(window) = app.get_webview_window("main") {

                                        let _ = window.unminimize();

                                        let _ = window.show();

                                        let _ = window.set_focus();

                                    }

                                }

                                // Sağ tık: menü otomatik açılır

                                _ => {}

                            }

                        }

                    })

                    .build(app)?;

                if let Some(window) = app.get_webview_window("main") {

                    let app_handle = app.handle().clone();

                    window.on_window_event(move |event| {

                        if let tauri::WindowEvent::Destroyed = event {

                            let _ = clear_system_proxy();

                            if let Some(pac_state) = app_handle.try_state::<PacServerState>() {

                                if let Ok(mut body) = pac_state.pac_body.lock() {

                                    *body = make_pac_direct_body();

                                }

                                if let Ok(mut cache) = pac_state.pac_cache.lock() {

                                    cache.body_hash = 0;

                                    cache.pac_response.clear();

                                }

                            }

                        }

                    });

                }

            }

            Ok(())

        });

        #[cfg(not(target_os = "android"))]
        let builder = builder.plugin(tauri_plugin_autostart::Builder::new().build());

        builder
        .plugin(tauri_plugin_process::init())

        .plugin(tauri_plugin_opener::init())

        .plugin(tauri_plugin_shell::init())

        .plugin(tauri_plugin_clipboard_manager::init())

        .invoke_handler(tauri::generate_handler![

            clear_system_proxy,

            set_system_proxy,

            update_tray_tooltip,

            check_admin,

            check_port_open,

            test_bypass_connection,

            get_sidecar_config,

            start_pac_server,

            stop_pac_server,

            kill_zombie_sidecar,

            kill_zombie_divert,

            get_divert_log,

            check_dns_latency,

            save_sidecar_pid,

            startup_proxy_cleanup,

            check_driver,

            get_driver_info,

            install_driver,

            quit_app,

            get_isp_name,

            get_isp_info,

            detect_dpi,

            auto_connect_config,

            dns_benchmark,

            speed_test,

            get_ping,

            set_autostart_admin,

            check_autostart_admin,

            start_divert_engine,
            stop_divert_engine,
            check_divert_running,
            start_vpn,
            stop_vpn,
            vpn_status
        ])

        .build(tauri::generate_context!())

        .unwrap_or_else(|e| {

            eprintln!("[FATAL] error while building tauri application: {}", e);

            std::process::exit(1);

        })

        .run(|app_handle, event| {

            if let tauri::RunEvent::ExitRequested { .. } = event {

                let _ = clear_system_proxy();

                if let Some(state) = app_handle.try_state::<PacServerState>() {

                    // DIRECT'e geç ama uzun bekleme

                    if let Ok(mut body) = state.pac_body.lock() {

                        *body = make_pac_direct_body();

                    }

                    if let Ok(mut cache) = state.pac_cache.lock() {

                        cache.body_hash = 0;

                        cache.pac_response.clear();

                    }

                    // 500ms yeterli — cihazlar genelde 200ms içinde PAC'i çeker

                    std::thread::sleep(Duration::from_millis(500));

                    state.shutdown.store(true, Ordering::Relaxed);

                    if let Ok(mut guard) = state.join_handle.lock() {

                        let _ = guard.take();

                    }

                    #[cfg(target_os = "windows")]
                    manage_firewall_rules(false, 0, 0);

                }

            }

        });

}

// fix(network): handle IPv6 loopback addresses in LAN detection

// feat(divert): add QUIC protocol blocking for aggressive DPI

// ui(icons): add custom tray icons for connected-disconnected states

// docs(contributing): add code style guide and PR template

// fix(security): sanitize PAC file input to prevent injection

// chore(deps): update React to v19.1.0

// refactor(error): implement structured error types in Rust

// fix(memory): fix memory leak in PAC server connection handler

// chore(release): add GitHub Release automation with changelog

// refactor(platform): add platform-specific build configurations

// feat(isp): add Superonline ISP detection and bypass profiles

// feat(dns): add custom DNS server configuration

// refactor(constants): extract all magic numbers into named constants

// test(unit): add tests for DNS benchmark functionality

// docs(readme): add installation guide with screenshots

// refactor(hooks): consolidate all API calls into useApi hook

// feat(dns): add DNS-over-TLS support

// feat(pac): add bypass for Microsoft Store downloads