import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const DBUS_IFACE_XML = `
<node>
<interface name="org.gnome.Shell.Extensions.TrayVisibility">
    <method name="Hide">
        <arg name="pattern" type="s" direction="in"/>
        <arg name="hidden" type="as" direction="out"/>
    </method>
    <method name="Show">
        <arg name="pattern" type="s" direction="in"/>
        <arg name="shown" type="as" direction="out"/>
    </method>
    <method name="List">
        <arg name="items" type="as" direction="out"/>
    </method>
    <method name="Reset">
        <arg name="success" type="b" direction="out"/>
    </method>
</interface>
</node>`;

export default class TrayVisibilityImpl {
    constructor(extension) {
        this._extension = extension;
        this._hiddenActors = new Map();
        this._dbus = null;
        this._busNameId = null;
    }

    enable() {
        try {
            const nodeInfo = Gio.DBusNodeInfo.new_for_xml(DBUS_IFACE_XML);
            this._dbus = Gio.DBusExportedObject.wrapJSObject(nodeInfo.interfaces[0], this);
            this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/TrayVisibility');
            this._busNameId = Gio.DBus.session.own_name(
                'org.gnome.Shell.Extensions.TrayVisibility',
                Gio.BusNameOwnerFlags.NONE,
                null,
                null
            );
            console.log('[TrayVisibility] D-Bus service exported successfully on org.gnome.Shell.Extensions.TrayVisibility');
        } catch (e) {
            console.error(`[TrayVisibility] Error exporting DBus: ${e}`);
        }
    }

    disable() {
        this.ResetAsync([], null);
        if (this._dbus) {
            this._dbus.unexport();
            this._dbus = null;
        }
        if (this._busNameId) {
            Gio.DBus.session.unown_name(this._busNameId);
            this._busNameId = null;
        }
    }

    ListAsync(params, invocation) {
        const items = [];
        for (const [key, actor] of Object.entries(Main.panel.statusArea)) {
            if (actor) {
                let desc = key;
                if (actor._indicator) {
                    const id = actor._indicator.id || '';
                    const title = actor._indicator.title || '';
                    desc = `${key} [id:${id}] [title:${title}]`;
                }
                items.push(desc);
            }
        }
        invocation.return_value(new GLib.Variant('(as)', [items]));
    }

    HideAsync(params, invocation) {
        const [pattern] = params;
        const pat = (pattern || '').toLowerCase();
        const hiddenKeys = [];

        for (const [key, actor] of Object.entries(Main.panel.statusArea)) {
            if (!actor) continue;
            const keyLower = key.toLowerCase();
            let matches = keyLower.includes(pat);

            if (!matches && actor._indicator) {
                const id = (actor._indicator.id || '').toLowerCase();
                const title = (actor._indicator.title || '').toLowerCase();
                const bus = (actor._indicator._proxy?.g_name_owner || '').toLowerCase();
                if (id.includes(pat) || title.includes(pat) || bus.includes(pat)) {
                    matches = true;
                }
            }

            if (matches) {
                actor.visible = false;
                this._hiddenActors.set(key, actor);
                hiddenKeys.push(key);
            }
        }

        if (invocation)
            invocation.return_value(new GLib.Variant('(as)', [hiddenKeys]));
    }

    ShowAsync(params, invocation) {
        const [pattern] = params;
        const pat = (pattern || '').toLowerCase();
        const shownKeys = [];

        for (const [key, actor] of this._hiddenActors.entries()) {
            let matches = !pat || key.toLowerCase().includes(pat);
            if (!matches && actor && actor._indicator) {
                const id = (actor._indicator.id || '').toLowerCase();
                const title = (actor._indicator.title || '').toLowerCase();
                if (id.includes(pat) || title.includes(pat)) {
                    matches = true;
                }
            }

            if (matches) {
                try {
                    actor.visible = true;
                } catch (e) {}
                this._hiddenActors.delete(key);
                shownKeys.push(key);
            }
        }

        if (invocation)
            invocation.return_value(new GLib.Variant('(as)', [shownKeys]));
    }

    ResetAsync(params, invocation) {
        for (const [key, actor] of this._hiddenActors.entries()) {
            try {
                actor.visible = true;
            } catch (e) {}
        }
        this._hiddenActors.clear();
        if (invocation)
            invocation.return_value(new GLib.Variant('(b)', [true]));
    }
}
