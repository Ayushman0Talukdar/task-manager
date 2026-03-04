import {createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null)

    const login = (token) => {
        localStorage.setItem("token", token)
        setUser(true)
    }
    
    const logout = (token) => {
        localStorage.removeItemItem("token")
        setUser(null)
    }

    return (
    <AuthContext.Provider value={{ user, login, logout}}>
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)