import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/interactive-ml/" for the production build (served from GitHub Pages at
// roboticcam.github.io/interactive-ml/), but "/" for local dev.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/interactive-ml/" : "/",
  plugins: [react()],
}));
