// DocsPI DPI Divert Engine — cross-platform PacketBackend interface.
// Each OS implements this for packet capture/injection.

package main

// PacketBackend abstracts packet capture/injection across platforms.
type PacketBackend interface {
	Read() (pkt []byte, err error)
	Write(pkt []byte) error
	Close()
}

// Config holds all CLI flags (platform-neutral).
type Config struct {
	Mode        string
	AutoTTL     bool
	BlockQUIC   bool
	WrongChksum bool
	WrongSeq    bool
	DNSRedirect bool
	DNSAddr     string
	ProxyPort   int
	FakeSNI     string
	IpFragId    int    // IP fragmentation: custom IP ID (0 = random)
	IpFragSize  int    // IP fragmentation: fragment size in bytes (0 = off)
	FakeHello   bool   // Enable fake TLS Client Hello injection
	KillSwitch  bool   // Block non-VPN/proxy traffic on disconnect
}

// newPlatformBackend creates the OS-specific backend.
func newPlatformBackend(cfg *Config) PacketBackend {
	return newBackend(cfg)
}
