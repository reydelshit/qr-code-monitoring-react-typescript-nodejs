import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert', 'cert.pem')),
    },
  },
});
