"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle, faExclamation, faCircle } from "@fortawesome/free-solid-svg-icons"

const PriorityOrb = ({ priority, size = "medium", animated = true }) => {
    const getPriorityConfig = () => {
        switch (priority) {
            case 1:
                return {
                    icon: faExclamationTriangle,
                    label: "URGENT",
                    className: "priority-orb--urgent",
                    color: "#E87722",
                    pulseColor: "rgba(232, 119, 34, 0.4)",
                }
            case 2:
                return {
                    icon: faExclamation,
                    label: "HIGH",
                    className: "priority-orb--high",
                    color: "#F5CB5C",
                    pulseColor: "rgba(245, 203, 92, 0.4)",
                }
            case 3:
                return {
                    icon: faCircle,
                    label: "NORMAL",
                    className: "priority-orb--normal",
                    color: "#597B96",
                    pulseColor: "rgba(89, 123, 150, 0.4)",
                }
            default:
                return {
                    icon: faCircle,
                    label: "NONE",
                    className: "priority-orb--none",
                    color: "#597B96",
                    pulseColor: "rgba(89, 123, 150, 0.2)",
                }
        }
    }

    const getSizeClass = () => {
        switch (size) {
            case "small":
                return "priority-orb--small"
            case "large":
                return "priority-orb--large"
            case "xl":
                return "priority-orb--xl"
            default:
                return "priority-orb--medium"
        }
    }

    const config = getPriorityConfig()

    return (
        <div
            className={`
        priority-orb 
        ${config.className} 
        ${getSizeClass()} 
        ${animated ? "priority-orb--animated" : ""}
      `}
            title={config.label}
        >
            <div className="priority-orb__core">
                <FontAwesomeIcon icon={config.icon} className="priority-orb__icon" />
            </div>
            <div className="priority-orb__pulse"></div>
            <div className="priority-orb__glow"></div>
        </div>
    )
}

export default PriorityOrb
