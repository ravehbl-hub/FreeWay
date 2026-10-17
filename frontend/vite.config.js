// Vite configuration: React plugin, dev server port, and build info for the "What's new" popup.
// On Vercel the commit id / message come from VERCEL_GIT_* variables; locally we use the time.
// The same info is written to public/build.json so the running app can notice a newer deploy.
import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildId = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());
const buildMessage = (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split('\n')[0]; // first line only
const buildDate = new Date().toISOString();

fs.writeFileSync('public/build.json', JSON.stringify({ id: buildId, message: buildMessage, date: buildDate }));

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __BUILD_MESSAGE__: JSON.stringify(buildMessage),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
});
