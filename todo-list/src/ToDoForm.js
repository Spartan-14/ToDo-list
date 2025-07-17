"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTodoAsync } from "./store/todoSlice"

const ToDoForm = () => {
    const [value, setValue] = useState("")
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(" Form: Submit triggered with value:", value)

        if (value.trim()) {
            console.log(" Form: Dispatching addTodoAsync...")

            try {
                await dispatch(addTodoAsync(value.trim())).unwrap()
                console.log(" Form: Todo added successfully, clearing form...")
                setValue("")
            } catch (error) {
                console.error(" Form: Add todo failed:", error)
                // Error is handled by Redux state and displayed in ToDoWrapper
            }
        } else {
            console.log(" Form: Empty value, not submitting")
        }
    }

    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                value={value}
                placeholder="What is the task today?"
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
            />
            <button type="submit" className="todo-btn" disabled={loading || !value.trim()}>
                {loading ? " Adding..." : "Add task"}
            </button>
        </form>
    )
}

export default ToDoForm
