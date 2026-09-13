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
| **`desk-visibility`** | `desktop-visibility` | Toggles the entire desktop icon/folder layer via Desktop Icons NG (`ding@rastersoft.com`). |
| **`app-visibility`** | `application-visibility` | Hides/restores dock icons, tray indicators, desktop shortcuts, and windows for **any** application (`spotify`, `code`, `terminal`, `antigravity`, etc.). |
| **`antigravity-visibility`** | — | Convenience wrapper preconfigured for Google Antigravity & Antigravity IDE. |

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

Control dock icons, top-bar tray icons, desktop shortcuts, and windows for any installed application.

#### Basic Operations:
```bash
# Hide Spotify completely (Dock, Tray, Desktop, and minimize window)
app-visibility hide spotify

# Hide VS Code completely
app-visibility hide code

# Hide GNOME Terminal
app-visibility hide terminal

# If no application is specified, defaults to 'antigravity':
app-visibility hide

# Restore a specific application:
app-visibility restore spotify

# Restore ALL currently hidden applications:
app-visibility restore
```

#### Window Minimization Control (`--no-minimize`):
By default, hiding an application minimizes its active window. To keep the window visible on screen while stripping away dock and tray clutter:

```bash
# Keep the application window open on screen, but clean Dock and Tray
app-visibility hide code --no-minimize
app-visibility hide spotify --no-minimize
```

#### Granular Component Control (`--only` / `--skip` / `--no-*`):
Supported components: `dock`, `tray`, `window`, `desktop`.

```bash
# Hide ONLY the Dock icon for Spotify (do not minimize window, do not touch tray)
app-visibility hide spotify --only dock

# Hide Dock and Tray, but leave the window untouched
app-visibility hide code --only dock tray

# Restore only the Dock icon, leaving tray hidden
app-visibility restore spotify --only dock

# Hide everything EXCEPT the Dock
app-visibility hide terminal --no-dock

# Restore application without stealing focus / activating window
app-visibility restore code --no-window
```

#### Multi-Application Batch Hiding:
```bash
app-visibility hide spotify code terminal
app-visibility restore spotify code terminal
```

#### Live Status Inspection:
```bash
# Inspect all tracked and common applications:
app-visibility status

# Inspect a specific application:
app-visibility status spotify
```

---

### 3. `antigravity-visibility` (Antigravity Preset)

A streamlined CLI tailored for Google Antigravity and Antigravity IDE:

```bash
# Full hide (Dock, Tray, Desktop, and minimize window)
antigravity-visibility hide

# Hide Dock and Tray, but keep Antigravity window open
antigravity-visibility hide --no-minimize

# Granular control
antigravity-visibility hide --only dock tray
antigravity-visibility restore --only dock

# Full restore
antigravity-visibility restore

# Status check
antigravity-visibility status
```

---

## Technical Architecture

- **Desktop Subsystem:** Interacts directly with the GNOME Desktop Icons NG (DING) extension via `gnome-extensions` and `gsettings org.gnome.shell.extensions.ding`.
- **Dock Subsystem:** Filters application launchers dynamically from `org.gnome.shell favorite-apps` and toggles `org.gnome.shell.extensions.dash-to-dock show-running` to suppress running indicators.
- **Top Bar Tray Subsystem:** Coordinates with `ubuntu-appindicators@ubuntu.com` with reference counting across multiple hidden apps.
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
