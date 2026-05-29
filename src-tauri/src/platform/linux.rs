//! Linux implementation of the DocsPI platform abstraction layer.
//!
//! Linux uses:
//!   - gsettings (GNOME) / kioslave5 (KDE) for system proxy
//!   - iptables / nftables for firewall
//!   - systemd-resolved / resolvconf for DNS
//!   - systemd --user for autostart
//!   - kill / pkill for process management
//!   - raw sockets / nfqueue for DPI bypass

#![allow(non_snake_case)]

use super::*;

fn running_as_admin() -> bool {
    #[cfg(target_os = "linux")]
    unsafe { return libc::geteuid() == 0; }
    #[cfg(not(target_os = "linux"))]
    true
}

// ---------------------------------------------------------------------------
// ProxyManager
// ---------------------------------------------------------------------------

pub struct LinuxProxy;

impl ProxyManager for LinuxProxy {
    fn set_proxy(&self, proxy_addr: &str, port: u16, _extra_bypass: &[String]) -> Result<(), String> {
        let proxy = format!("http://{}:{}", proxy_addr, port);

        // GNOME
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy", "mode", "manual"])
            .status();
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy.http", "host", proxy_addr])
            .status();
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy.http", "port", &port.to_string()])
            .status();
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy.https", "host", proxy_addr])
            .status();
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy.https", "port", &port.to_string()])
            .status();

        // KDE
        let _ = std::process::Command::new("kwriteconfig5")
            .args(&["--file", "kioslaverc", "--group", "Proxy Settings", "--key", "ProxyType", "1"])
            .status();
        let _ = std::process::Command::new("kwriteconfig5")
            .args(&["--file", "kioslaverc", "--group", "Proxy Settings", "--key", "httpProxy", &proxy])
            .status();
        let _ = std::process::Command::new("kwriteconfig5")
            .args(&["--file", "kioslaverc", "--group", "Proxy Settings", "--key", "httpsProxy", &proxy])
            .status();

        // Env
        std::env::set_var("http_proxy", &proxy);
        std::env::set_var("https_proxy", &proxy);

        Ok(())
    }

    fn clear_proxy(&self) -> Result<(), String> {
        let _ = std::process::Command::new("gsettings")
            .args(&["set", "org.gnome.system.proxy", "mode", "none"])
            .status();
        std::env::remove_var("http_proxy");
        std::env::remove_var("https_proxy");
        Ok(())
    }

    fn backup_proxy(&self) {}
    fn restore_proxy(&self) -> bool { false }
    fn notify_change(&self) {}
}

// ---------------------------------------------------------------------------
// FirewallManager
// ---------------------------------------------------------------------------

pub struct LinuxFirewall;

impl FirewallManager for LinuxFirewall {
    fn open_port(&self, port: u16, rule_name: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Root gerekiyor — Linux firewall için root gerekli".into());
        }
        let _ = std::process::Command::new("iptables")
            .args(&["-A", "INPUT", "-p", "tcp", "--dport", &port.to_string(), "-j", "ACCEPT",
                     "-m", "comment", "--comment", rule_name])
            .status();
        Ok(())
    }

    fn remove_rule(&self, rule_name: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Root gerekiyor — Linux firewall kuralı kaldırılamıyor".into());
        }
        let _ = std::process::Command::new("sh")
            .args(&["-c", &format!("iptables-save 2>/dev/null | grep -v '{}' | iptables-restore 2>/dev/null", rule_name)])
            .status();
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// DnsManager
// ---------------------------------------------------------------------------

pub struct LinuxDns;

impl DnsManager for LinuxDns {
    fn set_dns(&self, dns_ip: &str) -> Result<(), String> {
        if !running_as_admin() {
            return Err("Root gerekiyor — Linux DNS ayarı için root gerekli".into());
        }
        let _ = std::process::Command::new("resolvectl")
            .args(&["dns", "global", dns_ip])
            .status();
        let _ = std::process::Command::new("sh")
            .args(&["-c", &format!("echo 'nameserver {}' > /etc/resolv.conf 2>/dev/null", dns_ip)])
            .status();
        Ok(())
    }

    fn restore_dns(&self) {
        if !running_as_admin() {
            eprintln!("[DNS] Root gerekli — Linux DNS geri yüklenemiyor");
            return;
        }
        let _ = std::process::Command::new("resolvectl")
            .args(&["dns", "global", ""])
            .status();
    }

    fn get_dns_servers(&self) -> Vec<String> {
        let mut servers = Vec::new();

        if let Ok(out) = std::process::Command::new("resolvectl")
            .args(&["dns"])
            .output()
        {
            let text = String::from_utf8_lossy(&out.stdout);
            for line in text.lines() {
                if line.contains(':') {
                    let parts: Vec<&str> = line.split(':').collect();
                    if parts.len() >= 2 {
                        for ip in parts[1].split_whitespace() {
                            let ip = ip.trim().to_string();
                            if !ip.is_empty() && ip.contains('.') && !servers.contains(&ip) {
                                servers.push(ip);
                            }
                        }
                    }
                }
            }
        }

        if servers.is_empty() {
            if let Ok(content) = std::fs::read_to_string("/etc/resolv.conf") {
                for line in content.lines() {
                    if line.starts_with("nameserver") {
                        if let Some(ip) = line.split_whitespace().nth(1) {
                            let ip = ip.trim().to_string();
                            if !servers.contains(&ip) { servers.push(ip); }
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

pub struct LinuxNetwork;

impl NetworkManager for LinuxNetwork {
    fn get_isp_info(&self) -> IspInfo {
        let mut info = IspInfo::default();

        // ip route to find default interface
        if let Ok(out) = std::process::Command::new("sh")
            .args(&["-c", "ip route get 1.1.1.1 2>/dev/null | head -1 | awk '{print $5}'"])
            .output()
        {
            let iface = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if !iface.is_empty() {
                // Try to get connection type
                let path = format!("/sys/class/net/{}/type", iface);
                if let Ok(typestr) = std::fs::read_to_string(&path) {
                    let t = typestr.trim();
                    // 1 = ethernet, 6 = ethernet, 802 = wireless (doesn't work directly)
                    info.connection_type = if t == "1" || t == "6" { "ethernet" } else { "wifi" }.into();
                }
            }
        }

        // ip-api.com
        if let Ok(geo_out) = std::process::Command::new("curl")
            .args(&["-s", "--max-time", "3", "http://ip-api.com/json/?fields=country,regionName,city,isp"])
            .output()
        {
            let txt = String::from_utf8_lossy(&geo_out.stdout);
            if let Ok(geo) = serde_json::from_str::<serde_json::Value>(&txt) {
                if let Some(isp_str) = geo.get("isp").and_then(|v| v.as_str()) {
                    let clean = isp_str.to_lowercase()
                        .replace(' ', "").replace('.', "").replace(',', "");
                    if !clean.contains("notavailable") && !clean.is_empty() {
                        info.name = clean;
                    }
                }
                if let Some(city) = geo.get("city").and_then(|v| v.as_str()) {
                    info.region = city.to_string();
                }
            }
        }

        info.dns_servers = LinuxDns.get_dns_servers();
        info
    }

    fn get_safe_lan_ip(&self) -> String {
        if let Ok(out) = std::process::Command::new("sh")
            .args(&["-c", "ip -4 addr show | grep -oP '(?<=inet\\s)\\d+\\.\\d+\\.\\d+\\.\\d+' | grep -v '127.0.0.1' | head -1"])
            .output()
        {
            let ip = String::from_utf8_lossy(&out.stdout).trim().to_string();
            if !ip.is_empty() { return ip; }
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

pub struct LinuxProcess;

impl ProcessManager for LinuxProcess {
    fn kill_by_name(&self, name: &str) -> Result<(), String> {
        std::process::Command::new("pkill")
            .args(&["-f", name])
            .status()
            .map_err(|e| format!("pkill: {}", e))?;
        Ok(())
    }

    fn kill_by_pid(&self, pid: u32) -> Result<(), String> {
        #[cfg(target_os = "linux")]
        unsafe {
            if libc::kill(pid as i32, libc::SIGKILL) != 0 {
                return Err("kill failed".into());
            }
            return Ok(());
        }
        #[cfg(not(target_os = "linux"))]
        {
            let _ = pid;
            Err("Not supported on this platform".into())
        }
    }

    fn spawn_detached(&self, exe: &str, args: &[&str]) -> Result<u32, String> {
        let child = std::process::Command::new(exe)
            .args(args)
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map_err(|e| format!("spawn: {}", e))?;
        Ok(child.id())
    }
}

// ---------------------------------------------------------------------------
// AutostartManager — systemd user service
// ---------------------------------------------------------------------------

pub struct LinuxAutostart;

impl AutostartManager for LinuxAutostart {
    fn enable_autostart(&self, exe_path: &str) -> Result<(), String> {
        let service = r#"[Unit]
Description=DocsPI DPI Bypass
After=network.target

[Service]
Type=simple
ExecStart={}
Restart=no

[Install]
WantedBy=default.target
"#.replace("{}", exe_path);

        let config_dir = std::path::PathBuf::from(
            std::env::var("XDG_CONFIG_HOME")
                .unwrap_or_else(|_| format!("{}/.config", std::env::var("HOME").unwrap_or_default()))
        ).join("systemd/user");

        std::fs::create_dir_all(&config_dir)
            .map_err(|e| format!("mkdir: {}", e))?;

        let service_path = config_dir.join("docspi.service");
        std::fs::write(&service_path, service.as_bytes())
            .map_err(|e| format!("service write: {}", e))?;

        let _ = std::process::Command::new("systemctl")
            .args(&["--user", "daemon-reload"])
            .status();
        let _ = std::process::Command::new("systemctl")
            .args(&["--user", "enable", "docspi"])
            .status();

        Ok(())
    }

    fn disable_autostart(&self) -> Result<(), String> {
        let _ = std::process::Command::new("systemctl")
            .args(&["--user", "disable", "docspi"])
            .status();
        Ok(())
    }

    fn is_autostart_enabled(&self, _task_name: &str) -> bool {
        if let Ok(out) = std::process::Command::new("systemctl")
            .args(&["--user", "is-enabled", "docspi"])
            .output()
        {
            let s = String::from_utf8_lossy(&out.stdout).trim().to_string();
            return s == "enabled";
        }
        false
    }
}

// ---------------------------------------------------------------------------
// InstanceManager — Linux PID lock file
// ---------------------------------------------------------------------------

pub struct LinuxInstance;

impl InstanceManager for LinuxInstance {
    fn ensure_single_instance(&self, app_name: &str) {
        let runtime_dir = std::env::var("XDG_RUNTIME_DIR")
            .unwrap_or_else(|_| "/tmp".to_string());
        let lock_path = std::path::PathBuf::from(&runtime_dir).join(format!("{}.lock", app_name));

        if lock_path.exists() {
            if let Ok(pid_str) = std::fs::read_to_string(&lock_path) {
                if let Ok(_pid) = pid_str.trim().parse::<u32>() {
                    #[cfg(target_os = "linux")]
                    unsafe {
                        if libc::kill(pid as i32, 0) == 0 {
                            eprintln!("[STARTUP] {} already running — exiting", app_name);
                            std::process::exit(0);
                        }
                    }
                }
            }
            let _ = std::fs::remove_file(&lock_path);
        }

        let _ = std::fs::write(&lock_path, std::process::id().to_string());
    }
}

// ---------------------------------------------------------------------------
// UwpManager — no-op on Linux
// ---------------------------------------------------------------------------

pub struct LinuxUwp;

impl UwpManager for LinuxUwp {
    fn exempt_loopback(&self) {}
}

// ---------------------------------------------------------------------------
// DivertManager — Linux uses raw sockets / nfqueue
// ---------------------------------------------------------------------------

pub struct LinuxDivert;

impl DivertManager for LinuxDivert {
    fn find_engine(&self, _exe_name: &str) -> Option<std::path::PathBuf> {
        let exe = std::env::current_exe().ok()?;
        let dir = exe.parent()?;
        let candidates = [
            dir.join("binaries").join("docspi-divert-x86_64-unknown-linux-gnu"),
            dir.join("binaries").join("docspi-divert"),
        ];
        candidates.into_iter().find(|p| p.exists())
    }

    fn engine_file_name(&self) -> String {
        "docspi-divert-x86_64-unknown-linux-gnu".to_string()
    }
}



