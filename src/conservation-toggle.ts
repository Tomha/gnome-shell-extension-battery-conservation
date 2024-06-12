import { GObject } from '@girs/gobject-2.0';
import { quickSettings } from '@girs/gnome-shell/ui';
import { gettext as _ } from '@girs/gnome-shell/extensions/extension';

export class _ConservationToggle extends quickSettings.QuickToggle {
  constructor(private readonly _available: boolean) {
    super();
  }

  override _init() {
    super._init({
      title: _('Conservation Mode'),
      iconName:
        this._available ? 'emoji-nature-symbolic' : 'battery-level-0-symbolic',
      toggleMode: this._available,
    });
  }
}

export const ConservationToggle = GObject.registerClass(_ConservationToggle);
