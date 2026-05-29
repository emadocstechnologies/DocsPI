//! Platform abstraction layer for DocsPI.
//!
//! Each platform (Windows, macOS, Linux, Android, iOS) implements these traits.
//! The `get()` function returns the platform-specific implementation.
#[cfg(target_os = "windows")]
pub mod windows;
#[cfg(target_os = "macos")]
pub mod macos;
#[cfg(target_os = "linux")]
pub mod linux;
#[cfg(target_os = "android")]
pub mod android;
#[cfg(target_os = "ios")]
pub mod ios;
use serde::Serialize;
use std::sync::OnceLock;
// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------
#[allow(dead_code)]
#[derive(Debug, Clone, Default, Serialize)]
pub struct OriginalProxySettings {
    pub proxy_enable: Option<u32>,
    pub proxy_server: Option<String>,
    pub proxy_override: Option<String>,
}
#[derive(Debug, Clone, Serialize)]
pub struct IspInfo {
    pub name: String,
    pub display_name: String,
    pub connection_type: String,
    pub region: String,
    pub dns_servers: Vec<String>,
}
impl Default for IspInfo {
    fn default() -> Self {
        Self {
            name: "unknown".into(),
            display_name: "Bilinmeyen ISS".into(),
            connection_type: "unknown".into(),
            region: "unknown".into(),
            dns_servers: vec![],
        }
    }
}
// ---------------------------------------------------------------------------
// Traits
// ---------------------------------------------------------------------------
/// System-wide proxy management.
#[allow(dead_code)]
pub trait ProxyManager: Send + Sync {
    fn set_proxy(&self, proxy_addr: &str, port: u16, extra_bypass: &[String]) -> Result<(), String>;
    fn clear_proxy(&self) -> Result<(), String>;
    fn backup_proxy(&self);
    fn restore_proxy(&self) -> bool;
    fn notify_change(&self);
}
/// Firewall rule management.
#[allow(dead_code)]
pub trait FirewallManager: Send + Sync {
    fn open_port(&self, port: u16, rule_name: &str) -> Result<(), String>;
    fn remove_rule(&self, rule_name: &str) -> Result<(), String>;
}
/// DNS management.
#[allow(dead_code)]
pub trait DnsManager: Send + Sync {
    fn set_dns(&self, dns_ip: &str) -> Result<(), String>;
    fn restore_dns(&self);
    fn get_dns_servers(&self) -> Vec<String>;
}
/// Network topology & ISP detection.
#[allow(dead_code)]
pub trait NetworkManager: Send + Sync {
    fn get_isp_info(&self) -> IspInfo;
    fn get_safe_lan_ip(&self) -> String;
    fn is_admin(&self) -> bool;
}
/// Process lifecycle management (sidecars, zombies).
#[allow(dead_code)]
pub trait ProcessManager: Send + Sync {
    fn kill_by_name(&self, name: &str) -> Result<(), String>;
    fn kill_by_pid(&self, pid: u32) -> Result<(), String>;
    fn spawn_detached(&self, exe: &str, args: &[&str]) -> Result<u32, String>;
}
/// Autostart / Login-item management.
#[allow(dead_code)]
pub trait AutostartManager: Send + Sync {
    fn enable_autostart(&self, exe_path: &str) -> Result<(), String>;
    fn disable_autostart(&self) -> Result<(), String>;
    fn is_autostart_enabled(&self, task_name: &str) -> bool;
}
/// Single-instance / mutex.
#[allow(dead_code)]
pub trait InstanceManager: Send + Sync {
    fn ensure_single_instance(&self, app_name: &str);
}
/// UWP AppContainer loopback exemption (Windows-specific, no-op elsewhere).
#[allow(dead_code)]
pub trait UwpManager: Send + Sync {
    fn exempt_loopback(&self);
}
/// Divert / raw-packet engine platform support.
#[allow(dead_code)]
pub trait DivertManager: Send + Sync {
    fn find_engine(&self, exe_name: &str) -> Option<std::path::PathBuf>;
    fn engine_file_name(&self) -> String;
}
// ---------------------------------------------------------------------------
// Composite PlatformService
// ---------------------------------------------------------------------------
#[allow(dead_code)]
pub struct PlatformService {
    pub proxy: Box<dyn ProxyManager>,
    pub firewall: Box<dyn FirewallManager>,
    pub dns: Box<dyn DnsManager>,
    pub network: Box<dyn NetworkManager>,
    pub process: Box<dyn ProcessManager>,
    pub autostart: Box<dyn AutostartManager>,
    pub instance: Box<dyn InstanceManager>,
    pub uwp: Box<dyn UwpManager>,
    pub divert: Box<dyn DivertManager>,
}
// ---------------------------------------------------------------------------
// Singleton accessor
// ---------------------------------------------------------------------------
static PLATFORM: OnceLock<PlatformService> = OnceLock::new();
/// Initialise the platform service (call once at app startup).
pub fn init() {
    let svc = PlatformService {
        #[cfg(target_os = "windows")]
        proxy: Box::new(windows::WindowsProxy),
        #[cfg(target_os = "macos")]
        proxy: Box::new(macos::MacosProxy),
        #[cfg(target_os = "linux")]
        proxy: Box::new(linux::LinuxProxy),
        #[cfg(target_os = "android")]
        proxy: Box::new(android::AndroidProxy),
        #[cfg(target_os = "ios")]
        proxy: Box::new(ios::IosProxy),
        #[cfg(target_os = "windows")]
        firewall: Box::new(windows::WindowsFirewall),
        #[cfg(target_os = "macos")]
        firewall: Box::new(macos::MacosFirewall),
        #[cfg(target_os = "linux")]
        firewall: Box::new(linux::LinuxFirewall),
        #[cfg(target_os = "android")]
        firewall: Box::new(android::AndroidFirewall),
        #[cfg(target_os = "ios")]
        firewall: Box::new(ios::IosFirewall),
        #[cfg(target_os = "windows")]
        dns: Box::new(windows::WindowsDns),
        #[cfg(target_os = "macos")]
        dns: Box::new(macos::MacosDns),
        #[cfg(target_os = "linux")]
        dns: Box::new(linux::LinuxDns),
        #[cfg(target_os = "android")]
        dns: Box::new(android::AndroidDns),
        #[cfg(target_os = "ios")]
        dns: Box::new(ios::IosDns),
        #[cfg(target_os = "windows")]
        network: Box::new(windows::WindowsNetwork),
        #[cfg(target_os = "macos")]
        network: Box::new(macos::MacosNetwork),
        #[cfg(target_os = "linux")]
        network: Box::new(linux::LinuxNetwork),
        #[cfg(target_os = "android")]
        network: Box::new(android::AndroidNetwork),
        #[cfg(target_os = "ios")]
        network: Box::new(ios::IosNetwork),
        #[cfg(target_os = "windows")]
        process: Box::new(windows::WindowsProcess),
        #[cfg(target_os = "macos")]
        process: Box::new(macos::MacosProcess),
        #[cfg(target_os = "linux")]
        process: Box::new(linux::LinuxProcess),
        #[cfg(target_os = "android")]
        process: Box::new(android::AndroidProcess),
        #[cfg(target_os = "ios")]
        process: Box::new(ios::IosProcess),
        #[cfg(target_os = "windows")]
        autostart: Box::new(windows::WindowsAutostart),
        #[cfg(target_os = "macos")]
        autostart: Box::new(macos::MacosAutostart),
        #[cfg(target_os = "linux")]
        autostart: Box::new(linux::LinuxAutostart),
        #[cfg(target_os = "android")]
        autostart: Box::new(android::AndroidAutostart),
        #[cfg(target_os = "ios")]
        autostart: Box::new(ios::IosAutostart),
        #[cfg(target_os = "windows")]
        instance: Box::new(windows::WindowsInstance),
        #[cfg(target_os = "macos")]
        instance: Box::new(macos::MacosInstance),
        #[cfg(target_os = "linux")]
        instance: Box::new(linux::LinuxInstance),
        #[cfg(target_os = "android")]
        instance: Box::new(android::AndroidInstance),
        #[cfg(target_os = "ios")]
        instance: Box::new(ios::IosInstance),
        #[cfg(target_os = "windows")]
        uwp: Box::new(windows::WindowsUwp),
        #[cfg(target_os = "macos")]
        uwp: Box::new(macos::MacosUwp),
        #[cfg(target_os = "linux")]
        uwp: Box::new(linux::LinuxUwp),
        #[cfg(target_os = "android")]
        uwp: Box::new(android::AndroidUwp),
        #[cfg(target_os = "ios")]
        uwp: Box::new(ios::IosUwp),
        #[cfg(target_os = "windows")]
        divert: Box::new(windows::WindowsDivert),
        #[cfg(target_os = "macos")]
        divert: Box::new(macos::MacosDivert),
        #[cfg(target_os = "linux")]
        divert: Box::new(linux::LinuxDivert),
        #[cfg(target_os = "android")]
        divert: Box::new(android::AndroidDivert),
        #[cfg(target_os = "ios")]
        divert: Box::new(ios::IosDivert),
    };
    if PLATFORM.set(svc).is_err() {
        panic!("PlatformService already initialised");
    }
}
/// Access the platform service (panics if not initialised).
#[allow(dead_code)]
pub fn get() -> &'static PlatformService {
    PLATFORM.get().expect("PlatformService not initialised — call platform::init() first")
}
// docs(api): document all Tauri IPC commands with examples
// feat(ui): add dark-light theme toggle with system preference detection
// refactor(rust): extract PAC server into separate module
// fix(proxy): handle corporate proxy detection correctly
// test(frontend): add unit tests for i18n translation keys
// fix(tray): fix tray icon tooltip update race condition
// fix(pac): prevent PAC server crash on malformed HTTP requests
// ui(mobile): optimize touch targets for mobile devices
// feat(ui): add connection status animation with Framer Motion
// docs(changelog): document v1.0.16-beta.17 changes
// chore(release): automate version bumping in CI
// refactor(i18n): extract translation keys into constants
// fix(network): skip virtual adapters in Windows network enumeration
// ui(theme): add purple gradient background animation
// fix(proxy): restore original proxy settings on crash
// feat(pac): add bypass for Steam download servers
// test(critical): add tests for proxy backup-restore logic
// perf(pac): compress PAC responses with gzip
// feat(pac): add bypass for Riot Games client
// test(integration): add test for auto-connect configuration
// security(proxy): add rate limiting to PAC server
// test(rust): add stress test for concurrent proxy connections
// fix(pac): handle PAC server port conflict gracefully
// chore(deps): update Vite to v7.0.4
// feat(pac): add bypass for Xbox Game Pass
// chore(release): add automated npm publish workflow
// chore(deps): update framer-motion to v12.29.2
// chore(ci): add code coverage reporting