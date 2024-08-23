/* eslint-disable no-restricted-imports */
import type { IpcRendererEvent } from 'electron';
import i18next, { Callback, TFunction } from 'i18next';
import backend from 'i18next-electron-fs-backend';
import { HMRPlugin } from 'i18next-hmr/plugin';
import { createElement, FC, ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../constants';
import {
  I18N_IPC_CHANNEL,
  I18N_WINDOW_NAMESPACE,
  i18nCommonConfig,
  I18nIpcData,
  I18nWindowNs,
} from './shared';

export type I18nLang = (typeof AVAILABLE_LANGUAGES)[number];

export const i18n: TypedI18n = ((): typeof i18next => {
  const i18ns = (window as object)[I18N_WINDOW_NAMESPACE] as I18nWindowNs;
  const localesPath =
    process.env.NODE_ENV !== 'production' || IS_PREVIEW
      ? 'resources/locales'
      : 'resources/app.asar.unpacked/resources/locales';

  i18ns.i18nextElectronBackend.onLanguageChange((args) => {
    console.log('i18nextElectronBackend.onLanguageChange', args);
    i18next.changeLanguage(args.lng, (error) => {
      console.log('changeLanguage', args, error);
      if (error) {
        console.error(error);
      }
    });
  });

  i18next
    .use(backend)
    .use(initReactI18next)
    .use(new HMRPlugin({ vite: { client: true } }))
    .init({
      ...i18nCommonConfig,
      backend: {
        loadPath: localesPath + '/{{lng}}/{{ns}}.json',
        addPath: localesPath + '/{{lng}}/{{ns}}.missing.json',
        contextBridgeApiKey: I18N_WINDOW_NAMESPACE,
      },
      lng: DEFAULT_LANGUAGE,
    });

  // @ts-ignore (defined in dts)
  (window.electron.ipcRenderer.on as I18nIpcRendererOn)(
    I18N_IPC_CHANNEL,
    (ev, data: I18nIpcData) => {
      if (data.op !== 'languageChanged') {
        throw new Error(`Unknown IPC event on i18n channel (${I18N_IPC_CHANNEL}): ${data.op}`);
      }
      i18next.changeLanguage(data.lng);
    }
  );

  return i18next;
})();

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) =>
  createElement(I18nextProvider, { i18n: i18next }, children);

type I18nIpcRendererOn = (
  channel: typeof I18N_IPC_CHANNEL,
  listener: (ev: IpcRendererEvent, data: I18nIpcData) => void
) => void;

type TypedI18n = Omit<typeof i18next, 'changeLanguage'> & {
  changeLanguage(lng?: string, callback?: Callback): Promise<TFunction>;
};
