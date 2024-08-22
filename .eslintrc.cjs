/**
 * @type {import('eslint').Linter.LegacyConfig}
 */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier',
  ],
  parserOptions: {
    project: ['./tsconfig.node.json', './tsconfig.web.json'],
  },
  plugins: ['@typescript-eslint', 'unicorn'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    /*
     * Forbids importing the un-typed IPC.
     * Use the ones in src/ipc instead.
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'electron',
            importNames: ['ipcMain', 'ipcRenderer'],
            message: 'Use the imports from @/shared/ipc instead',
          },
        ],
        patterns: [
          {
            group: ['*i18next*'],
            message: 'Please use the provided @/shared/i18n instead',
          },
        ],
      },
    ],

    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],

    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/naming-convention.md
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      // destructured variables come from other places so no format is enforced
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: null,
      },
      // imports also come from other places so no format is enforced
      {
        selector: 'import',
        format: null,
      },
      // Constants can also be camelCase apart from UPPER_CASE
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE', 'camelCase'],
      },
      // functions defined as constants should have the same format as functions
      {
        selector: 'variable',
        types: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
      // functions can be:
      // - regular functions (camelCase)
      // - functional components (PascalCase)
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // type definitions (class, interface, typeAlias, enum, typeParameter)
      // should be PascalCase
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      // each member of an enum (const-like) should be UPPER_CASE
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        // Ignore properties that require quotes
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
    ],
  },
};
