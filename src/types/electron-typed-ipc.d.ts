/**
 * Interface definitions based on
 * https://github.com/deiucanta/electron-typed-ipc/
 *
 * This provides better nested typing (i.e. `sender` inside events, etc.)
 * and also avoid problems installing due to
 * https://github.com/deiucanta/electron-typed-ipc/issues/19
 */
import { EventEmitter } from 'stream';
import type {
  BrowserWindow,
  IpcMainEvent,
  IpcMainInvokeEvent,
  IpcRendererEvent,
  WebContents,
} from 'electron';

import { OptionalPromise } from './global';

/*
 * Main exports
 */
export type TypedIpcMain<
  IpcEvents extends InputMap,
  IpcCommands extends InputMap,
> = TypedIpcMainMethods<IpcEvents, IpcCommands> & EventEmitter<InputMapToEventMap<IpcEvents>>;

export type TypedIpcRenderer<
  IpcEvents extends InputMap,
  IpcCommands extends InputMap,
> = TypedIpcRendererMethods<IpcEvents, IpcCommands> & EventEmitter<InputMapToEventMap<IpcEvents>>;

/*
 * Events
 */
export type TypedIpcMainEvent<IpcEvents extends InputMap> = Omit<
  IpcMainEvent,
  'sender' | 'reply'
> & {
  sender: TypedWebContents<IpcEvents>;
  reply: <K extends keyof IpcEvents>(channel: K, ...args: Parameters<IpcEvents[K]>) => void;
};

export type TypedIpcMainInvokeEvent<IpcEvents extends InputMap> = Omit<
  IpcMainInvokeEvent,
  'sender'
> & {
  sender: TypedWebContents<IpcEvents>;
};

export type TypedIpcRendererEvent<IpcEvents extends InputMap, IpcCommands extends InputMap> = Omit<
  IpcRendererEvent,
  'sender'
> & {
  sender: TypedIpcRenderer<IpcEvents, IpcCommands>;
};

/*
 * Listeners
 */
export type TypedIpcMainEventListener<IpcEvents extends InputMap, K extends keyof IpcEvents> = (
  event: IpcMainEvent,
  ...args: Parameters<IpcEvents[K]>
) => void;

export type TypedIpcMainInvokeEventListener<
  IpcCommands extends InputMap,
  K extends keyof IpcCommands,
> = (
  event: IpcMainInvokeEvent,
  ...args: Parameters<IpcCommands[K]>
) => OptionalPromise<ReturnType<IpcCommands[K]>>;

export type TypedIpcRendererEventListener<
  IpcEvents extends InputMap,
  IpcCommands extends InputMap,
  K extends keyof IpcEvents & string,
> = (
  event: TypedIpcRendererEvent<IpcEvents, IpcCommands>,
  ...args: Parameters<IpcEvents[K]>
) => void;

/*
 * BrowserWindow / WebContents
 */
export interface TypedBrowserWindow<IpcEvents extends InputMap> extends BrowserWindow {
  /**
   * A `WebContents` object this window owns. All web page related events and
   * operations will be done via it.
   *
   * See the `webContents` documentation for its methods and events.
   */
  readonly webContents: TypedWebContents<IpcEvents>;
}

export interface TypedWebContents<IpcEvents extends InputMap> extends WebContents {
  /**
   * Send an asynchronous message to the renderer process via `channel`, along with
   * arguments. Arguments will be serialized with the Structured Clone Algorithm,
   * just like `postMessage`, so prototype chains will not be included. Sending
   * Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.
   *
   * :::warning
   *
   * Sending non-standard JavaScript types such as DOM objects or special Electron
   * objects will throw an exception.
   *
   * :::
   *
   * For additional reading, refer to Electron's IPC guide.
   */
  send<K extends keyof IpcEvents>(channel: K, ...args: Parameters<IpcEvents[K]>): void;
}

/*
 * Private
 */
// https://www.electronjs.org/docs/latest/api/ipc-main
// order of the methods is the same as in electron.d.ts
interface TypedIpcMainMethods<IpcEvents extends InputMap, IpcCommands extends InputMap> {
  /**
   * Adds a handler for an `invoke`able IPC. This handler will be called whenever a
   * renderer calls `ipcRenderer.invoke(channel, ...args)`.
   *
   * If `listener` returns a Promise, the eventual result of the promise will be
   * returned as a reply to the remote caller. Otherwise, the return value of the
   * listener will be used as the value of the reply.
   *
   * The `event` that is passed as the first argument to the handler is the same as
   * that passed to a regular event listener. It includes information about which
   * WebContents is the source of the invoke request.
   *
   * Errors thrown through `handle` in the main process are not transparent as they
   * are serialized and only the `message` property from the original error is
   * provided to the renderer process. Please refer to #24427 for details.
   */
  handle<K extends keyof IpcCommands>(
    channel: K,
    listener: (
      event: TypedIpcMainInvokeEvent<IpcEvents>,
      ...args: Parameters<IpcCommands[K]>
    ) => OptionalPromise<ReturnType<IpcCommands[K]>>
  ): void;
  /**
   * Handles a single `invoke`able IPC message, then removes the listener. See
   * `ipcMain.handle(channel, listener)`.
   */
  handleOnce<K extends keyof IpcCommands>(
    channel: K,
    listener: (
      event: TypedIpcMainInvokeEvent<IpcEvents>,
      ...args: Parameters<IpcCommands[K]>
    ) => OptionalPromise<ReturnType<IpcCommands[K]>>
  ): void;
  /**
   * Listens to `channel`, when a new message arrives `listener` would be called with
   * `listener(event, args...)`.
   */
  on<K extends keyof IpcEvents>(
    channel: K,
    listener: TypedIpcMainEventListener<IpcEvents, K>
  ): this;
  /**
   * Adds a one time `listener` function for the event. This `listener` is invoked
   * only the next time a message is sent to `channel`, after which it is removed.
   */
  once<K extends keyof IpcEvents>(
    channel: K,
    listener: TypedIpcMainEventListener<IpcEvents, K>
  ): this;
  /**
   * Removes listeners of the specified `channel`.
   */
  removeAllListeners<K extends keyof IpcEvents>(channel?: K): this;
  /**
   * Removes any handler for `channel`, if present.
   */
  removeHandler<K extends keyof IpcCommands>(channel: K): void;
  /**
   * Removes the specified `listener` from the listener array for the specified
   * `channel`.
   */
  removeListener<K extends keyof IpcEvents>(
    channel: K,
    listener: TypedIpcMainEventListener<IpcEvents, K>
  ): this;
}

// https://www.electronjs.org/docs/latest/api/ipc-renderer
// order of the methods is the same as in electron.d.ts
interface TypedIpcRendererMethods<IpcEvents extends InputMap, IpcCommands extends InputMap> {
  /**
   * Alias for `ipcRenderer.on`.
   */
  addListener<K extends keyof IpcEvents & string>(
    channel: K,
    listener: TypedIpcRendererEventListener<IpcEvents, IpcCommands, K>
  ): this;
  /**
   * Resolves with the response from the main process.
   *
   * Send a message to the main process via `channel` and expect a result
   * asynchronously. Arguments will be serialized with the Structured Clone
   * Algorithm, just like `window.postMessage`, so prototype chains will not be
   * included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw
   * an exception.
   *
   * The main process should listen for `channel` with `ipcMain.handle()`.
   *
   * For example:
   *
   * If you need to transfer a `MessagePort` to the main process, use
   * `ipcRenderer.postMessage`.
   *
   * If you do not need a response to the message, consider using `ipcRenderer.send`.
   *
   * > **Note** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * > **Note** If the handler in the main process throws an error, the promise
   * returned by `invoke` will reject. However, the `Error` object in the renderer
   * process will not be the same as the one thrown in the main process.
   */
  invoke<K extends keyof IpcCommands>(
    channel: K,
    ...args: Parameters<IpcCommands[K]>
  ): Promise<ReturnType<IpcCommands[K]>>;
  /**
   * Alias for `ipcRenderer.removeListener`.
   */
  off<K extends keyof IpcEvents & string>(
    channel: K,
    listener: TypedIpcRendererEventListener<IpcEvents, IpcCommands, K>
  ): this;
  /**
   * Listens to `channel`, when a new message arrives `listener` would be called with
   * `listener(event, args...)`.
   */
  on<K extends keyof IpcEvents & string>(
    channel: K,
    listener: TypedIpcRendererEventListener<IpcEvents, IpcCommands, K>
  ): this;
  /**
   * Adds a one time `listener` function for the event. This `listener` is invoked
   * only the next time a message is sent to `channel`, after which it is removed.
   */
  once<K extends keyof IpcEvents & string>(
    channel: K,
    listener: TypedIpcRendererEventListener<IpcEvents, IpcCommands, K>
  ): this;
  /**
   * Send a message to the main process, optionally transferring ownership of zero or
   * more `MessagePort` objects.
   *
   * The transferred `MessagePort` objects will be available in the main process as
   * `MessagePortMain` objects by accessing the `ports` property of the emitted
   * event.
   *
   * For example:
   *
   * For more information on using `MessagePort` and `MessageChannel`, see the MDN
   * documentation.
   */
  // TODO: postMessage (define new type apart from Events and Commands?)
  postMessage(channel: string, message: unknown, transfer?: MessagePort[]): void;
  /**
   * Removes all listeners, or those of the specified `channel`.
   */
  removeAllListeners<K extends keyof IpcEvents & string>(channel: K): this;
  /**
   * Removes the specified `listener` from the listener array for the specified
   * `channel`.
   */
  removeListener<K extends keyof IpcEvents & string>(
    channel: K,
    listener: TypedIpcRendererEventListener<IpcEvents, IpcCommands, K>
  ): this;
  /**
   * Send an asynchronous message to the main process via `channel`, along with
   * arguments. Arguments will be serialized with the Structured Clone Algorithm,
   * just like `window.postMessage`, so prototype chains will not be included.
   * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
   * exception.
   *
   * > **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * The main process handles it by listening for `channel` with the `ipcMain`
   * module.
   *
   * If you need to transfer a `MessagePort` to the main process, use
   * `ipcRenderer.postMessage`.
   *
   * If you want to receive a single response from the main process, like the result
   * of a method call, consider using `ipcRenderer.invoke`.
   */
  send<K extends keyof IpcEvents>(channel: K, ...args: Parameters<IpcEvents[K]>): void;
  /**
   * The value sent back by the `ipcMain` handler.
   *
   * Send a message to the main process via `channel` and expect a result
   * synchronously. Arguments will be serialized with the Structured Clone Algorithm,
   * just like `window.postMessage`, so prototype chains will not be included.
   * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
   * exception.
   *
   * > **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * The main process handles it by listening for `channel` with `ipcMain` module,
   * and replies by setting `event.returnValue`.
   *
   * > :warning: **WARNING**: Sending a synchronous message will block the whole
   * renderer process until the reply is received, so use this method only as a last
   * resort. It's much better to use the asynchronous version, `invoke()`.
   */
  sendSync<K extends keyof IpcEvents>(
    channel: K,
    ...args: Parameters<IpcEvents[K]>
  ): ReturnType<IpcEvents[K]>;
  /**
   * Like `ipcRenderer.send` but the event will be sent to the `<webview>` element in
   * the host page instead of the main process.
   */
  sendToHost<K extends keyof IpcEvents>(channel: K, ...args: Parameters<IpcEvents[K]>): void;
}

type InputMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (...args: any) => unknown;
};
type InputMapToEventMap<IM extends InputMap> = {
  [k in keyof IM]: IM[k] extends (...args: infer A) => unknown
    ? A extends unknown[]
      ? [TypedIpcMainEvent<IM>, ...A]
      : never
    : never;
};
