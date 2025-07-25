"use client"

import { useEffect, useState, useRef } from "react"

const AnimatedGradient = ({ enabled = true }) => {
    const [gradientPhase, setGradientPhase] = useState(0)
    const animationRef = useRef(null)
    const lastTimeRef = useRef(0)

    useEffect(() => {
        if (!enabled) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            return
        }

        const animate = (currentTime) => {
            // Throttle to 30fps for better performance
            if (currentTime - lastTimeRef.current < 33) {
                animationRef.current = requestAnimationFrame(animate)
                return
            }

            lastTimeRef.current = currentTime
            setGradientPhase((prev) => (prev + 0.5) % 360) // Slower animation

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        // Pause animation when tab is not visible
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current)
                }
            } else {
                lastTimeRef.current = performance.now()
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [enabled])

    if (!enabled) return null

    const gradientStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `
      radial-gradient(circle at 20% 80%, rgba(232, 119, 34, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(245, 203, 92, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(89, 123, 150, 0.1) 0%, transparent 50%),
      linear-gradient(${gradientPhase}deg, 
        rgba(26, 27, 47, 0.95) 0%, 
        rgba(31, 34, 53, 0.98) 25%,
        rgba(26, 27, 47, 0.95) 50%,
        rgba(31, 34, 53, 0.98) 75%,
        rgba(26, 27, 47, 0.95) 100%
      )
    `,
        zIndex: -2,
        opacity: 0.8,
        willChange: "background",
        transform: "translateZ(0)",
    }

    return <div className="animated-gradient" style={gradientStyle} />
}

export default AnimatedGradient
