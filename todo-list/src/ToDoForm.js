"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { addTodoAsync } from "./store/todoSlice"

const ToDoForm = () => {
    const [value, setValue] = useState("")
    const [priority, setPriority] = useState("")
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)

    const CHARACTER_LIMIT = 100

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (value.trim() && value.trim().length <= CHARACTER_LIMIT) {
            const todoData = {
                task: value.trim(),
                priority: priority === "" ? null : Number.parseInt(priority),
            }

            try {
                await dispatch(addTodoAsync(todoData)).unwrap()
                setValue("")
                setPriority("")
            } catch (error) {
                console.error("Failed to add todo:", error)
            }
        }
    }

    const handleInputChange = (e) => {
        const newValue = e.target.value
        if (newValue.length <= CHARACTER_LIMIT) {
            setValue(newValue)
        }
    }

    const remainingChars = CHARACTER_LIMIT - value.length
    const isNearLimit = remainingChars <= 20
    const canSubmit = value.trim() && value.trim().length <= CHARACTER_LIMIT

    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="input-container">
                    <input
                        type="text"
                        className={`todo-input ${isNearLimit ? "input-warning" : ""}`}
                        value={value}
                        placeholder="What needs to be done?"
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <div className="input-footer">
                        <div className={`character-count ${isNearLimit ? "count-warning" : ""}`}>
                            {value.length}/{CHARACTER_LIMIT}
                        </div>
                    </div>
                </div>

                <select
                    className="priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={loading}
                >
                    <option value="">No Priority</option>
                    <option value="1">High Priority</option>
                    <option value="2">Medium Priority</option>
                    <option value="3">Low Priority</option>
                </select>

                <button type="submit" className="btn btn-primary" disabled={loading || !canSubmit}>
                    {loading ? <div className="loading-spinner"></div> : <FontAwesomeIcon icon={faPlus} />}
                    {loading ? "Adding..." : "Add Task"}
                </button>
            </div>
        </form>
    )
}

export default ToDoForm
