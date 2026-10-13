import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: path.resolve(__dirname, "../.."),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Local-dev parity with nginx (which proxies /api + /uploads to the
    // backend in production): without this, every relative API call the SPA
    // makes (VITE_API_URL=/api) hits the Vite server itself and 404s — e.g.
    // POST /api/privacy/consent from the cookie banner. Target follows the
    // backend PORT (default 3000); override with VITE_DEV_PROXY_TARGET when
    // the API runs elsewhere.
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_PROXY_TARGET ?? `http://localhost:${process.env.PORT ?? 3000}`,
        changeOrigin: true,
      },
      "/uploads": {
        target: process.env.VITE_DEV_PROXY_TARGET ?? `http://localhost:${process.env.PORT ?? 3000}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // Split stable vendor code from app code so repeat visits reuse cache:
    // react core changes rarely, landing/profile/dashboard chunks change often.
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-auth": ["@simplewebauthn/browser"],
          "vendor-qr": ["qrcode.react"],
        },
      },
    },
  },
});
