// DocsPI DPI Divert Engine — cross-platform packet utilities.
// IP/TCP checksum calculation in userspace (replaces WinDivert kernel checksumming).

package main

import "encoding/binary"

// calcChecksums computes IP and TCP checksums for a raw IPv4 packet.
func calcChecksums(pkt []byte) {
	if len(pkt) < 20 {
		return
	}

	ihl := ipv4HeaderLen(pkt)
	if ihl < 20 || ihl > len(pkt) {
		return
	}

	// Clear existing checksums
	pkt[10] = 0
	pkt[11] = 0

	// IP header checksum
	totalLen := int(binary.BigEndian.Uint16(pkt[2:4]))
	if totalLen > len(pkt) {
		totalLen = len(pkt)
	}
	ipSum := checksum(pkt[:ihl])
	binary.BigEndian.PutUint16(pkt[10:12], ipSum)

	// TCP/UDP checksum
	proto := pkt[9]
	switch proto {
	case 6, 17: // TCP, UDP
		if totalLen < ihl {
			return
		}
		// Clear TCP/UDP checksum field
		pkt[ihl+16] = 0
		pkt[ihl+17] = 0

		dataLen := totalLen - ihl
		pseudoSum := pseudoHeaderChecksum(
			binary.BigEndian.Uint32(pkt[12:16]),  // src IP
			binary.BigEndian.Uint32(pkt[16:20]),  // dst IP
			proto,
			uint16(dataLen),
		)
		tcpSum := checksumWithPseudo(pkt[ihl:totalLen], pseudoSum)
		if tcpSum == 0 {
			tcpSum = 0xFFFF // 0 is reserved for "no checksum"
		}
		binary.BigEndian.PutUint16(pkt[ihl+16:ihl+18], tcpSum)
	}
}

// checksum computes the Internet checksum of data.
func checksum(data []byte) uint16 {
	var sum uint32
	for i := 0; i+1 < len(data); i += 2 {
		sum += uint32(binary.BigEndian.Uint16(data[i:]))
	}
	if len(data)%2 == 1 {
		sum += uint32(data[len(data)-1]) << 8
	}
	for (sum >> 16) > 0 {
		sum = (sum & 0xFFFF) + (sum >> 16)
	}
	return ^uint16(sum)
}

// pseudoHeaderChecksum computes the TCP/UDP pseudo header checksum contribution.
func pseudoHeaderChecksum(srcIP, dstIP uint32, proto uint8, dataLen uint16) uint32 {
	var sum uint32
	// src IP (4 bytes)
	sum += uint32(srcIP >> 16)
	sum += uint32(srcIP & 0xFFFF)
	// dst IP (4 bytes)
	sum += uint32(dstIP >> 16)
	sum += uint32(dstIP & 0xFFFF)
	// zero (1) + proto (1) = 2 bytes, then total len (2)
	sum += uint32(proto)
	sum += uint32(dataLen)
	return sum
}

// checksumWithPseudo computes the full TCP/UDP checksum including pseudo header.
func checksumWithPseudo(data []byte, pseudoSum uint32) uint16 {
	sum := pseudoSum
	for i := 0; i+1 < len(data); i += 2 {
		sum += uint32(binary.BigEndian.Uint16(data[i:]))
	}
	if len(data)%2 == 1 {
		sum += uint32(data[len(data)-1]) << 8
	}
	for (sum >> 16) > 0 {
		sum = (sum & 0xFFFF) + (sum >> 16)
	}
	return ^uint16(sum)
}
