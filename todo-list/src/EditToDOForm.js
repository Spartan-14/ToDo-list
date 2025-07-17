import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTodoAsync } from './store/todoSlice'

const EditToDOForm = ({ task }) => {
    const [value, setValue] = useState(task.task)
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.todos)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (value.trim()) {
            try {
                await dispatch(updateTodoAsync({
                    id: task.id,
                    task: value.trim()
                })).unwrap()
            } catch (error) {
                console.error('Failed to update todo:', error)
                // You could show a toast notification here
            }
        }
    }

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                value={value}
                placeholder="Update task"
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
            />
            <button
                type="submit"
                className="todo-btn"
                disabled={loading || !value.trim()}
            >
                {loading ? 'Updating...' : 'Update Task'}
            </button>
        </form>
    )
}

export default EditToDOForm
