use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VpnConfig {
    pub dns: String,
    pub proxy_port: u16,
    pub bypass_mode: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct VpnStatus {
    pub running: bool,
}

// ---------------------------------------------------------------------------
// Android — bridges to DocsPiVpnService via JNI
// ---------------------------------------------------------------------------

#[cfg(target_os = "android")]
mod android_bridge {
    use super::*;
    use jni::JNIEnv;
    use std::sync::atomic::{AtomicBool, Ordering};

    static VPN_RUNNING: AtomicBool = AtomicBool::new(false);

    /// Get the JNI environment from the current thread
    fn with_jni<F, R>(f: F) -> Result<R, String>
    where
        F: FnOnce(&mut JNIEnv) -> Result<R, String>,
    {
        let jvm = jni::JavaVM::current().map_err(|e| format!("JVM::current: {}", e))?;
        let mut env = jvm
            .attach_current_thread()
            .map_err(|e| format!("attach: {}", e))?;
        f(&mut env)
    }

    pub fn start_vpn_impl(config: VpnConfig) -> Result<(), String> {
        with_jni(|env| {
            let cls = env
                .find_class("com/docspi/DocsPIApp")
                .map_err(|e| format!("find_class: {}", e))?;

            let result = env.call_static_method(
                cls,
                "startVpn",
                "()Z",
                &[],
            );

            match result {
                Ok(val) if val.z().unwrap_or(false) => {
                    VPN_RUNNING.store(true, Ordering::Relaxed);
                    Ok(())
                }
                Ok(_) => Err("VpnService.startVpn returned false".into()),
                Err(e) => Err(format!("JNI call failed: {}", e)),
            }
        })
    }

    pub fn stop_vpn_impl() -> Result<(), String> {
        with_jni(|env| {
            let cls = env
                .find_class("com/docspi/DocsPIApp")
                .map_err(|e| format!("find_class: {}", e))?;

            let _ = env.call_static_method(cls, "stopVpn", "()V", &[]);

            VPN_RUNNING.store(false, Ordering::Relaxed);
            Ok(())
        })
    }

    pub fn vpn_status_impl() -> VpnStatus {
        let kotlin_running = with_jni(|env| {
            let cls = env
                .find_class("com/docspi/DocsPIApp")?;
            let result = env.call_static_method(cls, "isVpnActive", "()Z", &[])?;
            Ok(result.z().unwrap_or(false))
        })
        .unwrap_or(false);

        VpnStatus {
            running: kotlin_running,
        }
    }

}

#[cfg(target_os = "android")]
pub use android_bridge::*;

// ---------------------------------------------------------------------------
// Desktop stubs
// ---------------------------------------------------------------------------

#[cfg(not(target_os = "android"))]
mod desktop_stub {
    use super::*;

    pub fn start_vpn_impl(_config: VpnConfig) -> Result<(), String> {
        Err("VPN is only available on Android".to_string())
    }
    pub fn stop_vpn_impl() -> Result<(), String> {
        Ok(())
    }
    pub fn vpn_status_impl() -> VpnStatus {
        VpnStatus { running: false }
    }
}

#[cfg(not(target_os = "android"))]
pub use desktop_stub::*;
