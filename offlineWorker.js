const fileList = [
	'/artist.js',
	'/board.png',
	'/board.pxi',
	'/font8x8.png',
	'/gif.js',
	'/gif.worker.js',
	'/imageDisplay.html',
	'/index.html',
	'/offlineSupport.js',
	'/'
];

const version = 'x2';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(version).then(function(cache) {
			return cache.addAll(fileList);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('activate', function(event) {
  var cacheKeeplist = [version];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});