"use client"

// Debounce function for performance optimization
export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
    let inThrottle
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
        ...options,
    }

    return new IntersectionObserver(callback, defaultOptions)
}

// Performance-aware animation frame
export const requestIdleCallback = (callback, options = {}) => {
    if (window.requestIdleCallback) {
        return window.requestIdleCallback(callback, options)
    }

    // Fallback for browsers without requestIdleCallback
    return setTimeout(() => {
        const start = performance.now()
        callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
        })
    }, 1)
}

// Memory cleanup utility
export const cleanupResources = (resources) => {
    resources.forEach((resource) => {
        if (resource && typeof resource.cleanup === "function") {
            resource.cleanup()
        }
    })
}

// Performance metrics collector
export const collectPerformanceMetrics = () => {
    const navigation = performance.getEntriesByType("navigation")[0]
    const paint = performance.getEntriesByType("paint")

    return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        firstPaint: paint.find((entry) => entry.name === "first-paint")?.startTime || 0,
        firstContentfulPaint: paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0,
        memory: performance.memory
            ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
            }
            : null,
    }
}
