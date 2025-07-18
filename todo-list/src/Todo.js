"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPenToSquare,
    faTrash,
    faCheck,
    faUndo,
    faExclamationTriangle,
    faExclamation,
    faCircle,
} from "@fortawesome/free-solid-svg-icons"
import { toggleCompleteAsync, softDeleteTodoAsync, editTodoAsync } from "./store/todoSlice"
import DeleteConfirmModal from "./components/DeleteConfirmModal"

const Todo = ({ task }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.todos)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleComplete = async () => {
        console.log("🔄 Toggling complete for todo:", task.id)
        try {
            await dispatch(
                toggleCompleteAsync({
                    id: task.id,
                    completed: task.completed,
                }),
            ).unwrap()
            console.log("✅ Todo completion toggled successfully")
        } catch (error) {
            console.error("❌ Failed to toggle todo completion:", error)
        }
    }

    const handleEdit = async () => {
        console.log("🔄 Setting edit mode for todo:", task.id)
        try {
            await dispatch(editTodoAsync(task.id)).unwrap()
            console.log("✅ Edit mode set successfully")
        } catch (error) {
            console.error("❌ Failed to set edit mode:", error)
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        setIsDeleting(true)
        console.log("🔄 Soft deleting todo:", task.id)
        try {
            await dispatch(softDeleteTodoAsync(task.id)).unwrap()
            console.log("✅ Todo soft deleted successfully")
            setShowDeleteModal(false)
        } catch (error) {
            console.error("❌ Failed to soft delete todo:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteModal(false)
    }

    const getPriorityInfo = (priority) => {
        switch (priority) {
            case 1:
                return {
                    icon: faExclamationTriangle,
                    label: "Urgent",
                    className: "priority-urgent",
                    color: "#dc3545",
                }
            case 2:
                return {
                    icon: faExclamation,
                    label: "Higher Priority",
                    className: "priority-higher",
                    color: "#ffc107",
                }
            case 3:
                return {
                    icon: faCircle,
                    label: "Normal Priority",
                    className: "priority-normal",
                    color: "#28a745",
                }
            default:
                return null
        }
    }

    const priorityInfo = getPriorityInfo(task.priority)

    return (
        <>
            <div className={`Todo ${task.completed ? "completed-task" : ""} ${priorityInfo?.className || ""}`}>
                <div className="todo-content">
                    <div className="todo-header">
                        {priorityInfo && (
                            <div className="priority-indicator" title={priorityInfo.label}>
                                <FontAwesomeIcon
                                    icon={priorityInfo.icon}
                                    style={{ color: priorityInfo.color }}
                                    className="priority-icon"
                                />
                            </div>
                        )}
                        <p className={`task-text ${task.completed ? "completed" : "incompleted"}`}>{task.task}</p>
                    </div>

                    {priorityInfo && (
                        <div className="priority-label">
                            <small>{priorityInfo.label}</small>
                        </div>
                    )}
                </div>

                <div className="todo-actions">
                    <FontAwesomeIcon
                        className={`complete-icon ${task.completed ? "completed-btn" : "incomplete-btn"}`}
                        icon={task.completed ? faUndo : faCheck}
                        onClick={handleComplete}
                        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                    <FontAwesomeIcon
                        className="edit-icon"
                        icon={faPenToSquare}
                        onClick={handleEdit}
                        title="Edit task"
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                    <FontAwesomeIcon
                        className="delete-icon"
                        icon={faTrash}
                        onClick={handleDeleteClick}
                        title="Delete task"
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                taskName={task.task}
                loading={isDeleting}
            />
        </>
    )
}

export default Todo
