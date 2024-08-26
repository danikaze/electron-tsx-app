/* eslint-disable no-restricted-imports */
import type { Callback, i18n as I18n, InitOptions, TFunction } from 'i18next';
import type { PreloadBindings } from 'i18next-electron-fs-backend';

import { I18nLang } from '..';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_NAMESPACES,
  INITIAL_NAMESPACES,
} from '../constants';
import { I18nMessageData, I18nNamespaces } from '../types';

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

/**
 * Since having strong types in i18n disables some features (such as specifying lists
 * for keys and namespaces...) it can be disabled but just setting I18nNamespaces to
 * `never`. This is just a encapsulation of the detection logic.
 */
export type AreTFunctionTypesDisabled = [I18nNamespaces] extends [never]
  ? true
  : false;
/**
 * Same as `AreTFunctionTypesDisabled` but for the data accepted in the `TFunction`, so it might
 * be used typing namespaces and keys, but not the parameters itself.
 */
export type AreParameterTypesDisabled = [I18nMessageData] extends [never]
  ? true
  : false;

/**
 * TypedI18n is just the original i18n but with some improvements for the most used functions,
 * to accept only the defined languages, defined translations keys, etc.
 */
export type TypedI18n = Omit<I18n, 'changeLanguage' | 't'> & {
  changeLanguage(lng?: string, callback?: Callback): Promise<TFunction>;
  t: TypedGlobalTFunction;
  setDefaultNamespace: AreTFunctionTypesDisabled extends true
    ? I18n['setDefaultNamespace']
    : (ns: keyof I18nNamespaces) => void;
  hasLoadedNamespace: AreTFunctionTypesDisabled extends true
    ? I18n['hasLoadedNamespace']
    : (
        ns: keyof I18nNamespaces,
        options?: Parameters<I18n['hasLoadedNamespace']>
      ) => boolean;
  loadNamespaces: AreTFunctionTypesDisabled extends true
    ? I18n['loadNamespaces']
    : (
        ns: keyof I18nNamespaces | readonly (keyof I18nNamespaces)[],
        callback?: Callback
      ) => Promise<void>;
  loadLanguages: AreTFunctionTypesDisabled extends true
    ? I18n['loadLanguages']
    : (
        ns: I18nLang | readonly I18nLang[],
        callback?: Callback
      ) => Promise<void>;
};

export type TypedTFunction<NS extends keyof I18nNamespaces> =
  AreTFunctionTypesDisabled extends true
    ? TFunction
    : AreParameterTypesDisabled extends true
      ? TFunction<NS>
      : <K extends keyof I18nNamespaces[NS]>(
          ...args: [MessageOptions<NS, K>] extends [never]
            ? // if `K` doesn't have defined arguments, accept only 1 parameter
              [key: K]
            : // if `K` has defined data in `MessageData`, require 2 parameters
              [key: K, options: MessageOptions<NS, K>]
        ) => string;

export type TypedGlobalTFunction = AreTFunctionTypesDisabled extends true
  ? TFunction
  : AreParameterTypesDisabled extends true
    ? TFunction
    : <NS extends keyof I18nNamespaces, K extends keyof I18nNamespaces[NS]>(
        ...args: [MessageOptions<NS, K>] extends [never]
          ? // if `K` doesn't have defined arguments, still needs to accept the ns
            [key: K, options: { ns: NS }]
          : // if `K` has defined data in `MessageData`, require 2 parameters
            [key: K, options: { ns: NS } & MessageOptions<NS, K>]
      ) => string;

export type MessageOptions<
  NS extends keyof I18nNamespaces,
  K extends keyof I18nNamespaces[NS],
> = K extends keyof I18nMessageData[NS]
  ? I18nMessageData[NS][K] extends string[]
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Record<I18nMessageData[NS][K][number], any>
    : never
  : never;
