"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTimes, faExclamationTriangle, faBolt } from "@fortawesome/free-solid-svg-icons"
import SuperheroButton from "./components/SuperheroButton"
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

    const CHARACTER_LIMIT = 50

    // Focus input when component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [])

    // Track changes
    useEffect(() => {
        const valueChanged = value !== originalValue
        const priorityChanged = priority !== originalPriority
        setHasChanges(valueChanged || priorityChanged)
    }, [value, priority, originalValue, originalPriority])

    // Handle input change with character limit
    const handleInputChange = (e) => {
        const newValue = e.target.value
        if (newValue.length <= CHARACTER_LIMIT) {
            setValue(newValue)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!value.trim()) {
            return // Don't save empty tasks
        }

        if (value.trim().length > CHARACTER_LIMIT) {
            return // Don't save if over character limit
        }

        console.log("🔄 EditForm: Updating todo:", task.id, { task: value.trim(), priority })

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

    const handleCancel = async () => {
        if (hasChanges) {
            setShowUnsavedWarning(true)
            return
        }

        await cancelEdit()
    }

    const cancelEdit = async () => {
        console.log("🔄 EditForm: Cancelling edit for todo:", task.id)

        try {
            await dispatch(cancelEditTodoAsync(task.id)).unwrap()
            console.log("✅ EditForm: Edit cancelled successfully")
        } catch (error) {
            console.error("❌ EditForm: Failed to cancel edit:", error)
        }
    }

    const confirmCancel = async () => {
        setShowUnsavedWarning(false)
        await cancelEdit()
    }

    const continueEditing = () => {
        setShowUnsavedWarning(false)
    }

    // Handle Escape key to cancel
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            handleCancel()
        }
    }

    const remainingChars = CHARACTER_LIMIT - value.length
    const isOverLimit = value.length > CHARACTER_LIMIT
    const isNearLimit = remainingChars <= 10
    const canSave = value.trim() && value.trim().length <= CHARACTER_LIMIT && hasChanges

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

    return (
        <>
            <form className="ToDoForm edit-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="edit-form-header">
                    <h4 className="edit-form-title">
                        <FontAwesomeIcon icon={faBolt} className="edit-icon" />
                        MODIFY MISSION
                    </h4>
                    {hasChanges && (
                        <span className="unsaved-indicator">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              UNSAVED CHANGES
            </span>
                    )}
                </div>

                <div className="form-row">
                    <div className="input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className={`todo-input edit-input ${isOverLimit ? "input-error" : isNearLimit ? "input-warning" : ""}`}
                            value={value}
                            placeholder="Update mission parameters"
                            onChange={handleInputChange}
                            disabled={loading}
                            maxLength={CHARACTER_LIMIT + 10} // Allow typing beyond limit for better UX
                        />
                        <div className="input-footer">
                            <div className={`character-count ${isOverLimit ? "count-error" : isNearLimit ? "count-warning" : ""}`}>
                                {value.length}/{CHARACTER_LIMIT}
                                {isOverLimit && (
                                    <span className="over-limit-text">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    LIMIT EXCEEDED
                  </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <select
                        className="priority-select edit-priority-select"
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
                        variant="success"
                        size="medium"
                        disabled={loading || !canSave}
                        loading={loading}
                        icon={faSave}
                    >
                        {loading ? "UPDATING..." : "UPDATE"}
                    </SuperheroButton>

                    <SuperheroButton
                        type="button"
                        variant="secondary"
                        size="medium"
                        onClick={handleCancel}
                        disabled={loading}
                        icon={faTimes}
                    >
                        ABORT
                    </SuperheroButton>
                </div>

                {hasChanges && (
                    <div className="edit-form-footer">
                        <small className="edit-help-text">
                            💡 Press <kbd>ENTER</kbd> to update or <kbd>ESC</kbd> to abort
                        </small>
                    </div>
                )}
            </form>

            {/* Unsaved Changes Warning Modal */}
            {showUnsavedWarning && (
                <div className="modal-overlay">
                    <div className="modal-container unsaved-warning-modal">
                        <div className="modal-header">
                            <div className="modal-icon-container warning">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="modal-warning-icon" />
                            </div>
                        </div>

                        <div className="modal-content">
                            <h3 className="modal-title">UNSAVED CHANGES</h3>
                            <p className="modal-message">
                                You have unsaved modifications to this mission. Are you sure you want to abort editing?
                            </p>
                            <p className="modal-submessage">Your changes will be lost and cannot be recovered.</p>
                        </div>

                        <div className="modal-actions">
                            <SuperheroButton variant="success" size="medium" onClick={continueEditing} className="continue-btn">
                                CONTINUE EDITING
                            </SuperheroButton>
                            <SuperheroButton
                                variant="secondary"
                                size="medium"
                                onClick={confirmCancel}
                                icon={faTimes}
                                className="discard-btn"
                            >
                                DISCARD CHANGES
                            </SuperheroButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditToDoForm
