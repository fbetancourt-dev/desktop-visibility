---
name: desktop-visibility
description: >-
  Manage desktop and application visibility for clean screenshots, video recordings, live streaming, and privacy on Ubuntu / GNOME.
  Covers desk-visibility (desktop icons/folders via DING extension), app-visibility (Ubuntu Dock launchers, running dots, and top-bar tray appindicators), antigravity-visibility (Dock and Tray only until restore), and psensor-visibility (Tray thermometer and startup control).
---

# Desktop & Application Visibility Management Skill 🖥️✨

Universal Agent Skill for cleanly managing the visual visibility of the GNOME desktop environment, individual application artifacts (Dock launchers, active running indicators, top-bar tray status icons), and desktop folders/files for **clean screen recordings, distraction-free presentations, and pristine screenshots**.

Compatible with **Google Antigravity**, **Codex**, **Claude Code**, **Cursor**, and **Autonomous Agents**.

---

## Quick Reference & Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Hide Desktop Icons & Folders** | `desk-visibility hide` | Instantly disables DING extension; leaves clean wallpaper without moving files |
| **Restore Desktop Icons & Folders** | `desk-visibility show` | Re-enables DING extension; restores all folders/files |
| **Toggle Desktop Icons** | `desk-visibility toggle` | Switches between hidden and visible states |
| **Inspect Desktop Status** | `desk-visibility status` | Reports DING extension, Home/Trash, and `~/Desktop` items |
| **Hide Antigravity (Default)** | `antigravity-visibility hide` | Hides Antigravity from Dock and top bar Tray only until restore |
| **Restore Antigravity** | `antigravity-visibility restore` | Restores Antigravity Dock launcher, running dot, and Tray indicator |
| **Hide Psensor Tray** | `psensor-visibility hide` | Cleanly removes Psensor thermometer from top bar tray |
| **Restore Psensor Tray** | `psensor-visibility restore` | Restores Psensor thermometer to top bar tray |
| **Disable Psensor on Boot** | `psensor-visibility disable-startup` | Prevents Psensor from launching on system boot (clean boot) |
| **Enable Psensor on Boot** | `psensor-visibility enable-startup` | Re-enables Psensor launch on system boot |
| **Inspect Psensor Status** | `psensor-visibility status` | Reports PID, process state, tray status, and autostart configuration |
| **Hide Any App** | `app-visibility hide <app>` | Hides Dock launcher, running dot, and tray indicator (never touches desktop files) |
| **Batch App Hiding** | `app-visibility hide spotify code` | Simultaneously hides multiple applications |
| **Restore Specific App** | `app-visibility restore <app>` | Restores Dock launchers and Tray indicators for targeted app |
| **Restore All Hidden Apps** | `app-visibility restore` | Restores all currently tracked apps from state file |

---

## Subsystems & Architecture

### 1. Desktop Icon Layer (`desk-visibility`)
- **Engine:** GNOME Shell Desktop Icons NG (`ding@rastersoft.com`).
- **Mechanism:** Toggles extension state via `gnome-extensions enable/disable`.
- **Zero File Movement:** Files and folders in `~/Desktop` remain completely untouched on disk. When re-enabled, GNOME restores icons to their exact screen coordinates. `app-visibility` preserves all `~/Desktop` shortcuts.

### 2. Dock & App Indicator Management (`app-visibility`)
- **Dock Favorites:** Introspects `org.gnome.shell favorite-apps` and dynamically filters matching `.desktop` IDs (with built-in alias resolution for Spotify, VS Code, Terminal, Chrome, Antigravity, LibreOffice, etc.).
- **Running App Dots:** Toggles `org.gnome.shell.extensions.dash-to-dock show-running false` so active background processes do not display floating dock indicators.
- **Top Bar Tray (SNI):** Hides individual app indicator widgets cleanly. For background monitors like Psensor, cleanly stops the daemon to drop the StatusNotifierItem without disturbing other indicators.
- **Antigravity Preset:** Hides strictly the Dock launcher, running dot, and top-bar Tray icon until restore, leaving the active window and desktop undisturbed.

### 3. Hardware Monitor & Startup Management (`psensor-visibility`)
- **Tray Visibility:** Stops/restarts the psensor process on demand, immediately hiding or showing the thermometer tray icon.
- **Boot Startup Configuration:** Controls `~/.config/autostart/psensor.desktop` (`Hidden=true` and `X-GNOME-Autostart-enabled=false`) to ensure a pristine top bar upon system startup.

### 4. State Persistence & Safety
- **No Background Daemons:** The tools are strictly non-daemon one-shot CLI utilities.
- **Atomic Rollback:** Prior states (exact favorites order, extension statuses, running dot settings) are preserved in `~/.config/app_visibility_state.json`.
- **Self-Cleaning:** Once all hidden components or apps are restored, configuration files are automatically pruned.
