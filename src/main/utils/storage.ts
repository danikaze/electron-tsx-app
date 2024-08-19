import Store from 'electron-store';

import { WindowBounds, WindowId } from '@/types/app';
import { Settings } from '@/types/settings';

type StoredData = Partial<Record<`windowState.${WindowId}`, WindowBounds>> & {
  /** User-defined settings */
  settings: Settings;
};

export const store = new Store<StoredData>();
