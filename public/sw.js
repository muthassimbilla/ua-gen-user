// Cleanup service worker - removes all caches and unregisters itself
self.addEventListener("install", (event) => {
  console.log("[SW] Cleanup service worker installing...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("[SW] Deleting cache:", cacheName)
            return caches.delete(cacheName)
          }),
        )
      })
      .then(() => {
        console.log("[SW] All caches cleared, skipping waiting...")
        return self.skipWaiting()
      }),
  )
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Cleanup service worker activating...")
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log("[SW] Claimed all clients")
      // Unregister this service worker after cleanup
      return self.registration.unregister().then(() => {
        console.log("[SW] Service worker unregistered successfully")
      })
    }),
  )
})

// No fetch event listener - let all requests go through normally
console.log("[SW] Cleanup service worker loaded - no fetch interception")
