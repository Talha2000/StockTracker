import React, { useContext } from 'react'
import { ThemeContext } from '../../context/themeContext'

const Card = ({ children }) => {
  const {darkMode} = useContext(ThemeContext);

  return (
    <div className={`w-full h-full rounded-md relative p-2 border-2
                    ${darkMode ? "border-cyan-400 " : "border-black"}`}>
      {children}
    </div>
  )
}

export default Card