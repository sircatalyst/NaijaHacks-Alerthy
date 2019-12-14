// custom service-worker.js
if (workbox) {
  workbox.precaching.precacheAndRoute([]);
  // Setup cache strategy for Google Fonts. They consist of two parts, a static one
  // coming from fonts.gstatic.com (strategy CacheFirst) and a more ferquently updated on
  // from fonts.googleapis.com. Hence, split in two registerroutes
  workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'google-fonts-stylesheets',
      })
  )

  workbox.routing.registerRoute(
      /^https:\/\/fonts\.gstatic\.com/,
      new workbox.strategies.CacheFirst({
          cacheName: 'google-fonts-webfonts',
          plugins: [
              new workbox.cacheableResponse.Plugin({
                  statuses: [0, 200],
              }),
              new workbox.expiration.Plugin({
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                  maxEntries: 30,
              }),
          ],
      })
  )

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
  // workbox.routing.registerRoute(
  //   new RegExp('https://some-fancy-api.com'),
  //   workbox.strategies.networkFirst({
  //     cacheName: 'api',
  //   }),
  // );

}
