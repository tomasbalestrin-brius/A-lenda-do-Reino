import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png', 'offline.html'],
      manifest: {
        name: 'A Lenda do Reino',
        short_name: 'Lenda do Reino',
        description: 'RPG Tormenta20 — Crie seu herói e jogue os 3 atos',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Novo Personagem',
            url: '/',
            icons: [{ src: 'logo192.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        // PNGs removidos do precache — servidos via runtimeCaching (CacheFirst)
        // Antes: 12MB de imagens de raça eram baixadas no install do SW
        globPatterns: ['**/*.{js,css,html,ico,svg,json,woff,woff2}'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/assets\//],
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // Imagens (PNG/JPG/WebP) — CacheFirst, não bloqueiam o install do SW
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|gif|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Supabase API — NetworkFirst (dados precisam ser frescos)
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 // 1 dia como fallback offline
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: '.',
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
