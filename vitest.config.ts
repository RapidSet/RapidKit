import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
    },
  },
  test: {
    environment: "happy-dom",
  },
});
