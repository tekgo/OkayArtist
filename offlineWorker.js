const fileList = [
	'./artist.js',
	'./board.png',
	'./font8x8.png',
	'./clone.png',
	'./gif.js',
	'./gif.worker.js',
	'./index.html',
	'./offlineSupport.js',
	'./',
	'./audio/brush_1.mp3',
	'./audio/brush_2.mp3',
	'./audio/brush_3.mp3',
	'./audio/brush_4.mp3',
	'./audio/brush_5.mp3',
	'./audio/brush_6.mp3',
	'./audio/brush_7.mp3',
	'./audio/brush_8.mp3',
	'./audio/brush_9.mp3',
	'./audio/loop_0.mp3',
	'./audio/magic1.mp3',
	'./audio/numkey_0.mp3',
	'./audio/numkey_1.mp3',
	'./audio/numkey_10.mp3',
	'./audio/numkey_11.mp3',
	'./audio/numkey_12.mp3',
	'./audio/numkey_2.mp3',
	'./audio/numkey_3.mp3',
	'./audio/numkey_4.mp3',
	'./audio/numkey_5.mp3',
	'./audio/numkey_6.mp3',
	'./audio/numkey_7.mp3',
	'./audio/numkey_8.mp3',
	'./audio/numkey_9.mp3',
	'./audio/sfx_0.mp3',
	'./audio/sfx_0_anti.mp3',
	'./audio/sfx_1.mp3',
	'./audio/sfx_2.mp3',
	'./audio/sfx_3.mp3',
	'./audio/sfx_4.mp3',
	'./audio/sfx_5.mp3',
	'./audio/sfx_6.mp3',
	'./audio/sfx_7.mp3',
	'./audio/sfx_8.mp3',
	'./audio/streetnoise.mp3',
	'./audio/time_up.mp3',
	'./audio/wah-cut.mp3',
	'./audio/wah-cut-up.mp3',
	'./audio/quiet-cut.mp3',
	'./audio/quiet-cut-up.mp3',
	'./audio/buzzy-cut.mp3',
	'./audio/buzzy-cut-up.mp3',
	'./audio/blast-cut.mp3',
	'./audio/blast-cut-up.mp3',
];

const version = 'x23';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(version).then(function(cache) {
			return cache.addAll(fileList);
		})
	);
	self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.open(version).then(function(cache) {
			return cache.match(event.request, { ignoreSearch: true }).then(function(response) {
				return response || fetch(event.request);
			})
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