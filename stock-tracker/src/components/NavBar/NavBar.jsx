import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import "./navbar.scss"
import { AuthContext } from '../../context/authContext'
import { StockContext } from '../../context/stockContext'
import { useNavigate } from 'react-router-dom'
// import { StockContext } from '../../context/stockContext'
import ThemeButton from '../ThemeButton/ThemeButton'

export const NavBar = () => {
  const {stockList, getStocks} = useContext(StockContext);
  const {currentUser, logout} = useContext(AuthContext);
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
    <nav className='navbar'>
      <div className="container">
        <div className="links">
          <Link className='link' to={`/${stockList[0]?.stockName}`}>
              Dashboard
          </Link>

          <Link className='link' to="/Portfolio">
              Portfolio
          </Link>

          {currentUser ? (
            <Link className='link' to="/login" onClick={logout}>Logout</Link>
            ) : (
              <Link className='link' to="/login">Login</Link>
              )}
            
        </div>
        <div>
        <ThemeButton/>
        </div>
      </div>
    </nav>
    
  )
}

export default NavBar