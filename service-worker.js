importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/teams.html', revision: '1' },
  { url: '/pages/home.html', revision: '1' },
  { url: '/pages/about.html', revision: '1' },
  { url: '/pages/contact.html', revision: '1' },
  { url: '/pages/saved.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/script.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/icon.png', revision: '1' },
  { url: '/manifest.json', revision: '1' },
],
  {
    ignoreUrlParametersMatching: [/.*/]
  }
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute( 
  new RegExp('https://api.football-data.org/v2'), 
  workbox.strategies.staleWhileRevalidate({ 
      cacheName: 'Football-data',
      plugins: [ 
          new workbox.cacheableResponse.Plugin({
              statuses: [200],
          }),
          new workbox.expiration.Plugin({
              maxAgeSeconds: 60 * 60 * 24 * 365,
              maxEntries: 30,
          }), 
      ]
  })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});