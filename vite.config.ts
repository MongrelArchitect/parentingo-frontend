import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@configs": "/src/configs",
      "@hooks": "/src/hooks",
      "@interfaces": "/src/interfaces",
      "@pages": "/src/pages",
      "@routes": "/src/routes",
      "@util": "/src/util",
    },
  },
  server: {
    https: true,
  },
});
