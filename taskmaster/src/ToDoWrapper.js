"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faTasks,
    faExclamationTriangle,
    faPlus,
    faChartLine,
    faCheckCircle,
    faClock,
} from "@fortawesome/free-solid-svg-icons"
import ToDoForm from "./ToDoForm"
import SortingControls from "./components/SortingControls"
import TodoGroup from "./components/TodoGroup"
import { fetchTodos, clearError } from "./store/todoSlice"
import ParticleBackground from "./components/ParticleBackground"
import AnimatedGradient from "./components/AnimatedGradient"
import GlassmorphicCard from "./components/GlassmorphicCard"

const ToDoWrapper = () => {
    const dispatch = useDispatch()
    const { todos, processedTodos, loading, error, initialized, groupBy } = useSelector((state) => state.todos)

    // Fetch todos when component mounts
    useEffect(() => {
        console.log("ToDoWrapper: Component mounted, fetching todos...")
        dispatch(fetchTodos())
    }, [dispatch])

    const handleClearError = () => {
        dispatch(clearError())
    }

    // Calculate statistics
    const totalTodos = todos.length
    const completedTodos = todos.filter((todo) => todo.completed).length
    const urgentTodos = todos.filter((todo) => todo.priority === 1 && !todo.completed).length
    const pendingTodos = totalTodos - completedTodos
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

    // Show loading state on initial load
    if (loading && !initialized) {
        return (
            <div className="App">
                <AnimatedGradient enabled={true} />
                <ParticleBackground enabled={true} />
                <div className="app-container">
                    <GlassmorphicCard variant="hero" elevation="high" className="loading-card">
                        <div className="loading-container">
                            <div className="loading-spinner enhanced"></div>
                            <h3>Loading your tasks...</h3>
                            <p>Please wait while we retrieve your tasks</p>
                        </div>
                    </GlassmorphicCard>
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

    return (
        <div className="App">
            <AnimatedGradient enabled={true} />
            <ParticleBackground enabled={true} particleCount={18} />

            <div className="app-container">
                {/* Header */}
                <GlassmorphicCard variant="hero" elevation="high" className="app-header-card">
                    <div className="app-header">
                        <div className="app-title-container">
                            <FontAwesomeIcon icon={faTasks} className="app-icon" />
                            <h1 className="app-title">TaskMaster</h1>
                        </div>
                        <p className="app-subtitle">Stay organized and get things done</p>

                        {totalTodos > 0 && (
                            <div className="header-stats">
                                <GlassmorphicCard variant="stats" elevation="low" className="stat-card">
                                    <div className="stat-item">
                                        <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
                                        <span className="stat-number">{totalTodos}</span>
                                        <div className="stat-label">Total Tasks</div>
                                    </div>
                                </GlassmorphicCard>

                                <GlassmorphicCard variant="stats" elevation="low" className="stat-card">
                                    <div className="stat-item">
                                        <FontAwesomeIcon icon={faCheckCircle} className="stat-icon" />
                                        <span className="stat-number">{completedTodos}</span>
                                        <div className="stat-label">Completed</div>
                                    </div>
                                </GlassmorphicCard>

                                <GlassmorphicCard variant="stats" elevation="low" className="stat-card">
                                    <div className="stat-item">
                                        <FontAwesomeIcon icon={faClock} className="stat-icon" />
                                        <span className="stat-number">{pendingTodos}</span>
                                        <div className="stat-label">Pending</div>
                                    </div>
                                </GlassmorphicCard>

                                {urgentTodos > 0 && (
                                    <GlassmorphicCard variant="priority" elevation="medium" className="stat-card urgent">
                                        <div className="stat-item">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="stat-icon urgent" />
                                            <span className="stat-number">{urgentTodos}</span>
                                            <div className="stat-label">Urgent</div>
                                        </div>
                                    </GlassmorphicCard>
                                )}

                                <GlassmorphicCard variant="stats" elevation="low" className="stat-card completion">
                                    <div className="stat-item">
                                        <div className="completion-circle">
                                            <span className="completion-percentage">{completionRate}%</span>
                                        </div>
                                        <div className="stat-label">Complete</div>
                                    </div>
                                </GlassmorphicCard>
                            </div>
                        )}
                    </div>
                </GlassmorphicCard>

                {/* Error Display */}
                {error && (
                    <GlassmorphicCard variant="priority" elevation="medium" className="error-card">
                        <div className="error-banner">
                            <div className="error-content">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                <span>Error: {error}</span>
                            </div>
                            <button onClick={handleClearError} className="error-dismiss">
                                ✕
                            </button>
                        </div>
                    </GlassmorphicCard>
                )}

                {/* Main Content */}
                <div className="app-content">
                    {/* Add Task Section */}
                    <GlassmorphicCard variant="form" elevation="medium" className="add-task-card">
                        <div className="add-task-section">
                            <h2 className="section-title">
                                <FontAwesomeIcon icon={faPlus} className="section-icon" />
                                Add New Task
                            </h2>
                            <ToDoForm />
                        </div>
                    </GlassmorphicCard>

                    {/* Sorting Controls */}
                    <GlassmorphicCard variant="action" elevation="medium" className="sorting-card">
                        <SortingControls />
                    </GlassmorphicCard>

                    {/* Tasks Section */}
                    <GlassmorphicCard variant="default" elevation="high" className="tasks-card">
                        <div className="tasks-section">
                            <div className="tasks-header">
                                <h2 className="tasks-title">Your Tasks</h2>
                                {totalTodos > 0 && (
                                    <div className="tasks-count">
                                        {totalTodos} task{totalTodos !== 1 ? "s" : ""}
                                    </div>
                                )}
                            </div>

                            {loading && initialized && (
                                <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-blue-gray)" }}>
                                    <div className="loading-spinner" style={{ margin: "0 auto 1rem" }}></div>
                                    Processing...
                                </div>
                            )}

                            {todos.length === 0 && initialized && !loading ? (
                                <div className="empty-state">
                                    <FontAwesomeIcon icon={faTasks} className="empty-icon" />
                                    <h3>No tasks yet</h3>
                                    <p>Create your first task using the form above to get started with organizing your work.</p>
                                </div>
                            ) : (
                                <div className="tasks-container">{renderTodos()}</div>
                            )}
                        </div>
                    </GlassmorphicCard>
                </div>
            </div>
        </div>
    )
}

export default ToDoWrapper
