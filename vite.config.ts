import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Fire-and-forget: ping the Gumroad sync edge function at the end of every build
// so the Gumroad product page stays in sync with the site. Safe to call repeatedly
// (the function is idempotent and throttled).
const gumroadSyncPlugin = () => {
  const FN_URL = "https://gmzptuwtnfevrfebmzti.supabase.co/functions/v1/gumroad-sync";
  return {
    name: "gumroad-sync-on-build",
    apply: "build" as const,
    async closeBundle() {
      const token = process.env.GUMROAD_SYNC_TOKEN;
      if (!token) {
        console.warn("[gumroad-sync] skipped: GUMROAD_SYNC_TOKEN not set in build env");
        return;
      }
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: { "x-sync-token": token },
        });
        const body = await res.text();
        if (res.ok) {
          console.log("[gumroad-sync] OK", body.slice(0, 200));
        } else {
          console.warn("[gumroad-sync] failed", res.status, body.slice(0, 200));
        }
      } catch (err) {
        console.warn("[gumroad-sync] skipped:", (err as Error).message);
      }
    },

  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode !== "development" && gumroadSyncPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
