import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';

import type { WindowBounds, WindowId } from '@/types/app';

import { store } from './storage';
import { is } from '@electron-toolkit/utils';

/**
 * Create a window via `new BrowserWindow` and handle its size and position
 * storing it via `electron-store` and using it the next time is created, if
 * exists.
 *
 * Use it as a replacement to `new BrowserWindow(options)`
 */
export function createPositionedWindow(
  windowName: WindowId,
  options: BrowserWindowConstructorOptions
): BrowserWindow {
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {} as WindowBounds;

  const ensureVisibleOnSomeDisplay = (windowState: WindowBounds): WindowBounds => {
    const visible = screen.getAllDisplays().some((display) => {
      return isWindowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults(defaultSize);
    }
    return windowState;
  };

  const saveState = (): void => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition(win));
    }
    store.set(`windowState.${windowName}`, state);
  };

  const storedState = store.get(`windowState.${windowName}`);
  state = storedState ? ensureVisibleOnSomeDisplay(storedState) : resetToDefaults(defaultSize);

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      ...options.webPreferences,
    },
  };

  const win = new BrowserWindow(browserOptions);

  /*
   * Ideally the window position only needs to be updated when the window gets
   * closed, but on development it's updated everytime as the process gets
   * restarted without new position being handled
   */
  const saveEvent = is.dev ? 'move' : 'close';
  win.on(saveEvent as 'close', saveState);

  return win;
}

function getCurrentPosition(win: BrowserWindow): WindowBounds {
  const [x, y] = win.getPosition();
  const [width, height] = win.getSize();

  return { x, y, width, height };
}

function resetToDefaults(
  defaultSize: Partial<Pick<WindowBounds, 'width' | 'height'>>
): WindowBounds {
  const { bounds } = screen.getPrimaryDisplay();
  return {
    ...defaultSize,
    x: (bounds.width - (defaultSize.width || 0)) / 2,
    y: (bounds.height - (defaultSize.height || 0)) / 2,
  } as WindowBounds;
}

function isWindowWithinBounds(windowState: WindowBounds, bounds: WindowBounds): boolean {
  return (
    windowState.x >= bounds.x &&
    windowState.y >= bounds.y &&
    windowState.x + windowState.width <= bounds.x + bounds.width &&
    windowState.y + windowState.height <= bounds.y + bounds.height
  );
}
