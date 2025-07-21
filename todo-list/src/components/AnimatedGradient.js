"use client"

import { useEffect, useState } from "react"

const AnimatedGradient = () => {
    const [gradientPhase, setGradientPhase] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setGradientPhase((prev) => (prev + 1) % 360)
        }, 100) // Update every 100ms for smooth animation

        return () => clearInterval(interval)
    }, [])

    const gradientStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `
      radial-gradient(circle at 20% 80%, rgba(232, 119, 34, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(245, 203, 92, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(89, 123, 150, 0.2) 0%, transparent 50%),
      linear-gradient(${gradientPhase}deg, #1A1B2F 0%, #1F2235 50%, #1A1B2F 100%)
    `,
        filter: "blur(60px)",
        zIndex: 0,
        animation: "gradientShift 20s ease-in-out infinite",
    }

    return <div className="animated-gradient" style={gradientStyle} />
}

export default AnimatedGradient
