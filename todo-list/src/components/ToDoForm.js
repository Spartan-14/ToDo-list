import React, {useState} from 'react'

export const ToDoForm = ({addTodo}) => {
    const [value, setValue] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        addTodo(value);

        setValue("");
    }
    return (
        <form className='ToDoForm' onSubmit={handleSubmit}>
            <input type='text' className='todo-input' value= {value} placeholder='What is the task today?'
                   onChange={(e) => console.log(e.target.value)}/>
            <button type='Submit' className='todo-btn'>Add task</button>
        </form>
    )
}