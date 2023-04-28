import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
// import "../../styles.scss"
import "./navbar.scss"
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

// import {AiOutlineHome} from 'react-icons/ai'
// import {AiOutlineUser} from 'react-icons/ai'
// import {BiBook} from 'react-icons/bi'
// import {MdWork} from 'react-icons/md'
// import {BiMessageDetail} from 'react-icons/bi'
import {useState} from 'react'

export const NavBar = () => {

  const {currentUser, logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const defaultPage = () => {
    navigate(`/StockTrackerMain/:stockName`)  
  }

  const [activeNav, setActiveNav] = useState('/META');
  return (
    <nav className='navbar'>
      <div className="container">
        <div className="links">
            {/* <Link className='link' to="/">
              Home
            </Link> */}
          <Link className='link' to="/META" onClick={defaultPage}>
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
      </div>
    </nav>
  )
}

export default NavBar