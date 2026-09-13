---
name: desktop-visibility
description: >-
  Manage desktop and application visibility for clean screenshots, video recordings, live streaming, and privacy on Ubuntu / GNOME.
  Covers desk-visibility (desktop icons/folders via DING extension), app-visibility (Ubuntu Dock launchers, running dots, top-bar tray appindicators, and window minimization/restoration with --no-minimize and granular component controls), and antigravity-visibility presets.
---

# Desktop & Application Visibility Management Skill 🖥️✨

Universal Agent Skill for cleanly managing the visual visibility of the GNOME desktop environment, individual application artifacts (Dock launchers, active running indicators, top-bar tray status icons, active windows), and desktop folders/files for **clean screen recordings, distraction-free presentations, and pristine screenshots**.

Compatible with **Google Antigravity**, **Codex**, **Claude Code**, **Cursor**, and **Autonomous Agents**.

---

## Quick Reference & Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Hide Desktop Icons & Folders** | `desk-visibility hide` | Instantly disables DING extension; leaves clean wallpaper |
| **Restore Desktop Icons & Folders** | `desk-visibility show` | Re-enables DING extension; restores all folders/files |
| **Toggle Desktop Icons** | `desk-visibility toggle` | Switches between hidden and visible states |
| **Inspect Desktop Status** | `desk-visibility status` | Reports DING extension, Home/Trash, and `~/Desktop` items |
| **Hide Any App (Full)** | `app-visibility hide <app>` | Hides Dock, Tray, Desktop shortcut, and minimizes window |
| **Hide App (Keep Window Open)** | `app-visibility hide <app> --no-minimize` | Cleans Dock and Tray without minimizing app window |
| **Selective Hide Component** | `app-visibility hide <app> --only dock tray` | Only hides specified components (`dock`, `tray`, `window`, `desktop`) |
| **Batch App Hiding** | `app-visibility hide spotify code terminal` | Simultaneously hides multiple applications |
| **Restore Specific App** | `app-visibility restore <app>` | Restores Dock, Tray, and window for targeted app |
| **Restore All Hidden Apps** | `app-visibility restore` | Restores all currently tracked apps from state file |
| **Antigravity Quick Preset** | `antigravity-visibility hide` / `restore` | Dedicated one-shot preset for Antigravity IDE |

---

## Subsystems & Architecture

### 1. Desktop Icon Layer (`desk-visibility`)
- **Engine:** GNOME Shell Desktop Icons NG (`ding@rastersoft.com`).
- **Mechanism:** Toggles extension state via `gnome-extensions enable/disable`.
- **Zero File Movement:** Files and folders in `~/Desktop` remain completely untouched on disk. When re-enabled, GNOME restores icons to their exact screen coordinates.

### 2. Dock & App Indicator Management (`app-visibility`)
- **Dock Favorites:** Introspects `org.gnome.shell favorite-apps` and dynamically filters matching `.desktop` IDs (with built-in alias resolution for Spotify, VS Code, Terminal, Chrome, Antigravity, LibreOffice, etc.).
- **Running App Dots:** Toggles `org.gnome.shell.extensions.dash-to-dock show-running false` so active background processes do not display floating dock indicators.
- **Top Bar Tray (SNI):** Controls `ubuntu-appindicators@ubuntu.com` with reference counting across active apps.
- **Window Management:** Uses Wayland-compliant AT-SPI automation (`desktop-dom` and native `Super + H` shortcuts) to minimize or reactivate application windows.

### 3. State Persistence & Safety
- **No Background Daemons:** The tools are strictly non-daemon one-shot CLI utilities.
- **Atomic Rollback:** Prior states (exact favorites order, extension statuses, window states) are preserved in `~/.config/app_visibility_state.json`.
- **Self-Cleaning:** Once all hidden components or apps are restored, the configuration files are automatically pruned.

---

## Agent Usage Guidelines

When preparing the desktop for clean media capture or live demos:
1. **Desktop Cleanup:** Run `desk-visibility hide` before capturing fullscreen shots to remove personal folders or desktop clutter.
2. **App Suppression:** If capturing another application or a clean workspace, use `app-visibility hide <app>` (e.g., `app-visibility hide spotify code`) to remove distracting dock dots and tray icons.
3. **Capture Mode with Visible Window:** If taking a showcase screenshot of an app without dock clutter, use `app-visibility hide <app> --no-minimize`.
4. **Post-Task Teardown:** Always restore the desktop state at the end of the operation using `desk-visibility show` and `app-visibility restore`.
