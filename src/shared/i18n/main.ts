/* eslint-disable no-restricted-imports */

if (BUILD_TYPE !== 'main') {
  const path = BUILD_TYPE === 'renderer' ? '@/i18n/' : `@/i18n/${BUILD_TYPE}`;
  throw new Error(`Only import "@/i18n/main" from the renderer process. Use "${path}"`);
}

export {
  clearMainBindings as i18nClearMainBindings,
  mainBindings as i18nMainBindings,
} from 'i18next-electron-fs-backend';

export { i18nMain, initI18nMain } from './private/main';
