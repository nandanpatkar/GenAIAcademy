import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import chatProxy from './server/chat-proxy.mjs';

export default defineConfig(({ mode }) => {
  /* The empty prefix loads every var in .env, including the ones without a
     `VITE_` prefix. Those stay in the Node process — Vite only inlines `VITE_*`
     into the client bundle — which is how the chat API key reaches the proxy
     without reaching the browser. */
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), chatProxy(env)],
    server: {
      open: true,
    },
  };
});
