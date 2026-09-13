import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class TrayVisibilityExtension extends Extension {
    async enable() {
        try {
            const mod = await import(`./impl.js?v=${Date.now()}`);
            this._impl = new mod.default(this);
            this._impl.enable();
        } catch (e) {
            console.error(`[TrayVisibility] Enable error: ${e}`);
        }
    }

    disable() {
        if (this._impl) {
            try {
                this._impl.disable();
            } catch (e) {
                console.error(`[TrayVisibility] Disable error: ${e}`);
            }
            this._impl = null;
        }
    }
}
