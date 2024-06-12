import { GObject } from '@girs/gobject-2.0';
import { QuickToggle } from '@girs/gnome-shell/ui/quickSettings';

export class _ConservationToggle extends QuickToggle {
  constructor(private readonly _available: boolean) {
    super();
  }

  override _init() {
    super._init({
      title: 'Conservation Mode',
      iconName:
        this._available ? 'emoji-nature-symbolic' : 'battery-level-0-symbolic',
      toggleMode: this._available,
    });
  }
}

export const ConservationToggle = GObject.registerClass(_ConservationToggle);
