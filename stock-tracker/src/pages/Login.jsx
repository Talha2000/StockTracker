import React, { useContext } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { ThemeContext } from '../context/themeContext'

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const [Loading, setLoading] = useState(false);

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
    setLoading(true);
    e.preventDefault()
    try {
      // await axios.post("/auth/login", inputs);
      const res = await login(inputs);
      if (res.ok) {
        navigate('/META');
        setLoading(false);
      } else {
        setError("Incorrect Credentials")
        setLoading(false);
      }
    }
    catch (err) {
      setError("Failed to Login")
      setLoading(false);
    }
  }

  return (
    
    <div className={`w-full h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0 
                    ${darkMode ? "bg-gray-900 ease-in duration-200" : "bg-neutral-100 ease-in duration-200"}`}>
      <div className={`p-20  rounded-lg shadow-2xl
                      ${darkMode ? "bg-gray-800 border-gray-900" : "bg-black"}`}>
        <form className="flex flex-col align-center justify-items-center">
          <h1 className="pb-8 text-3xl text font-bold text-white">Sign in to your account</h1>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username: </label>
          <input className="block w-full p-2.5 mb-8 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder='username' name='username' onChange={handleChange}/>

          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password:</label>
          <input className="block w-full p-2.5 mb-8 border border-gray-600 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="password" placeholder='password' name='password' onChange={handleChange}/>

          {Loading ? (
            <div role="status" className="flex justify-center items-center pb-4">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button className="mb-3 inline-block w-full rounded-lg  px-5 py-2.5 text-center hover:bg-cyan-700 focus:ring-4 focus:outline-none text-lg font-medium leading-normal text-white bg-sky-600" 
                    onClick={handleSubmit}>
                    Sign in
            </button>
          )}
    
          {err && <p className='text-red-400 flex justify-center'>{err}</p>}
          <span className="text-white">Don't have an account? 
          <Link to="/register" className="text-cyan-300"> Sign up </Link>
          </span>
        </form>
      </div>
      
    </div>
  )
}

export default Login