#!/usr/bin/env bash
# ==============================================================================
# Desktop Visibility Suite - Uninstaller
# Removes symlinks from ~/.local/bin
# ==============================================================================
set -euo pipefail

TARGET_DIR="${HOME}/.local/bin"

echo "==> Removing Desktop Visibility Suite from ${TARGET_DIR}..."

for cmd in desk-visibility desktop-visibility app-visibility application-visibility antigravity-visibility; do
    if [[ -L "${TARGET_DIR}/${cmd}" || -f "${TARGET_DIR}/${cmd}" ]]; then
        rm -f "${TARGET_DIR}/${cmd}"
        echo "  [✓] Removed ${cmd}"
    fi
done

EXT_NAME="tray-visibility@fbetancourt.gemini"
EXT_DEST="${HOME}/.local/share/gnome-shell/extensions/${EXT_NAME}"
if [[ -L "${EXT_DEST}" || -d "${EXT_DEST}" ]]; then
    rm -rf "${EXT_DEST}"
    echo "  [✓] Removed GNOME extension ${EXT_NAME}"
fi

echo "==> Uninstallation complete."
