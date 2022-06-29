import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalContext'
import { useEffect } from 'react'

const AuthBox = ({ register }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const {getCurrentUser, user} = useGlobalContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(user && navigate) {
            navigate("/dashboard")
        }
    }, [user, navigate])

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let data = {}

        if(register) {
            data = {
                name,
                email,
                password,
                confirmPassword,
            }
        } else {
            data = {
                email,
                password
            }
        }

        axios.post(register ? "/api/auth/register" : "/api/auth/login", data)
            .then(() => {
                getCurrentUser()
            })
            .catch(err => {
                setLoading(false);
                if(err?.response?.data) {
                    setErrors(err.response.data)
                }
            })
    }

    return (
        <div className="auth">
            <div className="auth__box">
                <div className="auth__header">
                    <h1>{register ? "Register" : "Login"}</h1>
                </div>
                <form onSubmit={onSubmit}>
                    {register && (
                        <div className="auth__field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
                            {errors.name && <p className='auth__error'>{errors.name}</p>}
                        </div>
                    )}

                    <div className="auth__field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                        {errors.email && <p className='auth__error'>{errors.email}</p>}
                    </div>

                    <div className="auth__field">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                        {errors.password && <p className='auth__error'>{errors.password}</p>}
                    </div>

                    {register && (
                        <div className="auth__field">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            {errors.confirmPassword && <p className='auth__error'>{errors.confirmPassword}</p>}
                        </div>
                    )}

                    <div className="auth__footer">
                        {Object.keys(errors).length > 0 && <p className="auth__error">Something went wrong</p>}
                        
                        <button className="btn" type="submit" disabled={loading}>{register ? "Register" : "Login"}</button>
                        {
                            !register ?
                                <div className="auth__register">
                                    <p>Not a member? <Link to="/register">Register now</Link></p>
                                </div> :
                                <div className="auth__register">
                                    <p>Already a member? <Link to="/register">Login now</Link></p>
                                </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthBox