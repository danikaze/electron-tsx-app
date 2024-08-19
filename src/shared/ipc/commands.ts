/*
 * Declare application command types in this file
 * (Commands are async functions you can invoke = RPC)
 *
 * They get called from the windows via `ipcRenderer.invoke`
 * and processed in the main process with `ipcMain.handle`
 */
export type IpcCommands = {
  ping: () => void;
};
