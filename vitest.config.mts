import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: __dirname,
      projects: ['tsconfig.node.json', 'tsconfig.web.json'],
    }),
  ],
  test: {},
});
