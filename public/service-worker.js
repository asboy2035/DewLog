// const CACHE_NAME = 'hydroflow-cache-v1';
// const urlsToCache = [
//     '/',
//     '/index.html',
//     '/Hydration-logo.jpg',
//     '/manifest.json'
// ];
//
// // Install event: cache assets
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then((cache) => {
//                 console.log('Opened cache');
//                 return cache.addAll(urlsToCache);
//             })
//     );
// });
//
// // Fetch event: serve from cache first, then network
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request)
//             .then((response) => {
//                 // Cache hit - return response
//                 if (response) {
//                     return response;
//                 }
//                 // No cache hit - fetch from network
//                 return fetch(event.request).then(
//                     (response) => {
//                         // Check if we received a valid response
//                         if (!response || response.status !== 200 || response.type !== 'basic') {
//                             return response;
//                         }
//
//                         // IMPORTANT: Clone the response. A response is a stream
//                         // and can only be consumed once. We must clone it so that
//                         // we can consume one in the cache and one in the browser.
//                         const responseToCache = response.clone();
//
//                         caches.open(CACHE_NAME)
//                             .then((cache) => {
//                                 cache.put(event.request, responseToCache);
//                             });
//
//                         return response;
//                     }
//                 );
//             })
//     );
// });
//
// // Activate event: clean up old caches
// self.addEventListener('activate', (event) => {
//     const cacheWhitelist = [CACHE_NAME];
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (cacheWhitelist.indexOf(cacheName) === -1) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });
//
// // Push notification listener (for future server-side pushes if implemented)
// self.addEventListener('push', (event) => {
//     const data = event.data.json();
//     console.log('Push received:', data);
//
//     const title = data.title || 'HydroFlow Reminder';
//     const options = {
//         body: data.body || 'Time to drink some water!',
//         icon: '/Hydration-logo.jpg',
//         badge: '/Hydration-logo.jpg',
//         vibrate: [200, 100, 200, 100, 200],
//         data: {
//             url: data.url || '/' // URL to open when notification is clicked
//         }
//     };
//
//     event.waitUntil(self.registration.showNotification(title, options));
// });
//
// // Notification click listener
// self.addEventListener('notificationclick', (event) => {
//     event.notification.close();
//     event.waitUntil(
//         clients.openWindow(event.notification.data.url)
//     );
// });
