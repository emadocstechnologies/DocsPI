// DocsPI DPI Divert Engine — DNS management (platform-specific build tags).

package main

import (
	"fmt"
	"os/exec"
)

// setWindowsDNS sets DNS via netsh (Windows-only).
func setWindowsDNS(dnsAddr string) error {
	return exec.Command("netsh", "interface", "ip", "set", "dns",
		"Wi-Fi", "static", dnsAddr).Run()
}

// restoreWindowsDNS restores DHCP DNS (Windows-only).
func restoreWindowsDNS() {
	exec.Command("netsh", "interface", "ip", "set", "dns",
		"Wi-Fi", "dhcp").Run()
}

// SetSystemDNS sets the system DNS using platform-appropriate commands.
func SetSystemDNS(dnsAddr string, platform string) error {
	switch platform {
	case "windows":
		return setWindowsDNS(dnsAddr)
	case "linux":
		return exec.Command("resolvectl", "dns", "global", dnsAddr).Run()
	case "darwin":
		return exec.Command("networksetup", "-setdnsservers", "Wi-Fi", dnsAddr).Run()
	default:
		return fmt.Errorf("unsupported platform: %s", platform)
	}
}
