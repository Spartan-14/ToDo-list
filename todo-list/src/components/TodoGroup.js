"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import Todo from "../Todo"
import EditToDOForm from "../EditToDOForm"

const TodoGroup = ({ groupName, todos, isGrouped }) => {
    const [isExpanded, setIsExpanded] = useState(true)

    if (!isGrouped) {
        // If not grouped, render todos directly
        return (
            <div className="todos-list">
                {todos.map((todo) =>
                    todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                )}
            </div>
        )
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    const completedCount = todos.filter((todo) => todo.completed).length
    const totalCount = todos.length

    return (
        <div className="todo-group">
            <div className="group-header" onClick={toggleExpanded}>
                <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="group-toggle-icon" />
                <span className="group-name">{groupName}</span>
                <span className="group-count">
          ({completedCount}/{totalCount})
        </span>
            </div>

            {isExpanded && (
                <div className="group-content">
                    {todos.map((todo) =>
                        todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                    )}
                </div>
            )}
        </div>
    )
}

export default TodoGroup
