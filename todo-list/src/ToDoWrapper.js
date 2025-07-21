"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTasks, faExclamationTriangle, faPlus } from "@fortawesome/free-solid-svg-icons"
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
    const pendingTodos = totalTodos - completedTodos

    // Show loading state on initial load
    if (loading && !initialized) {
        return (
            <div className="App">
                <div className="app-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h3>Loading your tasks...</h3>
                        <p>Please wait while we retrieve your tasks</p>
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

    return (
        <div className="App">
            <div className="app-container">
                {/* Header */}
                <div className="app-header">
                    <h1 className="app-title">Task Manager</h1>
                    <p className="app-subtitle">Stay organized and get things done</p>

                    {totalTodos > 0 && (
                        <div className="header-stats">
                            <div className="stat-item">
                                <span className="stat-number">{totalTodos}</span>
                                <div className="stat-label">Total Tasks</div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{completedTodos}</span>
                                <div className="stat-label">Completed</div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{pendingTodos}</span>
                                <div className="stat-label">Pending</div>
                            </div>
                            {urgentTodos > 0 && (
                                <div className="stat-item">
                                    <span className="stat-number">{urgentTodos}</span>
                                    <div className="stat-label">Urgent</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-banner">
                        <div className="error-content">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            <span>Error: {error}</span>
                        </div>
                        <button onClick={handleClearError} className="error-dismiss">
                            ✕
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="app-content">
                    {/* Add Task Section */}
                    <div className="add-task-section">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faPlus} className="section-icon" />
                            Add New Task
                        </h2>
                        <ToDoForm />
                    </div>

                    {/* Sorting Controls */}
                    <SortingControls />

                    {/* Tasks Section */}
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
                </div>
            </div>
        </div>
    )
}

export default ToDoWrapper
