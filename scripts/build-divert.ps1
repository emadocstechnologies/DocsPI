# DocsPI Divert Engine — Multi-Platform Build Script
param(
    [ValidateSet("windows","linux","darwin","android","ios","all")]
    [string]$Target = "all"
)

$ROOT = Split-Path -Parent $PSScriptRoot
$DIVERT_DIR = "$ROOT\docspi-divert"
$OUT_DIR = "$ROOT\src-tauri\binaries"

if (-not (Test-Path $OUT_DIR)) {
    New-Item -ItemType Directory -Path $OUT_DIR -Force | Out-Null
}

function Build-Platform {
    param([string]$GOOS, [string]$GOARCH, [string]$Ext = "")

    $env:GOOS = $GOOS
    $env:GOARCH = $GOARCH
    $env:CGO_ENABLED = 0

    $binary = "docspi-divert-${GOOS}-${GOARCH}${Ext}"
    $output = "$OUT_DIR\$binary"

    Write-Host "Building $GOOS/$GOARCH → $output" -ForegroundColor Cyan

    Push-Location $DIVERT_DIR
    try {
        go build -ldflags="-s -w" -o $output .
        if ($?) {
            Write-Host "  ✓ $binary" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $binary — FAILED" -ForegroundColor Red
        }
    } finally {
        Pop-Location
    }
}

Write-Host "=== DocsPI Divert Engine Build ===" -ForegroundColor Yellow
Write-Host ""

switch ($Target) {
    "windows" { Build-Platform -GOOS windows -GOARCH amd64 -Ext ".exe" }
    "linux" {
        Build-Platform -GOOS linux -GOARCH amd64
        Build-Platform -GOOS linux -GOARCH arm64
    }
    "darwin" {
        Build-Platform -GOOS darwin -GOARCH amd64
        Build-Platform -GOOS darwin -GOARCH arm64
    }
    "android" {
        Write-Host "Android: use 'gomobile bind -target=android' from Go mobile project" -ForegroundColor Yellow
    }
    "ios" {
        Write-Host "iOS: use 'gomobile bind -target=ios' from Go mobile project" -ForegroundColor Yellow
    }
    "all" {
        Build-Platform -GOOS windows -GOARCH amd64 -Ext ".exe"
        Build-Platform -GOOS linux -GOARCH amd64
        Build-Platform -GOOS linux -GOARCH arm64
        Build-Platform -GOOS darwin -GOARCH amd64
        Build-Platform -GOOS darwin -GOARCH arm64
        Write-Host ""
        Write-Host "Android/iOS: use gomobile bind for mobile builds" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Build complete ===" -ForegroundColor Yellow
Get-ChildItem "$OUT_DIR\docspi-divert-*" | ForEach-Object { Write-Host "  $($_.Name) — $([math]::Round($_.Length/1KB)) KB" }
