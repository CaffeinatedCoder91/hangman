import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'frontend',
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
