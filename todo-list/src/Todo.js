"use client"
import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { toggleComplete, deleteTodo, editTodo } from "./store/todoSlice"

const Todo = ({ task }) => {
    const dispatch = useDispatch()

    const handleComplete = () => {
        dispatch(toggleComplete(task.id))
    }

    const handleEdit = () => {
        dispatch(editTodo(task.id))
    }

    const handleDelete = () => {
        dispatch(deleteTodo(task.id))
    }

    return (
        <div className="Todo">
            <p className={`${task.completed ? "completed" : "incompleted"}`} onClick={handleComplete}>
                {task.task}
            </p>
            <div>
                <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={handleEdit} />
                <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={handleDelete} />
            </div>
        </div>
    )
}

export default Todo
