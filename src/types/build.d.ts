/*
 * List of defines created in the build
 */

/**
 * Identifies the type of build the code is running on
 */
declare const BUILD_TYPE: 'main' | 'preload' | 'renderer';

/**
 * `true` when executed via `electron-vite preview`
 *
 * Needed because NODE_ENV will be 'production', but it's just a preview
 */
declare const IS_PREVIEW: boolean;
