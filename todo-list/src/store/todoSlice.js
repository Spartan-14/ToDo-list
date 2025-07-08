import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
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
        },
        toggleComplete: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        },
        updateTodo: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.task = action.payload.task
                todo.isEditing = false
            }
        },
        deleteTodo: (state, action) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload)
        },
        editTodo: (state, action) => {
            const todo = state.items.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.isEditing = true
            }
        },
    },
})

export const { addTodo, toggleComplete, updateTodo, deleteTodo, editTodo } = todoSlice.actions

export default todoSlice.reducer
