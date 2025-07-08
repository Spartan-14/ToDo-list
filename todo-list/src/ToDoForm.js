"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addTodo } from "./store/todoSlice"

export const ToDoForm = () => {
    const [value, setValue] = useState("")
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (value.trim()) {
            dispatch(addTodo(value))
            setValue("")
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
            />
            <button type="submit" className="todo-btn">
                Add task
            </button>
        </form>
    )
}
