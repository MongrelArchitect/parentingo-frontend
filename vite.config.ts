import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@interfaces": "/src/interfaces",
      "@pages": "/src/pages",
      "@routes": "/src/routes",
    },
  },
});
