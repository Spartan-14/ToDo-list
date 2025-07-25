"use client"

import { useEffect, useRef, useState } from "react"

export const usePerformanceMonitor = () => {
    const [fps, setFps] = useState(60)
    const [memoryUsage, setMemoryUsage] = useState(0)
    const frameCountRef = useRef(0)
    const lastTimeRef = useRef(performance.now())

    useEffect(() => {
        let animationId

        const monitor = () => {
            frameCountRef.current++
            const now = performance.now()

            if (now - lastTimeRef.current >= 1000) {
                setFps(frameCountRef.current)
                frameCountRef.current = 0
                lastTimeRef.current = now

                // Memory monitoring (if available)
                if (performance.memory) {
                    setMemoryUsage(Math.round(performance.memory.usedJSHeapSize / 1048576))
                }
            }

            animationId = requestAnimationFrame(monitor)
        }

        animationId = requestAnimationFrame(monitor)

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    return { fps, memoryUsage }
}

export default usePerformanceMonitor
