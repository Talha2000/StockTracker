import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));
    // const [userId, setUserId] = useState(JSON.parse(localStorage.getItem("id") || null));

    const login = async(inputs) => {
        const res = await axios.post("/auth/login", inputs);
        setCurrentUser(res.data);
    }

    const logout = async(inputs) => {
        await axios.post("/auth/logout");
        setCurrentUser(null);
    }

    useEffect(() => {
       localStorage.setItem("user", JSON.stringify(currentUser));
    //    localStorage.setItem("id", JSON.stringify(userId));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
