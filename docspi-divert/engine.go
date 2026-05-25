// DocsPI DPI Divert Engine — cross-platform packet processing.

package main

import (
	"encoding/binary"
	"fmt"
	"sync"
	"time"
)

const (
	PROTO_TCP = 6
	PROTO_UDP = 17

	TCP_FLAG_SYN = 0x02
	TCP_FLAG_RST = 0x04
	TCP_FLAG_ACK = 0x10

	TLS_HANDSHAKE    = 0x16
	TLS_CLIENT_HELLO = 0x01

	QUIC_LONG_HEADER_FLAG = 0x80
	QUIC_INITIAL_TYPE     = 0x00
)

const (
	ttlTableMaxSize       = 1000
	ttlTableCleanInterval = 5 * time.Minute
)

type ttlEntry struct {
	hopCount uint8
}

var (
	ttlTable   = make(map[uint32]ttlEntry)
	ttlTableMu sync.Mutex
)

func startTTLTableCleaner() {
	go func() {
		ticker := time.NewTicker(ttlTableCleanInterval)
		defer ticker.Stop()
		for range ticker.C {
			ttlTableMu.Lock()
			if len(ttlTable) > ttlTableMaxSize {
				ttlTable = make(map[uint32]ttlEntry)
			}
			ttlTableMu.Unlock()
		}
	}()
}

// runEngine is the main cross-platform packet processing loop.
func runEngine(backend PacketBackend, cfg *Config) {
	startTTLTableCleaner()
	fmt.Printf("[DocsPIDivert] Engine aktif | Mod: %s | AutoTTL: %v | BlockQUIC: %v | WrongChksum: %v | WrongSeq: %v\n",
		cfg.Mode, cfg.AutoTTL, cfg.BlockQUIC, cfg.WrongChksum, cfg.WrongSeq)

	for {
		pkt, err := backend.Read()
		if err != nil {
			continue
		}
		processPacket(backend, pkt, cfg)
	}
}

// processPacket handles a single packet: identifies TLS, applies bypass techniques.
func processPacket(backend PacketBackend, pkt []byte, cfg *Config) {
	if pktProto(pkt) != PROTO_TCP {
		_ = backend.Write(pkt)
		return
	}

	payload := tcpPayload(pkt)
	if len(payload) < 6 {
		_ = backend.Write(pkt)
		return
	}

	// Check for QUIC
	if cfg.BlockQUIC && len(pkt) > 0 {
		// QUIC detection on non-WinDivert platforms
		if pktProto(pkt) == PROTO_UDP {
			pay := udpPayload(pkt)
			if len(pay) >= 1200 && isQUICInitial(pay) {
				return // drop
			}
			_ = backend.Write(pkt)
			return
		}
	}

	isTLS := payload[0] == TLS_HANDSHAKE && len(payload) > 5 && payload[5] == TLS_CLIENT_HELLO

	if !isTLS {
		if cfg.AutoTTL {
			applyAutoTTL(pkt)
		}
		_ = backend.Write(pkt)
		return
	}

	// TLS Client Hello detected — DPI bypass
	if cfg.WrongChksum {
		sendFakeWrongChksum(backend, pkt, cfg)
	}

	if cfg.WrongSeq {
		sendFakeWrongSeq(backend, pkt, cfg)
	}

	if cfg.AutoTTL {
		applyAutoTTL(pkt)
	}

	sendFragmented(backend, pkt)
}

// ── Fake packet senders ──────────────────────────────────────────────

func sendFakeWrongChksum(backend PacketBackend, pkt []byte, cfg *Config) {
	ihl := ipv4HeaderLen(pkt)
	thl := tcpDataOffset(pkt)
	headerSize := ihl + thl
	if headerSize <= 0 || headerSize > len(pkt) {
		return
	}

	fakePayload := buildFakeClientHello(cfg.FakeSNI)
	fake := make([]byte, headerSize+len(fakePayload))
	copy(fake, pkt[:headerSize])
	copy(fake[headerSize:], fakePayload)
	binary.BigEndian.PutUint16(fake[2:4], uint16(headerSize+len(fakePayload)))

	applyFakeTTL(fake)
	calcChecksums(fake)

	// Flip checksum to create "wrong" checksum packet
	if len(fake) >= ihl+18 {
		chk := binary.BigEndian.Uint16(fake[ihl+16 : ihl+18])
		binary.BigEndian.PutUint16(fake[ihl+16:ihl+18], chk-1)
	}

	_ = backend.Write(fake)
}

func sendFakeWrongSeq(backend PacketBackend, pkt []byte, cfg *Config) {
	ihl := ipv4HeaderLen(pkt)
	thl := tcpDataOffset(pkt)
	headerSize := ihl + thl
	if headerSize <= 0 || headerSize > len(pkt) || len(pkt) < ihl+12 {
		return
	}

	fakePayload := buildFakeClientHello(cfg.FakeSNI)
	fake := make([]byte, headerSize+len(fakePayload))
	copy(fake, pkt[:headerSize])
	copy(fake[headerSize:], fakePayload)
	binary.BigEndian.PutUint16(fake[2:4], uint16(headerSize+len(fakePayload)))

	seqOffset := ihl + 4
	ackOffset := ihl + 8
	origSeq := binary.BigEndian.Uint32(pkt[seqOffset : seqOffset+4])
	origAck := binary.BigEndian.Uint32(pkt[ackOffset : ackOffset+4])
	binary.BigEndian.PutUint32(fake[seqOffset:seqOffset+4], origSeq-10000)
	binary.BigEndian.PutUint32(fake[ackOffset:ackOffset+4], origAck-66000)

	applyFakeTTL(fake)
	calcChecksums(fake)
	_ = backend.Write(fake)
}

func applyFakeTTL(pkt []byte) {
	dstIP := pktDstIPv4(pkt)
	ttlTableMu.Lock()
	entry, ok := ttlTable[dstIP]
	ttlTableMu.Unlock()

	if !ok || entry.hopCount < 3 {
		setPktTTL(pkt, 1)
		return
	}

	hop := entry.hopCount
	var fakeTTL uint8
	if hop > 4 {
		fakeTTL = hop - 4
	} else {
		fakeTTL = 1
	}
	if fakeTTL < 1 {
		fakeTTL = 1
	}
	setPktTTL(pkt, fakeTTL)
}

func sendFragmented(backend PacketBackend, pkt []byte) {
	ihl := ipv4HeaderLen(pkt)
	thl := tcpDataOffset(pkt)
	headerSize := ihl + thl
	payload := pkt[headerSize:]

	if len(payload) < 4 || headerSize+4 > len(pkt) {
		calcChecksums(pkt)
		_ = backend.Write(pkt)
		return
	}

	splitAt := 2

	// Fragment 1 (first 2 bytes of TLS payload)
	frag1 := make([]byte, headerSize+splitAt)
	copy(frag1, pkt[:headerSize])
	copy(frag1[headerSize:], payload[:splitAt])
	binary.BigEndian.PutUint16(frag1[2:4], uint16(headerSize+splitAt))
	calcChecksums(frag1)

	// Fragment 2 (remaining payload, adjusted seq)
	remaining := payload[splitAt:]
	frag2 := make([]byte, headerSize+len(remaining))
	copy(frag2, pkt[:headerSize])
	copy(frag2[headerSize:], remaining)
	binary.BigEndian.PutUint16(frag2[2:4], uint16(headerSize+len(remaining)))
	seqOff := ihl + 4
	origSeq := binary.BigEndian.Uint32(pkt[seqOff : seqOff+4])
	binary.BigEndian.PutUint32(frag2[seqOff:seqOff+4], origSeq+uint32(splitAt))
	calcChecksums(frag2)

	// Send fragment 2 first, then fragment 1 (out-of-order delivery)
	_ = backend.Write(frag2)
	_ = backend.Write(frag1)
}

// ── TTL management ──────────────────────────────────────────────────

func processTCPInbound(pkt []byte) {
	if pktProto(pkt) != PROTO_TCP {
		return
	}
	flags := tcpFlags(pkt)
	if flags&TCP_FLAG_SYN == 0 || flags&TCP_FLAG_ACK == 0 {
		return
	}
	ttl := pktTTL(pkt)
	if ttl == 0 {
		return
	}

	hop := estimateHopCount(ttl)
	dstIP := pktSrcIPv4(pkt)

	ttlTableMu.Lock()
	ttlTable[dstIP] = ttlEntry{hopCount: hop}
	ttlTableMu.Unlock()
}

func applyAutoTTL(pkt []byte) {
	dstIP := pktDstIPv4(pkt)

	ttlTableMu.Lock()
	entry, ok := ttlTable[dstIP]
	ttlTableMu.Unlock()

	if !ok {
		return
	}

	hop := entry.hopCount
	var base uint8 = 128
	if hop <= 32 {
		base = 64
	}

	var newTTL uint8
	if hop+2 < base {
		newTTL = base - hop - 2
	} else {
		newTTL = 1
	}

	if newTTL < 1 {
		newTTL = 1
	}
	setPktTTL(pkt, newTTL)
}

func estimateHopCount(ttl uint8) uint8 {
	var base uint8
	switch {
	case ttl <= 32:
		base = 32
	case ttl <= 64:
		base = 64
	case ttl <= 128:
		base = 128
	default:
		base = 255
	}
	return base - ttl
}

// ── QUIC ─────────────────────────────────────────────────────────────

func isQUICInitial(payload []byte) bool {
	if len(payload) < 5 {
		return false
	}
	firstByte := payload[0]
	if firstByte&QUIC_LONG_HEADER_FLAG == 0 {
		return false
	}
	pktType := (firstByte & 0x30) >> 4
	if pktType != QUIC_INITIAL_TYPE {
		return false
	}
	version := binary.BigEndian.Uint32(payload[1:5])
	return version == 0x00000001 || version == 0xff00001d || version == 0x1 ||
		version == 0x6b3343cf || version == 0xff000020 || version == 0xff00001e
}

// ── Packet parsing helpers ──────────────────────────────────────────

func pktProto(pkt []byte) uint8 {
	if len(pkt) < 9 {
		return 0
	}
	return pkt[9]
}

func pktIPVersion(pkt []byte) uint8 {
	if len(pkt) < 1 {
		return 0
	}
	return (pkt[0] & 0xF0) >> 4
}

func ipv4HeaderLen(pkt []byte) int {
	if len(pkt) < 1 {
		return 0
	}
	return int(pkt[0]&0x0F) * 4
}

func tcpDataOffset(pkt []byte) int {
	ihl := ipv4HeaderLen(pkt)
	if len(pkt) < ihl+12 {
		return 0
	}
	return int((pkt[ihl+12] >> 4) * 4)
}

func tcpPayload(pkt []byte) []byte {
	ihl := ipv4HeaderLen(pkt)
	thl := tcpDataOffset(pkt)
	headerSize := ihl + thl
	if headerSize > len(pkt) {
		return nil
	}
	return pkt[headerSize:]
}

func tcpFlags(pkt []byte) uint8 {
	ihl := ipv4HeaderLen(pkt)
	if len(pkt) < ihl+13 {
		return 0
	}
	return pkt[ihl+13]
}

func udpPayload(pkt []byte) []byte {
	ihl := ipv4HeaderLen(pkt)
	if len(pkt) < ihl+8 {
		return nil
	}
	udpLen := int(binary.BigEndian.Uint16(pkt[ihl+4 : ihl+6]))
	if udpLen < 8 || ihl+udpLen > len(pkt) {
		return nil
	}
	return pkt[ihl+8 : ihl+udpLen]
}

func pktDstIPv4(pkt []byte) uint32 {
	if pktIPVersion(pkt) != 4 || len(pkt) < 20 {
		return 0
	}
	return binary.BigEndian.Uint32(pkt[16:20])
}

func pktSrcIPv4(pkt []byte) uint32 {
	if pktIPVersion(pkt) != 4 || len(pkt) < 16 {
		return 0
	}
	return binary.BigEndian.Uint32(pkt[12:16])
}

func pktTTL(pkt []byte) uint8 {
	if len(pkt) < 8 {
		return 0
	}
	return pkt[8]
}

func setPktTTL(pkt []byte, ttl uint8) {
	if len(pkt) >= 8 {
		pkt[8] = ttl
	}
}

// Commit: feat: add Go divert engine with cross-platform build [132229]
