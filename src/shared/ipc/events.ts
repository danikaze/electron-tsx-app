/*
 * Declare application event types in this file
 * (Events are things that happened = IPC)
 *
 * Events can happened from both windows and main processes
 * (via `.send()`) and they also can be handled from both
 * sides (with `.on()`)
 */
export type IpcEvents = {
  pong: () => void;
};
