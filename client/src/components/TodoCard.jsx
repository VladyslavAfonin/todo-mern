import axios from 'axios';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const TodoCard = ({ todo }) => {
    const [content, setContent] = useState(todo.content);
    const [editing, setEditing] = useState(false);
    const input = useRef(null);

    const { todoComplete, todoIncomplete, removeTodo, updateTodo } = useGlobalContext();

    const onEdit = (e) => {
        e.preventDefault();
        setEditing(true);
        input.current.focus();
    }

    const stopEditing = (e) => {
        if(e) {
            e.preventDefault();
        }

        setEditing(false);
        setContent(todo.content)
    }

    const markAsComplete = (e) => {
        e.preventDefault();

        axios.put(`/api/todos/${todo._id}/complete`)
            .then(res => {
                todoComplete(res.data);
            })
    }

    const markAsIncomplete = (e) => {
        e.preventDefault();

        axios.put(`/api/todos/${todo._id}/incomplete`)
            .then(res => {
                todoIncomplete(res.data);
            })
    }

    const deleteTodo = (e) => {
        e.preventDefault();

        if(window.confirm("Are you sure to delete this todo from the list?")) {
            axios.delete(`/api/todos/${todo._id}`)
                .then(() => {
                    removeTodo(todo);
                })
        }
    }

    const editTodo = (e) => {
        e.preventDefault();

        axios.put(`/api/todos/${todo._id}`, {content})
            .then(res => {
                updateTodo(res.data);
                setEditing(false);
            }).catch(() => {
                stopEditing(false);
            })
    }

    return (
        <div className={`todo ${todo.complete ? "todo--complete" : ""}`}>
            <input type="checkbox" checked={todo.complete} onChange={!todo.complete ? markAsComplete : markAsIncomplete} />
            <input type="text" ref={input} value={content} readOnly={!editing} onChange={e => setContent(e.target.value)} />
            <div className="todo__controls">
                {
                    !editing ?
                    <>
                        {!todo.complete && <button onClick={onEdit}>Edit</button>}
                        <button onClick={deleteTodo}>Delete</button>
                    </> : 
                    <>
                        <button onClick={stopEditing}>Cancel</button>
                        <button onClick={editTodo}>Save</button>
                    </>
                }
            </div>
        </div>
    )
}

export default TodoCard;