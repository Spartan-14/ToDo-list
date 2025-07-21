"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTimes, faExclamationTriangle, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { updateTodoAsync, cancelEditTodoAsync } from "./store/todoSlice"

const EditToDoForm = ({ task }) => {
    const [value, setValue] = useState(String(task?.task || ""))
    const [priority, setPriority] = useState(task?.priority ? String(task.priority) : "")
    const [originalValue] = useState(String(task?.task || ""))
    const [originalPriority] = useState(task?.priority ? String(task.priority) : "")
    const [hasChanges, setHasChanges] = useState(false)
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)
    const inputRef = useRef(null)

    const CHARACTER_LIMIT = 100

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [])

    useEffect(() => {
        const valueChanged = value !== originalValue
        const priorityChanged = priority !== originalPriority
        setHasChanges(valueChanged || priorityChanged)
    }, [value, priority, originalValue, originalPriority])

    const handleInputChange = (e) => {
        const newValue = e.target.value
        if (newValue.length <= CHARACTER_LIMIT) {
            setValue(newValue)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!value.trim() || value.trim().length > CHARACTER_LIMIT) {
            return
        }

        try {
            await dispatch(
                updateTodoAsync({
                    id: task.id,
                    task: value.trim(),
                    priority: priority === "" ? null : Number.parseInt(priority),
                }),
            ).unwrap()
        } catch (error) {
            console.error("Failed to update todo:", error)
        }
    }

    const handleCancel = async () => {
        if (hasChanges) {
            setShowUnsavedWarning(true)
            return
        }
        await cancelEdit()
    }

    const cancelEdit = async () => {
        try {
            await dispatch(cancelEditTodoAsync(task.id)).unwrap()
        } catch (error) {
            console.error("Failed to cancel edit:", error)
        }
    }

    const confirmCancel = async () => {
        setShowUnsavedWarning(false)
        await cancelEdit()
    }

    const continueEditing = () => {
        setShowUnsavedWarning(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            handleCancel()
        }
    }

    const remainingChars = CHARACTER_LIMIT - value.length
    const isOverLimit = value.length > CHARACTER_LIMIT
    const isNearLimit = remainingChars <= 20
    const canSave = value.trim() && value.trim().length <= CHARACTER_LIMIT && hasChanges

    return (
        <>
            <form className="ToDoForm edit-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="edit-form-header">
                    <h4 className="edit-form-title">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        Edit Task
                    </h4>
                    {hasChanges && (
                        <span className="unsaved-indicator">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Unsaved changes
            </span>
                    )}
                </div>

                <div className="form-row">
                    <div className="input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className={`todo-input ${isOverLimit ? "input-error" : isNearLimit ? "input-warning" : ""}`}
                            value={value}
                            placeholder="Update task description"
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <div className="input-footer">
                            <div className={`character-count ${isOverLimit ? "count-error" : isNearLimit ? "count-warning" : ""}`}>
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

                    <button type="submit" className="btn btn-success" disabled={loading || !canSave}>
                        {loading ? <div className="loading-spinner"></div> : <FontAwesomeIcon icon={faSave} />}
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                        <FontAwesomeIcon icon={faTimes} />
                        Cancel
                    </button>
                </div>

                {hasChanges && (
                    <div className="edit-form-footer">
                        <small className="edit-help-text">Press Enter to save or Escape to cancel</small>
                    </div>
                )}
            </form>

            {/* Unsaved Changes Warning Modal */}
            {showUnsavedWarning && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <div className="modal-icon">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </div>
                        </div>

                        <div className="modal-content">
                            <h3 className="modal-title">Unsaved Changes</h3>
                            <p className="modal-message">
                                You have unsaved changes to this task. Are you sure you want to cancel editing?
                            </p>
                            <p className="modal-submessage">Your changes will be lost and cannot be recovered.</p>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={continueEditing}>
                                Continue Editing
                            </button>
                            <button className="btn btn-secondary" onClick={confirmCancel}>
                                <FontAwesomeIcon icon={faTimes} />
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditToDoForm
