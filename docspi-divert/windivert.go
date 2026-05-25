//go:build windows

package main

import (
	"fmt"
	"os"
	"path/filepath"
	"syscall"
	"unsafe"
)

const (
	WINDIVERT_LAYER_NETWORK = 0

	WINDIVERT_FLAG_DEFAULT  = 0
	WINDIVERT_FLAG_SNIFF    = 1
	WINDIVERT_FLAG_DROP     = 2

	WINDIVERT_ADDR_SIZE = 80
	MAX_PACKET_SIZE     = 65535

	WINDIVERT_DIRECTION_OUTBOUND = 0
	WINDIVERT_DIRECTION_INBOUND  = 1
)

type WinDivert struct {
	open      *syscall.Proc
	recv      *syscall.Proc
	send      *syscall.Proc
	close     *syscall.Proc
	parse     *syscall.Proc
	checksum  *syscall.Proc
}

var wd *WinDivert

func loadWinDivert() error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}

	exeDir := filepath.Dir(exePath)
	candidates := []string{
		filepath.Join(exeDir, "WinDivert.dll"),
		filepath.Join(exeDir, "binaries", "WinDivert.dll"),
		filepath.Join(exeDir, "..", "WinDivert.dll"),
		"WinDivert.dll",
	}

	var dll *syscall.DLL
	for _, p := range candidates {
		dll, err = syscall.LoadDLL(p)
		if err == nil {
			break
		}
	}
	if dll == nil {
		return fmt.Errorf("WinDivert.dll bulunamadı: %w", err)
	}

	mustProc := func(name string) *syscall.Proc {
		p, e := dll.FindProc(name)
		if e != nil {
			panic(fmt.Sprintf("%s bulunamadı: %v", name, e))
		}
		return p
	}

	wd = &WinDivert{
		open:     mustProc("WinDivertOpen"),
		recv:     mustProc("WinDivertRecv"),
		send:     mustProc("WinDivertSend"),
		close:    mustProc("WinDivertClose"),
		parse:    mustProc("WinDivertHelperParsePacket"),
		checksum: mustProc("WinDivertHelperCalcChecksums"),
	}
	return nil
}

func divertOpen(filter string, layer, priority, flags int) (syscall.Handle, error) {
	filterPtr, _ := syscall.BytePtrFromString(filter)
	r, _, e := wd.open.Call(
		uintptr(unsafe.Pointer(filterPtr)),
		uintptr(layer),
		uintptr(priority),
		uintptr(flags),
	)
	h := syscall.Handle(r)
	if h == syscall.InvalidHandle {
		return syscall.InvalidHandle, fmt.Errorf("WinDivertOpen: %w", e)
	}
	return h, nil
}

func divertRecv(h syscall.Handle, pkt []byte, addr []byte) (uint32, error) {
	var recvLen uint32
	r, _, e := wd.recv.Call(
		uintptr(h),
		uintptr(unsafe.Pointer(&pkt[0])),
		uintptr(len(pkt)),
		uintptr(unsafe.Pointer(&recvLen)),
		uintptr(unsafe.Pointer(&addr[0])),
	)
	if r == 0 {
		return 0, e
	}
	return recvLen, nil
}

func divertSend(h syscall.Handle, pkt []byte, addr []byte) error {
	var sent uint32
	r, _, e := wd.send.Call(
		uintptr(h),
		uintptr(unsafe.Pointer(&pkt[0])),
		uintptr(len(pkt)),
		uintptr(unsafe.Pointer(&sent)),
		uintptr(unsafe.Pointer(&addr[0])),
	)
	if r == 0 {
		return e
	}
	return nil
}

func divertClose(h syscall.Handle) {
	if h != syscall.InvalidHandle {
		wd.close.Call(uintptr(h))
	}
}

func divertCalcChecksums(pkt []byte, addr []byte, flags uint64) {
	wd.checksum.Call(
		uintptr(unsafe.Pointer(&pkt[0])),
		uintptr(len(pkt)),
		uintptr(unsafe.Pointer(&addr[0])),
		uintptr(flags),
	)
}

func addrIsOutbound(addr []byte) bool {
	return addr[10]&0x02 != 0
}

// WinDivert-specific packet filters
const (
	filterNoLocal  = "!impostor and !loopback"

	filterOutTCP = "outbound and " + filterNoLocal +
		" and tcp and (tcp.DstPort == 443 or tcp.DstPort == 80) and tcp.PayloadLength > 0"

	filterInSYNACK = "inbound and " + filterNoLocal +
		" and tcp and (tcp.SrcPort == 443 or tcp.SrcPort == 80) and tcp.Syn and tcp.Ack"

	filterDropRST = "inbound and " + filterNoLocal +
		" and tcp and (tcp.SrcPort == 443 or tcp.SrcPort == 80) and tcp.Rst"

	filterQUIC = "outbound and " + filterNoLocal +
		" and udp and udp.DstPort == 443 and udp.PayloadLength >= 1200 and udp.Payload[0] >= 0xC0"
)
