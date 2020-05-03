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
	'/OkayArtist/',
	'OkayArtist/audio/brush_1.mp3',
	'OkayArtist/audio/brush_2.mp3',
	'OkayArtist/audio/brush_3.mp3',
	'OkayArtist/audio/brush_4.mp3',
	'OkayArtist/audio/brush_5.mp3',
	'OkayArtist/audio/brush_6.mp3',
	'OkayArtist/audio/brush_7.mp3',
	'OkayArtist/audio/brush_8.mp3',
	'OkayArtist/audio/brush_9.mp3',
	'OkayArtist/audio/loop_0.mp3',
	'OkayArtist/audio/magic1.mp3',
	'OkayArtist/audio/numkey_0.mp3',
	'OkayArtist/audio/numkey_1.mp3',
	'OkayArtist/audio/numkey_10.mp3',
	'OkayArtist/audio/numkey_11.mp3',
	'OkayArtist/audio/numkey_12.mp3',
	'OkayArtist/audio/numkey_2.mp3',
	'OkayArtist/audio/numkey_3.mp3',
	'OkayArtist/audio/numkey_4.mp3',
	'OkayArtist/audio/numkey_5.mp3',
	'OkayArtist/audio/numkey_6.mp3',
	'OkayArtist/audio/numkey_7.mp3',
	'OkayArtist/audio/numkey_8.mp3',
	'OkayArtist/audio/numkey_9.mp3',
	'OkayArtist/audio/sfx_0.mp3',
	'OkayArtist/audio/sfx_0_anti.mp3',
	'OkayArtist/audio/sfx_1.mp3',
	'OkayArtist/audio/sfx_2.mp3',
	'OkayArtist/audio/sfx_3.mp3',
	'OkayArtist/audio/sfx_4.mp3',
	'OkayArtist/audio/sfx_5.mp3',
	'OkayArtist/audio/sfx_6.mp3',
	'OkayArtist/audio/sfx_7.mp3',
	'OkayArtist/audio/sfx_8.mp3',
	'OkayArtist/audio/streetnoise.mp3',
	'OkayArtist/audio/time_up.mp3'
];

const version = 'x7';

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