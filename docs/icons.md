# Application Icons

# App icons

When building the application, the packager will look automatically for the following files, depending on the OS:

| OS    | Path               | Recommended Size |
| ----- | ------------------ | ---------------- |
| Win   | `/build/icon.ico`  | 256x256          |
| Mac   | `/build/icon.icns` | 1024x1024        |
| Linux | `/buikd/icon.png`  | 512x512          |

## Configuring the icon in Linux

The icon must be additionally loaded when instantiating your `BrowserWindow`.

The path is provided by the `APP_ICON_PNG_PATH` value [defined in webpack](./webpack-defines.md).

```ts
/* src/main/index.ts */
const { BrowserWindow } = require('electron');

import icon from '../../resources/icon.png?asset';

const win = new BrowserWindow({
  icon,
});
```

## Refreshing the icon cache (Windows)

Windows caches all application icons in a hidden Icon Cache Database. If your Electron app's icon is not showing up, you may need to rebuild this cache. To invalidate the cache, use the system `ie4uinit.exe` utility:

```
ie4uinit.exe -show
```
