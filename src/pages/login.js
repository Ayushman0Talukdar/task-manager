import { use, useEffect, useState } from "react";
import api from "../api/axios";
// import "../components/componentsStyles/components.css"
import { NavLink, useNavigate } from "react-router-dom"


const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [tokens, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
        navigate("/")
        } else {
            console.log("No token found, redirecting to login...");
            // Optional: navigate("/login") if you want to protect this page
        }
    }, []);
    // const { login } = useAuth()
    const tokenId = () => {
        localStorage.setItem("token", tokens)
    }


    const handleSumit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post("/auth/login", { email, password })
            const receivedToken = res.data.token // Grab it directly
            
            setToken(receivedToken)
            localStorage.setItem("token", receivedToken) // Store it directly
            
            navigate("/") 
        } catch(err){
            alert(err.response?.data?.message || "Error")
        }
    }
    

    return(
        <div className="Login">
            <div className="pattern"></div>
            <form onSubmit={handleSumit} className="loginForm roboto">
                <h1 className="LoginTitle">login</h1>
                <input placeholder="Email" onChange={e => setEmail((e.target.value))} required={true}></input>
                <input placeholder="Password" onChange={e => setPassword((e.target.value))} required={true}></input>
                <div className="sbmbtn"><div>Don't have an account? <span><NavLink to={'/register'} className={'NavLink'}>Register</NavLink></span></div><button type="submit" className="loginSbmbtn">login</button></div>
            </form>
        </div>
    )
}

export default Login

