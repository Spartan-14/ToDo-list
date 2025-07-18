"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faTasks,
    faCheckCircle,
    faExclamationTriangle,
    faExclamation,
    faCircle,
    faPlus,
    faStar,
    faFire,
} from "@fortawesome/free-solid-svg-icons"
import ToDoForm from "./ToDoForm"
import SortingControls from "./components/SortingControls"
import TodoGroup from "./components/TodoGroup"
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
            <div className="app-container">
                <div className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            <FontAwesomeIcon icon={faTasks} className="app-icon" />
                            TaskMaster Pro
                        </h1>
                    </div>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h3>Loading your workspace...</h3>
                    <p>Preparing your tasks and priorities</p>
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
        <div className="app-container">
            {/* Header */}
            <div className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        <FontAwesomeIcon icon={faTasks} className="app-icon" />
                        TaskMaster Pro
                    </h1>
                    <div className="header-stats">
                        <div className="stat-badge">
                            <FontAwesomeIcon icon={faTasks} />
                            <span>{totalTodos} Tasks</span>
                        </div>
                        <div className="stat-badge completed">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <span>{completionPercentage}% Done</span>
                        </div>
                        {urgentTodos > 0 && (
                            <div
                                className="stat-badge"
                                style={{
                                    background: "rgba(217, 83, 79, 0.2)",
                                    borderColor: "rgba(217, 83, 79, 0.3)",
                                    color: "#D9534F",
                                }}
                            >
                                <FontAwesomeIcon icon={faFire} />
                                <span>{urgentTodos} Urgent</span>
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
                        <span className="error-text">{error}</span>
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
                    <div className="priority-overview">
                        <h3 className="overview-title">
                            <FontAwesomeIcon icon={faStar} />
                            Priority Dashboard
                        </h3>
                        <div className="priority-cards">
                            {urgentTodos > 0 && (
                                <div className="priority-card urgent">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="card-icon" />
                                    <div className="card-content">
                                        <span className="card-number">{urgentTodos}</span>
                                        <span className="card-label">Urgent Tasks</span>
                                    </div>
                                </div>
                            )}
                            {higherPriorityTodos > 0 && (
                                <div className="priority-card higher">
                                    <FontAwesomeIcon icon={faExclamation} className="card-icon" />
                                    <div className="card-content">
                                        <span className="card-number">{higherPriorityTodos}</span>
                                        <span className="card-label">Higher Priority</span>
                                    </div>
                                </div>
                            )}
                            {normalPriorityTodos > 0 && (
                                <div className="priority-card normal">
                                    <FontAwesomeIcon icon={faCircle} className="card-icon" />
                                    <div className="card-content">
                                        <span className="card-number">{normalPriorityTodos}</span>
                                        <span className="card-label">Normal Priority</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Add Task Section */}
                <div className="add-task-section">
                    <div className="section-header">
                        <FontAwesomeIcon icon={faPlus} className="section-icon" />
                        <h3 className="section-title">Create New Task</h3>
                    </div>
                    <ToDoForm />
                </div>

                {/* Sorting Controls */}
                <SortingControls />

                {/* Loading indicator for operations */}
                {loading && initialized && (
                    <div className="operation-loading">
                        <div className="loading-spinner small"></div>
                        <span>Processing your request...</span>
                    </div>
                )}

                {/* Tasks Section */}
                <div className="tasks-section">
                    {todos.length === 0 && initialized && !loading ? (
                        <div className="empty-state">
                            <FontAwesomeIcon icon={faTasks} className="empty-icon" />
                            <h3>Ready to get productive?</h3>
                            <p>Create your first task above and start organizing your workflow with TaskMaster Pro</p>
                        </div>
                    ) : (
                        <div className="tasks-container">{renderTodos()}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ToDoWrapper
