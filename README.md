# electron-tsx-app

An Electron application with React and TypeScript

## Features

- ☑ App bundled packages
  - ☑ Windows
  - ☑ Mac
  - ☑ Linux
- ☑ App installers
  - ☑ Windows
  - ☑ Mac
  - ☑ Linux
- ☐ Signed binaries
- ☐ Secure code
- ☑ ASAR packing
- ☑ Application icons
- ☑ Git Hooks
- ☑ Unit Testing
- ☑ Code Linting
  - ☑ Prettier
- ☑ ESM support
- ☑ VS Code integration
- ☑ Main process restarted when modified
- ☑ TypeScript
  - ☑ Working paths & aliases
  - ☐ Typed IPC
- ☑ Webpack with pre-defined loaders
- ☑ React
  - ☑ React Dev Tools※
  - ☑ Hot Module Reloading
- ☐ i18n ready

※ React Dev Tools is configured but not really showing because of internal [issues](https://github.com/MarshallOfSound/electron-devtools-installer/issues/195).

### Other features

- ☑ [electron-debug](https://github.com/sindresorhus/electron-debug)
- ☑ User stored preferences
  - ☑ Restore window positions
- ☐ Redux/Zustand (TBD)
  - ☐ Redux dev tools

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Testing

```bash
$ npm run test
```

or for debugging the tests:

```bash
$ npm run dev:test
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
