"use client"

const GlassmorphicCard = ({
                              children,
                              className = "",
                              variant = "default",
                              elevation = "medium",
                              blur = "medium",
                              ...props
                          }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "hero":
                return "glassmorphic-card glassmorphic-card--hero"
            case "priority":
                return "glassmorphic-card glassmorphic-card--priority"
            case "action":
                return "glassmorphic-card glassmorphic-card--action"
            case "form":
                return "glassmorphic-card glassmorphic-card--form"
            case "stats":
                return "glassmorphic-card glassmorphic-card--stats"
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

    const getBlurClass = () => {
        switch (blur) {
            case "light":
                return "blur-light"
            case "heavy":
                return "blur-heavy"
            default:
                return "blur-medium"
        }
    }

    return (
        <div className={`${getVariantStyles()} ${getElevationClass()} ${getBlurClass()} ${className}`} {...props}>
            <div className="glassmorphic-content">{children}</div>
        </div>
    )
}

export default GlassmorphicCard
