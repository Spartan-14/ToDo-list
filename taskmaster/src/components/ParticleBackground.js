"use client"

import { useCallback, useEffect, useRef, useMemo } from "react"

const ParticleBackground = ({ enabled = true, particleCount = 20 }) => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const particlesRef = useRef([])
    const lastTimeRef = useRef(0)
    const fpsRef = useRef(60)

    // Memoized particle colors for better performance
    const particleColors = useMemo(
        () => [
            { color: "#E87722", weight: 0.4 }, // Orange - most common
            { color: "#F5CB5C", weight: 0.3 }, // Gold
            { color: "#597B96", weight: 0.3 }, // Blue-gray
        ],
        [],
    )

    const createParticle = useCallback(() => {
        // Weighted random color selection
        const rand = Math.random()
        let color = particleColors[0].color
        let cumulative = 0

        for (const colorObj of particleColors) {
            cumulative += colorObj.weight
            if (rand <= cumulative) {
                color = colorObj.color
                break
            }
        }

        return {
            x: Math.random() * (window.innerWidth || 1200),
            y: Math.random() * (window.innerHeight || 800),
            size: Math.random() * 1.5 + 0.8, // Smaller, more uniform particles
            speedX: (Math.random() - 0.5) * 0.15, // Very slow movement
            speedY: (Math.random() - 0.5) * 0.15,
            opacity: Math.random() * 0.25 + 0.1, // More subtle opacity
            color,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.008 + 0.004, // Very slow pulse
            life: 1.0, // For fade effects
        }
    }, [particleColors])

    const initParticles = useCallback(() => {
        particlesRef.current = []
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(createParticle())
        }
    }, [createParticle, particleCount])

    const updateParticle = useCallback((particle, deltaTime, canvasWidth, canvasHeight) => {
        // Update position with time-based movement
        particle.x += particle.speedX * deltaTime * 0.1
        particle.y += particle.speedY * deltaTime * 0.1
        particle.pulse += particle.pulseSpeed * deltaTime * 0.1

        // Smooth wrapping with fade effect
        const margin = 50
        if (particle.x < -margin) particle.x = canvasWidth + margin
        if (particle.x > canvasWidth + margin) particle.x = -margin
        if (particle.y < -margin) particle.y = canvasHeight + margin
        if (particle.y > canvasHeight + margin) particle.y = -margin

        return particle
    }, [])

    const drawParticle = useCallback((ctx, particle) => {
        const pulseOpacity = particle.opacity * (0.4 + 0.6 * Math.sin(particle.pulse))

        ctx.save()
        ctx.globalAlpha = pulseOpacity * particle.life

        // Create gradient for smoother appearance
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.filter = "blur(2px)" // Consistent blur
        ctx.shadowBlur = 8
        ctx.shadowColor = particle.color

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
    }, [])

    const animate = useCallback(
        (currentTime) => {
            if (!enabled) return

            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
            if (!ctx) return

            // Calculate delta time for smooth animation
            const deltaTime = currentTime - lastTimeRef.current
            lastTimeRef.current = currentTime

            // FPS limiting for better performance
            if (deltaTime < 1000 / fpsRef.current) {
                animationRef.current = requestAnimationFrame(animate)
                return
            }

            // Clear canvas with slight trail effect for smoother motion
            ctx.globalAlpha = 0.1
            ctx.fillStyle = "#1a1b2f"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1

            // Update and draw particles
            const canvasWidth = canvas.width
            const canvasHeight = canvas.height

            for (let i = 0; i < particlesRef.current.length; i++) {
                const particle = particlesRef.current[i]
                updateParticle(particle, deltaTime, canvasWidth, canvasHeight)
                drawParticle(ctx, particle)
            }

            animationRef.current = requestAnimationFrame(animate)
        },
        [enabled, updateParticle, drawParticle],
    )

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const { innerWidth, innerHeight } = window
        const dpr = window.devicePixelRatio || 1

        // Set actual size
        canvas.width = innerWidth * dpr
        canvas.height = innerHeight * dpr

        // Scale back down using CSS
        canvas.style.width = `${innerWidth}px`
        canvas.style.height = `${innerHeight}px`

        // Scale the drawing context
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.scale(dpr, dpr)
        }
    }, [])

    // Performance monitoring
    useEffect(() => {
        let frameCount = 0
        let lastFpsTime = performance.now()

        const monitorFps = () => {
            frameCount++
            const now = performance.now()

            if (now - lastFpsTime >= 1000) {
                const currentFps = frameCount
                frameCount = 0
                lastFpsTime = now

                // Adjust particle count based on performance
                if (currentFps < 30 && particlesRef.current.length > 10) {
                    particlesRef.current = particlesRef.current.slice(0, -2)
                } else if (currentFps > 50 && particlesRef.current.length < particleCount) {
                    particlesRef.current.push(createParticle())
                }
            }

            if (enabled) {
                requestAnimationFrame(monitorFps)
            }
        }

        if (enabled) {
            requestAnimationFrame(monitorFps)
        }
    }, [enabled, createParticle, particleCount])

    useEffect(() => {
        if (!enabled) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            return
        }

        const canvas = canvasRef.current
        if (!canvas) return

        handleResize()
        initParticles()

        // Start animation
        lastTimeRef.current = performance.now()
        animationRef.current = requestAnimationFrame(animate)

        // Event listeners
        window.addEventListener("resize", handleResize, { passive: true })

        // Visibility API for performance
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
            window.removeEventListener("resize", handleResize)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [enabled, handleResize, initParticles, animate])

    if (!enabled) return null

    return (
        <canvas
            ref={canvasRef}
            className="particle-background"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: -1,
                opacity: 0.6,
                mixBlendMode: "screen", // Better blending with background
            }}
        />
    )
}

export default ParticleBackground
