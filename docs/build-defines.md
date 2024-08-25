# Build generated values

This is a list of defined values using `define`.

It means they will be replaced directly on build tyme and there will be no constant or variable holding it (important if a big value is added and reused multiple times, i.e., an object)

When adding new values, it's important to add also their type definition to [types/build.d.ts](../src/types/build.d.ts) so they are available in TypeScript.

| Name         | Type                              | Description                                                 |
| ------------ | --------------------------------- | ----------------------------------------------------------- |
| `BUILD_TYPE` | `main` \| `preload` \| `renderer` | Allows to identify what build is the code being executed on |
| `IS_PREVIEW` | `boolean`                         | If running with `NODE_ENV: production` but in preview mode  |
