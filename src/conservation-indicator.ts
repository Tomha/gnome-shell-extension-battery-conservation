import { GObject } from '@girs/gobject-2.0';
import { panel } from '@girs/gnome-shell/ui/main';
import {
  QuickToggle,
  SystemIndicator,
} from '@girs/gnome-shell/ui/quickSettings';
import { Gio } from '@girs/gio-2.0';
import { Shell } from '@girs/shell-14';
import { ConservationToggle } from './conservation-toggle';
import { St } from '@girs/st-14';

export class _ConservationIndicator extends SystemIndicator {
  private _indicator: St.Icon | null = null;
  private readonly _sysConservation: string | null = null;
  private _toggle: QuickToggle | null = null;
  private _monitor: Gio.FileMonitor | null = null;

  constructor(sysConservation: string) {
    super();

    this._sysConservation = sysConservation;
  }

  override _init() {
    super._init();

    // Create the icon for the indicator
    this._indicator = this._addIndicator();
    this._indicator.icon_name = 'emoji-nature-symbolic';
    this._monitor = null;

    if (this._sysConservation !== null) {
      // Create the toggle.
      this._toggle = new ConservationToggle(false);
      this._toggle.connect('clicked', (item) => {
        this._setConservationMode(item.get_checked());
      });

      // Monitor the changes and show or hide the indicator accordingly.
      const fileM = Gio.file_new_for_path(this._sysConservation);
      this._monitor = fileM.monitor(Gio.FileMonitorFlags.NONE, null);
      this._monitor.connect('changed', this._syncStatus.bind(this));

      // Set the initial and proper indicator status.
      this._syncStatus();
    } else {
      // Use the toggle to signal the error.
      this._toggle = new ConservationToggle(false);
      if (this._indicator !== null) this._indicator.visible = false;
    }

    // Make sure to destroy the toggle along with the indicator.
    this.connect('destroy', () => {
      this.quickSettingsItems.forEach((item) => item.destroy());
      if (this._monitor !== null) this._monitor.cancel();
    });

    this.quickSettingsItems.push(this._toggle);
    // Add the indicator to the panel and the toggle to the menu.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    panel.statusArea.quickSettings.addExternalIndicator(this);
  }

  _syncStatus() {
    if (this._sysConservation === null) return;
    const status = Shell.get_file_contents_utf8_sync(this._sysConservation);
    if (status === null) return;
    const active = status.trim() == '1';
    if (this._indicator !== null) this._indicator.visible = active;
    if (this._toggle !== null) this._toggle.set_checked(active);
  }

  _setConservationMode(enabled: boolean) {
    const new_status = enabled ? '1' : '0';
    const subprocess = Gio.Subprocess.new(
      `/bin/sh -c 'echo ${new_status} | sudo tee ${this._sysConservation} >/dev/null'`.split(
        ' ',
      ),
      Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
    );
    subprocess.wait(null);
  }
}

export const ConservationIndicator = GObject.registerClass(
  _ConservationIndicator,
);
