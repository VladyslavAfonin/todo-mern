import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext';

const NewTodo = () => {
    const [content, setContent] = useState("");
    const {addTodo} = useGlobalContext();

    const onSubmit = (e) => {
        e.preventDefault();

        axios.post("/api/todos/new", {content})
            .then(res => {
                setContent("")
                addTodo(res.data)
            })
    }

    return (
        <form className="new" onSubmit={onSubmit}>
            <input type="text" value={content} onChange={e => setContent(e.target.value)} />
            <button type='submit' className='btn' disabled={content.length == 0}>Add</button>
        </form>
    )
}

export default NewTodo