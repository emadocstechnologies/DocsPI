<p align="center">
  <img src="public/docspi-logo.png" width="128" height="128" alt="DocsPI Logo" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
</p>

<h1 align="center">DocsPI</h1>

<p align="center">
  <b>Crash-proof, modern local proxy & DPI bypass tool built with Rust + React + Tauri.</b>
</p>

<p align="center">
  <a href="https://github.com/aydocs/DocsPI/releases">
    <img src="https://img.shields.io/github/v/release/aydocs/DocsPI?style=flat-square&color=7c3aed" alt="Release">
  </a>
  <a href="https://github.com/aydocs/DocsPI/stargazers">
    <img src="https://img.shields.io/github/stars/aydocs/DocsPI?style=flat-square&color=f59e0b" alt="Stars">
  </a>
  <a href="https://github.com/aydocs/DocsPI/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/aydocs/DocsPI?style=flat-square" alt="License">
  </a>
  <a href="https://discord.gg/aydocs">
    <img src="https://img.shields.io/badge/Discord-7289DA?style=flat-square&logo=discord&logoColor=white" alt="Discord">
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#installation">Installation</a> •
  <a href="#building-from-source">Build</a> •
  <a href="#security">Security</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Screenshots

<div align="center">
  <img src="images/1.png" alt="DocsPI Screenshot 1" width="45%">
  <img src="images/2.png" alt="DocsPI Screenshot 2" width="45%">
</div>

---

## Why DocsPI?

Most existing DPI bypass tools (GoodbyeDPI, GreenTunnel, etc.) are built with CMD/Java and share a critical flaw: **they leave system proxy settings corrupted after a crash or BSOD, cutting off your internet.**

DocsPI is built from scratch with **Rust (Tauri v2)** and includes:

- **Sentinel Recovery** — Automatically detects and cleans orphaned proxy settings on startup
- **Zombie Process Cleanup** — Kills stale proxy processes left behind by crashes
- **Corporate Proxy Backup & Restore** — Saves and restores enterprise proxy configurations
- **Zero-telemetry** — No data is ever sent anywhere

---

## Features

### 🌐 13 Languages
Turkish, English, Chinese, Hindi, Spanish, French, Arabic (RTL), Portuguese, Russian, Japanese, German, Italian, Korean.

### 🎨 Dynamic Theming
Dark and Light mode with full customization. Purple accent throughout.

### 🛡️ 3-Level DPI Bypass Engine

| Mode | Name | Description |
|:---:|:---|:---|
| **0** | **Turbo** | Lowest latency. Bypasses light SNI-based filters instantly. |
| **1** | **Balanced** | Fast and stable. Splits TLS packets using Chunk Split. |
| **2** | **Strong** | For the toughest DPI. Fake Packet + SNI Hiding + Npcap driver. |

Fine-tune chunk size: 1 / 2 / 4 / 8 / 16 bytes.

### 🎮 Game Mode
Dedicated kernel bypass engine for Roblox, Discord, and all UDP-based games via WinDivert driver.

### 🚀 Auto-Escalation
When a connection fails, DocsPI automatically escalates through bypass modes (Turbo → Balanced → Strong) until it succeeds.

### 📈 Live Dashboard
- Real-time ping measurement
- Session history & uptime tracking
- DNS latency comparison
- Traffic counter with quality scoring

### ⚡ Sentinel Recovery 2.0
Aggressive zombie process cleanup and automatic repair after crashes, BSODs, or forced shutdowns.

### 🔍 Bypass Verification
Built-in test to verify the connection is actually working through the bypass.

### 📱 LAN Sharing
Built-in PAC server lets phones, tablets, and consoles on the same network bypass restrictions via QR code.

### 🔒 DNS over HTTPS
Encrypted DNS through Cloudflare, Google, AdGuard, Quad9, OpenDNS — prevents ISP DNS snooping on port 53.

---

## How It Works

```
┌─────────────────────────────────────────────────┐
│              DocsPI Architecture                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │  React UI    │◄──►│  Tauri Bridge (IPC)  │   │
│  │  (Vite)      │    │  Rust Commands        │   │
│  └──────────────┘    └──────────┬───────────┘   │
│                                  │               │
│                    ┌─────────────▼────────────┐  │
│                    │    Rust Backend (Core)    │  │
│                    │  ┌─────────────────────┐ │  │
│                    │  │  Proxy Manager      │ │  │
│                    │  │  DNS Resolver (DoH) │ │  │
│                    │  │  Sentinel Recovery  │ │  │
│                    │  │  PAC Server         │ │  │
│                    │  └─────────┬───────────┘ │  │
│                    └────────────┼─────────────┘  │
│                                 │                │
│                    ┌────────────▼─────────────┐  │
│                    │   docspi-proxy (Go)      │  │
│                    │   SpoofDPI Engine        │  │
│                    │   Chunk Split / Fake SNI │  │
│                    └────────────┬─────────────┘  │
│                                 │                │
│                    ┌────────────▼─────────────┐  │
│                    │  WinDivert (Optional)    │  │
│                    │  Kernel-level bypass     │  │
│                    └──────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Installation

### Download (Recommended)

1. Go to [Releases](https://github.com/aydocs/DocsPI/releases)
2. Download the latest `.exe` installer
3. **Run as Administrator** (required for proxy/driver access)
4. Select your mode and click **Connect**

### Build from Source

```bash
# Clone the repo
git clone https://github.com/aydocs/DocsPI.git
cd DocsPI

# Install dependencies
npm install

# Start dev server
npm run dev

# Or build for production
npm run build

# Build Tauri desktop app
npm run tauri build
```

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) (latest stable)
- [Tauri CLI](https://tauri.app/) v2
- Windows 10/11 x64

---

## System Requirements

| Requirement | Details |
|:---|:---|
| OS | Windows 10 / Windows 11 |
| Architecture | x64 |
| RAM | ~60 MB (incl. WebView2) |
| Privileges | Administrator (required) |

---

## Security

> [!IMPORTANT]
> DocsPI is built with security-first principles.

- **Tauri v2 Isolation** — Every IPC command is whitelisted between WebView and Rust backend
- **Strict CSP** — External connections restricted to safe origins only
- **DOMPurify** — All log output sanitized before rendering
- **PAC Rate Limiting** — Max 50 concurrent connections to prevent local DoS
- **Native WinAPI** — Registry/proxy managed via WinAPI, not PowerShell scripts
- **Zero Telemetry** — No data is ever sent anywhere. Period.

### Independent Security Audit

DocsPI has been reviewed by **Claude Code (Anthropic)** for security vulnerabilities. Full audit available in the repository.

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React + Vite + Framer Motion |
| Desktop | Tauri v2 (Rust) |
| Backend Engine | Go (SpoofDPI) |
| DNS | DoH (Cloudflare, Google, Quad9) |
| Kernel Bypass | WinDivert (Npcap) |
| Styling | Tailwind CSS |

---

## Project Structure

```
DocsPI/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   ├── context/            # React context providers
│   ├── lib/                # Utilities (update system)
│   ├── i18n.js             # 13-language translations
│   ├── constants.js        # App constants
│   ├── profiles.js         # ISP profiles & bypass config
│   └── utils.js            # Shared utility functions
├── src-tauri/              # Rust backend
│   └── src/lib.rs          # Core: proxy, DNS, sentinel
├── docspi-divert/          # Go bypass engine
│   ├── engine.go           # WinDivert bypass logic
│   ├── fake_hello.go       # Fake SNI implementation
│   └── windivert.go        # WinDivert wrapper
├── scripts/                # Build & release scripts
├── public/                 # Static assets
└── dist/                   # Production build output
```

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Quick start
git clone https://github.com/aydocs/DocsPI.git
cd DocsPI
npm install
npm run dev
```

---

## Credits

| Contributor | Role |
|:---|:---|
| [**aydocs**](https://github.com/aydocs) | Lead Developer, v5+ Architecture & Design |
| [**shencim**](https://github.com/shencim) | Original Creator & Foundation |
| [**EmaDocs Technologies**](https://github.com/emadocstechnologies) | Technology Partner |

---

## Privacy

> [!IMPORTANT]
> DocsPI collects **zero telemetry**. No IP addresses, browsing data, or system information is ever sent anywhere. Logs are kept in RAM only and cleared on exit.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Disclaimer

- DocsPI only performs local TLS packet fragmentation (SNI layer). It does not connect to any remote VPN server.
- The software is free and open-source. Users are responsible for compliance with local laws.
- Use responsibly and only on networks you have authorization to test.

---

<p align="center">
  <b>DocsPI — Free and open internet for everyone.</b><br>
  <sub>Built with ❤️ by <a href="https://github.com/aydocs">aydocs</a> & <a href="https://github.com/emadocstechnologies">EmaDocs Technologies</a></sub>
</p>



