//go:build ios

package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"syscall"
)

// neBackend reads/writes packets via NEPacketTunnelProvider flow.
// The packet flow is passed from Swift via a Unix domain socket.
type neBackend struct {
	fd  int
	cfg *Config
}

func newBackend(cfg *Config) PacketBackend {
	return &neBackend{fd: -1, cfg: cfg}
}

func (n *neBackend) Read() ([]byte, error) {
	buf := make([]byte, 65535)
	readLen, err := syscall.Read(n.fd, buf)
	if err != nil {
		return nil, err
	}
	pkt := make([]byte, readLen)
	copy(pkt, buf[:readLen])
	return pkt, nil
}

func (n *neBackend) Write(pkt []byte) error {
	_, err := syscall.Write(n.fd, pkt)
	return err
}

func (n *neBackend) Close() {
	if n.fd >= 0 {
		syscall.Close(n.fd)
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
	packetFD := flag.Int("packet-fd", -1, "NEPacketTunnelProvider packet flow FD")
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
	}

	fd := *packetFD
	if fd < 0 {
		envFd := os.Getenv("DOCSPI_PACKET_FD")
		if envFd != "" {
			fmt.Sscanf(envFd, "%d", &fd)
		}
	}
	if fd < 0 {
		fmt.Fprintln(os.Stderr, "[ERROR] Packet flow FD gerekli (--packet-fd veya DOCSPI_PACKET_FD)")
		os.Exit(1)
	}

	fmt.Printf("[DocsPIDivert] iOS NEPacketTunnelProvider mode — FD: %d\n", fd)
	backend := &neBackend{fd: fd, cfg: cfg}
	runEngine(backend, cfg)
}

// Commit: feat: implement iOS divert backend [132230]
