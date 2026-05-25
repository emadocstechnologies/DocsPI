package com.aydocs.docspi

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.util.concurrent.atomic.AtomicBoolean

/**
 * DocsPI VpnService — intercepts all device traffic via Android VpnService API.
 *
 * Tauri commands:
 *   - plugin:mobile://start_vpn  { dns, proxy_port, bypass_mode }
 *   - plugin:mobile://stop_vpn
 *   - plugin:mobile://vpn_status  → { running: bool, bytes_rx, bytes_tx }
 */
class DocsPiVpnService : VpnService() {

    companion object {
        const val CHANNEL_ID = "docspi_vpn_channel"
        const val FOREGROUND_NOTIFY_ID = 1
        private var vpnInstance: DocsPiVpnService? = null
        private var vpnFd: ParcelFileDescriptor? = null
        private var running = AtomicBoolean(false)

        // Exposed for Tauri plugin bridge
        fun isRunning(): Boolean = running.get()
        fun startVpn(dns: String, proxyPort: Int, bypassMode: String): Boolean {
            val svc = vpnInstance ?: return false
            return svc.establishVpn(dns, proxyPort, bypassMode)
        }
        fun stopVpn() {
            running.set(false)
            vpnFd?.close()
            vpnFd = null
            vpnInstance?.stopForeground(STOP_FOREGROUND_REMOVE)
            vpnInstance?.stopSelf()
        }
    }

    override fun onCreate() {
        super.onCreate()
        vpnInstance = this
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification()
        startForeground(FOREGROUND_NOTIFY_ID, notification)
        return START_STICKY
    }

    override fun onDestroy() {
        stopVpn()
        vpnInstance = null
        super.onDestroy()
    }

    private fun establishVpn(dns: String, proxyPort: Int, bypassMode: String): Boolean {
        if (running.get()) return true

        val builder = Builder().apply {
            setSession("DocsPI VPN")
            setMtu(1500)

            // Add address and route for TUN interface
            addAddress("10.0.0.2", 32)
            addRoute("0.0.0.0", 0)    // intercept ALL traffic

            // DNS servers
            if (dns.isNotEmpty()) {
                addDnsServer(java.net.InetAddress.getByName(dns))
            } else {
                addDnsServer("1.1.1.1")
                addDnsServer("8.8.8.8")
            }

            // Proxy config — local proxy on 127.0.0.1:proxyPort
            // The SOCKS5 proxy handles DPI bypass (TLS fragment, etc.)
            if (proxyPort > 0) {
                addRoute("127.0.0.1", 32)
            }
        }

        // Exclude apps that shouldn't go through VPN
        // e.g., system connectivity checks, the app itself
        builder.addDisallowedApplication(packageName)

        return try {
            vpnFd = builder.establish()
            if (vpnFd != null) {
                running.set(true)
                startPacketForwarder(vpnFd!!)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    private fun startPacketForwarder(fd: ParcelFileDescriptor) {
        Thread {
            val input = FileInputStream(fd.fileDescriptor)
            val output = FileOutputStream(fd.fileDescriptor)
            val buffer = ByteBuffer.allocateDirect(65535)

            // Read loop — packets arrive as raw IP frames
            val readBuf = ByteArray(65535)
            while (running.get()) {
                try {
                    val len = input.read(readBuf)
                    if (len <= 0) break

                    buffer.clear()
                    buffer.put(readBuf, 0, len)
                    buffer.flip()

                    // Process packet through Go DPI bypass engine
                    // For now: forward all packets to SOCKS5 proxy at 127.0.0.1:proxyPort
                    processPacket(buffer, output)
                } catch (e: Exception) {
                    if (running.get()) e.printStackTrace()
                    break
                }
            }
        }.apply { isDaemon = true }.start()
    }

    private fun processPacket(packet: ByteBuffer, output: FileOutputStream) {
        // TODO: integrate with Go lib via gomobile
        // Currently forwards all packets as-is to the TUN interface
        val data = ByteArray(packet.remaining())
        packet.get(data)
        output.write(data)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "DocsPI VPN",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "DocsPI DPI Bypass VPN is running"
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

        val builder = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("DocsPI VPN")
            .setContentText("DPI bypass aktif — trafik yönlendiriliyor")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId(CHANNEL_ID)
        }

        return builder.build()
    }
}

// Commit: feat: add mobile bridge for Android VpnService [132230]
