# release.ps1 — GitHub Release Oluşturucu
# Kullanım: .\scripts\release.ps1 -Token "ghp_xxxxx"

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    
    [string]$Tag = "v1.0.10-beta.10",
    [string]$Name = "DocsPI v1.0.10-beta.10",
    [string]$Repo = "aydocs/DocsPI"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 DocsPI Release Oluşturuluyor..." -ForegroundColor Cyan
Write-Host "   Tag: $Tag" -ForegroundColor Yellow
Write-Host "   Repo: $Repo" -ForegroundColor Yellow

# 1. Zip oluştur
$version = $Tag -replace '^v', ''
$zipPath = "dist\DocsPI-$version-win64.zip"

Write-Host "`n📦 Zip dosyası oluşturuluyor..." -ForegroundColor Cyan
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "dist\*" -DestinationPath $zipPath -Force
$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-Host "   ✅ $zipPath ($zipSize MB)" -ForegroundColor Green

# 2. Release notları
$notes = @"
## DocsPI $Tag

### 🐛 Bug Fixes
- ErrorBoundary bileşeni — React crash koruması
- AlertTriangle import fix (lucide-react)
- Rust P0 fixes: InternetSetOptionW error check, token handle leak, icon fallback, PAC backoff
- Silent catch blocks → console.warn logging

### ✨ Improvements
- i18n restructure — English primary, Turkish secondary
- Shared utils.js (formatUptime, computeQualityScore, etc.)
- useConfig hook — config state management
- CHANGELOG.md, CONTRIBUTING.md

### 📦 Dosyalar
- DocsPI-$version-win64.zip — Web build (Vite)
- Kaynak kod: main branch

### 🏗️ Build
```bash
npm install
npm run build
```
"@

Write-Host "`n📝 Release notları hazır" -ForegroundColor Green

# 3. GitHub API — Release oluştur
Write-Host "`n🌐 GitHub API'ye istek gönderiliyor..." -ForegroundColor Cyan
$headers = @{
    Authorization = "token $Token"
    Accept = "application/vnd.github+json"
    "User-Agent" = "DocsPI-Release-Script"
}

$releaseBody = @{
    tag_name = $Tag
    target_commitish = "main"
    name = $Name
    body = $notes
    draft = $false
    prerelease = $true
} | ConvertTo-Json -Depth 3

try {
    $release = Invoke-RestMethod `
        -Uri "https://api.github.com/repos/$Repo/releases" `
        -Method Post `
        -Headers $headers `
        -Body $releaseBody `
        -ContentType "application/json"
    
    Write-Host "   ✅ Release oluşturuldu: $($release.html_url)" -ForegroundColor Green
    $releaseId = $release.id
} catch {
    Write-Host "   ❌ Release oluşturulamadı: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Zip dosyasını yükle
Write-Host "`n📤 Zip dosyası yükleniyor..." -ForegroundColor Cyan
$uploadHeaders = @{
    Authorization = "token $Token"
    Accept = "application/vnd.github+json"
    "User-Agent" = "DocsPI-Release-Script"
    "Content-Type" = "application/zip"
}

$uploadUrl = "https://uploads.github.com/repos/$Repo/releases/$releaseId/assets?name=DocsPI-$version-win64.zip"
$zipBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $zipPath).Path)

try {
    $asset = Invoke-RestMethod `
        -Uri $uploadUrl `
        -Method Post `
        -Headers $uploadHeaders `
        -Body $zipBytes `
        -ContentType "application/zip"
    
    Write-Host "   ✅ Zip yüklendi: $($asset.browser_download_url)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Zip yüklenemedi ama release oluşturuldu: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 5. Özet
Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "🎉 RELEASE TAMAMLANDI!" -ForegroundColor Green
Write-Host "   URL: $($release.html_url)" -ForegroundColor Yellow
Write-Host "   Tag: $Tag" -ForegroundColor Yellow
Write-Host "   Dosya: DocsPI-$version-win64.zip ($zipSize MB)" -ForegroundColor Yellow
Write-Host ("=" * 50) -ForegroundColor Cyan



