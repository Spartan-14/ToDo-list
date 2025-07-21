"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { faRocket } from "@fortawesome/free-solid-svg-icons"
import SuperheroButton from "./components/SuperheroButton"
import { addTodoAsync } from "./store/todoSlice"

const ToDoForm = () => {
    const [value, setValue] = useState("")
    const [priority, setPriority] = useState("") // Empty string for no priority
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)

    const CHARACTER_LIMIT = 50

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("🔄 Form: Submit triggered with value:", value, "priority:", priority)

        if (value.trim() && value.trim().length <= CHARACTER_LIMIT) {
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
            console.log("⚠️ Form: Invalid input - empty or too long")
        }
    }

    const handleInputChange = (e) => {
        const newValue = e.target.value
        if (newValue.length <= CHARACTER_LIMIT) {
            setValue(newValue)
        }
    }

    const getPriorityLabel = (priorityValue) => {
        switch (priorityValue) {
            case "1":
                return "🔴 URGENT"
            case "2":
                return "🟡 HIGH PRIORITY"
            case "3":
                return "🟢 STANDARD"
            default:
                return "⚪ NO PRIORITY"
        }
    }

    const remainingChars = CHARACTER_LIMIT - value.length
    const isNearLimit = remainingChars <= 10
    const canSubmit = value.trim() && value.trim().length <= CHARACTER_LIMIT

    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="input-container">
                    <input
                        type="text"
                        className={`todo-input ${isNearLimit ? "input-warning" : ""}`}
                        value={value}
                        placeholder="What is your mission today?"
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength={CHARACTER_LIMIT + 10} // Allow typing beyond limit for better UX
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
                    <option value="">⚪ NO PRIORITY</option>
                    <option value="1">🔴 URGENT</option>
                    <option value="2">🟡 HIGH PRIORITY</option>
                    <option value="3">🟢 STANDARD</option>
                </select>

                <SuperheroButton
                    type="submit"
                    variant="primary"
                    size="medium"
                    disabled={loading || !canSubmit}
                    loading={loading}
                    icon={faRocket}
                >
                    {loading ? "DEPLOYING..." : "DEPLOY MISSION"}
                </SuperheroButton>
            </div>

            {priority && <div className="priority-preview">Mission Priority: {getPriorityLabel(priority)}</div>}
        </form>
    )
}

export default ToDoForm
