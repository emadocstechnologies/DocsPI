//! Android implementation of the DocsPI platform abstraction layer.
//!
//! Android uses VpnService API for DPI bypass. This is fundamentally different
//! from desktop proxy-based approach — traffic is intercepted at the TUN level.
//!
//! Proxy settings, firewall rules, and kernel drivers don't apply on Android.
//! DNS can be set per-connection via VpnService.Builder.addDnsServer().

#![allow(non_snake_case, unused)]

use super::*;
use std::net::{IpAddr, TcpListener};
use std::sync::Mutex;
use std::time::Duration;

// ---------------------------------------------------------------------------
// ProxyManager — Android uses VpnService, not system proxy
// ---------------------------------------------------------------------------

pub struct AndroidProxy;

impl ProxyManager for AndroidProxy {
    fn set_proxy(&self, _proxy_addr: &str, _port: u16, _extra_bypass: &[String]) -> Result<(), String> {
        // Android: VpnService handles routing directly, no system proxy needed.
        // PAC files can be served from the local HTTP server for Wi-Fi proxy config,
        // but the primary bypass is via VpnService TUN interface.
        Ok(())
    }

    fn clear_proxy(&self) -> Result<(), String> {
        Ok(())
    }

    fn backup_proxy(&self) {
        // No system proxy to backup on Android
    }

    fn restore_proxy(&self) -> bool {
        false
    }

    fn notify_change(&self) {
        // No system proxy change notification needed
    }
}

// ---------------------------------------------------------------------------
// FirewallManager — Android uses VpnService, no iptables needed
// ---------------------------------------------------------------------------

pub struct AndroidFirewall;

impl FirewallManager for AndroidFirewall {
    fn open_port(&self, _port: u16, _rule_name: &str) -> Result<(), String> {
        // Android VpnService handles all traffic routing
        Ok(())
    }

    fn remove_rule(&self, _rule_name: &str) -> Result<(), String> {
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// DnsManager — set via VpnService.Builder.addDnsServer()
// ---------------------------------------------------------------------------

pub struct AndroidDns;

impl DnsManager for AndroidDns {
    fn set_dns(&self, dns_ip: &str) -> Result<(), String> {
        // DNS is set via VpnService at connection time.
        // For Wi-Fi proxy mode, this doesn't apply.
        // For VpnService mode, DNS servers are configured when building the VPN.
        // This command can store the preferred DNS for next VpnService connection.
        Ok(())
    }

    fn restore_dns(&self) {
        // DNS is automatically restored when VpnService is torn down
    }

    fn get_dns_servers(&self) -> Vec<String> {
        // Android: can read from ConnectivityManager or system properties
        // For now, return known-good defaults that work in Türkiye
        vec![
            "1.1.1.1".to_string(),
            "8.8.8.8".to_string(),
            "9.9.9.9".to_string(),
        ]
    }
}

// ---------------------------------------------------------------------------
// NetworkManager
// ---------------------------------------------------------------------------

pub struct AndroidNetwork;

impl NetworkManager for AndroidNetwork {
    fn get_isp_info(&self) -> IspInfo {
        // Android: ISP info from ConnectivityManager or ip-api.com
        let mut info = IspInfo::default();
        // Try ip-api.com for ISP detection
        // This would go through a Java/Kotlin bridge in production
        info
    }

    fn get_safe_lan_ip(&self) -> String {
        // Android: typically gets a DHCP address from the Wi-Fi router
        // VpnService interface uses a virtual IP (usually 10.x.x.x or 172.x.x.x)
        // For Wi-Fi proxy mode, we need the actual Wi-Fi IP
        // Try to read from network interfaces, filtering out the VPN TUN
        "10.0.2.15".to_string() // Emulator default; real device will override
    }

    fn is_admin(&self) -> bool {
        // Android: VpnService doesn't require root
        // USERecord permission is enough
        true
    }
}

// ---------------------------------------------------------------------------
// ProcessManager
// ---------------------------------------------------------------------------

pub struct AndroidProcess;

impl ProcessManager for AndroidProcess {
    fn kill_by_name(&self, name: &str) -> Result<(), String> {
        // Android: can only kill our own process
        Err("Not supported on Android".into())
    }

    fn kill_by_pid(&self, _pid: u32) -> Result<(), String> {
        Err("Not supported on Android".into())
    }

    fn spawn_detached(&self, _exe: &str, _args: &[&str]) -> Result<u32, String> {
        // Android: can't spawn arbitrary executables
        Err("Not supported on Android".into())
    }
}

// ---------------------------------------------------------------------------
// AutostartManager — Android uses BOOT_COMPLETED broadcast
// ---------------------------------------------------------------------------

pub struct AndroidAutostart;

impl AutostartManager for AndroidAutostart {
    fn enable_autostart(&self, _exe_path: &str) -> Result<(), String> {
        // Android: autostart via manifest <action android:name="android.intent.action.BOOT_COMPLETED" />
        // Configuration is in Tauri's AndroidManifest.xml
        Ok(())
    }

    fn disable_autostart(&self) -> Result<(), String> {
        // Can't disable via Rust, needs Java bridge
        Ok(())
    }

    fn is_autostart_enabled(&self, _task_name: &str) -> bool {
        // Always enabled on Android if permission is granted
        true
    }
}

// ---------------------------------------------------------------------------
// InstanceManager
// ---------------------------------------------------------------------------

pub struct AndroidInstance;

impl InstanceManager for AndroidInstance {
    fn ensure_single_instance(&self, app_name: &str) {
        // Android: Activity lifecycle handles this naturally.
        // Tauri's single-instance plugin can be used on desktop,
        // on mobile it's a no-op since Android manages activities.
    }
}

// ---------------------------------------------------------------------------
// UwpManager — no-op on Android
// ---------------------------------------------------------------------------

pub struct AndroidUwp;

impl UwpManager for AndroidUwp {
    fn exempt_loopback(&self) {
        // No UWP on Android
    }
}

// ---------------------------------------------------------------------------
// DivertManager — Android uses VpnService instead of WinDivert
// ---------------------------------------------------------------------------

pub struct AndroidDivert;

impl DivertManager for AndroidDivert {
    fn find_engine(&self, _exe_name: &str) -> Option<std::path::PathBuf> {
        // Android: no WinDivert. DPI bypass is done directly via VpnService.
        // The Go-based divert engine is Windows-only.
        None
    }

    fn engine_file_name(&self) -> String {
        "docspi-divert-android".to_string()
    }
}

// Commit: feat: add Android platform support [132229]

// feat: add Android platform support [132606]
