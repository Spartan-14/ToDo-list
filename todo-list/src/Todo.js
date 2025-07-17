import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { toggleCompleteAsync, editTodoAsync, deleteTodoAsync } from './store/todoSlice'

const Todo = ({ task }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.todos)

    const handleToggleComplete = async () => {
        try {
            await dispatch(toggleCompleteAsync({
                id: task.id,
                completed: task.completed
            })).unwrap()
        } catch (error) {
            console.error('Failed to toggle todo:', error)
        }
    }

    const handleEdit = async () => {
        try {
            await dispatch(editTodoAsync(task.id)).unwrap()
        } catch (error) {
            console.error('Failed to edit todo:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteTodoAsync(task.id)).unwrap()
        } catch (error) {
            console.error('Failed to delete todo:', error)
        }
    }

    return (
        <div className="Todo">
            <p
                className={`${task.completed ? 'completed' : ''}`}
                onClick={handleToggleComplete}
            >
                {task.task}
            </p>
            <div>
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    onClick={handleToggleComplete}
                    className={`check-icon ${task.completed ? 'completed' : ''}`}
                    style={{ opacity: loading ? 0.5 : 1 }}
                />
                <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={handleEdit}
                    className="edit-icon"
                    style={{ opacity: loading ? 0.5 : 1 }}
                />
                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={handleDelete}
                    className="delete-icon"
                    style={{ opacity: loading ? 0.5 : 1 }}
                />
            </div>
        </div>
    )
}

export default Todo