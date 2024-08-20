# Environment Variables

List of available environment variables used during the build and execution process

※ Note: `boolean values from environment variables are defined with the strings `"true"`and`"false"`(lowercase, no`0`/`1`).

| Variable                | Type      | Description                                                                                                                                                                                 |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DEBUG`                 | `boolean` | Forces debug tools to be enabled when set to `true`. By default it's only enabled on development mode. If explicitly set to `false`, debug tools will be disabled even on development mode. |
| `UPGRADE_EXTENSIONS`    | `boolean` | Force re-downloading chrome extensions to install                                                                                                                                           |
| `ELECTRON_RENDERER_URL` | `string`  | URL for the HTML file to load in the renderer at start. Used internally for HMR                                                                                                             |
