# Typed IPCs

The provided `ipcMain` and `ipcRenderer` objects are now fully typed based on the definitions from [events](../src/shared/ipc/events.ts) and [commands](../src/shared/ipc/commands.ts).

- There's no runtime cost (everything is checked via TypeScript on build time)
- There's no change on the Electron APIs
- Events and Commands are separated as:
  - events being asynchronous happenings that can be triggered or listened to (IPC)
  - commands being asynchronous functions that can be invoked (RPC)

To avoid importing by default the base objects provided by electron, eslint rules are provided forbidding those imports (just import from [@/shared/ipc](../src/shared/ipc/index.ts)).
