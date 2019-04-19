const fileList = [
	'/OkayArtist/artist.js',
	'/OkayArtist/board.png',
	'/OkayArtist/board.pxi',
	'/OkayArtist/font8x8.png',
	'/OkayArtist/gif.js',
	'/OkayArtist/gif.worker.js',
	'/OkayArtist/imageDisplay.html',
	'/OkayArtist/index.html',
	'/OkayArtist/offlineSupport.js',
	'/OkayArtist/'
];

const version = 'x3';

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