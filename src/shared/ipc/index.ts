import {
  type BrowserWindow,
  type WebContents,
  // eslint-disable-next-line no-restricted-imports
  ipcMain as electronIpcMain,
  // eslint-disable-next-line no-restricted-imports
  ipcRenderer as electronIpcRenderer,
} from 'electron';
import type { TypedIpcMain, TypedIpcRenderer } from '@/types/electron-typed-ipc.d.ts';

import type { WindowId } from '@/types/app';

import { IpcEvents } from './events';
import { IpcCommands } from './commands';

/**
 * typed `electron.ipcMain`
 * Do not import the one from electron directly because it's not typed
 */
export const ipcMain = electronIpcMain as TypedIpcMain<IpcEvents, IpcCommands>;

/**
 * typed `electron.ipcRenderer`
 * Do not import the one from electron directly because it's not typed
 */
export const ipcRenderer = electronIpcRenderer as TypedIpcRenderer<IpcEvents, IpcCommands>;

const registeredTargets = new Map<WindowId, WebContents>();

/**
 * Register a window so it can be easily accessible from any part of the
 * application
 *
 * @param id Unique window id
 * @param window Window to register
 */
export function registerIpcTarget(id: WindowId, window: BrowserWindow): void {
  registeredTargets.set(id, window.webContents);
}

/**
 * Send an event to a window.
 * If it was registered, it can be accessed via its ID
 *
 * @param window Target window
 * @param channel Event channel
 * @param args Data for the event
 */
export function sendEventToWindow<K extends keyof IpcEvents>(
  window: WindowId | WebContents,
  channel: K,
  ...args: Parameters<IpcEvents[K]>
): void {
  const target = typeof window === 'string' ? registeredTargets.get(window) : window;

  if (!target) {
    throw new Error(`The window "${window}" hasn't been registered yet`);
  }

  target.send(channel, ...args);
}
