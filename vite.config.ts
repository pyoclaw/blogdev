import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function normalizeBase(base: string | undefined) {
  if (!base) return "/";
  if (base === "/") return "/";
  return `/${base.replace(/^\/+|\/+$/g, "")}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: normalizeBase(env.VITE_BASE_PATH || env.BASE_PATH),
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      // Allow the e2b preview proxy host + any host in this sandbox.
      allowedHosts: true,
    },
  };
});
