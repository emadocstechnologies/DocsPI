package com.docspi

import android.app.Application
import android.content.Intent
import android.os.Build

/**
 * DocsPI Application subclass — provides a static Context reference
 * for the Rust JNI bridge to start/stop the VpnService.
 *
 * Registered in AndroidManifest.xml via:
 *   <application android:name=".DocsPIApp" ...>
 *
 * This is REQUIRED because VpnService.startVpn() is a JNI entry point
 * called from Rust (mobile.rs android_bridge) and has no automatic
 * access to the Android Context.
 */
class DocsPIApp : Application() {

    companion object {
        @Volatile
        private var instance: DocsPIApp? = null

        /** Called from Rust via JNI (mobile.rs) to start the VPN */
        @JvmStatic
        fun startVpn(): Boolean {
            val app = instance ?: return false
            return try {
                val intent = Intent(app, DocsPiVpnService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    app.startForegroundService(intent)
                } else {
                    app.startService(intent)
                }
                true
            } catch (e: Exception) {
                android.util.Log.e("DocsPIApp", "startVpn failed: ${e.message}")
                false
            }
        }

        /** Called from Rust via JNI (mobile.rs) to stop the VPN */
        @JvmStatic
        fun stopVpn() {
            val app = instance ?: return
            try {
                app.stopService(Intent(app, DocsPiVpnService::class.java))
            } catch (e: Exception) {
                android.util.Log.e("DocsPIApp", "stopVpn failed: ${e.message}")
            }
        }

        /** Called from Rust via JNI to check VPN state */
        @JvmStatic
        fun isVpnActive(): Boolean {
            return DocsPiVpnService.isActive()
        }
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}
