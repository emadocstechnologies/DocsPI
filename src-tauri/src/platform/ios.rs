//! iOS / iPadOS implementation of the DocsPI platform abstraction layer.
//!
//! iOS uses NEPacketTunnelProvider (NetworkExtension framework) for DPI bypass.
//! This provides a TUN interface similar to Android's VpnService.
//!
//! iOS has stricter sandbox restrictions:
//!   - No arbitrary process spawning
//!   - No system proxy configuration (except via PAC on Wi-Fi)
//!   - NetworkExtension requires VPN entitlement
//!   - App Store review implications for DPI tools
//!
//! iPadOS shares the exact same NetworkExtension APIs as iOS.

#![allow(non_snake_case, unused)]

use super::*;
use std::net::{IpAddr, TcpListener};
use std::sync::Mutex;
use std::time::Duration;

// ---------------------------------------------------------------------------
// ProxyManager — iOS uses NEPacketTunnelProvider, not system proxy
// ---------------------------------------------------------------------------

pub struct IosProxy;

impl ProxyManager for IosProxy {
    fn set_proxy(&self, _proxy_addr: &str, _port: u16, _extra_bypass: &[String]) -> Result<(), String> {
        Ok(())
    }

    fn clear_proxy(&self) -> Result<(), String> {
        Ok(())
    }

    fn backup_proxy(&self) {}

    fn restore_proxy(&self) -> bool { false }

    fn notify_change(&self) {}
}

// ---------------------------------------------------------------------------
// FirewallManager
// ---------------------------------------------------------------------------

pub struct IosFirewall;

impl FirewallManager for IosFirewall {
    fn open_port(&self, _port: u16, _rule_name: &str) -> Result<(), String> { Ok(()) }
    fn remove_rule(&self, _rule_name: &str) -> Result<(), String> { Ok(()) }
}

// ---------------------------------------------------------------------------
// DnsManager — set via NEPacketTunnelProvider
// ---------------------------------------------------------------------------

pub struct IosDns;

impl DnsManager for IosDns {
    fn set_dns(&self, _dns_ip: &str) -> Result<(), String> {
        // DNS is configured in NEPacketTunnelNetworkSettings
        Ok(())
    }

    fn restore_dns(&self) {}

    fn get_dns_servers(&self) -> Vec<String> {
        vec!["1.1.1.1".to_string(), "8.8.8.8".to_string()]
    }
}

// ---------------------------------------------------------------------------
// NetworkManager
// ---------------------------------------------------------------------------

pub struct IosNetwork;

impl NetworkManager for IosNetwork {
    fn get_isp_info(&self) -> IspInfo {
        // iOS: limited network info via NWPathMonitor / CTTelephonyNetworkInfo
        // For now return defaults
        IspInfo::default()
    }

    fn get_safe_lan_ip(&self) -> String {
        // iOS: NWPathMonitor gives interface info
        // NEPacketTunnelProvider assigns a virtual IP
        "127.0.0.1".to_string()
    }

    fn is_admin(&self) -> bool {
        // iOS: no root concept for apps
        true
    }
}

// ---------------------------------------------------------------------------
// ProcessManager — severely restricted on iOS
// ---------------------------------------------------------------------------

pub struct IosProcess;

impl ProcessManager for IosProcess {
    fn kill_by_name(&self, _name: &str) -> Result<(), String> {
        Err("Not supported on iOS".into())
    }
    fn kill_by_pid(&self, _pid: u32) -> Result<(), String> {
        Err("Not supported on iOS".into())
    }
    fn spawn_detached(&self, _exe: &str, _args: &[&str]) -> Result<u32, String> {
        Err("Not supported on iOS".into())
    }
}

// ---------------------------------------------------------------------------
// AutostartManager — iOS has no autostart concept
// ---------------------------------------------------------------------------

pub struct IosAutostart;

impl AutostartManager for IosAutostart {
    fn enable_autostart(&self, _exe_path: &str) -> Result<(), String> { Ok(()) }
    fn disable_autostart(&self) -> Result<(), String> { Ok(()) }
    fn is_autostart_enabled(&self, _task_name: &str) -> bool { false }
}

// ---------------------------------------------------------------------------
// InstanceManager
// ---------------------------------------------------------------------------

pub struct IosInstance;

impl InstanceManager for IosInstance {
    fn ensure_single_instance(&self, _app_name: &str) {
        // iOS: system manages app lifecycle
    }
}

// ---------------------------------------------------------------------------
// UwpManager — no-op on iOS
// ---------------------------------------------------------------------------

pub struct IosUwp;

impl UwpManager for IosUwp {
    fn exempt_loopback(&self) {}
}

// ---------------------------------------------------------------------------
// DivertManager — iOS uses NEPacketTunnelProvider instead of WinDivert
// ---------------------------------------------------------------------------

pub struct IosDivert;

impl DivertManager for IosDivert {
    fn find_engine(&self, _exe_name: &str) -> Option<std::path::PathBuf> { None }
    fn engine_file_name(&self) -> String { "docspi-divert-ios".to_string() }
}

// Commit: feat: implement iOS platform support [132229]
