"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateTodoAsync } from "./store/todoSlice"

const EditToDoForm = ({ task }) => {
    const [value, setValue] = useState(String(task?.task || ""))
    const [priority, setPriority] = useState(task?.priority ? String(task.priority) : "")
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (value.trim()) {
            console.log("🔄 EditForm: Updating todo:", task.id, { task: value, priority })

            try {
                await dispatch(
                    updateTodoAsync({
                        id: task.id,
                        task: value.trim(),
                        priority: priority === "" ? null : Number.parseInt(priority),
                    }),
                ).unwrap()
                console.log("✅ EditForm: Todo updated successfully")
            } catch (error) {
                console.error("❌ EditForm: Failed to update todo:", error)
            }
        }
    }

    const handleCancel = () => {
        // Reset form to original values
        setValue(String(task?.task || ""))
        setPriority(task?.priority ? String(task.priority) : "")
    }

    return (
        <form className="ToDoForm edit-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <input
                    type="text"
                    className="todo-input"
                    value={value}
                    placeholder="Update task"
                    onChange={(e) => setValue(e.target.value)}
                    disabled={loading}
                    autoFocus
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
                    {loading ? "⏳ Updating..." : "Update Task"}
                </button>

                <button type="button" className="todo-btn cancel-btn" onClick={handleCancel} disabled={loading}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default EditToDoForm
