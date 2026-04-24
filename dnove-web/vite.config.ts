import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isGitHubPages = mode === 'github-pages';

  return {
    // GitHub Pages usually serves from /<repo>/, while local/dev keeps '/'.
    // Using './' ensures built assets can be opened directly from the Pages URL.
    base: isGitHubPages ? './' : '/',
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'DNove Web',
          short_name: 'DNove',
          description: 'Offline-first novel writing assistant',
          theme_color: '#111111',
          background_color: '#111111',
          display: 'standalone',
          start_url: './',
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'https-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }
              }
            }
          ]
        }
      })
    ]
  };
});
