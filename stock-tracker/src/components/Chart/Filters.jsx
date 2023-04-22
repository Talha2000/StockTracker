import React from 'react'

const Filters = ({text, active, onClick}) => {
  return (
    <button onClick={onClick} 
    className={`w-12 m-2 h-8 border-1 rounded flex items-center justify-center cursor-pointer bg-cyan-300 border-cyan-400 text-black 
               ${active ? "bg-gray-200 border-white text-black" : "border-cyan-300 text-black"}`}>
        {text}
    </button>
  );
};

export default Filters