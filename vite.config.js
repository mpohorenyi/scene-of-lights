import { defineConfig } from 'vite';
import ViteRestart from 'vite-plugin-restart';

export default defineConfig({
  root: 'src/', // Sources files (typically where index.html is)
  publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    ViteRestart({
      restart: [
        'vite.config.js',
        'src/index.html',
        'src/style.css',
        'src/**/*.ts',
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
