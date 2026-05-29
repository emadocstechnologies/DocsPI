//! Windows implementation of the DocsPI platform abstraction layer.
//! Ported from the original `lib.rs` Windows-specific code.

#![allow(non_snake_case)]

use super::*;
use std::net::IpAddr;
use std::os::windows::process::CommandExt;
use std::sync::{Mutex, OnceLock};

const CREATE_NO_WINDOW: u32 = 0x08000000;

// ---------------------------------------------------------------------------
// Proxy backup store
// ---------------------------------------------------------------------------

fn proxy_backup() -> &'static Mutex<Option<OriginalProxySettings>> {
    static STORE: OnceLock<Mutex<Option<OriginalProxySettings>>> = OnceLock::new();
    STORE.get_or_init(|| Mutex::new(None))
}

fn proxy_lock() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

fn acquire_proxy_lock() -> std::sync::MutexGuard<'static, ()> {
    match proxy_lock().lock() {
        Ok(g) => g,
        Err(poisoned) => {
            eprintln!("[WARN] Proxy lock poisoned, recovering");
            poisoned.into_inner()
        }
    }
}

// ---------------------------------------------------------------------------
// Windows Registry helpers
// ---------------------------------------------------------------------------

mod registry {
    use winreg::enums::*;
    use winreg::RegKey;

    const INTERNET_SETTINGS: &str = r"Software\Microsoft\Windows\CurrentVersion\Internet Settings";

    pub fn read_value_string(name: &str) -> Option<String> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let key = hkcu.open_subkey(INTERNET_SETTINGS).ok()?;
        key.get_value(name).ok()
    }

    pub fn read_value_dword(name: &str) -> Option<u32> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let key = hkcu.open_subkey(INTERNET_SETTINGS).ok()?;
        key.get_value(name).ok()
    }

    pub fn set_proxy(proxy_addr: &str, port: u16, extra_bypass: &[String]) -> Result<(), String> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let (key, _) = hkcu
            .create_subkey(INTERNET_SETTINGS)
            .map_err(|e| format!("Registry açılamadı: {}", e))?;

        key.set_value("ProxyServer", &format!("{}:{}", proxy_addr, port))
            .map_err(|e| format!("ProxyServer: {}", e))?;
        key.set_value("ProxyEnable", &1u32)
            .map_err(|e| format!("ProxyEnable: {}", e))?;

        let mut base_bypass: Vec<&str> = vec![
            "<local>",
            "10.*", "172.16.*", "172.17.*", "172.18.*", "172.19.*",
            "172.20.*", "172.21.*", "172.22.*", "172.23.*", "172.24.*",
            "172.25.*", "172.26.*", "172.27.*", "172.28.*", "172.29.*",
            "172.30.*", "172.31.*", "192.168.*",
            // NCSI
            "*.msftconnecttest.com", "*.msftncsi.com", "dns.msn.com", "ipv6.msftconnecttest.com",
            // Android/iOS connectivity
            "connectivitycheck.gstatic.com", "connectivitycheck.android.com",
            "clients3.google.com", "play.googleapis.com",
            "captive.apple.com", "gsp1.apple.com", "connectivitycheck.samsung.com",
            // Windows Update
            "*.windowsupdate.com", "*.delivery.mp.microsoft.com",
            // Steam
            "*.steamcontent.com", "*.steamstatic.com", "clientconfig.akamai.steamstatic.com", "*.cm.steampowered.com",
            // Epic
            "*.epicgames.com", "*.unrealengine.com", "download.epicgames.com", "launcher-public-service-prod06.ol.epicgames.com",
            // Riot
            "*.riotgames.com", "*.leagueoflegends.com", "riotgames-update.akamaized.net",
            // Discord
            "discord.com", "*.discord.com", "*.discordapp.net", "*.discord.gg", "*.discord.media",
            "gateway.discord.gg", "discord-attachments-*.s3.amazonaws.com",
            // EA/Origin
            "*.ea.com", "*.origin.com",
            // Blizzard
            "*.blizzard.com", "*.battle.net", "blzddist1-a.akamaihd.net",
            // Ubisoft
            "*.ubisoft.com", "*.ubi.com",
            // Xbox
            "*.xboxlive.com", "*.xbox.com", "*.microsoft.com",
            // CDN
            "*.cachefly.net",
        ];
        let extra_refs: Vec<&str> = extra_bypass.iter().map(|s| s.as_str()).collect();
        base_bypass.extend(extra_refs);
        let proxy_override = base_bypass.join(";");
        key.set_value("ProxyOverride", &proxy_override)
            .map_err(|e| format!("ProxyOverride: {}", e))?;
        Ok(())
    }

    pub fn clear_proxy() -> Result<(), String> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let (key, _) = hkcu
            .create_subkey(INTERNET_SETTINGS)
            .map_err(|e| format!("Registry açılamadı: {}", e))?;
        key.set_value("ProxyEnable", &0u32)
            .map_err(|e| format!("ProxyEnable: {}", e))?;
        let _ = key.delete_value("ProxyServer");
        let _ = key.delete_value("ProxyOverride");
        let _ = key.delete_value("AutoConfigURL");
        Ok(())
    }

    pub fn restore_proxy(server: &str, enable: u32, override_val: Option<&str>) -> Result<(), String> {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let (key, _) = hkcu
            .create_subkey(INTERNET_SETTINGS)
            .map_err(|e| format!("Registry açılamadı: {}", e))?;
        key.set_value("ProxyServer", &server.to_string())
            .map_err(|e| format!("ProxyServer: {}", e))?;
        key.set_value("ProxyEnable", &enable)
            .map_err(|e| format!("ProxyEnable: {}", e))?;
        if let Some(ov) = override_val {
            key.set_value("ProxyOverride", &ov.to_string())
                .map_err(|e| format!("ProxyOverride: {}", e))?;
        }
        Ok(())
    }

    pub fn can_access() -> bool {
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        hkcu.open_subkey(INTERNET_SETTINGS).is_ok()
    }
}

// ---------------------------------------------------------------------------
// ProxyManager
// ---------------------------------------------------------------------------

pub struct WindowsProxy;

impl ProxyManager for WindowsProxy {
    fn set_proxy(&self, proxy_addr: &str, port: u16, extra_bypass: &[String]) -> Result<(), String> {
        let _guard = acquire_proxy_lock();
        if port < 1024 {
            return Err("Geçersiz port (1024-65535)".to_string());
        }
        if !registry::can_access() {
            return Err("Registry erişim izni yok".to_string());
        }
        self.backup_proxy();
        registry::set_proxy(proxy_addr, port, extra_bypass)?;
        self.notify_change();
        Ok(())
    }

    fn clear_proxy(&self) -> Result<(), String> {
        let _guard = acquire_proxy_lock();
        let has_original = self.restore_proxy();
        if !has_original {
            let _ = registry::clear_proxy();
        }
        let _ = std::process::Command::new("ipconfig")
            .arg("/flushdns")
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn();
        self.notify_change();
        Ok(())
    }

    fn backup_proxy(&self) {
        let settings = OriginalProxySettings {
            proxy_enable: registry::read_value_dword("ProxyEnable"),
            proxy_server: registry::read_value_string("ProxyServer"),
            proxy_override: registry::read_value_string("ProxyOverride"),
        };
        if let Ok(mut guard) = proxy_backup().lock() {
            if guard.is_none() {
                *guard = Some(settings);
            }
        }
    }

    fn restore_proxy(&self) -> bool {
        let original = match proxy_backup().lock() {
            Ok(g) => g.clone(),
            Err(poisoned) => poisoned.into_inner().clone(),
        };
        if let Some(orig) = original {
            if let Some(ref server) = orig.proxy_server {
                if !server.is_empty() && !server.starts_with("127.0.0.1:") {
                    let enable_val = orig.proxy_enable.unwrap_or(0);
                    let _ = registry::restore_proxy(server, enable_val, orig.proxy_override.as_deref());
                    return true;
                }
            }
        }
        false
    }

    fn notify_change(&self) {
        use std::ptr::null_mut;
        use winapi::um::wininet::{InternetSetOptionW, INTERNET_OPTION_REFRESH, INTERNET_OPTION_SETTINGS_CHANGED};
        unsafe {
            InternetSetOptionW(null_mut(), INTERNET_OPTION_SETTINGS_CHANGED, null_mut(), 0);
            InternetSetOptionW(null_mut(), INTERNET_OPTION_REFRESH, null_mut(), 0);
        }
    }
}

// ---------------------------------------------------------------------------
// FirewallManager
// ---------------------------------------------------------------------------

pub struct WindowsFirewall;

impl FirewallManager for WindowsFirewall {
    fn open_port(&self, port: u16, rule_name: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — firewall kuralı eklenemiyor".into());
        }
        let _ = std::process::Command::new("netsh")
            .args(&["advfirewall", "firewall", "add", "rule",
                &format!("name={}", rule_name), "dir=in", "action=allow",
                "protocol=TCP", &format!("localport={}", port)])
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status();
        Ok(())
    }

    fn remove_rule(&self, rule_name: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — firewall kuralı kaldırılamıyor".into());
        }
        let _ = std::process::Command::new("netsh")
            .args(&["advfirewall", "firewall", "delete", "rule", &format!("name={}", rule_name)])
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status();
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// DnsManager
// ---------------------------------------------------------------------------

pub struct WindowsDns;

impl DnsManager for WindowsDns {
    fn set_dns(&self, dns_ip: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — DNS ayarları değiştirilemiyor".into());
        }
        use winreg::enums::*;
        use winreg::RegKey;

        if dns_ip.is_empty() {
            return Ok(());
        }
        let net = r"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces";
        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        let k = hklm.open_subkey_with_flags(net, KEY_READ | KEY_WRITE)
            .map_err(|e| format!("Registry: {}", e))?;
        let subkeys: Vec<String> = k.enum_keys().filter_map(|r| r.ok()).collect();
        let mut changed = 0u32;
        for sub in &subkeys {
            if let Ok(sk) = k.open_subkey_with_flags(sub, KEY_READ | KEY_WRITE) {
                let existing: String = sk.get_value("NameServer").unwrap_or_default();
                let dhcp: String = sk.get_value("DhcpNameServer").unwrap_or_default();
                if !existing.is_empty() || !dhcp.is_empty() {
                    let _ = sk.set_value("NameServer", &dns_ip);
                    changed += 1;
                }
            }
        }
        if changed == 0 {
            if let Ok(params) = hklm.open_subkey_with_flags(
                r"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", KEY_WRITE)
            {
                let _ = params.set_value("NameServer", &dns_ip);
            }
        }
        Ok(())
    }

    fn restore_dns(&self) {
        if !running_as_admin() {
            eprintln!("[DNS] Admin gerekli — DNS geri yüklenemiyor");
            return;
        }
        use winreg::enums::*;
        use winreg::RegKey;

        let net = r"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces";
        if let Ok(k) = RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey_with_flags(net, KEY_READ | KEY_WRITE) {
            let subkeys: Vec<String> = k.enum_keys().filter_map(|r| r.ok()).collect();
            for sub in &subkeys {
                if let Ok(sk) = k.open_subkey_with_flags(sub, KEY_READ | KEY_WRITE) {
                    let _ = sk.delete_value("NameServer");
                }
            }
        }
    }

    fn get_dns_servers(&self) -> Vec<String> {
        let mut servers = Vec::new();
        if let Ok(out) = std::process::Command::new("ipconfig")
            .arg("/all")
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            let text = String::from_utf8_lossy(&out.stdout);
            for line in text.lines() {
                let trimmed = line.trim();
                let lc = trimmed.to_lowercase();
                if lc.starts_with("dns sunucular") || lc.starts_with("dns servers") {
                    if let Some(val) = trimmed.split(':').nth(1) {
                        let ip = val.trim().trim_matches(|c| c == ' ' || c == '(' || c == ')');
                        if !ip.is_empty() && ip.contains('.') {
                            servers.push(ip.to_string());
                        }
                    }
                }
            }
        }
        servers
    }
}

// ---------------------------------------------------------------------------
// NetworkManager
// ---------------------------------------------------------------------------

pub struct WindowsNetwork;

impl NetworkManager for WindowsNetwork {
    fn get_isp_info(&self) -> IspInfo {
        let mut name = "unknown".to_string();
        let mut connection_type = "unknown".to_string();
        let mut region = "unknown".to_string();
        let mut dns_servers: Vec<String> = Vec::new();

        if let Ok(output) = std::process::Command::new("ipconfig")
            .arg("/all")
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            let text = String::from_utf8_lossy(&output.stdout);
            let lower = text.to_lowercase();

            name = if lower.contains("turk telekom") || lower.contains("ttnet") { "turktelekom".into() }
            else if lower.contains("vodafone") { "vodafone".into() }
            else if lower.contains("kablonet") { "kablonet".into() }
            else if lower.contains("superonline") { "superonline".into() }
            else if lower.contains("milenicom") { "milenicom".into() }
            else if lower.contains("turknet") { "turknet".into() }
            else { "unknown".into() };

            for line in text.lines() {
                let trimmed = line.trim();
                let lc = trimmed.to_lowercase();
                if lc.starts_with("dns sunucular") || lc.starts_with("dns servers") {
                    if let Some(val) = trimmed.split(':').nth(1) {
                        let ip = val.trim().trim_matches(|c| c == ' ' || c == '(' || c == ')');
                        if !ip.is_empty() && ip.contains('.') {
                            dns_servers.push(ip.to_string());
                        }
                    }
                }
            }
        }

        // Connection type via PowerShell
        if let Ok(ps_out) = std::process::Command::new("powershell")
            .args(&["-NoProfile", "-WindowStyle", "Hidden", "-Command",
                "(Get-NetAdapter -Physical | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1).Name"])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            let adapter = String::from_utf8_lossy(&ps_out.stdout).trim().to_lowercase();
            if adapter.contains("wi-fi") || adapter.contains("wireless") || adapter.contains("wlan") {
                connection_type = "wifi".into();
            } else if adapter.contains("ethernet") || adapter.contains("lan") {
                connection_type = "ethernet".into();
            } else if adapter.contains("wwan") || adapter.contains("mobile") || adapter.contains("lte") {
                connection_type = "mobile".into();
            }
        }

        // Geo/ISP via ip-api.com
        if let Ok(ip_out) = std::process::Command::new("powershell")
            .args(&["-NoProfile", "-WindowStyle", "Hidden", "-Command",
                "(Invoke-WebRequest -Uri 'http://ip-api.com/json/?fields=country,regionName,city,isp' -UseBasicParsing -TimeoutSec 3).Content"])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            let geo_txt = String::from_utf8_lossy(&ip_out.stdout);
            if let Ok(geo) = serde_json::from_str::<serde_json::Value>(&geo_txt) {
                if let Some(isp_str) = geo.get("isp").and_then(|v| v.as_str()) {
                    let lc = isp_str.to_lowercase();
                    let clean = lc.replace(' ', "").replace('.', "").replace(',', "");
                    if !clean.contains("notavailable") && !clean.is_empty() {
                        name = if clean.contains("turktelekom") { "turktelekom".into() }
                            else if clean.contains("superonline") { "superonline".into() }
                            else if clean.contains("vodafone") { "vodafone".into() }
                            else if clean.contains("turknet") { "turknet".into() }
                            else if clean.contains("kablonet") { "kablonet".into() }
                            else if clean.contains("milenicom") { "milenicom".into() }
                            else { clean };
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

        IspInfo { name, display_name: display_name.to_string(), connection_type, region, dns_servers }
    }

    fn get_safe_lan_ip(&self) -> String {
        use local_ip_address::list_afinet_netifas;

        const VIRTUAL_KEYWORDS: &[&str] = &[
            "virtual", "vmware", "vmnet", "vbox", "virtualbox", "pseudo",
            "hamachi", "vpn", "vethernet", "loopback", "docker", "wsl",
            "hyper-v", "bluetooth", "teredo", "isatap", "6to4", "tap-",
            "tun", "warp", "tailscale", "zerotier", "nordlynx", "wireguard",
            "proton", "mullvad", "windscribe", "surfshark", "host-only",
            "hostonly", "vEthernet", "npcap", "miniport",
        ];

        fn is_virtual_ip(ip: &std::net::Ipv4Addr) -> bool {
            let o = ip.octets();
            match (o[0], o[1]) {
                (192, 168) if o[2] == 56 => true,
                (192, 168) if o[2] >= 190 => true,
                (172, 17) => true,
                (25, _) => true,
                (169, 254) => true,
                _ => false,
            }
        }

        if let Ok(netifs) = list_afinet_netifas() {
            for (name, ip) in &netifs {
                if let IpAddr::V4(v4) = ip {
                    if v4.is_loopback() || v4.is_link_local() { continue; }
                    let name_lower = name.to_lowercase();
                    if !VIRTUAL_KEYWORDS.iter().any(|kw| name_lower.contains(kw)) && !is_virtual_ip(v4) {
                        return v4.to_string();
                    }
                }
            }
            for (_name, ip) in &netifs {
                if let IpAddr::V4(v4) = ip {
                    if !v4.is_loopback() && !v4.is_link_local() && !is_virtual_ip(v4) {
                        return v4.to_string();
                    }
                }
            }
            for (_, ip) in &netifs {
                if let IpAddr::V4(v4) = ip {
                    if !v4.is_loopback() { return v4.to_string(); }
                }
            }
        }
        "127.0.0.1".to_string()
    }

    fn is_admin(&self) -> bool {
        running_as_admin()
    }
}

// ---------------------------------------------------------------------------
// ProcessManager
// ---------------------------------------------------------------------------

pub struct WindowsProcess;

impl ProcessManager for WindowsProcess {
    fn kill_by_name(&self, name: &str) -> Result<(), String> {
        let out = std::process::Command::new("taskkill")
            .args(&["/F", "/IM", name])
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status()
            .map_err(|e| format!("taskkill failed: {}", e))?;
        if out.success() { Ok(()) } else { Err("Process not found".into()) }
    }

    fn kill_by_pid(&self, pid: u32) -> Result<(), String> {
        let out = std::process::Command::new("taskkill")
            .args(&["/F", "/PID", &pid.to_string()])
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status()
            .map_err(|e| format!("taskkill failed: {}", e))?;
        if out.success() { Ok(()) } else { Err("Process not found".into()) }
    }

    fn spawn_detached(&self, exe: &str, args: &[&str]) -> Result<u32, String> {
        let child = std::process::Command::new(exe)
            .args(args)
            .creation_flags(CREATE_NO_WINDOW)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map_err(|e| format!("spawn failed: {}", e))?;
        Ok(child.id())
    }
}

// ---------------------------------------------------------------------------
// AutostartManager
// ---------------------------------------------------------------------------

pub struct WindowsAutostart;

impl AutostartManager for WindowsAutostart {
    fn enable_autostart(&self, exe_path: &str) -> Result<(), String> {
        if !running_as_admin() {
            // Fallback: HKCU Run (adminsiz çalışır)
            return enable_autostart_hkcu(exe_path);
        }
        // Admin mod: schtasks ile yükseltilmiş görev
        let xml = format!(
            r#"<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers><LogonTrigger><Enabled>true</Enabled></LogonTrigger></Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions>
    <Exec><Command>{}</Command></Exec>
  </Actions>
</Task>"#, exe_path);

        let tmp = std::env::temp_dir().join("docspi_task.xml");
        let utf16: Vec<u8> = xml.encode_utf16().flat_map(|c| c.to_le_bytes()).collect();
        let mut with_bom: Vec<u8> = vec![0xFF, 0xFE];
        with_bom.extend(utf16);
        std::fs::write(&tmp, with_bom).map_err(|e| format!("XML yazma: {}", e))?;

        let out = std::process::Command::new("schtasks")
            .args(&["/Create", "/TN", "DocsPI", "/XML", &tmp.to_string_lossy(), "/F"])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .map_err(|e| format!("schtasks: {}", e))?;
        let _ = std::fs::remove_file(&tmp);
        if out.status.success() { Ok(()) }
        else { Err(format!("Görev oluşturulamadı: {}", String::from_utf8_lossy(&out.stderr))) }
    }

    fn disable_autostart(&self) -> Result<(), String> {
        if !running_as_admin() {
            // Fallback: HKCU Run
            return disable_autostart_hkcu();
        }
        let _ = std::process::Command::new("schtasks")
            .args(&["/Delete", "/TN", "DocsPI", "/F"])
            .creation_flags(CREATE_NO_WINDOW)
            .output();
        Ok(())
    }

    fn is_autostart_enabled(&self, _task_name: &str) -> bool {
        if !running_as_admin() {
            return is_autostart_hkcu_enabled();
        }
        if let Ok(out) = std::process::Command::new("schtasks")
            .args(&["/Query", "/TN", "DocsPI"])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
        {
            return out.status.success();
        }
        false
    }
}

// ---------------------------------------------------------------------------
// InstanceManager
// ---------------------------------------------------------------------------

pub struct WindowsInstance;

impl InstanceManager for WindowsInstance {
    fn ensure_single_instance(&self, _app_name: &str) {
        use std::ptr::null_mut;
        use winapi::shared::winerror::ERROR_ALREADY_EXISTS;
        use winapi::um::errhandlingapi::GetLastError;
        use winapi::um::synchapi::CreateMutexW;
        use winapi::um::winuser::{FindWindowW, IsIconic, SetForegroundWindow, ShowWindow, SW_RESTORE};

        // Use Local\ prefix — works without admin (Global\ requires SeCreateGlobalPrivilege)
        let mutex_name: Vec<u16> = "Local\\DocsPI_SingleInstance\0".encode_utf16().collect();
        unsafe {
            let handle = CreateMutexW(null_mut(), 0, mutex_name.as_ptr());
            if handle.is_null() || GetLastError() == ERROR_ALREADY_EXISTS {
                eprintln!("[STARTUP] DocsPI already running — exiting");
                let window_name: Vec<u16> = "DocsPI\0".encode_utf16().collect();
                let hwnd = FindWindowW(null_mut(), window_name.as_ptr());
                if !hwnd.is_null() {
                    if IsIconic(hwnd) != 0 { ShowWindow(hwnd, SW_RESTORE); }
                    SetForegroundWindow(hwnd);
                }
                std::process::exit(0);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// UwpManager
// ---------------------------------------------------------------------------

pub struct WindowsUwp;

impl UwpManager for WindowsUwp {
    fn exempt_loopback(&self) {
        if !running_as_admin() {
            eprintln!("[UWP] Admin gerekli — loopback exemption atlanıyor");
            return;
        }
        std::thread::spawn(|| {
            let script = r#"
                try {
                    $packages = Get-AppxPackage -ErrorAction SilentlyContinue
                    foreach ($pkg in $packages) {
                        if ($pkg.PackageFamilyName) {
                            CheckNetIsolation.exe LoopbackExempt -a "-n=$($pkg.PackageFamilyName)"
                        }
                    }
                } catch {}
            "#;
            let _ = std::process::Command::new("powershell")
                .args(&["-NoProfile", "-WindowStyle", "Hidden", "-Command", script])
                .creation_flags(CREATE_NO_WINDOW)
                .status();
        });
    }
}

// ---------------------------------------------------------------------------
// Helper functions for admin/non-admin dual mode
// ---------------------------------------------------------------------------

fn running_as_admin() -> bool {
    use std::mem;
    use std::ptr;
    use winapi::um::handleapi::CloseHandle;
    use winapi::um::processthreadsapi::{GetCurrentProcess, OpenProcessToken};
    use winapi::um::securitybaseapi::GetTokenInformation;
    use winapi::um::winnt::{TokenElevation, HANDLE, TOKEN_ELEVATION, TOKEN_QUERY};

    unsafe {
        let mut token: HANDLE = ptr::null_mut();
        if OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token) == 0 {
            return false;
        }
        let mut elevation: TOKEN_ELEVATION = mem::zeroed();
        let mut size: u32 = 0;
        let result = GetTokenInformation(
            token, TokenElevation,
            &mut elevation as *mut _ as *mut _,
            mem::size_of::<TOKEN_ELEVATION>() as u32, &mut size,
        );
        let is_elevated = result != 0 && elevation.TokenIsElevated != 0;
        CloseHandle(token);
        is_elevated
    }
}

// HKCU Run registry — adminsiz autostart
fn enable_autostart_hkcu(exe_path: &str) -> Result<(), String> {
    use winreg::enums::*;
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let (key, _) = hkcu
        .create_subkey(r"Software\Microsoft\Windows\CurrentVersion\Run")
        .map_err(|e| format!("Run registry: {}", e))?;
    key.set_value("DocsPI", &exe_path.to_string())
        .map_err(|e| format!("set_value: {}", e))?;
    Ok(())
}

fn disable_autostart_hkcu() -> Result<(), String> {
    use winreg::enums::*;
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(key) = hkcu.open_subkey_with_flags(
        r"Software\Microsoft\Windows\CurrentVersion\Run", KEY_WRITE)
    {
        let _ = key.delete_value("DocsPI");
    }
    Ok(())
}

fn is_autostart_hkcu_enabled() -> bool {
    use winreg::enums::*;
    use winreg::RegKey;
    if let Ok(key) = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
        r"Software\Microsoft\Windows\CurrentVersion\Run", KEY_READ)
    {
        return key.get_value::<String, _>("DocsPI").is_ok();
    }
    false
}

// ---------------------------------------------------------------------------
// DivertManager
// ---------------------------------------------------------------------------

pub struct WindowsDivert;

impl DivertManager for WindowsDivert {
    fn find_engine(&self, _exe_name: &str) -> Option<std::path::PathBuf> {
        let exe = std::env::current_exe().ok()?;
        let dir = exe.parent()?;
        let candidates = [
            dir.join("binaries").join("docspi-divert-x86_64-pc-windows-msvc.exe"),
            dir.join("docspi-divert.exe").to_owned(),
            dir.join("binaries").join("docspi-divert.exe"),
        ];
        candidates.into_iter().find(|p| p.exists())
    }

    fn engine_file_name(&self) -> String {
        "docspi-divert-x86_64-pc-windows-msvc.exe".to_string()
    }
}

// ---------------------------------------------------------------------------
// Helper functions used by lib.rs — kept here for clean import
// ---------------------------------------------------------------------------

#[allow(dead_code)]
pub fn guard_exe_path() -> Option<std::path::PathBuf> {
    let exe = std::env::current_exe().ok()?;
    let dir = exe.parent()?;
    let candidates = [
        dir.join("binaries").join("docspi-guard.exe"),
        dir.join("docspi-guard.exe"),
    ];
    candidates.into_iter().find(|p| p.exists())
}

#[allow(dead_code)]
pub fn manage_firewall_rules(enable: bool, proxy_port: u16, pac_port: u16) {
    if !running_as_admin() {
        eprintln!("[FIREWALL] Admin gerekli — firewall kuralları atlanıyor");
        return;
    }
    std::thread::spawn(move || {
        for name in &["DocsDPI_Proxy", "DocsDPI_PAC"] {
            let _ = std::process::Command::new("netsh")
                .args(&["advfirewall", "firewall", "delete", "rule", &format!("name={}", name)])
                .creation_flags(CREATE_NO_WINDOW)
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .status();
        }
        if enable {
            let _ = std::process::Command::new("netsh")
                .args(&["advfirewall", "firewall", "add", "rule", "name=DocsDPI_Proxy",
                    "dir=in", "action=allow", "protocol=TCP", &format!("localport={}", proxy_port)])
                .creation_flags(CREATE_NO_WINDOW)
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .status();
            let _ = std::process::Command::new("netsh")
                .args(&["advfirewall", "firewall", "add", "rule", "name=DocsDPI_PAC",
                    "dir=in", "action=allow", "protocol=TCP", &format!("localport={}", pac_port)])
                .creation_flags(CREATE_NO_WINDOW)
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .status();
        }
    });
}



