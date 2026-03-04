import { use, useState } from "react";
import api from "../api/axios.js";
import Login from "./login.js";
import { Link, NavLink } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSumit = async (e) => {
        console.log("submitting")
        e.preventDefault()
        try {
            await api.post("api/auth/register", { email, password })
            alert("registered successfully")
        } catch(err){
            alert(err.response?.data?.message || "Error")
        }
    }

    return(
        <div className="Login">
            <form onSubmit={handleSumit} className="loginForm roboto">
                <h1>Register</h1>
                <input placeholder="Email" onChange={e => setEmail((e.target.value))} required={true}></input>
                <input placeholder="Password" onChange={e => setPassword((e.target.value))} required={true}></input>
                <div className="sbmbtn"><div>Don't have an account? <span><NavLink to={'/login'} className={'NavLink'}>Register</NavLink></span></div><button type="submit" className="loginSbmbtn">Register</button></div>
            </form>
        
        </div>
    )
}

export default Register

