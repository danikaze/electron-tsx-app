import react from '@vitejs/plugin-react';
import { createHash } from 'crypto';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { basename, dirname, join, relative, resolve, sep } from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: ({ command }) => ({
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    css: {
      modules: {
        // use this instead to generate just hashed names in production (without paths/local names)
        // generateScopedName: command === 'build' ? getHashedScopedName() : getNiceScopedName(),
        generateScopedName: getNiceScopedName(),
      },
    },
    plugins: [react()],
  }),
});

/**
 * Provide "obfuscated" class names (just the hash)
 */
// @ts-ignore unless explicitly set to be used, this will fail as "declared byt never read" in TSC
function getHashedScopedName(prefix = '', hashLength = 8) {
  return (className: string, resourcePath: string): string => {
    const hash = getHash(resourcePath, className, hashLength);
    return `${prefix}${hash}`;
  };
}

/**
 * Provide nice class names used by CSS modules
 *
 * The default classnames are like `${CLASSNAME_HASH}, which might be confusing in development
 * This provides `${FILEPATH_CLASSNAME_HASH}` for easier debugging in development
 *
 * The difference with using '[name]__[local]__[hash:base64:5]' is that `[name]` translates to
 * something like `app-module` in a file like `app.module.scss` which doesn't provide much
 * information and the `module` part is redundant as it's going to exist everywhere *
 */
function getNiceScopedName(prefix = '', hashLength = 5) {
  // ideally, every `.module.scss` file will be part of a react component
  const components = join(__dirname, 'src', 'renderer', 'components');

  return (className: string, resourcePath: string): string => {
    const hash = getHash(resourcePath, className, hashLength);

    const rel = basename(relative(components, resourcePath)).replaceAll(sep, '-');
    const folder = basename(dirname(resourcePath));
    const resourceFilename = basename(resourcePath).replace(/\.module\.((c|sa|sc)ss)$/i, '');
    const filename =
      rel === basename(resourcePath)
        ? // if the file was not in components (couldn't resolve relative)
          resourceFilename
        : resourceFilename === folder || /^(index|styles?)$/.test(resourceFilename)
          ? // if the filename is the same as the folder (i.e. app/app.module.scss)
            resourceFilename
          : // if the filename is not the same as the folder (i.e. app/foo.module.scss)
            `${rel}-${resourceFilename}`;

    return `${prefix}${filename}__${className}__${hash}`;
  };
}

function getHash(resourcePath: string, className: string, length: number): string {
  const hashContent = `filepath:${resourcePath}|classname:${className}`;
  const hash = createHash('md5')
    .update(hashContent)
    .digest('base64')
    // base64 can include "+" and "/" which are not acceptable for css class names
    .replace(/[+]/g, 'x')
    .replace(/[/]/g, 'X');

  return hash.substring(0, length);
}
