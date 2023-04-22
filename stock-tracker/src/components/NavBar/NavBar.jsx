import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
// import "../../styles.scss"
import "./navbar.scss"
import { AuthContext, logout } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
export const NavBar = () => {

  const {currentUser, logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const defaultPage = () => {
    navigate(`/${'META'}`)  
  }

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