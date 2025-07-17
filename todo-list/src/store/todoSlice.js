import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as todoApi from "../supabase/todoApi"

// Async thunks for Supabase operations
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (_, { rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Fetching todos from Supabase...")
        const todos = await todoApi.getTodos()
        console.log("✅ Redux: Todos fetched successfully:", todos)
        return todos
    } catch (error) {
        console.error("❌ Redux: Fetch todos failed:", error.message)
        return rejectWithValue(error.message)
    }
})

export const addTodoAsync = createAsyncThunk("todos/addTodo", async (task, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Adding todo:", task)
        const newTodo = await todoApi.addTodo(task)
        console.log("✅ Redux: Todo added successfully:", newTodo)

        // Fetch updated todos list after adding
        console.log("🔄 Redux: Fetching updated todos list...")
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

            // Fetch updated todos list
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
    async ({ id, task }, { dispatch, rejectWithValue }) => {
        try {
            console.log("🔄 Redux: Updating todo:", id, task)
            const updatedTodo = await todoApi.updateTodo(id, { task, is_editing: false })
            console.log("✅ Redux: Update todo successful:", updatedTodo)

            // Fetch updated todos list
            dispatch(fetchTodos())

            return updatedTodo
        } catch (error) {
            console.error("❌ Redux: Update todo failed:", error.message)
            return rejectWithValue(error.message)
        }
    },
)

export const deleteTodoAsync = createAsyncThunk("todos/deleteTodo", async (id, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Deleting todo:", id)
        await todoApi.deleteTodo(id)
        console.log("✅ Redux: Delete todo successful:", id)

        // Fetch updated todos list
        dispatch(fetchTodos())

        return id
    } catch (error) {
        console.error("❌ Redux: Delete todo failed:", error.message)
        return rejectWithValue(error.message)
    }
})

export const editTodoAsync = createAsyncThunk("todos/editTodo", async (id, { dispatch, rejectWithValue }) => {
    try {
        console.log("🔄 Redux: Setting edit mode:", id)
        const updatedTodo = await todoApi.setEditMode(id, true)
        console.log("✅ Redux: Edit mode set:", updatedTodo)

        // Fetch updated todos list
        dispatch(fetchTodos())

        return updatedTodo
    } catch (error) {
        console.error("❌ Redux: Set edit mode failed:", error.message)
        return rejectWithValue(error.message)
    }
})

const initialState = {
    todos: [],
    loading: false,
    error: null,
    initialized: false,
}

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch todos
            .addCase(fetchTodos.pending, (state) => {
                console.log(" Redux: Fetch todos pending...")
                state.loading = true
                state.error = null
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                console.log(" Redux: Fetch todos fulfilled:", action.payload)
                state.loading = false
                state.todos = action.payload
                state.initialized = true
                state.error = null
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                console.error(" Redux: Fetch todos rejected:", action.payload)
                state.loading = false
                state.error = action.payload
                state.initialized = true
            })

            // Add todo
            .addCase(addTodoAsync.pending, (state) => {
                console.log(" Redux: Add todo pending...")
                state.loading = true
                state.error = null
            })
            .addCase(addTodoAsync.fulfilled, (state) => {
                console.log(" Redux: Add todo fulfilled - todos will be refreshed by fetchTodos")
                state.loading = false
                state.error = null
            })
            .addCase(addTodoAsync.rejected, (state, action) => {
                console.error(" Redux: Add todo rejected:", action.payload)
                state.loading = false
                state.error = action.payload
            })

            // Toggle complete
            .addCase(toggleCompleteAsync.pending, (state) => {
                state.error = null
            })
            .addCase(toggleCompleteAsync.fulfilled, (state) => {
                console.log(" Redux: Toggle complete fulfilled - todos refreshed")
                state.error = null
            })
            .addCase(toggleCompleteAsync.rejected, (state, action) => {
                console.error(" Redux: Toggle complete rejected:", action.payload)
                state.error = action.payload
            })

            // Update todo
            .addCase(updateTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(updateTodoAsync.fulfilled, (state) => {
                console.log(" Redux: Update todo fulfilled - todos refreshed")
                state.error = null
            })
            .addCase(updateTodoAsync.rejected, (state, action) => {
                console.error(" Redux: Update todo rejected:", action.payload)
                state.error = action.payload
            })

            // Delete todo
            .addCase(deleteTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(deleteTodoAsync.fulfilled, (state) => {
                console.log(" Redux: Delete todo fulfilled - todos refreshed")
                state.error = null
            })
            .addCase(deleteTodoAsync.rejected, (state, action) => {
                console.error(" Redux: Delete todo rejected:", action.payload)
                state.error = action.payload
            })

            // Edit todo
            .addCase(editTodoAsync.pending, (state) => {
                state.error = null
            })
            .addCase(editTodoAsync.fulfilled, (state) => {
                console.log(" Redux: Edit todo fulfilled - todos refreshed")
                state.error = null
            })
            .addCase(editTodoAsync.rejected, (state, action) => {
                console.error(" Redux: Edit todo rejected:", action.payload)
                state.error = action.payload
            })
    },
})

export const { clearError } = todoSlice.actions
export default todoSlice.reducer
