import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/services/**/*.js', 'src/utils/**/*.js'],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 70,
        lines: 70,
        functions: 80
      }
    }
  }
});
