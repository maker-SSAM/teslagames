import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = import.meta.dirname;

// Fully self-contained game page (JS/CSS inlined) so it opens directly by
// double-clicking, without needing a dev server.
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist-local",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(root, "games/balloon-stars/index.html"),
    },
  },
});
