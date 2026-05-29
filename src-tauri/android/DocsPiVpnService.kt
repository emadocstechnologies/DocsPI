package com.docspi

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import kotlinx.coroutines.*

/**
 * DocsPI VpnService — intercepts all device traffic via TUN interface
 * and forwards raw packets to the Go divert engine for DPI bypass.
 *
 * Architecture:
 *   VpnService.establish() → TUN fd
 *       → passed to Go backend (--vpn-fd)
 *       → Go reads/writes raw IP packets
 *       → processed via engine.go (TLS fragmentation, TTL, etc.)
 *
 * Started by: DocsPIApp (Application subclass) via Intent
 * Build deps: compileSdk 34+, targetSdk 34
 */
class DocsPiVpnService : VpnService() {

    companion object {
        private const val NOTIF_CHANNEL_ID = "docspi_vpn"
        private const val NOTIF_ID = 1001
        private const val TAG = "DocsPiVpn"

        @Volatile
        private var vpnActive = false

        @JvmStatic
        fun isActive(): Boolean = vpnActive

        @JvmStatic
        fun stopAll() {
            val app = DocsPIApp.instance ?: return
            app.stopService(Intent(app, DocsPiVpnService::class.java))
        }
    }

    private var vpnInterface: ParcelFileDescriptor? = null
    private var divertProcess: Process? = null
    private var scope: CoroutineScope? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification()
        startForeground(NOTIF_ID, notification)

        scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
        scope?.launch {
            establishVpn()
        }

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        vpnActive = false
        divertProcess?.destroy()
        divertProcess = null
        vpnInterface?.close()
        vpnInterface = null
        scope?.cancel()
        scope = null
    }

    private fun establishVpn() {
        val builder = Builder().apply {
            setName("DocsPI DPI Bypass")
            setMtu(1500)

            addAddress("10.0.0.2", 32)
            addRoute("0.0.0.0", 1)
            addRoute("128.0.0.0", 1)

            addDnsServer("1.1.1.1")
            addDnsServer("8.8.8.8")

            addRoute("10.0.0.0", 8)
            addRoute("172.16.0.0", 12)
            addRoute("192.168.0.0", 16)

            addAllowedApplication(packageName)
        }

        val tunFd = builder.establish() ?: run {
            android.util.Log.e(TAG, "VpnService establish() returned null")
            stopSelf()
            return
        }

        vpnInterface = tunFd
        vpnActive = true
        android.util.Log.i(TAG, "VPN established, fd=${tunFd.fd}")

        val divertBinary = getDir("binaries", 0)
            .resolve("docspi-divert")
            ?.absolutePath

        if (divertBinary == null || !java.io.File(divertBinary).exists()) {
            android.util.Log.e(TAG, "divert binary not found")
            tunFd.close()
            vpnInterface = null
            vpnActive = false
            stopSelf()
            return
        }

        val pb = ProcessBuilder(
            divertBinary,
            "--mode", "game",
            "--vpn-fd", tunFd.fd.toString(),
            "--pid-file", "${filesDir}/docspi_divert.pid"
        )
        pb.environment()["DOCSPI_VPN_FD"] = tunFd.fd.toString()
        pb.redirectErrorStream(true)

        try {
            divertProcess = pb.start()
            android.util.Log.i(TAG, "Divert engine started (PID: ${divertProcess?.pid()})")
            divertProcess?.waitFor()
        } catch (e: Exception) {
            android.util.Log.e(TAG, "Divert engine error: ${e.message}")
        } finally {
            tunFd.close()
            vpnInterface = null
            vpnActive = false
            stopSelf()
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIF_CHANNEL_ID,
                "DocsPI VPN",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "DocsPI DPI bypass active"
                setShowBadge(false)
            }
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val openIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, NOTIF_CHANNEL_ID)
        } else {
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("DocsPI")
            .setContentText("DPI bypass aktif")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }
}
