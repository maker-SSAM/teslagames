import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = import.meta.dirname;

// Fully self-contained hub page (JS/CSS inlined) so it opens directly by
// double-clicking. Must run AFTER the game builds (emptyOutDir: false so
// it doesn't wipe the games/ subfolder they wrote into dist-local).
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist-local",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(root, "index.html"),
    },
  },
});
