/* eslint-disable no-restricted-imports */
import { InitOptions } from 'i18next';
import { PreloadBindings } from 'i18next-electron-fs-backend';

import {
  AVAILABLE_LANGUAGES,
  DEFAULT_NAMESPACES as DEFAULT_NAMESPACES,
  INITIAL_NAMESPACES,
} from '../constants';
import { I18nLang } from '..';

/**
 * Definition of the data prepared on preload time into `window[I18N_WINDOW_NAMESPACE]`
 */
export type I18nWindowNs = {
  /** Initial language to load */
  getInitialLang: () => Promise<I18nLang>;
  /** Defined and used internally by i18next-electron-fs-backend */
  i18nextElectronBackend: PreloadBindings;
};

export type I18nIpcData =
  | {
      op: 'changeLanguage' | 'languageChanged';
      lng: I18nLang;
    }
  | { op: 'getInitialLang' };

export const I18N_WINDOW_NAMESPACE = '__i18n';
export const I18N_IPC_CHANNEL = '__i18nextElectronBackend';
export const i18nCommonConfig: InitOptions = {
  interpolation: {
    escapeValue: false,
  },
  debug: false,
  saveMissing: true,
  saveMissingTo: 'current',
  supportedLngs: AVAILABLE_LANGUAGES,
  fallbackLng: false,
  react: {},
  ignoreJSONStructure: true,
  defaultNS: DEFAULT_NAMESPACES,
  ns: INITIAL_NAMESPACES,
};
