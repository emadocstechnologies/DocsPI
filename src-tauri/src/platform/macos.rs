//! macOS implementation of the DocsPI platform abstraction layer.
//!
//! macOS uses:
//!   - networksetup / scutil for system proxy settings
//!   - pf (packet filter) for firewall
//!   - scutil for DNS configuration
//!   - launchd for autostart (LaunchAgents)
//!   - pkill for process management
//!   - NEPacketTunnelProvider for raw packet bypass (optional)
//!   - os_log for system logging

#![allow(non_snake_case)]

use super::*;

fn running_as_admin() -> bool {
    #[cfg(any(target_os = "macos", target_os = "ios"))]
    unsafe { return libc::geteuid() == 0; }
    #[cfg(not(any(target_os = "macos", target_os = "ios")))]
    true
}

// ---------------------------------------------------------------------------
// ProxyManager
// ---------------------------------------------------------------------------

pub struct MacosProxy;

impl ProxyManager for MacosProxy {
    fn set_proxy(&self, proxy_addr: &str, port: u16, extra_bypass: &[String]) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — macOS sistem proxy ayarı için sudo gerekli".into());
        }
        // macOS: networksetup -setwebproxy <networkservice> <ip> <port>
        // networksetup -setsecurewebproxy <networkservice> <ip> <port>
        // networksetup -setproxybypassdomains <networkservice> <domain1> <domain2> ...

        // Find active network service
        let output = std::process::Command::new("networksetup")
            .args(&["-listallnetworkservices"])
            .output()
            .map_err(|e| format!("networksetup failed: {}", e))?;

        let text = String::from_utf8_lossy(&output.stdout);
        let services: Vec<&str> = text.lines()
            .filter(|l| !l.is_empty() && !l.starts_with('*') && !l.to_lowercase().contains("an asterisk"))
            .collect();

        if services.is_empty() {
            return Err("No active network service found".into());
        }

        let service = services[0]; // Use first active service
        let bypass = extra_bypass.join(" ");

        // Set HTTP proxy
        let _ = std::process::Command::new("networksetup")
            .args(&["-setwebproxy", service, proxy_addr, &port.to_string()])
            .status();

        // Set HTTPS proxy
        let _ = std::process::Command::new("networksetup")
            .args(&["-setsecurewebproxy", service, proxy_addr, &port.to_string()])
            .status();

        // Set bypass domains
        if !bypass.is_empty() {
            let mut args = vec!["-setproxybypassdomains", service];
            for d in extra_bypass {
                args.push(d);
            }
            let _ = std::process::Command::new("networksetup").args(&args).status();
        }

        Ok(())
    }

    fn clear_proxy(&self) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — macOS sistem proxy temizliği için sudo gerekli".into());
        }
        let output = std::process::Command::new("networksetup")
            .args(&["-listallnetworkservices"])
            .output()
            .map_err(|e| format!("networksetup failed: {}", e))?;

        let text = String::from_utf8_lossy(&output.stdout);
        let services: Vec<&str> = text.lines()
            .filter(|l| !l.is_empty() && !l.starts_with('*'))
            .collect();

        for service in &services {
            let _ = std::process::Command::new("networksetup")
                .args(&["-setwebproxystate", service, "off"])
                .status();
            let _ = std::process::Command::new("networksetup")
                .args(&["-setsecurewebproxystate", service, "off"])
                .status();
        }

        Ok(())
    }

    fn backup_proxy(&self) {
        // Could read current proxy settings via scutil / networksetup -getwebproxy
        // For now, simplified — no backup on macOS
    }

    fn restore_proxy(&self) -> bool { false }

    fn notify_change(&self) {}
}

// ---------------------------------------------------------------------------
// FirewallManager — macOS pfctl
// ---------------------------------------------------------------------------

pub struct MacosFirewall;

impl FirewallManager for MacosFirewall {
    fn open_port(&self, port: u16, rule_name: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — macOS firewall için sudo gerekli".into());
        }
        // macOS: pfctl -a com.apple/250.BasicFirewall -f /etc/pf.conf
        // For now use a simple pf anchor
        let rule = format!("pass in proto tcp from any to any port {} keep state", port);
        let _ = std::process::Command::new("sh")
            .args(&["-c", &format!("echo '{}' | sudo pfctl -a 'com.docspi/{}' -f -", rule, rule_name)])
            .status();
        Ok(())
    }

    fn remove_rule(&self, rule_name: &str) -> Result<(), String> {
        let _ = std::process::Command::new("sudo")
            .args(&["pfctl", "-a", &format!("com.docspi/{}", rule_name), "-F", "all"])
            .status();
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// DnsManager — macOS scutil
// ---------------------------------------------------------------------------

pub struct MacosDns;

impl DnsManager for MacosDns {
    fn set_dns(&self, dns_ip: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Admin gerekiyor — macOS DNS ayarı için sudo gerekli".into());
        }
        let services_output = std::process::Command::new("networksetup")
            .args(&["-listallnetworkservices"])
            .output()
            .map_err(|e| format!("networksetup: {}", e))?;

        let text = String::from_utf8_lossy(&services_output.stdout);
        for line in text.lines() {
            let s = line.trim();
            if s.is_empty() || s.starts_with('*') || s.to_lowercase().contains("asterisk") {
                continue;
            }
            let _ = std::process::Command::new("networksetup")
                .args(&["-setdnsservers", s, dns_ip])
                .status();
        }
        Ok(())
    }

    fn restore_dns(&self) {
        if !running_as_admin() {
            eprintln!("[DNS] Admin gerekli — macOS DNS geri yüklenemiyor");
            return;
        }
        let services_output = std::process::Command::new("networksetup")
            .args(&["-listallnetworkservices"])
            .output();
        if let Ok(out) = services_output {
            let text = String::from_utf8_lossy(&out.stdout);
            for line in text.lines() {
                let s = line.trim();
                if s.is_empty() || s.starts_with('*') || s.to_lowercase().contains("asterisk") {
                    continue;
                }
                let _ = std::process::Command::new("networksetup")
                    .args(&["-setdnsservers", s, "empty"])
                    .status();
            }
        }
    }

    fn get_dns_servers(&self) -> Vec<String> {
        let mut servers = Vec::new();
        if let Ok(out) = std::process::Command::new("scutil")
            .args(&["--dns"])
            .output()
        {
            let text = String::from_utf8_lossy(&out.stdout);
            for line in text.lines() {
                let t = line.trim();
                if t.starts_with("nameserver") {
                    if let Some(ip) = t.split_whitespace().nth(1) {
                        if !servers.contains(&ip.to_string()) {
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

pub struct MacosNetwork;

impl NetworkManager for MacosNetwork {
    fn get_isp_info(&self) -> IspInfo {
        let mut info = IspInfo::default();

        // Get active network interface name
        if let Ok(out) = std::process::Command::new("sh")
            .args(&["-c", "route get default 2>/dev/null | grep interface | awk '{print $2}'"])
            .output()
        {
            let iface = String::from_utf8_lossy(&out.stdout).trim().to_string();
            // Try networksetup -getinfo for details
            if !iface.is_empty() {
                // Connection type
                if iface.to_lowercase().contains("en") {
                    // Could be Wi-Fi (en0 usually) or Ethernet (en1-9)
                    if let Ok(airport) = std::process::Command::new("sh")
                        .args(&["-c", "networksetup -getairportnetwork en0 2>/dev/null"])
                        .output()
                    {
                        let ap = String::from_utf8_lossy(&airport.stdout);
                        if !ap.contains("not configured") {
                            info.connection_type = "wifi".into();
                        }
                    }
                    if info.connection_type == "unknown" {
                        info.connection_type = "ethernet".into();
                    }
                }
            }
        }

        // Geo/ISP via ip-api.com
        if let Ok(geo_out) = std::process::Command::new("curl")
            .args(&["-s", "--max-time", "3", "http://ip-api.com/json/?fields=country,regionName,city,isp"])
            .output()
        {
            let txt = String::from_utf8_lossy(&geo_out.stdout);
            if let Ok(geo) = serde_json::from_str::<serde_json::Value>(&txt) {
                if let Some(isp_str) = geo.get("isp").and_then(|v| v.as_str()) {
                    let clean = isp_str.to_lowercase().replace(' ', "").replace('.', "").replace(',', "");
                    if !clean.contains("notavailable") && !clean.is_empty() {
                        info.name = clean;
                    }
                }
                if let Some(city) = geo.get("city").and_then(|v| v.as_str()) {
                    info.region = city.to_string();
                }
            }
        }

        // DNS servers
        info.dns_servers = MacosDns.get_dns_servers();

        info
    }

    fn get_safe_lan_ip(&self) -> String {
        // Get primary interface IP
        if let Ok(out) = std::process::Command::new("sh")
            .args(&["-c", "ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo '127.0.0.1'"])
            .output()
        {
            let ip = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if !ip.is_empty() && ip != "127.0.0.1" {
                return ip;
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

pub struct MacosProcess;

impl ProcessManager for MacosProcess {
    fn kill_by_name(&self, name: &str) -> Result<(), String> {
        let out = std::process::Command::new("pkill")
            .args(&["-f", name])
            .status()
            .map_err(|e| format!("pkill failed: {}", e))?;
        if out.success() { Ok(()) } else { Err("Process not found".into()) }
    }

    fn kill_by_pid(&self, pid: u32) -> Result<(), String> {
        let out = std::process::Command::new("kill")
            .args(&["-9", &pid.to_string()])
            .status()
            .map_err(|e| format!("kill failed: {}", e))?;
        if out.success() { Ok(()) } else { Err("Process not found".into()) }
    }

    fn spawn_detached(&self, exe: &str, args: &[&str]) -> Result<u32, String> {
        let child = std::process::Command::new(exe)
            .args(args)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map_err(|e| format!("spawn failed: {}", e))?;
        Ok(child.id())
    }
}

// ---------------------------------------------------------------------------
// AutostartManager — macOS LaunchAgents
// ---------------------------------------------------------------------------

pub struct MacosAutostart;

impl AutostartManager for MacosAutostart {
    fn enable_autostart(&self, exe_path: &str) -> Result<(), String> {
        let label = "com.aydocs.docspi";
        let plist = format!(r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>{}</string>
    <key>ProgramArguments</key>
    <array>
        <string>{}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>"#, label, exe_path);

        let plist_path = std::path::PathBuf::from(
            std::env::var("HOME").unwrap_or_default()
        ).join("Library/LaunchAgents").join(format!("{}.plist", label));

        if let Some(parent) = plist_path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        std::fs::write(&plist_path, plist.as_bytes())
            .map_err(|e| format!("plist write: {}", e))?;

        let _ = std::process::Command::new("launchctl")
            .args(&["load", &plist_path.to_string_lossy()])
            .status();

        Ok(())
    }

    fn disable_autostart(&self) -> Result<(), String> {
        let label = "com.aydocs.docspi";
        let plist_path = std::path::PathBuf::from(
            std::env::var("HOME").unwrap_or_default()
        ).join("Library/LaunchAgents").join(format!("{}.plist", label));

        let _ = std::process::Command::new("launchctl")
            .args(&["unload", &plist_path.to_string_lossy()])
            .status();
        let _ = std::fs::remove_file(&plist_path);

        Ok(())
    }

    fn is_autostart_enabled(&self, _task_name: &str) -> bool {
        let plist_path = std::path::PathBuf::from(
            std::env::var("HOME").unwrap_or_default()
        ).join("Library/LaunchAgents/com.aydocs.docspi.plist");
        plist_path.exists()
    }
}

// ---------------------------------------------------------------------------
// InstanceManager
// ---------------------------------------------------------------------------

pub struct MacosInstance;

impl InstanceManager for MacosInstance {
    fn ensure_single_instance(&self, app_name: &str) {
        let lock_path = std::env::temp_dir().join(format!("{}.lock", app_name));
        if lock_path.exists() {
            if let Ok(pid_str) = std::fs::read_to_string(&lock_path) {
                if let Ok(_pid) = pid_str.trim().parse::<u32>() {
                    #[cfg(any(target_os = "macos", target_os = "ios"))]
                    unsafe {
                        if libc::kill(pid as i32, 0) == 0 {
                            eprintln!("[STARTUP] {} already running (PID {}) — exiting", app_name, pid);
                            std::process::exit(0);
                        }
                    }
                }
            }
        }
        let _ = std::fs::write(&lock_path, std::process::id().to_string());
    }
}

// ---------------------------------------------------------------------------
// UwpManager — no-op on macOS
// ---------------------------------------------------------------------------

pub struct MacosUwp;

impl UwpManager for MacosUwp {
    fn exempt_loopback(&self) {}
}

// ---------------------------------------------------------------------------
// DivertManager — macOS uses NEPacketTunnelProvider
// ---------------------------------------------------------------------------

pub struct MacosDivert;

impl DivertManager for MacosDivert {
    fn find_engine(&self, _exe_name: &str) -> Option<std::path::PathBuf> {
        let exe = std::env::current_exe().ok()?;
        let dir = exe.parent()?;
        let candidates = [
            dir.join("binaries").join("docspi-divert-x86_64-apple-darwin"),
            dir.join("binaries").join("docspi-divert-aarch64-apple-darwin"),
        ];
        candidates.into_iter().find(|p| p.exists())
    }

    fn engine_file_name(&self) -> String {
        if cfg!(target_arch = "aarch64") {
            "docspi-divert-aarch64-apple-darwin".to_string()
        } else {
            "docspi-divert-x86_64-apple-darwin".to_string()
        }
    }
}

// Commit: feat: add macOS platform support [132228]

// feat: add macOS platform support [132606]
