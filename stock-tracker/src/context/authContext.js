import { createContext, useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('user') || null));
  const navigate = useNavigate();

  const getAuthToken = async () => {
    if (!currentUser) {
      console.log("This is !currentUser")
      // navigate('/login');
    }

    // Retrieve the token from currentUser
    const token = currentUser?.token;

    if (!token) {
      console.log("No token found in currentUser");
      return null; // Handle this case as needed
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    try {
      console.log("WE are in the try statement")
      console.log({headers});
      // get the user profile with the token generated when they had logged in
      // const res = await axios.get('/api/users/me', {headers});
      const res = await axios.get("https://stocktrackerapi.onrender.com/api/users/me", {headers});
      // if the response is successful, meaning the auth token is valid return the headers
      return {headers};
    } catch (error) {
      if (error.response.status === 401) {
        console.log("error 401 here")
        if (window.location.pathname !== '/register') { // add this line to check if the current page is not already the register page
          navigate('/login');
        }
      }
      throw error; // re-throw any other errors
    }
  };

    const login = async(inputs) => {
        // const res = await axios.post("/api/auth/login", inputs);
        const res = await axios.post("https://stocktrackerapi.onrender.com/api/auth/login", inputs);
        setCurrentUser(res.data);
        sessionStorage.setItem('user', JSON.stringify(res.data));
    }

    const logout = async(inputs) => {
      await axios.post("https://stocktrackerapi.onrender.com/api/auth/logout");
      // await axios.post("/api/auth/logout");
      setCurrentUser(null);
    }

    useEffect(() => {
      sessionStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser, getAuthToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
