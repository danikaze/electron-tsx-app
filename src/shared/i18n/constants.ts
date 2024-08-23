/**
 * Default language of the application.
 *
 * Will be used at the beginning, but once the user sets one, it will be
 * remembered by using the user settings store.
 */
export const DEFAULT_LANGUAGE: (typeof AVAILABLE_LANGUAGES)[number] = 'en';

/**
 * Every available language provided in the application.
 *
 * They can be named in `src/locales/[LANG]/languages.json`
 */
export const AVAILABLE_LANGUAGES = ['en', 'ja'] as const;

/**
 * Default namespace used if not passed to translation function
 */
export const DEFAULT_NAMESPACES: string | readonly string[] = [];

/**
 * Namespaces to load by default when creating the i18n instance
 */
export const INITIAL_NAMESPACES: string | readonly string[] = [];
