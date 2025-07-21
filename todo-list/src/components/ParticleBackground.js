"use client"

import { useCallback, useEffect, useRef } from "react"

const ParticleBackground = ({ enabled = true }) => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const particlesRef = useRef([])

    const createParticle = useCallback(() => {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? "#E87722" : Math.random() > 0.5 ? "#F5CB5C" : "#597B96",
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
        }
    }, [])

    const initParticles = useCallback(() => {
        particlesRef.current = []
        for (let i = 0; i < 25; i++) {
            particlesRef.current.push(createParticle())
        }
    }, [createParticle])

    const animate = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !enabled) return

        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particlesRef.current.forEach((particle) => {
            // Update position
            particle.x += particle.speedX
            particle.y += particle.speedY
            particle.pulse += particle.pulseSpeed

            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width
            if (particle.x > canvas.width) particle.x = 0
            if (particle.y < 0) particle.y = canvas.height
            if (particle.y > canvas.height) particle.y = 0

            // Calculate pulsing opacity
            const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse))

            // Draw particle with glow effect
            ctx.save()
            ctx.globalAlpha = pulseOpacity
            ctx.shadowBlur = 20
            ctx.shadowColor = particle.color
            ctx.fillStyle = particle.color
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
        })

        animationRef.current = requestAnimationFrame(animate)
    }, [enabled])

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }, [])

    useEffect(() => {
        if (!enabled) return

        const canvas = canvasRef.current
        if (!canvas) return

        handleResize()
        initParticles()
        animate()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
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
                zIndex: 1,
                opacity: 0.6,
            }}
        />
    )
}

export default ParticleBackground
