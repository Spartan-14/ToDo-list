"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SuperheroButton = ({
                             children,
                             icon,
                             variant = "primary",
                             size = "medium",
                             disabled = false,
                             loading = false,
                             onClick,
                             className = "",
                             ...props
                         }) => {
    const [isPressed, setIsPressed] = useState(false)

    const getVariantClass = () => {
        switch (variant) {
            case "primary":
                return "superhero-btn superhero-btn--primary"
            case "secondary":
                return "superhero-btn superhero-btn--secondary"
            case "danger":
                return "superhero-btn superhero-btn--danger"
            case "success":
                return "superhero-btn superhero-btn--success"
            case "ghost":
                return "superhero-btn superhero-btn--ghost"
            default:
                return "superhero-btn"
        }
    }

    const getSizeClass = () => {
        switch (size) {
            case "small":
                return "superhero-btn--small"
            case "large":
                return "superhero-btn--large"
            case "xl":
                return "superhero-btn--xl"
            default:
                return "superhero-btn--medium"
        }
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseLeave = () => setIsPressed(false)

    return (
        <button
            className={`
        ${getVariantClass()} 
        ${getSizeClass()} 
        ${disabled ? "superhero-btn--disabled" : ""} 
        ${loading ? "superhero-btn--loading" : ""}
        ${isPressed ? "superhero-btn--pressed" : ""}
        ${className}
      `}
            disabled={disabled || loading}
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <div className="superhero-btn__content">
                {loading && (
                    <div className="superhero-btn__spinner">
                        <div className="spinner-ring"></div>
                    </div>
                )}
                {icon && !loading && <FontAwesomeIcon icon={icon} className="superhero-btn__icon" />}
                <span className="superhero-btn__text">{children}</span>
            </div>
            <div className="superhero-btn__glow"></div>
        </button>
    )
}

export default SuperheroButton
