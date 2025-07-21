"use client"

const GlassmorphicCard = ({ children, className = "", variant = "default", elevation = "medium", ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "hero":
                return "glassmorphic-card glassmorphic-card--hero"
            case "priority":
                return "glassmorphic-card glassmorphic-card--priority"
            case "action":
                return "glassmorphic-card glassmorphic-card--action"
            default:
                return "glassmorphic-card"
        }
    }

    const getElevationClass = () => {
        switch (elevation) {
            case "low":
                return "elevation-low"
            case "high":
                return "elevation-high"
            case "ultra":
                return "elevation-ultra"
            default:
                return "elevation-medium"
        }
    }

    return (
        <div className={`${getVariantStyles()} ${getElevationClass()} ${className}`} {...props}>
            <div className="glassmorphic-content">{children}</div>
        </div>
    )
}

export default GlassmorphicCard
