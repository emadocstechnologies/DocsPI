//go:build linux

package main

import (
	"flag"
	"fmt"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"strconv"
	"syscall"
)

// nfqueueBackend uses Linux nfqueue for packet capture + raw socket for injection.
// When running as non-root, falls back to SOCKS5 proxy mode.
type nfqueueBackend struct {
	queueFD   int
	rawSocket int
	cfg       *Config
}

func newBackend(cfg *Config) PacketBackend {
	return &nfqueueBackend{cfg: cfg}
}

func (n *nfqueueBackend) Read() ([]byte, error) {
	// Read from nfqueue
	buf := make([]byte, 65535)
	nread, err := syscall.Read(n.queueFD, buf)
	if err != nil {
		return nil, err
	}
	// Parse nfqueue header to extract IP packet
	// nfqueue prepends a header — skip it (simplified)
	// Full implementation uses libnetfilter_queue
	if nread < 20 {
		return nil, fmt.Errorf("packet too short")
	}
	// Simplified: assume raw IP packet after NFQ header
	pkt := make([]byte, nread)
	copy(pkt, buf[:nread])
	return pkt, nil
}

func (n *nfqueueBackend) Write(pkt []byte) error {
	// Use raw socket to inject modified packet
	_, err := syscall.Write(n.rawSocket, pkt)
	return err
}

func (n *nfqueueBackend) Close() {
	if n.queueFD > 0 {
		syscall.Close(n.queueFD)
	}
	if n.rawSocket > 0 {
		syscall.Close(n.rawSocket)
	}
}

func main() {
	mode := flag.String("mode", "game", "game or super")
	autoTTL := flag.Bool("auto-ttl", true, "enable auto-ttl")
	blockQUIC := flag.Bool("block-quic", true, "block QUIC/HTTP3")
	wrongChksum := flag.Bool("wrong-chksum", true, "send fake wrong-checksum packet")
	wrongSeq := flag.Bool("wrong-seq", true, "send fake wrong-seq packet")
	dnsRedirect := flag.Bool("dns-redirect", false, "change system DNS")
	dnsAddr := flag.String("dns-addr", "1.1.1.1", "DNS server address")
	proxyPort := flag.Int("proxy-port", 0, "SOCKS5 proxy port (user mode)")
	pidFile := flag.String("pid-file", "", "write PID to this file")
	fakeSNI := flag.String("fake-sni", "www.google.com", "fake SNI for fragmentation")
	flag.Parse()

	if *pidFile != "" {
		_ = os.WriteFile(*pidFile, []byte(strconv.Itoa(os.Getpid())), 0644)
		defer os.Remove(*pidFile)
	}

	cfg := &Config{
		Mode:        *mode,
		AutoTTL:     *autoTTL,
		BlockQUIC:   *blockQUIC,
		WrongChksum: *wrongChksum,
		WrongSeq:    *wrongSeq,
		DNSRedirect: *dnsRedirect,
		DNSAddr:     *dnsAddr,
		ProxyPort:   *proxyPort,
		FakeSNI:     *fakeSNI,
	}

	// Check root
	isRoot := syscall.Geteuid() == 0

	if !isRoot && *proxyPort == 0 {
		fmt.Fprintln(os.Stderr, "[WARN] Root gerekli veya --proxy-port ile SOCKS5 modunu kullanın")
		os.Exit(1)
	}

	if isRoot {
		// Setup iptables rules for NFQUEUE
		setupIptablesRules()
		defer cleanupIptablesRules()

		// Open nfqueue
		openNFQueue()

		if *dnsRedirect {
			setLinuxDNS(*dnsAddr)
		}

		backend := newBackend(cfg)
		runEngine(backend, cfg)

		if *dnsRedirect {
			restoreLinuxDNS()
		}
	} else {
		fmt.Printf("[DocsPIDivert] Kullanıcı modu — SOCKS5 proxy port: %d\n", *proxyPort)
		// SOCKS5 proxy mode — no kernel module needed
		runSOCKS5Proxy(*proxyPort, cfg)
	}
}

func setupIptablesRules() {
	exec.Command("/sbin/iptables", "-t", "raw", "-A", "PREROUTING",
		"-p", "tcp", "--dport", "443",
		"-j", "NFQUEUE", "--queue-num", "0").Run()
}

func cleanupIptablesRules() {
	exec.Command("/sbin/iptables", "-t", "raw", "-D", "PREROUTING",
		"-p", "tcp", "--dport", "443",
		"-j", "NFQUEUE", "--queue-num", "0").Run()
}

func openNFQueue() {
	// TODO: use libnetfilter_queue or netlink directly
	// For now, create raw socket as fallback
	fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_RAW, syscall.IPPROTO_TCP)
	if err != nil {
		fmt.Fprintf(os.Stderr, "[ERROR] Raw socket: %v\n", err)
		os.Exit(1)
	}
	_ = fd // Placeholder — full nfqueue impl when libnetfilter_queue available
}

func setLinuxDNS(dnsAddr string) {
	exec.Command("/usr/bin/resolvectl", "dns", "global", dnsAddr).Run()
}

func restoreLinuxDNS() {
	exec.Command("/usr/bin/resolvectl", "dns", "global", "").Run()
}

func runSOCKS5Proxy(port int, cfg *Config) {
	ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
	if err != nil {
		fmt.Fprintf(os.Stderr, "[ERROR] SOCKS5: %v\n", err)
		os.Exit(1)
	}
	defer ln.Close()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigCh
		ln.Close()
	}()

	for {
		conn, err := ln.Accept()
		if err != nil {
			break
		}
		go handleSOCKS5(conn, cfg)
	}
}

func handleSOCKS5(conn net.Conn, cfg *Config) {
	defer conn.Close()
	// SOCKS5 handshake + DPI bypass proxy
	// Full implementation: https://tools.ietf.org/html/rfc1928
	buf := make([]byte, 256)
	n, _ := conn.Read(buf)
	if n < 2 {
		return
	}
	// SOCKS5: respond with no auth
	conn.Write([]byte{0x05, 0x00})
	// Read request
	n, _ = conn.Read(buf)
	if n < 10 {
		return
	}
	// Extract destination address
	atyp := buf[3]
	var dst string
	switch atyp {
	case 0x01: // IPv4
		dst = fmt.Sprintf("%d.%d.%d.%d:%d", buf[4], buf[5], buf[6], buf[7],
			int(buf[8])<<8|int(buf[9]))
	case 0x03: // Domain name
		len := int(buf[4])
		dst = fmt.Sprintf("%s:%d", string(buf[5:5+len]),
			int(buf[5+len])<<8|int(buf[6+len]))
	}
	if dst == "" {
		return
	}

	// Connect to target
	target, err := net.Dial("tcp", dst)
	if err != nil {
		return
	}
	defer target.Close()

	// Respond with success
	conn.Write([]byte{0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00})

	// Bidirectional copy with DPI bypass on upstream
	go func() {
		buf := make([]byte, 65535)
		for {
			n, err := target.Read(buf)
			if err != nil {
				break
			}
			// Apply DPI bypass on downstream data (TLS fragmentation)
			conn.Write(buf[:n])
		}
	}()

	// Upstream: fragment TLS ClientHello
	buf2 := make([]byte, 65535)
	for {
		n, err := conn.Read(buf2)
		if err != nil {
			break
		}
		// If this is a TLS ClientHello, fragment it
		if n > 5 && buf2[0] == 0x16 && buf2[5] == 0x01 {
			// Split into 2 fragments
			splitAt := 2
			if splitAt >= n {
				target.Write(buf2[:n])
				continue
			}
			// Send fragment 1 (first 2 bytes)
			target.Write(buf2[:splitAt])
			// Send fragment 2 (rest)
			target.Write(buf2[splitAt:])
		} else {
			target.Write(buf2[:n])
		}
	}
}



