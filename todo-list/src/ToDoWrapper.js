import { useSelector } from "react-redux"
import { ToDoForm } from "./ToDoForm"
import Todo from "./Todo"
import { EditToDoForm } from "./EditToDoForm"

export const ToDoWrapper = () => {
    const todos = useSelector((state) => state.todos.items)

    return (
        <div className="ToDoWrapper">
            <h1>To-do list</h1>
            <ToDoForm />
            {todos.map((todo) =>
                todo.isEditing ? <EditToDoForm task={todo} key={todo.id} /> : <Todo task={todo} key={todo.id} />,
            )}
        </div>
    )
}

