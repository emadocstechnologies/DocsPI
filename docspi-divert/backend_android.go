//go:build android

package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"syscall"
)

// vpnBackend reads/writes packets via Android VpnService FileDescriptor.
// The FD is passed from Java/Kotlin via a Unix domain socket or env var.
type vpnBackend struct {
	fd  int
	cfg *Config
}

func newBackend(cfg *Config) PacketBackend {
	return &vpnBackend{fd: -1, cfg: cfg}
}

func (v *vpnBackend) Read() ([]byte, error) {
	buf := make([]byte, 65535)
	n, err := syscall.Read(v.fd, buf)
	if err != nil {
		return nil, err
	}
	pkt := make([]byte, n)
	copy(pkt, buf[:n])
	return pkt, nil
}

func (v *vpnBackend) Write(pkt []byte) error {
	_, err := syscall.Write(v.fd, pkt)
	return err
}

func (v *vpnBackend) Close() {
	if v.fd >= 0 {
		syscall.Close(v.fd)
	}
}

func main() {
	mode := flag.String("mode", "game", "game or super")
	autoTTL := flag.Bool("auto-ttl", true, "enable auto-ttl")
	blockQUIC := flag.Bool("block-quic", true, "block QUIC/HTTP3")
	wrongChksum := flag.Bool("wrong-chksum", true, "send fake wrong-checksum packet")
	wrongSeq := flag.Bool("wrong-seq", true, "send fake wrong-seq packet")
	proxyPort := flag.Int("proxy-port", 8080, "local proxy port")
	pidFile := flag.String("pid-file", "", "write PID to this file")
	fakeSNI := flag.String("fake-sni", "www.google.com", "fake SNI for fragmentation")
	ipFragId := flag.Int("ip-frag-id", 0, "custom IP ID for fragmentation (0=auto)")
	ipFragSize := flag.Int("ip-frag-size", 0, "IP fragment size in bytes (0=off)")
	fakeHello := flag.Bool("fake-hello", false, "randomized TLS fingerprint injection")
	vpnFd := flag.Int("vpn-fd", -1, "VpnService FileDescriptor (from Java)")
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
		ProxyPort:   *proxyPort,
		FakeSNI:     *fakeSNI,
		IpFragId:    *ipFragId,
		IpFragSize:  *ipFragSize,
		FakeHello:   *fakeHello,
	}

	fd := *vpnFd
	if fd < 0 {
		// Try reading from env var (set by Tauri plugin)
		envFd := os.Getenv("DOCSPI_VPN_FD")
		if envFd != "" {
			fmt.Sscanf(envFd, "%d", &fd)
		}
	}
	if fd < 0 {
		fmt.Fprintln(os.Stderr, "[ERROR] VpnService FD gerekli (--vpn-fd veya DOCSPI_VPN_FD)")
		os.Exit(1)
	}

	fmt.Printf("[DocsPIDivert] Android VpnService mode — FD: %d\n", fd)
	backend := &vpnBackend{fd: fd, cfg: cfg}
	runEngine(backend, cfg)
}


