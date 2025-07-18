"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight, faCheckCircle, faCircle, faTasks } from "@fortawesome/free-solid-svg-icons"
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
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <div className="todo-group">
            <div className="group-header" onClick={toggleExpanded}>
                <div className="group-header-left">
                    <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="group-toggle-icon" />
                    <FontAwesomeIcon icon={faTasks} className="group-type-icon" />
                    <span className="group-name">{groupName}</span>
                </div>

                <div className="group-header-right">
                    <div className="group-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                        <span className="progress-text">
              {completedCount}/{totalCount}
            </span>
                    </div>

                    <div className="group-stats">
                        <FontAwesomeIcon icon={faCheckCircle} className="stat-icon completed" />
                        <span className="stat-number">{completedCount}</span>
                        <FontAwesomeIcon icon={faCircle} className="stat-icon pending" />
                        <span className="stat-number">{totalCount - completedCount}</span>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="group-content">
                    <div className="group-divider"></div>
                    {todos.map((todo) =>
                        todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                    )}
                </div>
            )}
        </div>
    )
}

export default TodoGroup
