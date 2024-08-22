/* eslint-disable no-restricted-imports */
import { contextBridge, ipcRenderer } from 'electron';
import { preloadBindings } from 'i18next-electron-fs-backend';

import { I18N_IPC_CHANNEL, I18N_WINDOW_NAMESPACE, I18nWindowNs } from './shared';

if (BUILD_TYPE !== 'preload') {
  throw new Error(
    `Only import "@/i18n/preload" from the renderer process. Use "@/i18n/${BUILD_TYPE}"`
  );
}

export function initI18nPreload(): void {
  const data: I18nWindowNs = {
    getInitialLang: () => ipcRenderer.invoke(I18N_IPC_CHANNEL, { op: 'getInitialLang' }),
    i18nextElectronBackend: preloadBindings(ipcRenderer, process),
  };

  try {
    // Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is
    // enabled, otherwise just add to the DOM global.
    if (process.contextIsolated) {
      contextBridge.exposeInMainWorld(I18N_WINDOW_NAMESPACE, data);
    } else {
      window[I18N_WINDOW_NAMESPACE] = data;
    }
  } catch (e) {
    console.log('error', e);
  }
}
