import { Gio } from '@girs/gio-2.0';

export const autoDevDiscovery = (search_path: string): string | null => {
  const mod_path = Gio.file_new_for_path(search_path);

  const walker = mod_path.enumerate_children(
    'standard::name',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
    null,
  );

  let child: Gio.FileInfo | null = null;
  let found: string | null = null;

  while ((child = walker.next_file(null))) {
    if (child.get_is_symlink() && child.get_name().startsWith('VPC2004')) {
      // ideapad_device_ids[] from the kernel module ideapad_acpi.c
      found = autoDevDiscovery(`${search_path}/${child.get_name()}`);
    } else if (child.get_name() == 'conservation_mode') {
      found = `${search_path}/${child.get_name()}`;
    }
    // Stop as soon as the device is found.
    if (found !== null) {
      return found;
    }
  }

  return null;
};
