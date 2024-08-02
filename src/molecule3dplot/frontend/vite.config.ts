import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rawCSVPlugin from "vite-raw-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), rawCSVPlugin({ fileRegex: /\.csv$/ })],
});
