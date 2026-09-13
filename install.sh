#!/usr/bin/env bash
# ==============================================================================
# Desktop Visibility Suite - Installer
# Links executables and convenience aliases into ~/.local/bin
# ==============================================================================
set -euo pipefail

TARGET_DIR="${HOME}/.local/bin"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Installing Desktop Visibility Suite into ${TARGET_DIR}..."
mkdir -p "${TARGET_DIR}"

# 1. Install primary tools
for tool in desk-visibility app-visibility antigravity-visibility psensor-visibility; do
    chmod +x "${SCRIPT_DIR}/${tool}"
    ln -sf "${SCRIPT_DIR}/${tool}" "${TARGET_DIR}/${tool}"
    echo "  [✓] Linked ${tool} -> ${TARGET_DIR}/${tool}"
done

# 2. Install ergonomic aliases
ln -sf "${TARGET_DIR}/desk-visibility" "${TARGET_DIR}/desktop-visibility"
echo "  [✓] Created alias desktop-visibility -> desk-visibility"

ln -sf "${TARGET_DIR}/app-visibility" "${TARGET_DIR}/application-visibility"
echo "  [✓] Created alias application-visibility -> app-visibility"

# 3. Install GNOME Shell extension for surgical tray visibility
EXT_NAME="tray-visibility@fbetancourt.gemini"
EXT_SRC="${SCRIPT_DIR}/gnome-extension/${EXT_NAME}"
EXT_DEST="${HOME}/.local/share/gnome-shell/extensions/${EXT_NAME}"
if [[ -d "${EXT_SRC}" ]]; then
    mkdir -p "${HOME}/.local/share/gnome-shell/extensions"
    ln -sfn "${EXT_SRC}" "${EXT_DEST}"
    echo "  [✓] Installed GNOME extension ${EXT_NAME} -> ${EXT_DEST}"
fi

# 4. Check PATH
if [[ ":${PATH}:" != *":${TARGET_DIR}:"* ]]; then
    echo ""
    echo "[!] Note: ${TARGET_DIR} is not in your current PATH."
    echo "    Add it to your ~/.bashrc or ~/.zshrc:"
    echo "      export PATH=\"\${HOME}/.local/bin:\${PATH}\""
fi

echo ""
echo "==> Installation complete! Available commands:"
echo "    - desk-visibility (alias: desktop-visibility)"
echo "    - app-visibility  (alias: application-visibility)"
echo "    - antigravity-visibility"
echo "    - psensor-visibility"
