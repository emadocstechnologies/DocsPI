package com.docspi

import android.app.Application
import android.content.Intent
import android.os.Build

class DocsPIApp : Application() {

    companion object {
        @Volatile
        var instance: DocsPIApp? = null
            private set

        @Volatile
        private var pendingVpnIntent: Intent? = null

        /** 
         * Called by VpnService when it needs to forward the prepare() intent
         * to the main activity for user approval.
         */
        fun setPendingVpnIntent(intent: Intent) {
            pendingVpnIntent = intent
        }

        fun getAndClearPendingVpnIntent(): Intent? {
            val i = pendingVpnIntent
            pendingVpnIntent = null
            return i
        }

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

        /** Called from Rust via JNI to get received bytes */
        @JvmStatic
        fun getVpnBytesRx(): Long {
            return DocsPiVpnService.getBytesRx()
        }

        /** Called from Rust via JNI to get sent bytes */
        @JvmStatic
        fun getVpnBytesTx(): Long {
            return DocsPiVpnService.getBytesTx()
        }
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}
