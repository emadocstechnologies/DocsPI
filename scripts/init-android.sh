#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────
# DocsPI Android VpnService init script
# Run this after `npx tauri android init` to wire up VpnService
# ────────────────────────────────────────────────────────────
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[Android] Initializing Tauri Android project..."
cd "$PROJECT_DIR/src-tauri"
npx tauri android init

ANDROID_DIR="gen/android/app/src/main/java/com/docspi"
mkdir -p "$ANDROID_DIR"

echo "[Android] Installing DocsPIApp.kt (Application subclass)..."
cp "$PROJECT_DIR/src-tauri/android/DocsPIApp.kt" "$ANDROID_DIR/"

echo "[Android] Installing DocsPiVpnService.kt..."
cp "$PROJECT_DIR/src-tauri/android/DocsPiVpnService.kt" "$ANDROID_DIR/"

echo ""
echo "[Android] IMPORTANT: After copying files, edit AndroidManifest.xml:"
echo "   <application android:name=\".DocsPIApp\" ...>"
echo ""
echo "[Android] Done. Run: npx tauri android build --target aarch64-linux-android"
