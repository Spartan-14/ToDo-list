"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrash, faCheck, faUndo } from "@fortawesome/free-solid-svg-icons"
import { toggleCompleteAsync, softDeleteTodoAsync, editTodoAsync } from "./store/todoSlice"
import DeleteConfirmModal from "./components/DeleteConfirmModal"
import PriorityOrb from "./components/PriorityOrb"

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

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 1:
                return "priority-urgent"
            case 2:
                return "priority-higher"
            case 3:
                return "priority-normal"
            default:
                return ""
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 1:
                return "URGENT MISSION"
            case 2:
                return "HIGH PRIORITY"
            case 3:
                return "STANDARD OPS"
            default:
                return "ROUTINE TASK"
        }
    }

    return (
        <>
            <div className={`Todo ${task.completed ? "completed-task" : ""} ${getPriorityClass(task.priority)}`}>
                <div className="todo-content">
                    <div className="todo-header">
                        {task.priority && <PriorityOrb priority={task.priority} size="medium" animated={true} />}
                        <p className={`task-text ${task.completed ? "completed" : "incompleted"}`}>{task.task}</p>
                    </div>

                    {task.priority && (
                        <div className="priority-label">
                            <small>{getPriorityLabel(task.priority)}</small>
                        </div>
                    )}
                </div>

                <div className="todo-actions">
                    <FontAwesomeIcon
                        className={`complete-icon ${task.completed ? "completed-btn" : "incomplete-btn"}`}
                        icon={task.completed ? faUndo : faCheck}
                        onClick={handleComplete}
                        title={task.completed ? "REACTIVATE MISSION" : "COMPLETE MISSION"}
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                    <FontAwesomeIcon
                        className="edit-icon"
                        icon={faPenToSquare}
                        onClick={handleEdit}
                        title="MODIFY MISSION"
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                    <FontAwesomeIcon
                        className="delete-icon"
                        icon={faTrash}
                        onClick={handleDeleteClick}
                        title="ABORT MISSION"
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
