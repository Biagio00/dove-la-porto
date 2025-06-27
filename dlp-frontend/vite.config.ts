import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true, //abilitare pwa in dev
            },
            manifest: {
                "theme_color": "#006fdd",
                "background_color": "#f5f5f5",
                "icons": [
                    {
                        "purpose": "maskable",
                        "sizes": "512x512",
                        "src": "icon512_maskable.png",
                        "type": "image/png"
                    },
                    {
                        "purpose": "any",
                        "sizes": "512x512",
                        "src": "icon512_rounded.png",
                        "type": "image/png"
                    },
                    {
                        "purpose": "maskable",
                        "sizes": "192x192",
                        "src": "icon192_maskable.png",
                        "type": "image/png"
                    },
                    {
                        "sizes": "64x64",
                        "src": "icon64.png",
                        "type": "image/png"
                    }
                ],
                "orientation": "any",
                "display": "standalone",
                "lang": "it-IT",
                "short_name": "DLP",
                "name": "Dove la porto?",
                "description": "Vedi le postazioni dei cassonetti nella tua zona"
            },
            workbox: {
                navigateFallback: '/index.html',
                runtimeCaching: [
                    //CacheFirst per font e immagini con 5 giorni di validità
                    {
                        urlPattern: /\.(png|svg|ico|ttf)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-font-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 5 * 24 * 60 * 60 }
                        }
                    },
                    //NetworkFirst per le pagine HTML per 5 giorni
                    {
                        urlPattern: ({ request }) => request.destination === 'document',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'document-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 5 * 24 * 60 * 60 }
                        }
                    },
                    //StaleWhileRevalidate per css e js per 5 giorni
                    {
                        urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'css-js-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 5 * 24 * 60 * 60 }
                        }
                    },
                    //NetworkFirst per firestore: se non c'è la rete fa comunque vedere gli ultimi punti fetchati per 1 giorno
                    {
                        urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'firestore-cache',
                            expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 }
                        }
                    },
                    //NetworkOnly per le risorse di maps: non è adatta alla cache perché cambiano continuamente
                    {
                        urlPattern: /^https:\/\/mapsresources-pa\.googleapis\.com\/.*/i,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'maps-res-cache'
                        }
                    },
                    //NetworkOnly per le risorse di maps: non è adatta alla cache per via delle risorse
                    {
                        urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'maps-cache'
                        }
                    }
                ]

            },
            includeAssets: [
                "apple-touch-icon_180.png",
                "dlp.svg",
                "dlp_ns.svg",
                "dlp_ns_192x192.png",
                "dlp_ns_512x512.png",
                "favicon_48.ico",
                "icon64.png",
                "icon192_maskable.png",
                "icon512_maskable.png",
                "icon512_rounded.png",
                "types/solo-vetro.svg",
                "types/completa.svg",
                "types/discarica.svg"
            ]

        })
    ],
})
