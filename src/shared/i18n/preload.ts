/* eslint-disable no-restricted-imports */

if (BUILD_TYPE !== 'preload') {
  const path = BUILD_TYPE === 'renderer' ? '@/i18n/' : `@/i18n/${BUILD_TYPE}`;
  throw new Error(`Only import "@/i18n/preload" from the renderer process. Use "${path}"`);
}

export { initI18nPreload } from './private/preload';
