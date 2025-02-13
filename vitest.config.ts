import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts', 'src/**/*.integration.ts'],
    exclude: ['node_modules/**', 'e2e/**', 'app.test.ts'],
  },
});
