/**
 * To avoid typos and provide strong typing, each window can be provided with
 * its own ID (usually Electron applications won't have more than one).
 *
 * WindowId is used on the utility methods `registerIpcTarget` and
 * `sendEventToWindow` but canbe used in other parts as needed
 */
export type WindowId = 'main';

/**
 * Position and size for the Electron Windows
 */
export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
