import { IpcCommands } from '@/shared/ipc/commands';
import { IpcEvents } from '@/shared/ipc/events';
import { TypedIpcRenderer } from '@/types/electron-typed-ipc';
import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: Omit<ElectronAPI, 'ipcRenderer'> & {
      ipcRenderer: TypedIpcRenderer<IpcEvents, IpcCommands>;
    };
    api: unknown;
  }
}
