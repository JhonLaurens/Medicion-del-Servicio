import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  // Usar base path diferente para producción en Vercel
  const base = mode === "production" ? "/" : "/Medicion-del-Servicio/";

  return {
    base,
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY
      ),
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY
      ),
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            charts: ["recharts"],
            utils: ["papaparse"],
          },
        },
      },
    },
  };
});
