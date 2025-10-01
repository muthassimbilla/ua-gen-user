"use client"

import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/og-image.jpg',
        '/twitter-image.jpg',
        '/professional-woman-diverse.png',
        '/professional-man.jpg',
        '/professional-woman-2.png'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Optimize font loading
    const optimizeFonts = () => {
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded')
        })
      }
    }

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img)
      })
    }

    // Initialize optimizations
    preloadCriticalResources()
    optimizeFonts()
    lazyLoadResources()

    // Cleanup
    return () => {
      // Cleanup if needed
    }
  }, [])

  return null
}

