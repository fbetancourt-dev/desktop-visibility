# Desktop Visibility Suite 🖥️✨

A lightweight, non-daemon CLI toolkit for Linux (Ubuntu / GNOME / Wayland) to cleanly hide and restore desktop artifacts, application launchers, tray icons, and desktop folders for **distraction-free screen recordings, privacy-safe screensharing, and pristine screenshots**.

---

## Why Desktop Visibility Suite?

When recording developer tutorials, streaming live demos, or capturing clean application showcase screenshots, desktop clutter (such as pinned dock icons, running app dots, top-bar system tray icons, or personal desktop folders) often gets in the way.

**Desktop Visibility Suite** provides one-shot CLI commands to instantly toggle:
1. **Desktop Icons & Folders:** Instantly hides or restores all files, shortcuts, and folders on `~/Desktop` via the native GNOME DING subsystem without moving or altering physical files.
2. **Application Dock & Tray Artifacts:** Strips application launchers from the Ubuntu Dock, suppresses active running indicators, hides top-bar appindicators, and minimizes application windows.
3. **Dedicated Antigravity Preset:** Instant toggle tailored for Google Antigravity and Antigravity IDE environments.

> [!NOTE]
> None of these tools run as background daemons. They execute instantaneous, atomic state transitions and persist state in local JSON files (`~/.config/`), ensuring 100% reversible rollbacks.

---

## Toolkit Overview

| Executable | Alias | Description |
| :--- | :--- | :--- |
| **`desk-visibility`** | `desktop-visibility` | Toggles the entire desktop icon/folder layer via Desktop Icons NG (`ding@rastersoft.com`) without moving files. |
| **`app-visibility`** | `application-visibility` | Universal manager to hide/restore dock launchers and tray indicators for **any** application (`spotify`, `code`, `terminal`, `antigravity`, `psensor`, etc.). Desktop files are never touched. |
| **`antigravity-visibility`** | — | Convenience wrapper for Google Antigravity & Antigravity IDE (hides from Dock and top bar Tray only, until restore). |
| **`psensor-visibility`** | — | Dedicated CLI to hide/restore the top bar Psensor tray icon, inspect hardware monitor status, and disable/enable startup on boot. |

---

## Installation

Clone the repository and run the installer:

```bash
git clone https://github.com/fbetancourt-dev/desktop-visibility.git
cd desktop-visibility
./install.sh
```

The installer symlinks the binaries and aliases directly into `~/.local/bin/`. Ensure `~/.local/bin` is in your `$PATH`.

To uninstall:
```bash
./uninstall.sh
```

---

## Quick Start & Usage

### 1. `desk-visibility` (Desktop Icons & Folders)

Instantly clear your desktop background without moving files:

```bash
# Hide all desktop folders and files
desk-visibility hide

# Restore all desktop folders and files
desk-visibility show
# or:
desk-visibility restore

# Toggle visibility between hidden and visible
desk-visibility toggle

# Inspect current desktop status
desk-visibility status
```

**Status Output Example:**
```text
===================================================================
                    DESKTOP VISIBILITY STATUS                      
===================================================================
Desktop Icon Layer : 🟢 Visible (Enabled)
Active Extension   : ding@rastersoft.com
Home Folder Icon   : 🟢 Shown
Trash Can Icon     : ⚪ Hidden
-------------------------------------------------------------------
Desktop Directory  : /home/fbetancourt/Desktop (2 items)
  ├ [Folder] New Folder
  ├ [Folder] New Folder 1
===================================================================
```

---

### 2. `app-visibility` (Universal Application Artifacts)

Control dock icons, running dots, and top-bar tray indicators for any installed application.

> [!NOTE]
> Physical files and shortcuts on your desktop (`~/Desktop`) are **never** moved or modified by `app-visibility`. Desktop icon visibility as a whole is managed cleanly by `desk-visibility`.

#### Basic Operations:
```bash
# Hide Antigravity (Dock launcher & running dot, and top bar Tray icon)
app-visibility hide antigravity
# or simply:
app-visibility hide

# Hide Spotify
app-visibility hide spotify

# Hide Psensor (Tray indicator)
app-visibility hide psensor

# Restore a specific application:
app-visibility restore antigravity

# Restore ALL currently hidden applications:
app-visibility restore
```

#### Smart Per-App Defaults:
- **`antigravity` / `antigravity-ide`**: Targets `dock` and `tray` only. Leaves windows and desktop untouched.
- **`psensor`**: Targets `tray` only. Cleanly stops the background monitor daemon so the thermometer disappears without touching other tray icons.
- **Other apps**: Targets `dock` and `tray`. Add `--minimize` if you also want to minimize its window.

#### Granular Component Control (`--only` / `--skip` / `--no-*`):
Supported components: `dock`, `tray`, `window`.

```bash
# Hide ONLY the Dock icon for Spotify (leave tray untouched)
app-visibility hide spotify --only dock

# Hide Dock and Tray, and also minimize the window
app-visibility hide code --minimize

# Restore only the Dock icon, leaving tray hidden
app-visibility restore spotify --only dock
```

#### Multi-Application Batch Hiding:
```bash
app-visibility hide spotify code
app-visibility restore spotify code
```

#### Live Status Inspection:
```bash
# Inspect all tracked and common applications:
app-visibility status

# Inspect a specific application:
app-visibility status antigravity
app-visibility status psensor
```

---

### 3. `antigravity-visibility` (Antigravity Preset)

A streamlined CLI tailored for Google Antigravity and Antigravity IDE. Hides from the Dock and top bar Tray until restore is called, leaving windows and desktop shortcuts completely undisturbed:

```bash
# Hide Antigravity from Dock and top bar Tray
antigravity-visibility hide

# Restore Antigravity icons (Dock launcher, running dot, and Tray indicator)
antigravity-visibility restore

# Toggle visibility between hidden and restored
antigravity-visibility toggle

# Check visibility status
antigravity-visibility status
```

---

### 4. `psensor-visibility` (Psensor Hardware Monitor)

Dedicated CLI for managing Psensor visibility and system startup. Hides the thermometer indicator from the top bar tray cleanly and allows enabling or disabling Psensor on system boot:

```bash
# Hide Psensor thermometer icon from top bar tray
psensor-visibility hide

# Restore Psensor thermometer icon
psensor-visibility restore

# Toggle Psensor visibility
psensor-visibility toggle

# Inspect process status, PID, tray status, and startup on boot
psensor-visibility status

# Disable Psensor autostart on system boot (clean boot)
psensor-visibility disable-startup

# Enable Psensor autostart on system boot
psensor-visibility enable-startup
```

---

## Technical Architecture

- **Desktop Subsystem:** Interacts directly with the GNOME Desktop Icons NG (DING) extension via `gnome-extensions` and `gsettings org.gnome.shell.extensions.ding`.
- **Dock Subsystem:** Filters application launchers dynamically from `org.gnome.shell favorite-apps` and toggles `org.gnome.shell.extensions.dash-to-dock show-running` to suppress running indicators.
- **Top Bar Tray Subsystem:** Integrates with the companion GNOME Shell extension (`tray-visibility@fbetancourt.gemini`) to surgically hide individual app indicator widgets via D-Bus without disturbing global system monitors (such as Psensor). Also supports fallback global toggling via `ubuntu-appindicators@ubuntu.com`.
- **Window Management:** Integrates with Wayland-compliant AT-SPI automation (`desktop-dom` and native `Super + H` shortcuts) for window focus and minimization.
- **State Persistence:** Preserves pristine system configurations in `~/.config/app_visibility_state.json` for guaranteed recovery.

---

## Compatibility

- **OS:** Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, and Debian/GNOME derivatives.
- **Display Servers:** Wayland (default) and X11.
- **Desktop Environments:** GNOME Shell 42+ with Ubuntu Dock / Dash-to-Dock.

---

## License

MIT © [Francisco Betancourt](https://github.com/fbetancourt-dev)
