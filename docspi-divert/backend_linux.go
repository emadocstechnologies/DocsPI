//go:build linux && !android

package main

import (
	"encoding/binary"
	"flag"
	"fmt"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"strconv"
	"syscall"

	"golang.org/x/sys/unix"
)

// afPacketBackend uses AF_PACKET raw socket for packet capture
// and IPPROTO_RAW socket for injection. Works without libnetfilter_queue.
type afPacketBackend struct {
	packetFD int      // AF_PACKET SOCK_RAW for capture
	rawFD    int      // IPPROTO_RAW for injection
	cfg      *Config
}

func newBackend(cfg *Config) PacketBackend {
	return &afPacketBackend{packetFD: -1, rawFD: -1, cfg: cfg}
}

func (b *afPacketBackend) openCapture() error {
	// AF_PACKET captures at Ethernet layer (ETH_P_IP = 0x0800, network order)
	proto := htons(0x0800)
	fd, err := syscall.Socket(syscall.AF_PACKET, syscall.SOCK_RAW, int(proto))
	if err != nil {
		return fmt.Errorf("AF_PACKET socket: %w", err)
	}
	b.packetFD = fd
	return nil
}

func (b *afPacketBackend) openInject() error {
	fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_RAW, syscall.IPPROTO_RAW)
	if err != nil {
		return fmt.Errorf("IPPROTO_RAW socket: %w", err)
	}
	// We provide the full IP header
	if err := syscall.SetsockoptInt(fd, syscall.IPPROTO_IP, unix.IP_HDRINCL, 1); err != nil {
		syscall.Close(fd)
		return fmt.Errorf("IP_HDRINCL: %w", err)
	}
	b.rawFD = fd
	return nil
}

func (b *afPacketBackend) Read() ([]byte, error) {
	buf := make([]byte, 65535)
	n, err := syscall.Read(b.packetFD, buf)
	if err != nil {
		return nil, err
	}
	if n < 14 {
		return nil, fmt.Errorf("packet too short (Ethernet header)")
	}
	// Ethernet frame: dstMAC(6) + srcMAC(6) + EtherType(2)
	// Skip Ethernet header; return raw IP packet
	pkt := make([]byte, n-14)
	copy(pkt, buf[14:n])
	return pkt, nil
}

func (b *afPacketBackend) Write(pkt []byte) error {
	// Send raw IP packet (full IP header included)
	_, err := syscall.Write(b.rawFD, pkt)
	return err
}

func (b *afPacketBackend) Close() {
	if b.packetFD >= 0 {
		syscall.Close(b.packetFD)
	}
	if b.rawFD >= 0 {
		syscall.Close(b.rawFD)
	}
}

func htons(x uint16) uint16 {
	return (x << 8) | (x >> 8)
}

// ── iptables helpers ──────────────────────────────────────────

func setupIptablesRules() {
	// Drop matching TCP/443 packets — the raw socket captures them,
	// we re-inject the processed version via the raw injection socket.
	exec.Command("/sbin/iptables", "-t", "mangle", "-A", "PREROUTING",
		"-p", "tcp", "--dport", "443",
		"-j", "DROP").Run()
	// Also handle QUIC (UDP/443) the same way
	exec.Command("/sbin/iptables", "-t", "mangle", "-A", "PREROUTING",
		"-p", "udp", "--dport", "443",
		"-j", "DROP").Run()
}

func cleanupIptablesRules() {
	exec.Command("/sbin/iptables", "-t", "mangle", "-D", "PREROUTING",
		"-p", "tcp", "--dport", "443",
		"-j", "DROP").Run()
	exec.Command("/sbin/iptables", "-t", "mangle", "-D", "PREROUTING",
		"-p", "udp", "--dport", "443",
		"-j", "DROP").Run()
}

// ── DNS helpers ───────────────────────────────────────────────

func setLinuxDNS(dnsAddr string) {
	exec.Command("/usr/bin/resolvectl", "dns", "global", dnsAddr).Run()
}

func restoreLinuxDNS() {
	exec.Command("/usr/bin/resolvectl", "dns", "global", "").Run()
}

// ── Main ──────────────────────────────────────────────────────

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

	isRoot := syscall.Geteuid() == 0

	if !isRoot && *proxyPort == 0 {
		fmt.Fprintln(os.Stderr, "[WARN] Root gerekli veya --proxy-port ile SOCKS5 modunu kullanın")
		os.Exit(1)
	}

	if isRoot {
		backend := newBackend(cfg).(*afPacketBackend)

		// Open capture + injection sockets
		if err := backend.openCapture(); err != nil {
			fmt.Fprintf(os.Stderr, "[ERROR] Capture socket: %v\n", err)
			os.Exit(1)
		}
		defer backend.Close()

		if err := backend.openInject(); err != nil {
			fmt.Fprintf(os.Stderr, "[ERROR] Inject socket: %v\n", err)
			os.Exit(1)
		}

		// Intercept TCP/443 and UDP/443 traffic
		setupIptablesRules()
		defer cleanupIptablesRules()

		if *dnsRedirect {
			setLinuxDNS(*dnsAddr)
			defer restoreLinuxDNS()
		}

		fmt.Println("[DocsPIDivert] Linux AF_PACKET root modu aktif (TLS bypass + fragmentation)")
		runEngine(backend, cfg)
	} else {
		fmt.Printf("[DocsPIDivert] Kullanıcı modu — SOCKS5 proxy port: %d\n", *proxyPort)
		runSOCKS5Proxy(*proxyPort, cfg)
	}
}

// ── SOCKS5 proxy (non-root fallback) ──────────────────────────

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
	atyp := buf[3]
	var dst string
	switch atyp {
	case 0x01: // IPv4
		dst = fmt.Sprintf("%d.%d.%d.%d:%d", buf[4], buf[5], buf[6], buf[7],
			int(binary.BigEndian.Uint16(buf[8:10])))
	case 0x03: // Domain name
		length := int(buf[4])
		if 5+length+2 > len(buf) {
			return
		}
		dst = fmt.Sprintf("%s:%d", string(buf[5:5+length]),
			int(binary.BigEndian.Uint16(buf[5+length:5+length+2])))
	}
	if dst == "" {
		return
	}

	target, err := net.Dial("tcp", dst)
	if err != nil {
		return
	}
	defer target.Close()

	conn.Write([]byte{0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00})

	// Bidirectional copy with TLS fragmentation on upstream
	go func() {
		buf := make([]byte, 65535)
		for {
			n, err := target.Read(buf)
			if err != nil {
				break
			}
			conn.Write(buf[:n])
		}
	}()

	buf2 := make([]byte, 65535)
	for {
		n, err := conn.Read(buf2)
		if err != nil {
			break
		}
		if n > 5 && buf2[0] == 0x16 && buf2[5] == 0x01 {
			splitAt := 2
			if splitAt >= n {
				target.Write(buf2[:n])
				continue
			}
			target.Write(buf2[:splitAt])
			target.Write(buf2[splitAt:])
		} else {
			target.Write(buf2[:n])
		}
	}
}
