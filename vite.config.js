import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        balloonStars: resolve(root, "games/balloon-stars/index.html"),
      },
    },
  },
});
