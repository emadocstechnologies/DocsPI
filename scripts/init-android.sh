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
MANIFEST="gen/android/app/src/main/AndroidManifest.xml"
mkdir -p "$ANDROID_DIR"

echo "[Android] Installing DocsPIApp.kt (Application subclass)..."
cp "$PROJECT_DIR/src-tauri/android/DocsPIApp.kt" "$ANDROID_DIR/"

echo "[Android] Installing DocsPiVpnService.kt..."
cp "$PROJECT_DIR/src-tauri/android/DocsPiVpnService.kt" "$ANDROID_DIR/"

echo "[Android] Patching AndroidManifest.xml..."
if [ -f "$MANIFEST" ]; then
    # 1. Add DocsPIApp as the Application subclass
    sed -i 's|<application|<application android:name=".DocsPIApp"|' "$MANIFEST"

    # 2. Add VpnService service entry after <application>
    #    (before any existing <activity> or </application>)
    if ! grep -q "DocsPiVpnService" "$MANIFEST"; then
        sed -i '/<application/,/<\/application>/{
            /<activity/ i\
    <service\
        android:name=".DocsPiVpnService"\
        android:permission="android.permission.BIND_VPN_SERVICE"\
        android:exported="false" />
        }' "$MANIFEST"
    fi

    # 3. Add VPN permission before <application>
    if ! grep -q "BIND_VPN_SERVICE" "$MANIFEST"; then
        sed -i '/<application/ i\
    <uses-permission android:name="android.permission.BIND_VPN_SERVICE" />' "$MANIFEST"
    fi

    echo "[Android] AndroidManifest.xml patched:"
    grep -n "DocsPIApp\|DocsPiVpn\|BIND_VPN" "$MANIFEST" || true
else
    echo "[WARN] AndroidManifest.xml not found at $MANIFEST"
    echo "[WARN] After generating it, manually add:"
    echo "  1. Change <application> to <application android:name=\".DocsPIApp\""
    echo "  2. Add <service android:name=\".DocsPiVpnService\""
    echo "     android:permission=\"android.permission.BIND_VPN_SERVICE\""
    echo "     android:exported=\"false\" />"
    echo "  3. Add <uses-permission android:name=\"android.permission.BIND_VPN_SERVICE\" />"
fi

echo ""
echo "[Android] Done. Run: npx tauri android build --target aarch64-linux-android"
