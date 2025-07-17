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

    // Fetch todos when the component mounts
    useEffect(() => {
        console.log(" ToDoWrapper: Component mounted, fetching todos...")
        dispatch(fetchTodos())
    }, [dispatch])

    // Debug logging
    useEffect(() => {
        console.log(" ToDoWrapper: State updated:", {
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

    // Show loading state on an initial load
    if (loading && !initialized) {
        return (
            <div className="ToDoWrapper">
                <h1>To-do List</h1>
                <div className="loading">
                    <p> Loading your tasks...</p>
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
                    <p> Error: {error}</p>
                    <button onClick={handleClearError} className="error-dismiss">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="stats">
                <p>Total todos: {todos.length}</p>
                <p>Completed: {todos.filter((todo) => todo.completed).length}</p>
            </div>

            {/* Add Todo Form */}
            <ToDoForm />

            {/* Loading indicator for operations */}
            {loading && initialized && (
                <div className="operation-loading">
                    <p> Processing...</p>
                </div>
            )}

            {/* Todos List */}
            <div className="todos-container">
                {todos.length === 0 && initialized && !loading ? (
                    <div className="empty-state">
                        <p> No tasks yet. Add one above to get started!</p>
                    </div>
                ) : (
                    todos.map((todo) =>
                        todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                    )
                )}
            </div>

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === "development" && (
                <div className="debug-info">
                    <details>
                        <summary> Debug Info</summary>
                        <pre>
              {JSON.stringify(
                  {
                      todosCount: todos.length,
                      loading,
                      error,
                      initialized,
                      firstTodo: todos[0] || null,
                      reduxState: "Check Redux DevTools",
                  },
                  null,
                  2,
              )}
            </pre>
                    </details>
                </div>
            )}
        </div>
    )
}

export default ToDoWrapper
