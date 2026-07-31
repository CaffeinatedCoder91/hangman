import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "backend",
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"]
  }
});
