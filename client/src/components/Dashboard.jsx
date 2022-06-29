import React from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import TodoCard from './TodoCard'
import NewTodo from './NewTodo'

const Dashboard = () => {
    const { user, completeTodos, incompleteTodos } = useGlobalContext()
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && navigate) {
            navigate("/")
        }
    }, [user, navigate])

    return (
        <div className="dashboard">
            <NewTodo />
            
            <div className="todos">
                {incompleteTodos.map(item => (
                    <TodoCard key={item._id} todo={item} />
                ))}
            </div>

            {
                completeTodos.length > 0 &&
                <div className="todos">
                    <h2 className="todos__title">Complete Todo's</h2>
                    {completeTodos.map(item => (
                        <TodoCard key={item._id} todo={item} />
                    ))}
                </div>
            }
        </div>
    )
}

export default Dashboard