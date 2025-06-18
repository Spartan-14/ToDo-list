import React, {useState} from 'react'
import {ToDoForm} from "./ToDoForm";
import {v4 as uuidv4} from 'uuid';
import {Todo} from "./Todo";
import {EditTodoForm} from "./EditToDOForm";

uuidv4();

export const ToDoWrapper = () => {
    const [todos, setTodos] = useState([])

    const addToDo = todo => {
        setTodos([...todos, {
            id: uuidv4(), task: todo,
            completed: false, isEditing: false
        }])
        console.log(todos)
    }
    const toggleComplete = id => {
        setTodos(todos.map(todo => todo.id === id ? {
                todo, completed: !todo.completed
            } : todo
        ))
    }
    const deleteTodo = id => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const editTodo = id => {
        setTodos(todos.map(todo => todo.id === id ? {
                todo, isEditing: !todo.isEditing
            } : todo
        ))
    }
    const editTask = (task, id) => {
        setTodos(todos.map(todo => todo.id === id ? {
            ...todo,
            task, isEditing: !todo.isEditing
        } : todo))
    }
    return (
        <div className='ToDoWrapper'>
            <h1>Ferb I know what we're gonna do today</h1>
            <ToDoForm addToDo={addToDo}/>
            {todos.map((todo, index) => (
                todo.isEditing ? (
                    <EditTodoForm editTodo={editTask} task={todo}/>
                ) : (
                    <Todo task={todo} key={index}
                          toggleComplete={toggleComplete}
                          deleteTodo={deleteTodo}
                          editTodo={editTodo}/>
                )


            ))}
        </div>
    )
}
