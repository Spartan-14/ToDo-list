import React, {useState} from 'react'
import {ToDoForm} from "./ToDoForm";
import {v4 as uuidv4} from 'uuid';
import {Todo} from "./Todo";

uuidv4();

export const ToDoWrapper = () => {
    const [todos, setTodos] = useState([])

    const addToDo = todo => {
        setTodos([...todos, {
            id: uuidv4(), task: todo,
            completed: false, isEditing: false}])
            console.log(todos)
    }
    return (
        <div className='ToDoWrapper'>
            <h1>Fer</h1>
            <ToDoForm addToDo={addToDo} />
            {todos.map((todo, index) => (
                <Todo task= {todo} key={index}/>
    ))}
</div>
)
}
