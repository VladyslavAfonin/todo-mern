import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

// initial state
const initialState = {
    user: null,
    fetchingUser: true,
    completeTodos: [],
    incompleteTodos: []
}

const globalReducer = (state, action) => {
    switch(action.type) {
        case "SET_USER": 
            return {
                ...state,
                user: action.payload,
                fetchingUser: false
            }
        case "SET_COMPLETE_TODOS":
            return {
                ...state,
                completeTodos: action.payload
            }
        case "SET_INCOMPLETE_TODOS":
            return {
                ...state,
                incompleteTodos: action.payload
            }
        case "RESET_USER":
            return {
                ...state,
                user: null,
                fetchingUser: false,
                completeTodos: [],
                incompleteTodos: []
            }
        default: 
            return state;
    }
}

// create context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(globalReducer, initialState)

    useEffect(() => {
        getCurrentUser();
    }, [])

    // get current user
    const getCurrentUser = async () => {
        try {
            const res = await axios.get("/api/auth/current");
            if(res.data) {
                const todoRes = await axios.get("/api/todos/current");

                if(todoRes.data) {
                    dispatch({type: "SET_USER", payload: res.data});
                    dispatch({type: "SET_COMPLETE_TODOS", payload: todoRes.data.complete})
                    dispatch({type: "SET_INCOMPLETE_TODOS", payload: todoRes.data.incomplete})
                }
            } else {
                dispatch({type: "RESET_USER"})
            }
        } catch (err) {
            console.log(err);
            dispatch({type: "RESET_USER"})
        } 
    }

    const logout = async () => {
        try {
            await axios.put("/api/auth/logout")
            dispatch({type: "RESET_USER"})
        } catch (err) {
            console.log(err)
            dispatch({type: "RESET_USER"})
        }
    }

    const addTodo = (todo) => {
        dispatch({type: "SET_INCOMPLETE_TODOS", payload: [todo, ...state.incompleteTodos]})
    }

    const todoComplete = (todo) => {
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: state.incompleteTodos.filter(item => item._id !== todo._id)
        })
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: [todo, ...state.completeTodos]
        })
    }

    const todoIncomplete = (todo) => {
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: state.completeTodos.filter(item => item._id !== todo._id)
        })

        const newIncompleteTodos = [todo, ...state.incompleteTodos];

        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        })
    }

    const removeTodo = (todo) => {
        if(todo.complete) {
            dispatch({
                type: "SET_COMPLETE_TODOS",
                payload: state.completeTodos.filter(item => item._id !== todo._id)
            })
        } else {
            dispatch({
                type: "SET_INCOMPLETE_TODOS",
                payload: state.incompleteTodos.filter(item => item._id !== todo._id)
            })
        }
    }

    const updateTodo = (todo) => {
        if (todo.complete) {
            const newCompleteTodos = state.completeTodos.map(item => item._id !== todo._id ? item : todo)

            dispatch({
                type: "SET_COMPLETE_TODOS",
                payload: newCompleteTodos
            })
        } else {
            const newIncompleteTodos = state.incompleteTodos.map(item => item._id !== todo._id ? item : todo)

            dispatch({
                type: "SET_INCOMPLETE_TODOS",
                payload: newIncompleteTodos
            })
        }
    }

    const value = {
        ...state,
        getCurrentUser,
        logout,
        addTodo,
        todoComplete,
        todoIncomplete,
        removeTodo,
        updateTodo
    }

    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}