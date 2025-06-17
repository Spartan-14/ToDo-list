import React, {useState} from 'react'

export const ToDoForm = ({addToDo}) => {
    const [value, setValue] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        addToDo(value);

        setValue("");
    }
    return (
        <form className='ToDoForm' onSubmit={handleSubmit}>
            <input type='text' className='todo-input' value= {value} placeholder='What is the task today?'
                   onChange={(e) => setValue(e.target.value)}/>
            <button type='Submit' className='todo-btn'>Add task</button>
        </form>
    )
}
