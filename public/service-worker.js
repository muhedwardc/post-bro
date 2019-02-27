if (workbox) {
    const offlinePage = '/offline/';
    workbox.setConfig({
        debug: false,
    });

    self.__precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.precacheAndRoute(self.__precacheManifest);

    workbox.routing.registerNavigationRoute('index.html')
    
    workbox.precaching.suppressWarnings();
    workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'images',
        plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        ],
    }),
    );
    
    workbox.routing.registerRoute(
    new RegExp(''),
    workbox.strategies.networkFirst({
        cacheName: 'api',
    }),
    );
    
    workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'googleapis',
        plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 30,
        }),
        ],
    }),
    );

    workbox.routing.registerRoute(
    new RegExp('https://cdn.onesignal.com/sdks/OneSignalSDK.js'),
    workbox.strategies.networkFirst({
        cacheName: 'onesignal',
    }),
    );
}