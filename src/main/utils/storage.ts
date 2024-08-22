import Store from 'electron-store';

import { WindowBounds, WindowId } from '@/types/app';
import { Settings } from '@/types/settings';

type StoredData = Partial<Record<`windowState.${WindowId}`, WindowBounds>> & {
  /**
   * Last language set by the user. Managed outside `settings` as it's logic is
   * already handled automatically
   */
  lang: string;
  /** User-defined settings */
  settings: Settings;
};

export const store = new Store<StoredData>();
