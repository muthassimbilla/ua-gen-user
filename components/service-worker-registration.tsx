"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          console.log("[v0] Unregistering service worker:", registration.scope)
          registration.unregister()
        })
      })

      // Clear all caches
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            console.log("[v0] Deleting cache:", cacheName)
            caches.delete(cacheName)
          })
        })
      }
    }
  }, [])

  return null
}
