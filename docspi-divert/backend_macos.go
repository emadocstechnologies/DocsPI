//go:build darwin

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

// utunBackend uses macOS utun interface for packet capture/injection.
// Falls back to SOCKS5 proxy mode when not root.
type utunBackend struct {
	fd  int
	cfg *Config
}

func newBackend(cfg *Config) PacketBackend {
	return &utunBackend{fd: -1, cfg: cfg}
}

func (u *utunBackend) Read() ([]byte, error) {
	buf := make([]byte, 65535)
	n, err := syscall.Read(u.fd, buf)
	if err != nil {
		return nil, err
	}
	pkt := make([]byte, n)
	copy(pkt, buf[:n])
	return pkt, nil
}

func (u *utunBackend) Write(pkt []byte) error {
	_, err := syscall.Write(u.fd, pkt)
	return err
}

func (u *utunBackend) Close() {
	if u.fd >= 0 {
		syscall.Close(u.fd)
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

	isRoot := syscall.Geteuid() == 0

	if !isRoot && *proxyPort == 0 {
		fmt.Fprintln(os.Stderr, "[WARN] Root gerekli veya --proxy-port ile SOCKS5 modunu kullanın")
		os.Exit(1)
	}

	if isRoot {
		// Setup pf rules for traffic redirect
		setupPFRules()
		defer cleanupPFRules()

		// Open utun interface
		fd := openUTUN()
		if fd < 0 {
			fmt.Fprintln(os.Stderr, "[ERROR] utun açılamadı")
			os.Exit(1)
		}
		defer syscall.Close(fd)

		if *dnsRedirect {
			setMacDNS(*dnsAddr)
		}

		backend := &utunBackend{fd: fd, cfg: cfg}
		runEngine(backend, cfg)

		if *dnsRedirect {
			restoreMacDNS()
		}
	} else {
		fmt.Printf("[DocsPIDivert] Kullanıcı modu — SOCKS5 proxy port: %d\n", *proxyPort)
		runSOCKS5ProxyMac(*proxyPort, cfg)
	}
}

func setupPFRules() {
	exec.Command("sudo", "pfctl", "-a", "com.docspi/divert", "-F", "all").Run()
	exec.Command("sudo", "pfctl", "-a", "com.docspi/divert", "-f", "-").Run()
}

func cleanupPFRules() {
	exec.Command("sudo", "pfctl", "-a", "com.docspi/divert", "-F", "all").Run()
}

func openUTUN() int {
	// macOS utun interface: open /dev/tunN
	for i := 0; i < 16; i++ {
		path := fmt.Sprintf("/dev/tun%d", i)
		fd, err := syscall.Open(path, syscall.O_RDWR, 0)
		if err == nil {
			return fd
		}
	}
	return -1
}

func setMacDNS(dnsAddr string) {
	exec.Command("networksetup", "-setdnsservers", "Wi-Fi", dnsAddr).Run()
}

func restoreMacDNS() {
	exec.Command("networksetup", "-setdnsservers", "Wi-Fi", "empty").Run()
}

func runSOCKS5ProxyMac(port int, cfg *Config) {
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
	conn.Write([]byte{0x05, 0x00})
	n, _ = conn.Read(buf)
	if n < 10 {
		return
	}
	atyp := buf[3]
	var dst string
	switch atyp {
	case 0x01:
		dst = fmt.Sprintf("%d.%d.%d.%d:%d", buf[4], buf[5], buf[6], buf[7],
			int(buf[8])<<8|int(buf[9]))
	case 0x03:
		len := int(buf[4])
		dst = fmt.Sprintf("%s:%d", string(buf[5:5+len]),
			int(buf[5+len])<<8|int(buf[6+len]))
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



