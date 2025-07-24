"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faExclamationTriangle, faFlag, faCircle } from "@fortawesome/free-solid-svg-icons"
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

    const getPriorityConfig = (priorityValue) => {
        switch (priorityValue) {
            case "1":
                return { icon: faExclamationTriangle, color: "#dc3545", label: "High Priority" }
            case "2":
                return { icon: faFlag, color: "#e87722", label: "Medium Priority" }
            case "3":
                return { icon: faCircle, color: "#f5cb5c", label: "Low Priority" }
            default:
                return { icon: faCircle, color: "#597b96", label: "No Priority" }
        }
    }

    const currentPriorityConfig = getPriorityConfig(priority)

    return (
        <form className="ToDoForm enhanced" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="input-container enhanced">
                    <input
                        type="text"
                        className={`todo-input enhanced ${isNearLimit ? "input-warning" : ""}`}
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

                <div className="priority-select-wrapper enhanced">
                    <select
                        className="priority-select enhanced"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        disabled={loading}
                    >
                        <option value="" data-icon="faCircle" data-color="#597b96">
                            ⚪ No Priority
                        </option>
                        <option value="1" data-icon="faExclamationTriangle" data-color="#dc3545">
                            🔴 High Priority
                        </option>
                        <option value="2" data-icon="faFlag" data-color="#e87722">
                            🟠 Medium Priority
                        </option>
                        <option value="3" data-icon="faCircle" data-color="#f5cb5c">
                            🟡 Low Priority
                        </option>
                    </select>

                    <div className="priority-icon-display">
                        <FontAwesomeIcon
                            icon={currentPriorityConfig.icon}
                            style={{ color: currentPriorityConfig.color }}
                            className="priority-visual-icon"
                        />
                    </div>

                    {priority && <div className="priority-tooltip">{currentPriorityConfig.label}</div>}
                </div>

                <button type="submit" className="btn btn-primary enhanced" disabled={loading || !canSubmit}>
                    {loading ? (
                        <div className="loading-spinner enhanced"></div>
                    ) : (
                        <FontAwesomeIcon icon={faPlus} className="btn-icon" />
                    )}
                    <span className="btn-text">{loading ? "Adding..." : "Add Task"}</span>
                </button>
            </div>
        </form>
    )
}

export default ToDoForm
