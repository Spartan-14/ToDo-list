"use client"

import Todo from "../Todo"
import EditToDOForm from "../EditToDOForm"

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
                <h4 className="group-name">{groupName}</h4>
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
