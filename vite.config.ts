import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "process", "crypto", "stream", "util", "events"],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'blockchain-vendor': ['wagmi', 'thirdweb', 'viem'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'ethers', '@tanstack/react-query'],
        },
      },
    },
    // Increase warning limit to reduce noise (optional, but helps with large apps)
    chunkSizeWarningLimit: 1000, // in kB
  },
}));
