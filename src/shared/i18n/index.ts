/* eslint-disable no-restricted-imports */

if (BUILD_TYPE !== 'renderer') {
  throw new Error(`Only import "@/i18n" from the renderer process. Use "@/i18n/${BUILD_TYPE}"`);
}

export { I18nContext, useTranslation } from 'react-i18next';
export { PreloadI18nNs, WithI18nNs, WithSuspense } from './private/components';
export { i18n, type I18nLang, I18nProvider } from './private/renderer';
