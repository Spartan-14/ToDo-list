import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const Todo = ({task}) => {
    return (
        <div className ='Todo'>
            <p>{task.task}</p>
            <div>
                <FontAwesomeIcon icon={faCheck} />
                <FontAwesomeIcon icon={faTrash} />
            </div>
        </div>
    )
}
