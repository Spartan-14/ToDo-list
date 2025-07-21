import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as todoApi from "../supabase/todoApi"

// Sorting and grouping utilities
const sortTodos = (todos, sortBy, sortOrder, groupBy) => {
    // Filter out soft-deleted todos
    const activeTodos = todos.filter((todo) => !todo.is_deleted)
    const sortedTodos = [...activeTodos]

    // Primary sorting function
    const getSortValue = (todo, criteria) => {
        switch (criteria) {
            case "dateCreated":
                return new Date(todo.created_at).getTime()
            case "dateModified":
                return todo.updated_at ? new Date(todo.updated_at).getTime() : new Date(todo.created_at).getTime()
            case "name":
                return todo.task.toLowerCase()
            case "priority":
                // Priority sorting: 1 (urgent) first, then 2, 3, then null last
                return todo.priority === null ? 999 : todo.priority
            default:
                return 0
        }
    }

    // Sort the todos
    sortedTodos.sort((a, b) => {
        const aValue = getSortValue(a, sortBy)
        const bValue = getSortValue(b, sortBy)

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1

        return sortOrder === "desc" ? -comparison : comparison
    })

    // Group the todos if groupBy is specified
    if (groupBy && groupBy !== "none") {
        const grouped = {}

        sortedTodos.forEach((todo) => {
            let groupKey

            switch (groupBy) {
                case "dateCreated":
                    groupKey = new Date(todo.created_at).toDateString()
                    break
                case "dateModified":
                    const modDate = todo.updated_at ? new Date(todo.updated_at) : new Date(todo.created_at)
                    groupKey = modDate.toDateString()
                    break
                case "name":
                    groupKey = todo.task.charAt(0).toUpperCase()
                    break
                case "priority":
                    switch (todo.priority) {
                        case 1:
                            groupKey = "🔴 Urgent"
                            break
                        case 2:
                            groupKey = "🟡 Higher Priority"
                            break
                        case 3:
                            groupKey = "🟢 Normal Priority"
                            break
                        default:
                            groupKey = "⚪ No Priority"
                            break
                    }
                    break
                default:
                    groupKey = "All Tasks"
            }

            if (!grouped[groupKey]) {
                grouped[groupKey] = []
            }
            grouped[groupKey].push(todo)
        })

        return grouped
    }

    return sortedTodos
}

// Async thunks for Supabase operations
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (_, { getState, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Fetching todos from Supabase...")
        const todos = await todoApi.getTodos()
        console.log("✅ Redux: Todos fetched successfully:", todos)

        // Apply current sorting and grouping
        const { sortBy, sortOrder, groupBy } = getState().todos
        const processedTodos = sortTodos(todos, sortBy, sortOrder, groupBy)

        return { todos, processedTodos }
    } catch (error) {
        console.error("❌ Redux: Fetch todos failed:", error.message)
        return rejectWithValue(error.message)
    }
})

export const addTodoAsync = createAsyncThunk("todos/addTodo", async (todoData, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Adding todo:", todoData)
        const newTodo = await todoApi.addTodo(todoData)
        console.log("✅ Redux: Todo added successfully:", newTodo)

        // Fetch updated todos list after adding
        dispatch(fetchTodos())
        return newTodo
    } catch (error) {
        console.error("❌ Redux: Add todo failed:", error.message)
        return rejectWithValue(error.message)
    }
})

export const toggleCompleteAsync = createAsyncThunk(
    "todos/toggleComplete",
    async ({ id, completed }, { dispatch, rejectWithValue }) => {
        try {
            console.log("🔄 Redux: Toggling complete:", id, completed)
            const updatedTodo = await todoApi.toggleComplete(id, completed)
            console.log("✅ Redux: Toggle complete successful:", updatedTodo)

            dispatch(fetchTodos())
            return updatedTodo
        } catch (error) {
            console.error("❌ Redux: Toggle complete failed:", error.message)
            return rejectWithValue(error.message)
        }
    },
)

export const updateTodoAsync = createAsyncThunk(
    "todos/updateTodo",
    async ({ id, task, priority }, { dispatch, rejectWithValue }) => {
        try {
            console.log("🔄 Redux: Updating todo:", id, { task, priority })
            const updatedTodo = await todoApi.updateTodo(id, {
                task,
                priority: priority || null,
                is_editing: false,
                updated_at: new Date().toISOString(),
            })
            console.log("✅ Redux: Update todo successful:", updatedTodo)

            dispatch(fetchTodos())
            return updatedTodo
        } catch (error) {
            console.error("❌ Redux: Update todo failed:", error.message)
            return rejectWithValue(error.message)
        }
    },
)

// NEW: Soft delete instead of hard delete
export const softDeleteTodoAsync = createAsyncThunk(
    "todos/softDeleteTodo",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            console.log("🔄 Redux: Soft deleting todo:", id)
            await todoApi.softDeleteTodo(id)
            console.log("✅ Redux: Soft delete todo successful:", id)

            dispatch(fetchTodos())
            return id
        } catch (error) {
            console.error("❌ Redux: Soft delete todo failed:", error.message)
            return rejectWithValue(error.message)
        }
    },
)

// NEW: Restore soft-deleted todo
export const restoreTodoAsync = createAsyncThunk("todos/restoreTodo", async (id, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Restoring todo:", id)
        await todoApi.restoreTodo(id)
        console.log("✅ Redux: Restore todo successful:", id)

        dispatch(fetchTodos())
        return id
    } catch (error) {
        console.error("❌ Redux: Restore todo failed:", error.message)
        return rejectWithValue(error.message)
    }
})

export const editTodoAsync = createAsyncThunk("todos/editTodo", async (id, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Setting edit mode:", id)
        const updatedTodo = await todoApi.setEditMode(id, true)
        console.log("✅ Redux: Edit mode set:", updatedTodo)

        dispatch(fetchTodos())
        return updatedTodo
    } catch (error) {
        console.error("❌ Redux: Set edit mode failed:", error.message)
        return rejectWithValue(error.message)
    }
})

// NEW: Cancel edit mode without saving changes
export const cancelEditTodoAsync = createAsyncThunk(
    "todos/cancelEditTodo",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            console.log("🔄 Redux: Cancelling edit mode:", id)
            const updatedTodo = await todoApi.setEditMode(id, false)
            console.log("✅ Redux: Edit mode cancelled:", updatedTodo)

            dispatch(fetchTodos())
            return updatedTodo
        } catch (error) {
            console.error("❌ Redux: Cancel edit mode failed:", error.message)
            return rejectWithValue(error.message)
        }
    },
)

const initialState = {
    todos: [],
    processedTodos: [], // Sorted and grouped todos (active only)
    deletedTodos: [], // Soft-deleted todos for trash view
    loading: false,
    error: null,
    initialized: false,
    // Sorting and grouping state
    sortBy: "priority", // dateCreated, dateModified, name, priority
    sortOrder: "asc", // asc, desc
    groupBy: "none", // none, dateCreated, dateModified, name, priority
}

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload
            state.processedTodos = sortTodos(state.todos, state.sortBy, state.sortOrder, state.groupBy)
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload
            state.processedTodos = sortTodos(state.todos, state.sortBy, state.sortOrder, state.groupBy)
        },
        setGroupBy: (state, action) => {
            state.groupBy = action.payload
            state.processedTodos = sortTodos(state.todos, state.sortBy, state.sortOrder, state.groupBy)
        },
        toggleSortOrder: (state) => {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"
            state.processedTodos = sortTodos(state.todos, state.sortBy, state.sortOrder, state.groupBy)
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch todos
            .addCase(fetchTodos.pending, (state) => {
                console.log("🔄 Redux: Fetch todos pending...")
                state.loading = true
                state.error = null
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                console.log("✅ Redux: Fetch todos fulfilled:", action.payload)
                state.loading = false
                state.todos = action.payload.todos
                state.processedTodos = action.payload.processedTodos
                state.deletedTodos = action.payload.todos.filter((todo) => todo.is_deleted)
                state.initialized = true
                state.error = null
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                console.error("❌ Redux: Fetch todos rejected:", action.payload)
                state.loading = false
                state.error = action.payload
                state.initialized = true
            })

            // Add todo
            .addCase(addTodoAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addTodoAsync.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(addTodoAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Other async actions
            .addCase(toggleCompleteAsync.pending, (state) => {
                state.error = null
            })
            .addCase(toggleCompleteAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(toggleCompleteAsync.rejected, (state, action) => {
                state.error = action.payload
            })

            .addCase(updateTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(updateTodoAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(updateTodoAsync.rejected, (state, action) => {
                state.error = action.payload
            })

            // Soft delete
            .addCase(softDeleteTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(softDeleteTodoAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(softDeleteTodoAsync.rejected, (state, action) => {
                state.error = action.payload
            })

            // Restore
            .addCase(restoreTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(restoreTodoAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(restoreTodoAsync.rejected, (state, action) => {
                state.error = action.payload
            })

            .addCase(editTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(editTodoAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(editTodoAsync.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(cancelEditTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(cancelEditTodoAsync.fulfilled, (state) => {
                state.error = null
            })
            .addCase(cancelEditTodoAsync.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const { clearError, setSortBy, setSortOrder, setGroupBy, toggleSortOrder } = todoSlice.actions
export default todoSlice.reducer
