# DocsPI Mobile Platform Setup Script
# Run this on a machine with Android SDK + NDK and/or Xcode installed.

param(
    [switch]$Android,
    [switch]$iOS,
    [switch]$All
)

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $PSScriptRoot

function Setup-Android {
    Write-Host "[Android] Setting up Android target..." -ForegroundColor Cyan

    # Ensure required environment variables
    if (-not $env:ANDROID_HOME) {
        $candidates = @(
            "$env:LOCALAPPDATA\Android\Sdk",
            "$env:USERPROFILE\Android\Sdk",
            "C:\Android\Sdk"
        )
        foreach ($c in $candidates) {
            if (Test-Path $c) {
                $env:ANDROID_HOME = $c
                break
            }
        }
        if (-not $env:ANDROID_HOME) {
            Write-Error "ANDROID_HOME not found. Install Android Studio first."
            return
        }
        Write-Host "[Android] ANDROID_HOME = $env:ANDROID_HOME"
    }

    # Check for NDK
    $ndkDir = "$env:ANDROID_HOME\ndk"
    if (-not (Test-Path $ndkDir) -or -not (Get-ChildItem $ndkDir | Where-Object { $_.PSIsContainer })) {
        Write-Host "[Android] NDK not found. Installing via sdkmanager..." -ForegroundColor Yellow
        & "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" "ndk;27.0.12077973"
    }

    # Run Tauri Android init
    Push-Location "$ROOT\src-tauri"
    try {
        npx tauri android init
        Write-Host "[Android] Tauri Android init completed." -ForegroundColor Green
        
        # Copy bridge code to gen directory
        $bridgeSrc = "$ROOT\scripts\mobile-bridge\android"
        $bridgeDst = "$ROOT\src-tauri\gen\android\app\src\main\java\com\aydocs\docspi"
        if (Test-Path $bridgeSrc) {
            Copy-Item -Path "$bridgeSrc\VpnService.kt" -Destination "$bridgeDst\" -Force
            Copy-Item -Path "$bridgeSrc\AndroidManifest.xml" -Destination "$ROOT\src-tauri\gen\android\app\src\main\" -Force
            Write-Host "[Android] Bridge code copied." -ForegroundColor Green
        }
    } finally {
        Pop-Location
    }
}

function Setup-iOS {
    Write-Host "[iOS] iOS setup requires macOS with Xcode 15+." -ForegroundColor Cyan
    
    # Check if running on macOS
    if ($env:OS -ne "Windows_NT") {
        Push-Location "$ROOT\src-tauri"
        try {
            npx tauri ios init
            Write-Host "[iOS] Tauri iOS init completed." -ForegroundColor Green

            # Copy Swift bridge code
            $bridgeSrc = "$ROOT\scripts\mobile-bridge\ios"
            $bridgeDst = "$ROOT\src-tauri\gen\ios\src"
            if (Test-Path $bridgeSrc) {
                New-Item -ItemType Directory -Path $bridgeDst -Force | Out-Null
                Copy-Item -Path "$bridgeSrc\PacketTunnelProvider.swift" -Destination "$bridgeDst\" -Force
                Write-Host "[iOS] Bridge code copied." -ForegroundColor Green
            }
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "[iOS] Skipping iOS setup on Windows. Run this script on macOS with Xcode." -ForegroundColor Yellow
    }
}

# Main
if ($All -or (-not $Android -and -not $iOS)) {
    Setup-Android
    Setup-iOS
} else {
    if ($Android) { Setup-Android }
    if ($iOS) { Setup-iOS }
}

Write-Host "`n[Done] Mobile setup complete." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. 'npx tauri android dev' to test on Android emulator/device"
Write-Host "  2. 'npx tauri ios dev' to test on iOS simulator (macOS only)"
Write-Host "  3. 'npx tauri build --target <target>' for production builds"
