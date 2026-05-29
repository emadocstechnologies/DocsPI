//go:build windows

package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"sync"
	"syscall"
	"time"
)

type winDivertBackend struct {
	handle syscall.Handle
	pktBuf []byte
	addrBuf []byte
}

func newBackend(cfg *Config) PacketBackend {
	return &winDivertBackend{
		pktBuf:  make([]byte, MAX_PACKET_SIZE),
		addrBuf: make([]byte, WINDIVERT_ADDR_SIZE),
	}
}

func (w *winDivertBackend) Read() ([]byte, error) {
	n, err := divertRecv(w.handle, w.pktBuf, w.addrBuf)
	if err != nil {
		return nil, err
	}
	pkt := make([]byte, n)
	copy(pkt, w.pktBuf[:n])
	return pkt, nil
}

func (w *winDivertBackend) Write(pkt []byte) error {
	return divertSend(w.handle, pkt, w.addrBuf)
}

func (w *winDivertBackend) Close() {
	divertClose(w.handle)
}

func runWinDivertEngine(backend PacketBackend, cfg *Config) {
	startTTLTableCleaner()
	fmt.Printf("[DocsPIDivert] Mod: %s | AutoTTL: %v | BlockQUIC: %v | WrongChksum: %v | WrongSeq: %v\n",
		cfg.Mode, cfg.AutoTTL, cfg.BlockQUIC, cfg.WrongChksum, cfg.WrongSeq)

	var wg sync.WaitGroup

	// RST dropper
	wg.Add(1)
	go func() {
		defer wg.Done()
		runRSTDropper()
	}()

	// QUIC blocker
	if cfg.BlockQUIC {
		wg.Add(1)
		go func() {
			defer wg.Done()
			runQUICBlocker()
		}()
	}

	// TCP engine
	if cfg.AutoTTL || cfg.WrongChksum || cfg.WrongSeq {
		wd := backend.(*winDivertBackend)
		filter := filterOutTCP
		if cfg.AutoTTL {
			filter = "(" + filterOutTCP + ") or (" + filterInSYNACK + ")"
		}
		var err error
		wd.handle, err = openWithRetry(filter, WINDIVERT_FLAG_DEFAULT)
		if err != nil {
			fmt.Printf("[DIVERT] TCP engine açılamadı: %v\n", err)
			return
		}

		fmt.Println("[DIVERT] WinDivert TCP engine aktif (TLS bypass + fragmentation)")
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				n, err := divertRecv(wd.handle, wd.pktBuf, wd.addrBuf)
				if err != nil {
					continue
				}
				data := wd.pktBuf[:n]
				addrData := wd.addrBuf

				if addrIsOutbound(addrData) {
					// Use cross-platform packet processing
					processPacket(wd, data, cfg)
				} else {
					// Inbound SYN-ACK for TTL estimation
					processTCPInbound(data)
					_ = divertSend(wd.handle, data, addrData)
				}
			}
		}()
	}

	wg.Wait()
}

func openWithRetry(filter string, flags int) (syscall.Handle, error) {
	var h syscall.Handle
	var err error
	for i := 0; i < 6; i++ {
		h, err = divertOpen(filter, WINDIVERT_LAYER_NETWORK, 0, flags)
		if err == nil {
			return h, nil
		}
		time.Sleep(500 * time.Millisecond)
	}
	return syscall.InvalidHandle, err
}

func runRSTDropper() {
	h, err := openWithRetry(filterDropRST, WINDIVERT_FLAG_DROP)
	if err != nil {
		fmt.Printf("[DIVERT] RST dropper açılamadı: %v\n", err)
		return
	}
	defer divertClose(h)
	fmt.Println("[DIVERT] Pasif DPI savunması aktif (RST drop)")

	pkt := make([]byte, MAX_PACKET_SIZE)
	addr := make([]byte, WINDIVERT_ADDR_SIZE)
	for {
		_, err := divertRecv(h, pkt, addr)
		if err != nil {
			continue
		}
	}
}

func runQUICBlocker() {
	h, err := openWithRetry(filterQUIC, WINDIVERT_FLAG_DEFAULT)
	if err != nil {
		fmt.Printf("[DIVERT] QUIC blocker açılamadı: %v\n", err)
		return
	}
	defer divertClose(h)
	fmt.Println("[DIVERT] QUIC/HTTP3 blocker aktif (UDP:443)")

	pkt := make([]byte, MAX_PACKET_SIZE)
	addr := make([]byte, WINDIVERT_ADDR_SIZE)

	for {
		n, err := divertRecv(h, pkt, addr)
		if err != nil {
			continue
		}
		payload := udpPayload(pkt[:n])
		if isQUICInitial(payload) {
			continue
		}
		_ = divertSend(h, pkt[:n], addr)
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
	proxyPort := flag.Int("proxy-port", 0, "SpoofDPI proxy port (super mode)")
	pidFile := flag.String("pid-file", "", "write PID to this file")
	fakeSNI := flag.String("fake-sni", "www.google.com", "fake SNI for strong mode")
	ipFragId := flag.Int("ip-frag-id", 0, "custom IP ID for fragmentation (0=auto)")
	ipFragSize := flag.Int("ip-frag-size", 0, "IP fragment size in bytes (0=off)")
	fakeHello := flag.Bool("fake-hello", false, "randomized TLS fingerprint injection")
	flag.Parse()

	if *pidFile != "" {
		_ = os.WriteFile(*pidFile, []byte(strconv.Itoa(os.Getpid())), 0644)
		defer os.Remove(*pidFile)
	}

	if err := loadWinDivert(); err != nil {
		fmt.Fprintf(os.Stderr, "[ERROR] WinDivert yuklenemedi: %v\n", err)
		os.Exit(1)
	}

	if *dnsRedirect {
		if err := setWindowsDNS(*dnsAddr); err != nil {
			fmt.Fprintf(os.Stderr, "[WARN] DNS ayarlanamadi: %v\n", err)
		}
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
		IpFragId:    *ipFragId,
		IpFragSize:  *ipFragSize,
		FakeHello:   *fakeHello,
	}

	backend := newBackend(cfg)
	runWinDivertEngine(backend, cfg)

	if *dnsRedirect {
		restoreWindowsDNS()
	}

	fmt.Println("[DocsPIDivert] Durduruldu.")
}



