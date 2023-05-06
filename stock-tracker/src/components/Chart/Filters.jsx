import React, { useContext } from 'react'
import { ThemeContext } from '../../context/themeContext';

const Filters = ({text, active, onClick}) => {
  const {darkMode} = useContext(ThemeContext);
  return (
    <button onClick={onClick} 
    className={`w-12 mr-2 h-8 border-1 rounded flex items-center justify-center cursor-pointer
               ${active ? "bg-gray-200 border-white text-black" : "border-cyan-300 text-black"}
               ${darkMode ? "bg-cyan-300 border-cyan-400 text-black hover:bg-cyan-800 hover:text-white "  : 
               (active ? "bg-gray-200 border-black text-black hover:bg-neutral-400 hover:text-black" : 
               "bg-black border-white text-white hover:bg-neutral-400 hover:text-black")}`}>
        {text}
    </button>
  );
};

export default Filters