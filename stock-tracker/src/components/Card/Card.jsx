import React from 'react'

const Card = ({ children }) => {
  return (
    <div className='w-full h-full rounded-md relative p-2 border-1 border-cyan-400'>
      {children}
    </div>
  )
}

export default Card