import NetworkExtension
import Network

/// DocsPI NEPacketTunnelProvider — intercepts all device traffic on iOS/iPadOS.
///
/// Tauri commands (via plugin):
///   - plugin:mobile://start_vpn  { dns, proxy_port, bypass_mode }
///   - plugin:mobile://stop_vpn
///   - plugin:mobile://vpn_status  → { running: bool, bytes_rx, bytes_tx }
class PacketTunnelProvider: NEPacketTunnelProvider {

    private var proxyPort: UInt16 = 8080
    private var dnsAddress = "1.1.1.1"

    private var packetQueue: DispatchQueue?
    private var isRunning = false

    // MARK: - Tunnel lifecycle

    override func startTunnel(options: [String : NSObject]? = nil) async throws {
        NSLog("[DocsPI VPN] Starting tunnel...")

        // Read config from options or provider preferences
        let proto = protocolConfiguration as? NETunnelProviderProtocol
        if let config = proto?.providerConfiguration {
            if let port = config["proxy_port"] as? UInt16 {
                proxyPort = port
            }
            if let dns = config["dns"] as? String {
                dnsAddress = dns
            }
        }

        // Build tunnel network settings
        let settings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "127.0.0.1")
        settings.mtu = 1500 as NSNumber

        // IPv4 settings — intercept all traffic
        let ipv4 = NEIPv4Settings(addresses: ["10.0.0.2"], subnetMasks: ["255.255.255.255"])
        ipv4.includedRoutes = [NEIPv4Route.default()]
        ipv4.excludedRoutes = [
            NEIPv4Route(destinationAddress: "10.0.0.0", subnetMask: "255.0.0.0"),
            NEIPv4Route(destinationAddress: "127.0.0.0", subnetMask: "255.0.0.0"),
        ]
        settings.ipv4Settings = ipv4

        // DNS settings
        let dns = NEDNSSettings(servers: [dnsAddress])
        settings.dnsSettings = dns

        // Proxy settings — local SOCKS5 proxy for DPI bypass
        let proxy = NEProxySettings()
        proxy.httpServer = NEProxyServer(address: "127.0.0.1", port: Int(proxyPort))
        proxy.httpsServer = NEProxyServer(address: "127.0.0.1", port: Int(proxyPort))
        proxy.autoProxyConfigurationEnabled = false
        proxy.httpEnabled = true
        proxy.httpsEnabled = true
        proxy.exceptionList = [
            "10.0.0.0/8",
            "172.16.0.0/12",
            "192.168.0.0/16",
            "*.apple.com",
            "captive.apple.com",
        ]
        settings.proxySettings = proxy

        // Apply tunnel settings
        try await setTunnelNetworkSettings(settings)

        isRunning = true
        packetQueue = DispatchQueue(label: "com.aydocs.docspi.packet")

        // Start reading packets from the TUN interface
        readPackets()

        NSLog("[DocsPI VPN] Tunnel started successfully")
    }

    override func stopTunnel(with reason: NEProviderStopReason) async {
        NSLog("[DocsPI VPN] Stopping tunnel: \(reason)")
        isRunning = false
        try? await setTunnelNetworkSettings(nil)
        cancelTunnelWithError(nil)
    }

    override func handleAppMessage(_ messageData: Data) async -> Data? {
        // Handle messages from the Tauri app
        let message = String(data: messageData, encoding: .utf8) ?? ""
        switch message {
        case "status":
            let status = "running=\(isRunning)"
            return status.data(using: .utf8)
        case "stop":
            await stopTunnel(with: .userInitiated)
            return "stopped".data(using: .utf8)
        default:
            return "ok".data(using: .utf8)
        }
    }

    // MARK: - Packet processing

    private func readPackets() {
        packetQueue?.async { [weak self] in
            guard let self = self else { return }
            while self.isRunning {
                self.packetFlow.readPackets { [weak self] packets, protocols in
                    guard let self = self else { return }
                    let processed = self.processPackets(packets, protocols: protocols)
                    if !processed.isEmpty {
                        self.packetFlow.writePackets(processed, withProtocols: protocols)
                    }
                }
            }
        }
    }

    private func processPackets(_ packets: [Data], protocols: [NSNumber]) -> [Data] {
        // TODO: integrate DPI bypass logic (packet fragmentation, etc.)
        // For now, forward all packets as-is
        // The actual DPI bypass runs on the local SOCKS5 proxy at 127.0.0.1:proxyPort
        return packets
    }
}

// Commit: feat: implement iOS PacketTunnelProvider [132230]

// feat: implement iOS PacketTunnelProvider [132607]
