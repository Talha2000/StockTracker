import React, { useContext } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { ThemeContext } from '../context/themeContext'

const Login = () => {
  const { darkMode } = useContext(ThemeContext);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  const [err, setError] = useState(null)

  const navigate = useNavigate();

  const {login} = useContext(AuthContext);

  const handleChange = (e) => {
    // ...prev basically takes the entire current state object
    // e.target.name checks for which parameter is being changed
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // await axios.post("/auth/login", inputs);
      await login(inputs);
      navigate('/META');
    }
    catch (err) {
      setError(err.response.data)
    }
  }
  console.log(inputs)


  return (
    
    <div className={`w-full h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0 
                    ${darkMode ? "bg-gray-900 ease-in duration-200" : "bg-neutral-100 ease-in duration-200"}`}>
      <div className="p-20 bg-gray-800 border-gray-900 rounded-lg shadow">
        <form className="flex flex-col align-center justify-items-center">
          <h1 className="pb-8 text-3xl text font-bold text-white">Sign in to your account</h1>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username: </label>
          <input className="block w-full p-2.5 mb-8 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder='username' name='username' onChange={handleChange}/>

          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password:</label>
          <input className="block w-full p-2.5 mb-8 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder='password' name='password' onChange={handleChange}/>

          <button className="mb-3 inline-block w-full rounded-lg  px-5 py-2.5 text-center hover:bg-cyan-700 focus:ring-4 focus:outline-none text-lg font-medium leading-normal text-white bg-sky-600" onClick={handleSubmit}>Sign in</button>
          {err && <p className='text-red-400 pl-14'>{err}</p>}
          <span className="text-white">Don't have an account? 
          <Link to="/register" className="text-cyan-300"> Sign up </Link>
          </span>
        </form>
      </div>
      
    </div>
  )
}

export default Login