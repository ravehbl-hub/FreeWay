// Vite configuration: React plugin, dev server port, and build info for the "What's new" popup.
// On Vercel the commit id / message come from VERCEL_GIT_* variables; locally we use the time.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildId = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());
const buildMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
const buildDate = new Date().toISOString();

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __BUILD_MESSAGE__: JSON.stringify(buildMessage),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
});
