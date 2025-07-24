"use client"

import Todo from "../Todo"
import EditToDOForm from "../EditToDOForm"
import { faLayerGroup, faFlag, faExclamationTriangle, faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const getGroupIcon = (groupName) => {
    if (groupName.includes("High") || groupName.includes("")) return faExclamationTriangle
    if (groupName.includes("Medium") || groupName.includes("")) return faFlag
    if (groupName.includes("Low") || groupName.includes("")) return faCircle
    return faLayerGroup
}

const getGroupIconClass = (groupName) => {
    if (groupName.includes("High") || groupName.includes("")) return "group-icon group-icon--urgent"
    if (groupName.includes("Medium") || groupName.includes("")) return "group-icon group-icon--medium"
    if (groupName.includes("Low") || groupName.includes("")) return "group-icon group-icon--low"
    return "group-icon group-icon--default"
}

const TodoGroup = ({ groupName, todos, isGrouped }) => {
    if (!isGrouped) {
        return (
            <div className="todos-list">
                {todos.map((todo) =>
                    todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                )}
            </div>
        )
    }

    return (
        <div className="todo-group">
            <div className="group-header">
                <div className="group-title-container">
                    <FontAwesomeIcon icon={getGroupIcon(groupName)} className={getGroupIconClass(groupName)} />
                    <h4 className="group-name">{groupName}</h4>
                </div>
                <span className="group-count">{todos.length}</span>
            </div>
            <div className="group-content">
                {todos.map((todo) =>
                    todo.is_editing ? <EditToDOForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
                )}
            </div>
        </div>
    )
}

export default TodoGroup
