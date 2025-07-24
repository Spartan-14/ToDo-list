"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPenToSquare,
    faTrash,
    faCheck,
    faExclamationTriangle,
    faFlag,
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
        try {
            await dispatch(
                toggleCompleteAsync({
                    id: task.id,
                    completed: task.completed,
                }),
            ).unwrap()
        } catch (error) {
            console.error("Failed to toggle todo completion:", error)
        }
    }

    const handleEdit = async () => {
        try {
            await dispatch(editTodoAsync(task.id)).unwrap()
        } catch (error) {
            console.error("Failed to set edit mode:", error)
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        setIsDeleting(true)
        try {
            await dispatch(softDeleteTodoAsync(task.id)).unwrap()
            setShowDeleteModal(false)
        } catch (error) {
            console.error("Failed to delete todo:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteModal(false)
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 1:
                return faExclamationTriangle
            case 2:
                return faFlag
            case 3:
                return faCircle
            default:
                return null
        }
    }

    const getPriorityIconClass = (priority) => {
        switch (priority) {
            case 1:
                return "priority-icon priority-icon--urgent"
            case 2:
                return "priority-icon priority-icon--medium"
            case 3:
                return "priority-icon priority-icon--low"
            default:
                return ""
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 1:
                return "High"
            case 2:
                return "Medium"
            case 3:
                return "Low"
            default:
                return null
        }
    }

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 1:
                return "priority-badge urgent"
            case 2:
                return "priority-badge higher"
            case 3:
                return "priority-badge normal"
            default:
                return ""
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return ""
        const date = new Date(timestamp)
        return date.toLocaleDateString()
    }

    return (
        <>
            <div className={`Todo ${task.completed ? "completed-task" : ""} `}>
                <div className={`todo-checkbox ${task.completed ? "completed" : ""}`} onClick={handleComplete}>
                    {task.completed && <FontAwesomeIcon icon={faCheck} size="sm" />}
                </div>

                <div className="todo-content">
                    <div className="task-header">
                        {task.priority && (
                            <FontAwesomeIcon
                                icon={getPriorityIcon(task.priority)}
                                className={getPriorityIconClass(task.priority)}
                                title={getPriorityLabel(task.priority) + " Priority"}
                            />
                        )}
                        <div className={`task-text ${task.completed ? "completed" : ""}`}>{task.task}</div>
                    </div>

                    {(task.priority || task.created_at) && (
                        <div className="task-meta">
                            {task.priority && (
                                <span className={getPriorityBadgeClass(task.priority)}>{getPriorityLabel(task.priority)} Priority</span>
                            )}
                            {task.created_at && <span className="task-date">Created {formatDate(task.created_at)}</span>}
                        </div>
                    )}
                </div>

                <div className="todo-actions">
                    <button className="action-btn edit" onClick={handleEdit} title="Edit task" disabled={loading}>
                        <FontAwesomeIcon icon={faPenToSquare} size="sm" />
                    </button>
                    <button className="action-btn delete" onClick={handleDeleteClick} title="Delete task" disabled={loading}>
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
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
