"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faTasks,
    faCheckCircle,
    faExclamationTriangle,
    faStar,
    faFire,
    faRocket,
    faBolt,
} from "@fortawesome/free-solid-svg-icons"
import ToDoForm from "./ToDoForm"
import SortingControls from "./components/SortingControls"
import TodoGroup from "./components/TodoGroup"
import ParticleBackground from "./components/ParticleBackground"
import AnimatedGradient from "./components/AnimatedGradient"
import GlassmorphicCard from "./components/GlassmorphicCard"
import PriorityOrb from "./components/PriorityOrb"
import { fetchTodos, clearError } from "./store/todoSlice"

const ToDoWrapper = () => {
    const dispatch = useDispatch()
    const { todos, processedTodos, loading, error, initialized, groupBy } = useSelector((state) => state.todos)

    // Fetch todos when component mounts
    useEffect(() => {
        console.log("🚀 ToDoWrapper: Component mounted, fetching todos...")
        dispatch(fetchTodos())
    }, [dispatch])

    const handleClearError = () => {
        dispatch(clearError())
    }

    // Calculate statistics
    const totalTodos = todos.length
    const completedTodos = todos.filter((todo) => todo.completed).length
    const urgentTodos = todos.filter((todo) => todo.priority === 1 && !todo.completed).length
    const higherPriorityTodos = todos.filter((todo) => todo.priority === 2 && !todo.completed).length
    const normalPriorityTodos = todos.filter((todo) => todo.priority === 3 && !todo.completed).length
    const noPriorityTodos = todos.filter((todo) => todo.priority === null && !todo.completed).length

    // Show loading state on initial load
    if (loading && !initialized) {
        return (
            <div className="App">
                <AnimatedGradient />
                <ParticleBackground enabled={true} />
                <div className="app-container">
                    <div className="app-header">
                        <div className="header-content">
                            <h1 className="app-title">
                                <FontAwesomeIcon icon={faRocket} className="app-icon" />
                                TASKMASTER
                            </h1>
                        </div>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h3>INITIALIZING COMMAND CENTER...</h3>
                        <p>Preparing your mission-critical tasks</p>
                    </div>
                </div>
            </div>
        )
    }

    const renderTodos = () => {
        if (groupBy === "none") {
            return <TodoGroup groupName="All Tasks" todos={processedTodos} isGrouped={false} />
        } else {
            return Object.entries(processedTodos).map(([groupName, groupTodos]) => (
                <TodoGroup key={groupName} groupName={groupName} todos={groupTodos} isGrouped={true} />
            ))
        }
    }

    const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

    return (
        <div className="App">
            <AnimatedGradient />
            <ParticleBackground enabled={true} />

            <div className="app-container">
                {/* Header */}
                <div className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            <FontAwesomeIcon icon={faRocket} className="app-icon" />
                            TASKMASTER
                        </h1>
                        <div className="header-stats">
                            <div className="stat-badge">
                                <FontAwesomeIcon icon={faTasks} />
                                <span>{totalTodos} MISSIONS</span>
                            </div>
                            <div className="stat-badge completed">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>{completionPercentage}% COMPLETE</span>
                            </div>
                            {urgentTodos > 0 && (
                                <div
                                    className="stat-badge"
                                    style={{
                                        background: "rgba(232, 119, 34, 0.2)",
                                        borderColor: "rgba(232, 119, 34, 0.4)",
                                        color: "#E87722",
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFire} />
                                    <span>{urgentTodos} URGENT</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-banner">
                        <div className="error-content">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                            <span className="error-text">SYSTEM ALERT: {error}</span>
                            <button onClick={handleClearError} className="error-dismiss">
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="app-content">
                    {/* Priority Overview */}
                    {(urgentTodos > 0 || higherPriorityTodos > 0 || normalPriorityTodos > 0) && (
                        <GlassmorphicCard variant="priority" elevation="high" className="priority-overview">
                            <h3 className="overview-title">
                                <FontAwesomeIcon icon={faStar} />
                                PRIORITY DASHBOARD
                            </h3>
                            <div className="priority-cards">
                                {urgentTodos > 0 && (
                                    <div className="priority-card urgent">
                                        <PriorityOrb priority={1} size="xl" animated={true} />
                                        <div className="card-content">
                                            <span className="card-number">{urgentTodos}</span>
                                            <span className="card-label">URGENT MISSIONS</span>
                                        </div>
                                    </div>
                                )}
                                {higherPriorityTodos > 0 && (
                                    <div className="priority-card higher">
                                        <PriorityOrb priority={2} size="xl" animated={true} />
                                        <div className="card-content">
                                            <span className="card-number">{higherPriorityTodos}</span>
                                            <span className="card-label">HIGH PRIORITY</span>
                                        </div>
                                    </div>
                                )}
                                {normalPriorityTodos > 0 && (
                                    <div className="priority-card normal">
                                        <PriorityOrb priority={3} size="xl" animated={true} />
                                        <div className="card-content">
                                            <span className="card-number">{normalPriorityTodos}</span>
                                            <span className="card-label">STANDARD OPS</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </GlassmorphicCard>
                    )}

                    {/* Add Task Section */}
                    <GlassmorphicCard variant="action" elevation="medium" className="add-task-section">
                        <div className="section-header">
                            <FontAwesomeIcon icon={faBolt} className="section-icon" />
                            <h3 className="section-title">DEPLOY NEW MISSION</h3>
                        </div>
                        <ToDoForm />
                    </GlassmorphicCard>

                    {/* Sorting Controls */}
                    <SortingControls />

                    {/* Loading indicator for operations */}
                    {loading && initialized && (
                        <div className="operation-loading">
                            <div className="loading-spinner small"></div>
                            <span>PROCESSING COMMAND...</span>
                        </div>
                    )}

                    {/* Tasks Section */}
                    <GlassmorphicCard variant="default" elevation="medium" className="tasks-section">
                        {todos.length === 0 && initialized && !loading ? (
                            <div className="empty-state">
                                <FontAwesomeIcon icon={faRocket} className="empty-icon" />
                                <h3>READY FOR DEPLOYMENT?</h3>
                                <p>Initialize your first mission above and begin your legendary journey with TaskMaster</p>
                            </div>
                        ) : (
                            <div className="tasks-container">{renderTodos()}</div>
                        )}
                    </GlassmorphicCard>
                </div>
            </div>
        </div>
    )
}

export default ToDoWrapper
