import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import "./navbar.scss"
import { AuthContext } from '../../context/authContext'
import { StockContext } from '../../context/stockContext'
import { useNavigate } from 'react-router-dom'
// import { StockContext } from '../../context/stockContext'
import ThemeButton from '../ThemeButton/ThemeButton'
import { ThemeContext } from '../../context/themeContext'

export const NavBar = () => {
  const {stockList, getStocks} = useContext(StockContext);
  const {currentUser, logout} = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  // const { stockSymbol } = useContext(StockContext)
  const navigate = useNavigate();
  const [value, setValue] = useState();

  useEffect(() => {
      const getList = async () => {
        const val = await getStocks();
        setValue(val);
        console.log(val);
      }
      getList();
  }, [navigate])

  
// the ? is a optional chaining operator if object is undefined or null, doesnt take the value

  // const [activeNav, setActiveNav] = useState('/META');
  return (
    <nav className={`fixed w-full z-20 top-0 left-0 
                    ${darkMode ? "bg-gray-900 " : "bg-black"}`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      {/* <a href="https://flowbite.com/" class="flex items-center"> */}
          {/* <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo"/> */}
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">StockTracker</span>
      {/* </a> */}
      <div className="flex md:order-2">
          <ThemeButton/>
          <p>Version 1.0</p>
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>

      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <ul className={`flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0
                       
                      ${darkMode ? "" : ""}`}>
          <li>
            <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
            <Link to={`/${stockList[0]?.stockName}`}>
               DashBoard
            </Link>
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              <Link to="/Portfolio">
              Portfolio
              </Link>
            </a>
          </li>

          <li>
            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          {/* <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> */}
          {currentUser ? (
             <Link className='link' to="/login" onClick={logout}>Logout</Link>
              ) : (
              <Link className='link' to="/login">Login</Link>
            )}
          {/* </button> */}
            </a>
          </li>
        </ul>
      </div>
      
      </div>
    </nav>



  )
}

export default NavBar

        {/* // <nav className={`${darkMode ? "navbar" : "lightModeNavbar"}`}>
    //   <div className="container">
    //     <div className="links">
    //       <Link className='link' to={`/${stockList[0]?.stockName}`}>
    //           Dashboard
    //       </Link>

    //       <Link className='link' to="/Portfolio">
    //           Portfolio
    //       </Link>

    //       {currentUser ? (
    //         <Link className='link' to="/login" onClick={logout}>Logout</Link>
    //         ) : (
    //           <Link className='link' to="/login">Login</Link>
    //           )}
            
        </div>
        <div>
        <ThemeButton/>
        </div>
     </div>
  </nav> */}