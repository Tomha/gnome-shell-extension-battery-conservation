// eslint-disable-next-line @typescript-eslint/no-unused-vars
import '@girs/gjs/dom';

import {
  Extension,
  ExtensionMetadata,
} from '@girs/gnome-shell/extensions/extension';
import { autoDevDiscovery } from './auto-dev-discovery';
import { ConservationIndicator } from './conservation-indicator';
import { quickSettings } from '@girs/gnome-shell/ui';

// MANUAL OVERRIDE
// to disable the auto-discovery more, just set the absolute device path here
// E.g.: "/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode"
let sys_conservation: string | null = null;

export default class IdeaPadExtension extends Extension {
  private _indicator: quickSettings.SystemIndicator | null = null;

  constructor(metadata: ExtensionMetadata) {
    super(metadata);

    this._indicator = null;
  }

  override enable() {
    const sysfs_path = '/sys/bus/platform/drivers/thinkpad_acpi';

    if (sys_conservation === null) {
      try {
        sys_conservation = autoDevDiscovery(sysfs_path);
        if (sys_conservation === null) {
          throw new Error('Battery conservation mode not available.');
        }
        console.info(`Device found at: ${sys_conservation}`);
      } catch (e) {
        console.error(e, this.metadata.name);
      }
    }

    if (sys_conservation !== null) {
      this._indicator = new ConservationIndicator(sys_conservation);
    }
  }

  override disable() {
    if (this._indicator !== null) {
      this._indicator.destroy();
    }

    this._indicator = null;
  }
}
