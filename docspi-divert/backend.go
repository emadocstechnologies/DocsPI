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
}

// newPlatformBackend creates the OS-specific backend.
func newPlatformBackend(cfg *Config) PacketBackend {
	return newBackend(cfg)
}
