/* eslint-disable no-restricted-imports */
import { ipcMain, type IpcMainInvokeEvent } from 'electron';
import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import { HMRPlugin } from 'i18next-hmr/plugin';
import { join } from 'path';

import { store } from '@/main/utils/storage';

import { DEFAULT_LANGUAGE } from './constants';
import { I18N_IPC_CHANNEL, i18nCommonConfig, I18nIpcData } from './shared';

type I18nIpcMainHandle = (
  channel: typeof I18N_IPC_CHANNEL,
  listener: (ev: IpcMainInvokeEvent, data: I18nIpcData) => void
) => void;

if (BUILD_TYPE !== 'main') {
  throw new Error(
    `Only import "@/i18n/main" from the renderer process. Use "@/i18n/${BUILD_TYPE}"`
  );
}

export {
  clearMainBindings as i18nClearMainBindings,
  mainBindings as i18nMainBindings,
} from 'i18next-electron-fs-backend';

export const i18nMain = i18next;

export function initI18nMain(): Promise<typeof i18nMain> {
  return new Promise<typeof i18nMain>((resolve) => {
    const localesPath =
      process.env.NODE_ENV !== 'production' || IS_PREVIEW
        ? join('resources', 'locales')
        : join('resources', 'app.asar.unpacked', 'resources', 'locales');

    i18nMain
      .use(backend)
      .use(new HMRPlugin({ vite: { client: false } }))
      .init({
        ...i18nCommonConfig,
        backend: {
          debug: false,
          loadPath: join(localesPath, '{{lng}}', '{{ns}}.json'),
          addPath: join(localesPath, '{{lng}}', '{{ns}}.missing.json'),
        },
        lng: store.get('lang', DEFAULT_LANGUAGE),
      });

    i18nMain.on('languageChanged', async (lang) => {
      // update the settings with the selected language
      // so it can be loaded from the start the next time
      console.log('main.languageChanged', lang);
      store.set('lang', lang);
    });

    i18nMain.on('initialized', async () => {
      resolve(i18nMain);
    });

    (ipcMain.handle as I18nIpcMainHandle)(I18N_IPC_CHANNEL, (ev, data) => {
      if (data.op === 'changeLanguage') {
        i18nMain.changeLanguage(data.lng);
        return;
      }

      if (data.op === 'getInitialLang') {
        return store.get('lang');
      }

      throw new Error(`Unknown IPC command on i18n channel (${I18N_IPC_CHANNEL}): ${data.op}`);
    });
  });
}
