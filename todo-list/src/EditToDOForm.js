"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateTodo } from "./store/todoSlice"

export const EditToDoForm = ({ task }) => {
    const [value, setValue] = useState(String(task?.task || ""))
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (value.trim()) {
            dispatch(updateTodo({ id: task.id, task: value }))
        }
    }

    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                value={value}
                placeholder="Update task"
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="todo-btn">
                Update Task
            </button>
        </form>
    )
}
export default EditToDoForm
