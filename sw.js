// Service Worker for Image Gallery
const VERSION = '1.0.0';
const MEDIA_CACHE_NAME = `image-gallery-media-v${VERSION}`;
const STATIC_CACHE_NAME = `image-gallery-static-v${VERSION}`;

const BASE_PATH = "##path##";

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                return cache.addAll([
                    `/${BASE_PATH}/gallery.html`,
                    `/${BASE_PATH}/tailwind.css`,
                    `/${BASE_PATH}/collections.json`,
                ]).catch((err) => {
                    console.log('Caching initial assets failed');
                });
            }),
        ])
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.filter((key) => {
                        return key.startsWith('image-gallery-') &&
                               key !== MEDIA_CACHE_NAME &&
                               key !== STATIC_CACHE_NAME;
                    }).map((key) => {
                        console.log('Deleting old cache:', key);
                        return caches.delete(key);
                    })
                );
            }),
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle images
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        event.respondWith(
            caches.open(MEDIA_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        return new Response('Image not available offline', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
                });
            })
        );
        return;
    }

    // Handle HTML and JSON files - Stale While Revalidate
    if (url.pathname.endsWith('gallery.html') || url.pathname.endsWith('.json')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(STATIC_CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch((error) => {
                    console.log('Network fetch failed, falling back to cache');
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return new Response(null, {
                        status: 404,
                        statusText: 'Not Found'
                    });
                });

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }
});
