"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTodoAsync } from "./store/todoSlice"

const ToDoForm = () => {
    const [value, setValue] = useState("")
    const [priority, setPriority] = useState("") // Empty string for no priority
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("🔄 Form: Submit triggered with value:", value, "priority:", priority)

        if (value.trim()) {
            console.log("🔄 Form: Dispatching addTodoAsync...")

            const todoData = {
                task: value.trim(),
                priority: priority === "" ? null : Number.parseInt(priority), // Convert to int or null
            }

            try {
                await dispatch(addTodoAsync(todoData)).unwrap()
                console.log("✅ Form: Todo added successfully, clearing form...")
                setValue("")
                setPriority("")
            } catch (error) {
                console.error("❌ Form: Add todo failed:", error)
                // Error is handled by Redux state and displayed in ToDoWrapper
            }
        } else {
            console.log("⚠️ Form: Empty value, not submitting")
        }
    }

    const getPriorityLabel = (priorityValue) => {
        switch (priorityValue) {
            case "1":
                return "🔴 Urgent"
            case "2":
                return "🟡 Higher Priority"
            case "3":
                return "🟢 Normal Priority"
            default:
                return "⚪ No Priority"
        }
    }

    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            <div className="form-row">
                <input
                    type="text"
                    className="todo-input"
                    value={value}
                    placeholder="What is the task today?"
                    onChange={(e) => setValue(e.target.value)}
                    disabled={loading}
                />

                <select
                    className="priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={loading}
                >
                    <option value="">⚪ No Priority</option>
                    <option value="1">🔴 Urgent</option>
                    <option value="2">🟡 Higher Priority</option>
                    <option value="3">🟢 Normal Priority</option>
                </select>

                <button type="submit" className="todo-btn" disabled={loading || !value.trim()}>
                    {loading ? "⏳ Adding..." : "Add task"}
                </button>
            </div>

            {priority && <div className="priority-preview">Selected: {getPriorityLabel(priority)}</div>}
        </form>
    )
}

export default ToDoForm
