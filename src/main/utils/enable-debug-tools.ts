import { app } from 'electron';
import debug from 'electron-debug';
import devtoolsInstaller from 'electron-devtools-installer';

/**
 * Installs the developer tools in Electron.
 *
 * - Developer Tools are enabled on development mode or when the environment
 * variable `DEBUG` is explicitly set to `"true"`
 * - Debug mode can be disabled on development mode if `DEBUG` is `"false"`
 * - Extensions can be forced to download by setting `UPGRADE_EXTENSIONS` to
 * `"true"`
 *
 * Note that ReactDevTools don't show anyways...
 * https://github.com/MarshallOfSound/electron-devtools-installer/issues/195
 *
 * @returns Promise resolved when done
 */
export async function enableDebugTools(): Promise<void> {
  const enabled =
    process.env.DEBUG !== 'false' &&
    (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true');
  if (!enabled) return;

  await Promise.all([enableDebugShortcuts(), installExtensions()]);
}

async function enableDebugShortcuts(): Promise<void> {
  debug({ isEnabled: true });
  console.info('Debug shortcuts enabled');
}

async function installExtensions(): Promise<void> {
  // some weird thing is happening with imports like this...
  // default not properly resolved...
  const { default: installExtension, REACT_DEVELOPER_TOOLS } =
    devtoolsInstaller as unknown as typeof import('electron-devtools-installer');

  await app.whenReady();

  const extensions = [REACT_DEVELOPER_TOOLS];
  const forceDownload = process.env.UPGRADE_EXTENSIONS === 'true';

  for (const extension of extensions) {
    try {
      const extName = await installExtension(extension, forceDownload);
      console.info(`Added extension: ${extName} (${extension.id})`);
    } catch (e) {
      console.warn('Errors happened while installing extensions:\n', e);
    }
  }
}
