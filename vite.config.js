import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'MonAgri — le marché des fermes',
        short_name: 'MonAgri',
        description:
          'Réservez fruits, légumes, œufs et parcelles directement auprès des agriculteurs près de chez vous.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f7f2e7',
        theme_color: '#f7f2e7',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // On ne met en cache que la coquille de l'appli (JS/CSS/HTML/polices).
        // Les données (produits, réservations…) passent toujours par le réseau.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
      },
      // Le service worker ne tourne qu'en production (`npm run build`), pas en
      // `npm run dev` — on évite les surprises de cache pendant le développement.
    }),
  ],
})
