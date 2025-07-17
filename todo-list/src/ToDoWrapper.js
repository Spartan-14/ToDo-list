"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import ToDoForm from "./ToDoForm"
import Todo from "./Todo"
import EditToDOForm from "./EditToDOForm"
import { fetchTodos, clearError } from "./store/todoSlice"

const ToDoWrapper = () => {
    const dispatch = useDispatch()
    const { todos, loading, error, initialized } = useSelector((state) => state.todos)

    // Fetch todos when component mounts
    useEffect(() => {
        console.log("🚀 ToDoWrapper: Component mounted, fetching todos...")
        dispatch(fetchTodos())
    }, [dispatch])

    // Debug logging (console only, no UI)
    useEffect(() => {
        console.log("📊 ToDoWrapper: State updated:", {
            todosCount: todos.length,
            loading,
            error,
            initialized,
            todos: todos.slice(0, 2), // Log first 2 todos for debugging
        })
    }, [todos, loading, error, initialized])

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
            <div className="ToDoWrapper">
                <h1>To-do List</h1>
                <div className="loading">
                    <p>🔄 Loading your tasks...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="ToDoWrapper">
            <h1>To-do List</h1>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <p>❌ Error: {error}</p>
                    <button onClick={handleClearError} className="error-dismiss">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Enhanced Stats */}
            <div className="stats-container">
                <div className="stats-row">
                    <div className="stat-item">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">{totalTodos}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Completed:</span>
                        <span className="stat-value">{completedTodos}</span>
                    </div>
                </div>

                {(urgentTodos > 0 || higherPriorityTodos > 0 || normalPriorityTodos > 0 || noPriorityTodos > 0) && (
                    <div className="priority-stats">
                        {urgentTodos > 0 && <div className="priority-stat urgent">🔴 Urgent: {urgentTodos}</div>}
                        {higherPriorityTodos > 0 && <div className="priority-stat higher">🟡 Higher: {higherPriorityTodos}</div>}
                        {normalPriorityTodos > 0 && <div className="priority-stat normal">🟢 Normal: {normalPriorityTodos}</div>}
                        {noPriorityTodos > 0 && <div className="priority-stat no-priority">⚪ No Priority: {noPriorityTodos}</div>}
                    </div>
                )}
            </div>

            {/* Add Todo Form */}
            <ToDoForm />

            {/* Loading indicator for operations */}
            {loading && initialized && (
                <div className="operation-loading">
                    <p>🔄 Processing...</p>
                </div>
            )}

            {/* Todos List */}
            <div className="todos-container">
                {todos.length === 0 && initialized && !loading ? (
                    <div className="empty-state">
                        <p>📝 No tasks yet. Add one above to get started!</p>
                    </div>
                ) : (
                    todos.map((todo) =>
                        todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                    )
                )}
            </div>
        </div>
    )
}

export default ToDoWrapper
