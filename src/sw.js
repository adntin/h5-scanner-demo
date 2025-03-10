// 在Service Worker中清除缓存
self.caches.keys().then(function (cacheNames) {
  return Promise.all(
    cacheNames.map(function (cacheName) {
      return caches.delete(cacheName)
    }),
  )
})
