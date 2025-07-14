import { createSlice } from "@reduxjs/toolkit"

// Load todos from localStorage
const loadTodosFromStorage = () => {
    try {
        const savedTodos = localStorage.getItem("todos")
        return savedTodos ? JSON.parse(savedTodos) : []
    } catch (error) {
        console.error("Error loading todos from localStorage:", error)
        return []
    }
}

// Save todos to localStorage
const saveTodosToStorage = (todos) => {
    try {
        localStorage.setItem("todos", JSON.stringify(todos))
    } catch (error) {
        console.error("Error saving todos to localStorage:", error)
    }
}

const initialState = {
    items: loadTodosFromStorage(),
}

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const newTodo = {
                id: Date.now(),
                task: action.payload,
                completed: false,
                isEditing: false,
            }
            state.items.push(newTodo)
            saveTodosToStorage(state.items)
        },
        toggleComplete: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
                saveTodosToStorage(state.items)
            }
        },
        updateTodo: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.task = action.payload.task
                todo.isEditing = false
                saveTodosToStorage(state.items)
            }
        },
        deleteTodo: (state, action) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload)
            saveTodosToStorage(state.items)
        },
        editTodo: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.isEditing = true
                saveTodosToStorage(state.items)
            }
        },
    },
})

export const { addTodo, toggleComplete, updateTodo, deleteTodo, editTodo } = todoSlice.actions

export default todoSlice.reducer
