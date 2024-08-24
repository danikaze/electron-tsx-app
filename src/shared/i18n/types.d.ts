/*
 * Providing `I18nNamespaces` and `I18nMessageData` makes your TFunction much more robust
 * with translation keys and parameters strongly typed.
 * On the other hand, it also limits its flexibility as only one Namespace and key are
 * accepted at the same time, but depending on the usage, it could result in a very powerful
 * feature.
 *
 * To disable this types, just set `I18nNamespaces` and `I18nMessageData` to `never`
 */
import testApp from 'resources/locales/en/test-app.json';

/**
 * Definition of translation files that provides the keys for each one
 */
export type I18nNamespaces = {
  'test-app': typeof testApp;
};

/**
 * Definition for each of the messages requiring parameters to provide correct
 * types when using their TFunction, defined as:
 * ```
 * Partial<{
 *   [NS in keyof Namespaces]: Partial<Record<keyof Namespaces[NS], string[]>>;
 * }>;
 * ```
 */
export type I18nMessageData = {
  'test-app': {
    'images.alt': ['format'];
  };
};
